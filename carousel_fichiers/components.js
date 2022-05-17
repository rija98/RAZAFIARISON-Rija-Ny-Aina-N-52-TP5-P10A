/*
 * (C)opyright Solocal Group 2014-2015
 *
 * This is Solocal Group proprietary source code.
 * Any reproduction modification or use without prior written
 * approval from Solocal Group is strictly forbidden.
 * 
 */
/* ``last_updated`` component */
/*jslint browser: true */
/*global define */
define('last_updated', ['jquery', 'domReady'], function ($, domReady) {
    "use strict";

    domReady(function () {
        $(".component.last_updated .send-magickey").click(function() {
            var $this = $(this),
                target = $this.data('target'),
                $target = $(target);

            // open/close the target
            $target.trigger('open-close');
            return false;
        });
    });

});


/* ``background`` component */
define('background', [], function(){
});


/* ``links`` component */
define('links', [], function(){
});


/* ``brochures`` component */
define('brochures', [], function(){
});


/* ``head`` component */
define('head', [], function(){
});


/* ``favicon`` component */
define('favicon', [], function(){
});


/* ``menu`` component */
define('menu', [ "jquery" ], function($) {

    /* editus mobile menu */
    var overlay_toggle = false,
        targetSelector = '.component.menu.overlay-menu',
        $overlayButton = $('.component.menu.editus-overlay-button_view');
        $target = $(targetSelector);

    function overlay() {
        $overlayButton.find('img').each(function() {
            if (!overlay_toggle) {
                adjustOverlay();
                $(this).attr('src', $(this).data('clicked-src'));
                $target.css('display', 'inline');
                overlay_toggle = true;
            } else {
                $(this).attr('src', $(this).data('normal-src'));
                $target.css('display', 'none');
                overlay_toggle = false;
            }
        });
    }

    function eraseOverlay() {
        $overlayButton.find('img').each(function() {
            $(this).attr('src', $(this).data('normal-src'));
            $target.css('display', 'none');
            overlay_toggle = false;
        });
    }

    function adjustOverlay() {
        // placememnt de l'overlay menu pour les positions left / top,
        // par
        // rapport au bouton "menu"
        $overlayButton.find('img').each(function() {
            $target.css(
                'left',
                ($(this).position().left
                    + ($(this).width() / 2)
                    + ($target.outerWidth() - $target.innerWidth())  // border
                    - $target.width())
                + 'px');
            $target.css(
                'top',
                ($(this).position().top
                    + $(this).height() - 1)
                    + 'px');
        });
    }

    function routine() {
        // utilise par le plugin smartphone pour gerer les problemes
        // lies aux
        // positions lorsque l'on passe du mode portrait a paysage
        adjustOverlay();
    }

    $overlayButton.click(function() {
        overlay()
    });

});


/* ``means_of_payment`` component */
define('means_of_payment', [], function(){
});


/* ``languages`` component */
/*jslint browser: true */
/*global define, require*/
define('languages', ['jquery', 'domReady'], function($, domReady){

    domReady(function () {
        $('.component.languages.dropdown_view').each(function () {
            var $this = $(this),
                $selectedLanguage = $this.find('.active a'),
                $availableLanguages = $this.find('.available-languages')

            $selectedLanguage.click(function() {
                $availableLanguages.stop(true, true).slideToggle(function () {
                    $availableLanguages.toggleClass('opened');
                    $(this).css('display', '');
                });
                return false;
            });
        });
    });

});


/* ``site_title`` component */
define('site_title', [], function(){});


/* ``booking`` component */
define('booking', ['jquery'], function ($) {
    var localinaBookingButton = $('.component.booking .localina-booking-button');

    if(localinaBookingButton.length > 0) {
        require(['localina'], function() {
            var data = localinaBookingButton.data();
            localinaBookingButton.on('click', function(){
                Localina.startBooking(data.phone, data.apiKey, data.language, $(this), true);

                return false;
            });
        });
    }
});


