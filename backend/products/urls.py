from django.urls import path
from .views import (
    ProductListView, ProductDetailView,
    AdminProductListCreateView, AdminProductDetailView,
    AdminDashboardView
)

urlpatterns = [
    # Public endpoints
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    # Admin endpoints
    path('admin/', AdminProductListCreateView.as_view(), name='admin-product-list'),
    path('admin/<int:pk>/', AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('admin/dashboard/stats/', AdminDashboardView.as_view(), name='admin-dashboard'),
]
