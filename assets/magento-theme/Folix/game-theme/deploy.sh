#!/bin/bash
# Folix Game Theme - 部署脚本
# 用于重新编译静态文件并清除缓存

echo "=========================================="
echo "Folix Game Theme - 开始部署"
echo "=========================================="

# 设置颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 清除缓存
echo -e "${YELLOW}步骤 1/4: 清除 Magento 缓存...${NC}"
php bin/magento cache:clean
echo -e "${GREEN}✓ 缓存已清除${NC}"

# 2. 清除静态文件
echo -e "${YELLOW}步骤 2/4: 清除旧的静态文件...${NC}"
rm -rf pub/static/frontend/Folix/game-theme/*
rm -rf var/view_preprocessed/pub/static/frontend/Folix/game-theme/*
echo -e "${GREEN}✓ 静态文件已清除${NC}"

# 3. 重新编译静态文件
echo -e "${YELLOW}步骤 3/4: 重新编译静态文件（这可能需要几分钟）...${NC}"
php bin/magento setup:static-content:deploy --theme=Folix/game-theme
echo -e "${GREEN}✓ 静态文件编译完成${NC}"

# 4. 如果是生产模式，编译 DI
if [ "$1" == "production" ]; then
    echo -e "${YELLOW}步骤 4/4: 编译依赖注入（生产模式）...${NC}"
    php bin/magento setup:di:compile
    echo -e "${GREEN}✓ DI 编译完成${NC}"
else
    echo -e "${YELLOW}步骤 4/4: 跳过 DI 编译（开发模式）${NC}"
fi

echo "=========================================="
echo -e "${GREEN}✓ 部署完成！${NC}"
echo "=========================================="
echo ""
echo "现在你可以刷新浏览器查看效果了！"
echo "如果还有问题，请尝试："
echo "  1. 清除浏览器缓存（Ctrl+Shift+R 或 Cmd+Shift+R）"
echo "  2. 检查浏览器开发者工具中的 Network 标签，确认 CSS 文件已更新"
echo "  3. 查看 var/log/system.log 是否有错误日志"
