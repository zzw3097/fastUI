/* ========================================================================
 * zzw: select.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'select';

    function Modal(options, target) {
        this.options = $.extend(true, {}, $.fn[pluginName].defaults, options, { target: target });
        this._getData(target);
    }

    $.extend(Modal.prototype, {
        opts: function(target) {
            return this.options;
        },
        reload: function(target, options) {
            var self = this,
                opts = self.options;
            opts.load = true;
            self._getData(target, $.extend(true, {}, opts.queryParams, options));
        },
        empty: function(target, options) {
            var self = this,
                opts = self.options;
            target.empty();
            $("<option>", {
                value: "",
                html: opts.defaultText
            }).appendTo(target);
        },
        _getData: function(target, options) {
            var self = this,
                opts = self.options;
            if (options) {
                opts.queryParams = $.extend(true, {}, opts.queryParams, options);
            }

            if (opts.load) {
                $.ajax({
                    url: opts.url,
                    type: 'post',
                    dataType: 'json',
                    data: opts.queryParams,
                    async: opts.async,
                    success: function(res) {
                        if (res.code == 0) {
                            target.empty();
                            if (opts.default) {
                                $("<option>", {
                                    value: "",
                                    html: opts.defaultText
                                }).appendTo(target);
                            }
                            if (res.data.length > 0) {
                                $.each(res.data, function(i, v) {
                                    var option = $("<option>", {
                                        value: v[opts.idField],
                                        html: v[opts.textField]
                                    }).appendTo(target);
                                    if (opts.selected && opts.selected == v[opts.idField]) {
                                        option.attr("selected", true);
                                    }
                                });
                            }

                            opts.loadData = res.data;
                        } else {
                            $.tips(res.message);
                        }
                        target.change(function() {
                            var value = $(this).val();
                            var row = {};
                            $.each(opts.loadData, function(i, v) {
                                if (value == v[opts.idField]) {
                                    row = v;
                                }
                            });
                            opts.onSelect(row, $(this));
                        });
                    },
                    complete: function() {
                        opts.onLoad(target);
                    }
                });
            } else {
                $("<option>", {
                    value: "",
                    html: opts.defaultText
                }).appendTo(target);
            }
        }
    });

    $.fn[pluginName] = function(options, param) {
        var s;
        var ss = this.each(function() {
            var obj;
            if (!(obj = $.data(this, pluginName))) {
                var $this = $(this),
                    data = $this.data(),
                    opts = $.extend({}, $.fn[pluginName].defaults, options, data);
                obj = new Modal(opts, $this);

                $.data(this, pluginName, obj);
                s = $this;
            }

            if (typeof options === "string" && typeof obj[options] == "function") {
                s = obj[options].call(obj, $(this), param);
            }

        });
        return s;
    };
    $[pluginName] = function(options) {
        // return new Modal(options);
    };

    $.fn[pluginName].defaults = {
        url: "",
        async: false,
        queryParams: {},
        default: false,
        defaultText: "请选择",
        idField: "id",
        textField: "name",
        loadData: [],
        load: true,
        onSelect: function(row, self) {

        },
        onLoad: function(target) {

        }
    };
})(jQuery);