from django.urls import path
from booking.views import CreateTicketAPI, RetrieveTicketAPI, CancelTicketAPI

urlpatterns = [
    path("reservation/create", CreateTicketAPI.as_view(), name="create-reservation-api"),
    path("reservation/retrieve/<int:reservation_id>", RetrieveTicketAPI.as_view(), name="retrieve-reservation-api"),
    path("reservation/void/<int:reservation_id>", CancelTicketAPI.as_view(), name="void-reservation-api"),
]
