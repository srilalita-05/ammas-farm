from django.urls import path
from .views import CartView, AddToCartView, CartItemView, ClearCartView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('add/', AddToCartView.as_view(), name='cart-add'),
    path('item/<int:pk>/', CartItemView.as_view(), name='cart-item'),
    path('clear/', ClearCartView.as_view(), name='cart-clear'),
]
