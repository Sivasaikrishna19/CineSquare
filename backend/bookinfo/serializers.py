from rest_framework import serializers
from booking.models import Ticket

class ReservationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ticket
        fields = ['id', 'performance', 'attendee', 'price', 'fee', 'seat_numbers', 'payment_amount', 'points_used', 'current_status', 'date_created']

    def save_reservation(self, valid_data):
        reservation = Ticket.objects.create(**valid_data)
        return reservation
