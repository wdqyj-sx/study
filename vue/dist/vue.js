(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

    function gen(el) {
      if (el.type === 1) {
        return generate(el);
      } else {
        var text = el.text;

        if (!defaultTagRE.test(text)) {
          return "_v(".concat(text, ")");
        } else {
          var tokens = [];
          var match;
          var lastIndex = defaultTagRE.lastIndex = 0;

          while (match = defaultTagRE.exec(text)) {
            var index = match.index;

            if (index > lastIndex) {
              tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }

            tokens.push("_s(".concat(match[1].trim(), ")"));
            lastIndex = lastIndex + match[0].length;
          }

          if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
          }

          return "_v(".concat(tokens.join('+'), ")");
        }
      }
    }

    function genChildren(el) {
      var children = el.children;

      if (children) {
        return children.map(function (c) {
          return gen(c).join(',');
        });
      }

      return false;
    }

    function genProps(attrs) {
      var str = "";

      for (var i = 0; i < attrs; ++i) {
        var attr = attrs[i];

        if (attr.name === "style") {
          (function () {
            var styleObj = {};
            attr.value.replace(/([^:;])\:([^:;])/g, function () {
              styleObj[arguments[1]] = arguments[2];
            });
            attr.value = styleObj;
          })();
        }

        str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
      }

      return "{".concat(str.slice(0, -1), "}");
    }

    function generate(el) {
      var children = genChildren(el);
      var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? genProps(el.attrs) : 'undefine').concat(children ? ",".concat(children) : '', ")");
      return code;
    }

    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //匹配标签名

    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //捕获标签名

    var startTagOpen = new RegExp("^<".concat(qnameCapture)); //匹配开始标签

    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); //匹配闭合标签

    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'<>=`]+)))?/; //匹配属性

    var startTagClose = /^\s*(\/?)>/; //匹配开始标签中的闭合标志
    //创建一个ast树结构

    function createAstElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        parent: null,
        attrs: attrs
      };
    }

    var root = null;
    var stack = []; //开始标签处理方法

    function start(tagName, attrs) {
      //创建父子节点关系
      //拿到父节点
      var parent = stack[stack.length - 1];
      var element = createAstElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      if (parent) {
        element.parent = parent;
        parent.children.push(element);
      }

      stack.push(element); //进栈
    } //闭合标签处理方法


    function end(tagName) {
      var last = stack.pop();

      if (last.tag !== tagName) {
        throw new Error('标签有误');
      }
    } //文本处理方法


    function chars(text) {
      text = text.replace(/\s/g, "");
      var parent = stack[stack.length - 1];

      if (text) {
        parent.children.push({
          type: 3,
          text: text
        });
      }
    } // parseHTML('<div age="18">{{name}}</div>')
    // 按词法解析html


    function parseHTML(html) {
      //删除已经处理了的文本
      function advance(len) {
        html = html.substring(len);
      } //解析开始标签


      function parseStartTag() {
        // 匹配开始标签
        var start = html.match(startTagOpen);

        if (start) {
          //初始化标签名和属性
          var match = {
            tagName: start[1],
            attrs: []
          };
          advance(start[0].length);

          var _end;

          var attr; // 匹配属性

          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            //匹配到属性
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
            advance(attr[0].length);
          } //匹配到开始标签中的闭合结尾


          if (_end) {
            advance(_end[0].length);
          }

          return match;
        }

        return false;
      } //循环解析


      while (html) {
        var textEnd = html.indexOf('<'); //获取当前解析的开头

        if (textEnd === 0) {
          // 说明这是开始的标签
          var startTagMatch = parseStartTag(); // 匹配到了开始标签和属性,开始处理开始标签

          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue;
          } // 也有可能是闭合标签


          var endTagMatch = html.match(endTag);

          if (endTagMatch) {
            end(endTagMatch[1]);
            advance(endTagMatch[0].length);
            continue;
          }
        } // 如果不等于0,说明是文本内容


        var text = void 0;

        if (textEnd > 0) {
          text = html.substring(0, textEnd);
        }

        if (text) {
          chars(text);
          advance(text.length);
        }
      }

      return root;
    }

    function compileToFunction(template) {
      //按词法解析html
      var root = parseHTML(template); // 将ast树生成代码

      generate(root);
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    var oldArrayPrototype = Array.prototype;
    var arrayMethods = Object.create(oldArrayPrototype);
    var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
    methods.forEach(function (method) {
      arrayMethods[method] = function () {
        var _oldArrayPrototype$me;

        console.log('数组改变了');

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args)); // 通过push、unshift、splice方法也可能对数据进行更改


        var po = this.__po__;
        var inserted;

        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;

          case 'splice':
            inserted = args.slice(2);
            break;
        }

        if (inserted) {
          po.observeArray(inserted);
        }
      };
    });

    function isFunction(val) {
      return typeof val === 'function';
    }
    function isObject(val) {
      return _typeof(val) === 'object' && val !== null;
    }

    var Observer = /*#__PURE__*/function () {
      function Observer(data) {
        _classCallCheck(this, Observer);

        // data.__po__ = this;
        Object.defineProperty(data, '__po__', {
          value: this,
          enumerable: false
        });

        if (Array.isArray(data)) {
          data.__proto__ = arrayMethods;
          this.observeArray(data);
        } else {
          //对对象中的所有属性进行劫持
          this.walk(data);
        }
      } // 如果数组中包含对象，则再次被监控


      _createClass(Observer, [{
        key: "observeArray",
        value: function observeArray(data) {
          data.forEach(function (item) {
            observe(data);
          });
        }
      }, {
        key: "walk",
        value: function walk(data) {
          Object.keys(data).forEach(function (key) {
            defineReactive(data, key, data[key]);
          });
        }
      }]);

      return Observer;
    }();

    function defineReactive(data, key, value) {
      observe(value);
      Object.defineProperty(data, key, {
        get: function get() {
          return value;
        },
        set: function set(newV) {
          observe(value);
          value = newV;
        }
      });
    }

    function observe(data) {
      // 判断数据是否为对象
      if (!isObject(data)) {
        return;
      }

      if (data.__po__) {
        return;
      } //创建观测者来观测数据


      return new Observer(data);
    }

    function initState(vm) {
      var opts = vm.$options;

      if (opts.data) {
        // 数据存在，则劫持数据
        initData(vm);
      }
    }

    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[source][key];
        },
        set: function set(newV) {
          vm[source][key] = newV;
        }
      });
    }

    function initData(vm) {
      var data = vm.$options.data; // 判断data是函数还是对象,获取其对象数据

      data = vm._data = isFunction(data) ? data(vm) : data; // 将数据挂载到vm上

      for (var key in data) {
        proxy(vm, '_data', key);
      } //观察数据


      observe(data);
    }

    function initMixin(Vue) {
      // 在Vue类的原型上添加这个函数
      Vue.prototype._init = function (options) {
        var vm = this; // 在原型上添加一个属性保存数据

        vm.$options = options; //
        //开始对数据进行劫持

        initState(vm);
      };

      Vue.prototype.$mount = function (el) {
        var vm = this;
        var options = vm.$options; //拿到节点;

        el = document.querySelector(el); // 将节点挂载到vm上

        vm.$el = el; //判断option有没有调用render和template，否则则对dom节点进行词法分析，生成ast树

        if (!options.render) {
          var template = options.template;

          if (!template && el) {
            //获取渲染节点内容
            template = el.outerHTML; //进行词法分析，生成ast树

            var render = compileToFunction(template); //将render方法挂载到options上

            options.render = render;
          }
        }
      };
    }

    function Vue(options) {
      //options 为传入的选项
      this._init(options);
    }

    initMixin(Vue);

    return Vue;

})));
//# sourceMappingURL=vue.js.map
