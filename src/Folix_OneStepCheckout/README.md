# Folix One Step Checkout Module

虚拟商品的一步结账模块。Place Order 按钮统一显示在右侧摘要底部。

## 实现方式

### 1. XML 布局
禁用 `progressBar`、`estimation`、`shipping-step`，在 `sidebar` 中添加 `place-order` 组件。

### 2. Step Navigator Mixin
修改 `step-navigator.js`，跳过禁用的步骤：

```javascript
stepNavigator.getVisibleSteps = function () {
    // 只返回 isVisible() === true 的步骤
};
stepNavigator.next = function () {
    // 跳到下一个可见步骤
};
```

### 3. Place Order 按钮
通过 `uiRegistry` 获取选中的支付方式组件，调用其 `placeOrder` 方法：

```javascript
registry.get('checkout.steps.billing-step.payment.payments-list.' + method.method, 
    function (paymentComponent) {
        paymentComponent.placeOrder();  // 调用原生 placeOrder
    }
);
```

## 核心文件

```
Folix_OneStepCheckout/
├── etc/module.xml
├── registration.php
└── view/frontend/
    ├── layout/checkout_index_index.xml
    ├── requirejs-config.js
    └── web/
        ├── css/source/_folix-one-step-checkout.less
        ├── js/
        │   ├── mixin/step-navigator-mixin.js
        │   └── view/place-order-button.js
        └── template/place-order-button.html
```

## 部署

```bash
php bin/magento module:enable Folix_OneStepCheckout
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy --theme=Folix/game-theme -f
php bin/magento cache:flush
```
