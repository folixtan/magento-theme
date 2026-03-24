/**
 * Folix Game Theme - RequireJS Configuration
 * 
 * 文件位置：Magento_Theme/requirejs-config.js
 * 
 * 说明：
 * - marquee.js, slider.js, modal.js 通过模板中的 data-mage-init 初始化
 * - mobile-header.js 需要全局加载（在 deps 中）
 */

var config = {
    map: {
        '*': {
            // 路径映射（用于模板中的 data-mage-init）
            // 这些模块在需要时才会加载
            'folix/mobile-header': 'Magento_Theme/js/mobile-header'
        }
    },
    // 全局依赖（页面加载时立即执行）
    deps: [
        'folix/mobile-header'
    ]
};
