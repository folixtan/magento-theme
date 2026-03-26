/**
 * Folix Game Theme - Login Dropdown Component
 * 
 * Magento 2 UI Component 规范：
 * - 返回函数接收 (element, config) 参数
 * - 或使用 $.widget 创建 jQuery UI Widget
 * 
 * 功能：
 * 1. PC端：hover展开/关闭
 * 2. 移动端：click展开/关闭
 * 3. 登录/注册表单切换
 * 4. 点击外部关闭
 * 5. 第三方登录预留接口
 */

define([
    'jquery',
    'matchMedia',
    'domReady!'
], function ($, mediaCheck) {
    'use strict';

    /**
     * Login Dropdown Component Factory
     * 
     * @param {HTMLElement|String} element - DOM元素或选择器
     * @param {Object} config - 配置对象
     */
    function loginDropdown(element, config) {
        // 支持传入选择器字符串
        var $element = typeof element === 'string' ? $(element) : $(element);
        
        // 确保 $element 存在
        if (!$element.length) {
            console.warn('[Folix] Login Dropdown: element not found');
            return;
        }

        var $wrapper = $element.closest('.login-dropdown-wrapper'),
            $trigger = $wrapper.find('.login-trigger'),
            $dropdown = $element.hasClass('login-dropdown') ? $element : $wrapper.find('.login-dropdown'),
            $body = $('body'),
            hoverTimeout = null,
            defaults = {
                hoverDelay: 200,
                mobileBreakpoint: 768
            };

        // 合并配置
        config = $.extend({}, defaults, config || {});

        console.log('[Folix] Login Dropdown Component initialized');

        /**
         * 切换下拉菜单
         */
        function toggleDropdown() {
            if ($dropdown.hasClass('open')) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }

        /**
         * 打开下拉菜单
         */
        function openDropdown() {
            $dropdown.addClass('open');
            $trigger.addClass('active');
            
            // 添加遮罩（移动端）
            if ($(window).width() < config.mobileBreakpoint) {
                addOverlay();
            }
        }

        /**
         * 关闭下拉菜单
         */
        function closeDropdown() {
            $dropdown.removeClass('open');
            $trigger.removeClass('active');
            removeOverlay();
        }

        /**
         * 添加遮罩（移动端）
         */
        function addOverlay() {
            if ($('.login-overlay').length === 0) {
                $body.append('<div class="login-overlay"></div>');
            }
        }

        /**
         * 移除遮罩
         */
        function removeOverlay() {
            $('.login-overlay').remove();
        }

        /**
         * 切换标签（登录/注册）
         * @param {String} tabName - 标签名称
         */
        function switchTab(tabName) {
            var $tabs = $dropdown.find('.dropdown-tab'),
                $panels = $dropdown.find('.dropdown-panel');
            
            // 更新标签状态
            $tabs.removeClass('active');
            $tabs.filter('[data-tab="' + tabName + '"]').addClass('active');
            
            // 更新面板状态
            $panels.removeClass('active');
            $panels.filter('#' + tabName + '-panel').addClass('active');
        }

        /**
         * 初始化PC端事件（hover）
         */
        function initDesktopEvents() {
            // 移除可能存在的click事件
            $trigger.off('click.loginDropdown');
            
            // 鼠标移入展开
            $wrapper.off('mouseenter.loginDropdown').on('mouseenter.loginDropdown', function () {
                clearTimeout(hoverTimeout);
                openDropdown();
            });
            
            // 鼠标移出关闭
            $wrapper.off('mouseleave.loginDropdown').on('mouseleave.loginDropdown', function () {
                hoverTimeout = setTimeout(function () {
                    closeDropdown();
                }, config.hoverDelay);
            });
        }

        /**
         * 初始化移动端事件（click）
         */
        function initMobileEvents() {
            // 移除hover事件
            $wrapper.off('mouseenter.loginDropdown mouseleave.loginDropdown');
            
            // 点击触发按钮
            $trigger.off('click.loginDropdown').on('click.loginDropdown', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown();
            });
        }

        /**
         * 初始化公共事件
         */
        function initCommonEvents() {
            // 点击下拉菜单内部（阻止冒泡）
            $dropdown.on('click.loginDropdown', function (e) {
                e.stopPropagation();
            });
            
            // 点击外部关闭
            $(document).on('click.loginDropdown', function (e) {
                if ($dropdown.hasClass('open')) {
                    if (!$(e.target).closest($wrapper).length) {
                        closeDropdown();
                    }
                }
            });
            
            // 标签切换
            $dropdown.find('.dropdown-tab').on('click.loginDropdown', function (e) {
                e.preventDefault();
                switchTab($(this).data('tab'));
            });
            
            // 遮罩点击关闭（移动端）
            $body.on('click.loginDropdownOverlay', '.login-overlay', function () {
                closeDropdown();
            });
            
            // ESC 键关闭
            $(document).on('keydown.loginDropdown', function (e) {
                if (e.keyCode === 27 && $dropdown.hasClass('open')) {
                    closeDropdown();
                }
            });
            
            // 第三方登录按钮（预留）
            $dropdown.find('.btn-social').on('click.loginDropdown', function (e) {
                e.preventDefault();
                var provider = $(this).hasClass('btn-google') ? 'google' : 'facebook';
                
                // 触发自定义事件，供外部监听
                $element.trigger('socialLoginClick', [provider]);
            });
        }

        /**
         * 初始化响应式
         */
        function initResponsive() {
            // 使用 matchMedia 响应式切换
            mediaCheck({
                media: '(min-width: ' + config.mobileBreakpoint + 'px)',
                entry: function () {
                    initDesktopEvents();
                },
                exit: function () {
                    initMobileEvents();
                }
            });
            
            // 立即执行一次检查
            if ($(window).width() >= config.mobileBreakpoint) {
                initDesktopEvents();
            } else {
                initMobileEvents();
            }
        }

        /**
         * 清理事件（销毁时调用）
         */
        function destroy() {
            $wrapper.off('.loginDropdown');
            $trigger.off('.loginDropdown');
            $dropdown.off('.loginDropdown');
            $(document).off('.loginDropdown');
            $body.off('.loginDropdownOverlay');
            removeOverlay();
        }

        // 初始化
        initCommonEvents();
        initResponsive();

        // 暴露公共方法到 jQuery data
        $element.data('loginDropdown', {
            open: openDropdown,
            close: closeDropdown,
            toggle: toggleDropdown,
            switchTab: switchTab,
            destroy: destroy
        });

        // 返回公共接口
        return {
            open: openDropdown,
            close: closeDropdown,
            toggle: toggleDropdown,
            switchTab: switchTab,
            destroy: destroy
        };
    }

    return loginDropdown;
});
