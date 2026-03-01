import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmer_backend.settings')
django.setup()

from accounts.models import User
from products.models import Product

print("🌾 Setting up Amma's Farm sample data...")

# Create admin user
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@ammasfarm.com',
        password='admin123',
        first_name='Amma',
        last_name='Farm',
        role='admin',
        phone_number='+91-9876543210',
    )
    print("✅ Admin created: admin / admin123")

# Create customer user
if not User.objects.filter(username='customer1').exists():
    customer = User.objects.create_user(
        username='customer1',
        email='customer1@example.com',
        password='customer123',
        first_name='Ravi',
        last_name='Kumar',
        role='customer',
        phone_number='+91-9876543211',
        address='123 Village Road, Hyderabad, Telangana - 500001',
    )
    print("✅ Customer created: customer1 / customer123")

# Create sample products
sample_products = [
    {
        'name': 'Fresh Tomatoes',
        'description': 'Organically grown red tomatoes, freshly harvested from our farm. Rich in lycopene and vitamins.',
        'price': 35.00,
        'stock_quantity': 50,
        'unit': 'kg',
        'seasonal_availability': True,
        'low_stock_threshold': 10,
    },
    {
        'name': 'Country Eggs',
        'description': 'Farm-fresh country eggs from free-range hens. Rich in protein and omega-3.',
        'price': 90.00,
        'stock_quantity': 100,
        'unit': 'dozen',
        'seasonal_availability': True,
        'low_stock_threshold': 20,
    },
    {
        'name': 'Raw Coconuts',
        'description': 'Fresh tender coconuts perfect for drinking. Naturally sweet and hydrating.',
        'price': 25.00,
        'stock_quantity': 30,
        'unit': 'piece',
        'seasonal_availability': True,
        'low_stock_threshold': 10,
    },
    {
        'name': 'Organic Carrots',
        'description': 'Sweet and crunchy carrots grown without pesticides. Great for juicing and cooking.',
        'price': 45.00,
        'stock_quantity': 40,
        'unit': 'kg',
        'seasonal_availability': True,
        'low_stock_threshold': 5,
    },
    {
        'name': 'Fresh Spinach (Palak)',
        'description': 'Tender green spinach leaves, harvested fresh every morning. Rich in iron.',
        'price': 20.00,
        'stock_quantity': 25,
        'unit': 'bundle',
        'seasonal_availability': True,
        'low_stock_threshold': 8,
    },
    {
        'name': 'Raw Honey',
        'description': 'Pure unprocessed honey from our organic bee farms. No added sugar or preservatives.',
        'price': 450.00,
        'stock_quantity': 15,
        'unit': 'kg',
        'seasonal_availability': True,
        'low_stock_threshold': 3,
    },
    {
        'name': 'Drumstick (Moringa)',
        'description': 'Fresh moringa drumsticks, great for sambar and curries. High nutritional value.',
        'price': 30.00,
        'stock_quantity': 20,
        'unit': 'bundle',
        'seasonal_availability': True,
        'low_stock_threshold': 5,
    },
    {
        'name': 'Alphonso Mangoes',
        'description': 'Premium Alphonso mangoes from our orchard. Seasonal delicacy, sweet and juicy.',
        'price': 200.00,
        'stock_quantity': 5,
        'unit': 'dozen',
        'seasonal_availability': True,
        'low_stock_threshold': 5,
    },
    {
        'name': 'Turmeric Powder',
        'description': 'Homemade turmeric powder from fresh turmeric rhizomes. Pure and aromatic.',
        'price': 120.00,
        'stock_quantity': 10,
        'unit': 'kg',
        'seasonal_availability': True,
        'low_stock_threshold': 2,
    },
    {
        'name': 'Bitter Gourd (Karela)',
        'description': 'Fresh bitter gourd, excellent for diabetics and overall health.',
        'price': 40.00,
        'stock_quantity': 8,
        'unit': 'kg',
        'seasonal_availability': True,
        'low_stock_threshold': 5,
    },
]

for data in sample_products:
    if not Product.objects.filter(name=data['name']).exists():
        Product.objects.create(**data)
        print(f"  🌿 Added: {data['name']}")

print("\n🎉 Sample data setup complete!")
print("\n🔐 Login Credentials:")
print("   Admin:    username=admin    password=admin123")
print("   Customer: username=customer1  password=customer123")
print("\n🚀 Run the server: python manage.py runserver")
