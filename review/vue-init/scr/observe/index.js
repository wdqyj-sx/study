import { isObject } from "../util";
import { arrayMethods } from "./array";

export function observe(data){
    if(!isObject(data)){
        return ;
    }
    if(data.__op__){
        return ;
    }
    return new Observer(data);
}

class Observer {
    constructor(data){
        Object.defineProperty(data,'__op__',{
            value:this,
            enumerable:false
        })
        if(Array.isArray(data)){
            data.__proto__ = arrayMethods;
            this.observeArray(data);
        }
        else {
            this.walk(data);
        }
    }
    observeArray(data){
        data.forEach(item=>{
            observe(item);
        })
    }
    walk(data){
        Object.keys(data).forEach(item =>{

            defineReactive(data,item,data[item]);
        })
    }


}

function defineReactive (data,key,value){
    observe(value)
    Object.defineProperty(data,key,{
        get(){
            return value;
        },
        set(newV){
            observe(newV)
            value = newV;
        }
    })
}