from django.urls import path
from .views import (
    CreateOrderView, CustomerOrderListView, CustomerOrderDetailView,
    AdminOrderListView, AdminOrderUpdateView
)

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='order-create'),
    path('my-orders/', CustomerOrderListView.as_view(), name='my-orders'),
    path('my-orders/<int:pk>/', CustomerOrderDetailView.as_view(), name='my-order-detail'),
    path('admin/', AdminOrderListView.as_view(), name='admin-orders'),
    path('admin/<int:pk>/status/', AdminOrderUpdateView.as_view(), name='admin-order-status'),
]
