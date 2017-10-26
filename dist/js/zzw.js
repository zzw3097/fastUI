/*========================================================================
 * zzw v0.1.0
 * 基于bootstrap的UI框架 http://559hs.com
 * Copyright 2016-2017/09/25 zzw.
 * Licensed under the MIT license
 * ========================================================================/
/* ========================================================================
 * zzw: code.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
/**
 * [code tips返回文本信息]
 * @type {Object}
 */
var code = {
	'0':{
		msg: '操作成功!',
		detail: '操作成功，无返回值'
	},
	'-1':{
		msg: '未选中任何信息',
		detail: '表格操作时，需要选中信息以获取参数才可以执行以下操作'
	},
	'-2':{
		msg: 'code返回文本信息设置出错',
		detail: 'code.js文件中，没有对应的参数回调'
	},
	'-3':{
		msg: '表单验证未通过'
	},
	'-4':{
		msg: '表单未设置action属性'
	},
	'-8':{
		msg: '请求未初始化,登录已过期，请重新登录系统！'
	}
}
/* ========================================================================
 * zzw: tops.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";

    var pluginName = 'tips';

    $[pluginName] = function(params, type) {
        clearTimeout($[pluginName].timeout);
        var $selector = $('#' + $[pluginName].options.id);
        var message = params;
        var state = false;
        if (!$selector.length) {
            $selector = $('<div/>', { id: $[pluginName].options.id }).prependTo($[pluginName].options.prependTo);
        }
        if ($[pluginName].options.animate) {
            $selector.addClass('page_mess_animate');
        } else {
            $selector.removeClass('page_mess_animate');
        }
        
        var re = /^-?\d+$/;
        /**
         * [if 判断params是否为数字类型]
         * @param  {[type]} re.test(params) [description]
         * @return {[type]}                 [params为数字且大于0，则为.ok样式]
         */
        if (re.test(params)) { // 整数 
            var codeRow = code[params];
            if(codeRow){
                message = code[params].msg;
                // return false;
            }else{
                $.tips(-2);
                // return false;
            }
            
            if(params >= 0){
                type = 2;
                // return true;
            }
        }
        $selector.text(message);

        if (type === undefined || type == $[pluginName].error) {
            $selector.removeClass($[pluginName].options.okClass).addClass($[pluginName].options.errClass);
        } else if (type == $[pluginName].ok) {
            $selector.removeClass($[pluginName].options.errClass).addClass($[pluginName].options.okClass);
            state = true;
        }
        $selector.slideDown('fast', function() {
            $[pluginName].timeout = setTimeout(function() { $selector.slideUp('fast'); }, $[pluginName].options.delay);
        });
        return state;
    };


    $.extend($[pluginName], {
        options: {
            id: 'page_message',
            okClass: 'page_mess_ok',
            errClass: 'page_mess_error',
            animate: true,
            delay: 2000,
            prependTo: 'body' // 位置
        },

        error: 1, // 出错样式
        ok: 2 // 成功样式
    });
})(jQuery);
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

/* ========================================================================
 * zzw: button.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'search';
    var initialization = function(target) {

    };

    var render = function(target) {

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
        name: "确定"
    };
})(jQuery);

function getRandomColors(json) {
    var AdditionArr = [productAddition()];
    function productColor(json) {
        for (var key in json) {
            var ele = json[key];
            for (var i = 0; i < ele.length; i++) {
                function isNowAdditionArr() {
                    var NowproductAddition = productAddition();
                    var NowAdditionArr = AdditionArr.every(function(item, index, array) {
                        return item != NowproductAddition;
                    });
                    if (NowAdditionArr) {
                        AdditionArr.push(NowproductAddition);
                    } else {
                        isNowAdditionArr();
                    }
                }
                isNowAdditionArr();
                ele[i].style.backgroundColor = "rgb(" + AdditionArr[AdditionArr.length - 1].toString() + ")";
            }
        }
    }

    function productAddition() {
        var Addition = [];
        for (var j = 0; j < 2000; j++) {
            if (Addition.length == 3) {
                break;
            }
            var rdm1 = Math.random().toFixed(1) * 10;
            var rdm2 = Math.random().toFixed(1) * 10;
            var rdm3 = Math.random().toFixed(1) * 10;
            var Addit = Number(rdm1.toString() + rdm2.toString() + rdm3.toString());
            if (Addit > 0 && Addit < 255) {
                Addition.push(Addit);
            } else {
                continue;
            }
        }
        return Addition;
    }
    productColor(json);
}

getRandomColors({
    //a: document.getElementsByTagName("body")[0].getElementsByTagName("*")
}); /*生成随机颜色函数2，保证不会生成两个相同的颜色*/

