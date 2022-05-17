/*
 * (C)opyright Solocal Group 2014-2015
 *
 * This is Solocal Group proprietary source code.
 * Any reproduction modification or use without prior written
 * approval from Solocal Group is strictly forbidden.
 * 
 */
/* ``xiti_stats`` service */
define('xiti_stats', ['require'], function() {
    return {
        init: function(conf) {
            if(conf['enable_stats']) {
                xt1 = conf['domain'];
                xtnv = document;        //parent.document or top.document or document
                xtsd = conf['stats_url'];
                xtsite = conf['stats_s'];
                xtn2 = "";        // level 2 site ID
                xtpage = conf['page'];        //page name (with the use of :: to create chapters)
                xtdi = "";        //implication degree
                xt_multc = "&" + conf['params'];  //all the xi indicators (like "&x1=...&x2=....&x3=...")
                xt_an = "";        //user ID
                xt_ac = "";        //category ID

                if (window.xtparam==null) window.xtparam = '';
                window.xtparam += "&ac="+xt_ac+"&an="+xt_an+xt_multc;

                require(['xtcore'], function(xtcore) {});
            } else {
                if (window.console) {
                    console.log('XitiStats: xt_page=' + conf['page']);
                }
            }
        },
        click_on_link: function(enable_stats, that, label, mode){
            if( enable_stats ) {
                xt_med('C', '', label, mode);   // xt_med instead of xt_click to prevent Xiti from opening the link automatically
                                                // see http://help.atinternet-solutions.com/FR/implementation/specific_tags/tg_clicks_fr.htm
            } else {
                if (window.console) {
                    console.log('XitiStats: click on ' + that + ', label=' + label + ', mode=' + mode);
                }
            }
        },
        click_on_form_button: function(enable_stats, that, label, mode){
            if( enable_stats ) {
                if( that && that.form ){
                    xt_form(that.form, 'C', '', label, mode, false);    // prevent Xiti from submitting the form automatically
                                                                        // see http://help.atinternet-solutions.com/FR/implementation/specific_tags/tg_clicks_fr.htm
                }
            } else {
                if (window.console) {
                    console.log('XitiStats: click on form button ' + that + ', label=' + label + ', mode=' + mode);
                }
            }
        }
    };
});



/* ``formatting`` service */
/*jslint browser: true */
/*global define*/
define("formatting", ["jquery", "jquery.numeric"], function ($) {
    "use strict";

    return {
        initDropdown: function (dropdownId, selectedValue, nbShownItems) {
            var $dropdownContainer = $("#" + dropdownId),
                $dropdownInput = $dropdownContainer.find("input.dropdown-input"),
                $dropdownSelected = $dropdownContainer.find(".sorting-title"),
                $dropdownSelect = $dropdownContainer.find(".option-list"),
                $selectedOption = $dropdownSelect.find('[data-value="' + selectedValue + '"]');

            selectOption($selectedOption);

            function selectOption($option) {
                var value = $option.attr("data-value"),
                    text = $option.text(),
                    data = $option.data();

                $dropdownInput.attr("value", value);
                $dropdownInput.data(data);
                $dropdownSelected.html(text);
            }

            // Register the dropdown toggle on the container and its children
            $dropdownContainer.on("click", function(e){
                $dropdownContainer.toggleClass("unfolded");
                $dropdownSelect.css({overflowX: 'hidden'});
                e.stopPropagation();
                var options = $dropdownSelect.find('li');
                if (nbShownItems && nbShownItems < options.length) {
                    $dropdownSelect.height(options.outerHeight() * nbShownItems);
                };
            });

            // Also register a handler at document level to fold back the dropdown (lost focus)
            $(document).on("click", function (e) {
                $dropdownContainer.removeClass("unfolded");
            });

            $dropdownSelect.on("click", "li.dropdown-option", function (e) {
                var $option = $(e.target);
                selectOption($option);
                $dropdownInput.trigger("change");
            });
        },

        initSpinner: function (spinnerId, minimum) {
            var $container = $("#" + spinnerId),
                $input = $(".spinner-input", $container),
                $incr = $(".spinner-buttons a.incr", $container),
                $decr = $(".spinner-buttons a.decr", $container);

            // constrain input to positive integers only
            $input.numeric({
                decimal: false,
                negative : false
            });

            function add(value) {
                var current = parseInt($input.val(), 10);

                if (!$input.is(":enabled")) {
                    return;
                }

                current += value;
                if (current < minimum) {
                    current = minimum;
                }
                $input.val(current);
                $input.change();
            }

            // click handler for the incr/decr buttons
            $incr.click(function (e) {
                add(1);
                e.preventDefault();
            });

            $decr.click(function (e) {
                add(-1);
                e.preventDefault();
            });
        }
    };
});