/* ``popin`` component */
define('popin', ['jquery'], function($) {
    $(document).on("click", ".component.popin", function(e) {
        if (this === e.target) {  // we clicked on the background mask
            $(this).trigger('open-close');
        }
    });

    $(document).on('open-close', ".component.popin", function (e) {
        var $this = $(this);

        /* toggle open/close */
        $this.toggleClass('closed');

        /* if opened, scroll to the top of the browser window */
        if (!$this.is('.closed')) {
            $('html,body').animate({scrollTop: 0}, 1000);
        }
    });
});

/* ``spoken_languages`` component */
define('spoken_languages', [], function(){
});


/* ``site_params`` component */
/*jslint browser: true */
/*global define */
define('site_params', ['jquery'], function ($) {
    "use strict";
    if (document.getElementsByClassName('site_params').length > 0) {
        var siteParamsEl = document.getElementsByClassName('site_params')[0],
            language_country = siteParamsEl.getAttribute('lang'),
            langSplit = language_country.split('-', 2),
            language = langSplit[0],
            country = langSplit[1];

        return {
            language: language,
            country: country,
            language_country: language_country
        }
    }
});


/* ``schedule`` component */
define('schedule', [], function(){
});


/* ``cart`` component */
/*jslint browser: true */
/*global define, require*/
define('cart', [ 'jquery'], function ($) {
    "use strict";

    return {
          setupBasketForm: function (formId) {
            var $form = $('#' + formId),
                $inputs = $('input[type=text], input[type=checkbox], input[type=radio], select', $form),
                $updateBtn = $('.update-basket', $form),
                updateFunc = $updateBtn.get(0).onclick;

            $inputs.change(function () {
                $updateBtn.click();
            });

            // Note: we can't cancel the execution of a function attached to the "onclick"
            // attribute from a jQuery event handler. That's why we need to remove the
            // "onclick" attribute and call the function itself in our click handler.
            $updateBtn.removeAttr('onclick');

            $updateBtn.click(function (event) {
                // prevent double submission problems
                if ($updateBtn.data('updating')) {
                    return false;
                }
                $updateBtn.data('updating', true);

                // call the original update handler
                updateFunc.call(this, event);
                return false;
            });
        },

        submitPaypalPaymentForm: function () {
            $(".paypal-payment-form").submit();
        },

        updateBasketButton: function (basketButtonView, basketButtonLabel) {
            var $basketButtonHtml = $('.component.cart.' + basketButtonView + '_view .show-basket'),
                products_number = basketButtonLabelData[0],
                buttonContent = '';
            if (products_number){
            	buttonContent = '<span class="basket-button-number">' + products_number + '</span>';
            }
            buttonContent += '<span class="basket-button-label"> ' + basketButtonLabelData[1] + '</span>';
            $basketButtonHtml.html(buttonContent);
        },

        displayShippingForm: function(billingShippingCheckbox){
            var isChecked = $('#'+ billingShippingCheckbox.id).is(':checked');
            $('.shipping-content').toggle(isChecked);
        },
    };
});


/* ``legal_notice`` component */
/*jslint browser: true */
/*global define, require*/
define('legal_notice', [], function () {
    "use strict";
});


