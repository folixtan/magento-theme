/**
 * Folix One Step Checkout - Place Order Button Component
 * 
 * 放在 sidebar 的 place-order region 中
 * 负责：调用 place-order action，触发下单
 */
define([
    'jquery',
    'ko',
    'uiComponent',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/action/place-order',
    'Magento_Checkout/js/model/payment/additional-validators',
    'Magento_Checkout/js/action/redirect-on-success',
    'Magento_Checkout/js/model/checkout-data-resolver',
    'mage/translate',
    'Magento_Ui/js/model/messages'
], function (
    $,
    ko,
    Component,
    quote,
    placeOrderAction,
    additionalValidators,
    redirectOnSuccessAction,
    checkoutDataResolver,
    $t,
    Messages
) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Folix_OneStepCheckout/place-order-button'
        },
        
        /** @inheritdoc */
        initialize: function () {
            this._super();
            this.messageContainer = new Messages();
            
            // 解决账单地址（如果需要）
            checkoutDataResolver.resolveBillingAddress();
        },
        
        /**
         * 是否选择了支付方式
         * @returns {boolean}
         */
        isPaymentSelected: function () {
            return quote.paymentMethod() !== null;
        },
        
        /**
         * 获取选中的支付方式数据
         * @returns {Object|null}
         */
        getSelectedPaymentMethod: function () {
            var method = quote.paymentMethod();
            if (method) {
                return {
                    'method': method.method,
                    'po_number': null,
                    'additional_data': null
                };
            }
            return null;
        },
        
        /**
         * Place Order 按钮点击处理
         * @param {Object} data
         * @param {Event} event
         * @returns {boolean}
         */
        placeOrder: function (data, event) {
            var self = this;
            
            if (event) {
                event.preventDefault();
            }
            
            // 1. 检查是否选择了支付方式
            if (!this.isPaymentSelected()) {
                this.messageContainer.addErrorMessage({
                    message: $t('Please select a payment method.')
                });
                return false;
            }
            
            // 2. 获取支付数据
            var paymentData = this.getSelectedPaymentMethod();
            
            // 3. 运行额外验证器（如邮箱验证等）
            if (!additionalValidators.validate()) {
                return false;
            }
            
            // 4. 禁用按钮，防止重复点击
            this.isPlaceOrderActionAllowed(false);
            
            // 5. 调用 place-order action
            $.when(placeOrderAction(paymentData, this.messageContainer))
                .done(function () {
                    // 下单成功，重定向
                    redirectOnSuccessAction.execute();
                })
                .fail(function () {
                    // 下单失败，错误消息由 messageContainer 显示
                })
                .always(function () {
                    // 重新启用按钮
                    self.isPlaceOrderActionAllowed(true);
                });
            
            return true;
        },
        
        /**
         * 按钮是否允许点击
         * @returns {boolean}
         */
        isPlaceOrderActionAllowed: ko.observable(true)
    });
});
