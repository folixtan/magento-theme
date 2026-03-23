/**
 * Folix Game Theme - Navigation Menu JavaScript
 * 
 * @category  Design
 * @package   Folix_GameTheme
 */

define([
    'jquery',
    'matchMedia',
    'domReady!'
], function($, mediaCheck) {
    'use strict';

    return function(config, element) {
        var $nav = $(element);
        var $toggle = $('.nav-toggle');
        var $menu = $nav.find('.nav.menu');
        var $body = $('body');
        var isMobile = false;

        /**
         * Initialize mobile menu
         */
        function initMobileMenu() {
            $toggle.on('click', function() {
                $menu.slideToggle(300);
                $(this).toggleClass('active');
            });

            // Close menu when clicking outside
            $(document).on('click', function(e) {
                if (!$(e.target).closest('.navigation, .nav-toggle').length) {
                    $menu.slideUp(300);
                    $toggle.removeClass('active');
                }
            });

            // Handle submenu on mobile
            $menu.find('.parent > .level-top').on('click', function(e) {
                if (isMobile) {
                    e.preventDefault();
                    var $parent = $(this).parent();
                    var $submenu = $parent.find('.submenu');
                    
                    $submenu.slideToggle(300);
                    $parent.toggleClass('open');
                }
            });
        }

        /**
         * Initialize desktop menu
         */
        function initDesktopMenu() {
            $menu.find('.parent').on('mouseenter', function() {
                $(this).find('.submenu').stop(true, true).fadeIn(300);
            }).on('mouseleave', function() {
                $(this).find('.submenu').stop(true, true).fadeOut(300);
            });
        }

        /**
         * Handle responsive behavior
         */
        mediaCheck({
            media: '(max-width: 768px)',
            entry: function() {
                isMobile = true;
                $menu.hide();
            },
            exit: function() {
                isMobile = false;
                $menu.show();
            }
        });

        // Initialize
        initMobileMenu();
        initDesktopMenu();

        return this;
    };
});
