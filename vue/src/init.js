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
}