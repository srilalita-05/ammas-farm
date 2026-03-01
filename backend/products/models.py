from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    seasonal_availability = models.BooleanField(default=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    unit = models.CharField(max_length=50, default='kg', help_text='e.g., kg, piece, dozen, bundle')
    low_stock_threshold = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.low_stock_threshold

    @property
    def is_available(self):
        return self.seasonal_availability and self.stock_quantity > 0
