import { observe } from "./observe/index";
import { isFunction } from "./util";

export function initState(vm){
    let options = vm.$options;
    //初始化数据
    if(options.data){
        initData(vm);
    }
}
function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key];
        },
        set(newV){
            vm[source][key] = newV;
        }   

    })
}

function initData(vm){
    let data = vm.$options.data;
    data = vm._data = isFunction(data)?data.call(this):data;
    for(let key in data){
        proxy(vm,'_data',key);
    }
    observe(data);
}