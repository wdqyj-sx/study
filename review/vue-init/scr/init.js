import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function(options){
        this.$options = options;
        //获取实例
        const vm = this;
        //初始化状态
        initState(vm);
        if(vm.$options.el){
            vm.$mount(vm.$options.el);
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.getElementById(el);
        //判断有无render
        if(options.render){
            let template = options.template;
            if(!template&&el){
               template = el.outHtml;
               let render = compileToFunction(template);
               options.render = render;
                
            }
        }
    }
}