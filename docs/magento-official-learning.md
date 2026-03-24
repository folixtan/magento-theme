# Magento 2 主题开发完整学习笔记

基于官方文档：https://developer.adobe.com/commerce/frontend-core/guide/themes/

---

## 一、主题继承 (Theme Inheritance)

### 1.1 核心概念

**主题继承** 使你可以轻松扩展主题并减少维护工作。你可以使用现有主题作为自定义的基础，而不需要复制大量主题文件。

**关键点：**
- 继承层级不受限制
- 基于 **fallback mechanism**（回退机制）
- 如果在当前主题中找不到视图文件，系统会在祖先主题、模块视图文件或库中搜索

### 1.2 设置父主题

在 `theme.xml` 中声明：

```xml
<theme xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
       xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/theme.xsd">
    <title>Folix Game Theme</title>
    <parent>Magento/luma</parent>
    <media>
        <preview_image>media/preview.jpg</preview_image>
    </media>
</theme>
```

### 1.3 父子主题关系

- **子主题继承**：视图配置、模板、布局、静态文件
- **使用顺序**：子主题优先，父主题间接激活
- **任何主题都可以显示**，无论是否指定父主题

### 1.4 Fallback 机制

#### 静态资源（CSS、JS、图片、字体）

**无模块上下文：**
```
1. 当前主题静态文件（特定语言）: <theme_dir>/web/i18n/<locale>/
2. 当前主题静态文件: <theme_dir>/web/
3. 祖先主题静态文件（递归）:
   - <parent_theme_dir>/web/i18n/<locale>/
   - <parent_theme_dir>/web/
4. 库静态文件: lib/web/
```

**有模块上下文：**
```
1. 当前主题模块静态文件: <theme_dir>/<Namespace>_<Module>/web/
   例：app/design/frontend/Folix/game-theme/Magento_Catalog/web/

2. 祖先主题模块静态文件（递归）:
   - <parent_theme_dir>/web/i18n/<locale>/<Namespace>_<Module>
   - <parent_theme_dir>/<Namespace>_<Module>/web/

3. 模块静态文件（对应区域）:
   - 前台：<module_dir>/view/frontend/web/
   - 后台：<module_dir>/view/adminhtml/web/
   - 基础：<module_dir>/view/base/web/
```

#### 布局和模板文件

```
1. 当前主题: <theme_dir>/<Namespace>_<Module>/layout/
2. 祖先主题（递归）: <parent_theme_dir>/<Namespace>_<Module>/layout/
3. 模块布局: <module_dir>/view/<area>/layout/
```

---

## 二、布局系统 (Layouts)

### 2.1 基本概念

**三个核心组件：**

1. **Layout（布局）** - 页面结构（XML文件）
2. **Container（容器）** - 页面占位符（如 header、footer、main content）
3. **Block（块）** - UI控件或组件（如产品列表、购物车、导航）

### 2.2 布局文件类型

| 文件名 | 作用 | 加载范围 |
|--------|------|----------|
| `default.xml` | 全局布局 | 所有页面 |
| `default_head_blocks.xml` | HEAD区域 | 所有页面 |
| `cms_index_index.xml` | 首页布局 | 仅首页 |
| `catalog_product_view.xml` | 产品详情页 | 仅产品页 |
| `catalog_category_view.xml` | 分类页 | 仅分类页 |
| `customer_account.xml` | 客户账户 | 账户相关页面 |
| `checkout_index_index.xml` | 结账页 | 仅结账页 |

### 2.3 布局指令 (Layout Instructions)

#### `<block>` - 定义块

```xml
<block class="Magento\Framework\View\Element\Template"
       name="block.name"
       template="Module::path/to/template.phtml"
       before="-"
       after="another.block"
       cacheable="true">
    <arguments>
        <argument name="title" xsi:type="string">Title</argument>
    </arguments>
</block>
```

**属性：**
- `class` - 块类名（默认：`Magento\Framework\View\Element\Template`）
- `name` - 唯一标识符（推荐始终设置）
- `template` - 模板文件路径
- `before` / `after` - 位置控制（`-` 表示最前/最后）
- `display` - 是否显示（`true`/`false`）
- `cacheable` - 是否缓存

