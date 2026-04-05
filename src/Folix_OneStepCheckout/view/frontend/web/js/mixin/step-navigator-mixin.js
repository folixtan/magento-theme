/**
 * Folix One Step Checkout - Step Navigator Mixin
 * 
 * 修改 step-navigator 行为：
 * 1. 虚拟商品跳过 shipping-step
 * 2. next() 直接跳到 billing-step
 */
define([
    'mage/utils/mage-options',
    'Magento_Checkout/js/model/step-navigator'
], function (mageOptions, stepNavigator) {
    'use strict';

    // 保存原方法
    var originalNext = stepNavigator.next.bind(stepNavigator);
    var originalIsProcessed = stepNavigator.isProcessed.bind(stepNavigator);

    /**
     * 获取可见的步骤列表（排除禁用的步骤）
     */
    stepNavigator.getVisibleSteps = function () {
        var sortedSteps = stepNavigator.steps().sort(stepNavigator.sortItems);
        var visibleSteps = [];
        
        sortedSteps.forEach(function (element) {
            // 检查步骤是否可见且未禁用
            // componentDisabled 的组件不会注册，所以检查 isVisible
            if (element.isVisible && element.isVisible()) {
                visibleSteps.push(element);
            }
        });
        
        return visibleSteps;
    };

    /**
     * 修改 next 方法 - 跳过禁用的步骤
     */
    stepNavigator.next = function () {
        var activeIndex = 0,
            code,
            visibleSteps = this.getVisibleSteps();

        // 找到当前活动步骤
        visibleSteps.forEach(function (element, index) {
            if (element.isVisible()) {
                element.isVisible(false);
                activeIndex = index;
            }
        });

        // 跳到下一个可见步骤
        if (visibleSteps.length > activeIndex + 1) {
            code = visibleSteps[activeIndex + 1].code;
            visibleSteps[activeIndex + 1].isVisible(true);
            this.setHash(code);
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    };

    /**
     * 修改 isProcessed - 考虑禁用步骤
     */
    stepNavigator.isProcessed = function (code) {
        var visibleSteps = this.getVisibleSteps();
        var activeIndex = 0;
        var requestedItemIndex = -1;

        // 找到活动步骤索引
        visibleSteps.forEach(function (element, index) {
            if (element.isVisible()) {
                activeIndex = index;
            }
            if (element.code === code) {
                requestedItemIndex = index;
            }
        });

        return activeIndex > requestedItemIndex;
    };

    return stepNavigator;
});
