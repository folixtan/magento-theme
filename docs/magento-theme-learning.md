# Magento 2 主题开发学习笔记

## 一、目录结构

```
app/design/frontend/<Vendor>/<theme>/
├── composer.json          # Composer 配置
├── registration.php       # 主题注册
├── theme.xml              # 主题声明
├── etc/
│   └── view.xml           # 视图配置（图片尺寸等）
├── Magento_Theme/         # 主题模块覆盖
│   ├── layout/
│   │   ├── default.xml           # 全局布局（所有页面）
│   │   ├── default_head_blocks.xml # 全局 <head>
│   │   └── cms_index_index.xml   # 首页专用布局
│   ├── templates/
│   │   └── html/
│   │       ├── header.phtml      # 头部模板
│   │       └── footer.phtml      # 底部模板
│   └── web/
│       └── css/
│           └── source/
│               ├── _theme.less    # 变量覆盖
│               ├── _extends.less  # 样式扩展
│               └── extends/
│                   └── _header.less
├── Magento_Catalog/       # 产品模块覆盖
│   ├── layout/
│   │   ├── catalog_product_view.xml    # 产品详情页
│   │   └── catalog_category_view.xml   # 分类页
│   └── templates/
├── Magento_Cms/           # CMS 模块覆盖
│   └── layout/
│       └── cms_index_index.xml  # 首页
└── web/
    ├── css/
    ├── js/
    ├── images/
    └── fonts/
```

## 二、主题继承机制

```
Magento/blank (基础主题)
    ↓ 继承
Magento/luma (父主题)
    ↓ 继承
Folix/game-theme (子主题)
```

### theme.xml 配置
```xml
<theme xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
       xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/theme.xsd">
    <title>Folix Game Theme</title>
    <parent>Magento/luma</parent>  <!-- 继承 Luma -->
    <media>
        <preview_image>media/preview.jpg</preview_image>
    </media>
</theme>
```

## 三、XML 布局系统

### 3.1 布局文件类型

| 文件名 | 作用 | 加载范围 |
|--------|------|----------|
| `default.xml` | 全局布局 | 所有页面 |
| `default_head_blocks.xml` | 全局 HEAD | 所有页面 |
| `cms_index_index.xml` | 首页布局 | 仅首页 |
| `catalog_product_view.xml` | 产品详情页 | 仅产品页 |
| `catalog_category_view.xml` | 分类页 | 仅分类页 |
| `customer_account.xml` | 客户账户 | 账户相关页面 |
| `checkout_index_index.xml` | 结账页 | 仅结账页 |

### 3.2 布局加载顺序

```
1. 父主题 default.xml
2. 子主题 default.xml
3. 模块特定布局（如 catalog_product_view.xml）
4. 页面特定布局覆盖
```

### 3.3 核心布局指令

#### container - 创建容器
```xml
<container name="custom.container" 
           label="My Container" 
           htmlTag="div" 
           htmlClass="custom-container"
           before="main.content">
    <!-- 子元素 -->
</container>
```

#### block - 创建块
```xml
<block class="Magento\Framework\View\Element\Template"
       name="custom.block"
       template="Magento_Theme::html/custom.phtml"
       before="-">
    <arguments>
        <argument name="title" xsi:type="string">Hello</argument>
    </arguments>
</block>
```

#### referenceContainer - 引用容器（添加内容）
```xml
<referenceContainer name="header.container">
    <block class="..." name="header.custom" ... />
</referenceContainer>
```

#### referenceBlock - 引用块（修改块）
```xml
<!-- 修改块参数 -->
<referenceBlock name="logo">
    <arguments>
        <argument name="logo_img_width" xsi:type="number">200</argument>
    </arguments>
</referenceBlock>

<!-- 删除块 -->
<referenceBlock name="block.name" remove="true"/>

<!-- 隐藏块（保留DOM） -->
<referenceBlock name="block.name" display="false"/>
```

#### move - 移动元素
```xml
<!-- 移动元素到新容器 -->
<move element="block.name" 
      destination="new.container" 
      before="other.block"
      after="another.block"/>

<!-- 移动到特定位置 -->
<move element="logo" destination="header-wrapper" before="-"/>
```

#### update - 引入其他布局
```xml
<update handle="default_head_blocks"/>
```

### 3.4 布局句柄（Handles）

布局句柄标识特定页面：

