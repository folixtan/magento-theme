# Folix One Step Checkout Module

虚拟商品的一步结账模块。Place Order 按钮统一显示在右侧摘要底部。

## 实现方式

通过 XML 布局在 `sidebar.children` 中添加 `place-order` 组件：

```xml
<item name="sidebar">
    <item name="children">
        <item name="place-order">
            <item name="component">Folix_OneStepCheckout/js/view/place-order-button</item>
        </item>
    </item>
</item>
```

## 核心文件

```
Folix_OneStepCheckout/
├── etc/module.xml
├── registration.php
└── view/frontend/
    ├── layout/checkout_index_index.xml    # XML 布局配置
    ├── web/
    │   ├── css/source/_folix-one-step-checkout.less  # 样式（隐藏支付方式按钮）
    │   ├── js/view/place-order-button.js  # Place Order 组件
    │   └── template/place-order-button.html
```

## 关键设计

1. **禁用 progressBar, estimation, shipping-step**（通过 XML config）
2. **在 sidebar 中添加 place-order 组件**（放在摘要底部）
3. **通过 CSS 隐藏每个支付方式内的 Place Order 按钮**

## 部署

```bash
php bin/magento module:enable Folix_OneStepCheckout
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy --theme=Folix/game-theme -f
php bin/magento cache:flush
```
