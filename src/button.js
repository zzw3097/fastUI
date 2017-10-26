/* ========================================================================
 * zzw: button.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'btn';
    var initialization = function(target) {
        var opts = $.data(target, pluginName).options;
        render(target);
        target.$button.on("click", function() {
            if (opts.isVerifyRow && !opts.isByIdData) {
                // 表格单选
                var row = opts.gridTarget.datagrid('getRow');
                var id = opts.gridTarget.datagrid('getId');
                opts.handler(row, id);
            } else if (!opts.singleSelect && opts.isVerifyRow && !opts.isByIdData) {
                // 表格多选
                var rows = opts.gridTarget.datagrid('getRows');
                var ids = opts.gridTarget.datagrid('getIds');
                opts.handler(rows, ids);
            } else if (opts.isByIdData && opts.isVerifyRow && opts.singleSelect) {
                // 单选表格行，获取选中行的byid数据
                var id = opts.gridTarget.datagrid('getId');
                $(target).form('post', {
                    url: opts.isByIdData,
                    data: {
                        id: id
                    },
                    onSuccess: function(result) {
                        opts.handler(result.data || result, id);
                    }
                });
                debugger
            } else {
                opts.handler($(target), opts.form || null);
            }

        });
    };

    var render = function(target) {
        var opts = $.data(target, pluginName).options;
        if (target.nodeName == "BUTTON" || target.nodeName == "A") {
            target.$button = $(target);
        } else {
            target.$button = $(target).find("button");
        }
        target.$button.addClass("btn " + opts.btnClass);
        target.$button.html("<i class=\"glyphicon " + opts.iconClass + "\"></i> <span>" + opts.name + "</span>");
        target.$button.attr("id", opts.id || "btn");
        disabled(target, opts.disabled);
        show(target, opts.show);
    };

    var disabled = function(target, params) {
        var opts = $.data(target, pluginName).options;
        opts.disabled = params || false;
        if (opts.disabled) {
            target.$button.attr("disabled", "disabled");
        } else {
            target.$button.removeAttr('disabled');
        }
    };

    var show = function(target, params) {
        var opts = $.data(target, pluginName).options;
        opts.show = params || false;
        if (opts.show) {
            target.$button.show();
        } else {
            target.$button.hide();
        }
    };

    var destory = function(target) {
        $.removeData(target, pluginName);
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
        disabled: function(params) {
            return this.each(function() {
                disabled(this, params);
            });
        },
        show: function(params) {
            return this.each(function() {
                show(this, params);
            });
        },
        destory: function() {
            return this.each(function() {
                destroy(this);
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
    };

    $.fn[pluginName].defaults = {
        name: "确定", // 按钮显示文字
        btnClass: 'btn-default', // 默认显示按钮样式
        iconClass: 'glyphicon-ok', // 按钮图标
        show: true, // 默认显示按钮
        autoClose: true, // true时，单击后，自动关闭弹窗窗口,
        disabled: false,
        enable: true,
        handler: function(btn, form) {
            // 单击事件
        }
    };
})(jQuery);
