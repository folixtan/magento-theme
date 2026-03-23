/**
 * Folix Game Theme - Product Card JavaScript
 * 
 * @category  Design
 * @package   Folix_GameTheme
 */

define([
    'jquery',
    'domReady!'
], function($) {
    'use strict';

    return function(config, element) {
        var $productCard = $(element);
        var $image = $productCard.find('.product-item-photo img');
        var $addToCartBtn = $productCard.find('.action.tocart');
        var $wishlistBtn = $productCard.find('.action.towishlist');
        var $compareBtn = $productCard.find('.action.tocompare');

        /**
         * Add to cart animation
         */
        $addToCartBtn.on('click', function() {
            var $btn = $(this);
            var originalText = $btn.text();
            
            // Show loading state
            $btn.prop('disabled', true);
            $btn.html('<span class="loading">Adding...</span>');
            
            // Simulate add to cart (replace with actual AJAX call)
            setTimeout(function() {
                $btn.html('<span class="success">✓ Added!</span>');
                
                setTimeout(function() {
                    $btn.prop('disabled', false);
                    $btn.html('<span>' + originalText + '</span>');
                }, 2000);
            }, 1000);
        });

        /**
         * Wishlist animation
         */
        $wishlistBtn.on('click', function(e) {
            e.preventDefault();
            var $btn = $(this);
            
            $btn.toggleClass('active');
            
            if ($btn.hasClass('active')) {
                $btn.find('span').text('♥');
            } else {
                $btn.find('span').text('♡');
            }
        });

        /**
         * Image hover zoom effect
         */
        $productCard.on('mouseenter', function() {
            $image.css('transform', 'scale(1.1)');
        }).on('mouseleave', function() {
            $image.css('transform', 'scale(1)');
        });

        /**
         * Quick view (if needed)
         */
        $productCard.find('.action.quick-view').on('click', function(e) {
            e.preventDefault();
            // Implement quick view modal
            console.log('Quick view triggered');
        });

        return this;
    };
});
