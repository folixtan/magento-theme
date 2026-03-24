# Folix Game Theme - 部署与修复指南

## 当前问题诊断

根据测试服务器 http://demo.slmate.com/ 的HTML结构分析：

### ✅ 已正确输出
- Top Bar 结构正确（左侧链接 + 右侧APP+语言）
- Main Bar 结构正确（Logo + 导航 + 搜索 + 购物车）
- 登录按钮已配置

### ❌ 可能的问题
1. **CSS样式未正确编译** - 浏览器缓存或Magento缓存
2. **Hero Slider 位置配置错误** - 已修复
3. **样式被覆盖** - 需要检查编译后的CSS

## 修复步骤

### 1. 清除所有缓存
```bash
cd /path/to/magento

# 清除Magento缓存
php bin/magento cache:clean
php bin/magento cache:flush

# 清除布局缓存
php bin/magento cache:clean layout block_html full_page
```

### 2. 清除静态文件
```bash
# 删除已编译的静态文件
rm -rf pub/static/frontend/Folix/game-theme/*
rm -rf var/view_preprocessed/pub/static/frontend/Folix/game-theme/*

# 清除生成的LESS文件
rm -rf var/view_preprocessed/pub/static/frontend/Folix/game-theme/en_US/css/*
```

### 3. 重新部署静态内容
```bash
# 开发模式部署（更快）
php bin/magento setup:static-content:deploy --theme=Folix/game-theme --language=en_US

# 或者生产模式部署
php bin/magento setup:static-content:deploy --theme=Folix/game-theme
```

### 4. 设置文件权限
```bash
chmod -R 775 pub/static
chmod -R 775 var
chown -R www-data:www-data pub/static var
```

### 5. 清除浏览器缓存
- Chrome: Ctrl+Shift+Delete (硬性重新加载)
- Firefox: Ctrl+Shift+Delete
- 或者使用无痕模式测试

## 预期效果

修复后，header应该呈现：

### Top Bar (高度40px)
- 深蓝渐变背景 (#1E293B → #0F172A)
- 左侧：📰 Folix 新闻 | ⭐ STAR 奖励 | 💬 支持
- 右侧：📱 Folix.APP | 语言选择器

### Main Bar (高度70px)
- 白色背景
- 底部橙色边框 3px
- Logo | 导航菜单 | 搜索框 | 购物车 | 登录按钮

## 调试工具

### 检查编译后的CSS
```bash
# 查看编译后的CSS文件
cat pub/static/frontend/Folix/game-theme/en_US/css/styles-m.css | grep -A 10 "\.panel\.wrapper"
```

### 启用模板路径提示
后台路径：
```
Stores → Configuration → Advanced → Developer → Debug
- Template Path Hints: Yes
- Add Block Names to Hints: Yes
```

### 检查布局句柄
```bash
# 查看当前页面的布局句柄
php bin/magento dev:query:layout --handle=default
```

## 常见问题

### Q: CSS样式不生效
A: 
1. 确认 `_extends.less` 是否正确引入
2. 检查 `styles-m.css` 是否编译成功
3. 清除浏览器缓存

### Q: 布局没有变化
A: 
1. 清除布局缓存：`php bin/magento cache:clean layout`
2. 删除 `var/view_preprocessed` 目录
3. 重新部署静态文件

### Q: 语言切换器样式不正确
A: 
1. 检查 `.switcher` 相关CSS是否正确
2. 确认语言切换器是否在正确的容器中

## 下一步优化

1. **首页专用布局** - 创建 `cms_index_index.xml`
2. **产品页面布局** - 优化 `catalog_product_view.xml`
3. **分类页面布局** - 优化 `catalog_category_view.xml`
4. **响应式优化** - 完善移动端样式
5. **Page Builder兼容** - 确保自定义组件兼容

## 验证清单

部署完成后，请检查：

- [ ] Top Bar 深蓝渐变背景显示正确
- [ ] Top Bar 高度 40px
- [ ] 左侧链接显示：新闻、奖励、支持
- [ ] 右侧显示：APP链接、语言切换器
- [ ] Main Bar 白色背景
- [ ] Main Bar 高度 70px
- [ ] Main Bar 底部橙色边框 3px
- [ ] Logo 显示正常
- [ ] 导航菜单水平排列
- [ ] 搜索框显示正常
- [ ] 登录按钮显示正常
- [ ] 响应式布局正常
