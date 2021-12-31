import { LOGGER_FILTER, LOGGER_CONSOLE, LOGGER_STYLE } from "./Config";

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

/**
 * 多重内容捆绑
 * 用于 log 输出
 */
class MultipleLogContent<T extends Array<any>> {
    
    /**
     * 输出内容
     */
    private readonly content:T;
    
    /**
     * @param content 输出内容
     */
    public constructor(...content:T) {
        this.content = content;
    }

    /**
     * 获取内容
     */
    public getContent():T {
        return this.content;
    }
}

/**
 * 格式化日志输出
 */
class Logger {
    
    /**
     * 标签过滤
     */
    public static filterLog(filter:Array<RegExp | string>, labels:LogLabel[]):boolean {

        let passNum:number = 0;

        for(let i = 0; i < filter.length; i++) {

            let pass:boolean = false;
            for(let j = 0; j < labels.length; j++) {

                pass = labels[j].checking(filter[i]);
                if(pass) break;
            }

            if(pass) passNum ++;
        }

        return passNum === filter.length;
    }

    /**
     * 检测是否应该输出
     * @param labels 使用标签
     */
    public static testLog(...labels:LogLabel[]):boolean {

        if(!LOGGER_CONSOLE) return false;

        let isLogging = false;
        for(let i = 0; i < LOGGER_FILTER.length; i++) {
            
            // 判断是否进行输出
            isLogging = Logger.filterLog(LOGGER_FILTER[i], labels);

            if(isLogging) break;
        }

        return isLogging;
    }

    /**
     * 收集计算样式
     * @param labels 使用标签
     */
    public static calcStyle(...labels:LogLabel[]):[string[], string[]] {

        let consoleLabels:string[] = [];
        let consoleStyles:string[] = [];

        // 放置标签
        for(let i = 0; i < labels.length; i++) {
            consoleLabels.push(labels[i].getLoggerOutput());

            if (i !== ( labels.length - 1))
            consoleLabels.push("%c ");

            consoleStyles.push(labels[i].getStyleOutput());

            if (i !== ( labels.length - 1))
            consoleStyles.push("");
        }

        return [consoleLabels, consoleStyles];
    }

    /**
     * 收集计算标签没有样式
     * @param labels 标签
     */
    public static calcLabel(...labels:LogLabel[]):string[] {

        let consoleLabels:string[] = [];

        // 放置标签
        for(let i = 0; i < labels.length; i++) {
            consoleLabels.push(labels[i].getTextOutput());
        }

        return consoleLabels
    }

    /**
     * 基础调试输出
     * 其他的 Log 函数都是基于此封装
     * @param content 输出内容
     * @param label 使用标签
     * @param attachLabel 附加标签
     */
    public static logBase<T extends Array<any>>
    (content:MultipleLogContent<T>, labels:LogLabel[], attachLabel:LogLabel[] = []):T {

        // TODO: 这里可以添加一些钩子作为中间件处理日志输出

        // 测试是否输出内容
        if(!Logger.testLog(...labels, ...attachLabel, StackLogLabel.filterUrlLabel)) 
        return content.getContent();

        // 过滤出需要渲染的 Labels
        let labelsNeedRender:LogLabel[] = [...labels, ...attachLabel].filter((label:LogLabel)=>{
            return true
        });

        // 使用样式输出
        if(LOGGER_STYLE) {

            // 计算收集样式
            let [consoleLabels, consoleStyles]= Logger.calcStyle(...labelsNeedRender);

            // 调试输出
            console.log(consoleLabels.join(""), ...consoleStyles, ...content.getContent());
        
        } else {

            // 计算收集标签
            let consoleLabels= Logger.calcLabel(...labelsNeedRender);

            // 输出
            console.log(consoleLabels.join(" "), ...content.getContent());
        }

        

        return content.getContent();
    }

    /**
     * 调试输出
     * @param content 输出内容
     * @param label 使用标签
     */
    public static log<T>(content:T, ...labels:LogLabel[]):T {
        return Logger.logBase<Array<T>>(
            new MultipleLogContent<Array<T>>(content), labels, 
            [StackLogLabel.fileNameLabel]
        )[0];
    }

    /**
     * 函数 Logger.log 的别名
     */
    public static l:typeof Logger.log = Logger.log;

    /**
     * 多重调试输出
     * @param labels 输出内容
     * @param content 使用标签
     */
    public static logMultiple<T extends Array<any>>(labels:LogLabel[], ...content:T):T {
        return Logger.logBase<T>(
            new MultipleLogContent<T>(...content), labels, 
            [StackLogLabel.fileNameLabel]
        );
    }

    /**
     * 函数 Logger.logMultiple 的别名
     */
    public static m:typeof Logger.logMultiple = Logger.logMultiple;

