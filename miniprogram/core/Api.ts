import { Emitter, EventType } from "./Emitter";
import { API_FAILED_SHOW_MESSAGE } from "./Config";
import { Logger, LogLabel, LevelLogLabel, colorRadio, StatusLabel } from "./Logger";
interface IAppAPIParam {
    api: {

        /**
         * API 编号
         */
        nextId: number;

        /**
         * 请求池
         * 保存正在等待的 API 请求
         */
        pool: Set<API<IAnyData, IAnyData>>;
    }
}

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
         * 键值映射
         */
        mapKey?: string,
        
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

type SuccessCallbackResult<O extends IAnyData> = WechatMiniprogram.RequestSuccessCallbackResult<O>;
type GeneralCallbackResult = WechatMiniprogram.GeneralCallbackResult;

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

    /**
     * 请求发送前
     */
    request: IWxRequestOption<O>;

    /**
     * 成功回调
     */
    success: SuccessCallbackResult<O>;

    /**
     * 失败回调
     */
    fail: GeneralCallbackResult;

    /**
     * 完成回调
     */
    complete: GeneralCallbackResult;
}

/**
 * 输出事件类型
 */
type IAPIResultEvent<O extends IAnyData, U extends IAnyData> = {

    /**
     * 成功获取数据
     */
    ok: O,

    /**
     * 无论因为什么
     * 总之数据获取到
     */
    no: GeneralCallbackResult & U,

    /**
     * 完成了
     * 无论失败与否
     */
    done: { data?: O } & GeneralCallbackResult & U
}

/**
 * API 接口调用
 * @template I API 输入数据
 * @template O API 输出数据
 * @template E API 中的事件
 * @template U 用户自定义的输出数据
 */
class API<
    I extends IAnyData = IAnyData, 
    O extends IAnyData = IAnyData,
    E extends Record<EventType, any> = Record<EventType, any>,
    U extends IAnyData = IAnyData
> extends Emitter <
    {
        // 这个复杂的泛型是为了 MixIn 用户自定义事件类型
        // 懂得如何使用就可以了
        // 不要试图去理解下面这三行代码，真正的恶魔在等着你
        [P in (keyof (IAPIEvent<I, O> & IAPIResultEvent<O, U>) | keyof E)] : 
        P extends keyof IAPIEvent<I, O> ? IAPIEvent<I, O>[P] : 
        P extends keyof IAPIResultEvent<O, U> ? IAPIResultEvent<O, U>[P] : E[P]
    }
