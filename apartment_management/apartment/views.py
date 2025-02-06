from datetime import datetime

import cloudinary
from django.shortcuts import render
from django.http import HttpResponse
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions, status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.decorators import action

from . import models, serializers
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    parser_classes = [MultiPartParser, JSONParser]
    permission_classes = [permissions.IsAuthenticated]
    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(detail=True, methods=['patch'], url_path='change-password', permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request, pk=None):
        try:
            user = self.get_object()
            new_password = request.data.get('new_password')
            # Update the password
            user.set_password(new_password)
            user.save()

            return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': f'Error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)

    @action(detail=True, methods=['patch'], url_path='lock-users', permission_classes=[permissions.IsAuthenticated])
    def lock_users(self, request, pk=None):
        try:
            # Lấy đối tượng item dựa trên pk
            item = self.get_object()
            #khoá
            if item.is_active == True:
                item.is_active = False
            #mở khoá
            else:
                item.is_active = True

            item.updated_date = datetime.now()
            item.save()

            # Trả về phản hồi thành công
            return Response(
                {'item': serializers.UserSerializer(item).data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            # Nếu có lỗi không xác định, trả về lỗi server
            return Response(
                {'detail': f'Error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['patch'], url_path='upload-avatar')
    def upload_avatar(self, request, pk=None):
        try:
            # Ensure the request contains a file
            if 'avatar' not in request.FILES:
                return Response({'detail': 'No avatar provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Get the user object
            user = self.get_object()

            # Upload the image to Cloudinary
            avatar = request.FILES['avatar']
            upload_result = cloudinary.uploader.upload(avatar)

            # Get the URL of the uploaded image
            avatar_url = upload_result['secure_url']

            # Update the user with the new avatar URL
            user.avatar = avatar_url
            user.save()

            return Response(
                {'avatar': avatar_url},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'detail': f'Error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class ItemViewSet(viewsets.ModelViewSet):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer
    parser_classes = [MultiPartParser, ]

    permission_classes = [permissions.IsAuthenticated]
    # authentication_classes = [BasicAuthentication,
    #                           TokenAuthentication]
    @action(detail=True, methods=['patch'], url_path='set-received', permission_classes=[permissions.IsAuthenticated])
    def set_received(self, request, pk=None):
        try:
            # Lấy đối tượng item dựa trên pk
            item = self.get_object()

            # Cập nhật status thành "RECEIVED"
            if item.status == 'RECEIVED':
                return Response(
                    {'status': 'Item is already received'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            item.status = 'RECEIVED'  # Cập nhật status
            item.received_at = datetime.now()  # Lưu thời gian nhận vào trường received_at
            item.save()  # Lưu thay đổi

            # Trả về phản hồi thành công
            return Response(
                {'status': 'Item status updated successfully', 'item': serializers.ItemSerializer(item).data},
                status=status.HTTP_200_OK
            )
        except models.Item.DoesNotExist:
            return Response(
                {'detail': 'Item not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Nếu có lỗi không xác định, trả về lỗi server
            return Response(
                {'detail': f'Error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LockerViewSet(viewsets.ModelViewSet):
    queryset = models.Locker.objects.all()
    serializer_class = serializers.LockerSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=False, url_path='my-locker')
    def get_user_lockers(self, request):
        user = request.user
        user_locker = models.Locker.objects.filter(resident=user)
        serializer = self.get_serializer(user_locker, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class RoomViewSet(viewsets.ModelViewSet):
    queryset = models.Room.objects.all().order_by('id')
    serializer_class = serializers.RoomSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, resident_id):
        rooms = models.Room.objects.filter(resident_id=resident_id)

        serializer = serializers.RoomSerializer(rooms, many=True)
        return Response(serializer.data)


class ContractViewSet(viewsets.ModelViewSet):
    queryset = models.Contract.objects.all()
    serializer_class = serializers.ContractSerializer
    # permission_classes = [permissions.IsAuthenticated]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = models.Service.objects.all()
    serializer_class = serializers.ServiceSerializer
    # permission_classes = [permissions.IsAuthenticated]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = models.Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer
    # permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]

    @swagger_auto_schema(operation_description="Get user's invoices")
    @action(methods=['get'], detail=False, url_path='my-invoice')
    def get_user_invoices(self, request):
        user = request.user
        user_bills = models.Invoice.objects.filter(resident=user)
        serializer = self.get_serializer(user_bills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], url_path='upload-avatar')
    def upload_proof(self, request, pk=None):
        try:
            # Ensure the request contains a file
            if 'avatar' not in request.FILES:
                return Response({'detail': 'No avatar provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Get the user object
            user = self.get_object()

            # Upload the image to Cloudinary
            avatar = request.FILES['avatar']
            upload_result = cloudinary.uploader.upload(avatar)

            # Get the URL of the uploaded image
            avatar_url = upload_result['secure_url']

            # Update the user with the new avatar URL
            user.payment_proof = avatar_url
            user.save()

            return Response(
                {'avatar': avatar_url},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'detail': f'Error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class RelativeViewSet(viewsets.ModelViewSet):
    queryset = models.Relative.objects.all()
    serializer_class = serializers.RelativeSerializer
    parser_classes = [MultiPartParser]

    # permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], url_path='family', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_family(self, request):
        # Get the logged-in user
        user = request.user

        # Filter the relatives based on the user
        relatives = models.Relative.objects.filter(resident=user)

        # Serialize the data and return the response
        serializer = serializers.RelativeSerializer(relatives, many=True)
        return Response(serializer.data)

class SurveyFormViewSet(viewsets.ModelViewSet):
    queryset = models.SurveyForm.objects.all()
    serializer_class = serializers.SurveyFormSerializer
    # permission_classes = [permissions.IsAuthenticated]




class QuestionViewSet(viewsets.ModelViewSet):
    queryset = models.Question.objects.all()
    serializer_class = serializers.QuestionSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, survey_form_id):
        questions = models.Question.objects.filter(survey_form_id=survey_form_id)

        serializer = serializers.QuestionSerializer(questions, many=True)
        return Response(serializer.data)


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = models.Complaint.objects.all()
    serializer_class = serializers.ComplaintSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, admin_id):
        complaints = models.Complaint.objects.filter(admin_id=admin_id)

        serializer = serializers.ComplaintSerializer(complaints, many=True)
        return Response(serializer.data)


class ResponseFormViewSet(viewsets.ModelViewSet):
    queryset = models.ResponseForm.objects.all()
    serializer_class = serializers.ResponseFormSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, resident_id):
        responses = models.ResponseForm.objects.filter(resident_id=resident_id)

        serializer = serializers.ResponseFormSerializer(responses, many=True)
        return Response(serializer.data)


