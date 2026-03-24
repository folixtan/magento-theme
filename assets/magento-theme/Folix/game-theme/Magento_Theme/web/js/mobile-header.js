/**
 * Folix Game Theme - Mobile Header Interactions
 * 
 * 功能：
 * 1. 搜索框点击展开/收起（参考seagm.com）
 * 2. 导航菜单交互优化
 */

define([
    'jquery',
    'matchMedia',
    'domReady!'
], function ($, mediaCheck) {
    'use strict';

    console.log('[Folix] Mobile Header JS Loaded');

    /**
     * 移动端搜索框交互
     * 参考seagm.com：点击图标展开全屏搜索
     */
    function initMobileSearch() {
        var $searchBlock = $('.block-search'),
            $searchLabel = $searchBlock.find('.label'),
            $searchField = $searchBlock.find('.field.search'),
            $searchActions = $searchBlock.find('.actions'),
            $searchInput = $searchBlock.find('input');
        
        // 添加关闭按钮（如果不存在）
        if ($searchBlock.find('.search-close').length === 0) {
            $searchBlock.append('<span class="search-close"></span>');
        }
        var $searchClose = $searchBlock.find('.search-close');
        
        console.log('[Folix] Initializing mobile search');
        
        // 点击搜索图标 - 展开搜索框
        $searchLabel.off('click.folix').on('click.folix', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('[Folix] Search icon clicked - expanding');
            
            // 展开搜索框
            $searchField.addClass('active');
            $searchActions.addClass('active');
            $searchClose.addClass('active');
            
            // 聚焦输入框
            setTimeout(function() {
                $searchInput.focus();
            }, 100);
        });
        
        // 点击关闭按钮 - 收起搜索框
        $searchClose.off('click.folix').on('click.folix', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('[Folix] Close button clicked - collapsing');
            
            // 收起搜索框
            $searchField.removeClass('active');
            $searchActions.removeClass('active');
            $searchClose.removeClass('active');
            
            // 清空输入框
            $searchInput.val('');
        });
        
        // ESC键关闭搜索框
        $(document).off('keydown.folix').on('keydown.folix', function (e) {
            if (e.keyCode === 27 && $searchField.hasClass('active')) {
                $searchField.removeClass('active');
                $searchActions.removeClass('active');
                $searchClose.removeClass('active');
                $searchInput.val('');
            }
        });
        
        // 点击遮罩关闭搜索框（可选）
        $searchField.off('click.folix').on('click.folix', function (e) {
            // 如果点击的是搜索框本身（不是子元素），则关闭
            if (e.target === $searchField[0]) {
                $searchField.removeClass('active');
                $searchActions.removeClass('active');
                $searchClose.removeClass('active');
                $searchInput.val('');
            }
        });
    }

    /**
     * 移动端导航交互
     */
    function initMobileNav() {
        var $body = $('body'),
            $navToggle = $('.nav-toggle'),
            $navSections = $('.nav-sections');
        
        console.log('[Folix] Initializing mobile nav');
        
        // 导航切换按钮
        $navToggle.off('click.folix').on('click.folix', function (e) {
            e.preventDefault();
            $body.toggleClass('nav-open');
            console.log('[Folix] Nav toggled:', $body.hasClass('nav-open'));
        });
        
        // 确保遮罩存在
        var $navOverlay = $('.nav-overlay');
        if ($navOverlay.length === 0) {
            $navOverlay = $('<div class="nav-overlay"></div>');
            $body.append($navOverlay);
        }
        
        // 点击遮罩关闭导航
        $navOverlay.off('click.folix').on('click.folix', function () {
            $body.removeClass('nav-open');
            console.log('[Folix] Nav closed via overlay');
        });
    }

    /**
     * 初始化
     */
    function init() {
        // 只在移动端执行
        mediaCheck({
            media: '(max-width: 767px)',
            entry: function () {
                console.log('[Folix] Mobile mode detected');
                initMobileSearch();
                initMobileNav();
            },
            exit: function () {
                console.log('[Folix] Desktop mode detected');
                // 清理移动端事件
                $('.block-search .label, .nav-toggle, .nav-overlay').off('click.folix');
                $(document).off('keydown.folix');
            }
        });
    }

    return init();
});
