from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'product_price', 'quantity', 'subtotal')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'order_status', 'phone_number', 'created_at')
    list_filter = ('order_status', 'created_at')
    list_editable = ('order_status',)
    inlines = [OrderItemInline]
    readonly_fields = ('total_amount', 'created_at', 'updated_at')
