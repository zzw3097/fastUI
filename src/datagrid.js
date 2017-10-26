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
