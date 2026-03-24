# Magento 2 布局与CSS完整指南

基于官方文档：https://developer.adobe.com/commerce/frontend-core/guide/

---

## 第一部分：布局系统 (Layouts)

### 一、布局基本概念

#### 1.1 三个核心组件

```
┌─────────────────────────────────────────────────────────────┐
│  Layout (布局)                                                │
│  ├── Container (容器) - 占位符                                 │
│  │   ├── Block (块) - UI组件                                   │
│  │   ├── Block (块)                                           │
│  │   └── Container (容器)                                      │
│  │       └── Block (块)                                       │
│  └── Container (容器)                                         │
└─────────────────────────────────────────────────────────────┘
```

- **Layout**: 页面结构，定义在XML文件中
- **Container**: 页面占位符（如header、footer、main content）
- **Block**: UI控件或组件（如产品列表、购物车、导航）

#### 1.2 页面布局类型

Magento提供以下页面布局：

| 布局类型 | 说明 |
|---------|------|
| `empty` | 空白布局 |
| `1column` | 单列布局 |
| `2columns-left` | 左侧栏+主内容 |
| `2columns-right` | 主内容+右侧栏 |
| `3columns` | 三列布局 |

**设置页面布局：**

```xml
<page layout="2columns-left" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    ...
</page>
```

---

### 二、布局文件类型

#### 2.1 按作用范围分类

| 文件名 | 作用范围 | 说明 |
|--------|---------|------|
| `default.xml` | 全局 | 所有页面加载 |
| `default_head_blocks.xml` | 全局HEAD | CSS/JS引入 |
| `cms_index_index.xml` | 首页 | 仅首页加载 |
| `catalog_product_view.xml` | 产品页 | 仅产品详情页 |
| `catalog_category_view.xml` | 分类页 | 仅分类页 |
| `customer_account.xml` | 客户账户 | 账户相关页面 |
| `checkout_index_index.xml` | 结账页 | 仅结账页 |

#### 2.2 按文件类型分类

**1. Page Configuration (页面配置)**
- 文件：`*.xml` 在 `layout/` 目录
- 作用：完整页面结构定义
- 根元素：`<page>`

**2. Page Layout (页面布局)**
- 文件：`*.xml` 在 `page_layout/` 目录
- 作用：定义页面骨架（列结构）
- 根元素：`<layout>`

**3. Generic Layout (通用布局)**
- 文件：`*.xml` 在 `layout/` 目录
- 作用：可重用的布局片段
- 根元素：`<layout>`

---

### 三、布局指令详解

#### 3.1 `<block>` - 定义块

```xml
<block class="Magento\Framework\View\Element\Template"
       name="custom.block"
       template="Magento_Theme::html/custom.phtml"
       before="-"
       after="another.block"
       cacheable="true"
       display="true">
    <arguments>
        <argument name="title" xsi:type="string">Block Title</argument>
        <argument name="show_button" xsi:type="boolean">true</argument>
        <argument name="limit" xsi:type="number">10</argument>
    </arguments>
</block>
```

**属性详解：**

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `class` | string | 否 | 块类名，默认 `Magento\Framework\View\Element\Template` |
| `name` | string | 推荐 | 唯一标识符，字母开头，可包含字母数字下划线中横线 |
| `template` | string | 否 | 模板路径，格式 `Module::path/to/template.phtml` |
| `before` | string | 否 | 位置：在某个块之前，`-` 表示最前 |
| `after` | string | 否 | 位置：在某个块之后，`-` 表示最后 |
| `cacheable` | boolean | 否 | 是否缓存，默认 true |
| `display` | boolean | 否 | 是否显示，默认 true |

**常用块类型：**

