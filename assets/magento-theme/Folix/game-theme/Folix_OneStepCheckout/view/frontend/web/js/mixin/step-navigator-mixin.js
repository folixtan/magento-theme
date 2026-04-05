/**
 * Folix One Step Checkout - Step Navigator Mixin
 *
 * 覆盖原生步骤导航，实现一步结账
 * - 跳过配送步骤（虚拟商品无需配送）
 * - 直接显示支付步骤
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
         * 获取步骤 - 一步结账只需要支付步骤
         * @returns {Array}
         */
        targetStepNavigator.getSteps = function () {
            return ['payment'];
        };

        /**
         * 下一步 - 跳过配送步骤
         */
        targetStepNavigator.nextStep = wrapper.wrap(targetStepNavigator.nextStep, function (originalNextStep, data) {
            // 虚拟商品直接跳到支付步骤
            var result = originalNextStep(data);

            // 如果是从认证步骤，直接激活支付步骤
            if (this.activeIndex() === 0) {
                this.setActiveStep('payment');
            }

            return result;
        });

        /**
         * 跳转步骤 - 隐藏配送相关步骤
         */
        targetStepNavigator.gotoSection = wrapper.wrap(targetStepNavigator.gotoSection, function (originalGotoSection, section, scroll) {
            // 跳过配送步骤
            if (section === 'shippingAddress' || section === 'shippingMethod') {
                section = 'billingAddress';
            }

            return originalGotoSection(section, scroll);
        });

        /**
         * 返回上一步
         */
        targetStepNavigator.prevStep = wrapper.wrap(targetStepNavigator.prevStep, function (originalPrevStep) {
            // 虚拟商品无法返回配送步骤
            if (this.activeIndex() > 0) {
                return originalPrevStep();
            }
        });

        return targetStepNavigator;
    };
});
