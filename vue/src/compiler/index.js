import { parse } from "./parse";

export function compileToFunction(template){
    //按词法解析html
   let root = parse(template);
   
}