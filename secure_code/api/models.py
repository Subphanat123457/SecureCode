from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin, AbstractUser
from django.utils import timezone
from django.contrib.auth.models import Group, Permission
from django.utils.translation import gettext_lazy as _
from datetime import timedelta
from django.contrib.auth.models import AbstractUser
from django.db import models



class FaileAttemptsLogin(models.Model):
    username = models.CharField(null=True)
    ip_address = models.GenericIPAddressField(null=True)
    last_login = models.DateTimeField(auto_now_add=True)


class CustomUser(AbstractUser):
    ip_address = models.GenericIPAddressField(null=True)
    failed_login_attempts = models.IntegerField(default=0)
    is_blocked = models.BooleanField(default=False)
    lockout_time = models.DateTimeField(null=True, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)

    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        related_name='custom_user_groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_permissions'
    )

    def lock_user(self, lockout_duration):
        self.is_blocked = True
        self.lockout_time = timezone.now() + lockout_duration
        self.save()

    def unlock_user(self):
        self.is_blocked = False
        self.lockout_time = None
        self.failed_login_attempts = 0
        self.save()