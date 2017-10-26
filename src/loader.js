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