#### `<container>` - 定义容器

```xml
<container name="container.name"
           label="Container Label"
           htmlTag="div"
           htmlClass="container-class"
           htmlId="container-id"
           before="other.container"
           after="-">
    <!-- 子元素 -->
</container>
```

**属性：**
- `name` - 唯一标识符
- `label` - 容器标签
- `htmlTag` - HTML标签（`div`, `section`, `header`, `footer`, `nav`）
- `htmlClass` - CSS类名
- `htmlId` - HTML ID
- `before` / `after` - 位置控制

#### `<referenceBlock>` - 引用块（修改）

```xml
<!-- 修改块参数 -->
<referenceBlock name="block.name">
    <arguments>
        <argument name="title" xsi:type="string">New Title</argument>
    </arguments>
    
    <!-- 添加动作 -->
    <action method="setTemplate">
        <argument name="template" xsi:type="string">
            Module::new/template.phtml
        </argument>
    </action>
</referenceBlock>

<!-- 删除块 -->
<referenceBlock name="block.name" remove="true"/>

<!-- 隐藏块（保留DOM） -->
<referenceBlock name="block.name" display="false"/>
```

#### `<referenceContainer>` - 引用容器（添加内容）

```xml
<referenceContainer name="header.container">
    <block class="..." name="header.custom" before="-"/>
</referenceContainer>

<!-- 删除容器 -->
<referenceContainer name="container.name" remove="true"/>
```

#### `<move>` - 移动元素

```xml
<move element="block.name"
      destination="target.container"
      before="-|block.name"
      after="-|block.name"/>
```

**示例：**
```xml
<!-- 移动Logo到最前面 -->
<move element="logo" destination="header-wrapper" before="-"/>

<!-- 移动搜索框到导航后面 -->
<move element="top.search" destination="header-wrapper" after="navigation.sections"/>
```

#### `<update>` - 引入其他布局

```xml
<update handle="default_head_blocks"/>
```

#### `<action>` - 调用块方法

```xml
<block class="Magento\Catalog\Block\Product\ListProduct" name="product.list">
    <action method="setTemplate">
        <argument name="template" xsi:type="string">
            Magento_Catalog::product/list/custom.phtml
        </argument>
    </action>
</block>
```

---

## 三、模板系统 (Templates)

### 3.1 模板基础

模板文件使用 `.phtml` 扩展名，包含HTML和PHP代码。

**基本结构：**
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

### 3.2 常用方法

```php
// 获取URL
$block->getUrl('module/controller/action');
$block->getBaseUrl();

// 获取视图文件URL
$block->getViewFileUrl('images/logo.png');

// 获取布局
$block->getLayout();

// 获取子块
$block->getChildHtml('child.block.name');

// 获取块
$block->getBlockHtml('block.name');

// 转义
$block->escapeHtml($text);
$block->escapeUrl($url);
$block->escapeJs($js);

// 获取配置
$block->getConfig('path/to/config');

// Store信息
$block->getStoreId();
$block->getStoreCode();
```

### 3.3 视图模型 (ViewModel)

**在布局XML中注入：**
```xml
<referenceBlock name="block.name">
    <arguments>
        <argument name="view_model" xsi:type="object">
            Vendor\Module\ViewModel\Custom
        </argument>
    </arguments>
</referenceBlock>
```

**在模板中使用：**
```php
/** @var \Vendor\Module\ViewModel\Custom $viewModel */
$viewModel = $block->getViewModel();
$data = $viewModel->getCustomData();
```

---

## 四、样式系统 (CSS/Less)

### 4.1 文件组织

```
<theme_dir>/web/css/source/
├── _variables.less      # 自定义变量
├── _theme.less          # 覆盖父主题变量
├── _extends.less        # 样式扩展
├── _module.less         # 模块样式
└── extends/
    ├── _header.less     # 头部样式
    ├── _footer.less     # 底部样式
    └── ...
```

### 4.2 文件加载顺序

