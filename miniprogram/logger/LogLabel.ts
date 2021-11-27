import { LogStyle } from "./LogStyle";

/**
 * 日志标签
 */
class LogLabel {
  
    /**
     * 关键字
     * 用于标识这个类别
     */
    public key:string;

    /**
     * 文字样式
     */
    public style:LogStyle;

    /**
     * 是否受到过滤器影响
     */
    public checked:boolean;

    /**
     * 是否输出
     */
    public display:boolean;

    /**
     * 是否为附件标签
     * 例如回车、时间、代码位置
     */
    public attach:boolean;

    /**
     * @param key 关键字
     * @param style 文字样式
     */
    constructor(key:string, style:LogStyle, 
    checked?:boolean, display?:boolean, attach?:boolean) {
        this.key = key;
        this.style = style;
        this.checked = checked ?? true;
        this.display = display ?? true;
        this.attach = attach ?? false;
    }

    /**
     * 获得 Logger 输出使用的内容
     */
    public getLoggerOutput():string {
        if(!this.display) return "";
        return `%c${ this.key }`;
    }

    /**
     * 获得 Text 输出内容
     */
    public getTextOutput():string {
        if(!this.display) return "";
        return `[${ this.key }]`;
    }

    /**
     * 获得 style 格式化
     */
    public getStyleOutput():string {
        if(!this.display) return "";
        return this.style.stringify();
    }

    /**
     * 校验
     */
    public checking(src:RegExp | string):boolean {

        let pass = false;

        // 关闭校验
        if(!this.checked) return pass;
        
        if(src instanceof RegExp) {
            pass = (src as RegExp).test(this.key)
        } else {
            pass = (src as string) === this.key;
        }

        return pass;
    }
}

export default LogLabel;
export {LogLabel}