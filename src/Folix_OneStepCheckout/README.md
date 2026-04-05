# Folix One Step Checkout Module

虚拟商品的一步结账模块。Place Order 按钮统一显示在右侧摘要底部。

## 实现方式

### 1. XML 布局
在 `sidebar.children` 中添加 `place-order` 组件：

```xml
<item name="sidebar">
    <item name="children">
        <item name="place-order">
            <item name="component">Folix_OneStepCheckout/js/view/place-order-button</item>
        </item>
    </item>
</item>
```

### 2. Place Order 按钮组件
通过 `uiRegistry` 获取当前选中的支付方式组件，调用其 `placeOrder` 方法：

```javascript
placeOrder: function () {
    var componentName = 'checkout.steps.billing-step.payment.payments-list.' + method.method;
    registry.get(componentName, function (paymentComponent) {
        paymentComponent.placeOrder();  // 调用支付方式组件的 placeOrder
    });
}
```

## 核心文件

```
Folix_OneStepCheckout/
├── etc/module.xml
├── registration.php
└── view/frontend/
    ├── layout/checkout_index_index.xml
    └── web/
        ├── css/source/_folix-one-step-checkout.less
        ├── js/view/place-order-button.js
        └── template/place-order-button.html
```

## 部署

```bash
php bin/magento module:enable Folix_OneStepCheckout
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy --theme=Folix/game-theme -f
php bin/magento cache:flush
```
