import { LogLabel } from "./LogLabel";
import { Logger } from "./Logger";
import { LevelLogLabel, colorRadio } from "./PresetLogLabel";

interface IAnyData {
    [x:string]: any
}

type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

/**
 * 请求参数设置
 */
type IParamSetting<T extends IAnyData> = {
    [P in keyof T]: {
        
        /**
         * 默认值
         */
        defaultValue?: T[P],

        /**
         * 测试
         */
        tester?: RegExp | ((data:T[P]) => boolean) | string,

        /**
         * 预解析函数
         */
        parse?: ((data:T[P], key:string, all:DeepReadonly<Partial<T>>) => T[P]),

        /**
         * 是否为请求头数据
         */
        isHeader?: boolean,

        /**
         * 是否为模板
         */
        isTemplate?: boolean

        /**
         * 是否可选
         */
        Optional?: boolean
    }
}

/**
 * 接口调用
 */
class API<I extends IAnyData, O extends IAnyData> {

    public static defaultLogLabel:LogLabel = new LogLabel(
        `API:API`, colorRadio(200, 120, 222)
    );

    /**
     * Logger 使用的标签
     */
    private LogLabel:LogLabel = API.defaultLogLabel;

    /**
     * Api 唯一 ID
     */
    public key:string = "API";

    /**
     * API 需要的参数列表
     */
    public params:IParamSetting<I> = {} as any;

    /**
     * API 需要的数据
     */
    public data:Partial<I>;

    /**
     * 请求数据
     */
    public requestData:IAnyData = {} as any;

    /**
     * 构造函数
     * 注意：data 是不安全的，请传入数据副本
     * @param data API需要的全部数据
     */
    public constructor(data? :Partial<I>) {
        this.data = data ?? {};
    }

    /**
     * 初始化标签
     */
    public initLabel() {
        this.LogLabel = new LogLabel(
            `API:${ this.key }`, colorRadio(200, 120, 222)
        );
    }

    /**
     * 初始化数据
     */
    public initData() {
        for(let key in this.params) {

            let data = this.data[key];
            let { defaultValue, Optional, tester, parse } = this.params[key];

            // 默认值赋予
            if(data === void 0 && defaultValue !== void 0) {
                this.data[key] = defaultValue;
            }

            // 数据存在测试
            if(data === void 0 && !Optional) {
                Logger.log(`数据校验异常: 数据 [${key}] 是必须的，但是并没有接收到!`, 
                LevelLogLabel.FatalLabel, this.LogLabel);
            }

            // 用户自定义测试
            if(data !== void 0 && tester !== void 0) {
                let testRes:boolean = false;
                
                if(tester instanceof RegExp) {
                    testRes = tester.test(data!);
                } else if(typeof tester === "string") {
                    testRes = tester === data;
                } else if(tester instanceof Function) {
                    testRes = tester(data!);
                } else {
                    Logger.logMultiple(
                        [LevelLogLabel.FatalLabel, this.LogLabel],
                        `数据校验异常: [${ key }] 参数存在未知类型的 tester:`, tester
                    );
                }

                if(!testRes) {
                    Logger.logMultiple(
                        [LevelLogLabel.FatalLabel, this.LogLabel],
                        `数据校验异常: [${ key }] 参数数据未通过自定义的 tester:`, data
                    );
                }
            }

            // 数据预解析
            if(parse !== void 0 && data !== void 0) {
                this.data[key] = parse(data!, key, this.data as DeepReadonly<Partial<I>>);
            }
        }
    }

    /**
     * 收集请求数据
     */
    public collectData() {}
}

export default API;
export { API, IParamSetting }