from rest_framework import serializers
from booking.models import Ticket

class TicketSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ticket
        fields = ['id', 'show', 'user', 'ticket_price', 'service_fee', 'seats', 'dollars', 'reward_points', 'status', 'created_at']

    def create(self, validated_data):
        ticket = Ticket.objects.create(**validated_data)
        return ticket