    /**
     * 在下一行调试输出
     * @param content 输出内容
     * @param label 使用标签
     */
    public static logLine<T>(content:T, ...labels:LogLabel[]):T {
        return Logger.logBase<Array<T>>(
            new MultipleLogContent<Array<T>>(content), labels, 
            [StackLogLabel.fileNameLabel, StackLogLabel.blankLabel]
        )[0];
    }

    /**
     * 函数 Logger.logLine 的别名
     */
    public static ll:typeof Logger.logLine = Logger.logLine;

    /**
     * 在下一行多重调试输出
     * @param labels 输出内容
     * @param content 使用标签
     */
    public static logLineMultiple<T extends Array<any>>(labels:LogLabel[], ...content:T):T {
        return Logger.logBase<T>(
            new MultipleLogContent<T>(...content), labels, 
            [StackLogLabel.fileNameLabel, StackLogLabel.blankLabel]
        );
    }

    /**
     * 函数 Logger.logLineMultiple 的别名
     */
    public static lm:typeof Logger.logLineMultiple = Logger.logLineMultiple;

}

/**
 * 栈信息
 */
 class StackInfo {

    /**
     * 函数名
     */
    public functionName:string | undefined;
    
    /**
     * 文件名
     */
    public fileName:string | undefined;

    /**
     * 文件路径
     */
    public url:string | undefined;

    /**
     * 文件名和行号
     */
    public fileNameLine: string | undefined;    

    /**
     * 设置信息
     * @param functionName 函数名
     * @param fileName 文件名
     * @param url 文件路径
     */
    public setInfo(functionName:string, fileNameLine:string, url:string):StackInfo {
        this.functionName = functionName;
        this.fileNameLine = fileNameLine;
        this.url = url;
        return this;
    }

    /**
     * 计算文件名
     */
    public calcFileName():string | undefined {

        let replaceToTs = this.fileNameLine?.replace(".js", ".ts");
        let matched = replaceToTs?.match(/^(.+\.(js|ts)):\d+:\d+$/);

        return matched ? matched[1] : undefined;
    }

    /**
     * 计算路径名
     */
    public calcPathName():string | undefined {

        let replaceToTs = this.url?.replace(".js", ".ts");
        let matched = replaceToTs?.match(/^https?:\/\/(\d+\.){3}\d+:\d+\/(.+):\d+:\d+$/);

        return matched ? matched[2] : undefined;
    }

    /**
     * 获取函数调用栈列表
     */
    public static getCallStack():StackInfo[] {

        // 获取堆栈信息
        let stack:string | undefined = new Error().stack;

        if (stack === void 0) return [];

        // 去除 Error
        stack = stack.replace(/^(Error)\s/, "");

        // 获取堆栈信息
        let stackList:string[] = stack.split(/\n/);

        let callStack:StackInfo[] = [];

        for(let i = 0; i < stackList.length; i++) {

            let matcher = stackList[i].match(/^\s+at\s+(.+)\s(\(.+\))/);
            if (matcher === null || matcher.length < 3) continue;

            let fileName = matcher[2].match(/.+\/(.+\..+:\d+:\d+)\)/);
            if (fileName === null || matcher.length < 2) continue;

            callStack.push(new StackInfo().setInfo(
                matcher[1], fileName[1], matcher[2]?.replace(/(\(|\))/g, "")
            ))
        }

        // console.log(callStack);

        return callStack;
    }

    /**
     * 排除的
     */
    public static readonly excludeFile:RegExp = /^.*(\\|\/)core(\\|\/)(.*Log.*).js:\d+:\d+/;

    /**
     * 获取第一个调用栈
     */
    public static getFirstStack():StackInfo | undefined {

        let callStack = this.getCallStack();

        for(let i = 0; i < callStack.length; i++) {

            if(!callStack[i].url) continue;

            if(!StackInfo.excludeFile.test(callStack[i].url ?? "")) {
                return callStack[i];
            }
        }

        return;
    }
}

/**
 * 内部预定义的 LogLabel
 */
class StackLogLabel {

    /**
     * 堆栈路径样式
     */
    public static readonly normalStyle:LogStyle = new LogStyle()
    .setColor("#979797").setBorder("4px", "1px solid #979797").setBlank("0 5px");

    /**
     * 一个回车
     */
    public static readonly blankLabel = new LogLabel("\n\r", 
    new LogStyle(), false, true, true);

    /**
     * 包含文件名和行号的 label
     */
    public static get fileNameLabel():LogLabel {

        // 获得调用堆栈
        let stack = StackInfo.getFirstStack();

        return new LogLabel(stack?.calcFileName() ?? "Unknown file name", 
        StackLogLabel.normalStyle, false, true, true);
    }

    /**
     * 包含 URL 链接的 label
     */
    public static get urlLabel():LogLabel {

        // 获得调用堆栈
        let stack = StackInfo.getFirstStack();

        return new LogLabel(stack?.calcPathName() ?? "Unknown url", 
        StackLogLabel.normalStyle, false, true, true);
    }

