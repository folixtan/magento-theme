/**
 * Folix One Step Checkout - Place Order Button Component
 *
 * 在右侧摘要区显示统一的 Place Order 按钮
 *
 * @category    Folix
 * @package     Folix_OneStepCheckout
 */

define([
    'jquery',
    'ko',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/payment-service',
    'Magento_Checkout/js/model/payment/method-list',
    'Magento_Checkout/js/action/select-payment-method',
    'Magento_Checkout/js/action/get-payment-information',
    'Magento_Checkout/js/model/checkout-data-resolver',
    'mage/translate'
], function ($, ko, quote, paymentService, paymentMethods, selectPaymentMethod, getPaymentInformation, checkoutDataResolver, $t) {
    'use strict';

    return function () {
        var self = this;

        // 获取当前选中的支付方式
        this.selectedPaymentMethod = ko.computed(function () {
            return quote.paymentMethod();
        });

        // 检查是否可以下单
        this.isPlaceOrderAllowed = ko.computed(function () {
            return self.selectedPaymentMethod() !== null;
        });

        // 获取总价
        this.grandTotal = ko.computed(function () {
            var totals = quote.totals();
            if (totals) {
                return totals.grand_total;
            }
            return 0;
        });

        // 格式化价格
        this.getFormattedPrice = function (price) {
            if (typeof price === 'number') {
                return price.toFixed(2);
            }
            return price;
        };

        // 下单
        this.placeOrder = function () {
            var paymentData = self.selectedPaymentMethod();

            if (!paymentData) {
                alert($t('Please select a payment method.'));
                return;
            }

            // 触发原生下单
            var deferred = $.Deferred();
            var placeOrderAction = require('Magento_Checkout/js/action/place-order');

            placeOrderAction(paymentData, deferred.resolve, deferred.reject);

            $.when(deferred).done(function () {
                window.location.href = window.checkoutConfig.successPageUrl;
            }).fail(function () {
                // 错误由 messageContainer 处理
            });
        };

        // 当页面加载时，确保有支付方式被选中
        this.initialize = function () {
            checkoutDataResolver.resolvePaymentMethod();

            // 如果只有一个支付方式，自动选中
            var methods = paymentService.getAvailablePaymentMethods();
            if (methods.length === 1) {
                selectPaymentMethod(methods[0]);
            }
        };

        this.initialize();
    };
});
