from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('users', views.UserViewSet)
router.register('items', views.ItemViewSet)
router.register('lockers', views.LockerViewSet)
router.register('rooms', views.RoomViewSet)
router.register('contracts', views.ContractViewSet)
router.register('services', views.ServiceViewSet)
router.register('invoices', views.InvoiceViewSet)
router.register('relatives', views.RelativeViewSet)
router.register('survey_forms', views.SurveyFormViewSet)
router.register('questions', views.QuestionViewSet)
router.register('complaints', views.ComplaintViewSet)
router.register('response_forms', views.ResponseFormViewSet)


urlpatterns = [
    path('', include(router.urls)),
]