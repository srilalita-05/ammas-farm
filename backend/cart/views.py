from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CartItem
from .serializers import CartItemSerializer, AddToCartSerializer, UpdateCartSerializer
from products.models import Product


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get current user's cart."""
        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        serializer = CartItemSerializer(cart_items, many=True, context={'request': request})
        cart_total = sum(item.total_price for item in cart_items)
        return Response({
            'items': serializer.data,
            'cart_total': float(cart_total),
            'item_count': cart_items.count(),
        })


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Add product to cart or update quantity."""
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = Product.objects.get(id=serializer.validated_data['product_id'])
        quantity = serializer.validated_data['quantity']

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            new_qty = cart_item.quantity + quantity
            if new_qty > product.stock_quantity:
                return Response(
                    {'error': f'Cannot add more. Only {product.stock_quantity} available.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_qty
            cart_item.save()

        return Response({
            'message': 'Added to cart!',
            'item': CartItemSerializer(cart_item, context={'request': request}).data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        """Update cart item quantity."""
        try:
            cart_item = CartItem.objects.get(id=pk, user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        quantity = serializer.validated_data['quantity']
        if quantity > cart_item.product.stock_quantity:
            return Response(
                {'error': f'Only {cart_item.product.stock_quantity} available.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()
        return Response({
            'message': 'Cart updated!',
            'item': CartItemSerializer(cart_item, context={'request': request}).data
        })

    def delete(self, request, pk):
        """Remove item from cart."""
        try:
            cart_item = CartItem.objects.get(id=pk, user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)
        cart_item.delete()
        return Response({'message': 'Item removed from cart.'}, status=status.HTTP_204_NO_CONTENT)


class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """Clear all cart items."""
        CartItem.objects.filter(user=request.user).delete()
        return Response({'message': 'Cart cleared.'})
