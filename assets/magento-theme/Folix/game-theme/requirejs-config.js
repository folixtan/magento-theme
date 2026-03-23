/**
 * Folix Game Theme - RequireJS Configuration
 * 
 * @category  Design
 * @package   Folix_GameTheme
 */

var config = {
    map: {
        '*': {
            'heroSlider': 'Folix_GameTheme/js/hero-slider',
            'navigationMenu': 'Folix_GameTheme/js/navigation-menu',
            'productCard': 'Folix_GameTheme/js/product-card'
        }
    },
    paths: {
        'slick': 'Folix_GameTheme/js/lib/slick.min'
    },
    shim: {
        'slick': {
            deps: ['jquery']
        }
    },
    config: {
        mixins: {
            'Magento_Theme/js/view/breadcrumbs': {
                'Folix_GameTheme/js/view/breadcrumbs-mixin': true
            }
        }
    }
};
