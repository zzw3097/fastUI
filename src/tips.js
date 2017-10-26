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