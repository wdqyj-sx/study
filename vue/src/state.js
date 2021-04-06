import { observe } from "./observer/index";
import { isFunction } from "./utils";

export function initState(vm){
    const opts = vm.$options;
    if(opts.data){
        // 数据存在，则劫持数据
        initData(vm);
    }
}

function initData(vm){
    let data = vm.$options.data;
    // 判断data是函数还是对象,获取其对象数据
    data = vm._data =  isFunction(data)?data(vm):data;
    console.log(vm._data)
    //观察数据
    observe(data);
}