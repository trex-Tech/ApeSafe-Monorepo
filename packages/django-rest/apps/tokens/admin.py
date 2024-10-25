from django.contrib import admin
from .models import Token, Chain

@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = ('name', 'ticker', 'description', 'creator', 'date_created')
    list_filter = ('creator', 'date_created')
    search_fields = ('name', 'ticker', 'description')
    readonly_fields = ('id', 'date_created')

@admin.register(Chain)
class ChainAdmin(admin.ModelAdmin):
    list_display = ('name', 'contract_address')
    search_fields = ('name', 'contract_address')