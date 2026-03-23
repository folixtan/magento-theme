/**
 * Folix Game Theme - Hero Slider JavaScript
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
        var $slider = $(element);
        var $container = $slider.find('.slider-container');
        var $slides = $slider.find('.slide');
        var $dots = $slider.find('.slider-dot');
        var $prevBtn = $slider.find('.slider-arrow--prev');
        var $nextBtn = $slider.find('.slider-arrow--next');
        var currentSlide = 0;
        var totalSlides = $slides.length;
        var autoPlayInterval;

        /**
         * Show specific slide
         */
        function showSlide(index) {
            currentSlide = index;
            
            // Handle circular navigation
            if (currentSlide >= totalSlides) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = totalSlides - 1;
            }
            
            // Animate slide
            $container.css('transform', 'translateX(-' + (currentSlide * 100) + '%)');
            
            // Update dots
            $dots.removeClass('active');
            $dots.eq(currentSlide).addClass('active');
        }

        /**
         * Go to next slide
         */
        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        /**
         * Go to previous slide
         */
        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        /**
         * Start auto play
         */
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        /**
         * Stop auto play
         */
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Event listeners
        $prevBtn.on('click', function(e) {
            e.preventDefault();
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });

        $nextBtn.on('click', function(e) {
            e.preventDefault();
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });

        $dots.on('click', function() {
            stopAutoPlay();
            showSlide($(this).index());
            startAutoPlay();
        });

        // Pause on hover
        $slider.on('mouseenter', stopAutoPlay);
        $slider.on('mouseleave', startAutoPlay);

        // Keyboard navigation
        $(document).on('keydown', function(e) {
            if ($slider.is(':visible')) {
                if (e.key === 'ArrowLeft') {
                    stopAutoPlay();
                    prevSlide();
                    startAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    stopAutoPlay();
                    nextSlide();
                    startAutoPlay();
                }
            }
        });

        // Touch support
        var touchStartX = 0;
        var touchEndX = 0;

        $slider.on('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        });

        $slider.on('touchend', function(e) {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            var swipeThreshold = 50;
            var diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                stopAutoPlay();
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoPlay();
            }
        }

        // Initialize
        showSlide(0);
        startAutoPlay();

        return this;
    };
});
