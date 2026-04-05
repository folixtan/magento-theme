# Folix One Step Checkout Module

虚拟商品的一步结账模块。

## 核心理解

Magento Checkout 组件渲染流程：

1. `onepage.phtml` → 初始化 `checkout` 组件
2. `checkout` 组件 → template: `Magento_Checkout/onepage`
3. `onepage.html` → 使用 `getRegion()` 渲染 children
4. `sidebar` 组件 → template: `Magento_Checkout/sidebar`
5. `sidebar.html` → 使用 `getRegion('summary')` 渲染
6. `summary` 组件 → template: `Magento_Checkout/summary`
7. **`summary.html` → 使用 `elems()` 自动渲染所有 children！**

**关键点：不需要重写 sidebar.html 或 summary.html！**

## 实现方式

通过 XML 在 `sidebar.children.summary.children` 中添加 `place-order` 组件：
- summary.html 使用 `elems()` 自动渲染所有 children
- Place Order 按钮会自动显示在 summary 中

## 文件结构

```
Folix_OneStepCheckout/
├── etc/module.xml              # 模块配置
├── registration.php             # 模块注册
└── view/frontend/
    ├── layout/checkout_index_index.xml   # 布局配置
    └── web/
        ├── css/source/_folix-one-step-checkout.less  # 样式
        ├── js/view/place-order-button.js  # Place Order 按钮逻辑
        └── template/place-order-button.html  # 按钮模板
```

## 部署

```bash
php bin/magento module:enable Folix_OneStepCheckout
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy --theme=Folix/game-theme -f
php bin/magento cache:flush
```