```
default                    - 所有页面
cms_index_index           - 首页
catalog_product_view      - 产品详情页
catalog_category_view     - 分类页
customer_account_login    - 登录页
checkout_index_index      - 结账页
```

## 四、核心容器结构

### Luma 默认容器层次

```
<root>
├── after.body.start          (body 开始后)
├── global.notices            (全局通知)
├── header.container          (头部容器)
│   ├── header.panel          (顶部栏 - 语言、货币)
│   ├── header-wrapper        (头部主体)
│   │   ├── logo
│   │   ├── top.search
│   │   ├── minicart
│   │   └── customer.section
│   └── navigation.sections   (导航)
├── page.wrapper              (页面主体包装)
│   ├── page.top              (页面顶部 - 面包屑、消息)
│   ├── main.content          (主内容区)
│   │   ├── columns.top
│   │   ├── main              (主列)
│   │   ├── sidebar.main      (侧边栏)
│   │   └── sidebar.additional
│   └── page.bottom
├── footer-container          (底部容器)
│   ├── footer
│   └── copyright
└── before.body.end           (body 结束前)
```

## 五、模板系统 (.phtml)

### 5.1 基本模板结构

```php
<?php
/**
 * @var $block \Magento\Framework\View\Element\Template
 */
?>
<div class="custom-block">
    <h1><?= $block->escapeHtml($block->getTitle()) ?></h1>
    <p><?= $block->escapeHtml($block->getData('description')) ?></p>
</div>
```

### 5.2 常用方法

```php
// 获取 URL
$block->getUrl('catalog/product/view/id/1');

// 获取媒体 URL
$block->getBaseUrl() . 'media/';

// 获取视图文件 URL
$block->getViewFileUrl('images/logo.png');

// 获取布局
$block->getLayout();

// 获取子块
$block->getChildHtml('child.block.name');

// 获取配置
$block->getConfig('path/to/config');
```

### 5.3 视图模型（ViewModel）

```php
// 在布局 XML 中注入
<referenceBlock name="block.name">
    <arguments>
        <argument name="view_model" xsi:type="object">
            Vendor\Module\ViewModel\Custom
        </argument>
    </arguments>
</referenceBlock>

// 在模板中使用
/** @var \Vendor\Module\ViewModel\Custom $viewModel */
$viewModel = $block->getViewModel();
$data = $viewModel->getCustomData();
```

## 六、样式系统 (Less)

### 6.1 文件加载顺序

```
1. lib/web/css/source/lib/_variables.less    (Magento UI Library 变量)
2. lib/web/css/source/_variables.less        (Luma 变量)
3. {theme}/web/css/source/_variables.less    (主题自定义变量)
4. {theme}/web/css/source/_theme.less        (覆盖父主题变量)
5. {theme}/web/css/source/_extends.less      (样式扩展)
```

### 6.2 _theme.less - 变量覆盖

```less
// 覆盖父主题变量
@theme__color__primary: #4A90E2;
@theme__color__secondary: #FF6B35;

// 新增变量
@color-accent__primary: #FF6B35;
@header__height: 70px;
```

### 6.3 _extends.less - 样式扩展

```less
& when (@media-common = true) {
    // 公共样式（所有设备）
    
    .custom-header {
        background: @theme__color__primary;
    }
}

.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    // 桌面端样式 (>= 768px)
}

.media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__m) {
    // 移动端样式 (< 768px)
}
```

### 6.4 Magento UI Library 常用函数

```less
// CSS 属性
.lib-css(background, @color);
.lib-css(color, @text-color);

// 渐变
.lib-background-gradient(
    @_background-gradient: true,
    @_background-gradient-direction: vertical,
    @_background-gradient-color-start: @color-start,
    @_background-gradient-color-end: @color-end
);

// 排版
.lib-typography(
    @_font-size: 14px,
    @_font-weight: 400,
    @_line-height: 1.5
);

// 按钮
.lib-button-primary();
.lib-button-secondary();
```

## 七、常见布局场景

### 7.1 全局修改（default.xml）

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <!-- 添加 CSS/JS -->
        <head>
            <css src="css/custom.css"/>
            <script src="js/custom.js"/>
        </head>
        
        <!-- 修改头部 -->
        <referenceContainer name="header.panel">
            <block class="..." name="custom.link" before="-"/>
        </referenceContainer>
        
        <!-- 删除元素 -->
        <referenceBlock name="block.to.remove" remove="true"/>
        
        <!-- 移动元素 -->
        <move element="logo" destination="header-wrapper" before="-"/>
    </body>
