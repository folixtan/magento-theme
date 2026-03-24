# 移动端头部重做方案

## 设计稿分析

### 参考网站：seagm.com

根据设计稿，移动端头部结构应该是：

```
┌─────────────────────────────────────┐
│ [≡]  [Logo]  [🔍] [登录]           │ ← Main Bar
└─────────────────────────────────────┘
```

点击汉堡菜单后：
```
┌─────────────────────────────────────┐
│ 选择您的语言和货币                    │ ← 标签页标题
├─────────────────────────────────────┤
│ 🏠 香港地区                          │
│ 🌐 中文                              │
│ 💰 港币                              │
│ [保存设置]                           │
└─────────────────────────────────────┘
```

### 设计特点

1. **简洁的头部**
   - 汉堡菜单（左）
   - Logo（中）
   - 搜索 + 登录（右）

2. **标签页导航**
   - Menu：主菜单
   - Account：账户链接
   - Settings：语言/货币设置

3. **折叠式菜单**
   - 点击箭头展开子菜单
   - 不是默认展开

## Magento Luma 原生结构

### 头部结构
```html
<header class="page-header">
  <div class="panel.wrapper">        <!-- Top Bar -->
    <div class="panel.header">
      <!-- 语言切换 -->
    </div>
  </div>

  <div class="header.content">        <!-- Main Bar -->
    <button class="nav-toggle">≡</button>
    <a class="logo">Logo</a>
    <div class="block-search">...</div>
    <div class="minicart-wrapper">...</div>
  </div>
</header>

<div class="nav-sections">              <!-- 导航侧边栏 -->
  <div class="nav-sections-items">
    <div class="nav-sections-item-title">Menu</div>
    <div class="nav-sections-item-content">
      <nav class="navigation">...</nav>
    </div>

    <div class="nav-sections-item-title">Account</div>
    <div class="nav-sections-item-content">
      <!-- 账户链接 -->
    </div>

    <div class="nav-sections-item-title">Settings</div>
    <div class="nav-sections-item-content">
      <!-- 语言/货币 -->
    </div>
  </div>
</div>
```

### 原生交互

1. **汉堡菜单**
   - 点击 → 给 body 添加 `.nav-open`
   - 导航侧边栏从左侧滑入

2. **标签页**
   - 点击标题切换内容
   - Luma 使用 tabs.js

3. **菜单展开**
   - jQuery UI Menu 控制
   - 点击箭头展开子菜单

## 问题分析

### 当前问题

1. ❌ 子菜单样式问题（已修复）
2. ❌ 遮罩点击问题（需要测试）
3. ❌ 搜索功能问题（需要测试）
4. ❌ 布局不符合设计稿

### 根本原因

1. **没有完全理解原生机制**
   - 盲目添加自定义样式
   - 破坏了原生交互

2. **没有参考设计稿**
   - 布局不符合要求
   - 功能缺失

## 重做方案（遵循最小改动原则）

### 步骤1：恢复原生结构

**不要移动** `navigation.sections`，让它保持在原位置。

### 步骤2：只调整样式

**只修改必要的样式**：
- Top Bar：移动端隐藏
- Main Bar：Flex布局
- 导航侧边栏：保持原生交互

### 步骤3：保留原生JavaScript

**不要添加自定义JS**：
- 让 Luma 的 menu.js 控制菜单
- 让 Luma 的 tabs.js 控制标签页
- 只在必要时添加小段JS

## 实施计划

### Phase 1: 清理现有代码
- 移除不必要的自定义样式
- 移除自定义JS
- 恢复原生功能

### Phase 2: 最小样式修改
- 只修改移动端头部布局
- 保持标签页和菜单的原生交互
- 只调整颜色和间距

### Phase 3: 测试验证
- 子菜单展开/折叠
- 标签页切换
- 搜索功能
- 遮罩关闭

## 开发规则（必须遵守）

1. ✅ **先研究原生，再动手改动**
2. ✅ **最小改动原则**
3. ✅ **保留原生交互功能**
4. ✅ **测试验证每个改动**
5. ✅ **使用变量，不用硬编码**
