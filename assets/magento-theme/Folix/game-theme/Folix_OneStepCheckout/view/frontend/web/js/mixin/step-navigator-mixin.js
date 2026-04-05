/**
 * Folix One Step Checkout - Step Navigator Mixin
 *
 * 处理虚拟商品的一步结账流程
 * - 虚拟商品：跳过配送步骤，直接显示支付
 * - 实体商品：保持原有流程
 *
 * @category    Folix
 * @package     Folix_OneStepCheckout
 */

define([
    'jquery',
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote'
], function ($, wrapper, quote) {
    'use strict';

    return function (targetStepNavigator) {

        /**
         * 检查是否是虚拟商品
         * @returns {Boolean}
         */
        function isVirtualQuote() {
            return quote.isVirtual ? quote.isVirtual() : false;
        }

        /**
         * 重写获取步骤 - 虚拟商品只显示支付步骤
         */
        targetStepNavigator.getSteps = wrapper.wrap(targetStepNavigator.getSteps, function (originalGetSteps) {
            if (isVirtualQuote()) {
                // 虚拟商品：跳过配送步骤
                return ['payment'];
            }
            return originalGetSteps();
        });

        /**
         * 重写下一步 - 虚拟商品直接到支付
         */
        targetStepNavigator.nextStep = wrapper.wrap(targetStepNavigator.nextStep, function (originalNextStep, data) {
            if (isVirtualQuote()) {
                // 虚拟商品：跳过配送步骤，直接到支付
                var activeStep = this.activeIndex();

                // 如果当前是认证步骤，下一步直接到支付
                if (activeStep === 0) {
                    this.setActiveStep('payment');
                    return;
                }
            }
            return originalNextStep(data);
        });

        /**
         * 重写跳转步骤 - 虚拟商品跳过配送
         */
        targetStepNavigator.gotoSection = wrapper.wrap(targetStepNavigator.gotoSection, function (originalGotoSection, section, scroll) {
            if (isVirtualQuote()) {
                // 虚拟商品：跳过配送相关步骤
                if (section === 'shippingAddress' || section === 'shippingMethod') {
                    section = 'billingAddress';
                }
            }
            return originalGotoSection(section, scroll);
        });

        /**
         * 初始化时检查虚拟商品
         */
        var originalInit = targetStepNavigator.initialize;
        if (originalInit) {
            targetStepNavigator.initialize = wrapper.wrap(originalInit, function (originalInitFn) {
                var result = originalInitFn.apply(this, arguments);

                if (isVirtualQuote()) {
                    // 虚拟商品：立即激活支付步骤
                    this.setActiveStep('payment');
                }

                return result;
            });
        }

        return targetStepNavigator;
    };
});
