import babel from "rollup-plugin-babel";
export default {
    //设置打包的入口和出口
    input:'./src/index.js', //打包的入口
    // 设置打包出口文件
    output:{
        format:'umd',//打包的格式
        name:'Vue', //打包后的包的名字
        file:'dist/vue.js', //打包后的文件
        sourcemap:true //是否和原文件做映射

    },
    // 打包的插件
    plugins:[
        //使用babel进行打包
        babel({
            //排除第三方文件
            exclude:'node_modules/**'
        })
    ]
}