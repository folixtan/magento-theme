/**
 * Folix Game Theme - Mobile Header Interactions
 * 
 * 全局自动执行模块（不需要绑定到特定元素）
 * 
 * 功能：
 * 1. 搜索框点击展开/收起
 * 2. 导航菜单交互优化
 */

define([
    'jquery',
    'mage/menu',
    'domReady!'
], function ($) {
    'use strict';

    console.log('[Folix] Mobile Header JS Loaded');

    var $body = $('body'),
        $header = $('.page-header'),
        $searchBlock = $('.block-search'),
        $searchLabel = $searchBlock.find('.label'),
        $searchControl = $searchBlock.find('.control'),
        $searchInput = $searchControl.find('input'),
        $navToggle = $('.nav-toggle'),
        $navSections = $('.nav-sections');

    var MOBILE_BREAKPOINT = 768;

    /**
     * 移动端搜索框交互
     */
    function initMobileSearch() {
        console.log('[Folix] Initializing mobile search');

        // 点击搜索图标
        $searchLabel.off('click.folixMobile').on('click.folixMobile', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $this = $(this);

            if ($this.hasClass('active')) {
                // 收起搜索框
                $this.removeClass('active');
                $searchControl.slideUp(300);
            } else {
                // 展开搜索框
                $this.addClass('active');
                $searchControl.slideDown(300, function () {
                    $searchInput.focus();
                });
            }
        });

        // 点击其他区域关闭搜索框
        $(document).off('click.folixMobile').on('click.folixMobile', function (e) {
            if (!$(e.target).closest('.block-search').length) {
                $searchLabel.removeClass('active');
                $searchControl.slideUp(300);
            }
        });

        // ESC 键关闭搜索框
        $(document).off('keydown.folixMobile').on('keydown.folixMobile', function (e) {
            if (e.keyCode === 27) { // ESC
                $searchLabel.removeClass('active');
                $searchControl.slideUp(300);
            }
        });
    }

    /**
     * 移动端导航交互（增强）
     */
    function initMobileNav() {
        console.log('[Folix] Initializing mobile nav');

        // 确保导航切换按钮工作
        $navToggle.off('click.folixMobile').on('click.folixMobile', function (e) {
            e.preventDefault();
            e.stopPropagation();

            $body.toggleClass('nav-open');
            console.log('[Folix] Nav toggle, nav-open:', $body.hasClass('nav-open'));
        });

        // 关闭按钮
        var $navClose = $('.mobile-nav-close');
        $navClose.off('click.folixMobile').on('click.folixMobile', function (e) {
            e.preventDefault();
            closeNav();
        });

        // 关闭导航的公共函数
        function closeNav() {
            $body.removeClass('nav-open');
            // 折叠所有子菜单
            $('.mobile-nav-container .navigation li.open').removeClass('open');
        }

        // 处理导航遮罩（确保遮罩存在并正确绑定事件）
        var $navOverlay = $('.nav-overlay');

        // 如果遮罩不存在，创建它
        if ($navOverlay.length === 0) {
            $navOverlay = $('<div class="nav-overlay"></div>');
            $body.append($navOverlay);
        }

        // 绑定点击事件
        $navOverlay.off('click.folixMobile').on('click.folixMobile', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeNav();
        });

        // 子菜单展开/折叠
        initSubmenuToggle();
    }

    /**
     * 子菜单展开/折叠
     */
    function initSubmenuToggle() {
        var $mobileNav = $('.mobile-nav-container .navigation');

        // 为所有父级菜单项绑定点击事件
        $mobileNav.find('li.parent > a, li.level0.parent > .level-top').off('click.folixSubmenu').on('click.folixSubmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $parent = $(this).parent('li');

            // 关闭其他已展开的子菜单（手风琴效果）
            $parent.siblings('.open').removeClass('open');

            // 切换展开状态
            $parent.toggleClass('open');
        });
    }

    /**
     * 桌面端清理
     */
    function cleanupMobileEvents() {
        console.log('[Folix] Cleaning up mobile events');
        $searchLabel.off('.folixMobile');
        $(document).off('.folixMobile');
        $navToggle.off('.folixMobile');
    }

    /**
     * 响应式处理
     */
    function initResponsive() {
        var mq = window.matchMedia('(max-width: ' + (MOBILE_BREAKPOINT - 1) + 'px)');

        function handleMediaChange(mql) {
            if (mql.matches) {
                console.log('[Folix] Entering mobile mode');
                initMobileSearch();
                initMobileNav();
            } else {
                console.log('[Folix] Exiting mobile mode');
                cleanupMobileEvents();
                $searchLabel.removeClass('active');
                $searchControl.show();
            }
        }

        // 初始检查
        handleMediaChange(mq);

        // 监听变化
        if (mq.addEventListener) {
            mq.addEventListener('change', handleMediaChange);
        } else {
            mq.addListener(handleMediaChange);
        }
    }

    // 初始化
    initResponsive();
});
