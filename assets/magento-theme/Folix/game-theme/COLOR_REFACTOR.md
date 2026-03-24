# 颜色变量重构指南

## 变量映射表

### 品牌色
- `#4A90E2` → `@folix-primary`
- `#FF6B35` → `@folix-secondary`
- `#6C5CE7` → `@folix-accent`

### 文字色
- `#1E293B` → `@folix-text-primary`
- `#64748B` → `@folix-text-muted`
- `#94A3B8` → `@folix-text-light`

### 背景色
- `#FFFFFF` → `@folix-bg-card`
- `#F8FAFC` → `@folix-bg-page`
- `#F1F5F9` → `@folix-bg-panel`

### 边框色
- `#E2E8F0` → `@folix-border`
- `#E5E7EB` → `@folix-border` (统一使用)

### 渐变
- `linear-gradient(135deg, #4A90E2 0%, #6C5CE7 100%)` → `@folix-gradient-primary`

## 执行命令

```bash
# 进入样式目录
cd assets/magento-theme/Folix/game-theme/web/css/source/extends

# 替换品牌色
sed -i 's/#4A90E2/@folix-primary/g' _header.less
sed -i 's/#FF6B35/@folix-secondary/g' _header.less
sed -i 's/#6C5CE7/@folix-accent/g' _header.less

# 替换文字色
sed -i 's/#1E293B/@folix-text-primary/g' _header.less
sed -i 's/#64748B/@folix-text-muted/g' _header.less
sed -i 's/#94A3B8/@folix-text-light/g' _header.less

# 替换背景色
sed -i 's/#FFFFFF/@folix-bg-card/g' _header.less
sed -i 's/#F8FAFC/@folix-bg-page/g' _header.less
sed -i 's/#F9FAFB/@folix-bg-page/g' _header.less

# 替换边框色
sed -i 's/#E2E8F0/@folix-border/g' _header.less
sed -i 's/#E5E7EB/@folix-border/g' _header.less

# 替换深色背景
sed -i 's/#0F172A/@folix-bg-dark-alt/g' _header.less

# 替换渐变
sed -i 's/linear-gradient(135deg, @folix-primary 0%, @folix-accent 100%)/@folix-gradient-primary/g' _header.less
sed -i 's/linear-gradient(180deg, @folix-text-primary 0%, @folix-bg-dark-alt 100%)/@folix-gradient-dark/g' _header.less
```

## 注意事项

1. 替换前先备份文件
2. 替换后检查是否有遗漏
3. 编译测试是否正常
