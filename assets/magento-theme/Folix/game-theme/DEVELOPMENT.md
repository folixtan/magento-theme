# Folix Game Theme - 开发文档

## 📚 Magento 2.4.8 主题开发规范

### 核心原则

**CSS 文件优先级：`_extends.less` > `_module.less`**

---

## 1️⃣ 文件作用详解

### `_theme.less`
**用途**：仅覆盖父主题（Luma）的现有变量

```less
// ✅ 正确：覆盖 Luma 变量
@theme__color__primary: #4A90E2;
@link__color: @theme__color__primary;
@button__border-radius: 8px;

// ❌ 错误：不能定义新变量
@my-custom-color: #FF0000;
```

### `_variables.less`
**用途**：定义主题专用的新变量

```less
// ✅ 正确：定义新变量
@folix-color-primary: #4A90E2;
@folix-gradient-blue: linear-gradient(135deg, #4A90E2, #6C5CE7);
```

### `_extends.less`
**用途**：基础公共样式和小改动

```less
// ✅ 全局样式
body {
    background-color: #F8FAFC;
}

// ✅ 轻量覆盖（同选择器覆盖父主题）
.page-header {
    border-bottom: 3px solid @folix-color-secondary;
}

// ✅ 抽象类（可被继承）
.abs-folix-button {
    background: @folix-gradient-primary;
}
```

### `_module.less`
**用途**：模块特定样式（会完全覆盖父主题同名文件）

```less
// ⚠️ 必须先复制父主题变量！
@header__background-color: false;
@header-panel__background-color: @color-gray-middle4;
// ... 其他父主题变量

// 然后扩展样式
& when (@media-common = true) {
    .page-header {
        // 自定义样式
    }
}
```

---

## 2️⃣ 两种 CSS 编写方案

| 方案 | 适用场景 | 文件位置 | 做法 |
|------|----------|----------|------|
| **方案一** | 轻量覆盖、全局样式 | `web/css/source/_extends.less` | 通过 CSS 优先级覆盖父主题 |
| **方案二** | 大改动、模块重构 | `Magento_*/web/css/source/_module.less` | 复制父主题所有变量 + 扩展 |

### 方案一：`_extends.less`（推荐优先使用）

```less
// web/css/source/_extends.less

& when (@media-common = true) {
    // 全局样式
    body {
        background-color: #F8FAFC;
    }
    
    // 轻量覆盖
    .page-header {
        border-bottom: 3px solid @folix-color-secondary;
    }
    
    // 按钮样式
    .action.primary {
        background: @folix-gradient-primary;
    }
}
```

### 方案二：`_module.less`（大改动时使用）

```less
// Magento_Theme/web/css/source/_module.less

// 1️⃣ 先复制父主题所有变量
@message-global-note__color: @text__color;
@header__background-color: false;
@header-panel__background-color: @color-gray-middle4;
// ... 更多变量

// 2️⃣ 导入自定义变量
@import '../_variables.less';

// 3️⃣ 扩展样式
& when (@media-common = true) {
    .page-header {
        // 完全控制头部样式
    }
}
```

---

## 3️⃣ CSS 加载顺序

从 Blank 主题 `styles-m.less`：

```
_reset.less 
    ↓
_styles.less 
    ↓
_sources.less → _extends.less (reference)
    ↓
@magento_import(_module.less) → 自动扫描所有模块
    ↓
_theme.less
```

**关键理解**：
- `_extends.less` 通过 `(reference)` 引入，抽象类需通过 `&:extend()` 使用
- `_module.less` 会完全覆盖父主题同名文件
- 如果不在模块下写 CSS，就一定在 `_extends.less` 里写

---

## 4️⃣ 样式包裹规则

### 公共样式（所有设备）
```less
& when (@media-common = true) {
    // 你的样式
}
```

### 桌面端样式（≥ 768px）
```less
.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    // 桌面端样式
}
```

### 移动端样式（< 768px）
```less
.media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__m) {
    // 移动端样式
}
```

---

## 5️⃣ 实际开发流程

### 需求：修改头部样式

**步骤 1**：评估改动大小
- 小改动 → 使用 `_extends.less`
- 大改动 → 使用 `_module.less`

**步骤 2（小改动）**：在 `_extends.less` 中覆盖
```less
.page-header {
    border-bottom: 3px solid @folix-color-secondary;
}
```

**步骤 2（大改动）**：复制变量到 `_module.less`
```less
// 复制 Luma 的头部变量
@header__background-color: false;
@header-panel__background-color: @color-gray-middle4;
@header-icons-color: @color-gray46;

// 扩展样式
.page-header {
    // 完全自定义
}
```

---

## 6️⃣ 不需要创建的文件

| 文件 | 原因 |
|------|------|
| `styles-m.less` | 继承 Blank 主题 |
| `styles-l.less` | 继承 Blank 主题 |
| `default_head_blocks.xml` | 除非要添加额外资源（如字体） |

---

## 7️⃣ 常见错误

### ❌ 错误 1：在 `_module.less` 中不复制父主题变量
```less
// 变量未定义会导致编译错误
.page-header {
    background: @header-panel__background-color; // ❌ 未定义
}
```

### ❌ 错误 2：在 `_theme.less` 中定义新变量
```less
// 这会导致主题无法被其他主题继承
@my-color: #FF0000; // ❌ 应该在 _variables.less 中定义
```

### ❌ 错误 3：不使用 `& when` 包裹样式
```less
// 样式会重复输出，导致冲突
.page-header {
    background: red; // ❌ 缺少 & when (@media-common = true)
}
```

---

## 8️⃣ 文件结构

```
Folix/game-theme/
├── web/css/source/
│   ├── _theme.less          # 覆盖 Luma 变量
│   ├── _variables.less       # 自定义变量
│   └── _extends.less         # 全局样式、轻量覆盖
├── Magento_Theme/
│   ├── web/css/source/
│   │   └── _module.less      # 主题模块样式（大改动）
│   └── layout/
│       └── default.xml       # 布局扩展
├── Magento_Catalog/
│   └── web/css/source/
│       └── _module.less      # Catalog 模块样式（大改动）
├── etc/view.xml
├── theme.xml
└── registration.php
```

---

**版本**: 2.0.0  
**最后更新**: 2026-03-22
