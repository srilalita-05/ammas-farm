#!/usr/bin/env bash
# build.sh — Render runs this automatically on every deploy
set -o errexit   # exit immediately on error

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📁 Collecting static files..."
python manage.py collectstatic --no-input

echo "🗄️  Running database migrations..."
python manage.py migrate

echo "✅ Build complete!"
