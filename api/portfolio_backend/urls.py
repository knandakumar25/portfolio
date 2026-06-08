from django.urls import path

from contact import contact_view


urlpatterns = [
    path('api/contact', contact_view, name='contact'),
]