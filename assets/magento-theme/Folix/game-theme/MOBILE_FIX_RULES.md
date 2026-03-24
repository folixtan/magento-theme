# 移动端问题修复规则

## 问题分析

### 1. 子菜单默认展开（应该折叠）
**原因**: CSS强制显示了`.parent > .submenu`
**原生机制**: jQuery UI Menu控制展开/折叠
**修复**: 移除强制显示，让jQuery UI Menu自己控制
**状态**: ✅ 已修复

### 2. 遮罩无法关闭菜单
**可能原因**:
- 遮罩被导航盖住（z-index问题）
- 遮罩位置不对
**原生机制**: Luma没有遮罩，导航直接滑入
**修复方案**:
- 方案A: 移除遮罩，完全遵循Luma原生
- 方案B: 确保遮罩在正确位置，可以点击
**决策**: 使用方案B（保留遮罩，用户体验更好）

### 3. 搜索无法提交
**原因**: 隐藏了`.actions`（搜索按钮）
**原生机制**: 搜索框展开后，用户输入内容按回车提交
**修复方案**:
- 方案A: 显示搜索按钮
- 方案B: 让表单支持回车提交
**决策**: 使用方案A（更直观）

## 开发规则（必须遵守）

### 1. 先研究原生机制
- Luma是如何实现的？
- 使用了哪些原生组件？
- 交互逻辑是什么？

### 2. 最小改动原则
- 只改必要的样式
- 保留原生功能
- 不破坏现有交互

### 3. 保留原生JavaScript
- jQuery UI Menu控制菜单展开/折叠
- 不要覆盖原生事件
- 不要破坏原生组件

### 4. 遵循Magento规范
- 使用Magento UI Library
- 使用媒体查询
- 使用变量

## 当前修复方案

### 子菜单折叠
```less
// ❌ 错误：强制显示子菜单
&.parent > .submenu {
    display: block !important;
}

// ✅ 正确：让jQuery UI Menu控制
.submenu {
    background: @folix-bg-page !important;
    // 不设置display，让jQuery控制
}
```

### 遮罩点击关闭
```javascript
// 确保遮罩在导航后面，但可以点击
$navOverlay.css('z-index', 98);  // 导航是99
$navOverlay.on('click', function() {
    $body.removeClass('nav-open');
});
```

### 搜索提交
```less
// ✅ 显示搜索按钮
.actions {
    display: block !important;  // 或者不隐藏
}
```

## 测试清单

- [ ] 子菜单默认折叠
- [ ] 点击菜单项可以展开子菜单
- [ ] 点击遮罩关闭导航
- [ ] 搜索框可以输入
- [ ] 搜索可以提交
