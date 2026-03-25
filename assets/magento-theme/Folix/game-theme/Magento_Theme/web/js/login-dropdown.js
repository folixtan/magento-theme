/**
 * Folix Game Theme - Login Dropdown
 * 
 * 功能：
 * 1. PC端：鼠标移入展开，移出关闭
 * 2. 移动端：点击展开/收起
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

    console.log('[Folix] Login Dropdown JS Loaded');

    var $body = $('body'),
        $wrapper = null,
        $trigger = null,
        $dropdown = null;

    /**
     * 初始化变量
     */
    function initVars() {
        $wrapper = $('.login-dropdown-wrapper');
        $trigger = $('.login-trigger');
        $dropdown = $('.login-dropdown');
        
        console.log('[Folix] Elements found:', {
            wrapper: $wrapper.length,
            trigger: $trigger.length,
            dropdown: $dropdown.length
        });
    }

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
        console.log('[Folix] Opening dropdown');
        $dropdown.addClass('open');
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
        console.log('[Folix] Closing dropdown');
        $dropdown.removeClass('open');
        $trigger.removeClass('active');
        
        // 移除遮罩
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
     */
    function switchTab(tabName) {
        console.log('[Folix] Switching to tab:', tabName);
        
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
        console.log('[Folix] Initializing desktop events (hover)');
        
        var hoverTimeout = null;
        
        // 鼠标移入展开
        $wrapper.off('mouseenter.folixLogin').on('mouseenter.folixLogin', function (e) {
            clearTimeout(hover_timeout);
            openDropdown();
        });
        
        // 鼠标移出关闭
        $wrapper.off('mouseleave.folixLogin').on('mouseleave.folixLogin', function (e) {
            hover_timeout = setTimeout(function () {
                closeDropdown();
            }, 200);  // 200ms 延迟，避免误关闭
        });
        
        // 移除点击事件
        $trigger.off('click.folixLogin');
    }

    /**
     * 初始化移动端事件（click）
     */
    function initMobileEvents() {
        console.log('[Folix] Initializing mobile events (click)');
        
        // 移除hover事件
        $wrapper.off('mouseenter.folixLogin mouseleave.folixLogin');
        
        // 点击触发按钮
        $trigger.off('click.folixLogin').on('click.folixLogin', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        });
    }

    /**
     * 初始化公共事件
     */
    function initCommonEvents() {
        console.log('[Folix] Initializing common events');
        
        // 点击下拉菜单内部（阻止冒泡）
        $dropdown.off('click.folixLogin').on('click.folixLogin', function (e) {
            e.stopPropagation();
        });
        
        // 点击外部关闭（移动端）
        $(document).off('click.folixLogin').on('click.folixLogin', function (e) {
            if ($dropdown.hasClass('open') && $(window).width() < 768) {
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
            alert('第三方登录功能即将上线：' + provider);
        });
    }

    /**
     * 初始化
     */
    function init() {
        initVars();
        
        if ($wrapper.length === 0) {
            console.log('[Folix] Login dropdown not found');
            return;
        }
        
        initCommonEvents();
        
        // 响应式初始化
        mediaCheck({
            media: '(min-width: 768px)',
            entry: function () {
                console.log('[Folix] Entering desktop mode');
                initDesktopEvents();
            },
            exit: function () {
                console.log('[Folix] Exiting desktop mode');
                initMobileEvents();
            }
        });
        
        // 立即执行一次检查
        if ($(window).width() >= 768) {
            initDesktopEvents();
        } else {
            initMobileEvents();
        }
        
        console.log('[Folix] Login dropdown initialized');
    }

    // 声明 hover_timeout 变量
    var hover_timeout;
    
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
