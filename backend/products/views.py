from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductSerializer, ProductCreateUpdateSerializer
from .permissions import IsAdminOrReadOnly, IsAdmin


class ProductListView(generics.ListAPIView):
    """List all available products (public)."""
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['seasonal_availability']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']

    def get_queryset(self):
        queryset = Product.objects.all()
        available_only = self.request.query_params.get('available_only', None)
        if available_only == 'true':
            queryset = queryset.filter(seasonal_availability=True, stock_quantity__gt=0)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """Get single product details (public)."""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class AdminProductListCreateView(generics.ListCreateAPIView):
    """Admin: List all products and create new ones."""
    queryset = Product.objects.all()
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateUpdateSerializer
        return ProductSerializer

    def create(self, request, *args, **kwargs):
        serializer = ProductCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(
            ProductSerializer(product, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Retrieve, update, delete a product."""
    queryset = Product.objects.all()
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProductCreateUpdateSerializer
        return ProductSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = ProductCreateUpdateSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(ProductSerializer(product, context={'request': request}).data)


class AdminDashboardView(APIView):
    """Admin dashboard statistics."""
    permission_classes = [IsAdmin]

    def get(self, request):
        from orders.models import Order
        total_products = Product.objects.count()
        available_products = Product.objects.filter(seasonal_availability=True, stock_quantity__gt=0).count()
        low_stock_products = [p for p in Product.objects.all() if p.is_low_stock]
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(order_status='pending').count()
        recent_orders = Order.objects.order_by('-created_at')[:5]

        from orders.serializers import OrderSerializer
        return Response({
            'total_products': total_products,
            'available_products': available_products,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'low_stock_products': [
                {
                    'id': p.id,
                    'name': p.name,
                    'stock_quantity': p.stock_quantity,
                    'low_stock_threshold': p.low_stock_threshold,
                }
                for p in low_stock_products
            ],
            'recent_orders': OrderSerializer(recent_orders, many=True).data,
        })
