import {LOGGER_CONSOLE, LOGGER_FILTER} from "../Config";
import { InternalLogLabel } from "./InternalLogLabel";
import { LogLabel } from "./LogLabel";
import { MultipleLogContent } from "./MultipleLogContent";

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

        // 过滤出需要显示的 Labels
        let labelsNeedRender:LogLabel[] = labels.filter((label:LogLabel)=>{
            return label.display
        });

        let consoleLabels:string[] = [];
        let consoleStyles:string[] = [];

        // 放置标签
        for(let i = 0; i < labelsNeedRender.length; i++) {
            consoleLabels.push(labels[i].getLoggerOutput());

            if (i !== ( labelsNeedRender.length - 1))
            consoleLabels.push("%c ");

            consoleStyles.push(labelsNeedRender[i].getStyleOutput());

            if (i !== ( labelsNeedRender.length - 1))
            consoleStyles.push("");
        }

        return [consoleLabels, consoleStyles];
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
        if(!Logger.testLog(...labels, ...attachLabel, InternalLogLabel.filterUrlLabel)) 
        return content.getContent();

        // 计算收集样式
        let [consoleLabels, consoleStyles]= Logger.calcStyle(...labels, ...attachLabel);

        // 调试输出
        console.log(consoleLabels.join(""), ...consoleStyles, ...content.getContent());

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
            [InternalLogLabel.fileNameLabel]
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
            [InternalLogLabel.fileNameLabel]
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
            [InternalLogLabel.urlLabel, InternalLogLabel.blankLabel]
        )[0];
    }

    /**
     * 函数 Logger.logMultiple 的别名
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
            [InternalLogLabel.urlLabel, InternalLogLabel.blankLabel]
        );
    }

    /**
     * 函数 Logger.logLineMultiple 的别名
     */
    public static lm:typeof Logger.logLineMultiple = Logger.logLineMultiple;

}

export default Logger;
export { Logger };