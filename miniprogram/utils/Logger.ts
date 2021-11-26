import {LOGGER_CONSOLE, LOGGER_FILTER} from "./Config";

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
     * 设置颜色
     * @param color 日志文字颜色
     * @param backgroundColor 日志背景颜色
     */
    public setColor(color:string, backgroundColor?:string):LogStyle {
        this.color = color;
        this.backgroundColor = backgroundColor;
        return this;
    }
    
    /**
     * 设置边框
     * @param borderRadius 日志文字圆角
     * @param border 日志文字边框
     */
    public setBorder(borderRadius:string, border?:string):LogStyle {
        this.borderRadius = borderRadius;
        this.border = border;
        return this;
    }

    /**
     * 设置文字
     * @param weight 日志文字粗细
     * @param family 日志文字字体
     */
    public setFont(weight:string, family:string):LogStyle {
        this.weight = weight;
        this.family = family;
        return this;
    }

    /**
     * 设置文字大小
     * @param size 日志文字大小
     */
    public setSize(size:string):LogStyle {
        this.size = size;
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

        stringArr.push(`margin-bottom:5px`);

        return stringArr.join(";");
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
     * @param key 关键字
     * @param style 文字样式
     */
    constructor(key:string, style:LogStyle) {
        this.key = key;
        this.style = style;
    }

    /**
     * 获得 Logger 输出使用的内容
     */
    public getLoggerOutput():string {
        return `%c ${ this.key } `;
    }

    /**
     * 获得 Text 输出内容
     */
    public getTextOutput():string {
        return `[${ this.key }]`;
    }

    /**
     * 获得 style 格式化
     */
    public getStyleOutput():string {
        return this.style.stringify();
    }
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

    public setInfo(functionName:string, fileName:string, url:string):StackInfo {
        this.functionName = functionName;
        this.fileName = fileName;
        this.url = url;
        return this;
    }

    /**
     * 获取函数调用栈列表
     */
    static getCallStack():StackInfo[] {

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
                matcher[1], fileName[1], matcher[2]
            ))
        }

        return callStack;
    }

    /**
     * 排除的
     */
    static readonly excludeFile:RegExp = /^Logger\.js:\d+:\d+/;

    /**
     * 获取第一个调用栈
     */
    static getFirstStack():StackInfo | undefined {

        let callStack = this.getCallStack();

        for(let i = 0; i < callStack.length; i++) {

            if(!callStack[i].fileName) continue;

            if(!StackInfo.excludeFile.test(callStack[i].fileName ?? "")) {
                return callStack[i];
            }
        }

        return;
    }
}

/**
 * 多重内容捆绑
 * 用于 log 输出
 */
class MultipleLogContent {
    
    /**
     * 输出内容
     */
    private content:any[];
    
    /**
     * @param content 输出内容
     */
    public constructor(...content:any[]) {
        this.content = content;
    }

    /**
     * 获取内容
     */
    public getContent():any[] {
        return this.content;
    }
}

/**
 * 格式化日志输出
 */
class Logger {

    /**
     * 堆栈路径样式
     */
    static readonly pathStyle:LogStyle = new LogStyle().setColor("#CCCCCC");
    
    /**
     * 标签过滤
     */
    static filterLog(filter:Array<RegExp | string>, labels:LogLabel[]):boolean {

        let passNum:number = 0;

        for(let i = 0; i < filter.length; i++) {

            let pass:boolean = false;
            for(let j = 0; j < labels.length; j++) {

                if(filter[i] instanceof RegExp) {
                    pass = (filter[i] as RegExp).test(labels[j].key)
                } else {
                    pass = (filter[i] as String) === labels[j].key;
                }

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
    static testLog(...labels:LogLabel[]):boolean {

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
     * 
     * @param styledLabel calcStyle的处理结果
     */
    static addFileNameLabel():LogLabel {

        // 获得调用堆栈
        let stack = StackInfo.getFirstStack();

        return new LogLabel(stack?.fileName ?? "", Logger.pathStyle);
    }

    /**
     * 收集计算样式
     * @param labels 使用标签
     */
    static calcStyle(...labels:LogLabel[]):[string[], string[]] {

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
     * 调试输出
     * @param content 输出内容
     * @param label 使用标签
     */
    static log<T>(content:T, ...labels:LogLabel[]):T {

        let fileNameLabel = Logger.addFileNameLabel();

        if(!Logger.testLog(...labels, fileNameLabel)) return content;

        let styledLabel = Logger.calcStyle(...labels);

        console.log(
            styledLabel[0].join("") + fileNameLabel.getLoggerOutput(), 
            ...[...styledLabel[1], fileNameLabel.getStyleOutput()],
            content
        );

        return content;
    }

    /**
     * 多重调试输出
     * @param labels 输出内容
     * @param content 使用标签
     */
    static logM<T>(labels:LogLabel[], ...content:T[]):T[] {
        return Logger.log<T[]>(content, ...labels);
    }
}

export default Logger;
export {Logger, LogStyle, LogLabel}