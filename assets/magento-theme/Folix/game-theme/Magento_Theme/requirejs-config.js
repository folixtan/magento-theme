/**
 * Folix Game Theme - RequireJS Configuration
 * 
 * 文件位置：Magento_Theme/requirejs-config.js
 * 
 * 说明：
 * - 暂时禁用自定义JS，使用Luma原生功能
 * - marquee.js, slider.js, modal.js 通过模板中的 data-mage-init 初始化
 */

var config = {
    map: {
        '*': {
            // 路径映射（用于模板中的 data-mage-init）
            'folix/mobile-header': 'Magento_Theme/js/mobile-header'
        }
    },
    // 移动端交互JS
    deps: [
        'folix/mobile-header'  // 重新启用，修复搜索功能
    ]
};
