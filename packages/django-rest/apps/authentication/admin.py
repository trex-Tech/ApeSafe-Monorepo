from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'wallet_id', 'is_staff', 'is_superuser', 'is_admin', 'status', 'date_created')
    list_filter = ('wallet_id', 'is_staff', 'is_superuser',  'is_admin', 'status')
    search_fields = ('username', 'wallet_id')
    readonly_fields = ('id', 'date_created', 'wallet_id')

