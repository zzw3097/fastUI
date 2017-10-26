/* ========================================================================
 * zzw: validate.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'validate';
    //默认提示文字;
    var tipmsg = { 
        tit: "提示信息",
        w: {
            "r": "必填项！",
            "x": "必选项！",
            "*": "不能为空！",
            "*min-max": "请填写min到max位任意字符！",
            "*len": "请填写len位任意字符！",
            "n": "请填写数字！",
            "nmin-max": "请填写min到max位数字！",
            "nlen": "请填写len位任意位数字！",
            "s": "不能输入特殊字符！",
            "s6-18": "请填写6到18位字符！",
            "p": "请填写邮政编码！",
            "m": "请填写手机号码！",
            "e": "邮箱地址格式不对！",
            "url": "请填写网址！"
        },
        def: "请填写正确信息！",
        undef: "datatype未定义！",
        reck: "两次输入的内容不一致！",
        r: "通过信息验证！",
        c: "正在检测信息…",
        s: "请{填写|选择}{0|信息}！",
        v: "所填信息没有经过验证，请稍后…",
        p: "正在提交数据…"
    }
    var methods = {
        init: function(options) {
            options = options || {};
            return this.each(function() {
                var state = $.data(this, pluginName);
                if (!state) {
                    var newOpts = $.extend(true, {}, options);
                    // 删除多余参数
                    $.each(newOpts, function(i, v) {
                        if (!$.fn[pluginName].defaults.hasOwnProperty(i)) {
                            delete newOpts[i];
                        }
                    });
                    state = $.data(this, pluginName, {
                        options: $.extend(true, {}, $.fn[pluginName].defaults, newOpts)
                    });
                    initialization(this);
                }
            });
        },
        length: function() {
            return _length(this);
        },
        options: function() {
            return $.data(this[0], pluginName).options;
        },
        state: function() {
            _validate(this[0]);
            var opts = $.data(this[0], pluginName).options;
            return opts.state || false;
        }
    }

    var _validate = function(target) {
        var opts = $.data(target, pluginName).options;
        if (opts.validData) {
            var d = opts.validData($(target).val(), $(target));
            opts.state = d.state;
            opts.msg = d.msg || tipmsg.def;
            return opts.state;
        } else if (opts.valiType) {
            var type = opts.valiType.split("|");
            $.each(type, function(index) {
                opts.state = methods[type[index]].call(target);
            });
        }
    }

    var initialization = function(target) {
        var opts = $.data(target, pluginName).options;
        $(target).attr("data-valid", "true");
        target.$feedback = _feedback(target);
        target.$feedback.insertAfter(target);

        target.$parent = $(target).parents("#row_" + opts.name);
        if (opts.isFocusin) {
            $(target).on("focusin", function() {
                // 当元素获得焦点时，触发 
            });
        }


        if (opts.isFocusout && target.type != "radio") {
            $(target).on("focusout", function() {
                _validate(target);
                _state(target);
            });
        }
    };

    var _feedback = function(target) {
        return $('<span style="margin-right: 25px;width:auto;" class="form-control-feedback"></span>');
    }

    var _state = function(target) {
        var opts = $.data(target, pluginName).options;
        if (opts.state) {
            target.$feedback.html('<i class="glyphicon glyphicon-ok"></i>');
            target.$parent.addClass('has-success has-feedback').removeClass('has-error has-feedback');
        } else {
            target.$feedback.html('<i class="glyphicon glyphicon-remove"></i> ' + opts.msg);
            target.$parent.addClass('has-error has-feedback').removeClass('has-success has-feedback');
        }
    };

    var _length = function(target) {
        var opts = $.data(target, pluginName).options;
        var len = opts.length.split("-");
        var type = len[0][0];
        var val = $(target).val();

        //当元素失去焦点时触发number|phone
        if (target.nodeName == "SELECT" && opts.required && val.length == 0) {
            opts.msg = tipmsg.w["x"];
            return false;
        } else if (opts.required && val.length == 0) {
            opts.msg = tipmsg.w["r"];
            return false;
        }

        if (len.length == 1 && type[1] == undefined && val.length == 0) {
            opts.msg = opts.errorText || tipmsg.w[type];
            return false;
        }

        if (len.length == 1 && type[1] && Number(len[0].slice(1)) > val.length) {
            opts.msg = opts.errorText || tipmsg.w[type + "len"].replace("len", opts.length);
            return false;
        }

        if (len.length > 1 && (len[0].slice(1) > val.length || len[1].slice(1) < val.lengt)) {
            opts.msg = opts.errorText || tipmsg.w[type + "min-max"].replace("min到max", len[0] + "到" + len[1]);
            return false;
        }

        return true;
    }


    $.fn[pluginName] = function() {
        var method = arguments[0];
        
        if (method.isValidate || method.required || method == "state") {
            if (methods[method]) {
                method = methods[method];
                return method.apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof(method) == 'object' || !method) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
                return this;
            }
        } else {
            return this;
        }
    };

    $.fn[pluginName].defaults = {
        isValidate: false, // 是否开启校验 未设置此参数时，不渲染，返回self
        isFocusin: false, // 是否开启元素获得焦点时事件
        isFocusout: true, // 是否开启元素失去焦点时事件
        name: null, // 元素Name
        required: true, //是否必填
        errorText: null, //自定义出错文本
        length: "10", // 长度验证时，必需字段。默认值10
        valiType: "length", // 验证类型
        validData: null // 自定义验证，返回boolean
    };
})(jQuery);
