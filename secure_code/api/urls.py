from django.urls import path
from .views import UserLoginView, UserDetailView, CreateUserView, UserDetailView, UserChangePasswordView, UserLogoutView
urlpatterns = [
   path('create_user/', CreateUserView.as_view(), name='create_user'),
   path('login/', UserLoginView.as_view(), name='login'),
   path('user/', UserDetailView.as_view(), name='user'),
   path('logout/', UserLogoutView.as_view(), name='logout'),
    path('change_password/', UserChangePasswordView.as_view(), name='change_password'),
    
    # เพิ่ม path อื่นๆ ตามต้องการ
]

