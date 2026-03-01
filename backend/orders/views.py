from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer, UpdateOrderStatusSerializer
from cart.models import CartItem
from products.permissions import IsAdmin


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        """Place order from cart items."""
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        if not cart_items.exists():
            return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate stock availability
        for item in cart_items:
            if not item.product.is_available:
                return Response(
                    {'error': f'"{item.product.name}" is no longer available.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if item.quantity > item.product.stock_quantity:
                return Response(
                    {'error': f'Insufficient stock for "{item.product.name}". Only {item.product.stock_quantity} available.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Calculate total
        total_amount = sum(item.total_price for item in cart_items)

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            delivery_address=serializer.validated_data['delivery_address'],
            phone_number=serializer.validated_data['phone_number'],
            notes=serializer.validated_data.get('notes', ''),
        )

        # Create order items and deduct stock
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_price=item.product.price,
                quantity=item.quantity,
                unit=item.product.unit,
            )
            # Deduct stock
            item.product.stock_quantity -= item.quantity
            item.product.save()

        # Clear cart
        cart_items.delete()

        return Response({
            'message': '🎉 Order placed successfully! Amma will pack it fresh for you.',
            'order': OrderSerializer(order).data,
        }, status=status.HTTP_201_CREATED)


class CustomerOrderListView(generics.ListAPIView):
    """Customer's order history."""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class CustomerOrderDetailView(generics.RetrieveAPIView):
    """Customer order details."""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class AdminOrderListView(generics.ListAPIView):
    """Admin: View all orders."""
    serializer_class = OrderSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = Order.objects.all().prefetch_related('items').select_related('user')
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(order_status=status_filter)
        return queryset


class AdminOrderUpdateView(APIView):
    """Admin: Update order status."""
    permission_classes = [IsAdmin]

    def put(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order.order_status = serializer.validated_data['order_status']
        order.save()

        return Response({
            'message': f'Order status updated to {order.order_status}.',
            'order': OrderSerializer(order).data,
        })
