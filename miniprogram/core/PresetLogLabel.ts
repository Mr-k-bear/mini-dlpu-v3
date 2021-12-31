import { LogLabel, LogStyle } from "./LogLabel";

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

export { 
    NormalStyle,
    StackInfo, 
    StackLogLabel,
    StatusLabel, 
    LevelLogLabel, 
    LifeCycleLogLabel, 
    normalLifeStyleGen as colorRadio,
};