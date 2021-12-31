// import { Logger } from "../logger/Logger";
import { LogStyle, LogLabel } from "./Logger";

/**
 * 测试结果
 */
class TestResult {
    
    /**
     * 用例名称
     */
    public caseName:string;

    /**
     * 测试结果
     */
    public result:boolean;

    /**
     * 消息
     */
    public message:string;

    /**
     * 附加消息
     */
    public attach:string;

    /**
     * 初始化
     * @param caseName 用例名称
     */
    constructor(caseName:string) {
        this.caseName = caseName;
        this.result = false;
        this.message = "";
        this.attach = "";
    }

    /**
     * 设置结果
     */
    public setResult(result:boolean, message?:string, attach?:string) {
        this.result = result;
        this.message = message ?? (result ? "success!" : "failed!");
        this.attach = attach ?? this.attach;

        return this;
    }
}

/**
 * 测试函数结构
 */
type TestFunction = () => TestResult | Promise<TestResult>;

/**
 * 收集测试函数结构
 */
class CaseCollect {

    /**
     * 用例键名
     */
    public key:string;

    /**
     * 用例测试函数
     */
    public caseFunction:TestFunction;

    /**
     * 测试结果
     */
    result: Promise<TestResult> | undefined;

    /**
     * @param key 测试用例键名
     * @param caseFunction 测试函数
     */
    public constructor(key:string, caseFunction:TestFunction) {
        this.key = key;
        this.caseFunction = caseFunction;
    }

    /**
     * 运行测试用例
     */
    public async runTestCase():Promise<CaseCollect> {
        
        let result = this.caseFunction();

        if(result instanceof Promise) {
            this.result = result;
        } else {
            this.result = Promise.resolve(result);
        }

        return this;
    }

    public static readonly baseStyle = new LogStyle().setBlank();

    public static readonly successLabel:LogLabel = new LogLabel("√",
        new LogStyle().setBlank("0 4px").setBorder("1000px", "1px solid green")
    );

    /**
     * 打印结果
     * @param current 当前进度
     * @param total 总进度
     */
    public printResult(current?:number, total?:number) {

        // 如果测试没有运行，先运行它
        if(this.result === void 0) this.runTestCase();

        this.result?.then((res) => {

            if(res.result) {
                console.log(
                    `%c√%c %c1/1%c %c${ this.key }%c ` + res.message, 
                    "padding:0 4px; border-radius:1000px; border:1px solid green; color:green",
                    "", "padding:0 4px; border-radius:4px; border:1px solid green; color:green",
                    "", "padding:0 4px; border-radius:4px; border:1px solid #979797; color:#979797",
                    ""
                )
            } else {
                console.log(
                    `%c√%c %c1/1%c %c${ this.key }%c ` + res.message, 
                    "padding:0 4px; border-radius:1000px; border:1px solid red; color:red",
                    "", "padding:0 4px; border-radius:4px; border:1px solid red; color:red",
                    "", "padding:0 4px; border-radius:4px; border:1px solid #979797; color:#979797",
                    ""
                )
            }
            console.log(res)
        })
    }

    /**
     * 收集测试用例
     * @param testCaseClass 测试用例表
     */
    public static collectCase(testCaseClass:ITestCase):CaseCollect[] {

        // 获取静态方法 key
        let key = Object.getOwnPropertyNames(testCaseClass);

        // 过滤掉通用的方法和属性
        key = key.filter((key) => !/(length|name|prototype)/.test(key) );

        // 生成 CaseCollect
        let caseCollect = [];
        
        for (let i = 0; i < key.length; i++) {
            caseCollect.push(new CaseCollect(key[i], testCaseClass[key[i]]))
        }

        return caseCollect;
    }

    /**
     * 运行测试样例
     */
    public static async runCollectCase(cases:CaseCollect[]):Promise<CaseCollect[]> {

        let running:Promise<CaseCollect>[] = [];

        for(let i = 0; i < cases.length; i++) {
            running.push(cases[i].runTestCase());
        }

        return Promise.all(running);
    }

    /**
     * 启动单元测试
     */
    public static runUnitTest(testCaseClass:ITestCase) {
        
        let caseCollect = this.collectCase(testCaseClass);

        CaseCollect.runCollectCase(caseCollect).then((caseCollect:CaseCollect[]) => {
            
            for(let i = 0; i < caseCollect.length; i++) {
                caseCollect[i].printResult()
            }
        })
    }
}

/**
 * 测试用例接口
 */
interface ITestCase {

    /**
     * 测试用例函数
     */
    [key:string]:TestFunction;
}

export default ITestCase;
export { ITestCase, TestResult, TestFunction, CaseCollect };