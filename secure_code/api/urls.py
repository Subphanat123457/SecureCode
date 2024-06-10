from django.urls import path
from .views import UserLoginView, UserDetailView, CreateUserView


urlpatterns = [
   path('create_user/', CreateUserView.as_view(), name='create_user'),
   path('login/', UserLoginView.as_view(), name='login'),
   path('user/', UserDetailView.as_view(), name='user'),
    # เพิ่ม path อื่นๆ ตามต้องการ
]

