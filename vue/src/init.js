import { compileToFunction } from "./compiler/index";
import { initState } from "./state";

export function initMixin(Vue){
    // 在Vue类的原型上添加这个函数
    Vue.prototype._init = function(options){
        const vm = this;
        // 在原型上添加一个属性保存数据
        vm.$options = options;//
        //开始对数据进行劫持
        initState(vm);
    }
    Vue.prototype.$mount = function(el) {
        const vm = this;
        const options = vm.$options;
        //拿到节点;
        el = document.querySelector(el);
        // 将节点挂载到vm上
        vm.$el = el;
        //判断option有没有调用render和template，否则则对dom节点进行词法分析，生成ast树
        if(!options.render){
            let template = options.template;
            if(!template && el){
                //获取渲染节点内容
                template = el.outerHTML;
                //进行词法分析，生成ast树
                let render = compileToFunction(template);
                //将render方法挂载到options上
                options.render = render;
            }
        }
    }
}