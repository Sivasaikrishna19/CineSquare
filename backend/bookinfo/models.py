from django.db import models
from theater.models import Theater
from movie.models import Movie
from shows.models import Show
from account.models import User
from common.models import BaseModel

class Reservation(BaseModel):
    BOOKED = 'booked'
    VOID = 'void'
    RESERVATION_STATUS = [(BOOKED, 'Booked'), (VOID, 'Void')]
    attendee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    performance = models.ForeignKey(Show, on_delete=models.CASCADE, related_name='reservations')
    price = models.FloatField(blank=True, null=True)
    additional_fee = models.FloatField(blank=True, null=True)
    seat_selections = models.JSONField(default=list)
    current_status = models.CharField(choices=RESERVATION_STATUS, default=BOOKED, max_length=50)
    payment_amount = models.FloatField(blank=True, null=True)
    points = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"Reservation {self.id} - {self.performance} - {self.price}"