> {

    /**
     * 默认调试标签
     */
    public static defaultLogLabel:LogLabel = new LogLabel(
        `API:API`, colorRadio(200, 120, 222)
    );
    
    /**
     * 基础 URL
     * TODO: 这里可能涉及负载均衡
     */
    public baseUrl: string = "https://jwc.nogg.cn";

    /**
     * Logger 使用的标签
     */
    private LogLabel:LogLabel = API.defaultLogLabel;

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
     * 初始化标签
     */
    public initDebugLabel(key: string) {
        this.key = key;
        this.LogLabel = new LogLabel(
            `API:${ this.key }`, colorRadio(200, 120, 222)
        );

        // 添加 API 生命周期调试事件
        this.on("request", (data) => {
            Logger.logMultiple(
                [LevelLogLabel.InfoLabel, this.LogLabel, StatusLabel.Pending], 
                `请求发送中: `, data
            );
        })

        this.on("success", (data) => {
            Logger.logMultiple(
                [LevelLogLabel.InfoLabel, this.LogLabel, StatusLabel.Success], 
                `请求成功: `, data
            );
        })

        this.on("fail", (data) => {
            Logger.logMultiple(
                [LevelLogLabel.ErrorLabel, this.LogLabel, StatusLabel.Failed], 
                `请求失败: `, data.errMsg
            );
        })
    }

    /**
     * 初始化数据
     * 注意：data 是不安全的，请传入数据副本
     * @param data API需要的全部数据
     */
    public param(data?: Partial<I>):this {

        this.data = data;

        if (this.data === void 0) {
            Logger.log(`数据初始化异常: 没有输入 [data] 数据!`, 
            LevelLogLabel.ErrorLabel, this.LogLabel);
            return this;
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
                LevelLogLabel.ErrorLabel, this.LogLabel);
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
                        [LevelLogLabel.ErrorLabel, this.LogLabel],
                        `数据校验异常: [${ key }] 参数存在未知类型的 tester:`, tester
                    );
                }

                if (!testRes) {
                    Logger.logMultiple(
                        [LevelLogLabel.ErrorLabel, this.LogLabel],
                        `数据校验异常: [${ key }] 参数数据未通过自定义的 tester:`, data
                    );
                }
            }
        }

        // 触发数据初始化事件
        (this as Emitter<IAnyData>).emit("initData", this.data);

        // 重置请求数据
        const requestData:IWxRequestOption<O> = this.requestData = {
            url: this.baseUrl + this.url,
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
        (this as Emitter<IAnyData>).emit("parseRequestData", this.data);

        // 数据收集
        for (let key in this.params) {
            
            let data = this.data[key];
            let { isHeader, isTemplate, mapKey } = this.params[key];
            let useKey = mapKey ?? key;

            // 加载数据
            if (!isTemplate) {
                if (isHeader) {
                    requestData.header![useKey] = data;
                } else {
                    (requestData.data as IAnyData)[useKey] = data;
                }
            }
        }

        return this;
    }

    /**
     * 请求的唯一标识符
     */
    protected id:number = 0;

    /**
     * 将此请求加入到请求池
     */
    protected addPool():this {
        
        let app = getApp<IAppAPIParam>();
        if (app.api.pool.has(this as any)) {
            return this;
        }

        // 获取标识符
        if (!this.id) {
            this.id = app.api.nextId;
            app.api.nextId ++;
        }

        app.api.pool.add(this as any);
        return this;
    }

    /**
     * 从 pool 中移除
     */
    protected removePool():this {
        let app = getApp<IAppAPIParam>();
        app.api.pool.delete(this as any);
        return this;
    }

    /**
     * 寻找相似的请求
     */
    protected findSameAPI():API<IAnyData, IAnyData> | undefined {

        if (this.requestData === void 0) {
            Logger.log(`搜索相似请求异常: 没有收集 [requestData] 数据!`, 
            LevelLogLabel.ErrorLabel, this.LogLabel);
            return;
        }

        let app = getApp<IAppAPIParam>();
        let sameAPI:API<IAnyData, IAnyData> | undefined;

        // 判断 API 是否相似
        app.api.pool.forEach((api) => {
            if ((api as API | this) === this) return;
            if (!api.requestData) return;
            if (api.requestData!.url !== this.requestData!.url) return;
            if (api.requestData!.method !== this.requestData!.method) return;
            sameAPI = api;
        });

        return sameAPI;
    }

    /**
     * 标记此实例是否已被使用
     */
    private isUsed = false;

    /**
     * 请求策略
     */
    public policy:RequestPolicy = RequestPolicy.RequestAnyway;

    /**
     * 运行 API
     */
    public request():this {

        if (this.requestData === void 0) {
            Logger.log(`请求发送异常: 没有收集 [requestData] 数据!`, 
            LevelLogLabel.ErrorLabel, this.LogLabel);
            return this;
        }

        if (this.isUsed) {
            Logger.log(`请求发送异常: 此实例已经使用过了，请使用新实例操作`, 
            LevelLogLabel.ErrorLabel, this.LogLabel);
            return this;
        } else {
            this.isUsed = true;
        }
        
        // 加入请求池
        this.addPool();

        // 发起请求
        let request = () => {

            // 触发请求发送事件
            (this as Emitter<IAnyData>).emit("request", this.requestData!)

            wx.request<O>({
                ...this.requestData!,
                success: (e) => {
                    (this as Emitter<IAnyData>).emit("success", e);
                },
                fail: (e) => {
                    (this as Emitter<IAnyData>).emit("fail", e);
                },
                complete: (e) => {
                    (this as Emitter<IAnyData>).emit("complete", e);
                }
            });
        }

        if (this.policy !== RequestPolicy.RequestAnyway) {
            let lastAPI = this.findSameAPI();

            if (lastAPI) {

                // 被上次请求阻止
                if (this.policy === RequestPolicy.BlockByLastRequest) {
                    return this;
                }

                // 使用上次请求结果
                if (this.policy === RequestPolicy.useLastRequest) {
                    lastAPI.on("success", (e) => {
                        (this as Emitter<IAnyData>).emit("success", e as SuccessCallbackResult<O>);
                        (this as Emitter<IAnyData>).emit("complete", {errMsg: e.errMsg});
                    });
                    lastAPI.on("fail", (e) => {
                        (this as Emitter<IAnyData>).emit("fail", e);
                        (this as Emitter<IAnyData>).emit("complete", {errMsg: e.errMsg});
                    });
                }

                // 等待上次请求
                if (this.policy === RequestPolicy.waitLastRequest) {
                    lastAPI.on("success", () => request());
                    lastAPI.on("fail", () => request());
                }
            }
        } else {
            request();
        }

        // 监听请求完成后，从 pool 中移除，释放内存
        this.on("complete", () => {
            this.removePool();
        })

        return this;
    }

    /**
     * 等待结果
     */
    public waitRequest(): Promise<IRespondData<O>>;
    public waitRequest(callBack: ICallBack<O>): this;
    public waitRequest(callBack?: ICallBack<O>): Promise<IRespondData<O>> | this {
        
        // 存在 callback 使用传统回调
        if (callBack) {
            callBack.success && this.on("success", callBack.success);
            callBack.fail && this.on("fail", callBack.fail);
            callBack.complete && this.on("complete", callBack.complete);
            return this;
        } 
        
        // 不存在 callback 使用 Promise 对象
        else {
            return new Promise((r) => {
                this.on("success", r);
                this.on("fail", r);
            });
        }
    }

    public wait(): Promise<IAPIResultEvent<O, U>["done"]>;
    public wait(callBack: IResCallBack<O, U>): this;
    public wait(callBack?: IResCallBack<O, U>): Promise<IAPIResultEvent<O, U>["done"]> | this {

        // 存在 callback 使用传统回调
        if (callBack) {
            callBack.ok && this.on("ok", callBack.ok);
            callBack.no && this.on("no", callBack.no);
            callBack.done && this.on("done", callBack.done);
            return this;
        } 
        
        // 不存在 callback 使用 Promise 对象
        else {
            return new Promise((r) => {
                this.on("done", r);
            });
        }
    }

    /**
     * 请求加载时显示加载动画
     * @param message 消息 可以为函数
     * @param mask 使用蒙版阻止点击穿透
     */
    public showLoading(message: string | ((data?: Partial<I>) => string), mask: boolean = false): this {

        // 获取标题
        let title: string = message instanceof Function ? message(this.data) : message;
        
        this.on("request", () => {
            wx.showLoading({
                title, mask
            })
        });

        this.on("complete", () => {
            wx.hideLoading();
        });

        return this;
    };

    /**
     * 显示导航栏加载动画
     */
    public showNavigationBarLoading(): this {

        this.on("request", () => {
            wx.showNavigationBarLoading()
        });

        this.on("complete", () => {
            wx.hideNavigationBarLoading();
        });

        return this;
    }

    /**
     * 自动挂载失败回调
     */
    public addFailedCallBack(): this {
        this.on("fail", (e) => {
            (this as Emitter<IAnyData>).emit("no", e as any);
            (this as Emitter<IAnyData>).emit("done", e as any);
        });
        return this;
    }

    /**
     * 请求失败后的提示语句
     */
    public showFailed(): this {

        // 生成随机索引值
        let randomIndex = Math.floor( 
            Math.random() * API_FAILED_SHOW_MESSAGE.length
        );

        this.on("fail", () => {
            wx.showToast({
                title: API_FAILED_SHOW_MESSAGE[randomIndex], 
                icon: "none"
            });
        });

        return this;
    };
}

