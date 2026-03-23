# Folix Game Theme - 开发指南

## 📋 目录

1. [快速开始](#快速开始)
2. [主题架构](#主题架构)
3. [样式开发](#样式开发)
4. [模板开发](#模板开发)
5. [JavaScript 开发](#javascript-开发)
6. [性能优化](#性能优化)
7. [常见问题](#常见问题)

---

## 🚀 快速开始

### 环境要求

- Magento 2.4.x
- PHP 7.4+ / 8.1+
- Node.js 12+ (用于前端构建)
- Composer

### 安装步骤

1. **通过 Composer 安装**:
   ```bash
   cd <magento_root>
   composer require folix/theme-frontend-game
   ```

2. **手动安装**:
   ```bash
   cd <magento_root>/app/design/frontend/
   mkdir -p Folix
   # 将主题文件解压到 Folix/game-theme/
   ```

3. **启用主题**:
   ```bash
   php bin/magento setup:upgrade
   php bin/magento setup:static-content:deploy -f
   php bin/magento cache:flush
   ```

4. **应用主题**:
   - 后台: Content > Design > Configuration
   - 选择你的店铺视图
   - 设置 Default Theme 为 "Folix Game Theme"

---

## 🏗️ 主题架构

### 继承关系

```
Magento/blank (基础主题)
    └── Magento/luma (默认主题)
        └── Folix/game-theme (自定义主题)
```

### 目录结构说明

```
Folix/game-theme/
├── etc/view.xml              # 图片尺寸、布局配置
├── web/                      # 前端资源
│   ├── css/source/           # Less 样式源文件
│   ├── js/                   # JavaScript 文件
│   └── images/               # 图片资源
├── Magento_Theme/            # 覆盖 Theme 模块
├── Magento_Catalog/          # 覆盖 Catalog 模块
├── Magento_Search/           # 覆盖 Search 模块
└── Magento_Store/            # 覆盖 Store 模块
```

### 布局优先级

Magento 加载布局文件的顺序：

1. `vendor/magento/module-theme/view/frontend/layout/`
2. `vendor/magento/theme-frontend-luma/Magento_Theme/layout/`
3. `app/design/frontend/Folix/game-theme/Magento_Theme/layout/`

---

## 🎨 样式开发

### Less 文件结构

我们采用模块化的 Less 结构：

```
_variables.less   # 变量定义
_extend.less      # 主样式扩展
_buttons.less     # 按钮样式
_forms.less       # 表单样式
_header.less      # 头部样式
_footer.less      # 底部样式
_products.less    # 产品样式
_components.less  # 组件样式
_theme.less       # 主文件（导入所有）
```

### 变量使用

#### 颜色变量

```less
// 主色调
@theme__color__primary: #4A90E2;
@theme__color__secondary: #FF6B35;

// 渐变
@color-blue-gradient: linear-gradient(135deg, #4A90E2, #6C5CE7);

// 使用示例
.button {
    background: @color-blue-gradient;
}
```

#### 响应式断点

```less
// 桌面端
.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    // 桌面端样式
}

// 移动端
.media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__m) {
    // 移动端样式
}
```

### 样式最佳实践

1. **使用变量**: 避免硬编码颜色和尺寸
   ```less
   // ❌ 不好
   .box { color: #4A90E2; }
   
   // ✅ 好
   .box { color: @theme__color__primary; }
   ```

2. **遵循 BEM 命名**: 保持 CSS 类名清晰
   ```less
   .product-item { }
   .product-item__name { }
   .product-item--featured { }
   ```

3. **响应式优先**: 移动端优先设计
   ```less
   .element {
       // 默认移动端样式
       font-size: 14px;
       
       .media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
           // 桌面端样式
           font-size: 16px;
       }
   }
   ```

---

## 📄 模板开发

### 模板覆盖规则

要覆盖 Magento 核心模板：

```
原始: vendor/magento/module-catalog/view/frontend/templates/product/list.phtml
覆盖: app/design/frontend/Folix/game-theme/Magento_Catalog/templates/product/list.phtml
```

### 模板最佳实践

1. **安全输出**: 使用 escapeHtml 防止 XSS
   ```php
   <?= $block->escapeHtml($product->getName()) ?>
   ```

2. **使用 ViewModel**: 将逻辑从模板中分离
   ```php
   $viewModel = $block->getViewModel();
   $data = $viewModel->getProductData();
   ```

3. **避免硬编码路径**:
   ```php
   // ❌ 不好
   <img src="/pub/media/image.jpg">
   
   // ✅ 好
   <img src="<?= $block->getViewFileUrl('images/image.jpg') ?>">
   ```

### 常用模板方法

```php
// 获取产品 URL
$product->getProductUrl()

// 获取产品图片
$block->getImage($product, 'category_page_grid')->toHtml()

// 获取价格
$block->getProductPrice($product)

// 获取当前 Store
$block->getStore()

// 获取媒体 URL
$block->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA)
```

---

## 💻 JavaScript 开发

### RequireJS 模块定义

```javascript
define([
    'jquery',
    'domReady!'
], function($) {
    'use strict';

    return function(config, element) {
        // 你的代码
    };
});
```

### 初始化组件

**方式 1: data-mage-init**
```html
<div data-mage-init='{"heroSlider": {}}'>
    <!-- 内容 -->
</div>
```

**方式 2: text/x-magento-init**
```html
<script type="text/x-magento-init">
{
    ".hero-slider": {
        "heroSlider": {}
    }
}
</script>
```

### JavaScript 最佳实践

1. **使用严格模式**:
   ```javascript
   'use strict';
   ```

2. **事件委托**:
   ```javascript
   // ❌ 不好
   $('.button').on('click', function() { });
   
   // ✅ 好
   $(document).on('click', '.button', function() { });
   ```

3. **避免全局变量**:
   ```javascript
   // ❌ 不好
   var myVar = 'value';
   
   // ✅ 好
   return {
       myVar: 'value'
   };
   ```

---

## ⚡ 性能优化

### CSS 优化

1. **合并 CSS 文件**:
   - 后台: Stores > Configuration > Advanced > Developer
   - Merge CSS Files: Yes

2. **减少 HTTP 请求**:
   ```less
   // 使用 CSS Sprite 或 Icon Font
   .icon {
       background-image: url('../images/sprite.png');
       background-position: -20px -40px;
   }
   ```

3. **使用 Critical CSS**:
   - 内联关键 CSS
   - 异步加载非关键 CSS

### JavaScript 优化

1. **异步加载**:
   ```javascript
   require(['jquery'], function($) {
       // 代码
   });
   ```

2. **合并 JS 文件**:
   - 后台: Stores > Configuration > Advanced > Developer
   - Merge JavaScript Files: Yes

3. **延迟加载**:
   ```html
   <script defer src="path/to/script.js"></script>
   ```

### 图片优化

1. **使用 WebP 格式**:
   ```html
   <picture>
       <source srcset="image.webp" type="image/webp">
       <img src="image.jpg" alt="...">
   </picture>
   ```

2. **懒加载**:
   ```html
   <img loading="lazy" src="image.jpg" alt="...">
   ```

3. **响应式图片**:
   ```html
   <img srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1024w"
        sizes="(max-width: 768px) 480px, (max-width: 1024px) 768px, 1024px"
        src="medium.jpg" alt="...">
   ```

### 缓存策略

1. **启用全页缓存**:
   ```bash
   php bin/magento cache:enable full_page
   ```

2. **配置浏览器缓存**:
   在 `.htaccess` 添加:
   ```apache
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/jpeg "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
   </IfModule>
   ```

---

## ❓ 常见问题

### Q: 主题更改后样式未生效？

**A**: 执行以下命令:
```bash
php bin/magento cache:flush
php bin/magento setup:static-content:deploy -f
```

### Q: 如何调试 Less 编译错误？

**A**: 查看编译日志:
```bash
tail -f var/log/system.log
tail -f var/log/debug.log
```

### Q: 如何添加自定义字体？

**A**: 
1. 将字体文件放到 `web/fonts/`
2. 在 `_variables.less` 中定义:
   ```less
   @font-family__base: 'CustomFont', sans-serif;
   
   @font-face {
       font-family: 'CustomFont';
       src: url('../fonts/CustomFont.woff2') format('woff2');
   }
   ```

### Q: 如何自定义产品列表布局？

**A**: 
1. 编辑 `Magento_Catalog/templates/product/list.phtml`
2. 或通过布局 XML 修改:
   ```xml
   <referenceBlock name="category.products.list">
       <arguments>
           <argument name="template" xsi:type="string">Magento_Catalog::product/custom-list.phtml</argument>
       </arguments>
   </referenceBlock>
   ```

### Q: 如何添加 Google Analytics？

**A**: 
1. 后台: Stores > Configuration > Sales > Google API
2. 启用 Google Analytics
3. 输入 Tracking ID

---

## 📚 参考资源

- [Magento 2 主题开发文档](https://devdocs.magento.com/guides/v2.4/frontend-dev-guide/themes/theme-overview.html)
- [Less 官方文档](https://lesscss.org/)
- [RequireJS 文档](https://requirejs.org/)
- [Magento 2 性能优化指南](https://devdocs.magento.com/guides/v2.4/performance-best-practices/)

---

## 🔄 更新日志

### v1.0.0 (2026-03-22)
- ✅ 初始版本发布
- ✅ 完整主题结构
- ✅ Header、Footer、产品卡片组件
- ✅ Hero Slider 和促销横幅
- ✅ 响应式设计
- ✅ 性能优化

---

**开发者**: Folix Game Team  
**最后更新**: 2026-03-22