```xml
<!-- 模板块 -->
<block class="Magento\Framework\View\Element\Template"/>

<!-- 文本块 -->
<block class="Magento\Framework\View\Element\Text">
    <arguments>
        <argument name="text" xsi:type="string"><![CDATA[<div>HTML内容</div>]]></argument>
    </arguments>
</block>

<!-- CMS块 -->
<block class="Magento\Cms\Block\Block" name="cms.block">
    <arguments>
        <argument name="block_id" xsi:type="string">block-identifier</argument>
    </arguments>
</block>

<!-- 产品列表 -->
<block class="Magento\Catalog\Block\Product\ListProduct" name="product.list"/>

<!-- Logo -->
<block class="Magento\Theme\Block\Html\Header\Logo" name="logo"/>

<!-- 导航 -->
<block class="Magento\Theme\Block\Html\Topmenu" name="catalog.topnav"/>
```

#### 3.2 `<container>` - 定义容器

```xml
<container name="custom.container"
           label="Custom Container"
           htmlTag="div"
           htmlClass="custom-container"
           htmlId="custom-id"
           before="other.container"
           after="-">
    <!-- 子元素 -->
</container>
```

**属性详解：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `name` | string | 唯一标识符 |
| `label` | string | 容器标签（后台显示） |
| `htmlTag` | string | HTML标签：div, section, header, footer, nav |
| `htmlClass` | string | CSS类名 |
| `htmlId` | string | HTML ID |
| `before` | string | 位置控制 |
| `after` | string | 位置控制 |

#### 3.3 `<referenceBlock>` - 引用块

**修改块参数：**

```xml
<referenceBlock name="block.name">
    <arguments>
        <argument name="title" xsi:type="string">New Title</argument>
        <argument name="template" xsi:type="string">Module::new/template.phtml</argument>
    </arguments>
</referenceBlock>
```

**删除块：**

```xml
<!-- 完全删除（不渲染） -->
<referenceBlock name="block.name" remove="true"/>

<!-- 隐藏块（渲染但不显示） -->
<referenceBlock name="block.name" display="false"/>
```

**调用块方法：**

```xml
<referenceBlock name="block.name">
    <action method="setTemplate">
        <argument name="template" xsi:type="string">
            Module::custom/template.phtml
        </argument>
    </action>
    <action method="addLink">
        <argument name="label" xsi:type="string">Link Text</argument>
        <argument name="url" xsi:type="string">path/to/page</argument>
    </action>
</referenceBlock>
```

#### 3.4 `<referenceContainer>` - 引用容器

**添加内容到容器：**

```xml
<referenceContainer name="header.container">
    <block class="..." name="header.custom" before="-"/>
</referenceContainer>

<referenceContainer name="footer">
    <block class="..." name="footer.links" after="-"/>
</referenceContainer>
```

**删除容器：**

```xml
<referenceContainer name="sidebar.main" remove="true"/>
```

#### 3.5 `<move>` - 移动元素

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

<!-- 移动购物车到最后 -->
<move element="minicart" destination="header-wrapper" after="-"/>

<!-- 移动语言切换器 -->
<move element="store_language" destination="header.panel" after="-"/>
```

#### 3.6 `<update>` - 引入布局

```xml
<!-- 引入其他布局句柄 -->
<update handle="default_head_blocks"/>
<update handle="customer_account"/>
```

#### 3.7 `<remove>` - 移除资源

仅用于 `<head>` 中：

```xml
<head>
    <remove src="css/to-remove.css"/>
    <remove src="Magento_Module::js/old.js"/>
</head>
```

---

### 四、HEAD区域操作

#### 4.1 添加CSS

```xml
<head>
    <!-- 主题CSS -->
    <css src="css/custom.css"/>
    <css src="css/print.css" media="print"/>
    
    <!-- 模块CSS -->
    <css src="Magento_Catalog::css/product.css"/>
    
    <!-- 外部CSS -->
    <css src="https://example.com/styles.css" src_type="url"/>
    
    <!-- 内联CSS -->
    <css>
        <text>.custom-class { color: red; }</text>
    </css>
