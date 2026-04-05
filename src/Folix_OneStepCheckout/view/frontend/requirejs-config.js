/**
 * Folix One Step Checkout - RequireJS Configuration
 * 
 * 配置模块的 JS 依赖和 Mixin
 */
var config = {
    config: {
        mixins: {
            // Mixin 步骤导航，跳过虚拟商品的配送步骤
            'Magento_Checkout/js/model/step-navigator': {
                'Folix_OneStepCheckout/js/mixin/step-navigator-mixin': true
            }
        }
    },
    
    // 模块的 JS 组件映射
    paths: {
        'folixOneStepCheckout': 'Folix_OneStepCheckout/js/view/place-order-button'
    }
};
