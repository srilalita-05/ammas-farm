from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'quantity', 'total_price', 'created_at')


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate_product_id(self, value):
        from products.models import Product
        try:
            product = Product.objects.get(id=value)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found.")
        if not product.is_available:
            raise serializers.ValidationError("Product is not available.")
        return value

    def validate(self, attrs):
        from products.models import Product
        product = Product.objects.get(id=attrs['product_id'])
        if attrs['quantity'] > product.stock_quantity:
            raise serializers.ValidationError(
                f"Only {product.stock_quantity} {product.unit}(s) available."
            )
        return attrs


class UpdateCartSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
