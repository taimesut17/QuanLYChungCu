from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField



# Create your models here.

class MyBaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class User(AbstractUser):
    class RoleChoices(models.TextChoices):
        ADMIN = 'ADMIN', 'Quản trị viên'
        RESIDENT = 'RESIDENT', 'Cư dân'

    avatar= CloudinaryField(null=True, blank=True)
    role = models.CharField(max_length=20,choices=RoleChoices.choices,default=RoleChoices.RESIDENT)

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'ADMIN'
        elif self.role == 'ADMIN' and not self.is_superuser:
            self.role = 'RESIDENT'
        super().save(*args, **kwargs)

class Item(MyBaseModel):
    class StatusChoices(models.TextChoices):
        PENDING = 'PENDING', 'Chưa nhận'
        RECEIVED = 'RECEIVED', 'Đã nhận'

    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    name = models.CharField(max_length=100)
    received_at = models.DateTimeField(null=True, blank=True)
    image = CloudinaryField(null=True, blank=True)

    looker = models.ForeignKey('Locker',on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return f"Tủ đồ của {self.name} - ({self.get_status_display()})"

class Locker(MyBaseModel):
    resident = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE, related_name='locker')

    def __str__(self):
        return f"Tủ đồ của {self.resident}"

class Room(MyBaseModel):
    name = models.CharField(max_length=20)
    floor = models.IntegerField()
    number = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=0)

    resident = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rooms", null=True, blank=True, default=None)

    class Meta:
        unique_together = ("floor", "number")  # Một tầng không có phòng trùng số

    def __str__(self):
        return f"Phòng {self.floor} - {self.number}"

class Contract(MyBaseModel):
    contract_date = models.DateTimeField()
    contract_expiry_date = models.DateTimeField()
    deposit = models.DecimalField(max_digits=10, decimal_places=0) # tiền đặt cọc

    room = models.ForeignKey(Room,on_delete=models.CASCADE, related_name="contracts")
    resident = models.ForeignKey(User,on_delete=models.CASCADE, related_name="contracts")

class Service(MyBaseModel):
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    description = RichTextField()

    def __str__(self):
        return f"{self.name} - {self.amount} VND"

class Payment(MyBaseModel):
    class PaymentMethodsChoices(models.TextChoices):
        BANK_TRANSFER = 'BANK_TRANSFER', 'Chuyển khoản ngân hàng'
        MOMO_PAY = 'MOMO_PAY', 'Thanh toán qua Momo Pay'
        VNPAY = 'VNPAY', 'Thanh toán qua VNPay'
        OTHER = 'OTHER', 'Thanh toán qua cổng khác'

    class PaymentStatusChoices(models.TextChoices):
        PENDING = 'PENDING', 'Đang xử lí'
        COMPLETED = 'RECEIVED', 'Thành công'

    resident = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')


    def __str__(self):
        return f"Thanh toán của {self.resident.get_full_name()} vào {self.created_date.date()}"

class Invoice(MyBaseModel):
    class StatusChoices(models.TextChoices):
        PENDING = 'PENDING', 'Đang xử lí'
        COMPLETED = 'COMPLETED', 'Thành công'
        FAILED = 'FAILED', 'Thất bại'


    resident = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices', null=False)
    total_amount = models.DecimalField(max_digits=10, decimal_places=0)
    services = models.ManyToManyField(Service, related_name='invoices')

    # payment_amount = models.DecimalField(max_digits=10, decimal_places=0)
    payment_status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    payment_proof = CloudinaryField(null=True, blank=True)
    payment_completed_datetime = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Hoá đơn của {self.resident.get_full_name()} vào {self.created_date.date()}"

class Relative(MyBaseModel):
    first_name = models.CharField( max_length=150, blank=True)
    last_name = models.CharField( max_length=150, blank=True)

    resident = models.ForeignKey(User,on_delete=models.CASCADE,related_name="relatives")



class Complaint(MyBaseModel):
    header = models.CharField(max_length=150, null=False, blank=False)
    content = RichTextField()
    resident = models.ForeignKey(User,on_delete=models.CASCADE,related_name="complaints_resident")
    admin = models.ForeignKey(User,on_delete=models.CASCADE,related_name="complaints_admin")

class SurveyForm(MyBaseModel):
    header = models.CharField(max_length=150)
    admin = models.ForeignKey(User,on_delete=models.CASCADE,related_name="survey_forms")


class Question(MyBaseModel):
    question = models.CharField(max_length=150)
    survey_form = models.ForeignKey(SurveyForm, on_delete=models.CASCADE, related_name="questions")



class ResponseForm(MyBaseModel):
    resident = models.ForeignKey(User,on_delete=models.CASCADE,related_name="responses")
    survey_form = models.ForeignKey(SurveyForm, on_delete=models.CASCADE, related_name="responses")
    question = models.ForeignKey(Question,on_delete=models.CASCADE,related_name="responses")
    answer = RichTextField()

    class Meta:
        unique_together = ("resident", "survey_form", "question")
