/**
 * Folix One Step Checkout - Place Order Button
 * 
 * 放在 sidebar 的 place-order region 中（在摘要底部）
 * 调用原生 place-order action
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
            
            // 解决账单地址（虚拟商品）
            checkoutDataResolver.resolveBillingAddress();
        },
        
        /**
         * 检查是否选择了支付方式
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
         * Place Order
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
            
            // 2. 运行额外验证器
            if (!additionalValidators.validate()) {
                return false;
            }
            
            // 3. 禁用按钮
            this.isPlaceOrderActionAllowed(false);
            
            // 4. 调用 place-order action
            $.when(placeOrderAction(this.getSelectedPaymentMethod(), this.messageContainer))
                .done(function () {
                    // 成功，重定向
                    redirectOnSuccessAction.execute();
                })
                .fail(function () {
                    // 失败，重新启用按钮
                    self.isPlaceOrderActionAllowed(true);
                });
            
            return false;
        },
        
        /**
         * Place Order 按钮是否可用
         */
        isPlaceOrderActionAllowed: ko.observable(true)
    });
});
