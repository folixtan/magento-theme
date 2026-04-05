/**
 * Folix One Step Checkout - Step Navigator Mixin
 * 
 * 禁用虚拟商品的地址/配送步骤
 */
define([
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote'
], function (wrapper, quote) {
    'use strict';
    
    return function (stepNavigator) {
        /**
         * 重写 registerStep 方法
         * 对于虚拟商品，跳过 shipping 步骤
         */
        stepNavigator.registerStep = wrapper.wrap(
            stepNavigator.registerStep,
            function (originalRegisterStep, code, navigate, title, isVisible, sortOrder) {
                // 如果是虚拟商品，跳过 shipping 步骤
                if (quote.isVirtual() && code === 'shipping') {
                    // 不注册 shipping 步骤
                    return stepNavigator;
                }
                
                // 对于 payment 步骤，在虚拟商品中直接显示
                if (quote.isVirtual() && code === 'payment') {
                    isVisible = true;
                }
                
                return originalRegisterStep(code, navigate, title, isVisible, sortOrder);
            }
        );
        
        /**
         * 重写 nextStep 方法
         * 对于虚拟商品，跳过 shipping
         */
        stepNavigator.nextStep = wrapper.wrap(
            stepNavigator.nextStep,
            function (originalNextStep, code) {
                // 如果当前是 shipping 且是虚拟商品，直接跳到 payment
                if (this.isShippingStep() && quote.isVirtual()) {
                    this.setHash('payment');
                    return;
                }
                
                return originalNextStep(code);
            }
        );
        
        /**
         * 重写 isShippingStep 方法
         */
        stepNavigator.isShippingStep = wrapper.wrap(
            stepNavigator.isShippingStep,
            function () {
                // 对于虚拟商品，不存在 shipping 步骤
                if (quote.isVirtual()) {
                    return false;
                }
                return this.getHash() === 'shipping';
            }
        );
        
        return stepNavigator;
    };
});