/**
 * 自动响应数据
 */
type IRespondData<O extends IAnyData> = Partial<IAPIEvent<IAnyData, O>["success"]> & IAPIEvent<IAnyData, O>["fail"];

/**
 * 回调对象
 */
interface ICallBack<O extends IAnyData> {
    success?: (data: IAPIEvent<{}, O>["success"]) => any;
    fail?: (data: IAPIEvent<{}, O>["fail"]) => any;
    complete?: (data: IAPIEvent<{}, O>["complete"]) => any;
}

interface IResCallBack<O extends IAnyData, U extends IAnyData> {
    ok?: (data: IAPIResultEvent<O, U>["ok"]) => any;
    no?: (data: IAPIResultEvent<O, U>["no"]) => any;
    done?: (data: IAPIResultEvent<O, U>["done"]) => any;
}

/**
 * Request 请求策略
 * 此策略用于节流
 */
enum RequestPolicy {

    /**
     * 什么都不管，发就完了
     */
    RequestAnyway = 1,

    /**
     * 如果存在等待中的相似请求
     * 等待相似请求结束后在发送
     */
    waitLastRequest = 2,

    /**
     * 如果存在等待中的相似请求
     * 阻止本次请求发送
     * 将相似请求的结果作为本次请求结果
     */
    useLastRequest = 3,

    /**
     * 如果存在等待中的相似请求
     * 阻止本次请求发送
     */
    BlockByLastRequest = 4
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
export { API, IParamSetting, IAppAPIParam, IAnyData, ICallBack, HTTPMethod, RequestPolicy, GeneralCallbackResult }