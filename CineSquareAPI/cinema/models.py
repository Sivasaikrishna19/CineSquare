from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    MEMBER = 'member'
    NON_MEMBER = 'non_member'
    EMPLOYEE = 'employee'
    USER_TYPE_CHOICES = [
        (MEMBER, 'Member'),
        (NON_MEMBER, 'Non-Member'),
        (EMPLOYEE, 'Theater Employee'),
    ]
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default=NON_MEMBER)
    rewards_points = models.IntegerField(default=0)
    membership_type = models.CharField(max_length=10, choices=[('regular', 'Regular'), ('premium', 'Premium')], null=True, blank=True)

class Movie(models.Model):
    title = models.CharField(max_length=255)
    duration = models.DurationField()
    release_date = models.DateField()

class Theater(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    movies = models.ManyToManyField(Movie)
    technologies = models.CharField(max_length=255, blank=True, null=True)
    seatingCategories = models.CharField(max_length=255, blank=True, null=True)
    cuisines = models.CharField(max_length=255, blank=True, null=True)

    def get_movies_as_list(self):
        return self.movies.split(',') if self.movies else []

    def set_movies_from_list(self, movies_list):
        self.movies = ','.join(movies_list)

    def set_technologies(self, technologies_list):
        self.technologies = ','.join(technologies_list)

    def get_technologies(self):
        return self.technologies.split(',') if self.technologies else []

    def set_seating_categories(self, categories_list):
        self.seatingCategories = ','.join(categories_list)

    def get_seating_categories(self):
        return self.seatingCategories.split(',') if self.seatingCategories else []

    def set_cuisines(self, cuisines_list):
        self.cuisines = ','.join(cuisines_list)

    def get_cuisines(self):
        return self.cuisines.split(',') if self.cuisines else []

class Show(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)
    show_time = models.DateTimeField()
    available_seats = models.IntegerField()
    price = models.FloatField()
    seats_booked = models.JSONField(default=list)

class Ticket(models.Model):
    show = models.ForeignKey(Show, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    num_seats = models.IntegerField()
    total_price = models.FloatField()
    seats = models.JSONField(default=list) # array of seat strings
