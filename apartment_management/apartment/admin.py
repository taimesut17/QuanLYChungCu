from django.contrib import admin
from django.template.response import TemplateResponse
from . import models
from django.urls import path






class MyApartmentAdminSite(admin.AdminSite):
    site_header = 'ApartmentManagement'

    def get_urls(self):
        return [path('stats/', self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        return TemplateResponse(request, 'admin/stats.html')


admin_site = MyApartmentAdminSite(name='MyApartment')


# Register your models here.
admin_site.register(models.User)
admin_site.register(models.Item)
admin_site.register(models.Locker)
admin_site.register(models.Room)
admin_site.register(models.Contract)
admin_site.register(models.Service)
admin_site.register(models.Invoice)
admin_site.register(models.Relative)
admin_site.register(models.SurveyForm)
admin_site.register(models.Question)
admin_site.register(models.Complaint)
admin_site.register(models.ResponseForm)