</page>
```

### 7.2 首页专用布局（cms_index_index.xml）

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <body>
        <!-- 添加首页 Banner -->
        <referenceContainer name="page.top">
            <block class="Magento\Cms\Block\Block"
                   name="home.banner"
                   before="-">
                <arguments>
                    <argument name="block_id" xsi:type="string">home-banner</argument>
                </arguments>
            </block>
        </referenceContainer>
        
        <!-- 移除侧边栏 -->
        <referenceContainer name="sidebar.main" remove="true"/>
    </body>
</page>
```

### 7.3 产品详情页（catalog_product_view.xml）

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <body>
        <!-- 添加自定义标签 -->
        <referenceBlock name="product.info.main">
            <block class="Magento\Framework\View\Element\Template"
                   name="product.custom.badge"
                   template="Magento_Catalog::product/badge.phtml"
                   before="product.info.price"/>
        </referenceBlock>
        
        <!-- 修改产品图片尺寸 -->
        <referenceBlock name="product.info.media.image">
            <arguments>
                <argument name="width" xsi:type="number">600</argument>
                <argument name="height" xsi:type="number">600</argument>
            </arguments>
        </referenceBlock>
    </body>
</page>
```

### 7.4 分类页（catalog_category_view.xml）

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <body>
        <!-- 添加分类 Banner -->
        <referenceContainer name="category.view.container">
            <block class="..." name="category.banner" before="-"/>
        </referenceContainer>
        
        <!-- 修改产品列表模式 -->
        <referenceBlock name="category.products.list">
            <arguments>
                <argument name="template" xsi:type="string">
                    Magento_Catalog::product/list/custom-grid.phtml
                </argument>
            </arguments>
        </referenceBlock>
    </body>
</page>
```

## 八、调试技巧

### 8.1 查看布局句柄

```php
// 在控制器或模板中
$layout = $this->getLayout();
$handles = $layout->getUpdate()->getHandles();
var_dump($handles);
```

### 8.2 启用模板路径提示

后台：Stores → Configuration → Advanced → Developer → Debug
- Template Path Hints: Yes
- Add Block Names to Hints: Yes

### 8.3 常用命令

```bash
# 清除缓存
php bin/magento cache:clean layout

# 查看已注册主题
php bin/magento dev:theme:list

# 部署静态文件
php bin/magento setup:static-content:deploy --theme=Folix/game-theme

# 清除静态文件
rm -rf pub/static/frontend/Folix/game-theme/*

# 查看布局文件
php bin/magento dev:xml:convert layout.xml
```

## 九、最佳实践

### 9.1 布局修改原则

1. **优先使用 referenceContainer/referenceBlock** - 不要完全覆盖
2. **使用 `<move>` 而非删除重建** - 保持功能完整
3. **保持父主题继承** - 利用 fallback 机制
4. **分离关注点** - 全局 vs 单页布局

### 9.2 样式组织原则

1. **变量集中管理** - _theme.less 或 _variables.less
2. **模块化样式** - extends/_module.less
3. **响应式优先** - 移动优先设计
4. **使用 Library 函数** - 避免硬编码

### 9.3 性能优化

1. **避免重复加载** - 合理使用 default.xml
2. **延迟加载 JS** - 使用 requirejs-config.js
3. **CSS 按需加载** - 模块级 _module.less
4. **缓存友好** - 合理使用 remove 和 display

## 十、Folix 主题当前状态

### 已完成
- ✅ default.xml - 全局头部布局
- ✅ _theme.less - 变量覆盖
- ✅ _header.less - 头部样式
- ✅ _footer.less - 底部样式
- ✅ _navigation.less - 导航样式
- ✅ _buttons.less - 按钮样式
- ✅ _products.less - 产品卡片样式
- ✅ _components.less - Hero Slider 组件
- ✅ slider.js - 轮播功能
- ✅ modal.js - 登录弹窗

### 待完善
- ⏳ catalog_product_view.xml - 产品详情页
- ⏳ catalog_category_view.xml - 分类页
- ⏳ customer_account.xml - 客户账户页
- ⏳ 产品列表模板优化
- ⏳ Page Builder 兼容性
