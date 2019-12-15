from django.urls import path
from django.conf.urls import url
from . import views,solvecube

urlpatterns = [
    path('', views.index, name='index'),
    url(r'^solve$', solvecube.solve),
    url(r'^challenge$', solvecube.challenge),

]