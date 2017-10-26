/* ========================================================================
 * zzw: rightMenu.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;(function($) {
    "use strict";
    var pluginName = 'rightMenu';

    var initialization = function(target) {
        var opts = $.data(target, pluginName).options;
        target.$container = $(opts.container);
        target.$menu = renderMenu(target);
        target.$menu.hide().appendTo(target.$container);
        $(target).on("contextmenu", function(evt) {
            open(target, evt);
            return false;
        });
        $(target).on("click", function() {
            target.$menu.hide();
        });
        $(document).on("click", function() {
            target.$menu.hide();
        });
    };
    var renderMenu = function(target) {
        var opts = $.data(target, pluginName).options;
        var $menu = $('<div id="dropdown-' + target.id + '" class="dropdown bootstrapMenu" style="z-index:10000;position:absolute;" />');
        var $ul = $('<ul class="dropdown-menu" style="position:static;display:block;font-size:0.9em;" />');
        $.each(opts.actionsGroups, function(i, v) {
            $.each(v, function(index) {
                $ul.append(
                    '<li role="presentation" data-action="' + v[index] + '">' +
                    '<a href="#" role="menuitem">' +
                    '<i class="' + (opts.actions[v[index]].iconClass || '') + '"></i> ' +
                    '<span class="actionName">' + opts.actions[v[index]].name + '</span>' +
                    '</a>' +
                    '</li>'
                );
            });
            if (i < opts.actionsGroups.length - 1) {
                $ul.append('<li class="divider"></li>');
            }
        });
        $ul.on("click", "li:not('.disabled')", function(evt) {
            var li = $(this);
            var dataAction = $(this).attr("data-action");
            var row = opts.fetchElementData(target);
            // 单击事件 返回row与按钮
            opts.actions[dataAction].onClick && opts.actions[dataAction].onClick(row, li);
            window.event? window.event.returnValue = false : evt.preventDefault();
        });
        return $menu.append($ul);
    }
    var open = function(target, evt) {
        var opts = $.data(target, pluginName).options;
        var $menu = target.$menu;
        var row = opts.fetchElementData(target);
        $menu.find("li[role='presentation']").each(function(i) {
            var curAction = $(this).attr("data-action");
            if (opts.actions[curAction].isEnabled && opts.actions[curAction].isEnabled(row) == false) {
                $(this).addClass('disabled');
            }
        });
        $menu.siblings(".bootstrapMenu").hide();
        var $menuList = $menu.children();
        $menu.css({ display: 'block' });
        $menu.css({
            height: $menuList.height(),
            width: $menuList.width(),
            top: ($(target).offset().top + $(target).outerHeight()),
            left: $(target).offset().left
        });
    };
    var methods = {
        init: function(options) {
            options = options || {};
            return this.each(function() {
                var state = $.data(this, pluginName);
                if (state) {
                    $.extend({}, state.options, options);
                } else {
                    state = $.data(this, pluginName, {
                        options: $.extend(true, {}, $.fn[pluginName].defaults, options)
                    });
                }
                initialization(this);
            });
        },
        destroy: function(options) {
            // 销毁
            return this.each(function() {
                $.removeData(this, pluginName);
            });
        },
        opts: function() {
            var opts = {};
            this.each(function() {
                opts = $.data(this, pluginName).options;
            });
            return opts;
        }
    };
    $.fn[pluginName] = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            return method.apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof(method) == 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.'+pluginName);
            return this;
        }
    }
    $.fn[pluginName].defaults = {
        container: 'body',
        actionsGroups: [],
        fetchElementData: function(target) {
            return {};
        }
    };
})(jQuery);