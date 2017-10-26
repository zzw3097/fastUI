/* ========================================================================
 * zzw: autocomplete.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'autocomplete';
    var initialization = function(target) {
        var opts = $.data(target, pluginName).options;
        render(target);
        var fire = null;
        $(target).on("keydown", function(event) {
            var row = currentRow(target);
            // 事件绑定
            if (event.keyCode === 40) {
                // 方向键向下
                if (row.index + 1 < opts.maxLength) {
                    selected(target, {
                        index: row.index + 1
                    });
                }
                return false;
            } else if (event.keyCode === 38) {
                // 方向键向上
                if (row.index - 1 >= 0) {
                    selected(target, {
                        index: row.index - 1
                    });
                }
                return false;
            } else if (event.keyCode === 37) {
                // 方向键向左
                return false;
            } else if (event.keyCode === 39) {
                // 方向键向右
                return false;
            } else if (event.keyCode === 13) {
                // 回车键
                opts.onSelect(row, $(target));
                if (opts.bind) {
                    $("#" + opts.bind).val(row[opts.idField]);
                }
                hide(target);
                return false;
            }
        });
        $(target).on("keyup", function(event) {
            if (event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 13) {
                return false;
            }
            if (fire != null) {
                clearTimeout(fire);
            }
            fire = setTimeout(function() {
                if ($(target).val().length >= opts.auto) {
                    var params = {};
                    params[opts.key] = $(target).val();
                    getData(target, params);
                }
            }, opts.fire);
        });
        $(target).on("dblclick", function(event) {
            if ($.isEmptyObject(opts.loadData)) {
                debugger
            } else {
                $(target.$warp).show();
            }
        });
    }

    var render = function(target) {
        var $warp = $("<div id=\"warp\" class=\"list-group autocomplete\"/>");
        target.$warp = $warp.insertAfter(target).hide();
        return target;
    }
    var hide = function(target) {
        $(target.$warp).hide();
    }
    var show = function(target) {
        $(target.$warp).css({
            width: $(target).outerWidth(),
            top: $(target).offset.top
        }).show();
    }
    var destory = function(target) {
        $.removeData(target, pluginName);
    }
    var getData = function(target, options) {
        var opts = $.data(target, pluginName).options;
        $(target).loading({
            type: 'spinner'
        });
        $.ajax({
            type: "post",
            data: options,
            dataType: 'json',
            url: opts.url,
            async: false,
            beforeSend: function(XMLHttpRequest) {

            },
            success: function(result) {
                if (result.code === 0 && result.data.length > 0) {
                    opts.loadData = [];
                    item(target, result.data);
                    opts.onLoad(target);
                } else {
                    $.tips(result.message);
                }

            },
            complete: function(XMLHttpRequest, textStatus) {
                $(target).loading('close');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $.tips("错误类型textStatus: " + textStatus);
            }
        });
    }
    var item = function(target, data) {
        var opts = $.data(target, pluginName).options;
        $(target.$warp).empty();
        $.each(data, function(i, v) {
            if (i < opts.maxLength) {
                var item = $("<a>", {
                    href: "javascript:;",
                    class: 'list-group-item',
                    click: function() {
                        selected(target, {
                            index: i
                        });
                        opts.onSelect(v, $(target));
                        if (opts.bind) {
                            $("#" + opts.bind).val(v[opts.idField]);
                        }
                        hide(target);
                    }
                }).appendTo($(target.$warp));

                if (opts.formatter) {
                    opts.formatter(v, item);
                } else {
                    item.html(v[opts.textField]);
                }
                v.index = i;
                opts.loadData.push(v);
                show(target);
            }
        });
        selected(target, {
            index: 0
        });
    }
    var selected = function(target, options) {
        var opts = $.data(target, pluginName).options;
        if (options.index >= 0) {
            target.$warp.find("a.list-group-item").eq(options.index).addClass('active').siblings().removeClass('active');
            $.each(opts.loadData, function(i, v) {
                if (options.index === i) {
                    v.selected = true;
                } else {
                    v.selected = false;
                }
            });
        }
    }
    var currentRow = function(target) {
        var opts = $.data(target, pluginName).options;
        var row = null;
        $.each(opts.loadData, function(i, v) {
            if (v.selected) {
                row = v;
            }
        });
        return row;
    }
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
        hide: function(target) {
            return this.each(function() {
                hide(this);
            });
        },
        show: function(target) {
            return this.each(function() {
                show(this);
            });
        },
        destory: function(target) {
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
    }
    $.fn[pluginName].defaults = {
        url: "",
        auto: 4,
        key: "search",
        maxLength: 5,
        fire: 1000,
        async: false,
        queryParams: {},
        bind: '',
        default: false,
        formatter: false,
        idField: "id",
        textField: "title",
        loadData: [],
        onSelect: function(row, self) {

        },
        onLoad: function(target) {

        }
    };
})(jQuery);