</head>
```

#### 4.2 添加JavaScript

```xml
<head>
    <!-- 本地JS -->
    <script src="js/custom.js"/>
    <script src="Magento_Module::js/script.js"/>
    
    <!-- 异步/延迟加载 -->
    <script src="js/async.js" async="async"/>
    <script src="js/defer.js" defer="defer"/>
    
    <!-- 外部JS -->
    <script src="https://example.com/script.js" src_type="url"/>
</head>
```

#### 4.3 添加其他资源

```xml
<head>
    <!-- Meta标签 -->
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content="Page description"/>
    
    <!-- Link标签 -->
    <link rel="stylesheet" type="text/css" src="https://fonts.googleapis.com/css?family=Inter" src_type="url"/>
    <link rel="icon" type="image/x-icon" href="favicon.ico"/>
    
    <!-- 标题 -->
    <title>Page Title</title>
</head>
```

---

### 五、布局文件组织

#### 5.1 模块布局

```
app/code/Vendor/Module/view/frontend/
├── layout/
│   ├── default.xml              # 全局布局
│   ├── default_head_blocks.xml  # HEAD资源
│   ├── catalog_product_view.xml # 产品页布局
│   └── ...
└── page_layout/
    └── custom_layout.xml        # 自定义页面布局
```

#### 5.2 主题布局

```
app/design/frontend/Vendor/theme/
├── Magento_Theme/
│   └── layout/
│       ├── default.xml
│       └── default_head_blocks.xml
├── Magento_Catalog/
│   └── layout/
│       ├── catalog_product_view.xml
│       └── catalog_category_view.xml
└── Magento_Cms/
    └── layout/
        └── cms_index_index.xml
```

---

## 第二部分：CSS/Less样式系统

### 一、CSS预处理机制

#### 1.1 Less编译模式

Magento支持两种Less编译模式：

**1. 服务端编译（默认，推荐）**
- 在服务器端使用PHP Less编译器
- 生产模式唯一选项
- 编译后存储在 `pub/static/`

**2. 客户端编译**
- 在浏览器中使用less.js编译
- 仅用于开发模式
- 便于实时调试

**设置编译模式：**

```
Admin → Stores → Configuration → Advanced → Developer
→ Frontend development workflow → Workflow type
```

#### 1.2 编译流程

```
.less 文件
    ↓ (Less预处理器)
解析 @import 指令
    ↓
回退机制查找文件
    ↓
复制到 var/view_preprocessed/less/
    ↓
PHP Less编译器编译
    ↓
.css 文件
    ↓
发布到 pub/static/
```

#### 1.3 根源文件

编译后的CSS文件对应的Less根源文件：

| CSS文件 | Less根源文件 |
|---------|-------------|
| `css/styles-m.css` | `<theme_dir>/web/css/styles-m.less` |
| `css/styles-l.css` | `<theme_dir>/web/css/styles-l.less` |
| `css/print.css` | `<theme_dir>/web/css/print.less` |

---

### 二、样式文件组织

#### 2.1 目录结构

```
<theme_dir>/web/css/
├── source/
│   ├── _variables.less       # 自定义变量
│   ├── _theme.less           # 覆盖父主题变量
│   ├── _extends.less         # 样式扩展
│   ├── _module.less          # 模块样式入口
│   └── extends/
│       ├── _header.less      # 头部样式
│       ├── _footer.less      # 底部样式
│       ├── _navigation.less  # 导航样式
│       ├── _buttons.less     # 按钮样式
│       ├── _products.less    # 产品样式
│       └── _components.less  # 组件样式
├── styles-m.less             # 移动端根源文件
├── styles-l.less             # 桌面端根源文件
└── print.less                # 打印样式
```

#### 2.2 文件加载顺序

```
1. lib/web/css/source/lib/_variables.less      # Magento UI Library变量
2. lib/web/css/source/lib/_reset.less          # 重置样式
3. Magento/blank: _variables.less               # Blank主题变量
4. Magento/luma: _theme.less                    # Luma主题变量
5. <your_theme>: _variables.less                # 你的变量
6. <your_theme>: _theme.less                    # 覆盖父主题变量
7. <your_theme>: _extends.less                  # 样式扩展
```

---

### 三、变量覆盖 (_theme.less)

#### 3.1 颜色变量

```less
// 主色调
@theme__color__primary: #4A90E2;            // 主色
@theme__color__primary-alt: #6C5CE7;        // 搭配色
@theme__color__secondary: #FF6B35;          // 强调色

