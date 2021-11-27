
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
    public static readonly excludeFile:RegExp = /^Logger\.js:\d+:\d+/;

    /**
     * 获取第一个调用栈
     */
    public static getFirstStack():StackInfo | undefined {

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

export default StackInfo;
export { StackInfo };