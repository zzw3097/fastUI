/* ========================================================================
 * zzw: loading.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($) {
    "use strict";
    var pluginName = 'loading';

    var initialization = function(target) {
        var opts = $.data(target, pluginName).options;
        target.$container = $(opts.container);
        target.$loading = render(target);
        target.$loading.appendTo(target.$container);
    };

    var render = function(target) {
        var opts = $.data(target, pluginName).options;
        switch (opts.type) {
            case 'loading':
                return $("<div class=\"_loading\"><div class=\"mask_transparent\"></div><div style=\"z-index: " + opts.zIndex + "\" class=\"toast\"><i class=\"loading\"></i><p class=\"toast__content\">" + opts.loadingText + "</p></div></div>");
                break;
            case 'spinner':
                return $("<div class=\"_loading\"><div class=\"mask_transparent\"></div><div style=\"z-index: " + opts.zIndex + "\" class=\"spinner\"><div class=\"double-bounce1\"></div><div class=\"double-bounce2\"></div></div></div>");
                break;
        }
    }

    var closeLoading = function(target) {
        var data = $.data(target, pluginName);
        if (data && data.options && data.options.destroy) {
            destroyLoading(target);
            target.$loading.remove();
        }
    };

    var destroyLoading = function(target) {
        $.removeData(target, pluginName);
    };
    var loadingText = function(target, options) {
        target.$loading.find(".toast__content").text(options.loadingText);
    }
    var methods = {
        init: function(options) {
            options = options || {};
            return this.each(function() {
                var state = $.data(this, pluginName);
                if (!state) {
                    state = $.data(this, pluginName, {
                        options: $.extend(true, {}, $.fn[pluginName].defaults, options)
                    });
                    initialization(this);
                } else {
                    loadingText(this, options);
                }
            });
        },
        close: function() {
            this.each(function() {
                closeLoading(this);
            });
        },
        destroy: function(options) {
            return this.each(function() {
                destroyLoading(this);
            });
        },
        text: function(options) {
            return this.each(function() {
                loadingText(this, options);
            });
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
            $.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
            return this;
        }
    };

    $.fn[pluginName].defaults = {
        destroy: true,
        container: 'body',
        type: 'loading',
        zIndex: 9000,
        loadingText: '数据加载中...'
    };
})(jQuery);
