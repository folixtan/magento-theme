# Folix One Step Checkout Module

虚拟商品的一步结账模块。

## 支付渲染流程

1. `payments-list` (list.js) → `Magento_Checkout/payment-methods/list`
2. list.js 的 `createRenderer` 根据 `rendererList` 动态创建每个支付方式
3. 每个支付方式渲染器默认是 `Magento_Checkout/js/view/payment/default`
4. 每个支付方式模板（如 free.html）包含自己的 Place Order 按钮
5. 按钮绑定到支付方式组件的 `placeOrder` 方法

## 实现方式

1. **禁用 progressBar, estimation, shipping-step**
2. **覆盖 sidebar.template** 为 Folix_OneStepCheckout/sidebar
3. **在 sidebar.html 中添加 place-order region**
4. **添加 place-order 组件** 到 sidebar.children

## 关键点

- 必须复制完整的 sidebar.children 结构，否则会丢失 summary 和 shipping-information
- place-order 组件调用 `placeOrderAction` 进行下单
- 组件通过 `quote.paymentMethod()` 获取选中的支付方式

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
        └── template/
            ├── sidebar.html
            └── place-order-button.html
```

## 部署

```bash
php bin/magento module:enable Folix_OneStepCheckout
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy --theme=Folix/game-theme -f
php bin/magento cache:flush
```
