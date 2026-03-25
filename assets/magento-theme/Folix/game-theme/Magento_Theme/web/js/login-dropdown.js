/**
 * Folix Game Theme - Login Dropdown
 * 
 * 功能：
 * 1. 点击按钮展开/收起下拉菜单
 * 2. 登录/注册表单切换
 * 3. 点击外部关闭
 * 4. 第三方登录预留接口
 */

define([
    'jquery',
    'domReady!'
], function ($) {
    'use strict';

    console.log('[Folix] Login Dropdown JS Loaded');

    var $body = $('body'),
        $wrapper = $('.login-dropdown-wrapper'),
        $trigger = $('.login-trigger'),
        $dropdown = $('.login-dropdown');

    /**
     * 切换下拉菜单
     */
    function toggleDropdown() {
        var isOpen = $dropdown.hasClass('open');
        
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    /**
     * 打开下拉菜单
     */
    function openDropdown() {
        $dropdown.show().addClass('open');
        $trigger.addClass('active');
        
        // 添加遮罩（移动端）
        if ($(window).width() < 768) {
            addOverlay();
        }
    }

    /**
     * 关闭下拉菜单
     */
    function closeDropdown() {
        $dropdown.removeClass('open');
        $trigger.removeClass('active');
        
        // 延迟隐藏（等待动画完成）
        setTimeout(function () {
            if (!$dropdown.hasClass('open')) {
                $dropdown.hide();
            }
        }, 300);
        
        // 移除遮罩
        removeOverlay();
    }

    /**
     * 添加遮罩（移动端）
     */
    function addOverlay() {
        if ($('.login-overlay').length === 0) {
            $body.append('<div class="login-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99;"></div>');
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
     * 初始化事件绑定
     */
    function initEvents() {
        console.log('[Folix] Initializing login dropdown events');
        
        // 点击触发按钮
        $trigger.off('click.folixLogin').on('click.folixLogin', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        });
        
        // 点击下拉菜单内部（阻止冒泡）
        $dropdown.off('click.folixLogin').on('click.folixLogin', function (e) {
            e.stopPropagation();
        });
        
        // 点击外部关闭
        $(document).off('click.folixLogin').on('click.folixLogin', function (e) {
            if ($dropdown.hasClass('open')) {
                closeDropdown();
            }
        });
        
        // 标签切换
        $dropdown.find('.dropdown-tab').off('click.folixLogin').on('click.folixLogin', function (e) {
            e.preventDefault();
            var tabName = $(this).data('tab');
            switchTab(tabName);
        });
        
        // 遮罩点击关闭（移动端）
        $body.off('click.folixLoginOverlay').on('click.folixLoginOverlay', '.login-overlay', function (e) {
            closeDropdown();
        });
        
        // ESC 键关闭
        $(document).off('keydown.folixLogin').on('keydown.folixLogin', function (e) {
            if (e.keyCode === 27 && $dropdown.hasClass('open')) {
                closeDropdown();
            }
        });
        
        // 第三方登录按钮（预留）
        $dropdown.find('.btn-social').off('click.folixLogin').on('click.folixLogin', function (e) {
            e.preventDefault();
            var provider = $(this).hasClass('btn-google') ? 'google' : 'facebook';
            console.log('[Folix] Social login clicked:', provider);
            
            // TODO: 实现第三方登录
            alert('第三方登录功能即将上线：' + provider);
        });
    }

    /**
     * 初始化
     */
    function init() {
        if ($wrapper.length === 0) {
            console.log('[Folix] Login dropdown not found');
            return;
        }
        
        initEvents();
        console.log('[Folix] Login dropdown initialized');
    }

    // 立即初始化
    init();
    
    // 返回公共接口
    return {
        open: openDropdown,
        close: closeDropdown,
        toggle: toggleDropdown,
        switchTab: switchTab
    };
});
