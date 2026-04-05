/**
 * Folix One Step Checkout - Place Order Button
 * 
 * 放在 sidebar 的 place-order region 中（在摘要底部）
 * 继承原生 payment/default.js 的 placeOrder 逻辑
 */
define([
    'ko',
    'jquery',
    'uiComponent',
    'Magento_Checkout/js/action/place-order',
    'Magento_Checkout/js/action/redirect-on-success',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/payment/additional-validators',
    'Magento_Checkout/js/model/checkout-data-resolver',
    'Magento_Checkout/js/checkout-data',
    'Magento_Ui/js/model/messages',
    'mage/translate'
], function (
    ko,
    $,
    Component,
    placeOrderAction,
    redirectOnSuccessAction,
    quote,
    additionalValidators,
    checkoutDataResolver,
    checkoutData,
    Messages,
    $t
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
            
            // 监听支付方式变化
            var self = this;
            quote.paymentMethod.subscribe(function (method) {
                self.isPlaceOrderActionAllowed(method !== null);
            });
        },
        
        /**
         * Place Order 按钮是否可用
         */
        isPlaceOrderActionAllowed: ko.observable(false),
        
        /**
         * 获取选中的支付方式数据
         * @returns {Object|null}
         */
        getData: function () {
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
         * 检查是否选择了支付方式
         * @returns {boolean}
         */
        isPaymentSelected: function () {
            return quote.paymentMethod() !== null;
        },
        
        /**
         * Place Order - 参考 payment/default.js 的实现
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

            // 3. 验证通过，禁用按钮
            if (this.isPlaceOrderActionAllowed() === true) {
                this.isPlaceOrderActionAllowed(false);

                // 4. 调用 place-order action（参考 default.js）
                $.when(
                    placeOrderAction(this.getData(), this.messageContainer)
                ).done(function () {
                    // 成功，重定向
                    if (self.redirectAfterPlaceOrder !== false) {
                        redirectOnSuccessAction.execute();
                    }
                }).always(function () {
                    // 重新启用按钮
                    self.isPlaceOrderActionAllowed(true);
                });

                return true;
            }

            return false;
        }
    });
});
