from django.contrib.auth.hashers import make_password
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from . import models
from rest_framework import serializers


class UserSerializer(ModelSerializer):
    class Meta:
        model = models.User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'avatar', 'date_joined',
                  'last_login', 'role', 'is_active']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = models.User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        avatar = instance.avatar
        if avatar:
            rep['avatar'] = avatar.url
        return rep

    # def get_avatar(self, obj):
    #     request = self.context['request']
    #
    #     if obj.avatar.name.startswith('static/'):
    #         path = "/%s" % obj.image.name
    #     else:
    #         path = '/static/%s' % (obj.avatar)
    #     return request.build_absolute_uri(path)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        avatar = instance.avatar
        if avatar:
            rep['avatar'] = avatar.url
        return rep

class ItemSerializer(ModelSerializer):
    class Meta:
        model = models.Item
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        image = instance.image
        if image:
            rep['image'] = image.url
        return rep

class LockerSerializer(ModelSerializer):
    class Meta:
        model = models.Locker
        fields = '__all__'

    items = ItemSerializer(many=True)

class RoomSerializer(ModelSerializer):
    resident = UserSerializer()
    class Meta:
        model = models.Room
        fields = '__all__'

class ContractSerializer(ModelSerializer):
    class Meta:
        model = models.Contract
        fields = '__all__'

class ServiceSerializer(ModelSerializer):
    class Meta:
        model = models.Service
        fields = '__all__'

class InvoiceSerializer(ModelSerializer):
    class Meta:
        model = models.Invoice
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        payment_proof = instance.payment_proof
        if payment_proof:
            rep['payment_proof'] = payment_proof.url
        return rep

class RelativeSerializer(ModelSerializer):
    class Meta:
        model = models.Relative
        fields = '__all__'


class QuestionSerializer(ModelSerializer):
    class Meta:
        model = models.Question
        fields = '__all__'

class ResponseFormSerializer(ModelSerializer):
    resident = serializers.PrimaryKeyRelatedField(queryset=models.User.objects.all())
    class Meta:
        model = models.ResponseForm
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['resident'] = {
            'id': instance.resident.id,
            'first_name': instance.resident.first_name,
            'last_name': instance.resident.last_name,
            'email': instance.resident.email,
            'username': instance.resident.username,
            'avatar': instance.resident.avatar.url if instance.resident.avatar else None
        }
        return response


class SurveyFormSerializer(ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)

    class Meta:
        model = models.SurveyForm
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        questions = instance.questions.all()
        question_list = []

        for question in questions:
            responses = models.ResponseForm.objects.filter(question=question)
            question_data = QuestionSerializer(question).data
            question_data['answers'] = ResponseFormSerializer(responses, many=True).data
            question_list.append(question_data)

        representation['questions'] = question_list
        return representation


class ComplaintSerializer(ModelSerializer):
    class Meta:
        model = models.Complaint
        fields = '__all__'