// 文字颜色
@primary__color: #1E293B;                   // 主文字
@primary__color__lighter: #64748B;          // 次文字
@primary__color__light: #94A3B8;            // 弱化文字

// 背景颜色
@page__background-color: #F8FAFC;           // 页面背景
@panel__background-color: #F1F5F9;          // 面板背景

// 边框颜色
@border-color__base: #E2E8F0;               // 基础边框

// 错误/成功颜色
@error__color: #EF4444;                     // 错误色
@success__color: #10B981;                   // 成功色
```

#### 3.2 排版变量

```less
// 字体
@font-family-name__base: 'Inter';
@font-family__base: @font-family-name__base, -apple-system, sans-serif;

// 字重
@font-weight__regular: 400;
@font-weight__semibold: 600;
@font-weight__bold: 700;

// 链接
@link__color: @theme__color__primary;
@link__hover__color: @theme__color__secondary;
@link__active__color: @theme__color__secondary;
```

#### 3.3 按钮变量

```less
// 默认按钮
@button__border-radius: 6px;
@button__font-weight: @font-weight__semibold;

// 主要按钮
@button-primary__background: @theme__color__primary;
@button-primary__border: 1px solid @theme__color__primary;
@button-primary__color: #FFFFFF;
@button-primary__hover__background: @theme__color__secondary;
@button-primary__hover__border: 1px solid @theme__color__secondary;

// 按钮阴影
@button__shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
```

#### 3.4 表单变量

```less
@form-element-input__background: #FFFFFF;
@form-element-input__border-color: @border-color__base;
@form-element-input__border-radius: 6px;
@form-element-input__height: 38px;
@form-element-input__focus__border: 1px solid @theme__color__primary;
@form-element-input-placeholder__color: #94A3B8;
```

---

### 四、样式扩展 (_extends.less)

#### 4.1 基本结构

```less
//
//  Common (所有设备)
//  _____________________________________________

& when (@media-common = true) {
    // 公共样式
    
    .your-custom-class {
        color: @primary__color;
    }
}

//
//  Desktop (>= 768px)
//  _____________________________________________

.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    // 桌面端样式
    
    .your-custom-class {
        font-size: 16px;
    }
}

//
//  Mobile (< 768px)
//  _____________________________________________

.media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__m) {
    // 移动端样式
    
    .your-custom-class {
        font-size: 14px;
    }
}
```

#### 4.2 Magento UI Library 函数

```less
// CSS属性
.lib-css(background, @color);
.lib-css(color, @text-color);
.lib-css(border-radius, 6px);

// 渐变
.lib-background-gradient(
    @_background-gradient: true,
    @_background-gradient-direction: vertical,
    @_background-gradient-color-start: #1E293B,
    @_background-gradient-color-end: #0F172A
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

// 链接
.lib-link(
    @_link-color: @link__color,
    @_link-hover-color: @link__hover__color
);
```

---

### 五、响应式设计

#### 5.1 默认断点

```less
@screen__xs: 480px;    // 超小屏幕
@screen__s: 640px;     // 小屏幕
@screen__m: 768px;     // 中屏幕（平板）
@screen__l: 1024px;    // 大屏幕（桌面）
@screen__xl: 1440px;   // 超大屏幕
```

#### 5.2 使用示例

```less
// 移动端优先
.element {
    font-size: 14px;
    
    // >= 768px
    .media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
        font-size: 16px;
    }
    
    // >= 1024px
    .media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__l) {
        font-size: 18px;
    }
}

