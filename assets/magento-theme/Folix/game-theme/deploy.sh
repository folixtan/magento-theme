#!/bin/bash
# Magento Theme Deployment Script
# Folix Game Theme - Mobile Header Fix

echo "========================================="
echo "Folix Game Theme - Deployment Script"
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

# 重新部署静态文件
echo ""
echo "Step 3: Deploying static content..."
php bin/magento setup:static-content:deploy --theme=Folix/game-theme -f

# 清除缓存
echo ""
echo "Step 4: Clearing cache again..."
php bin/magento cache:clean
php bin/magento cache:flush

echo ""
echo "========================================="
echo "Deployment completed!"
echo "========================================="
echo ""
echo "Please test in mobile view:"
echo "1. Open Chrome DevTools (F12)"
echo "2. Click 'Toggle device toolbar' (Ctrl+Shift+M)"
echo "3. Select 'iPhone 12 Pro' or resize to 375px width"
echo "4. Refresh the page (Ctrl+F5)"
echo ""
echo "Expected results:"
echo "✓ Header should NOT be blank"
echo "✓ Logo should be centered"
echo "✓ Search icon should be visible on the right"
echo "✓ Cart icon should be visible with circular background"
echo "✓ Navigation toggle should be visible on the left"
echo ""
