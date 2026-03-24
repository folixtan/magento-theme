/**
 * Folix Game Theme - RequireJS Configuration
 */
var config = {
    map: {
        '*': {
            'Magento_Theme/js/marquee': 'Magento_Theme/js/marquee',
            'Magento_Theme/js/slider': 'Magento_Theme/js/slider',
            'Magento_Theme/js/modal': 'Magento_Theme/js/modal'
        }
    },
    deps: [
        'Magento_Theme/js/marquee',
        'Magento_Theme/js/slider',
        'Magento_Theme/js/modal'
    ]
};