    /**
     * 仅仅用来 filter 的 URL 链接的 label
     */
    public static get filterUrlLabel():LogLabel {

        // 获得调用堆栈
        let stack = StackInfo.getFirstStack();

        return new LogLabel(stack?.calcPathName() ?? "Unknown url", 
        StackLogLabel.normalStyle, true, false, true);
    }
    
}

/**
 * 生成圆角颜色标签样式
 */
const normalLevelStyleGen = (color:string):LogStyle => {
    return new LogStyle().setBorder("4px", `1px solid ${color}`)
    .setColor(color).setBlank("0 5px");
}

/**
 * 调试等级标签
 */
class LevelLogLabel {

    /**
     * 致命
     */
    static readonly FatalLabel = new LogLabel(
        "FATAL", normalLevelStyleGen("#FF00CC")
    );

    /**
     * 错误
     */
    static readonly ErrorLabel = new LogLabel(
        "ERROR", normalLevelStyleGen("#FF0000")
    );

    /**
     * 警告
     */
    static readonly WarnLabel = new LogLabel(
        "WARN", normalLevelStyleGen("#FF9900")
    );

    /**
     * 消息
     */
    static readonly InfoLabel = new LogLabel(
        "INFO", normalLevelStyleGen("#99FF00")
    );

    /**
     * 调试
     */
    static readonly DebugLabel = new LogLabel(
        "DEBUG", normalLevelStyleGen("#00FF99")
    );

    /**
     * 追踪
     */
    static readonly TraceLabel = new LogLabel(
        "TRACE", normalLevelStyleGen("#00CCFF")
    );
}

/**
 * 生成圆角颜色标签样式
 */
const normalLifeStyleGen = (r:number, g:number, b:number):LogStyle => {
    return new LogStyle().setBorder("4px", `1px solid rgb(${ r }, ${ g }, ${ b })`)
    .setColor(`rgb(${ r }, ${ g }, ${ b })`, `rgba(${ r }, ${ g }, ${ b }, .1)`)
    .setBlank("0 5px");
}

/**
 * 生命周期标签
 */
class LifeCycleLogLabel {

    /**
     * 小程序加载时
     */
    static readonly OnLaunchLabel = new LogLabel(
        "onLaunch", normalLifeStyleGen(160, 32, 240)
    );

    /**
     * 生命周期函数--监听页面加载
     */
    static readonly OnLoadLabel = new LogLabel(
        "onLoad", normalLifeStyleGen(255, 140, 105)
    );

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    static readonly OnReadyLabel = new LogLabel(
        "onReady", normalLifeStyleGen(255, 127, 36)
    );

    /**
     * 生命周期函数--监听页面显示
     */
    static readonly OnShowLabel = new LogLabel(
        "onShow", normalLifeStyleGen(255, 215, 0)
    )

    /**
     * 生命周期函数--监听页面隐藏
     */
    static readonly OnHideLabel = new LogLabel(
        "onHide", normalLifeStyleGen(173, 255, 47)
    );

    /**
     * 生命周期函数--监听页面卸载
     */
    static readonly OnUnloadLabel = new LogLabel(
        "onUnload", normalLifeStyleGen(127, 255, 212)
    );

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    static readonly OnPullDownRefreshLabel = new LogLabel(
        "onPullDownRefresh", normalLifeStyleGen(0, 191, 255)
    );

    /**
     * 页面上拉触底事件的处理函数
     */
    static readonly OnReachBottomLabel = new LogLabel(
        "onReachBottom", normalLifeStyleGen(84, 255, 159)
    );

    /**
     * 用户点击右上角分享
     */
    static readonly OnShareAppMessageLabel = new LogLabel(
        "onShareAppMessage", normalLifeStyleGen(147, 112, 219)
    );
}

class StatusLabel {

    /**
     * 等待
     */
    static readonly Pending = new LogLabel(
        "◉", new LogStyle().setBlank("0 2px").setBorder("1000px", "1px solid lightblue").setColor("lightblue")
    );

    /**
     * 成功
     */
    static readonly Success = new LogLabel(
        "√", new LogStyle().setBlank("0 4px").setBorder("1000px", "1px solid lightgreen").setColor("lightgreen")
    );

    /**
     * 失败
     */
    static readonly Failed = new LogLabel(
        "×", new LogStyle().setBlank("0 4px").setBorder("1000px", "1px solid red").setColor("red")
    );
}

const NormalStyle = StackLogLabel.normalStyle;

export default Logger;
export { 
    Logger, LogLabel, LevelLogLabel, StackLogLabel, LifeCycleLogLabel, LogStyle,
    StackInfo, StatusLabel, NormalStyle, normalLifeStyleGen as colorRadio
};