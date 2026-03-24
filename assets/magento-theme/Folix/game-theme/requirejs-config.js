/**
 * Folix Game Theme - RequireJS Configuration
 */
var config = {
    map: {
        '*': {
            // 路径映射（用于模板中的 data-mage-init）
            'Magento_Theme/js/marquee': 'Magento_Theme/js/marquee',
            'Magento_Theme/js/slider': 'Magento_Theme/js/slider',
            'Magento_Theme/js/modal': 'Magento_Theme/js/modal',
            'folix/mobile-header': 'Magento_Theme/js/mobile-header'
        }
    },
    // 全局依赖（页面加载时立即执行）
    deps: [
        'folix/mobile-header'
    ]
};
