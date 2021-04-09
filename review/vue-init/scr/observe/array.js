export  let arrayMethods =  Object.create(Array.prototype);
    const methods = [
        'push',
        'shift',
        'unshift',
        'splice',
        'pop',
        'reverse',
        'sort',
    ]
    methods.forEach(method=>{
        arrayMethods[method] = function(...args){
            console.log('数组改变了');
            Array.prototype[method].call(this,...args);
            let inserted;
            switch (args) {
                case 'push':
                case 'unshift':
                    inserted = args     
                    break;
                case 'splice':
                    inserted = args.slice(2);
               
            }
            if(inserted){
                let op = this.__op__;
                op.observeArray(inserted);
            }
           
        }
    })
