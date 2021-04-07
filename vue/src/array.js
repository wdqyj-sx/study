let oldArrayPrototype = Array.prototype;
export let arrayMethods = Object.create(oldArrayPrototype);
let methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method =>{
    arrayMethods[method] = function(...args){
        console.log('数组改变了');
        // oldArrayPrototype[method].call(this,...args);
    }
})