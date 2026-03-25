# Folix Game Theme - 开发规则与流程

## 1. 项目概述

### 1.1 基本信息
- **主题名称**: Folix Game Theme
- **主题类型**: Magento 2 电商主题
- **基础主题**: Magento/luma（继承链：Magento/blank → Magento/luma → Folix/game-theme）
- **Magento版本**: 2.4.8-p4
- **主题风格**: 游戏电商，渐变色方案（蓝#4A90E2 + 橙#FF6B35）

### 1.2 技术栈
- **样式**: Less (Magento UI Library)
- **模板**: PHP (Magento 2 Template System)
- **布局**: XML (Magento 2 Layout System)
- **脚本**: JavaScript (RequireJS + jQuery)
- **兼容性**: Page Builder

---

## 2. 目录结构

```
Folix/game-theme/
├── Magento_Theme/
│   ├── layout/
│   │   └── default.xml                    # 主布局文件
│   ├── templates/
│   │   └── html/
│   │       ├── header/                    # 头部模板
│   │       ├── footer/                    # 底部模板
│   │       ├── modal/                     # 模态框
│   │       └── slider/                    # 幻灯片
│   └── web/
│       └── js/
│           ├── mobile-header.js           # 移动端头部交互
│           ├── slider.js                  # 幻灯片功能
│           ├── modal.js                   # 模态框功能
│           └── marquee.js                 # 跑马灯功能
├── web/
│   └── css/
│       └── source/
│           ├── _variables.less            # 变量定义
│           ├── _theme.less                # 主题变量覆盖
│           ├── _extend.less               # 样式入口文件
│           └── extends/
│               ├── _global.less           # 全局样式
│               ├── _header.less           # 头部样式
│               ├── _footer.less           # 底部样式
│               ├── _navigation.less       # 导航样式（移动端+PC端）
│               ├── _buttons.less          # 按钮样式
│               ├── _products.less         # 产品样式
│               ├── _components.less       # 自定义组件
│               └── _abstracts.less        # 抽象类
└── composer.json
```

---

## 3. 编码规范

### 3.1 Less 规范

#### 3.1.1 样式组织原则
- **模块化**: 每个功能模块独立一个文件（如 `_navigation.less`, `_header.less`）
- **单一职责**: 每个文件只负责一个功能区域
- **命名约定**: 使用 Magento 原生选择器 + 自定义前缀 `folix-`

#### 3.1.2 响应式写法
```less
// ✅ 正确：使用 Magento 标准响应式写法
& when (@media-common = true) {
    // 公共样式（所有设备）
}

.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    // 桌面端样式（≥ 768px）
}

.media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__m) {
    // 移动端样式（< 768px）
}
```

#### 3.1.3 变量使用
```less
// ✅ 正确：使用已定义的变量
color: @folix-text-primary;
background: @folix-secondary;

// ❌ 错误：硬编码颜色值
color: #1E293B;  // 除非变量未定义

// ✅ 优先使用 Magento 原生变量
color: @primary__color;
border: @border-width__base solid @border-color__base;
```

#### 3.1.4 覆盖原则
```less
// ✅ 优先使用选择器优先级
.navigation .level0 > .level-top {
    color: @folix-text-primary;
}

// ❌ 避免滥用 !important
// ✅ 仅在必要时使用（如覆盖原生 Luma 样式）
.navigation .level0 > .level-top {
    color: @folix-text-primary !important;  // 覆盖原生白色文字
}
```

### 3.2 布局 XML 规范

#### 3.2.1 布局修改原则
- **扩展优于删除**: 使用 `referenceBlock` 扩展，避免 `remove`
- **移动优于删除**: 使用 `move` 重新定位元素
- **保持继承**: 不破坏父主题结构

#### 3.2.2 示例
```xml
<!-- ✅ 正确：扩展容器 -->
<referenceContainer name="header-wrapper">
    <block class="Magento\Theme\Block\Html\Topmenu" name="catalog.topnav.desktop" ... />
</referenceContainer>

<!-- ✅ 正确：移动元素 -->
<move element="top.search" destination="header-wrapper" before="minicart" />

<!-- ⚠️ 谨慎：删除元素 -->
<referenceBlock name="navigation.sections" remove="true" />
```

### 3.3 JavaScript 规范

#### 3.3.1 模块定义
```js
define([
    'jquery',
    'matchMedia',
    'domReady!'
], function ($, mediaCheck) {
    'use strict';
    
    // 使用命名空间避免冲突
    var $body = $('body');
    
    // 响应式初始化
    mediaCheck({
        media: '(max-width: 767px)',
        entry: function () {
            // 移动端初始化
        },
        exit: function () {
            // 清理移动端事件
        }
    });
});
```

#### 3.3.2 事件绑定
```js
// ✅ 正确：使用命名空间避免重复绑定
$('.nav-toggle').off('click.folixMobile').on('click.folixMobile', function (e) {
    // ...
});

// ❌ 错误：直接绑定可能导致重复
$('.nav-toggle').on('click', function (e) {
    // ...
});
```

---

## 4. 开发流程

### 4.1 新功能开发流程（必须严格遵守）

