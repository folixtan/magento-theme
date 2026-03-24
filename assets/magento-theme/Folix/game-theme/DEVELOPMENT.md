# Folix Game Theme - 开发文档

## 📚 Magento 2.4.8 主题开发规范

### 核心原则

**优先级：变量覆盖 > 样式扩展 > 新增文件**

---

## 1️⃣ 文件作用详解

### _theme.less
**用途**：仅覆盖父主题（Luma）的现有变量

**正确示例**：
```less
// ✅ 正确：覆盖 Luma 变量
@theme__color__primary: #4A90E2;
@link__color: @theme__color__primary;
@button__border-radius: 8px;
```

**错误示例**：
```less
// ❌ 错误：不能定义新变量
@my-custom-color: #FF0000; // 这会导致主题无法嵌套
```

### _variables.less
**用途**：定义主题专用的新变量

**正确示例**：
```less
// ✅ 正确：定义新变量
@folix-color-primary: #4A90E2;
@folix-gradient-blue: linear-gradient(135deg, #4A90E2, #6C5CE7);
```

### _module.less
**用途**：扩展模块样式，使用原生选择器

**正确示例**：
```less
& when (@media-common = true) {
    // ✅ 正确：使用原生选择器
    .page-header {
        .lib-css(border-bottom, 3px solid @folix-color-secondary);
    }
}

.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    // ✅ 正确：响应式样式
    .page-header {
        // 桌面端样式
    }
}
```

---

## 2️⃣ 样式包裹规则

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

## 3️⃣ Magento UI Library 常用函数

### 设置 CSS 属性
```less
.lib-css(property, value);
.lib-css(background, @folix-color-primary);
.lib-css(border-radius, 8px);
```

### 按钮样式
```less
.lib-button(); // 基础按钮
.lib-button-primary(); // 主要按钮
```

### 链接样式
```less
.lib-link(
    @_link-color: #4A90E2,
    @_link-text-decoration: none,
    @_link-color-hover: #FF6B35
);
```

### 表单样式
```less
.lib-form-element-input();
.lib-form-fieldset();
```

---

## 4️⃣ 选择器优先级规则

### 使用原生选择器
```less
// ✅ 正确：扩展原生选择器
.page-header {
    // 添加新样式
    border-bottom: 3px solid #FF6B35;
}

.product-item {
    // 扩展产品卡片样式
    border-radius: 8px;
}
```

### 避免自定义选择器
```less
// ❌ 错误：创建自定义选择器会破坏继承
.my-custom-header {
    // 这会导致样式无法复用
}
```

---

## 5️⃣ 布局 XML 最佳实践

### 使用 referenceBlock/Container
```xml
<!-- ✅ 正确：扩展布局 -->
<referenceContainer name="header.container">
    <block class="..." name="custom.block" after="logo"/>
</referenceContainer>

<!-- ✅ 正确：修改现有块参数 -->
<referenceBlock name="logo">
    <arguments>
        <argument name="logo_width" xsi:type="number">200</argument>
    </arguments>
</referenceBlock>
```

### 避免移除块
```xml
<!-- ❌ 避免：除非必要 -->
<referenceBlock name="block.name" remove="true"/>
```

---

## 6️⃣ 文件结构

```
Folix/game-theme/
├── web/css/source/
│   ├── _theme.less          # 覆盖 Luma 变量
│   ├── _variables.less       # 新变量定义
│   └── _components.less      # 自定义组件
├── Magento_Theme/
│   ├── web/css/source/
│   │   └── _module.less      # 主题模块样式
│   └── layout/
│       └── default.xml       # 布局扩展
├── Magento_Catalog/
│   └── web/css/source/
│       └── _module.less      # Catalog 模块样式
├── etc/view.xml
├── theme.xml
└── registration.php
```

---

## 7️⃣ 开发流程

1. **分析需求** → 确定是变量覆盖、样式扩展还是新增
2. **查找原生选择器** → 在 Luma 和 Blank 主题中查找
3. **使用 Magento UI Library** → 使用 `.lib-*` 函数
4. **遵循响应式规则** → 使用 `.media-width()` mixin
5. **测试验证** → 确保样式正确继承和覆盖

---

## 8️⃣ 常见错误

### ❌ 错误 1：在 _theme.less 中定义新变量
```less
// 这会导致主题无法被其他主题继承
@my-color: #FF0000;
```

### ❌ 错误 2：不使用 & when 包裹样式
```less
// 样式会重复输出，导致冲突
.page-header {
    background: red;
}
```

### ❌ 错误 3：使用自定义选择器
```less
// 破坏了 Magento 的选择器继承机制
.my-header {
    // ...
}
```

---

## 9️⃣ 调试技巧

### 查看 Less 编译错误
```bash
tail -f var/log/system.log
tail -f var/log/debug.log
```

### 清除缓存
```bash
php bin/magento cache:flush
php bin/magento setup:static-content:deploy -f
```

### 检查样式优先级
使用浏览器开发者工具查看 CSS 规则的应用顺序。

---

## 📚 参考资源

- [Magento 2 主题开发文档](https://devdocs.magento.com/guides/v2.4/frontend-dev-guide/themes/theme-overview.html)
- [Magento UI Library](https://devdocs.magento.com/guides/v2.4/frontend-dev-guide/css-topics/css-overview.html)
- [Less 官方文档](https://lesscss.org/)

---

**版本**: 2.0.0  
**最后更新**: 2026-03-22
