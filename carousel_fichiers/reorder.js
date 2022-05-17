/*jslint browser: true */
/*global define, require*/
define('reorder', ['jquery'], function ($) {
    "use strict";

    /* Reorder a layout when the page width changes, i.e. implement reordering according to responsive rules.
     *
     * Parameters:
     * - $el: layout component jQuery selector 
     * - rules: map breakpoint widths to the permutation of the layout
     *   items, e.g: { 480: [3, 1, 2], 960: [1, 3, 2] }
     */
    function ReorderableLayout($el, rules) {

        this.$el = $el;
        this.$container = this.$el.children('.item-container');
        this.$items = this.$container.children('.item');
        this.rules = rules;
        this.initializeOrdering();

        this.updateOrder();
        $(window).resize($.proxy(this.updateOrder, this));
    }

    ReorderableLayout.prototype.initializeOrdering = function () {
        var itemByIndex = {},
            indexes = [];

        this.$items.each(function (index) {
            var $this = $(this);
            itemByIndex[index + 1] = $this;
            indexes.push(index + 1);
        });

        this.itemByIndex = itemByIndex;
        this.currentOrder = this.defaultOrder = indexes;
    };

    ReorderableLayout.prototype.getOrder = function (width) {
        var breakpoint,
            ruleWidth;

        if (!this.rules) {
            return this.defaultOrder;
        }

        /* find the proper breakpoint */
        breakpoint = Number.MAX_VALUE;
        for (ruleWidth in this.rules) {
            if (this.rules.hasOwnProperty(ruleWidth)) {
                if ((width <= ruleWidth) && (ruleWidth < breakpoint)) {
                    breakpoint = ruleWidth;
                }
            }
        }

        return (breakpoint !== Number.MAX_VALUE) ? this.rules[breakpoint] : this.defaultOrder;
    };

    ReorderableLayout.prototype.updateOrder = function () {
        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            newOrder = this.getOrder(width),
            currentOrder = this.currentOrder,
            itemsContents = {},
            index;

        if (newOrder !== this.currentOrder) {
            if (window.console) {
                window.console.log('Reordering the items of ' + this.$el.selector + ': ' + newOrder);
            }

            // we suppose that we have valid permutations in the rules...
            // first, we get the items' content in order by taking into account the current order
            // then, we apply the new order on the items' content
            // finally, we rewrite the items' inner content

            this.$items.each(function (i) {
                index = currentOrder[i];
                itemsContents[index] = $(this).children();
            });

            this.$items.each(function (i) {
                index = newOrder[i];
                itemsContents[index].detach().appendTo($(this));
            });

            this.currentOrder = newOrder;
        }
    };

    function reorderLayout($el, rules) {
        return new ReorderableLayout($el, rules);
    }

    /* External API */
    return {
        reorderLayout: reorderLayout
    };
});