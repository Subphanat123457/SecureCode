from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from django.contrib.auth import authenticate, login
from datetime import timedelta
from django.utils import timezone
from .serializers import UserSerializer, UserLoginSerializer
from .models import CustomUser
from django.middleware.csrf import get_token
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class AnonTenPerTenMinutesThrottle(AnonRateThrottle):
    request_limit = 5
    rate = timedelta(minutes=1)
    
    def parse_rate(self, rate):
        return (self.request_limit, float(self.rate.total_seconds()))

class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        data = request.data
        data['ip_address'] = request.META.get('REMOTE_ADDR')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({'user_id': user.id}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonTenPerTenMinutesThrottle]

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')
        ip_address = request.META.get('REMOTE_ADDR')

        if username is None or password is None:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        custom_user = CustomUser.objects.filter(username=username).first()

        if custom_user is not None:
            if custom_user.is_blocked:
                if timezone.now() < custom_user.lockout_time:
                    return Response({'error': 'User is locked. Please try again later.'}, status=status.HTTP_403_FORBIDDEN)
                else:
                    custom_user.unlock_user()

            if user is not None:
                if user.is_active:
                    if custom_user.last_login_ip and custom_user.last_login_ip != ip_address:
                        custom_user.lock_user(timedelta(minutes=30))
                        return Response({'error': 'Suspicious login attempt detected. User is locked for 30 minutes.'}, status=status.HTTP_403_FORBIDDEN)

                    login(request, user)
                    token, created = Token.objects.get_or_create(user=user)
                    custom_user.unlock_user()
                    custom_user.last_login_ip = ip_address
                    custom_user.save()

                    # Get CSRF token and set it in response
                    csrf_token = get_token(request)
                    response = Response({'token': token.key}, status=status.HTTP_200_OK)
                    response.set_cookie('csrftoken', csrf_token, httponly=True)
                    
                    # Ensure sessionid is set in response
                    response.set_cookie('sessionid', request.session.session_key, httponly=True)
                    return response
                else:
                    return Response({'error': 'User is locked'}, status=status.HTTP_403_FORBIDDEN)
            else:
                custom_user.failed_login_attempts += 1
                if custom_user.failed_login_attempts >= 4:
                    lockout_duration = timedelta(minutes=1) if custom_user.last_login_ip == ip_address else timedelta(minutes=30)
                    custom_user.lock_user(lockout_duration)
                    return Response({'error': f'User is locked. Please try again later.'}, status=status.HTTP_403_FORBIDDEN)
                else:
                    custom_user.save()
                    return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def get_object(self):
        return self.request.user
    
    #  ดึงข้อมูลผู้ใช้
    def get(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    #  แก้ไขข้อมูลผู้ใช้
    def put(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    #  ลบผู้ใช้
    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class UserChangePasswordView(APIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.serializer_class(user)
        return Response(serializer.data)
    
    def put(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
    
       
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