/* ``social_sharing`` component */
/*global define, window, document, FB, IN */
define('social_sharing', ['require', 'jquery', 'site_params', 'domReady'], function (require, $, siteParams, domReady) {
    "use strict";

    // FIXME: maybe we should not manage the urls in this module?
    var title = encodeURIComponent(document.title),
        location = encodeURIComponent(document.location.toString()),
        publisher = encodeURIComponent($("meta[name=author]").attr('content')),
        popup = function (url, width, height, scroll, windowId) {
            var id = windowId || "pop_up_" + Math.round(Math.random() * 1000000),
                left = window.screen.availLeft + ((window.screen.availWidth - width) / 2),  // center horizontally on current screen
                top = window.screen.availTop + ((window.screen.availHeight - height) / 2),  // center vertically on current screen
                config = "top=" + top + ",left=" + left + ",width=" + width + ", height=" + height + ",scrollbars=" + scroll + ",status=no,toolbar=no,resizable=yes,menubar=no,location=no",
                myWindow = window.open(url, id, config);
            myWindow.focus();
        };

    function setupFacebookWidgets() {
        if ($(".component.social_sharing .fb-page").length > 0) {
            // see:
            // - https://developers.facebook.com/docs/plugins/page-plugin
            // - https://developers.facebook.com/docs/javascript/howto/requirejs/v2.3

            var lang = siteParams.language_country.replace('-', '_');

            // create a root element if necessary (avoid a warning)
            if ($("#fb-root").length === 0) {
                $('body').prepend('<div id="fb-root"></div>');
            }

            // load the Facebook API and configure it
            require(['//connect.facebook.net/' + lang + '/sdk.js'], function () {
                FB.init({
                    // appId provided by Christian Clouard in an email at 29/06/2015 15:35
                    appId: '409759472539976',
                    xfbml: true,
                    version: 'v2.3'
                });
            });
        }
    }

    function setupGoogleWidgets() {
        if ($(".component.social_sharing .g-plusone, .component.social_sharing .g-plus").length > 0) {
            // see:
            // - https://developers.google.com/+/web/+1button/
            // - https://developers.google.com/+/web/badge/

            // configure the Google+ API
            window.___gcfg = {
                lang: siteParams.language_country
            };

            // load the Google+ API
            require(["//apis.google.com/js/plusone.js"]);
        }
    }

    function setupLinkedInWidgets() {
        // LinkedIn scripts have a "type" starting with "IN/"
        if ($(".component.social_sharing script[type^='IN/']").length > 0) {
            // see:
            // - https://developer.linkedin.com/plugins/company-profile
            // - http://stackoverflow.com/questions/9071249

            // load the LinkedIn API and configure it
            require(["//platform.linkedin.com/in.js?async=true"], function () {
                IN.init({
                    lang: siteParams.language_country
                });
            });
        }
    }

    function setupTwitterWidgets() {
        if ($(".component.social_sharing .twitter-share-button, .component.social_sharing .twitter-follow-button").length > 0) {
            // see:
            // - https://dev.twitter.com/web/tweet-button
            // - https://dev.twitter.com/web/follow-button

            // load the Twitter API
            require(["//platform.twitter.com/widgets.js"]);
        }
    }

    function triggerOpenClose($el) {
        var target = $el.data('target'),
            $target = $(target);
        // open/close the target
        $target.trigger('open-close');
        return false;
    }

    domReady(function () {
        $(".component.social_sharing .fb").click(function (event) {
            var url = $(event.target).attr('href');
            popup(url, 630, 440, 'no', 'fb-share');
            return false;
        });

        $(".component.social_sharing .tw-share").click(function (event) {
            var url = $(event.target).attr('href');
            popup(url, 795, 440, 'no', 'tw-share');
            return false;
        });

        $(".component.social_sharing .gplus.share").click(function (event) {
            var url = $(event.target).attr('href');
            popup(url, 500, 440, 'no', 'gplus-share');
            return false;
        });

        $(".component.social_sharing .share-by-email, .component.social_sharing .share-by-sms").click(function (event) {
            return triggerOpenClose($(event.target));
        });

        // liens sociaux editus
        $(".component.social_sharing.editus_view a.facebook").click(function () {
            popup('//www.facebook.com/sharer.php?u=' + location + '&t=' + title, 630, 440, 'yes');
            return false;
        });

        $(".component.social_sharing.editus_view a.twitter").click(function () {
            popup('//twitter.com/timeline/home?status=RT+@' + publisher + '+:+' + title + '+' + location, 795, 440, 'yes');
            return false;
        });

        $(".component.social_sharing.editus-mobile_view a.facebook").click(function () {
            popup('//www.facebook.com/sharer.php?u=' + location + '&t=' + title, 630, 440, 'yes');
            return false;
        });

        $(".component.social_sharing.editus-mobile_view a.twitter").click(function () {
            popup('//twitter.com/timeline/home?status=RT+@' + publisher + '+:+' + title + '+' + location, 795, 440, 'yes');
            return false;
        });

        setupGoogleWidgets();
        setupLinkedInWidgets();
        setupTwitterWidgets();
        setupFacebookWidgets();
    });

    function isBadgeButtonInMobileMode($button) {
        var cursor = $button.css("cursor");
        // mobile/normal link behavior if the cursor is not forced to "default"
        return cursor !== 'default';
    }

    /* Badge popins */
    $(document).on("touchstart click", function (event) {  /* touchstart is needed for iOS */
        var $target = $(event.target),
            $buttonTarget = $target.filter('.badge-button-label'),
            $popinTarget = $target.filter('.badge-popin'),
            $popin = $buttonTarget.siblings('.badge-popin'),
            $popins = $('.badge-popin').not($popin);

        // click on a popin background => ignore the following behavior
        if ($popinTarget.length > 0) {
            event.preventDefault();
            return;
        }

        // click anywhere else => close all the popins except the one
        // associated to the target, if any
        $popins.addClass('closed');

        // click on a badge button in non-mobile mode => toggle the popin
        if ($buttonTarget.length > 0 && !isBadgeButtonInMobileMode($buttonTarget)) {
            // open/close the popin associated to the target
            $popin.toggleClass('closed');
            // prevent the default button (link) action
            event.preventDefault();
        }
    });
});


