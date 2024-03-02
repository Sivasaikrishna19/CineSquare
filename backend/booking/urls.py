from django.urls import path
from booking.views import TicketCreateAPI, TicketGetAPI, TicketCancelAPI

urlpatterns = [
    path("ticket", TicketCreateAPI.as_view(), name="ticket-create-api"),
    path("ticket/<int:ticket_id>", TicketGetAPI.as_view(), name="ticket-get-api"),
    path("ticket/cancel/<int:ticket_id>", TicketCancelAPI.as_view(), name="ticket-cancel-api"),
]
