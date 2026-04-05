/**
 * Folix One Step Checkout - Place Order Button
 * 
 * 放在 sidebar.summary.children 中
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
            checkoutDataResolver.resolveBillingAddress();
        },
        
        /**
         * 检查是否选择了支付方式
         */
        isPaymentSelected: function () {
            return quote.paymentMethod() !== null;
        },
        
        /**
         * 获取选中的支付方式数据
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
            
            // 验证支付方式
            if (!this.isPaymentSelected()) {
                this.messageContainer.addErrorMessage({
                    message: $t('Please select a payment method.')
                });
                return false;
            }
            
            // 验证
            if (!additionalValidators.validate()) {
                return false;
            }
            
            this.isPlaceOrderActionAllowed(false);
            
            // 调用 place-order
            $.when(placeOrderAction(this.getSelectedPaymentMethod(), this.messageContainer))
                .done(function () {
                    redirectOnSuccessAction.execute();
                })
                .always(function () {
                    self.isPlaceOrderActionAllowed(true);
                });
            
            return true;
        },
        
        /** @observable */
        isPlaceOrderActionAllowed: ko.observable(true)
    });
});
