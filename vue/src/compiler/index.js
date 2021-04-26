import { generate } from "./generate";
import { parseHTML } from "./parse";

export function compileToFunction(template){
    //按词法解析html
 
   let root = parseHTML(template);
    // 将ast树生成代码
    let code = generate(root);
 
   
}