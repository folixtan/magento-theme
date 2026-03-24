# Folix Game Theme - 开发文档

## 📚 Magento 2.4.8 主题开发规范

### 核心规则

1. **变量覆盖**：在 `_theme.less` 中覆盖原生变量，避免样式错乱
2. **原生选择器**：使用 XML 和 phtml 定义的选择器，来源有两种：
   - XML 布局文件定义
   - phtml 模板文件定义

---

## 1️⃣ 颜色系统变量覆盖

### 关键颜色变量

```less
// 主题颜色
@theme__color__primary: #4A90E2;           // 主色
@theme__color__primary-alt: #6C5CE7;       // 次色
@theme__color__secondary: #FF6B35;         // 强调色

// 文字颜色
@primary__color: #1E293B;                   // 主要文字
@primary__color__lighter: #64748B;          // 浅色文字

// 背景颜色
@page__background-color: #F8FAFC;           // 页面背景
@panel__background-color: #F1F5F9;          // 面板背景

// 边框颜色
@border-color__base: #E2E8F0;               // 基础边框

// 链接颜色
@link__color: @theme__color__primary;
@link__hover__color: @theme__color__secondary;
```

---

## 2️⃣ 原生选择器来源

### XML 布局文件

| 选择器 | XML 文件 |
|--------|----------|
| `.page-header` | `default.xml` - header.container |
| `.panel.wrapper` | `default.xml` - header.panel |
| `.header.content` | `default.xml` - header-wrapper |
| `.page-footer` | `default.xml` - footer-container |
| `.page-main` | `default.xml` - main.content |

### phtml 模板文件

| 选择器 | phtml 文件 |
|--------|------------|
| `.logo` | `Magento_Theme/templates/html/header/logo.phtml` |
| `.nav-toggle` | `Magento_Theme/templates/html/header/logo.phtml` |
| `.navigation` | `Magento_Theme/templates/html/topmenu.phtml` |
| `.level0`, `.level-top` | `Magento_Theme/templates/html/topmenu.phtml` |
| `.submenu` | `Magento_Theme/templates/html/topmenu.phtml` |
| `.footer`, `.footer.links` | `Magento_Theme/templates/html/footer.phtml` |
| `.copyright` | `Magento_Theme/templates/html/copyright.phtml` |
| `.product-item` | `Magento_Catalog/templates/product/list.phtml` |
| `.product-item-info` | `Magento_Catalog/templates/product/list.phtml` |
| `.product-item-photo` | `Magento_Catalog/templates/product/list.phtml` |
| `.product-item-details` | `Magento_Catalog/templates/product/list.phtml` |
| `.product-item-name` | `Magento_Catalog/templates/product/list.phtml` |
| `.price-box` | `Magento_Catalog/templates/product/price/price.phtml` |
| `.action.primary` | 多处 phtml |
| `.action.tocart` | `Magento_Catalog/templates/product/list.phtml` |

---

## 3️⃣ `_extends.less` 机制

### 关键理解

1. **通过 `@import (reference)` 引入**
2. **直接选择器会正常输出**
3. **抽象类（`.abs-*`）需要 `&:extend()` 才会输出**
4. **与父主题合并，同选择器覆盖**

### 模块化组织

```
web/css/source/
├── _extends.less          # 引入模块文件
└── extends/
    ├── _global.less       # 全局样式
    ├── _header.less       # 头部样式
    ├── _footer.less       # 底部样式
    ├── _navigation.less   # 导航样式
    ├── _buttons.less      # 按钮样式
    ├── _products.less     # 产品样式
    ├── _components.less   # 自定义组件
    └── _abstracts.less    # 抽象类
```

---

## 4️⃣ 两种 CSS 编写方案

| 方案 | 文件 | 继承方式 | 适用场景 |
|------|------|----------|----------|
| **方案一** | `_extends.less` | 合并父主题 | 全局样式、轻量覆盖 |
| **方案二** | `Magento_*/_module.less` | 完全覆盖父主题 | 模块大改动 |

### 方案一：`_extends.less`

```less
// 使用原生选择器
.page-header {
    border-bottom: 3px solid @theme__color__secondary;
}
```

### 方案二：`_module.less`

```less
// 1. 必须先复制父主题变量
@header__background-color: false;
@header-panel__background-color: @color-gray-middle4;

// 2. 然后扩展样式
.page-header {
    // 自定义样式
}
```

---

## 5️⃣ 样式包裹规则

```less
// 公共样式
& when (@media-common = true) {
    // 样式
}

// 桌面端
.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    // 样式
}

// 移动端
.media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__m) {
    // 样式
}
```

---

## 6️⃣ 文件结构

```
Folix/game-theme/
├── web/css/source/
│   ├── _theme.less          # 覆盖原生变量
│   ├── _variables.less       # 自定义变量
│   ├── _extends.less         # 引入模块文件
│   └── extends/
│       ├── _global.less
│       ├── _header.less
│       ├── _footer.less
│       ├── _navigation.less
│       ├── _buttons.less
│       ├── _products.less
│       ├── _components.less
│       └── _abstracts.less
├── Magento_Theme/
│   ├── web/css/source/_module.less
│   └── layout/default.xml
├── Magento_Catalog/
│   └── web/css/source/_module.less
├── etc/view.xml
├── theme.xml
└── registration.php
```

---

**版本**: 2.0.0  
**最后更新**: 2026-03-22
