// 鼠标延迟执行方法
// 2010-06-30
// 2010-09-21 绑定当前对象
/** 
 * @param {String} errorMessage  错误信息 
 * @param {String} scriptURI   出错的文件 
 * @param {Long}  lineNumber   出错代码的行号 
 * @param {Long}  columnNumber  出错代码的列号 
 * @param {Object} errorObj    错误的详细信息，Anything 
 */
window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    console.log("错误信息" + errorMessage);
    console.log("出错的文件" + scriptURI);
    console.log("出错代码的行号" + lineNumber);
    console.log("出错代码的列号" + columnNumber);
    console.log("详细信息" + errorObj);
}

var getOuter = function(obj, attr) {
        var num = 0;
        if (obj.currentStyle) {
            num = obj.currentStyle[attr];
        } else {
            num = document.defaultView.getComputedStyle(obj, null)[attr];
        }
        return parseInt(num);
    }
    /*
     * 常用公共功能
     *
     * 
     */
    //按数字格式补全字符串
var getFloatStr = function(num) {
    num += '';
    num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符  

    if (/^0+/) //清除字符串开头的0  
        num = num.replace(/^0+/, '');
    if (!/\./.test(num)) //为整数字符串在末尾添加.00  
        num += '.00';
    if (/^\./.test(num)) //字符以.开头时,在开头添加0  
        num = '0' + num;
    num += '00'; //在字符串末尾补零  
    num = num.match(/\d+\.\d{2}/)[0];
    return num;
};

//格式化日期,
function formatDate(date, format) {
    // debugger
    var paddNum = function(num) {
            num += "";
            return num.replace(/^(\d)$/, "0$1");
        }
        //指定格式字符
    var cfg = {
        yyyy: date.getFullYear() //年 : 4位
            ,
        yy: date.getFullYear().toString().substring(2) //年 : 2位
            ,
        M: date.getMonth() + 1 //月 : 如果1位的时候不补0
            ,
        MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
            ,
        d: date.getDate() //日 : 如果1位的时候不补0
            ,
        dd: paddNum(date.getDate()) //日 : 如果1位的时候补0
            ,
        hh: date.getHours() //时
            ,
        mm: date.getMinutes() //分
            ,
        ss: date.getSeconds() //秒
    }

    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig, function(m) {
        return cfg[m];
    });
}

function getNowTime() {
    var now = new Date();
    var year = now.getYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var milSecond = now.getMilliseconds();
    return year + "-" + month + "-" + day + "-" + hour + "-" + minute + "-" + second + "-" + milSecond;
};


$.fn.serializeJson = function() {
    var serializeObj = {}; // 目标对象 
    var array = this.serializeArray(); // 转换数组格式 
    // var str=this.serialize(); 
    $(array).each(function() { // 遍历数组的每个元素 {name : xx , value : xxx} 
        if (serializeObj[this.name]) { // 判断对象中是否已经存在 name，如果存在name 
            if ($.isArray(serializeObj[this.name])) {
                serializeObj[this.name].push(this.value); // 追加一个值 hobby : ['音乐','体育'] 
            } else {
                // 将元素变为 数组 ，hobby : ['音乐','体育'] 
                serializeObj[this.name] = [serializeObj[this.name], this.value];
            }
        } else {
            serializeObj[this.name] = this.value; // 如果元素name不存在，添加一个属性 name:value 
        }
    });
    return serializeObj;
};

function keytimes(date1, date2) {
    var keyw = '-';
    var str1 = date1;
    var str2 = date2;
    var array1 = str1.split(keyw);
    var array2 = str2.split(keyw);
    var Y1 = array1[0];
    var M1 = array1[1];
    var D1 = array1[2];
    var H1 = array1[3];
    var I1 = array1[4];
    var S1 = array1[5];
    var L1 = array1[6];
    var Y2 = array2[0];
    var M2 = array2[1];
    var D2 = array2[2];
    var H2 = array2[3];
    var I2 = array2[4];
    var S2 = array2[5];
    var L2 = array2[6];

    var d1 = new Date();
    d1.setYear(Y1);
    d1.setMonth(M1, D1);
    d1.setHours(H1);
    d1.setMinutes(I1);
    d1.setSeconds(S1);
    d1.setMilliseconds(L1);
    var d2 = new Date();
    d2.setYear(Y2);
    d2.setMonth(M2, D2);
    d2.setHours(H2);
    d2.setMinutes(I2);
    d2.setSeconds(S2);
    d2.setMilliseconds(L2);
    return (d2.getTime() - d1.getTime());
};

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果

function accDiv(arg1, arg2) {
    var t1 = 0,
        t2 = 0,
        r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) {}
    try { t2 = arg2.toString().split(".")[1].length } catch (e) {}
    with(Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}
//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function(arg) {
    return accDiv(this, arg);
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) {}
    try { m += s2.split(".")[1].length } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function(arg) {
    return accMul(arg, this);
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}
//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function(arg) {
    return accAdd(arg, this);
}

//减法函数，用来得到精确的减法结果
//说明：javascript的减法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
//调用：accSubtr(arg1,arg2)
//返回值：arg1减去arg2的精确结果
function accSubtr(arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
//给Number类型增加一个subtr 方法，调用起来更加方便。
Number.prototype.subtr = function(arg) {
        return accSubtr(arg, this);
    }
    // 计算：7*0.8 ，则改成 (7).mul(8)
    // 其它运算类似，就可以得到比较精确的结果。
    // 
$(function() {
    $(document).on("click", "button[data-toggle='dropdown']", function(e) {
        $(this.parentElement).toggleClass('open');
        e.stopPropagation();
    });

    $(document).on("click", function(event) {
        if ($(".btn-group.open").length > 0) {
            $(".open").removeClass('open');
        }
    });
});
