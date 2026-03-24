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
    'domReady!'
], function ($, mediaCheck) {
    'use strict';

    return function () {
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
            // 点击搜索图标
            $searchLabel.on('click.folixMobile', function (e) {
                e.preventDefault();
                
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
            $(document).on('click.folixMobile', function (e) {
                if (!$(e.target).closest('.block-search').length) {
                    $searchLabel.removeClass('active');
                    $searchControl.slideUp(300);
                }
            });

            // ESC 键关闭搜索框
            $(document).on('keydown.folixMobile', function (e) {
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
            // 确保导航切换按钮工作
            $navToggle.on('click.folixMobile', function () {
                $body.toggleClass('nav-open');
            });

            // 点击遮罩关闭导航
            var $navOverlay = $('<div class="nav-overlay"></div>');
            $navOverlay.insertAfter($navSections);
            
            $navOverlay.on('click', function () {
                $body.removeClass('nav-open');
            });
        }

        /**
         * 桌面端清理
         */
        function cleanupMobileEvents() {
            $searchLabel.off('.folixMobile');
            $(document).off('.folixMobile');
            $('.nav-overlay').remove();
        }

        /**
         * 响应式初始化
         */
        mediaCheck({
            media: '(max-width: 767px)',
            entry: function () {
                // 移动端初始化
                initMobileSearch();
                initMobileNav();
            },
            exit: function () {
                // 桌面端清理
                cleanupMobileEvents();
                $searchLabel.removeClass('active');
                $searchControl.show();
            }
        });
    };
});