/* ``address`` component */
define('address', [], function(){
});


/* ``contact_form``  */
define('contact_form', [], function(){});

/* ``apple_touch_icons`` component */
define('apple_touch_icons', [], function(){
});


/* ``contact`` component */
/*global define*/

define('contact', [], function () {
    "use strict";
});


/* ``practical_info`` component */
/*jslint browser: true */
/*global define*/

define('practical_info', ['jquery'], function ($) {
    'use strict';

    $(document).on('click', '.component.practical_info .practical-info-point-of-sale', function (event) {
        var $this = $(this),
            $target = $(event.target),
            $link = $this.find('a.practical-info-point-of-sale-link'),
            link = $link[0];

        // the target element should not be a link, otherwise we should perform the link action and nothing else
        if (link && !$target.is('a')) {
            // Warning: we can't write $link.click() because it does not navigate (see http://learn.jquery.com/events/triggering-event-handlers/)
            link.click();
        }
    });
});

/* ``activity`` component */
define('activity', [], function(){
});
/* ``component_statics`` service */
define('component_statics', ['components'], function() {
});

define('socrea', ['backbone', 'underscore', 'jquery', 'epoxy'], function(backbone, _, $) {

    _.templateSettings = {
        interpolate : /\{\{(.+?)\}\}/g
    };

    var SocreaTemplateView = backbone.View.extend({
        render : function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        initialize : function() {
            this.listenTo(this.model, "change", this.render);
            this.render();
        }
    });

    var handle_nagare_state_on_links = function() {
        var nagare_s = $('.site_params').attr('data-nagare-s'), nagare_c = $('.site_params').attr('data-nagare-c');
        if (nagare_s) {
            $('body').on(
                    'click',
                    'a[data-nagare-link]',
                    function(event) {
                        var a = event.target;
                        if ($(a).prop('tagName').toLowerCase() == 'a') { // Some targets were not the ``a``. TO FIX
                            var href = $(a).attr('href');
                            if (href != '#' && href.substring(0, 11) != 'javascript:' && href.indexOf('?') == -1) {
                                var form_ = $('<form method="POST" action="' + $(a).attr('href') + '"><input type="hidden" name="_s" value="' + nagare_s + '"><input type="hidden" name="_c" value="'
                                        + nagare_c + '">');
                                $('body').append(form_);
                                event.preventDefault();
                                form_.submit();
                            }
                        }
                    });
        }
    };
    //handle_nagare_state_on_links();

    return {
        Collection : backbone.Collection,
        Model : backbone.Model,
        View : backbone.Epoxy.View,
        TemplateView : SocreaTemplateView
    };

});

