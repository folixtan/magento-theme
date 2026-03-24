# Folix Game Theme - 项目上下文

> 这个文件记录了项目的核心信息，方便AI助手理解项目背景

## 项目信息

- **项目名称**: Folix Game Theme
- **基于**: Magento Luma Theme
- **版本**: Magento 2.4.8-p4
- **风格**: 游戏电商主题
- **开发路径**: 路径A（基于Luma原生结构扩展）

## 品牌色系

### 主色调
- **蓝色（主色）**: `@folix-primary: #4A90E2`
- **橙色（强调色）**: `@folix-secondary: #FF6B35`
- **紫色（搭配色）**: `@folix-accent: #6C5CE7`

### 文字色
- 主文字: `@folix-text-primary: #1E293B`
- 弱化文字: `@folix-text-muted: #64748B`
- 浅色文字: `@folix-text-light: #94A3B8`

### 背景色
- 卡片背景: `@folix-bg-card: #FFFFFF`
- 页面背景: `@folix-bg-page: #F8FAFC`
- 深色背景: `@folix-bg-dark: #1E293B`

### 边框色
- 默认边框: `@folix-border: #E2E8F0`

## 开发规范

### 必须遵守
1. ✅ **颜色必须用变量** - 严禁硬编码颜色值
2. ✅ **使用Magento原生媒体查询** - `.media-width()`
3. ✅ **移动端优化** - 只在小范围内修改，不影响桌面端
4. ✅ **继承Luma结构** - 不要覆盖原生结构，使用扩展

### 文件结构
```
Folix/game-theme/
├── Magento_Theme/
│   ├── layout/default.xml          # 布局配置
│   ├── templates/                  # 模板文件
│   ├── web/js/                     # JavaScript
│   └── requirejs-config.js         # RequireJS配置
├── web/css/source/
│   ├── _variables.less             # 变量定义
│   ├── _theme.less                 # 主题样式
│   ├── _extend.less                # 扩展样式入口
│   └── extends/                    # 模块化样式
│       ├── _header.less            # 头部样式
│       ├── _footer.less            # 底部样式
│       └── ...
```

## 已完成功能

### ✅ 头部
- Top Bar（深蓝渐变背景）
- Main Bar（白色背景 + 橙色底边框）
- Logo居中
- 搜索框（桌面端展开，移动端点击展开）
- 导航菜单
- 登录按钮
- 移动端汉堡菜单（侧边栏导航）

### ✅ 移动端优化
- 汉堡菜单侧边栏
- 标签页导航（Menu/Account/Settings）
- 点击遮罩关闭导航
- 搜索框点击展开
- 圆形按钮（购物车、登录）

## 当前问题

### 待解决
- [ ] Hero Slider 样式优化
- [ ] 产品卡片样式
- [ ] Footer 样式

## 重要决策记录

### 2024-03-25
1. **颜色变量化** - 所有颜色统一使用变量
2. **移动端导航** - 使用Luma原生结构，不移动navigation.sections
3. **RequireJS配置** - 只有一个配置文件在Magento_Theme/目录下
4. **标签页导航** - 保留标签页标题，使用aria-hidden控制显示

## 技术栈

- Magento 2.4.8-p4
- Less (Magento UI Library)
- Page Builder兼容
- RequireJS
- jQuery

## 部署命令

```bash
# 清除缓存
php bin/magento cache:clean
php bin/magento cache:flush

# 清除静态文件
rm -rf pub/static/frontend/Folix/*
rm -rf var/view_preprocessed/pub/static/frontend/Folix/*
rm -rf pub/static/_requirejs/*
rm -rf var/view_preprocessed/pub/static/_requirejs/*

# 重新部署
php bin/magento setup:static-content:deploy --theme=Folix/game-theme -f
php bin/magento cache:flush
```

## 联系方式

- GitHub: https://github.com/folixtan/magento-theme
- 开发者: Folix Team
