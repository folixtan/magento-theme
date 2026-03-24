# Folix Game Theme - 开发总结

## 项目概述
基于Magento 2.4.8-p4官方规范开发的游戏电商主题，继承自Magento/luma，采用蓝橙渐变色方案（蓝#4A90E2 + 橙#FF6B35）。

## 继承架构
```
Magento/blank (基础)
    └── Magento/luma (父主题)
        └── Folix/game-theme (本主题)
```

## 核心特性

### 1. 渐变色方案
- **主蓝色**: `#4A90E2`
- **主橙色**: `#FF6B35`
- **深蓝背景**: `#1E293B`
- **紫色强调**: `#7C3AED`
- **金色高亮**: `#F59E0B`

### 2. UI组件
- **渐变按钮**: 蓝到橙的渐变，悬停时更鲜艳
- **徽章系统**: NEW/HOT/SALE徽章，带有闪烁动画
- **产品卡片**: 悬停上浮+阴影效果
- **跑马灯**: 自动滚动的公告栏

### 3. 主题样式架构

#### CSS文件结构
```
web/css/source/
├── _theme.less          # 覆盖父主题变量（优先）
├── _variables.less      # 定义新变量
├── _extend.less         # 扩展样式（主入口）
├── extends/
│   ├── _pages.less      # 页面级样式（头部、尾部）
│   ├── _modules.less    # 模块级样式
│   ├── _components.less # 组件级样式（按钮、徽章）
│   └── _product.less    # 产品相关样式
└── override/
    └── _extend.less     # 覆盖样式（最后手段）
```

#### 开发原则
1. **扩展优先**: 使用`_extend.less`和`<referenceContainer>`
2. **覆盖次之**: 使用`_theme.less`覆盖变量
3. **新增最后**: 在`_variables.less`定义新变量

### 4. 布局修改策略

#### 头部布局（default.xml）
```xml
<!-- 扩展而非覆盖 -->
<referenceContainer name="header.container">
    <referenceContainer name="header.panel">
        <!-- 添加跑马灯 -->
        <block class="Magento\Framework\View\Element\Template" 
               name="header.marquee" 
               template="Magento_Theme::html/header/marquee.phtml" 
               after="top.links"/>
    </referenceContainer>
</referenceContainer>
```

#### 尾部布局（default.xml）
```xml
<!-- 新增Footer栏目块 -->
<referenceContainer name="footer-container">
    <container name="footer.top" htmlTag="div" htmlClass="footer-top">
        <block class="Magento\Framework\View\Element\Template" 
               name="footer.columns" 
               template="Magento_Theme::html/footer/columns.phtml"/>
    </container>
</referenceContainer>
```

## 文件清单

### 布局文件
- `Magento_Theme/layout/default.xml` - 主布局配置

### 模板文件
- `Magento_Theme/templates/html/header/marquee.phtml` - 跑马灯公告
- `Magento_Theme/templates/html/footer/columns.phtml` - Footer栏目
- `Magento_Theme/templates/html/footer/copyright.phtml` - Copyright区域

### 样式文件
- `web/css/source/_theme.less` - 变量覆盖
- `web/css/source/_variables.less` - 新变量定义
- `web/css/source/_extend.less` - 扩展入口
- `web/css/source/extends/_pages.less` - 页面样式
- `web/css/source/extends/_modules.less` - 模块样式
- `web/css/source/extends/_components.less` - 组件样式
- `web/css/source/extends/_product.less` - 产品样式

### JavaScript文件
- `web/js/marquee.js` - 跑马灯组件
- `web/js/theme.js` - 主题初始化

### 静态资源
- `media/preview.svg` - 主题预览图

## 颜色规范

### 渐变组合
| 名称 | 起始色 | 结束色 | 用途 |
|------|--------|--------|------|
| 主渐变 | `#4A90E2` | `#FF6B35` | 按钮、徽章、Hero |
| 深蓝渐变 | `#1E293B` | `#0F172A` | 头部Top Bar、Footer |
| 紫色渐变 | `#7C3AED` | `#9333EA` | Copyright、特殊强调 |

### 文字颜色
- 主标题: `#1E293B`
- 副标题: `#475569`
- 链接: `#4A90E2`
- 链接悬停: `#FF6B35`
- 反白文字: `#FFFFFF`

## 响应式断点

遵循Magento UI Library断点：
- `@screen__xxs`: 320px
- `@screen__xs`: 480px
- `@screen__s`: 640px
- `@screen__m`: 768px
- `@screen__l`: 1024px
- `@screen__xl`: 1440px

## 测试建议

### 验证项
1. ✓ 头部布局和样式与原型一致
2. ✓ 尾部布局和样式与原型一致
3. ✓ 产品卡片悬停效果
4. ✓ 徽章渐变和动画
5. ✓ 跑马灯滚动功能
6. ✓ 响应式布局（移动端）

### 测试命令
```bash
# 部署主题
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy --theme=Folix/game-theme

# 清除缓存
php bin/magento cache:clean

# 编译Less
php bin/magento dev:source-theme:deploy
```

## 扩展建议

### 新增模块样式
1. 创建 `web/css/source/extends/_new_module.less`
2. 在 `_extend.less` 中导入：`@import 'extends/_new_module.less';`

### 新增布局修改
1. 在 `Magento_Theme/layout/` 创建新XML文件
2. 使用 `<referenceContainer>` 扩展而非 `<container>` 覆盖

### 新增模板文件
1. 在 `Magento_Theme/templates/` 创建新PHTML文件
2. 使用Magento原生选择器结构

## 开发规范提醒

1. **选择器优先级**: 使用原生选择器（如`.page-header`），避免自定义选择器
2. **变量使用**: 使用Magento UI Library函数（如`.lib-css()`）
3. **文件组织**: 遵循扩展优先原则
4. **注释规范**: 每个文件顶部添加功能说明和位置信息

---

**开发时间**: 2024年
**Magento版本**: 2.4.8-p4
**主题版本**: 1.0.0
