const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;//匹配标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;//捕获标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`);//匹配开始标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配闭合标签
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'<>=`]+)))?/;//匹配属性

const startTagClose = /^\s*(\/?)>/; //匹配开始标签中的闭合标志
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;//匹配属性

//创建一个ast树结构
function createAstElement(tagName,attrs){
    return {
        tag:tagName,
        type:1,
        children:[],
        parent:null,
        attrs
    }
}

let root = null;
let stack = [];
//开始标签处理方法
function start(tagName,attrs) {
    //创建父子节点关系
    //拿到父节点
    let parent = stack[stack.length - 1];
    let element = createAstElement(tagName,attrs);
    if(!root) {
        root = element;
    }
    if(parent) {
        element.parent = parent;
        parent.children.push(element);
    }
    stack.push(element);//进栈
}
//闭合标签处理方法
function end(tagName) {
    let last = stack.pop();
    if(last.tag !== tagName){
        throw new Error('标签有误');
    }
}
//文本处理方法
function chars(text) {
    text = text.replace(/\s/g,"");
    let parent = stack[stack.length - 1];
    if(text){
        parent.children.push({
            type:3,
            text
        })
    }
}
// parseHTML('<div age="18">{{name}}</div>')
// 按词法解析html
export function parseHTML(html){
  
    //删除已经处理了的文本
    function advance(len){
        html = html.substring(len);
    }
    //解析开始标签
    function parseStartTag() {
        // 匹配开始标签
        const start = html.match(startTagOpen);
        if(start) {
            //初始化标签名和属性
            const match = {
                tagName:start[1],
                attrs:[]
            }
            advance(start[0].length);
            let end;
            let attr;
            // 匹配属性
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
                //匹配到属性
                match.attrs.push({
                    name:attr[1],
                    value:attr[3]||attr[4]||attr[5]
                })
                advance(attr[0].length);
              
            }
            //匹配到开始标签中的闭合结尾
            if(end){
                advance(end[0].length);
            }
            return match;

        }
       return false;
    }
    //循环解析
    while(html){
       
        let textEnd = html.indexOf('<'); //获取当前解析的开头
        if(textEnd === 0){
            // 说明这是开始的标签
            const startTagMatch = parseStartTag(html);
            // 匹配到了开始标签和属性,开始处理开始标签
            if(startTagMatch){
                start(startTagMatch.tagName,startTagMatch.attrs);
                continue;
            }
            // 也有可能是闭合标签
          const endTagMatch = html.match(endTag);
          if(endTagMatch){
              end(endTagMatch[1]);
              advance(endTagMatch[0].length);
              continue;
          }

        }
        // 如果不等于0,说明是文本内容
        let text;
        if(textEnd > 0) {
             text = html.substring(0,textEnd);
        }
        if(text) {
            chars(text);
            advance(text.length);
        }
      

    }
    return root;
}