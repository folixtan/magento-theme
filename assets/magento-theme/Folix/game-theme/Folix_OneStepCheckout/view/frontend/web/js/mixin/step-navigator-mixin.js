/**
 * Folix One Step Checkout - Step Navigator Mixin
 *
 * 强制显示支付步骤，跳过配送步骤（虚拟商品）
 *
 * @category    Folix
 * @package     Folix_OneStepCheckout
 */

define([
    'jquery',
    'mage/utils/wrapper'
], function ($, wrapper) {
    'use strict';

    return function (targetStepNavigator) {

        /**
         * 重写 nextStep - 跳过配送步骤
         */
        var nextStep = wrapper.wrap(targetStepNavigator.nextStep, function (originalNextStep, data) {
            var result = originalNextStep(data);

            // 如果当前是认证步骤，下一步直接到支付步骤
            if (this.isCustomerLoggedIn() && this.activeIndex() === 0) {
                this.setActiveStep('payment');
            }

            return result;
        });

        /**
         * 重写 gotoSection - 隐藏配送地址相关
         */
        var gotoSection = wrapper.wrap(targetStepNavigator.gotoSection, function (originalGotoSection, section, scroll) {
            // 跳过配送地址步骤
            if (section === 'shippingAddress' || section === 'shippingMethod') {
                section = 'billingAddress';
            }

            return originalGotoSection(section, scroll);
        });

        /**
         * 获取可用步骤
         */
        targetStepNavigator.getSteps = function () {
            return ['login', 'payment'];
        };

        return targetStepNavigator;
    };
});