/* ========================================================================
 * zzw: dialog.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'dialog';
    var init = function(target, options) {
        var state = $.data(target, pluginName);
        if (!state) {
            state = $.data(target, pluginName, {
                options: $.extend(true, {}, $.fn[pluginName].defaults, options)
            });
            initialization(target);
        }
    };

    var initialization = function(target) {
        var opts = $.data(target, pluginName).options;
        target.$modal = _modal(target);
        target.$content = $(opts.content);
        target.$modal.hide().appendTo(target.$content);

        target.$modalContent = _modalContent(target);
        target.$modalContent.appendTo(target.$modal.find(".modal-dialog"));

        target.$body = target.$modalContent.find(".modal-body");

        render(target);
        _setSize(target);
        target.$modalContent.on("click", ".modal-header button.full", function() {
            if (opts.isFull) {
                opts.isFull = false;
            } else {
                opts.isFull = true;
            }
            _setSize(target);
        });
        // 关闭
        target.$modalContent.on("click", ".modal-header button.close", function() {
            close(target);
        });

        if (opts.contents && opts.contents.indexOf("data-date-format") >= 0) {
            using("datetime", function() {
                opts.onLoad(target.$modal);
            });
        } else if (opts.contents && opts.contents.indexOf("city-picker") >= 0) {
            using('area', function() {
                opts.onLoad(target.$modal);
            });
        } else if (opts.type == 'form') {
            opts.onLoad(target.$body.find('form'));
        }else if(opts.contents){
            opts.onLoad(target.$modal);
        }
    };

    var _modal = function(target) {
        var opts = $.data(target, pluginName).options;
        var $modal = $("<div class=\"modal fade\" tabindex=\"9\"><div style=\"top:-30px\" class=\"modal-dialog\"></div></div>");
        return $modal;
    };

    var _setSize = function(target) {
        var opts = $.data(target, pluginName).options,
            contentCss = {};
        if (opts.windowSize.hasOwnProperty("width")) {
            contentCss = {
                width: opts.windowSize.width,
                height: opts.windowSize.height || 'auto',
                margin: '30px auto',
                borderRadius: 6
            }
        } else if (opts.windowSize == 'lg') {
            contentCss = {
                width: 900,
                height: 'auto',
                margin: '30px auto',
                borderRadius: 6
            }
        } else if (opts.windowSize == 'sm') {
            contentCss = {
                width: 300,
                height: 'auto',
                margin: '30px auto',
                borderRadius: 6
            }
        } else {
            contentCss = {
                width: 600,
                height: 'auto',
                margin: '30px auto',
                borderRadius: 6
            }
        }
        target.$modalContent.css("padding-bottom", "43px");
        if (opts.isFull) {
            contentCss = {
                width: $('body').width(),
                height: $('body').height(),
                margin: 0,
                borderRadius: 0
            }
            target.$modalContent.css("padding-bottom", "0px");
        }
        target.$modalContent.add(target.$modal.find(".modal-dialog")).css(contentCss);
        target.$modalContent.find(".modal-footer").css({
            width: contentCss.width - 2
        });
    };

    var _modalContent = function(target) {
        var opts = $.data(target, pluginName).options,
            header = "",
            footer = "";
        if (opts.header) {
            header = "<div class=\"modal-header\"><button type=\"button\" class=\"close\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">关闭</span></button><button type=\"button\" class=\"full\"><span style=\"top:-1px\" class=\"glyphicon glyphicon-fullscreen\"></span><span class=\"sr-only\">最大化</span></button><h4 class=\"modal-title\">" + opts.title + "</h4></div>";
        }

        if (opts.footer) {
            footer = "<div style=\"position: fixed;bottom: 0;\" class=\"modal-footer\"><div class=\"btn-group btn-group-justified\"></div>";
        }

        var $modalContent = $("<div class=\"modal-content\">" + header + "<div class=\"modal-body\"></div>" + footer + "</div>");

        return $modalContent;
    };

    var render = function(target) {
        var opts = $.data(target, pluginName).options;
        // 表格
        if (opts.datagrid) {
            var dlgGrid = $('<div style="margin:10px auto" class="row"><div class="col-sm-12" data-height="true"><div id="' + opts.datagrid.id + '"></div></div></div>').prependTo(target.$body);
            opts.datagrid.dialog = true;
            opts.datagrid.toolbar = false;
            dlgGrid.datagrid(opts.datagrid);
        }

        if (opts.type == 'form') {
            var form = $("<form action=\"" + (opts.action || false) + "\" class=\"form-horizontal\"  />").appendTo(target.$body);
        }

        if (opts.formGroup) {
            var groupDefault = {
                name: "name", // 文本输入框名称
                size: "3|9", // 大小 标签｜文本输入框
                labelName: "", //标签名称
                type: 'text', // 类型： 默认文本 //custom自定义内容
                required: true, // 必填
                readonly: false, // 只读
                disabled: false, // 禁用
                class: "form-control", // 文本输入框样式 
                placeholder: "", // 可描述输入字段预期值的提示信息
                // required: true, // 必填项
                value: "", // 值
                autocomplete: "Off", // 关闭自动提示
                onChange: function(value, form, self) {

                },
                url: false,
                src: null,
                linkField: null, // 区域插件时，绑定赋值文本字段
                fileUrl: window.parent.ctx + '/category/uploadImageToCategory', //上传地址
                autoUpload: false, // 自动上传
                upLoadSize: { // 上传图片的规格要求
                    width: 'auto', //auto为不限制宽度
                    height: 'auto' //auto为不限制高度
                },
                fileSize: 2 * 1000 * 1000,
                fileType: '.jpg|.jpeg|.gif|.bmp|.png|',
                onUploadSuccess: function(value, form, self) {

                },
                onUploadError: function(result, form, self) {

                },
                onLoad: function(self) {

                }
            }


            $.each(opts.formGroup, function(i) {
                var group = $.extend(true, {}, groupDefault, opts.formGroup[i]);
                var $groupRow = $("<div id=\"row_" + group.name + "\" class=\"form-group\">\
                                    <label for=\"" + group.name + "\" class=\"col-sm-" + group.size.split("|")[0] + " control-label\">" + (group.required ? "* " : "") + " " + group.labelName + "：</label>\
                                    <div class=\"group-content col-sm-" + group.size.split("|")[1] + "\"></div>\
                                </div>");
                if (group.type === "checkbox") {
                    $groupRow = $("<div class=\"form-group\">\
                                    <div class=\"col-sm-offset-" + group.size.split("|")[0] + " col-sm-" + group.size.split("|")[1] + "\">\
                                    <div class=\"group-content checkbox\"></div>\
                                    </div>\
                                </div>");
                }

                if (group.type != "hidden") {
                    $groupRow.appendTo(form);
                    var $groupContent = $groupRow.find(".group-content");
                }

                // 自定义内容
                if (group.type === "custom") {
                    $(group.custom).appendTo($groupContent);
                    // 事件
                    // todo
                }

                if (group.type === 'text' || group.type === 'number' || group.type === 'password') {
                    var $text = $("<input " + (group.disabled ? "disabled" : "") + " class=\"" + group.class + "\" name=\"" + group.name + "\" type=\"" + group.type + "\" value=\"" + group.value + "\" />").prependTo($groupContent);

                    $text.on("change", function() {
                        group.onChange($(this).val(), form, $groupRow);
                    });
                }
                // 隐藏输入框
                if (group.type === "hidden") {
                    $("<input id=\"" + group.name + "\" name=\"" + group.name + "\" type=\"" + group.type + "\" value=\"" + group.value + "\" />").prependTo(form);
                }
                // 上传
                if (group.type === "file") {
                    var $fileContent = $("<div style=\"width:60px;height:60px;\">\
                            <i style=\"font-size:40px;margin:10px;\" class=\"glyphicon glyphicon-plus\"></i>\
                       </div>");
                    var $file = $("<input type=\"file\" style=\"opacity:0;display:none\" name=\"" + group.name + "\" />");
                    if(opts.forFormLoad && opts.forFormLoad[group.linkField]){
                        $fileContent = $("<img style=\"width:60px;height:60px;\" src=" + opts.forFormLoad[group.linkField] + " />");
                    }else if (group.src || group.value) {
                        $fileContent = $("<img style=\"width:60px;height:60px;\" src=" + group.src || group.value + " />");
                    }
                    

                    $fileContent.appendTo($groupContent);
                    $file.appendTo($groupContent);
                    $fileContent.on("click", function() {
                        $file.click();
                    });
                    $file.on("change", function() {
                        if (group.autoUpload) {
                            var $this = $(this);
                            var fileData = this.files[0];
                            var FileExt = $this.val().substr($this.val().lastIndexOf(".")).toLowerCase();
                            var _URL = window.URL || window.webkitURL || window.mozURL;
                            var file, img;
                            if (fileData.size >= group.fileSize) {
                                $.tips("上传图片大小不能超过" + group.fileSize + "KB！");
                                $this.val("");
                                return;
                            }
                            if (group.fileType.indexOf(FileExt + "|") == -1) {
                                $.tips("上传文件格式不支持" + FileExt + "格式！");
                                $this.val("")
                                return;
                            }
                            if ((file = this.files[0])) {
                                img = new Image();
                                img.onload = function() {
                                    if ((group.upLoadSize.width == 'auto' || this.width == group.upLoadSize.width) && (group.upLoadSize.height == 'auto' || this.height == group.upLoadSize.height)) {
                                        var res = upLoad({
                                            fileData: fileData,
                                            url: group.fileUrl
                                        });
                                        var linkField = form.find("input[name='" + group.linkField + "']");
                                        if (res.code === 0) {
                                            $fileContent.html("<img style=\"width:60px;height:60px;\" src=" + res.data + " />");
                                            linkField.val(res.data);
                                            group.onUploadSuccess(res.data, form, $groupRow);
                                        } else {
                                            $.tips(res.message);
                                            linkField.val("");
                                            group.onUploadError(res, form, $groupRow);
                                        }
                                    } else {
                                        $.tips("图片上传宽与高必须是：200X200像素");
                                        $this.val("");
                                        linkField.val("");
                                    }
                                }
                                img.src = _URL.createObjectURL(file);
                            }
                        } else {
                            group.onChange(this, form, $groupRow);
                        }
                    });
                }
                // 复选框
                if (group.type === "checkbox") {
                    var $checkbox = $("<label style=\"padding-left:0px;\"><input style=\"opacity: 1;margin-top:2px;\" name=\"" + group.name + "\" value=\"" + group.value + "\" type=\"checkbox\"> <span style=\"margin-left:20px;\">" + group.labelName + "</span></label>").appendTo($groupContent);
                    $checkbox.on("click", "input", function() {
                        var value = $(this).val();
                        if ($(this).is(':checked')) {
                            $(this).attr("checked", true);
                        } else {
                            value = 0;
                            $(this).attr("checked", false);
                        }
                        group.onChange(value, form, $groupRow);
                    });
                }
                // 单选按钮
                if (group.type === "radio") {
                    if (group.list.length > 0) {
                        $.each(group.list, function(x, y) {
                            var radioInline = $("<label>", {
                                class: 'radio-inline',
                                html: '<input ' + (group.disabled ? "disabled" : "") + ' style="opacity: 1;margin-top:2px;left:0px;" type="radio" name="' + group.name + '" value="' + y.value + '"> ' + y.name
                            }).appendTo($groupContent);
                            if (group.value == y.value) {
                                radioInline.find("input").attr("checked", "checked");
                            }
                        });
                    }
                    $groupContent.on("click", "input", function() {
                        group.onChange($(this).val(), form, $groupRow);
                    });
                }
                // 下拉列表
                if (group.type === "select") {
                    var $select = $("<select " + (group.disabled ? "disabled" : "") + " class=\"" + group.class + "\" name=\"" + group.name + "\"></select>").appendTo($groupContent);
                    // 调用select.js 插件
                    if (group.url == false) {
                        $.tips(group.name + "没有设置路径地址：url参数");
                        return;
                    }
                    $select.select({
                        idField: group.idField || 'id',
                        textField: group.textField || 'name',
                        url: group.url || "", // 路径
                        async: group.async || false,
                        queryParams: group.queryParams || {},
                        defaultText: group.defaultText || '请选择',
                        default: group.default || false,
                        loadData: group.loadData || [],
                        load: group.load || true,
                        onSelect: function(row, self) {
                            group.onSelect && group.onSelect(row, form, self);
                        }, // 选择回调事件
                        onLoad: function(self) {
                            group.onLoad($select);
                        },
                        selected: group.selected // 默认值
                    });
                }
                // 区域三级联动
                if (group.type === "cityPicker") {
                    var $area = $("<input class=\"" + group.class + "\" type=\"" + group.type + "\" name=\"" + group.name + "\"/>").appendTo($groupContent);
                    // 调用区域三级联动插件
                    using('area', function() {
                        var areas = new Array(3);
                        if (group.value) {
                            $.each(group.value.split("/"), function(i) {
                                areas[i] = group.value.split("/")[i];
                            });
                        }
                        $area.citypicker({
                            province: areas[0],
                            city: areas[1],
                            district: areas[2],
                            linkField: group.linkField,
                            onSelect: function(data) {
                                group.onChange(data, form, $groupRow);
                            },
                            disabled: group.disabled
                        });
                    });
                }
                // 下拉自动提示
                if (group.type === "autocomplete") {
                    var $complete = $("<input class=\"" + group.class + "\" name=\"" + group.name + "\" type=\"" + group.type + "\" value=\"" + group.value + "\" />").prependTo($groupContent);

                    $complete.autocomplete({
                        url: group.url,
                        auto: group.auto || 4,
                        key: group.key || "search",
                        maxLength: group.maxLength || 5,
                        fire: group.fire || 1000,
                        async: group.async || false,
                        queryParams: group.queryParams || {},
                        bind: group.linkField,
                        idField: group.idField || "id",
                        textField: group.textField || "title",
                        loadData: group.loadData || [],
                        onSelect: function(row, self) {
                            group.onSelect && group.onSelect(row, self);
                        },
                        onLoad: function(target) {
                            group.onLoad && group.onLoad(target);
                        }
                    });
                }

                $groupRow.find("[name='" + group.name + "']").validate(group);
            });

            if (opts.forFormLoad) {
                form.form('load', opts.forFormLoad);
            }
        }

        if (opts.iframe) {
            var $iframe = $("<iframe id=\"" + opts.iframe.id + "\" scrolling=\"auto\" frameborder=\"0\" src=\"" + opts.iframe.url + "\" style=\"width:100%;height:" + opts.form.minHeight + ";\"></iframe>").appendTo(target.$body);
            $iframe.on("load", function() {
                opts.iframe.onLoad($iframe);
            });
        }

        if (opts.contentUrl) {
            target.$body.load(opts.contentUrl, function() {
                opts.onLoad(target.$modal);
            });
        }

        if (opts.contents) {
            if (opts.type == 'confirm' || opts.type == 'alert') {
                opts.contents = _media(target);
            }
            $(opts.contents).appendTo(target.$body);
        }

        _btnGroup(target);
    };

    var _media = function(target) {
        var opts = $.data(target, pluginName).options;
        var $media = '<h4 class="media-heading">' + opts.title + '：</h4><div class="media">' + '<div class="media-left">' + '<a href="javascript:;"><i style="font-size:60px;" class="glyphicon ' + opts.icon + '"></i></a>' + '</div>' + '<div class="media-body"><p>' + opts.contents + '</p></div>' + '</div>';
        return $media;
    };
    var _btnGroup = function(target) {
        var opts = $.data(target, pluginName).options,
            dlgForm = target.$body.find("form") || target.$modal,
            btnDefault = {
                show: true,
                autoClose: true, // true时，单击后，自动关闭弹窗窗口
                form: dlgForm,
                handler: function(btn) {

                }
            };
        if (opts.footer && opts.footer != 'none') {
            target.$btn = {};
            $.each(opts.actionsGroups, function(index, value) {
                opts.actions[value] = $.extend(true, {}, btnDefault, $.fn[pluginName].defaults.actions[value], opts[value]);
                if (value == "confirm" && opts.autoSubmit) {
                    opts.actions[value].handler = function(btn) {
                        dlgForm.form("submit", {
                            confirmBtn: $(this),
                            onSuccess: function(result) {
                                opts.onSuccess(result);
                                if (opts.actions[value].autoClose) {
                                    $(target).dialog('close');
                                }
                            }
                        });
                    }
                }

                if (value == 'cancel' && opts.actions[value].autoClose) {
                    opts.actions[value].handler = function(btn) {
                        $(target).dialog('close');
                    }
                }

                target.$btn[value] = $("<div id=\"" + value + "\" class=\"btn-group\"><button></button></div>")
                    .appendTo(target.$modalContent.find(".btn-group-justified"))
                    .btn(opts.actions[value]);
            });
        }
    };

    function show(target) {
        var opts = $.data(target, 'dialog').options;
        var dialog = $("#" + opts.id);
        $("<div class=\"modal-backdrop fade\"></div>")
        .prependTo(target.$modal)
        .animate({ opacity: 0.5 }, 50, function() {
            $(this).addClass('in');
            target.$modal.addClass('in').css("display", "block");
            $(document.body).addClass('modal-open');
        });
        
        target.$modal.find('.modal-dialog').animate({ top: 0 }, 100, function() {
            
        });
        
    }

    function close(target, options) {
        var opts = $.data(target, 'dialog').options;
        target.$modal.find('.modal-dialog').animate({ top: -30 }, 50, function() {
            target.$modal.find(".modal-backdrop").removeClass("in");
            target.$modal.removeClass('in').css("display", "none");
            if (opts.destroy) {
                $(target).dialog("destroy");
            }
            $(document.body).removeClass('modal-open');
        });
    }

    function destroy(target, options) {
        var opts = $.data(target, 'dialog').options;
        target.$modal.remove();
        $.removeData(target, pluginName);
    }

    var methods = {
        show: function() {
            return this.each(function() {
                show(this);
            });
        },
        close: function() {
            return this.each(function() {
                close(this);
            });
        },
        destroy: function() {
            return this.each(function() {
                destroy(this);
            });
        },
        window: function() {
            var options = arguments[1] || {};
            var methodDefault = {
                type: 'window',
                isFull: true,
                footer: false
            }

            return this.each(function() {
                init(this, $.extend(true, {}, methodDefault, options));
                show(this);
            });
        },
        form: function() {
            var options = arguments[1] || {};
            var methodDefault = {
                type: 'form'
            }
            return this.each(function() {
                init(this, $.extend(true, {}, methodDefault, options));
                show(this);
            });
        },
        confirm: function() {
            var options = arguments[1] || {};
            var methodDefault = {
                type: 'confirm',
                title: '提示',
                header: false,
                windowSize: {
                    width: 300,
                    height: 171
                },
                icon: 'glyphicon glyphicon-question-sign'
            };

            return this.each(function() {
                init(this, $.extend(true, {}, methodDefault, options));
                show(this);
            });
        },
        alert: function() {
            var options = arguments[1] || {};
            var methodDefault = {
                type: 'alert',
                title: '警告',
                header: false,
                windowSize: {
                    width: 300,
                    height: 171
                },
                actions: {
                    cancel: {
                        show: false
                    }
                },
                icon: 'glyphicon glyphicon-exclamation-sign'
            }
            return this.each(function() {
                init(this, $.extend(true, {}, methodDefault, options));
                show(this);
            });
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
        title: '',
        isFull: false,
        content: 'body', // 窗口创建的父级
        windowSize: '', // 窗口大小 大：lg = 900px, 小：sm = 300px 空值时为默认大小：= 600px 或设置px值
        destroy: true, // 关闭后自动销毁窗口元素
        footer: true,
        header: true,
        autoSubmit: false, // true时，单击后，自动提交表单 
        actionsGroups: ['confirm', 'cancel'],
        actions: {
            confirm: {
                name: "确定",
                id: 'confirm',
                btnClass: 'btn-primary',
                iconClass: 'glyphicon-ok'
            },
            cancel: {
                name: "取消",
                id: 'cancel',
                btnClass: 'btn-default',
                iconClass: 'glyphicon-remove',
            }
        },
        onLoad: function() {}
    };
})(jQuery);

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

/* ========================================================================
 * zzw: datagrid.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'datagrid';
    var initialization = function(target) {
        var opts = $.data(target, pluginName).options;
        target.$header = _header(target);
        target.$header.appendTo($(target));

        target.$body = _body(target);
        target.$body.appendTo($(target));

        target.$tableHeader = _tableHeader(target);
        target.$tableHeader.appendTo(target.$body);

        target.$tableWarp = _tableWarp(target);
        target.$tableWarp.appendTo(target.$body);

        target.$footer = _footer(target);
        target.$footer.appendTo($(target));

        _iframeLoad(target);
        if (opts.search) {
            // 查询按钮事件
            target.$search.on("click", ".search-form .search-btn", function() {
                _toSearch(target);
                return false;
            });
            // 高级查询
            target.$search.on("click", ".search-form .senior-btn", function() {
                var self = $(this),
                    box = self.parents('.search-box'),
                    form = self.parents('.search-form'),
                    formHtml = form.html();
                box.addClass('senior-box');
                form.empty().removeClass('search-form').addClass('form-horizontal');

                var group = opts.search.formGroup;
                $.each(group, function(i, v) {
                    $('<div class="form-group">' + '<label for="' + v.name + '" class="col-sm-2 control-label">' + v.labelName + '：</label>' + '<div class="col-sm-10">' + '<input type="text" name="' + v.name + '" class="form-control" id="' + v.name + '" placeholder="' + v.placeholder + '">' + '</div>' + '</div>')
                        .appendTo(form);
                });
                $('<div class="form-group">' + '<div class="col-sm-offset-2 col-sm-10">' + '<div class="btn-group" role="group">' + '<button type="button" class="btn btn-default search-btn"><i class="glyphicon glyphicon-search"></i> 确认查询</button>' + '<button type="button" class="btn btn-default cancel-btn"><i class="glyphicon glyphicon-remove"></i> 取消</button>' + '</div>' + '</div>' + '</div>')
                    .appendTo(form);
                form.form('load', opts.queryParams);


                form.on("click", ".search-btn", function() {
                    _toSearch(target);
                    box.removeClass('senior-box');
                    form.empty().removeClass('form-horizontal').addClass('search-form').html(formHtml);
                    form.form('load', opts.queryParams);
                    form.off("click", "**");
                    return false;
                });

                form.on("click", ".cancel-btn", function() {
                    box.removeClass('senior-box');
                    form.empty().removeClass('form-horizontal').addClass('search-form').html(formHtml);
                    form.form('load', opts.queryParams);
                    form.off("click", "**");
                });
            });


            // 查询回车事件
            target.$search.find(".search-form input[name='search']").keydown(function(event) {
                if (event.which == 13) {
                    _toSearch(target);
                    return false;
                }
            });
        }


        // 跳转到第几页
        target.$footer.on("change", "#gotoPage", function() {
            var p = Number($(this).val());
            if (p > opts.totalPage) {
                $(this).val(opts.totalPage);
                p = opts.totalPage;
                $.tips("总页数只有" + opts.totalPage + "页，已跳转至最后一页");
            }
            if (p <= 0) {
                $(this).val(1);
                p = 1;
            }
            getData(target, {
                page: p
            });
        });

        // 选择rows事件
        target.$footer.on("change", "#rows", function() {
            var rows = Number($(this).val());

            getData(target, {
                page: 1,
                rows: rows
            });
        });

        // 刷新当前内容
        target.$footer.on("click", "#refresh", function() {
            reload(target);
        });
    };

    var _toSearch = function(target) {
        var opts = $.data(target, pluginName).options;
        var options = $.extend(true, {}, opts.queryParams, target.$search.find("form").serializeJson(), {
            page: 1,
            rows: opts.rows
        });
        getData(target, options);
    };



    var _header = function(target) {
        var opts = $.data(target, pluginName).options;
        var $header = $("<div class=\"porlets-content dataGrid-header\" style=\"padding:5px;\"><div class=\"row\"></div></div>");
        var $headerRow = $header.find(".row");
        if (opts.toolbar && (opts.toolbar.btn || opts.toolbar.group) || opts.timeTested || opts.search) {
            var btnDefaults = {
                icon: "glyphicon glyphicon-eye-open",
                class: "btn-default",
                disabled: false, // 禁用菜单按钮
                enable: false, //启用菜单按钮
                isVerifyRow: true, // 是否验证已经选择列表中的行
                isEnabled: function(index, row) {
                    // 是否验证选择行时，return false时，按钮不可用。return true时，按钮可用
                    return true;
                },
                isByIdData: false, // 是否开启根据选中信息的ID来获取数据信息
                gridTarget: $(target),
                singleSelect: opts.singleSelect,
                handler: function(data) {

                }
            };


            $("<div class=\"tools " + opts.toolbar.size + "\"><div class=\"btn-group\"></div></div>").appendTo($headerRow);
            // 工具栏按钮组
            if (opts.toolbar.btn) {
                target.$btn = {};
                target.btnParams = {};
                $.each(opts.toolbar.btn, function(index, value) {
                    target.btnParams[index] = $.extend(true, {}, btnDefaults, opts.toolbar.btn[index]);
                    target.btnParams[index].disabled = target.btnParams[index].isVerifyRow;
                    target.$btn[index] = $("<button>").appendTo($header.find(".tools .btn-group"))
                        .btn(target.btnParams[index]);
                });
            }

            // 查询
            if (opts.timeTested) {
                target.$search = $("<div class=\"col-sm-6\"><form class=\"search-form\" style=\"padding:0px;\" class=\"form-inline\" role=\"form\"><div style=\"margin-bottom: 0px;\" class=\"form-group col-sm-5\"><label class=\"sr-only\">开始时间</label><div class=\"input-group date form_date\" data-date=\"\" data-date-format=\"dd MM yyyy\" data-link-field=\"dtp_input1\" data-link-format=\"yyyy-mm-dd\"><input style=\"min-height:32px;\" class=\"form-control\" type=\"text\" value=\"\" readonly><span style=\"min-height:14px;padding:9 10px;\" class=\"input-group-addon\"><span style=\"min-height:14px;\" class=\"glyphicon glyphicon-remove\"></span></span><span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar\"></span></span></div><input type=\"hidden\" id=\"dtp_input1\" name=\"time1\" value=\"\" /></div><div style=\"margin-bottom: 0px;\" class=\"form-group col-sm-5\"><label class=\"sr-only\">结束时间</label><div class=\"input-group date form_date\" data-date=\"\" data-date-format=\"dd MM yyyy\" data-link-field=\"dtp_input2\" data-link-format=\"yyyy-mm-dd\"><input style=\"min-height:32px;\" class=\"form-control\" type=\"text\" value=\"\" readonly><span style=\"min-height:14px;padding:9 10px;\" class=\"input-group-addon\"><span style=\"min-height:14px;\" class=\"glyphicon glyphicon-remove\"></span></span><span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar\"></span></span></div><input type=\"hidden\" id=\"dtp_input2\" name=\"time2\" value=\"\" /></div><div  style=\"padding:0px;margin-bottom: 0px;\" class=\"form-group col-sm-2\"><button class=\"search-btn btn btn-default\" type=\"button\"><i class=\"glyphicon glyphicon-search\"></i> 查询</button></div></form></div>").appendTo($headerRow);
                using("datetime", function() {
                    $headerRow.find('.form_date').datetimepicker({
                        minView: "month", //选择日期后，不会再跳转去选择时分秒 
                        language: 'zh-CN',
                        format: 'yyyy-mm-dd',
                        todayBtn: 1,
                        autoclose: 1
                    });
                });
            } else if (opts.search) {
                var group = opts.search.formGroup;
                target.$search = $('<div class="' + opts.search.size + '">' + '<div class="search-box">' + '<form class="search-form">' + '<input name="' + group[0].name + '" type="text" class="form-control" placeholder="' + group[0].placeholder + '">' + '<button type="button" class="btn btn-link search-btn search-only"><i class="glyphicon glyphicon-search"></i></button>' + '</form>' + '</div>' + '</div>')
                    .appendTo($headerRow);

                if (opts.searchSenior) {
                    target.$search.find(".search-btn").removeClass('search-only');
                    $('<button type="button" class="btn btn-link senior-btn"><i class="glyphicon glyphicon-option-horizontal"></i></button>')
                        .appendTo(target.$search.find(".search-form"));
                }
            }

            // 自定义
            if (opts.custom) {
                var customDefault = {
                    wrap: "<div class=\"custom\"></div>",
                    align: "left",
                    size: "col-sm-4",
                    onLoad: function() {}
                }
                var optsCustom = $.extend(true, {}, customDefault, opts.custom);

                var $custom = $("<div class=\"custom " + optsCustom.size + "\"></div>").prependTo($headerRow);
                $headerRow.find(".custom")
                optsCustom.id && $custom.html($(optsCustom.id).html());
                optsCustom.onLoad(_row.find($custom));
            }
        }
        return $header;
    };

    var _page = function(target, params) {
        params = params || {};
        var opts = $.data(target, pluginName).options;
        var pageData = {
            totalPage: params.totalPage || opts.totalPage,
            total: params.total || opts.total,
            rows: params.rows || opts.queryParams.rows,
            page: params.page || opts.queryParams.page,
            onClick: function(qp) {
                opts.queryParams.page = qp.page;
                opts.queryParams.rows = qp.rows;
                getData(target, opts.queryParams);
            }
        }
        target.$footer.find("#pagination").dataPage(pageData);
        target.$footer.find("#gotoPage").val(pageData.page);
        target.$footer.find(".pagination-info").text('当前第' + pageData.page + '页/共' + pageData.total + '条信息/' + pageData.totalPage + '页');
    };

    var _body = function(target) {
        var opts = $.data(target, pluginName).options;
        var $body = $("<div class=\"porlets-content dataGrid-body\" style=\"padding-bottom:0px;\"></div>");
        return $body;
    };

    var _tableHeader = function(target) {
        var $tableHeader = $("<div class=\"headWarp\"><table class=\"table nowrap\" style=\"margin:0\"><thead></thead></table></div>");

        return $tableHeader;
    };

    var _tableWarp = function(target) {
        var opts = $.data(target, pluginName).options;
        var $tableWarp = $("<div class=\"tableWarp\"><table class=\"table nowrap table-striped table-hover\"><tbody></tbody></table></div>");
        return $tableWarp;
    };

    var _footer = function(target) {
        var opts = $.data(target, pluginName).options;
        var rowSize = opts.footerRowSize;
        if (opts.dialog) {
            rowSize = [7, 5];
        }
        var $footer = $("<div class=\"porlets-content dataGrid-footer\" style=\"padding:5px;box-shadow: 0 -1px 5px 0 rgba(0, 0, 0, 0.1);\">\
            <div class=\"row\">\
                <div class=\"col-lg-" + rowSize[0] + "\"><ul id=\"pagination\" class=\"pagination pull-left\" style=\"margin:0\"></ul><div style=\"line-height:34px;\" class=\"pagination-info pull-right\"></div></div>\
                <div class=\"col-lg-" + rowSize[1] + "\">\
                <div class=\"row\"><div class=\"col-lg-4\"><div class=\"input-group  pull-right\"><span style=\"min-height:34px;\" class=\"input-group-addon\" title=\"跳转页面\"><i class=\"glyphicon glyphicon-arrow-right\"></i></span><input id=\"gotoPage\" style=\"min-height:34px;padding:6px 5px;\" value=\"" + opts.queryParams.page + "\" type=\"number\" class=\"form-control small-input\" title=\"跳转页面\"></div></div>\
                <div class=\"col-lg-4\"><div class=\"input-group  pull-right\"><span style=\"min-height:34px;\" class=\"input-group-addon\" title=\"显示行数\"><i class=\"glyphicon glyphicon-th-list\"></i></span><input id=\"rows\" style=\"min-height:34px;padding:6px 5px;\" value=\"" + opts.queryParams.rows + "\" type=\"number\" class=\"form-control small-input\" title=\"显示行数\"></div></div>\
                <div class=\"col-lg-4\"><div class=\"btn-group pull-right\"><div class=\"btn-group dropup\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"glyphicon glyphicon-option-horizontal\"></i></button><ul class=\"columns dropdown-menu dropdown-menu-right\"></ul></div><a type=\"button\" id=\"refresh\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-refresh\"></i></a></div></div></div>\
                </div>\
            </div>\
            </div>");
        return $footer;
    };

    var render = function(target) {
        var opts = $.data(target, pluginName).options;
        _setHead(target);
        _setFooter(target);

        $(target).css(opts.size);
        var targetStyle = {
            dif: opts.dif + 126 || 126,
            boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.2)'
        };
        if (opts.dialog) {
            targetStyle.boxShadow = 'none';
        }

        if (opts.showHeader === false) {
            targetStyle.dif = targetStyle.dif - 38;
        }else{
            targetStyle.dif = targetStyle.dif + 38 * (opts.columns.length - 1);
        }

        if (opts.showFooter === false) {
            targetStyle.dif = targetStyle.dif - 44;
        }

        if (opts.toolbar === false) {
            targetStyle.dif = targetStyle.dif - 44;
        }

        $(target).css({ overflow: "hidden", marginTop: 10, marginBottom: 10, boxShadow: targetStyle.boxShadow });

        target.$tableWarp.css({
            height: opts.size.height - targetStyle.dif
        });
        
        var bodyNice;
        if (bodyNice) {
            target.$tableWarp.getNiceScroll().resize();
        } else {
            using("niceScroll", function() {
                bodyNice = target.$tableWarp.niceScroll({
                    cursorcolor: "#959595",
                    cursorborder: "0px solid #fff",
                    cursorborderradius: "0px",
                    cursorwidth: "10px"
                });
            });
        }

        target.$tableWarp.scroll(function(e) {
            if (bodyNice && bodyNice.scrollLeft() > 0) {
                $(target).find(".headWarp,.summary").css("margin-left", 0 - bodyNice.scrollLeft());
            } else if (bodyNice && bodyNice.scrollLeft() == 0) {
                $(target).find(".headWarp,.summary").css("margin-left", 0);
            }
        });



        //  表格边框
        if (opts.border) {
            target.$tableHeader.addClass('border');
            target.$tableWarp.addClass('border');
        }

        if (opts.showHeader == false) {
            target.$tableHeader.hide();
        }

        if (!opts.footer && opts.data) {
            target.$footer.hide();
        }
        // 工具栏
        if (opts.toolbar === false) {
            target.$header.hide();
        }
        // 表统计
        if (opts.showSummary) {
            $("<table style=\"width:"+opts.size.width+"px;position:fixed;bottom:44px;background:#fff\" class=\"summary table nowrap\"><tbody></tbody></table>").appendTo(target.$tableWarp);
        }

        // 筛选
        if (opts.toolbar.group) {
            var groupDefaults = {
                icon: "glyphicon-th-list",
                showAll: { code: "", name: "全部" }, // 不显示全部选项设置false
                index: 0,
                autoLoad: true,
                onSelectValue: function(index, row) {
                    return { page: 1, state: row.code };
                },
                onSelect: function(index, row) {

                }
            }
            if (opts.toolbar.group.length > 0) {} else {
                var toolbarGroupItem = opts.toolbar.group;
                opts.toolbar.group = [];
                opts.toolbar.group[0] = toolbarGroupItem;
            }

            $.each(opts.toolbar.group, function(index, value) {
                var optsGroup = $.extend(true, {}, groupDefaults, value);
                var group;

                if (optsGroup.replace) { // 更新group时
                    index = (optsGroup.replace - 1);
                    group = target.$header.find(".row #group_" + index);
                    group.find(".dropdown-menu").empty();
                } else { // 初始化group
                    group = $("<div>", {
                        id: "group_" + index,
                        class: "btn-group ",
                        html: "<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\
                                    <i class=\"glyphicon  " + optsGroup.icon + "\"></i> \
                                    <span class=\"groupName\"></span>\
                                    <span class=\"caret\"></span>\
                                </button>\
                                <ul class=\"dropdown-menu\" role=\"menu\"></ul>"
                    }).appendTo(target.$header.find(".tools > .btn-group"));
                }

                // 优先取url数据 
                if (optsGroup.url) {
                    $.getJSON(optsGroup.url, optsGroup.queryParams, function(json) {
                        if (json.code == 0) {
                            groupItem(json.data);
                        } else {
                            $.tips(json.message);
                        }
                    });
                } else if (optsGroup.data) {
                    groupItem(optsGroup.data);
                }

                function selectLi(index, row, first) {
                    group.find("span.groupName").text(row.name);
                    group.find(".dropdown-menu li:eq(" + index + ")").addClass("active").siblings().removeClass('active');
                    if (!first) {
                        // 插件第一次执行时，不调用选择方法
                        // 选择选项后，
                        optsGroup.onSelect(index, row);
                        if (optsGroup.autoLoad && !optsGroup.noReload) {
                            getData(target, optsGroup.onSelectValue(index, row));
                        } else {
                            optsGroup.onSelectValue(index, row);
                        }
                    }
                }

                // 插入数组方法
                // Array.prototype.insert = function (index, item) {
                //     this.splice(index, 0, item);
                // };
                function groupItem(data) {
                    if (data.length >= 0) {
                        if (optsGroup.showAll) {
                            data.splice(0, 0, optsGroup.showAll);
                        }

                        $.each(data, function(index, value) {
                            $("<li>", {
                                html: "<a href=\"javascript:;\">" + value.name + "</a>",
                                click: function() {
                                    selectLi(index, data[index]);
                                }
                            }).appendTo(group.find(".dropdown-menu"));
                        });

                        selectLi(optsGroup.index, data[optsGroup.index], true);
                    }
                }
            });
            // group(target, opts.toolbar.group);
        }
    };

    var getRows = function(target) {
        var opts = $.data(target, pluginName).options,
            checkbox = target.$tableWarp.find("input[type='checkbox']:checked"),
            data = [];
        checkbox.each(function(index, value) {
            var i = target.$tableWarp.find("input[type='checkbox']").index($(this));
            data.push({ index: i, row: opts.gridData[i] });
        });
        if (checkbox.length == 0) {
            return null;
        } else {
            return data;
        }
    };

    var getRow = function(target) {
        var opts = $.data(target, pluginName).options,
            checkbox = target.$tableWarp.find("input[type='checkbox']:checked"),
            index = target.$tableWarp.find("input[type='checkbox']").index(checkbox);
        if (index >= 0) {
            return { index: index, row: opts.gridData[index] };
        } else {
            return null;
        }
    };

    var getId = function(target) {
        var opts = $.data(target, pluginName).options;
        var rowData = getRow(target);
        if (rowData) {
            return rowData.row[opts.idField];
        } else {
            return null;
        }
    };

    var getIds = function(target, options) {
        var opts = $.data(target, pluginName).options;
        var rowsData = getRows(target);
        if (rowsData) {
            var ids = [];
            $.each(rowsData, function(i, v) {
                ids.push(v.row[opts.idField]);
            });
            if (options && options === "json") {
                return ids;
            } else {
                return ids.join();
            }
        } else {
            return null;
        }
    };

    var getQueryParams = function(target) {
        var opts = $.data(target, pluginName).options;
        return opts.queryParams;
    };

    var getData = function(target, options) {
        options = options || {};
        var opts = $.data(target, pluginName).options,
            queryParams;
        if (opts.data) {
            // 加载本地数据
            _item(target, { code: 0, rows: opts.data });
        } else {
            // 远程请求数据
            opts.queryParams = $.extend(true, {}, opts.queryParams, options);
            var loading = $(target).loading();
            if (opts.load) {
                $.ajax({
                    url: opts.url,
                    type: 'POST',
                    dataType: 'json',
                    data: opts.queryParams,
                    success: function(result, textStatus, xhr) {
                        if (result.code == '-8') {
                            $.tips('-8');
                            // window.top.document.activeElement.src = opts.ctx +'login';
                            // debugger
                            return;
                        }
                        result = opts.loadFilter(result);
                        if (!result.hasOwnProperty("total") || !result.hasOwnProperty("rows")) {
                            $.tips("返回数据格式必须包含：total，rows");
                            return;
                        }
                        //返回数据信息总数
                        opts.total = result.total;
                        // 总页数 没有返回值则用总数除每页长度计算
                        opts.totalPage = result.totalPage || Math.ceil(result.total / opts.rows);

                        _item(target, result);
                        opts.onLoad(result);

                    },
                    error: function(xhr, textStatus, errorThrown) {
                        $.tips(xhr);
                    },
                    complete: function(a, b, c) {
                        loading.loading("close");
                        _page(target);
                    }
                });
            } else {
                loading.loading("close");
                _item(target, { code: 0, rows: [] });
            }
        }
    };

    var reload = function(target, options) {
        // 当前页重新加载  必须返回包含'total'和'rows'属性的标准数据对象。
        var opts = $.data(target, pluginName).options;
        getData(target, opts.queryParams);
    };

    /*================================================*/

    var _returnWidth = function(field, optsColumnsWidth) {
        var Columns = {};
        $.each(optsColumnsWidth, function(i, v) {
            if (v.field == field) {
                Columns = optsColumnsWidth[i];
            }
        });
        return Columns;
    };

    var _setHead = function(target) {
        var opts = $.data(target, pluginName).options;
        var parentW = opts.size.width;
        if (opts.size.width > 0) {
            var columnsWidth = [];
            var len = opts.columns[0].length;
            $.each(opts.columns, function(i, v) {
                var headerTr = $("<tr>").appendTo(target.$tableHeader.find('thead'));

                $.each(v, function(index, value) {
                    var hide = value.display == 0 ? "hide" : ""; // 单元列是否添加hide隐藏样式
                    var thWidth = 0; // 单元宽度，如未设置过宽度，则取平均数
                    var set = false; // 单元状态 ，是否初始设置过宽度
                    if (!value.halign) {
                        value.halign = "text-left";
                    }

                    if (value.checkbox) {
                        var th = $("<th data-name=\"" + value.field + "\" class=\"check_box " + hide + " " + value.halign + "\" style=\"width:40px;padding:0\"></th>").prependTo(headerTr);
                        thWidth = 40;
                        parentW = parentW - 40;
                        len = len - 1;
                        if (value.rowspan) {
                            th.attr("rowspan", value.rowspan);
                        }

                        if (value.colspan) {
                            th.attr("colspan", value.colspan);
                        }
                    } else {
                        if (value.width) {
                            len = len - 1;
                            parentW = parentW - value.width;
                            set = true;
                        }
                        thWidth = value.width > 0 ? value.width : parseInt(parentW / len);

                        var th = $("<th data-name=\"" + value.field + "\" class=\"" + hide + " " + value.halign + "\">" + value.title + "</th>").appendTo(headerTr);

                        if (i == 0) {
                            th.css("width", thWidth);
                        } else {
                            for (var z in columnsWidth) {
                                if (columnsWidth[z].field == value.parentField) {
                                    var colspanWidth = columnsWidth[z].colspan;
                                    th.css("width", colspanWidth);
                                    columnsWidth.push({
                                        field: value.field,
                                        width: colspanWidth,
                                        cwidth: colspanWidth,
                                        colspan: colspanWidth,
                                        set: true,
                                        display: value.display == 0 ? 0 : 1
                                    });
                                }
                            }
                        }

                        if (value.rowspan) {
                            th.attr("rowspan", value.rowspan);
                        }

                        if (value.colspan) {
                            th.attr("colspan", value.colspan);
                        }


                        if (value.resizable && i == 0) {
                            using("resizable", function() {
                                th.resizable({
                                    alsoResize: "#" + target.id + " [data-name='" + value.field + "']",
                                    minWidth: 100,
                                    handles: "e",
                                    resize: function(event, ui) {
                                        // 拖动后，记录新宽度
                                        $.each(opts.columnsWidth, function(i, v) {
                                            if (v.field == value.field) {
                                                v.cwidth = ui.size.width;
                                            }
                                        });
                                    }
                                });
                                target.$tableHeader.addClass('border');
                                target.$tableWarp.addClass('border');
                            });
                        }

                        if (value.sortable) {
                            th.addClass('sort_both');
                        }
                    }

                    if (i == 0) {
                        columnsWidth.push({
                            field: value.field,
                            width: thWidth,
                            cwidth: thWidth,
                            colspan: parseInt(thWidth / value.colspan),
                            set: set,
                            display: value.display == 0 ? 0 : 1
                        });

                    }
                });
            });



            // if (opts.columns[1]) {
            //     $("<th>", {
            //         css: { width: 100 },
            //         html: "操作"
            //     }).appendTo(target.$tableHeader.find("tr"));
            // }

            target.$tableHeader.on("click", "th.sort_both", function() {
                // 倒序
                $(this).removeClass('sort_both').addClass('sort_desc');
                getData(target, { sort: $(this).attr("data-name"), order: "desc" });
            });

            target.$tableHeader.on("click", "th.sort_desc", function() {
                // 正序
                $(this).removeClass('sort_desc').addClass('sort_asc');
                getData(target, { sort: $(this).attr("data-name"), order: "asc" });
            });

            target.$tableHeader.on("click", "th.sort_asc", function() {
                // 默认
                $(this).removeClass('sort_asc').addClass('sort_both');
                getData(target, { sort: opts.sortName, order: opts.sortOrder });
            });


            opts.columnsWidth = columnsWidth;
            getData(target);
        } else {
            setTimeout(function() {
                _setHead(target);
            }, 5);
        }
    };

    var _setFooter = function(target) {
        var opts = $.data(target, pluginName).options;
        var columns = target.$footer.find(".columns");
        $.each(opts.columns[0], function(index, value) {
            if (!value.checkbox) {
                $("<li>", {
                    class: value.display == 0 ? "" : "active",
                    html: "<a href=\"javascript:;\"> " + value.title + "</a>",
                    click: function() {
                        var $this = $(this);
                        $(this).toggleClass("active");
                        if (columns.find(".active").length > 0) {
                            $(target).find("[data-name='" + value.field + "']").toggleClass('hide');
                            var hideLen = target.$tableHeader.find("th.hide").length;
                            var showLen = target.$tableHeader.find("th:not('.hide,.check_box')").length;
                            if (hideLen == 0) {
                                // 恢复
                                target.$tableHeader.find("th:not('check_box')").each(function() {
                                    var $defaultThis = $(this),
                                        defaultName = $defaultThis.attr("data-name");
                                    $.each(opts.columnsWidth, function(i, v) {
                                        if (defaultName == v.field && v.field != 'check_box') {
                                            $defaultThis.css("width", v.width);
                                            $(target).find("[data-name='" + defaultName + "']").css("width", v.width);
                                            opts.columnsWidth[i].display = 1;
                                            opts.columnsWidth[i].cwidth = v.width;
                                        }
                                    });
                                });
                            }

                            if (hideLen > 0) {
                                var allWidth = opts.size.width;
                                if (target.$tableHeader.find("th.check_box")[0]) {
                                    allWidth = allWidth - 40;
                                }
                                // if (opts.columns[1]) {
                                //     allWidth = allWidth - 100;
                                // }

                                target.$tableHeader.find("th.hide:not('.check_box')").each(function(i) {
                                    var $hideThis = $(this),
                                        hideName = $hideThis.attr("data-name");
                                    $.each(opts.columnsWidth, function(i, v) {
                                        if (hideName == v.field && v.field != 'check_box') {
                                            opts.columnsWidth[i].display = 0;
                                            opts.columnsWidth[i].cwidth = 0;
                                        }
                                    });
                                });
                                target.$tableHeader.find("th:not('.hide,.check_box')").each(function() {
                                    var $showThis = $(this),
                                        showName = $showThis.attr("data-name");
                                    $.each(opts.columnsWidth, function(i, v) {
                                        if (showName == v.field && v.field != 'check_box') {
                                            if (v.set && allWidth / hideLen <= v.width) {
                                                showLen = showLen - 1;
                                                allWidth = allWidth - v.width;
                                                $showThis.css("width", v.width);
                                                $(target).find("[data-name='" + showName + "']").css("width", v.width);
                                                opts.columnsWidth[i].cwidth = v.width;
                                            } else {
                                                $showThis.css("width", allWidth / showLen);
                                                $(target).find("[data-name='" + showName + "']").css("width", allWidth / showLen);
                                                opts.columnsWidth[i].cwidth = allWidth / showLen;
                                            }
                                            opts.columnsWidth[i].display = 1;
                                        }
                                    });
                                });
                            }
                        } else {
                            $(this).toggleClass("active");
                            return false;
                        }
                    }
                }).appendTo(columns);
            }
        });

    };
    var _newColumns = function(target) {
        var opts = $.data(target, pluginName).options;
        var newColumns = [];
        var i = 0;

        function treeSearch(value, i) {
            if(!value){
                return;
            }
            $.each(value, function(x, y) {
                if (y.colspan) {
                    treeSearch(opts.columns[++i], i);
                } else {
                    newColumns.push(y);
                }
            });
        }
        treeSearch(opts.columns[i], i);
        return newColumns;
    }
    var _item = function(target, result) {
        var opts = $.data(target, pluginName).options;
        target.$tableWarp.find("tbody").empty();

        if (result.hasOwnProperty("code") == false) {
            result.code = 0;
        }

        if (result.code == 0) {
            if (result.rows.length > 0) {
                var newColumns = _newColumns(target);
                $.each(result.rows, function(index, value) {
                    var tbodyTr = $("<tr>", {
                        class: opts.rowClass(index, value),
                        css: opts.rowCss(index, value),
                        "data-index": index,
                        click: function() {
                            $(this).find("input[type='checkbox']").click();
                        }
                    }).appendTo(target.$tableWarp.find("tbody"));

                    $.each(newColumns, function(i, v) {
                        var columnsJson = _returnWidth(v.field, opts.columnsWidth);
                        var td = $("<td>", {
                            "data-name": v.field,
                            class: columnsJson.display == 0 ? "hide" : ""
                        }).appendTo(tbodyTr);

                        td.css("width", columnsJson.cwidth);

                        $.each(value, function(x, y) {
                            if (v.field == x) {
                                if (v.formatter) {
                                    td.html(v.formatter(y, result.rows, index, td));
                                } else if (v.formatterBtn) {
                                    // 根据取得的值，显示按钮
                                    td.html("<div class=\"btn-group btn-group-sm\"></div>");
                                    if (y) {
                                        $("<button>", {
                                            type: "button",
                                            class: "btn btn-default",
                                            html: v.formatterBtn.confirmText,
                                            click: function() {
                                                v.formatterBtn.onConfirmClick(result.rows[index]);
                                            }
                                        }).appendTo(td.find(".btn-group"));
                                    } else {
                                        $("<button>", {
                                            type: "button",
                                            class: "btn btn-default",
                                            html: v.formatterBtn.cancelText,
                                            click: function() {
                                                v.formatterBtn.onCancelClick(result.rows[index]);
                                            }
                                        }).appendTo(td.find(".btn-group"));
                                    }
                                } else if (v.checkbox) {
                                    var checkbox = $("<input>", {
                                        name: x,
                                        type: "checkbox",
                                        value: y
                                    }).appendTo(td).on("click", function(event) {
                                        if (!opts.singleSelect) {
                                            tbodyTr.toggleClass('success');
                                        } else {
                                            if (tbodyTr.hasClass('success')) {
                                                tbodyTr.removeClass('success');
                                            } else {
                                                tbodyTr.addClass('success').siblings().removeClass('success').find("input[type='checkbox']").prop("checked", false);
                                            }
                                        }

                                        opts.onClickRow(index, value);
                                        var checkbox = target.$tableWarp.find("input[type='checkbox']:checked");

                                        if (checkbox.length > 0 && target.btnParams) {
                                            $.each(target.btnParams, function(i, v) {
                                                var enabled = v.isEnabled(index, value);

                                                if (v.isVerifyRow) {
                                                    target.$btn[i].btn('disabled', false);
                                                }
                                                target.$btn[i].btn('disabled', !enabled);

                                            });
                                        } else if (target.btnParams) {
                                            $.each(target.btnParams, function(i, v) {
                                                if (v.isVerifyRow) {
                                                    target.$btn[i].btn('disabled', true);
                                                }
                                            });
                                        }
                                        event.stopPropagation();
                                    });
                                } else {
                                    td.html(y == null ? " " : y);
                                }
                                if (v.align) {
                                    td.addClass('' + v.align + '');
                                }
                            }
                        });
                    });
                    // 每行的操作按钮
                    // if (opts.columns[1]) {
                    //     var oprateTd = $("<td>", {
                    //         css: { width: 100 },
                    //         html: "<div class=\"btn-group btn-group-sm\"></div>"
                    //     }).appendTo(tbodyTr);
                    //     $.each(opts.columns[1], function(i, v) {
                    //         $("<button>", {
                    //             "data-btn": v.btn,
                    //             type: "button",
                    //             class: "btn btn-default",
                    //             html: v.text,
                    //             click: function() {
                    //                 v.onClick(index, value);
                    //             }
                    //         }).appendTo(oprateTd.find(".btn-group"));
                    //     });
                    // }
                });

                // 统计
                if (opts.showSummary && result.summary && result.summary.length > 0) {
                    $.each(result.summary, function(i, v) {
                        $("<tr style=\"height:35px;\"></tr>").appendTo(target.$tableWarp.find("tbody")[0]);
                        var tr = $("<tr>").appendTo($(target).find(".summary tbody"));
                        $.each(opts.columns[0], function(x, y) {
                            var columnsJson = _returnWidth(y.field, opts.columnsWidth),
                                td = $("<td>", {
                                    "data-name": y.field,
                                    class: columnsJson.display == 0 ? "hide" : "",
                                    css: { width: columnsJson.cwidth },
                                    html: " "
                                }).appendTo(tr);

                            if (y.align) {
                                td.addClass('' + y.align + '');
                            }
                            // 赋值 
                            $.each(v, function(index, value) {
                                if (y.field == index) {
                                    td.html(value);
                                }
                            });
                            // 设置合计名
                            tr.find("td:eq(0)").html(v.productid).addClass('text-right');
                        });

                    });
                }
                opts.gridData = result.rows;
            } else {
                _notContent(target, "暂无数据");
            }
        } else {
            _notContent(target, "出错了:" + result.message + "");
        }
    };
    var _notContent = function(target, message) {
        var opts = $.data(target, pluginName).options;
        $("<p>", {
            css: { position: "relative", top: 150, margin: "0 auto" },
            class: "loadmore",
            html: "<span class=\"loadmore__tips\">" + message + "</span>"
        }).appendTo(target.$tableWarp.find("tbody"));
        opts.gridData = [];
        opts.totalPage = 0;
        opts.total = 0;
    }
    var _iframeLoad = function(target) {
        var opts = $.data(target, pluginName).options;
        if (opts.dialog) {
            opts.size = {
                width: opts.size.width || $(target).parents(".modal-body").width(),
                height: opts.size.height || $(target).parents(".modal-body").height()
            }
            render(target);
        } else {
            var iframeBody = $(target).parents("body.iframe");
            var parentCol = $(target).parents("div[class^='col']:eq(0)");
            if ($(iframeBody).attr("data-isLoad") == "true") {
                opts.size = {
                    width: parentCol.width(),
                    height: iframeBody.height() - 20
                }
                render(target);
            } else {
                setTimeout(function() {
                    _iframeLoad(target);
                }, 100);
            }
        }
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
                    initialization(this);
                }

            });
        },
        opts: function(options) {
            var opts = null;
            this.each(function() {
                opts = $.data(this, pluginName).options;
                if (options) {
                    opts = $.extend(true, {}, opts, options);
                    $.data(this, pluginName, {
                        options: opts
                    });
                }
            });
            return opts;
        },
        getRow: function() {
            var row = null;
            this.each(function() {
                row = getRow(this);
            });
            return row;
        },
        getRows: function(options) {
            var rows = null;
            this.each(function() {
                rows = getRows(this, options);
            });
            return rows;
        },
        getId: function() {
            var id = null;
            this.each(function() {
                id = getId(this);
            });
            return id;
        },
        getIds: function(options) {
            var ids = null
            this.each(function() {
                ids = getIds(this, options);
            });
            return ids;
        },
        getQueryParams: function() {
            var qp = null;
            this.each(function() {
                qp = getQueryParams(this);
            });
            return qp;
        },
        getData: function(options) {
            return this.each(function() {
                getData(this, options);
            });
        },
        reload: function(options) {
            return this.each(function() {
                reload(this, options);
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
        idField: 'id',
        showHeader: true, // 是否显示表行头。
        showFooter: true, // 是否显示表行脚。
        size: {}, // 设置表格大小
        toolbar: { // false 为隐藏工具栏
            size: "col-sm-6",
            align: "left",
        },
        search: {
            size: "col-sm-5",
            onLoad: function(form) {},
            formGroup: [{
                name: "search",
                type: 'text',
                labelName: "查询",
                placeholder: '录入查询条件'
            }]
        },
        searchSenior: false, //多条件查询
        custom: false,
        footer: true,
        footerRowSize: [9, 3],
        border: false, //边框
        load: true, //渲染表格，不加载数据
        minWidth: 0, //最小宽度
        total: 0,
        totalPage: 0, // 总页数
        page: 1, // 默认当前页1
        rows: 10,
        queryParams: {
            page: 1,
            rows: 10
        },
        dialog: false,
        onLoad: function(opts) {},
        onClickRow: function(rowIndex, rowData) {},
        checkbox: false,
        onCheck: function(rowIndex, rowData) {},
        onUncheck: function(rowIndex, rowData) {},
        singleSelect: true, //如果为true，则只允许选择一行。,
        rowClass: function(index, row) {
            return "";
        },
        rowCss: function(index, row) {
            return {};
        },
        loadFilter: function(data) {
            // 返回过滤数据显示。
            data.rows = data.data;
            delete data.data;
            return data;
        }
    };
})(jQuery);

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

