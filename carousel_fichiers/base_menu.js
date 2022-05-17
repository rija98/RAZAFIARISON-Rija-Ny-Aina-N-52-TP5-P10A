define('base_menu', ['jquery'], function ($) {
    "use strict";

    function setupMenu(menu, isHorizontal){
        var menu = $(menu).selector,
            topLevelItem = menu + ' > .item-container > .item',
            opened = 'opened',
            $document = $(document);

        function hasSubmenu($item) {
            return $item.children('.item-container').length > 0;
        }

        function collapseSubmenus() {
            $(topLevelItem).removeClass(opened);
        }

        $document.on('click touchstart', topLevelItem, function (event) {
            var $item = $(event.currentTarget),  // the top level item
                $itemLink = $item.find('>.menu-link'),  // .menu-link inside the top level item
                $target = $(event.target);  // may be the top level item itself or one of its descendant

            // click on a top level item: should trigger a click on the link
            // inside it
            if (event.type === 'click' && $target.is($item)) {
                $itemLink[0].click();
                return false;
            }

            // not a top level item link: do nothing special...
            if (!$target.is($itemLink)) {
                // prevent the sub-menus close of the document click handler as
                // it interferes with the touchstart/click conversion
                event.stopPropagation();
                return;
            }

            // from now on, we're handling a click on a top level link

            // close other sub-menus
            if (isHorizontal) {
                $(topLevelItem).not($item).removeClass(opened);
            }

            // open the sub-menu and prevent link navigation except if:
            // - there's no sub-menu
            // - the sub-menu is already opened (i.e. either with class opened,
            //   or active in vertical mode)
            if (!hasSubmenu($item)) {
                return;
            }

            if ($item.hasClass('opened') || ($item.hasClass('active') && !isHorizontal)) {
                return;
            }

            // open sub-menu and prevent link action
            $item.addClass('opened');
            return false;
        });

        // click outside an item => close
        $document.on('click touchstart', collapseSubmenus);

        // Beware, the iPad triggers a mouseenter event when we click on an
        // element, that why we need to handle touchstart events above
        $document.on('mouseenter', topLevelItem, function (event) {
            $(event.currentTarget).addClass(opened);
        });

        $document.on('mouseleave', isHorizontal ? topLevelItem : menu, collapseSubmenus);
    }

    function setupHorizontalMenu(menu) {
        return setupMenu(menu, true);
    }

    function setupVerticalMenu(menu) {
        return setupMenu(menu, false);
    }

    return {
        setupHorizontalMenu: setupHorizontalMenu,
        setupVerticalMenu: setupVerticalMenu
    };
});