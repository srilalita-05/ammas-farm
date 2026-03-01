from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock_quantity', 'seasonal_availability', 'is_low_stock', 'updated_at')
    list_filter = ('seasonal_availability',)
    search_fields = ('name', 'description')
    list_editable = ('price', 'stock_quantity', 'seasonal_availability')
