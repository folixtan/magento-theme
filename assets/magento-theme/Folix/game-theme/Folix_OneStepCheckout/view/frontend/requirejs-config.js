/**
 * Folix One Step Checkout - RequireJS Mixin Configuration
 *
 * @category    Folix
 * @package     Folix_OneStepCheckout
 */

var config = {
    config: {
        mixins: {
            // Mixin 应用于原生 checkout 组件
            'Magento_Checkout/js/view/checkout': {
                'Folix_OneStepCheckout/js/mixin/step-navigator-mixin': true
            },
            // Mixin 应用于步骤导航器
            'Magento_Checkout/js/model/step-navigator': {
                'Folix_OneStepCheckout/js/mixin/step-navigator-mixin': true
            }
        }
    }
};
