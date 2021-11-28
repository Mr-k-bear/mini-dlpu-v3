import { LogStyle } from "./LogStyle";
import { LogLabel } from "./LogLabel";
import { StackInfo } from "./StackInfo";

/**
 * 内部预定义的 LogLabel
 */
class InternalLogLabel {

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
        InternalLogLabel.normalStyle, false, true, true);
    }

    /**
     * 包含 URL 链接的 label
     */
    public static get urlLabel():LogLabel {

        // 获得调用堆栈
        let stack = StackInfo.getFirstStack();

        return new LogLabel(stack?.calcPathName() ?? "Unknown url", 
        InternalLogLabel.normalStyle, false, true, true);
    }

    /**
     * 仅仅用来 filter 的 URL 链接的 label
     */
    public static get filterUrlLabel():LogLabel {

        // 获得调用堆栈
        let stack = StackInfo.getFirstStack();

        return new LogLabel(stack?.calcPathName() ?? "Unknown url", 
        InternalLogLabel.normalStyle, true, false, true);
    }
    
}

export default InternalLogLabel;
export {InternalLogLabel};