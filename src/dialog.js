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