```
1. lib/web/css/source/lib/_variables.less    # Magento UI Library变量
2. Magento/blank: _variables.less             # Blank主题变量
3. Magento/luma: _theme.less                  # Luma主题变量
4. <your_theme>/web/css/source/_variables.less  # 你的变量
5. <your_theme>/web/css/source/_theme.less       # 覆盖父主题变量
6. <your_theme>/web/css/source/_extends.less     # 样式扩展
```

### 4.3 变量覆盖 (_theme.less)

```less
// 覆盖父主题变量
@theme__color__primary: #4A90E2;
@theme__color__secondary: #FF6B35;

// 新增变量
@color-accent__primary: #FF6B35;
@header__height: 70px;
```

### 4.4 样式扩展 (_extends.less)

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

### 4.5 Magento UI Library 常用函数

```less
// CSS属性
.lib-css(background, @color);
.lib-css(color, @text-color);

// 渐变
.lib-background-gradient(
    @_background-gradient: true,
    @_background-gradient-direction: vertical,
    @_background-gradient-color-start: @color-start,
    @_background-gradient-color-end: @color-end
);

// 按钮
.lib-button-primary();
.lib-button-secondary();

// 排版
.lib-typography(
    @_font-size: 14px,
    @_font-weight: 400,
    @_line-height: 1.5
);
```

---

## 五、核心容器结构

### 5.1 Luma 默认容器

```
<root>
├── after.body.start          # body开始后
├── global.notices            # 全局通知
├── header.container          # 头部容器
│   ├── header.panel          # 顶部栏（语言、货币）
│   ├── header-wrapper        # 头部主体
│   │   ├── logo              # Logo
│   │   ├── top.search        # 搜索框
│   │   ├── minicart          # 购物车
│   │   └── customer.section  # 客户区域
│   └── navigation.sections   # 导航
├── page.wrapper              # 页面主体包装
│   ├── page.top              # 页面顶部（面包屑、消息）
│   ├── main.content          # 主内容区
│   │   ├── columns.top
│   │   ├── main              # 主列
│   │   ├── sidebar.main      # 主侧边栏
│   │   └── sidebar.additional
│   └── page.bottom
├── footer-container          # 底部容器
│   ├── footer
│   └── copyright
└── before.body.end           # body结束前
```

### 5.2 常用容器名称

**头部容器：**
- `header.container` - 头部主容器
- `header.panel` - 顶部栏
- `header-wrapper` - Logo、搜索、购物车
- `navigation.sections` - 导航菜单

**页面容器：**
- `page.wrapper` - 页面包装器
- `page.top` - 页面顶部
- `main.content` - 主内容区
- `main` - 主列
- `columns` - 列容器
- `sidebar.main` - 主侧边栏
- `sidebar.additional` - 附加侧边栏

**底部容器：**
- `footer-container` - 底部容器
- `footer` - 底部内容
- `copyright` - 版权信息

---

## 六、布局句柄 (Layout Handles)

### 6.1 全局句柄

| 句柄 | 说明 |
|------|------|
| `default` | 所有页面 |
| `default_head_blocks` | HEAD区域 |

### 6.2 CMS页面

| 句柄 | 说明 |
|------|------|
| `cms_index_index` | 首页 |
| `cms_page_view` | CMS页面 |
| `cms_page_view_id_{identifier}` | 特定CMS页面 |

### 6.3 Catalog页面

| 句柄 | 说明 |
|------|------|
| `catalog_category_view` | 分类页 |
| `catalog_category_view_id_{id}` | 特定分类 |
| `catalog_product_view` | 产品详情页 |
| `catalog_product_view_id_{id}` | 特定产品 |
| `catalogsearch_result_index` | 搜索结果页 |

### 6.4 Customer页面

| 句柄 | 说明 |
|------|------|
| `customer_account_login` | 登录页 |
| `customer_account_create` | 注册页 |
| `customer_account_index` | 账户仪表板 |
| `customer_account_edit` | 编辑账户 |

### 6.5 Checkout页面

| 句柄 | 说明 |
|------|------|
| `checkout_index_index` | 购物车/结账页 |
| `checkout_onepage_success` | 订单成功页 |

---

