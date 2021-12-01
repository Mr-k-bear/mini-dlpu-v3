
/**
 * 调试输出样式
 */
class LogStyle {

    /**
     * 日志文字颜色
     */
    private color:string | undefined;
    
    /**
     * 日志背景颜色
     */
    private backgroundColor:string | undefined;

    /**
     * 日志文字粗细
     */
    private weight:string | undefined;

    /**
     * 日志文字大小
     */
    private size:string | undefined;

    /**
     * 日志文字字体
     */
    private family:string | undefined;
    
    /**
     * 日志文字圆角
     */
    private borderRadius:string | undefined;

    /**
     * 日志文字边框
     */
    private border:string | undefined;
    
    /**
     * 日志文字外边距
     */
    private margin:string | undefined;
    
    /**
     * 日志文字内边距
     */
    private padding:string | undefined;
    
    /**
     * 设置颜色
     * @param color 日志文字颜色
     * @param backgroundColor 日志背景颜色
     */
    public setColor(color?:string, backgroundColor?:string):LogStyle {
        this.color = color ?? this.color;
        this.backgroundColor = backgroundColor ?? this.backgroundColor;
        return this;
    }
    
    /**
     * 设置边框
     * @param borderRadius 日志文字圆角
     * @param border 日志文字边框
     */
    public setBorder(borderRadius?:string, border?:string):LogStyle {
        this.borderRadius = borderRadius ?? this.borderRadius;
        this.border = border ?? this.border;
        return this;
    }

    /**
     * 设置文字
     * @param weight 日志文字粗细
     * @param family 日志文字字体
     */
    public setFont(weight?:string, family?:string):LogStyle {
        this.weight = weight ?? this.weight;
        this.family = family ?? this.family;
        return this;
    }

    /**
     * 设置文字大小
     * @param size 日志文字大小
     */
    public setSize(size?:string):LogStyle {
        this.size = size ?? this.size;
        return this;
    }

    /**
     * 设置内边距外边距
     * @param padding 内边距
     * @param margin 外边距
     */
    public setBlank(padding?:string, margin?:string):LogStyle {
        this.padding = padding ?? this.padding;
        this.margin = margin ?? this.margin;
        return this;
    }

    /**
     * 字符化转义样式
     */
    public stringify():string {
        let stringArr:string[] = [];

        this.color && stringArr.push(`color:${ this.color }`);
        this.backgroundColor  && stringArr.push(`background-color:${ this.backgroundColor }`);
        this.weight  && stringArr.push(`font-weight:${ this.weight }`);
        this.family  && stringArr.push(`font-family:${ this.family }`);
        this.borderRadius  && stringArr.push(`border-radius:${ this.borderRadius }`);
        this.border  && stringArr.push(`border:${ this.border }`);
        this.size  && stringArr.push(`font-size:${ this.size }`);
        this.padding  && stringArr.push(`padding:${ this.padding }`);
        this.margin  && stringArr.push(`margin:${ this.margin }`);

        return stringArr.join(";");
    }

    /**
     * 克隆一个新的 LogStyle
     */
    public clone():LogStyle {
        return new LogStyle()
            .setColor(this.color, this.backgroundColor)
            .setBorder(this.borderRadius, this.border)
            .setFont(this.weight, this.family)
            .setBlank(this.padding, this.margin)
            .setSize(this.size)
    }
}

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
export {LogLabel, LogStyle}