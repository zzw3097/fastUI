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
