/**
 * Folix One Step Checkout - Place Order Button Component
 * 
 * 统一的下单按钮，放在右侧摘要区底部
 */
define([
    'jquery',
    'ko',
    'uiComponent',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/payment/service',
    'Magento_Checkout/js/action/place-order',
    'Magento_Checkout/js/model/checkout-data-resolver',
    'Magento_Checkout/js/model/payment/additional-validators',
    'Magento_Customer/js/model/customer',
    'Magento_Checkout/js/action/redirect-on-success',
    'mage/translate',
    'Magento_Ui/js/model/messages'
], function (
    $,
    ko,
    Component,
    quote,
    paymentService,
    placeOrderAction,
    checkoutDataResolver,
    additionalValidators,
    customer,
    redirectOnSuccessAction,
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
            
            // 解决账单地址
            checkoutDataResolver.resolveBillingAddress();
            
            return this;
        },
        
        /**
         * 检查是否选择了支付方式
         */
        isPaymentSelected: ko.computed(function () {
            return quote.paymentMethod() != null;
        }),
        
        /**
         * 获取当前选中的支付方式
         */
        getSelectedPaymentMethod: function () {
            return quote.paymentMethod();
        },
        
        /**
         * 获取支付方法标题
         */
        getPaymentMethodTitle: ko.computed(function () {
            var method = quote.paymentMethod();
            if (method && method.title) {
                return method.title;
            }
            return '';
        }),
        
        /**
         * Place Order 按钮点击处理
         */
        placeOrder: function () {
            var self = this;
            var paymentData = this.getSelectedPaymentMethod();
            
            // 验证支付方式
            if (!paymentData) {
                this.messageContainer.addErrorMessage({
                    message: $t('Please select a payment method.')
                });
                return;
            }
            
            // 触发额外验证器
            if (!additionalValidators.validate()) {
                return;
            }
            
            // 禁用按钮
            this.isPlaceOrderActionAllowed(false);
            
            // 获取 placeOrder action
            var placeOrderDeferred = $.Deferred();
            
            placeOrderAction(paymentData, this.messageContainer)
                .done(function () {
                    // 成功后处理
                    if (self.redirectAfterPlaceOrder) {
                        redirectOnSuccessAction.execute();
                    }
                })
                .fail(function () {
                    // 失败时不重定向
                })
                .always(function () {
                    // 重新启用按钮
                    self.isPlaceOrderActionAllowed(true);
                });
        },
        
        /**
         * Place Order 按钮点击 (from template)
         */
        onClick: function (data, event) {
            if (event) {
                event.preventDefault();
            }
            this.placeOrder();
            return false;
        }
    });
});
