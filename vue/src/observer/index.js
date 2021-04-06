import { isObject } from "../utils";

// 创建观测者
class Observer{
    constructor(data){
        //对对象中的所有属性进行劫持
        this.walk(data);
    }
    walk(data){
        Object.keys(data).forEach(key =>{
          defineReactive(data,key,data[key]);
        })
    }
}
function defineReactive(data,key,value){
    observe(value)
    Object.defineProperty(data,key,{
        get(){
            return value;
        },
        set(newV) {
            // observe(value)
            value = newV;
        }
    })
}

export function observe(data) {
    // 判断数据是否为对象
    if(!isObject(data)){
        return ;
    }
    //创建观测者来观测数据
    return new Observer(data);
}