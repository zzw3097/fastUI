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