## 七、响应式断点

### 7.1 Magento 默认断点

```less
@screen__xs: 480px;    // 超小屏幕
@screen__s: 640px;     // 小屏幕
@screen__m: 768px;     // 中屏幕（平板）
@screen__l: 1024px;    // 大屏幕（桌面）
@screen__xl: 1440px;   // 超大屏幕
```

### 7.2 使用方法

```less
// 公共样式
& when (@media-common = true) {
    .element {
        font-size: 14px;
    }
}

// >= 768px (桌面)
.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    .element {
        font-size: 16px;
    }
}

// < 768px (移动端)
.media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__m) {
    .element {
        font-size: 14px;
    }
}
```

---

## 八、最佳实践

### 8.1 布局修改原则

1. **优先使用 `<referenceBlock>` 和 `<referenceContainer>`** - 不要完全覆盖
2. **使用 `<move>` 而非删除重建** - 保持功能完整
3. **保持父主题继承** - 利用 fallback 机制
4. **分离关注点** - 全局布局 vs 单页布局
5. **始终为 block 设置 name** - 便于引用和调试

### 8.2 样式组织原则

1. **变量集中管理** - `_theme.less` 或 `_variables.less`
2. **模块化样式** - `extends/_module.less`
3. **响应式优先** - 移动优先设计
4. **使用 Library 函数** - 避免硬编码
5. **使用 `!important` 谨慎** - 仅在必要时使用

### 8.3 模板开发原则

1. **始终转义输出** - `escapeHtml()`, `escapeUrl()`
2. **使用 ViewModel** - 分离业务逻辑
3. **避免硬编码** - 使用布局参数
4. **保持模板简洁** - 逻辑放在块类中

---

## 九、调试技巧

### 9.1 启用模板路径提示

后台路径：
```
Stores → Configuration → Advanced → Developer → Debug
- Template Path Hints: Yes
- Add Block Names to Hints: Yes
```

### 9.2 常用命令

```bash
# 清除缓存
php bin/magento cache:clean
php bin/magento cache:clean layout block_html full_page

# 查看已注册主题
php bin/magento dev:theme:list

# 部署静态文件
php bin/magento setup:static-content:deploy --theme=Folix/game-theme

# 清除静态文件
rm -rf pub/static/frontend/Folix/game-theme/*
rm -rf var/view_preprocessed/pub/static/frontend/Folix/game-theme/*

# 编译Less
php bin/magento dev:source-theme:deploy

# 查看布局句柄
php bin/magento dev:query:layout --handle=default
```

### 9.3 检查编译后的CSS

```bash
# 查看编译后的样式
cat pub/static/frontend/Folix/game-theme/en_US/css/styles-m.css | grep -A 10 "\.panel\.wrapper"

# 检查Less编译错误
tail -f var/log/system.log
```

---

## 十、Folix Game Theme 应用

### 10.1 继承链

```
Magento/blank
    ↓
Magento/luma
    ↓
Folix/game-theme
```

### 10.2 当前实现

**已实现：**
- ✅ 主题声明 (`theme.xml`)
- ✅ 全局布局 (`default.xml`)
- ✅ 变量覆盖 (`_theme.less`)
- ✅ 样式扩展 (`_extends.less`)
- ✅ 头部样式 (`_header.less`)
- ✅ 底部样式 (`_footer.less`)
- ✅ 组件样式 (`_components.less`)
- ✅ Hero Slider

**待完善：**
- ⏳ 产品详情页布局
- ⏳ 分类页布局
- ⏳ 客户账户布局
- ⏳ 移动端响应式优化

---

## 参考文档

- [Theme Inheritance](https://developer.adobe.com/commerce/frontend-core/guide/themes/inheritance)
- [Layouts](https://developer.adobe.com/commerce/frontend-core/guide/layouts/)
- [Layout Instructions](https://developer.adobe.com/commerce/frontend-core/guide/layouts/xml-instructions/)
- [Templates](https://developer.adobe.com/commerce/frontend-core/guide/templates/)
- [CSS Preprocessing](https://developer.adobe.com/commerce/frontend-core/guide/css/)
