/* ========================================================================
 * zzw: dataPage.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'dataPage';

    var initialization = function(target) {
        render(target);
        $(target).on("click", "li", function() {
            if($(this).hasClass('disabled')){
                return
            }

            if($(this).hasClass('active')){
                return
            }

            var page = $(this).attr("data-toPage");
            clickFunction(target, { page: page });
            $(target).off("click", "**");
            return false;
        });
    };

    var render = function(target) {
        $(target).empty();
        var opts = $.data(target, pluginName).options;
        var curPage = Number(opts.page); //当前页
        var start = (curPage - 1) * opts.rows + 1;
        var end = start + opts.rows * 1 - 1;

        // 最前页
        $("<li>", {
            class: opts.page == 1 && "disabled", // 当前页时禁用
            "data-toPage": 1,
            html: "<a class=\"disabled\" href=\"javascript:;\">&laquo;</a>"
        }).appendTo(target);

        /*前5页的循环*/
        for (var k = opts.step; k > 1; k--) {
            var len = curPage - k + 1;
            if (len > 0) {
                $("<li>", {
                    "data-toPage": len,
                    html: "<a href=\"javascript:;\">" + len + "</a>"
                }).appendTo(target);
            }
        }
        /* 当前页*/
        var curLi = $("<li>", {
            class: "active",
            html: "<a href=\"javascript:;\">" + curPage + "</a>"
        }).appendTo(target);

        /*后5页的循环*/
        for (var m = 1; m < opts.step; m++) {
            var len = curPage + m;
            if (len <= opts.totalPage) {
                $("<li>", {
                    "data-toPage": len,
                    html: "<a href=\"javascript:;\">" + len + "</a>"
                }).appendTo(target);
            }
        }

        // 最后页
        $("<li>", {
            class: opts.page == opts.totalPage && "disabled",
            "data-toPage": opts.totalPage,
            html: "<a class=\"disabled\" href=\"javascript:;\">&raquo;</a>"
        }).appendTo(target);


        return target;
    };
    var clickFunction = function(target, param) {
        var data = $.data(target, pluginName);
        data = $.data(target, pluginName, {
            options: $.extend(true, {}, data.options, param)
        });
        var opts = data.options;
        opts.onClick({
            page: opts.page,
            rows: opts.rows
        });
        render(target);
    };
    
    var methods = {
        init: function(options) {
            options = options || {};
            return this.each(function() {
                var state = $.data(this, pluginName);
                if (!state) {
                    state = $.data(this, pluginName, {
                        options: $.extend(true, {}, $.fn[pluginName].defaults, options)
                    });
                    
                }else{
                    state = $.data(this, pluginName, {
                        options: $.extend(true, {}, state.options, options)
                    });
                }
                initialization(this);
            });
        },
        clickFunction: function(options) {
            return this.each(function() {
                clickFunction(this, options);
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
    }

    $.fn[pluginName].defaults = {
        rows: 10,
        page: 1,
        totalPage: 1,
        total: 1,
        step: 5,
        onClick: function(page) {
            
        }
    };
})(jQuery);
