/**
 * Folix One Step Checkout - RequireJS Mixin Configuration
 *
 * @category    Folix
 * @package     Folix_OneStepCheckout
 */

var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/view/checkout': {
                'Folix_OneStepCheckout/js/mixin/step-navigator-mixin': true
            }
        }
    }
};
