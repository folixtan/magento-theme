# Folix One Step Checkout Module

虚拟商品的一步结账模块。

## 实现方式

利用 Magento XML 合并机制：
- 结构相同时会合并，不会替换
- 在 `payment.children.afterMethods.children` 中添加 `place-order` 组件
- `afterMethods` region 在每个支付方式之后渲染

## 关键点

1. **禁用 progressBar, estimation, shipping-step**
2. **在 payment.afterMethods 中添加 place-order 组件**（Magento 会合并）
3. **通过 CSS 隐藏每个支付方式内的 Place Order 按钮**

## 文件

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