;(function() {
    var modules = {
        // 省市区联动
        areaData: {
            js: 'cityPickData.js'
        },
        area: {
            js: 'cityPicker.js',
            css: 'area.css',
            dependencies: ['areaData']
        },
        // 时间控件
        datatimeLanguage: {
            js: 'bootstrap-datetimepicker.min.js'
        },
        datetime: {
            js: 'bootstrap-datetimepicker.zh-CN.js',
            css: 'datetimepicker.min.css',
            dependencies: ['datatimeLanguage']
        },
        // 滚动条插件
        niceScroll: {
            js: 'jquery.nicescroll.js'
        },
        // 拖动插件
        resizable: {
            js: 'jquery.resizable.js'
        },
        // 折叠面板部件
        accordion: {
        	js: 'accordion.js'
        }
    };
    var queues = {};
    function loadJs(url, callback) {
        var done = false;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.language = 'javascript';
        script.src = url;
        script.onload = script.onreadystatechange = function() {
            if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
                done = true;
                script.onload = script.onreadystatechange = null;
                if (callback) {
                    callback.call(script);
                }
            }
        }
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    function runJs(url, callback) {
        loadJs(url, function() {
            document.getElementsByTagName("head")[0].removeChild(this);
            if (callback) {
                callback();
            }
        });
    }
    function loadCss(url, callback) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.media = 'screen';
        link.href = url;
        document.getElementsByTagName('head')[0].appendChild(link);
        if (callback) {
            callback.call(link);
        }
    }
    function loadSingle(name, callback) {
        queues[name] = 'loading';
        var module = modules[name];
        var jsStatus = 'loading';
        var cssStatus = (loader.css && module['css']) ? 'loading' : 'loaded';
        if (loader.css && module['css']) {

            if (/^http/i.test(module['css'])) {
                var url = module['css'];
            } else {
                var url = loader.base + '/css/' + module['css'];
            }

            loadCss(url, function() {
                cssStatus = 'loaded';
                if (jsStatus == 'loaded' && cssStatus == 'loaded') {
                    finish();
                }
            });
        }
        if (/^http/i.test(module['js'])) {
            var url = module['js'];
        } else {
            var url = loader.base + '/js/' + module['js'];
        }
        loadJs(url, function() {
            jsStatus = 'loaded';
            if (jsStatus == 'loaded' && cssStatus == 'loaded') {
                finish();
            }
        });
        function finish() {
            queues[name] = 'loaded';
            loader.onProgress(name);
            if (callback) {
                callback();
            }
        }
    }
    function loadModule(name, callback) {
        var mm = [];
        var doLoad = false;
        if (typeof name == 'string') {
            add(name);
        } else {
            for (var i = 0; i < name.length; i++) {
                add(name[i]);
            }
        }
        function add(name) {
            if (!modules[name]) return;
            var d = modules[name]['dependencies'];
            if (d) {
                for (var i = 0; i < d.length; i++) {
                    add(d[i]);
                }
            }
            mm.push(name);
        }
        function finish() {

            if (callback) {
                callback();
            }
            loader.onLoad(name);
        }
        var time = 0;
        function loadMm() {
            if (mm.length) {

                var m = mm[0]; // the first module
                if (!queues[m]) {
                    doLoad = true;
                    loadSingle(m, function() {
                        mm.shift();
                        loadMm();
                    });
                } else if (queues[m] == 'loaded') {
                    mm.shift();
                    loadMm();
                } else {
                    if (time < loader.timeout) {
                        time += 10;
                        setTimeout(arguments.callee, 10);
                    }
                }
            } else {
                if (loader.locale && doLoad == true && locales[loader.locale]) {
                    var url = loader.base + 'locale/' + locales[loader.locale];
                    runJs(url, function() {
                        finish();
                    });
                } else {
                    finish();
                }
            }
        }
        loadMm();
    }
    loader = {
        modules: modules,
        base: window.parent.ctx+'/p',
        css: true,
        locale: null,
        timeout: 2000,
        load: function(name, callback) {

            if (/\.css$/i.test(name)) {
                if (/^http/i.test(name)) {
                    loadCss(name, callback);
                } else {
                    loadCss(loader.base + name, callback);
                }
            } else if (/\.js$/i.test(name)) {
                if (/^http/i.test(name)) {
                    loadJs(name, callback);
                } else {
                    loadJs(loader.base + name, callback);
                }
            } else {
                loadModule(name, callback);
            }
        },
        onProgress: function(name) {},
        onLoad: function(name) {}
    };
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if (!src) continue;
        var m = src.match(/loader\.js(\W|$)/i);
        if (m) {
            loader.base = src.substring(0, m.index);
        }
    }
    window.using = loader.load;
})();

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
                debugger
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
                // console.log("view"+tableWarp.attr("style"));
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

