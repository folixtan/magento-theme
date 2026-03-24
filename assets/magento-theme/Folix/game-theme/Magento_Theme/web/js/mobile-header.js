/**
 * Folix Game Theme - Mobile Header Interactions
 * 
 * 功能：
 * 1. 搜索框点击展开/收起
 * 2. 导航菜单交互优化
 */

define([
    'jquery',
    'matchMedia',
    'mage/menu',
    'domReady!'
], function ($, mediaCheck) {
    'use strict';

    console.log('[Folix] Mobile Header JS Loaded');  // 调试日志

    var $body = $('body'),
        $header = $('.page-header'),
        $searchBlock = $('.block-search'),
        $searchLabel = $searchBlock.find('.label'),
        $searchControl = $searchBlock.find('.control'),
        $searchInput = $searchControl.find('input'),
        $navToggle = $('.nav-toggle'),
        $navSections = $('.nav-sections');

    /**
     * 移动端搜索框交互
     */
    function initMobileSearch() {
        console.log('[Folix] Initializing mobile search');  // 调试日志
        
        // 点击搜索图标
        $searchLabel.off('click.folixMobile').on('click.folixMobile', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            var $this = $(this);
            
            console.log('[Folix] Search label clicked, active:', $this.hasClass('active'));  // 调试日志
            
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
        console.log('[Folix] Initializing mobile nav');  // 调试日志
        
        // 确保导航切换按钮工作
        $navToggle.off('click.folixMobile').on('click.folixMobile', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('[Folix] Nav toggle clicked, nav-open:', $body.hasClass('nav-open'));  // 调试日志
            
            $body.toggleClass('nav-open');
            
            // 添加调试：检查 .nav-sections 的位置
            console.log('[Folix] Nav sections left:', $navSections.css('left'));  // 调试日志
        });

        // 处理导航遮罩（确保遮罩存在并正确绑定事件）
        var $navOverlay = $('.nav-overlay');
        
        // 如果遮罩不存在，创建它
        if ($navOverlay.length === 0) {
            $navOverlay = $('<div class="nav-overlay"></div>');
            $body.append($navOverlay);
        }
        
        // 绑定点击事件（使用 off 确保不重复绑定）
        $navOverlay.off('click.folixMobile').on('click.folixMobile', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Folix] Overlay clicked, closing nav');  // 调试日志
            $body.removeClass('nav-open');
        });
        
        console.log('[Folix] Nav overlay initialized, length:', $navOverlay.length);
    }

    /**
     * 桌面端清理
     */
    function cleanupMobileEvents() {
        console.log('[Folix] Cleaning up mobile events');  // 调试日志
        $searchLabel.off('.folixMobile');
        $(document).off('.folixMobile');
        $navToggle.off('.folixMobile');
    }

    /**
     * 响应式初始化
     */
    mediaCheck({
        media: '(max-width: 767px)',
        entry: function () {
            // 移动端初始化
            console.log('[Folix] Entering mobile mode');  // 调试日志
            initMobileSearch();
            initMobileNav();
        },
        exit: function () {
            // 桌面端清理
            console.log('[Folix] Exiting mobile mode');  // 调试日志
            cleanupMobileEvents();
            $searchLabel.removeClass('active');
            $searchControl.show();
        }
    });
    
    // 立即执行一次检查（以防 mediaCheck 没有触发）
    if (window.innerWidth <= 767) {
        console.log('[Folix] Window width <= 767, initializing immediately');  // 调试日志
        initMobileSearch();
        initMobileNav();
    }
});
