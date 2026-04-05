#!/bin/bash
# Magento Theme & Module Deployment Script
# Folix Game Theme - One Step Checkout Module

echo "========================================="
echo "Folix Game Theme - Deployment Script"
echo "One Step Checkout Module"
echo "========================================="
echo ""

# 清除缓存
echo "Step 1: Clearing cache..."
php bin/magento cache:clean
php bin/magento cache:flush

# 清除静态文件
echo ""
echo "Step 2: Clearing static files..."
rm -rf pub/static/frontend/Folix/*
rm -rf var/view_preprocessed/pub/static/frontend/Folix/*

# 清除 RequireJS 缓存
echo ""
echo "Step 3: Clearing RequireJS cache..."
rm -rf pub/static/_requirejs/*
rm -rf var/view_preprocessed/pub/static/_requirejs/*

# 重新部署静态文件
echo ""
echo "Step 4: Deploying static content..."
php bin/magento setup:static-content:deploy --theme=Folix/game-theme -f

# 清除缓存
echo ""
echo "Step 5: Clearing cache again..."
php bin/magento cache:clean
php bin/magento cache:flush

echo ""
echo "========================================="
echo "Deployment completed!"
echo "========================================="
echo ""
echo "✓ Theme styles deployed"
echo "✓ One Step Checkout module deployed"
echo "✓ Place Order button added to summary sidebar"
echo "✓ Shipping step disabled for virtual products"
echo ""
echo "Please test the checkout flow:"
echo "1. Add a virtual product to cart"
echo "2. Go to checkout page"
echo "3. Verify two-column layout (content + summary)"
echo "4. Verify Place Order button in right sidebar"
echo "5. Verify no shipping step is shown"
echo ""
