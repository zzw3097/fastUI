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
