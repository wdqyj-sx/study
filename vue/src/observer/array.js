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
        oldArrayPrototype[method].call(this,...args);
        // 通过push、unshift、splice方法也可能对数据进行更改
        let po = this.__po__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if(inserted) {
            po.observeArray(inserted);
        }
    }
})