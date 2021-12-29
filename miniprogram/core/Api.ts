import mitt, { Emitter } from "./EventEmitter";
import { LogLabel } from "./LogLabel";
import { Logger } from "./Logger";
import { LevelLogLabel, colorRadio } from "./PresetLogLabel";

interface IAnyData {
    [x:string]: any
}

type IWxRequestOption<O> = WechatMiniprogram.RequestOption<O>;

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
         * ### 数据测试
         * 1、支持正则表达式测试 \
         * 2、支持使用 string === string 测试 \
         * 3、支持使用 number === number 测试 \
         * 4、支持使用自定义函数测试 
         */
        tester?: RegExp | ((data:T[P]) => boolean) | string | number,

        /**
         * ### 预解析函数
         * 1、此函数用来处理该键值 \
         * 2、当返回 undefined 时此键值被遗弃 \
         * 3、返回值时，此键值被覆盖
         * 
         * @param data 当前给定数据
         * @param key 当前给定数据键值
         * @param all 全部输入数据
         * @returns 解析结果
         */
        parse?: ((data:T[P], key:string, all:DeepReadonly<Partial<T>>) => T[P] | undefined),

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
 * API 事件
 */
type IAPIEvent<I extends IAnyData, O extends IAnyData> = {
    
    /**
     * 当数据初始化事件
     */
    initData: Partial<I>;

    /**
     * 请求数据解析完成后
     */
    parseRequestData: Partial<I>;
}

/**
 * 接口调用
 */
class API<I extends IAnyData, O extends IAnyData> {

    /**
     * 基础 URL
     * TODO: 这里可能涉及负载均衡
     */
    public static get baseUrl():string {
        return "https://xxx.xxx";
    }

    public static defaultLogLabel:LogLabel = new LogLabel(
        `API:API`, colorRadio(200, 120, 222)
    );

    /**
     * Logger 使用的标签
     */
    private LogLabel:LogLabel = API.defaultLogLabel;

    /**
     * 事件监听器
     */
    private emitter:Emitter<IAPIEvent<I, O>>;

    public get on() { return this.emitter.on };
    public get off() { return this.emitter.on };
    public get emit() { return this.emitter.emit };

    /**
     * Api 唯一 ID
     */
    public key:string = "API";

    /**
     * API url
     */
    public url:string = "/";

    /**
     * API 需要的参数列表
     */
    public params:IParamSetting<I> = {} as any;

    /**
     * API 需要的数据
     */
    public data?:Partial<I>;

    /**
     * 请求数据
     */
    public requestData?:IWxRequestOption<O>;

    //#region wx.request

    public timeout?:number;
    public method:HTTPMethod = HTTPMethod.GET;
    public enableHttp2:boolean = false;
    public enableQuic:boolean = false;
    public enableCache:boolean = false;
    
    /**
     * 是否自动解析返回的 json
     * 对应 wx.request 的 dataType
     */
    public jsonParse:boolean = true;

    //#endregion wx.request

    /**
     * 构造函数
     * 注意：data 是不安全的，请传入数据副本
     * @param data API需要的全部数据
     */
    public constructor(data?: Partial<I>) {
        this.data = data ?? {};
        this.emitter = mitt<IAPIEvent<I, O>>();
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

        if (this.data === void 0) {
            Logger.log(`数据初始化异常: 没有输入 [data] 数据!`, 
            LevelLogLabel.FatalLabel, this.LogLabel);
            return;
        }

        for (let key in this.params) {

            let data = this.data[key];
            let { defaultValue, Optional, tester } = this.params[key];

            // 默认值赋予
            if (data === void 0 && defaultValue !== void 0) {
                this.data[key] = defaultValue;
            }

            // 数据存在测试
            if (data === void 0 && !Optional) {
                Logger.log(`数据校验异常: 数据 [${key}] 是必须的，但是并没有接收到!`, 
                LevelLogLabel.FatalLabel, this.LogLabel);
            }

            // 用户自定义测试
            if (data !== void 0 && tester !== void 0) {
                let testRes:boolean = false;
                
                if (tester instanceof RegExp) {
                    testRes = tester.test(data!);
                } else if (typeof tester === "string" || typeof tester === "number") {
                    testRes = tester === data;
                } else if (tester instanceof Function) {
                    testRes = tester(data!);
                } else {
                    Logger.logMultiple(
                        [LevelLogLabel.FatalLabel, this.LogLabel],
                        `数据校验异常: [${ key }] 参数存在未知类型的 tester:`, tester
                    );
                }

                if (!testRes) {
                    Logger.logMultiple(
                        [LevelLogLabel.FatalLabel, this.LogLabel],
                        `数据校验异常: [${ key }] 参数数据未通过自定义的 tester:`, data
                    );
                }
            }
        }

        // 触发数据初始化事件
        this.emit("initData", this.data);
    }

    /**
     * 收集请求数据
     */
    public collectData() {

        if (this.data === void 0) {
            Logger.log(`收集请求数据异常: 没有输入 [data] 数据!`, 
            LevelLogLabel.FatalLabel, this.LogLabel);
            return;
        }

        // 重置请求数据
        const requestData:IWxRequestOption<O> = this.requestData = {
            url: API.baseUrl + this.url,
            data: {}, header: {},
            timeout: this.timeout,
            method: this.method,
            dataType: this.jsonParse ? "json" : undefined,
            enableHttp2: this.enableHttp2,
            enableQuic: this.enableQuic,
            enableCache: this.enableCache
        };

        // 数据解析
        for (let key in this.params) {

            let data = this.data[key];
            let { parse } = this.params[key];

            // 数据预解析
            if (parse !== void 0) {
                this.data[key] = parse(data!, key, this.data as DeepReadonly<Partial<I>>);
            }
        }

        // 触发数据解析
        this.emit("parseRequestData", this.data);

        // 数据收集
        for (let key in this.params) {
            
            let data = this.data[key];
            let { isHeader, isTemplate } = this.params[key];

            // 加载数据
            if (!isTemplate) {
                if (isHeader) {
                    requestData.header![key] = data;
                } else {
                    (requestData.data as IAnyData)[key] = data;
                }
            }
        }
    }
}

/**
 * HTTP 请求类型
 */
enum HTTPMethod {
    OPTIONS = "OPTIONS", 
    GET = "GET", 
    HEAD = "HEAD", 
    POST = "POST", 
    PUT = "PUT", 
    DELETE = "DELETE", 
    TRACE = "TRACE", 
    CONNECT = "CONNECT"
}

export default API;
export { API, IParamSetting }