// 桌面端优先
.element {
    font-size: 18px;
    
    // < 1024px
    .media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__l) {
        font-size: 16px;
    }
    
    // < 768px
    .media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__m) {
        font-size: 14px;
    }
}
```

---

### 六、CSS性能优化

#### 6.1 CSS合并

```
Admin → Stores → Configuration → Advanced → Developer
→ CSS Settings → Merge CSS Files: Yes
```

减少HTTP请求数量。

#### 6.2 CSS压缩

```
Admin → Stores → Configuration → Advanced → Developer
→ CSS Settings → Minify CSS Files: Yes
```

减少文件大小。

#### 6.3 Critical CSS

```
Admin → Stores → Configuration → Advanced → Developer
→ CSS Settings → Use CSS Critical Path: Yes
```

消除渲染阻塞CSS资源。

---

## 第三部分：实际应用

### 一、Folix Game Theme 实现

#### 1.1 继承链

```
Magento/blank (基础主题)
    ↓
Magento/luma (父主题)
    ↓
Folix/game-theme (子主题)
```

#### 1.2 布局实现

**default.xml - 全局布局：**

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <body>
        <!-- Top Bar 3列布局 -->
        <referenceContainer name="header.panel">
            <container name="folix.top.left" htmlTag="div" htmlClass="header-links-left" before="-"/>
            <container name="folix.top.center" htmlTag="div" htmlClass="header-links-center" after="folix.top.left"/>
            <container name="folix.top.right" htmlTag="div" htmlClass="header-links-right" after="folix.top.center"/>
        </referenceContainer>
        
        <!-- Main Bar -->
        <move element="logo" destination="header-wrapper" before="-"/>
        <move element="navigation.sections" destination="header-wrapper" after="logo"/>
        <move element="top.search" destination="header-wrapper" after="navigation.sections"/>
        
        <!-- 删除不需要的元素 -->
        <referenceBlock name="header.links" remove="true"/>
        <referenceBlock name="catalog.compare.link" remove="true"/>
    </body>
</page>
```

#### 1.3 样式实现

**_theme.less - 变量覆盖：**

```less
// 主色调
@theme__color__primary: #4A90E2;
@theme__color__secondary: #FF6B35;

// 文字颜色
@primary__color: #1E293B;
@primary__color__lighter: #64748B;
```

**_extends.less - 样式扩展：**

```less
& when (@media-common = true) {
    // Top Bar
    .panel.header {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        height: 40px;
    }
    
    .header-links-left {
        flex-shrink: 0;
    }
    
    .header-links-center {
        flex: 1;
    }
    
    .header-links-right {
        flex-shrink: 0;
    }
}
```

---

### 二、最佳实践

#### 2.1 布局开发

1. **使用 `<referenceBlock>` 和 `<referenceContainer>`** 而非覆盖
2. **使用 `<move>` 移动元素** 而非删除重建
3. **始终为 block 设置 name** 便于引用
4. **分离全局和单页布局** default.xml vs 专用布局

#### 2.2 样式开发

1. **变量集中管理** 在 `_theme.less` 中
2. **模块化样式** 每个组件一个文件
3. **移动优先** 使用响应式断点
4. **避免硬编码** 使用变量和Library函数

#### 2.3 调试技巧

1. **启用模板路径提示** 查看块和模板位置
2. **清除缓存** layout, block_html, full_page
3. **检查编译后的CSS** pub/static/ 中的文件
4. **使用浏览器开发者工具** 检查样式来源

---

## 参考资源

- [Layouts Documentation](https://developer.adobe.com/commerce/frontend-core/guide/layouts/)
- [CSS Documentation](https://developer.adobe.com/commerce/frontend-core/guide/css/)
- [Theme Inheritance](https://developer.adobe.com/commerce/frontend-core/guide/themes/inheritance)
- [Magento UI Library](https://developer.adobe.com/commerce/frontend-core/guide/css/)