/* ``service_statics`` service */
function define_services_repository(requirements) {
    define('socrea.services_repository', requirements, function(req, _) {
        res = {
            evmanager : {},
            services : {
                'service_statics' : this
            },
            get_service : function(name) {
                return this.services[name];
            },
            init : function(reqs) {
                var that = this;
                _.each(reqs, function(service_name, ind, lst) {
                    req([service_name], function(service) {
                        that.services[service_name] = service;
                        if (service && service.on_services_loaded != undefined) {
                            service.on_services_loaded(this);
                        }
                    });
                });
                if (window.console) {
                    console.log('Services deferred loading initiated');
                }
            },
            refresh : function(require_config, services_resources, components_resources) {
                var that = this;
                if (window.console) {
                    console.log('Refreshing services and components...');
                }

                if (require_config) {
                    require.config(require_config);
                }

                var old_services_js = _.keys(this.services);
                _.each(services_resources, function(new_services, resource_url, lst) {
                    if (resource_url.substring(resource_url.length - 3, resource_url.length) == '.js') {
                        new_services = _.keys(new_services)
                        var services_to_load = _.filter(new_services, function(elem) {
                            return !_.contains(old_services_js, elem)
                        });

                        if (services_to_load.length > 0) {
                            if (window.console) {
                                console.log('Loading new services JS: ' + services_to_load);
                            }
                            
                            // Load new services each one at a time
                            _.each(services_to_load, function(service_name, ind, lst){
                                var config = {}
                                config[service_name] = resource_url + '?reload=&items=' + service_name;
                                require.config({'paths' : config});
                            });
                            // Re init to update dictionary and call ``on_services_loaded`` functions
                            that.init(services_to_load);
                        }
                    }else if (resource_url.substring(resource_url.length - 4, resource_url.length) == '.css') {
                        // Find already loaded services CSSs
                        var old_services_css = [];
                        $('link[rel="stylesheet"][data-service-stylesheet="true"]').each(function(ind, css){
                            var items = $(css).data('items');
                            _.each(items.split(','), function(elem, ind, lst){
                                old_services_css.push(elem);
                            });
                        });
                        
                        new_services = _.keys(new_services);
                        var services_to_load = _.filter(new_services, function(elem) {
                            return !_.contains(old_services_css, elem)
                        });
                        
                        if (services_to_load.length > 0) {
                            if (window.console) {
                                console.log('Loading new services CSS: ' + services_to_load);
                            }
                            // Insert new services CSS declaration
                            var services_css_decl = _.reduce(services_to_load, function(res, elem){ return res + ',' + elem; });
                            var $css = $('link[rel="stylesheet"][data-service-stylesheet="true"]:last');
                            var newcss = $('<link rel="stylesheet" data-items="' + services_css_decl + '" data-service-stylesheet="true" type="text/css" href="' + resource_url + '?reload=&items=' + services_css_decl + '">');
                            $(newcss).insertAfter($css);
                        }
                    }
                });
                require(['socrea.components_repository'], function(repo) {
                    repo.refresh(components_resources);
                });
            }
        };
        res.init(requirements);
        return res;
    });
    if (window.console) {
        console.log('Loading services...');
    }
    require(['socrea.services_repository']);
}

define_services_repository(['require', 'underscore', 'components', 'xiti_stats', 'formatting']);