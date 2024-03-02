from django.db import models
from theater.models import Theater
from movie.models import Movie
from shows.models import Show
from account.models import User
from common.models import BaseModel

class Ticket(BaseModel):
    CONFIRMED = 'confirmed'
    CANCELLED = 'cancelled'
    STATUS_CHOICES = [(CONFIRMED, 'Confirmed'), (CANCELLED, 'Cancelled')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    show = models.ForeignKey(Show, on_delete=models.CASCADE)
    ticket_price = models.FloatField(blank=True, null=True)
    service_fee = models.FloatField(blank=True, null=True)
    seats = models.JSONField(default=list)
    status = models.CharField(choices=STATUS_CHOICES, default=CONFIRMED)
    dollars = models.FloatField(blank=True, null=True)
    reward_points = models.IntegerField(blank=True, null=True)
    def __str__(self):
        return f"{self.id}   -   {self.show}   -   {self.ticket_price}"