/* ========================================================================
 * zzw: myMenu.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'myMenu';

    function Modal(options) {
        this.options = $.extend(true, {}, $.fn.defaults, options);
        var self = this;

        self.item();
        if ($(window).width() < 750) {
            $('#sidebar').addClass('hide-left-bar');
            $('#main-content').addClass('merge-left');
        }
        //左侧导航 
        $('.sidebar-toggle-box').click(function(e) {
            using("niceScroll", function() {
                $(".leftside-navigation").niceScroll({
                    cursorcolor: "#959595",
                    cursorborder: "0px solid #fff",
                    cursorborderradius: "0px",
                    cursorwidth: "3px"
                });
                $('#sidebar').toggleClass('hide-left-bar');
                if ($(window).width() < 750) {
                    $('#sidebar').toggleClass('show-left-bar');
                    $('#main-content').toggleClass('merge-right');
                    $('#sidebar').toggleClass('hidden-xs');
                }
                if ($('#sidebar').hasClass('hide-left-bar')) {
                    $(".leftside-navigation").getNiceScroll().hide();
                }
                $(".leftside-navigation").getNiceScroll().show();
                $('#main-content').toggleClass('merge-left');
            });
            e.stopPropagation();
        });

        $("#show-right-info-bar").on("click", function() {
            if ($("#show-right-info-bar").hasClass("move")) {
                $(".right-info-bar").attr("style", "right: -250px"), $("#show-right-info-bar").removeClass("move");

            } else {
                $(".right-info-bar").attr("style", "right: 0px"), $("#show-right-info-bar").addClass("move");
            }
        });
    }
    
    $.extend(Modal.prototype, {
        opts: function() {
            return this.options;
        },
        item: function() {
            var self = this,opts = self.options;

            $.each(opts.data, function(index, value) {
                if (value.children.length > 0) {
                    var icon = value.icon || "th-list";
                    // 有子栏目时，创建顶级
                    var parentLi = $('<li id="li_'+value.id+' data-row-id="'+value.id+'" class="sub-menu dcjq-parent-li">'
                                        +'<a href="javascript:;" class="dcjq-parent"><i class="glyphicon glyphicon-'+ icon +'"></i><span>'+ value.text +'</span></a>'
                                        +'<ul class="sub"></ul>'
                                    +'</li>').appendTo(opts.target);
                    self.menuEdit(opts.edit, value);

                    $.each(value.children, function(i, v) {
                        var childrenIcon = v.icon || "menu-right";
                        $("<li>", {
                            id: "li_" + v.id,
                            "data-row-id": v.id,
                            html: "<a href=\"javascript:;\"><i class=\"glyphicon glyphicon-" +childrenIcon + "\"></i><span>" + v.text + "</span></a>",
                            click: function() {
                                $(this).view({
                                    id: v.code,
                                    text: v.text,
                                    contextPath: ctx,
                                    url: v.url
                                });
                                return false;
                            }
                        }).appendTo(parentLi.find(".sub"));
                        self.menuEdit(opts.edit, v);
                    });

                } else if (value.children && value.code != "welcome") {
                    $("<li>", {
                        html: "<h3>" + value.text + "</h3>"
                    }).appendTo(opts.target);
                } else if (value.code == "welcome") {
                    // 首页
                    $('#nav-accordion').view({
                        id: value.code,
                        text: value.text,
                        contextPath: ctx,
                        url: value.url,
                        default: true
                    });
                }
            });
            $("#nav-accordion > li:eq(0) > a").addClass('active');
            using("accordion", function() {
                var accordion = $('#nav-accordion').dcAccordion({
                    eventType: 'click',
                    autoClose: true,
                    saveState: true,
                    disableLink: true,
                    speed: 'fast',
                    showCount: false,
                    autoExpand: true,
                    classExpand: 'dcjq-current-parent'
                });
            });
        },
        menuEdit: function(edit, row) {
            var self = this,
                opts = self.options;
            if (edit) {
                var menuEdit = $("#li_" + row.id + "").rightMenu({
                    actionsGroups: [
                        ['add', 'ddd'],
                        ['edit']
                    ],
                    actions: {
                        ddd: {
                            name: '添加22',
                            iconClass: 'glyphicon glyphicon-plus',
                            onClick: function() {
                                self.add(row);
                            },
                            isEnabled: function() {
                                if (row.pid != null) return false;
                                return true;
                            }
                        },
                        add: {
                            name: '添加',
                            iconClass: 'glyphicon glyphicon-plus',
                            onClick: function() {
                                self.add(row);
                            },
                            isEnabled: function() {
                                if (row.pid != null) return false;
                                return true;
                            }
                        },
                        edit: {
                            name: '编辑',
                            iconClass: 'glyphicon glyphicon-edit',
                            onClick: function() {

                            },
                            isEnabled: function(row) {
                                return true;
                            }
                        }
                    }
                });
            }
        },
        add: function(row) {
            var dlg = $(this).dialog("form", {
                title: '添加菜单',
                modalSize: 'modal-lg',
                formGroup: [{
                    name: "text",
                    size: "2|10",
                    labelName: "* 菜单名称"
                }, {
                    name: "code",
                    size: "2|10",
                    labelName: "* code名称",
                }, {
                    name: "url",
                    size: "2|10",
                    labelName: "* 菜单路径",
                }, {
                    name: "icon",
                    size: "2|10",
                    labelName: "* 菜单图标",
                }, {
                    name: "methods",
                    size: "2|10",
                    labelName: "* map方法"
                }, {
                    name: "pid",
                    input: {
                        type: "hidden",
                        value: row.id
                    }
                }],
                submit: {
                    url: window.parent.ctx + "/menumanage/save",
                    onSuccess: function(result) {
                        if (result.code == 0) {
                            $.tips("操作成功！", 2);
                        } else {
                            $.tips(result.message);
                        }
                    }
                }
            });
        }
    });


    $[pluginName] = function(options) {
        return new Modal(options);
    };

    $.fn.defaults = {
        target: '#nav-accordion'
    };
})(jQuery);

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
/* ========================================================================
 * zzw: tree.js v0.1.0
 * ========================================================================
 * Copyright 2016-2017 559hs.
 * ======================================================================== */
