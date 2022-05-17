/*jslint browser: true */
/*global require*/
require.config({
    'shim': {
        'jquery.tinyscrollbar.min': {'deps': ['jquery']},
    }
});

require(['jquery', 'reorder', 'base_menu', 'jquery.tinyscrollbar.min'], function ($, reorder, menu) {
    'use strict';

    function addCustomScrollbar($elements) {
        $elements.each(function () {
            var $this = $(this),
                $scrollbar = $('<div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>'),
                $viewport = $('<div class="viewport"></div>'),
                $overview = $('<div class="overview"></div>');

            $overview.html($this.html());
            $this.empty();
            $viewport.append($overview);
            $this.append($scrollbar);
            $this.append($viewport);
            $this.addClass('custom-scrollbar');
            $this.tinyscrollbar();
        });
    }

    function setupMobileMenu($menu, $toggle) {

        function isVisible() {
            return $toggle.is(':visible');
        }

        // called each time we load or resize a page
        function setMenuClass() {
            $menu.toggleClass('mobile-off', !isVisible());
        }
        $(window).resize(setMenuClass);
        setMenuClass();

        // When clicking on toggle button, toggle menu open
        $toggle.click(function () {
            $menu.slideToggle();
        });

    }

    function setupDesktopMenu(){
        var desktopMenu = $('.desktop-menu'),
            isHorizontal = desktopMenu.hasClass('horizontal-menu'),
            setupMenu = isHorizontal ? menu.setupHorizontalMenu : menu.setupVerticalMenu;

        setupMenu(desktopMenu);
    }

    /*$(document).ready(function () {*/
    addCustomScrollbar(
        $('.blocks .component.presentation .short-text,' +
          '.blocks .component.news .news-content,' +
          '.blocks .component.activity .short-text,' +
          '.blocks .component.practical_info .practical_info_contents'
          )
    );
    setupMobileMenu($('.mobile-menu'), $('.menu-toggle'));
    setupDesktopMenu();

    $(document).on('mba-offers-loaded', function (e) {
        addCustomScrollbar($('.mba-offers .offer', $(e.target)));
    });

    // blocks order responsive rules
    reorder.reorderLayout($('.T001_RD .component.blocks, .T002_RD .component.blocks, .T003_RD .component.blocks, .T004_RD .component.blocks, .T004b_RD .component.blocks, .T005_RD .component.blocks'), {
        480: [3, 1, 2]
    });

    function getInternetExplorerVersion() {
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        } else if (navigator.appName == 'Netscape') {
            var ua = navigator.userAgent;
            var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    }

    if (getInternetExplorerVersion() != -1) {
        $('body').addClass('browser-msie');
    }
});
