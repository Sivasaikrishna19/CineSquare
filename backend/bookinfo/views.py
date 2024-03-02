from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from booking.models import Ticket
from shows.models import Show
from account.serializers import SignUpSerializer, UserSerializer
from booking.serializers import TicketSerializer
from theater.serializers import TheaterOutputSerializer
from movie.serializers import MovieSerializer
from backend.settings import SERVICE_FEE
from account.models import User
from django.utils import timezone
from account.auth import APIAccessAuthentication

class CreateTicketAPI(APIView):
    def post(self, request):
        received_data = request.data
        try:
            selected_show = Show.objects.get(id=received_data["show"])
        except Show.DoesNotExist:
            return Response({'error': 'Show ID not valid'}, status=status.HTTP_404_NOT_FOUND)
        try:
            account_user = User.objects.get(id=received_data["user"])
        except User.DoesNotExist:
            return Response({'error': 'User ID not valid'}, status=status.HTTP_404_NOT_FOUND)
        
        cash_payment = received_data.get("dollars", 0)
        points_payment = received_data.get("reward_points", 0) / 100
        if cash_payment + points_payment != received_data.get("ticket_price", 0) + received_data.get("service_fee", 0):
            return Response({"error": "Payment incomplete"}, status=status.HTTP_400_BAD_REQUEST)
        if len(received_data.get("seats", [])) > 8:
            return Response({"error": "Max 8 tickets per booking allowed"}, status=status.HTTP_400_BAD_REQUEST)
        for seat_num in received_data["seats"]:
            if seat_num in selected_show.seat_matrix:
                return Response({"error": f"Seat {seat_num} is already taken"}, status=status.HTTP_400_BAD_REQUEST)
        selected_show.seat_matrix += received_data["seats"]
        selected_show.seat_matrix.sort()
        selected_show.save()
        received_data["show"] = selected_show
        received_data["user"] = account_user
        received_data["status"] = Ticket.CONFIRMED
        new_ticket = Ticket.objects.create(**received_data)
        movie_info = MovieSerializer(selected_show.movie)
        theater_info = TheaterOutputSerializer(selected_show.theater)
        ticket_info = TicketSerializer(new_ticket).data
        ticket_info["movie"] = movie_info.data
        ticket_info["theater"] = theater_info.data
        account_user.rewardPoints += int(ticket_info["dollars"])
        account_user.save()
        ticket_info["user"] = {
            "success": True,
            "id": account_user.id,
            "token": APIAccessAuthentication.generate_jwt_token(account_user),
            "email": account_user.email,
            "role": account_user.role,
            "username": account_user.username,
            "phoneNumber": str(account_user.phoneNumber),
            "is_admin": account_user.is_admin,
            **UserSerializer(instance=account_user).data,
        }
        return Response({"ticket": ticket_info})

class RetrieveTicketAPI(APIView):
    def get(self, self_request, id_of_ticket):
        try:
            acquired_ticket = Ticket.objects.get(id=id_of_ticket)
            serializer_for_movie = MovieSerializer(acquired_ticket.show.movie)
            serializer_for_theater = TheaterOutputSerializer(acquired_ticket.show.theater)
            data_for_ticket = TicketSerializer(acquired_ticket).data
            data_for_ticket["movie"] = serializer_for_movie.data
            data_for_ticket["theater"] = serializer_for_theater.data
            return Response({"ticket": data_for_ticket})
        except Ticket.DoesNotExist:
            return Response({'message': 'No ticket found'}, status=status.HTTP_404_NOT_FOUND)

class CancelTicketAPI(APIView):
    def patch(self, request_body, id_of_ticket):
        try:
            found_ticket = Ticket.objects.get(id=id_of_ticket)
            associated_show = found_ticket.show
            if associated_show.show_timing > timezone.now():
                return Response({"error": "Show has begun or ended, ticket cancellation not possible"}, status=status.HTTP_400_BAD_REQUEST)
            serializer_for_movie = MovieSerializer(found_ticket.show.movie)
            serializer_for_theater = TheaterOutputSerializer(found_ticket.show.theater)
            ticket_holder = found_ticket.user
            ticket_holder.rewardPoints -= int(found_ticket.dollars)
            ticket_holder.save()
            found_ticket.status = Ticket.CANCELLED
            found_ticket.save()
            updated_show = found_ticket.show
            updated_show.seat_matrix = [seat for seat in updated_show.seat_matrix if seat not in found_ticket.seats]
            updated_show.save()
            data_for_ticket = TicketSerializer(found_ticket).data
            data_for_ticket["movie"] = serializer_for_movie.data
            data_for_ticket["theater"] = serializer_for_theater.data
            return Response({"ticket": data_for_ticket})
        except Ticket.DoesNotExist:
            return Response({'message': 'Ticket could not be located'}, status=status.HTTP_404_NOT_FOUND)
