# Folix One Step Checkout Module

一步结账模块，专为游戏商城的虚拟商品设计。

## 功能特性

1. **移除地址/配送步骤** - 虚拟商品无需配送
2. **两列布局** - 左侧内容区 + 右侧摘要区 (sticky)
3. **统一 Place Order 按钮** - 在右侧摘要底部
4. **响应式设计** - PC 两列，移动端单列

## 文件结构

```
Folix_OneStepCheckout/
├── etc/
│   └── module.xml              # 模块配置
├── registration.php            # 模块注册
└── view/frontend/
    ├── layout/
    │   └── checkout_index_index.xml  # 布局修改
    ├── requirejs-config.js     # RequireJS 配置
    └── web/
        ├── css/source/
        │   └── _folix-one-step-checkout.less  # 样式
        ├── js/
        │   ├── mixin/
        │   │   └── step-navigator-mixin.js     # 步骤导航 Mixin
        │   └── view/
        │       └── place-order-button.js       # Place Order 按钮组件
        └── template/
            └── place-order-button.html          # 按钮模板
```

## 安装步骤

### 1. 复制模块到 Magento

```bash
# 复制模块到 app/code
cp -r Folix_OneStepCheckout /path/to/magento/app/code/Folix/

# 复制主题样式文件
cp -r Folix_OneStepCheckout/web/css/source/* /path/to/magento/app/design/frontend/Folix/game-theme/web/css/source/
```

### 2. 注册模块

```bash
php bin/magento module:enable Folix_OneStepCheckout
php bin/magento setup:upgrade
```

### 3. 部署静态文件

```bash
php bin/magento setup:static-content:deploy --theme=Folix/game-theme -f
php bin/magento cache:flush
```

## 使用说明

### 启用模块

模块默认启用。对于虚拟商品：
- 自动跳过配送地址步骤
- 直接显示支付方式选择
- Place Order 按钮在右侧摘要区

### 禁用模块

```bash
php bin/magento module:disable Folix_OneStepCheckout
php bin/magento cache:flush
```

## 样式定制

样式文件位于：
```
web/css/source/Folix_OneStepCheckout/_folix-one-step-checkout.less
```

主要样式类：
- `.folix-place-order-container` - Place Order 按钮容器
- `.opc-wrapper` - 左侧内容区
- `.opc-sidebar` - 右侧摘要区

## 浏览器兼容

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
