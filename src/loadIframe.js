/* ========================================================================
 * zzw: view.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'view';
    var initialization = function(target) {
        render(target);
        $(window).resize(function() {
            size(target);
        });

        target.$tab.on("click", function() {
            showNav(target);
        });
    }

    var render = function(target) {
        target.$spinner = $(target).loading({
            type: 'spinner'
        });
        var opts = $.data(target, pluginName).options;
        target.$tab = tab(target);
        target.$tab.appendTo(opts.navTabs);

        target.$tabPane = tabPane(target);
        target.$tabPane.appendTo(opts.content);

        target.$iframe = _iframe(target);
        target.$iframe.appendTo(target.$tabPane);

        target.$iframe[0].addEventListener("load", function() {
            try{
                size(target);
                target.$spinner.loading("close");
            }catch(e){
                // debugger
            }
        }, false);


        target.$tab.tab("show");
        $(target).addClass('showtab');

        rightMenu(target);
    }
    var showNav = function(target) {
        var opts = $.data(target, pluginName).options;
        if (opts.default) {
            $(target).find(".sub a").removeClass('active');
        } else {
            $(target).find("a").addClass('active');
            $(target).siblings().find("a").removeClass('active');
        }
    }
    var tab = function(target) {
        var opts = $.data(target, pluginName).options;
        var $tab = $("<li>", {
            class: 'active',
            id: "liTab_" + opts.id,
            role: "presentation",
            html: "<a href=\"#" + opts.id + "\" id=\"" + opts.id + "-tab\" role=\"tab\" data-toggle=\"tab\">" + opts.text + "\ <i class=\"glyphicon glyphicon-triangle-bottom\"></i></a>"
        });
        opts.default && $tab.addClass('default');
        return $tab;
    }
    var tabPane = function(target) {
        var opts = $.data(target, pluginName).options;
        opts.content.find(".tab-pane").removeClass('active');
        var $tabPane = $("<div role=\"tabpanel\" id=\"" + opts.id + "\" class=\"tab-pane active\" />");
        opts.default && $tabPane.addClass('default');
        return $tabPane;
    }

    var _iframe = function(target) {
        var opts = $.data(target, pluginName).options;
        var $iframe = $("<iframe id=\"iframe_" + target.id + "\" scrolling=\"auto\" frameborder=\"0\" style=\"width:100%\" src=\"" + opts.ctx + opts.url + "\" />");
        return $iframe;
    }

    var rightMenu = function(target) {
        var opts = $.data(target, pluginName).options;
        $("#" + opts.id + "-tab").rightMenu({
            menuEvent: 'right-click',
            menuSource: 'element',
            menuPosition: 'belowLeft',
            actionsGroups: [
                ['refresh'],
                ['del', 'other', 'full']
            ],
            actions: {
                refresh: {
                    name: '刷新',
                    iconClass: 'glyphicon glyphicon-refresh',
                    onClick: function() {
                        refresh(target)
                    }
                },
                del: {
                    name: '关闭当前页',
                    iconClass: 'glyphicon glyphicon-remove',
                    onClick: function() {
                        close(target);
                    },
                    isEnabled: function(row) {
                        if (opts.default) return false;
                        return true;
                    }
                },
                other: {
                    name: '关闭其他标签页',
                    iconClass: 'glyphicon glyphicon-option-horizontal',
                    onClick: function() {
                        closeOther(target);
                    }
                },
                full: {
                    name: '全屏',
                    iconClass: 'glyphicon glyphicon-fullscreen',
                    onClick: function(row) {
                        fullScreen(target);
                    },
                    isEnabled: function(row) {
                        if (opts.default) return false;
                        return true;
                    }
                }
            }
        });
    }

    var size = function(target) {
        var opts = $.data(target, pluginName).options;
        var windowHeight = $(window).height();
        var navbarTopHeight = $(".header.navbar-fixed-top").outerHeight();
        var tabHeight = target.$tab.outerHeight();
        var getHeight = windowHeight - navbarTopHeight - tabHeight;
        target.$iframe.css("height", getHeight);
        var iframeBody = target.$iframe.contents().find("body")[0];
        target.$iframe.contents().find("body").css({
            width: opts.content.width(),
            height: getHeight,
            margin: 0
        }).attr('data-isLoad', "true");
        // 兼容
        target.$iframe.contents().find("[data-height]").each(function(){
            var _h = getHeight;
            if($(this).attr("data-height") != "true"){
                _h = (getHeight - Number($(this).attr("data-height")));
            }
            $(this).css("height", _h);
            var dataGridBlock = $(this).find(".dataGrid-block");
            var tableWarp = $(this).find(".tableWarp");
            if(dataGridBlock[0]){
                dataGridBlock.css("height", _h);
                tableWarp.css("height", (_h-135));
            }
        });
    }

    var fullScreen = function(target) {
        var opts = $.data(target, pluginName).options;
        showTab(target);
        target.$fullIframe = fullIframe(target);
        target.$fullIframe.appendTo('body');
        target.$fullIframe.on("load", function() {
            target.$fullIframe.focus();
            target.$fullIframe.contents().find("body").css({
                width: $(window).width(),
                height: $(window).height()
            }).attr('data-isLoad', "true");
            $(target.$fullIframe[0].contentWindow.document).on("keyup", function(event) {
                if (event.keyCode == 27) {
                    target.$fullIframe.remove();
                    refresh(target);
                }
            });
        });
        $.tips("按ESC退出全屏模式");
    }

    var fullIframe = function(target) {
        var opts = $.data(target, pluginName).options;
        var $fullIframe = $("<iframe id=\"iframe_" + opts.id + "\" scrolling=\"auto\" frameborder=\"0\" style=\"width:" + $(window).width() + "px;position: absolute;height: " + $(window).height() + "px;z-index: 1030;\" src=\"" + opts.ctx + opts.url + "\" />");
        return $fullIframe;
    }

    var showTab = function(target) {
        var opts = $.data(target, pluginName).options;
        target.$tab.tab("show");
        target.$tabPane.addClass('active').siblings().removeClass('active');
        showNav(target);
        size(target);
    }

    var refresh = function(target) {
        var opts = $.data(target, pluginName).options;
        target.$iframe.attr("src", opts.ctx + opts.url);
        target.$iframe.on("load", function() {
            size(target);
        });
    }

    var close = function(target) {
        var opts = $.data(target, pluginName).options;
        target.$iframe[0].src = 'about:blank';
        target.$tab.remove();
        target.$tabPane.remove();
        destory(target);
        opts.navTabs.find("li:last() a").click();
    }

    var destory = function(target) {
        var opts = $.data(target, pluginName).options;
        $(target).removeClass('showtab');
        $.removeData(target, pluginName);
    }

    var closeOther = function(target) {
        var opts = $.data(target, pluginName).options;
        showTab(target);
        $('#nav-accordion li.showtab').each(function() {
            if (!$(this).find("a").hasClass('active')) {
                close(this);
            }
        });
    }

    var methods = {
        init: function(options) {
            options = options || {};
            return this.each(function() {
                var state = $.data(this, pluginName);
                if (state) {
                    showTab(this);
                } else {
                    state = $.data(this, pluginName, {
                        options: $.extend(true, {}, $.fn[pluginName].defaults, options)
                    });
                    initialization(this);
                }

            });
        },
        render: function() {
            return this.each(function() {
                render(this);
            });
        },
        size: function() {
            return this.each(function() {
                size(this);
            });
        },
        showTab: function() {
            return this.each(function() {
                showTab(this);
            });
        },
        refresh: function() {
            return this.each(function() {
                refresh(this);
            });
        },
        close: function() {
            return this.each(function() {
                close(this);
            });
        },
        fullScreen: function() {
            return this.each(function() {
                fullScreen(this);
            });
        },
        closeOther: function() {
            return this.each(function() {
                closeOther(this);
            });
        }
    }

    $.fn[pluginName] = function() {
        var method = arguments[0];
        
        if (methods[method]) {
            method = methods[method];
            return method.apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof(method) == 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
            return this;
        }
    }

    $.fn[pluginName].defaults = {
        navTabs: $("#viewTab"),
        content: $("#viewContent"),
        ctx: window.parent.ctx,
        curIndex: 0,
        full: false
    };

})(jQuery);
