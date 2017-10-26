/* ========================================================================
 * zzw: form.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'form';
    var initialization = function(target) {

    };



    function formSubmit(target) {
        var opts = $.data(target, 'form').options;
        //支持多file上传
        if ($(target).attr("enctype") && $(target).attr("enctype") == "multipart/form-data") {
            var data = new FormData();
            $(target).find("input[type='file']").each(function(i) {
                var file = $(this);
                var name = file.attr("name");
                if (!name) {
                    name = "file";
                }
                data.append(name, file[0].files[0]);
            });

            $.each($(target).serializeJson(), function(i, v) {
                data.append(i, v);
            });

            opts.data = data;
            opts.processData = false;
            opts.contentType = false;
            opts.async = false;
        } else {
            opts.data = $(target).serialize();
        }

        _ajax(target);
    }

    function _ajax(target) {
        var opts = $.data(target, 'form').options;
        $.ajax({
            type: "post",
            data: opts.data,
            dataType: 'json',
            async: opts.async,
            processData: opts.processData,
            // contentType: opts.contentType,
            url: opts.url || $(target).attr("action"),
            beforeSend: function(request, settings) {
                if(opts.isDisabled){
                    if (opts.confirmBtn && opts.confirmBtn.length) {
                        opts.confirmBtn.attr("disabled", "disabled");
                    }
                }
                

                if(opts.isLoading){
                    $(target).loading({
                        container: '.modal-dialog',
                        loadingText: '请稍候..'
                    });
                }
                
                if(opts.isValidate){
                    var state;
                    $(target).find("input[data-valid],select[data-valid]").each(function() {
                        var state = $(this).validate("state");
                        if (!state) {
                            $.tips('-3');
                            return;
                        } 
                    });
                    return state;
                }else{
                    return true;
                }
            },
            success: function(result) {
                if (result.code == 0) {
                    opts.onSuccess(result);
                } else if (result.code == -8) {
                    $.tips('-8');
                } else {
                    $.tips(result.message);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.readyState == 4 && XMLHttpRequest.status == 200 && this.url == 'false') {
                    $.tips('-4');
                };
            },
            complete: function() {
                if(opts.isLoading){
                    $(target).loading("close");
                }
                
                if(opts.isDisabled){
                    if (opts.confirmBtn && opts.confirmBtn.length) {
                        opts.confirmBtn.removeAttr("disabled");
                    }
                }
            }
        });
    }

    function load(target, data) {
        var form = $(target);
        for (var name in data) {
            var val = data[name];
            form.find('input[name="' + name + '"]').val(val);
            form.find('textarea[name="' + name + '"]').val(val);
            form.find('select[name="' + name + '"]').val(val);
            form.find('input[type="checkbox"]').each(function(i) {
                if ($(this).attr("name") === name && val === "1") {
                    $(this).attr("checked", "true");
                }
            });
        }
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
                }
            });
        },
        options: function() {
            return $.data(this[0], 'form').options;
        },
        submit: function() {
            methods.init.apply(this, Array.prototype.slice.call(arguments, 1));
            return this.each(function() {
                formSubmit(this);
            });
        },
        post: function() {
            methods.init.apply(this, Array.prototype.slice.call(arguments, 1));
            return this.each(function() {
                if(this.nodeName == 'BUTTON' || this.id == 'confirm'){
                    var opts = $.data(this, 'form').options;
                    opts.confirmBtn = this.nodeName == 'BUTTON' ? $(this) : $(this).find("button");
                }
                _ajax(this);
            });
        },
        load: function() {
            var data = Array.prototype.slice.call(arguments, 1);

            return this.each(function() {
                load(this, data[0]);
            });
        },
        validate: function() {
            return validate(this[0]);
        }
    }

    $.fn[pluginName] = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            return method.apply(this, arguments);
        } else if (typeof(method) == 'object' || !method) {
            $.tips("创建类型参数未设置！");
            return this;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
            return this;
        }
    }

    $.fn[pluginName].defaults = {
        async: true,
        processData: true,
        contentType: true,
        isLoading: true, // 是否开启加载等待样式
        isValidate: true,// 是否开启校验
        isDisabled: true,// 是否开启按钮等待样式
        enctype: false,
        confirmBtn: null,
        onSuccess: function(evt, request, settings, result) {
            //成功回调方法
        }
    };
})(jQuery);
