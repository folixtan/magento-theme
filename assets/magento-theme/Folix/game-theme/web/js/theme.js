/**
 * Folix Game Theme - Main Theme JavaScript
 * 
 * @category  Design
 * @package   Folix_GameTheme
 */

define([
    'jquery',
    'mage/apply/main',
    'domReady!'
], function($, mage) {
    'use strict';

    return function() {
        /**
         * Initialize all theme components
         */
        function init() {
            // Initialize hero slider
            $('.hero-slider').each(function() {
                require(['heroSlider'], function(heroSlider) {
                    heroSlider({}, this);
                }.bind(this));
            });

            // Initialize navigation
            $('.navigation').each(function() {
                require(['navigationMenu'], function(navigationMenu) {
                    navigationMenu({}, this);
                }.bind(this));
            });

            // Initialize product cards
            $('.product-item').each(function() {
                require(['productCard'], function(productCard) {
                    productCard({}, this);
                }.bind(this));
            });

            // Smooth scroll for anchor links
            $('a[href^="#"]').on('click', function(e) {
                var target = $(this).attr('href');
                if (target !== '#') {
                    e.preventDefault();
                    $('html, body').animate({
                        scrollTop: $(target).offset().top - 100
                    }, 500);
                }
            });

            // Back to top button
            var $backToTop = $('<button class="back-to-top" title="Back to Top">↑</button>');
            $backToTop.appendTo('body');

            $(window).on('scroll', function() {
                if ($(this).scrollTop() > 300) {
                    $backToTop.fadeIn();
                } else {
                    $backToTop.fadeOut();
                }
            });

            $backToTop.on('click', function() {
                $('html, body').animate({ scrollTop: 0 }, 600);
            });

            // Lazy load images
            if ('IntersectionObserver' in window) {
                var imageObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var image = entry.target;
                            image.src = image.dataset.src;
                            image.classList.remove('lazy');
                            imageObserver.unobserve(image);
                        }
                    });
                });

                var lazyImages = document.querySelectorAll('img.lazy');
                lazyImages.forEach(function(image) {
                    imageObserver.observe(image);
                });
            }

            console.log('Folix Game Theme initialized');
        }

        // Run initialization
        init();

        return this;
    };
});