function define_components_repository(requirements) {
    define('socrea.components_repository', requirements, function(req, _) {
        res = {
            components : {},
            components_css: {},
            get_component : function(name) {
                return this.components[name];
            },
            init : function() {
                var that = this;
                _.each(requirements, function(component_name, ind, lst) {
                    req([component_name], function(comp) {
                        that.components[component_name] = comp;
                        if (comp && comp.on_components_loaded != undefined) {
                            comp.on_components_loaded(this);
                        }
                    });
                });
                if (window.console) {
                    console.log('Components deferred loading initiated');
                }
            },
            refresh: function(components_resources){
                console.log('Refreshing components...');
                var that = this;
                var old_components_js = _.keys(this.components);
                _.each(components_resources, function(new_components, resource_url, lst){
                    if( resource_url.substring(resource_url.length - 3, resource_url.length) == '.js' ){
                        new_components = _.keys(new_components)
                        var components_to_load = _.filter(new_components,
                                                          function(elem){ return !_.contains(old_components_js, elem)});
                        
                        if( components_to_load.length > 0 ){
                            if (window.console) {
                                console.log('Loading new components JS: ' + components_to_load);
                            }
                            // Load new components each one at a time
                            _.each(components_to_load, function(component_name, ind, lst){
                                var config = {}
                                config[component_name] = resource_url + '?reload=&items=' + component_name;
                                require.config({'paths' : config});
                            });
                            // Re init to update dictionary and call ``on_services_loaded`` functions
                            that.init(components_to_load);
                        }
                    }else if (resource_url.substring(resource_url.length - 4, resource_url.length) == '.css') {
                        // Find already loaded components CSSs
                        var old_components_css = [];
                        $('link[rel="stylesheet"][data-component-stylesheet="true"]').each(function(ind, css){
                            var items = $(css).data('items');
                            _.each(items.split(','), function(elem, ind, lst){
                                old_components_css.push(elem);
                            });
                        });
                        
                        new_components = _.keys(new_components);
                        var components_to_load = _.filter(new_components, function(elem) {
                            return !_.contains(old_components_css, elem)
                        });
                        
                        if (components_to_load.length > 0) {
                            if (window.console) {
                                console.log('Loading new components CSS: ' + components_to_load);
                            }
                            
                            // Insert new components CSS declaration
                            var components_css_decl = _.reduce(components_to_load, function(res, elem){ return res + ',' + elem; });
                            var $css = $('link[rel="stylesheet"][data-component-stylesheet="true"]:first');
                            var newcss = $('<link rel="stylesheet" data-items="' + components_css_decl + '" data-component-stylesheet="true" type="text/css" href="' + resource_url + '?reload=&items=' + components_css_decl + '">');
                            $(newcss).insertAfter($css);
                        }
                    }
                });
            }
        };
        res.init();
        return res;
    });
    if (window.console) {
        console.log('Loading components...');
    }
    require(['socrea.components_repository']);
}


define_components_repository(['require', 'underscore', 'socrea', 'services', 'last_updated', 'background', 'links', 'brochures', 'head', 'favicon', 'menu', 'means_of_payment', 'languages', 'site_title', 'booking', 'popin', 'spoken_languages', 'site_params', 'schedule', 'cart', 'legal_notice', 'social_sharing', 'address', 'contact_form', 'apple_touch_icons', 'contact', 'practical_info', 'activity']);