```
┌─────────────────────────────────────────────────────────────┐
│  Step 0: 判断开发类型                                        │
│  ├── 完全重写（不依赖原生）→ 跳到 Step 4 直接实现             │
│  └── 基于原生扩展 → 继续 Step 1                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 1: 查看原生代码                                        │
│  ├── 查看 Magento/blank 的实现                               │
│  └── 查看 Magento/luma 的扩展                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: 查看已实现功能                                      │
│  ├── 检查 _extend.less 引入了哪些模块                        │
│  ├── 查看相关模块的现有代码                                   │
│  └── 获取编译后的 CSS（styles-m.css / styles-l.css）         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: 找出差异                                            │
│  ├── 对比原生实现 vs 目标需求                                 │
│  ├── 识别需要修改/新增的部分                                  │
│  └── 确认样式冲突点                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 4: 实现/修改代码                                       │
│  ├── 【完全重写】直接实现全部功能，不必考虑原生               │
│  ├── 【基于原生】只修改差异部分，不重复造轮子                 │
│  ├── 遵循模块化原则（导航样式放 _navigation.less）            │
│  └── 使用已定义的变量，避免硬编码                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 5: 测试验证                                            │
│  ├── 编译静态内容                                             │
│  ├── 清除缓存                                                 │
│  └── 多设备/多浏览器测试                                      │
└─────────────────────────────────────────────────────────────┘
```

### 4.1.1 开发类型判断

| 类型 | 说明 | 示例 | 处理方式 |
|-----|------|------|---------|
| **完全重写** | 完全自定义实现，不依赖原生 JS/CSS | 移动端侧边栏导航、自定义 Slider、自定义组件 | **跳过 Step 1-3，直接实现** |
| **基于原生扩展** | 基于原生结构扩展，依赖原生 JS | PC端导航、产品列表、购物车 | **走完整流程** |

### 4.2 获取编译后 CSS 的方法

```bash
# 方法1：访问线上编译后的 CSS
curl -s "http://demo.slmate.com/static/versionXXX/frontend/Folix/game-theme/en_US/css/styles-m.css" | grep "关键字"

# 方法2：本地编译
cd /path/to/magento
bin/magento setup:static-content:deploy -f
# 编译后文件位于：pub/static/frontend/Folix/game-theme/en_US/css/
```

### 4.3 样式模块对应关系

| 功能区域 | 样式文件 | 内容 |
|---------|---------|------|
| 全局样式 | `_global.less` | body, html, 通用工具类 |
| 头部 | `_header.less` | Top Bar, Main Bar, Logo, 搜索框, 购物车 |
| **导航** | **`_navigation.less`** | **PC端导航, 移动端侧边栏, 子菜单, 面包屑** |
| 底部 | `_footer.less` | Footer 链接, 版权信息 |
| 按钮 | `_buttons.less` | 按钮样式, 状态 |
| 产品 | `_products.less` | 产品卡片, 列表, 网格 |
| 组件 | `_components.less` | Hero Slider, Promo Banner |
| 抽象类 | `_abstracts.less` | 可复用的样式类 |

---

## 5. 常见问题与解决方案

### 5.1 样式不生效

**问题**: 修改了 Less 文件，但前台样式没有变化

**解决方案**:
```bash
# 1. 清除缓存
bin/magento cache:clean

# 2. 重新编译静态内容
bin/magento setup:static-content:deploy -f

# 3. 清除浏览器缓存
# Chrome: Ctrl+Shift+R (强制刷新)
```

### 5.2 CSS 变量未定义

**问题**: 编译报错 `variable @xxx is undefined`

**解决方案**:
1. 检查 `_variables.less` 是否定义了该变量
2. 如果未定义，使用 Magento 原生变量或硬编码值
3. 不使用未定义的变量

### 5.3 样式优先级冲突

**问题**: 自定义样式被原生样式覆盖

**解决方案**:
```less
// 方案1：提高选择器优先级
.page-header .navigation .level0 > .level-top {
    color: @folix-text-primary;
}

// 方案2：使用 !important（最后手段）
.navigation .level0 > .level-top {
    color: @folix-text-primary !important;
}
```

### 5.4 移动端样式不生效

**问题**: 移动端样式没有应用

**解决方案**:
1. 确认样式写在 `.media-width(@extremum, @break) when (@extremum = 'max')` 块内
2. 确认断点值正确（`@screen__m` = 768px）
3. 检查是否有其他样式覆盖

---

## 6. 部署清单

### 6.1 开发环境
```bash
# 开发模式（自动编译）
bin/magento deploy:mode:set developer

# 清除缓存
bin/magento cache:clean
```

### 6.2 生产环境
```bash
# 1. 编译静态内容
bin/magento setup:static-content:deploy -f

# 2. 清除所有缓存
bin/magento cache:clean
bin/magento cache:flush

# 3. 生产模式（可选）
bin/magento deploy:mode:set production
```

---

## 7. 禁止事项

### 7.1 样式文件
- ❌ **禁止重复写代码**: 同一样式不要在多个文件中定义
- ❌ **禁止完全重写**: 保留原生结构，只修改差异部分
- ❌ **禁止滥用 !important**: 仅在必要时使用
- ❌ **禁止硬编码颜色**: 优先使用变量

### 7.2 布局文件
- ❌ **禁止随意删除原生 block**: 可能破坏功能
- ❌ **禁止修改原生模板**: 应该创建自己的模板覆盖

### 7.3 开发流程
- ❌ **禁止跳过查看原生代码**: 必须先了解原生实现
- ❌ **禁止忽略编译后 CSS**: 必须查看实际生效的样式
- ❌ **禁止跳过测试**: 修改后必须测试验证

---

## 8. 版本记录

### v1.0.0 (当前版本)
- ✅ 完成头部结构（Top Bar + Main Bar）
- ✅ 完成移动端导航（侧边栏 + 子菜单展开/折叠）
- ✅ 完成 Hero Slider
- ✅ 完成底部结构
- ⏳ 待完成：产品卡片样式优化

---

## 9. 参考资源

- [Magento 2 主题开发文档](https://developer.adobe.com/commerce/frontend-core/guide/themes/)
- [Magento UI Library](https://developer.adobe.com/commerce/frontend-core/guide/css/)
- [Less 官方文档](https://lesscss.org/)