;
(function($, undefined) {
    "use strict";
    var pluginName = 'tree';

    var initialization = function(target) {
        var opts = $.data(target, pluginName).options;
        $(target).addClass('list-group zzwTree').css({
            marginTop: 10,
            marginBottom: 10
        })

        var top = $("<a>", {
            id: "treeItem_top",
            href: "javascript:;",
            class: "list-group-item active",
            html: opts.title
        }).appendTo(target);

        opts.onRightClick && top.rightMenu(opts.onRightClick);


        size(target,{});
    };

   

    var size = function(target,options){
        var iframeBody = $(target).parents("body.iframe");
        if ($(iframeBody).attr("data-isLoad") == "true") {
            using("niceScroll", function() {
                target.$warp = $('<div class="tree-warp" />').appendTo(target).css('height',($(window).height() - 62));
                target.$warp.niceScroll({
                    cursorcolor: "#959595",
                    cursorborder: "0px solid #fff",
                    cursorborderradius: "0px",
                    cursorwidth: "10px"
                });
            });
            getData(target, options);
        }else{
            setTimeout(function() {
                size(target,options);
            }, 100);
        }
    };

    var refresh = function(target, options) {
        // 刷新节点
        var opts = $.data(target, pluginName).options;
        if (options.id && options.id > 0) {
            $(target).find("#item_" + options.id).empty();
            size(target,options);
        } else {
            $(target).find("a,div").not(".active").remove();
            size(target,{ id: 'all' });
        }
    };

    var getRow = function(target) {
        var opts = $.data(target, pluginName).options;
        var selected = $(target).find(".info");
        var id = "";
        if (selected.length > 0) {
            id = selected.attr("id").split("_")[1];
        }
        opts.treeData[id];
        return opts.treeData[id];
    };

    var getData = function(target, options) {
        options = options || {};
        var opts = $.data(target, pluginName).options;
        opts.queryParams = $.extend(true, {}, opts.queryParams, options);

        $.ajax({
            url: opts.ctx + opts.url,
            type: 'POST',
            dataType: 'json',
            data: opts.queryParams,
            complete: function(xhr, textStatus) {
                //请求完成时执行
            },
            success: function(result, textStatus, xhr) {
                item(target, result);
                $.each(result, function(i, v) {
                    opts.treeData[v.id] = v;
                });
                target.$warp.getNiceScroll().resize();
            },
            error: function(xhr, textStatus, errorThrown) {
                //called when there is an error
            }
        });
    };

    var item = function(target, result) {
        var opts = $.data(target, pluginName).options;
        if (result.length > 0) {
            var toDiv = target.$warp;

            if (opts.queryParams.id != 'all') {
                toDiv = $(target).find("#item_" + opts.queryParams.id);
                var rowsHeight = result.length * opts.rowHeight;
                toDiv.css('height', rowsHeight).attr('data-height', rowsHeight);
            }

            $.each(result, function(index, value) {
                var i = value.level <= opts.maxLevel ? "<span class=\"level_" + value.level + "\"><i class=\"glyphicon glyphicon-plus\"></i></span>" : "<i class=\"level_" + value.level + "\"></i>";
                var item = $("<a>", {
                    id: "treeItem_" + value.id,
                    href: "javascript:;",
                    class: "list-group-item",
                    html: i + " " + value.text,
                    click: function() {
                        opts.onClick(result[index]);
                        $(target).find(".list-group-item:not('#treeItem_top')").removeClass('info');
                        $(this).addClass('info');
                    }
                }).appendTo(toDiv);

                item.on("click", "span", function(event) {
                    $(target).find(".list-group-item:not('#treeItem_top')").removeClass('info');
                    if (value.state == 'close' && value.level <= opts.maxLevel) {
                        $(this).find("i").removeClass('glyphicon-plus').addClass('glyphicon-minus');
                        $(this).parents("a.list-group-item").addClass('info').after("<div id=\"item_" + value.id + "\" style=\"height: 0px;\" class=\"list-group\"></div>");
                        value.toDiv = true;
                        value.state = "open";
                        opts.onSelect(result[index]);
                    } else if (value.state == 'open' || value.state == 'show') {
                        $(this).find("i").removeClass('glyphicon-minus').addClass('glyphicon-plus');
                        $(this).parents("a.list-group-item").next("#item_" + value.id).css('height', 0);
                        value.state = "hide";
                    } else if (value.state == 'hide') {
                        $(this).find("i").removeClass('glyphicon-plus').addClass('glyphicon-minus');
                        var selfToDiv = $(this).parents("a.list-group-item").next("#item_" + value.id);
                        $(this).parents("a.list-group-item").addClass('info');
                        selfToDiv.css('height', selfToDiv.attr('data-height'));
                        value.state = "show";
                    }
                    event.stopPropagation();
                });

                if (opts.onRightClick) {
                    var rightOpts = $.extend(true, {}, {
                        fetchElementData: function() {
                            return value;
                        }
                    }, opts.onRightClick);
                    item.rightMenu(rightOpts);
                }
            });

            
        } else {
            $.tips("未得到数据");
        }
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
        opts: function(){
            return $.data(this[0], pluginName).options;
        },
        getData: function(options){
            return this.each(function(){
                getData(this,options);
            });
        },
        refresh: function(options){
            return this.each(function(){
                refresh(this,options);
            });
        },
        getRow: function(){
            return getRow(this[0]);
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
        treeData: {},
        title: "Tree",
        rowHeight: 41,
        maxLevel: 2, // 树的最大级别 如：3级，设置2
        onSelect: function(row) {

        },
        onClick: function(row) {

        },
        onRightClick: false
    };
})(jQuery);

function upLoad(opts) {
    var dataImg = new FormData(),res = {};
    dataImg.append("file", opts.fileData);
    $.ajax({
        type: "post",
        data: dataImg,
        dataType: 'json',
        url: opts.url,
        processData: false,
        contentType: false,
        async: false,
        beforeSend: function(XMLHttpRequest) {

        },
        success: function(result) {
            res = result;
        },
        complete: function(XMLHttpRequest, textStatus) {

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    return res;
}
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
