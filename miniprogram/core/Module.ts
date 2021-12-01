import mitt, { Emitter, EventHandlerMap, EventType, Handler, WildcardHandler } from "./EventEmitter";
import { LogLabel, LogStyle } from "./LogLabel";
import { Logger } from "./Logger";
import { LevelLogLabel } from "./PresetLogLabel";

/**
 * 自定义对象类型
 */
type IAnyTypeObject<T = any> = {
    [x:string]: T;
};

// 微信 Data 类型
type Data<D> = WechatMiniprogram.Page.Data<D>;

// 微信生命周期类型
type ILifetime = WechatMiniprogram.Page.ILifetime;

// 继承的方法
type InstanceMethods<D> = WechatMiniprogram.Page.InstanceMethods<D>;

// 继承的属性
type InstanceProperties = WechatMiniprogram.Page.InstanceProperties;

/**
 * 定义微信微信上下文类型
 * 
 * @template TD data 结构类型
 * @template TC 用户 MinIn 类型
 * 
 * Partial<ILifetime> 可选的微信生命周期
 * Partial<Data<TD>> 可选的 data 结构
 * InstanceMethods<TD> 必选的微信继承方法
 * InstanceProperties 必选的微信继承属性
 */
type WXContext<TD, TC> = Partial<ILifetime> & Partial<Data<TD>> 
& InstanceMethods<TD> & InstanceProperties & TC;

/**
 * 任意的微信上下文
 * 当我们不关心具体是哪个上下文时
 * 使用这个类型
 */
type AnyWXContext = WXContext<IAnyTypeObject, IAnyTypeObject>;

/**
 * 依赖关系图谱
 * 注意: 这是一个递给类型
 * @template M 限制了所有依赖必须使用同一个 manager
 */
type Depends<M extends Manager<AnyWXContext>> = {
    [x:string]: Modular<M, Depends<M>>;
};

/**
 * 页面模组
 * @template M 所属 Manager
 * @template DEP 模组依赖
 * @template E 模组事件
 * @template TD 模组 Data 类型
 */
class Modular<
    M   extends Manager<AnyWXContext> = Manager<AnyWXContext>,
    DEP extends Depends<M> = Depends<M>,
    E   extends Record<EventType, unknown> = Record<EventType, unknown>,
    TD  extends IAnyTypeObject = IAnyTypeObject>
implements WXContext<TD, IAnyTypeObject>, Emitter<E> {

    // [x:string]: any;

    /**
     * 保存页面上下文
     */
    private manager:M;

    /**
     * 映射 Manager 上下文
     */
    private get context():M["context"] {
        return this.manager.context;
    }

    /**
     * 模组依赖
     */
    protected depends?:DEP

    /**
     * 模组数据
     */
    public data?:TD;

    /**
     * 模组使用的函数列表
     */
    public functionList:Set<string>;

    /**
     * 函数使用的参数列表
     */
    public paramList:Set<string>;

    /**
     * 命名空间
     */
    public nameSpace:string;

    // 映射主上下文属性
    public get is():string { return this.context.is };
    public get route():string { return this.context.route };
    public get options():Record<string, string | undefined> {
        return this.context.options;
    };
    
    /**
     * 一旦被类被构造，整个页面的全部申明周期将
     * 由该类实例控制，此后请勿修改任何生命周期函数
     * @param manager 页面上下文
     * @param nameSpace 模组命名空间
     * @param depend 模组依赖
     */
    public constructor(manager:M, nameSpace:string, depend?: DEP) {

        // 保存微信上下文
        this.manager = manager;

        // 保存模块依赖
        this.depends = depend;

        // 初始化内部属性
        this.functionList = new Set<string>();
        this.paramList = new Set<string>();
        this.nameSpace = nameSpace;

        this.emitter = mitt<E>();

    }

    /**
     * 内部事件控制器
     */
    private emitter:Emitter<E>;

    public get all():EventHandlerMap<E> { return this.emitter.all };

    on<Key extends keyof E>(type: Key, handler: Handler<E[Key]>): void;
    on(type: "*", handler: WildcardHandler<E>): void;
    on(type: any, handler: any): void {
        return this.emitter.on(type, handler);
    }

    off<Key extends keyof E>(type: Key, handler?: Handler<E[Key]>): void;
    off(type: "*", handler: WildcardHandler<E>): void;
    off(type: any, handler?: any): void {
        return this.emitter.off(type, handler);
    }

    emit<Key extends keyof E>(type: Key, event: E[Key]): void;
    emit<Key extends keyof E>(type: undefined extends E[Key] ? Key : never): void;
    emit(type: any, event?: any): void {
        return this.emitter.emit(type, event);
    }

    public setData(data:Partial<TD>, callback?: () => void):void {

        if(this.data === void 0) {
            this.data = {} as TD;
        }

        let reportData:IAnyTypeObject = {};

        for(let key in data) {
            (this.data as IAnyTypeObject)[key] = data[key];
            reportData[`${ this.nameSpace }$${ key }`] = data[key];
            this.paramList.add(key);
        }

        return this.context.setData(reportData, callback);
    }

    /**
     * 向上层上下文传递函数
     * @param fn 传递的函数
     * @param name 函数名字
     */
    public setFunc(fn:Function, name:string):void {

        this.functionList.add(name);
        (this.context as IAnyTypeObject)
        [`${ this.nameSpace }$${ name }`] = fn.bind(this);
    }

    //#region 映射微信的继承函数

    public hasBehavior(behavior: string): void {
        return this.context.hasBehavior(behavior);
    }
    
    public triggerEvent<DetailType>(name: string, detail?: DetailType, 
        options?: WechatMiniprogram.Component.TriggerEventOption): void {
        return this.context.triggerEvent<DetailType>(name, detail, options);
    }

    public createSelectorQuery(): WechatMiniprogram.SelectorQuery {
        return this.context.createSelectorQuery();
    }

    public createIntersectionObserver(options: WechatMiniprogram.CreateIntersectionObserverOption): 
        WechatMiniprogram.IntersectionObserver {
        return this.context.createIntersectionObserver(options);
    }

    public selectComponent(selector: string): WechatMiniprogram.Component.TrivialInstance {
        return this.context.selectComponent(selector);
    }

    public selectAllComponents(selector: string): WechatMiniprogram.Component.TrivialInstance[] {
        return this.context.selectAllComponents(selector);
    }

    public selectOwnerComponent(): WechatMiniprogram.Component.TrivialInstance {
        return this.context.selectOwnerComponent();
    }

    public getRelationNodes(relationKey: string): WechatMiniprogram.Component.TrivialInstance[] {
        return this.context.getRelationNodes(relationKey);
    }

    public groupSetData(callback?: () => void): void {
        return this.context.groupSetData(callback);
    }

    public getTabBar(): WechatMiniprogram.Component.TrivialInstance {
        return this.context.getTabBar();
    }

    public getPageId(): string {
        return this.context.getPageId();
    }

    public animate(selector: string, keyFrames: WechatMiniprogram.Component.KeyFrame[], 
        duration: number, callback?: () => void): void;
    public animate(selector: string, keyFrames: WechatMiniprogram.Component.ScrollTimelineKeyframe[], 
        duration: number, scrollTimeline: WechatMiniprogram.Component.ScrollTimelineOption): void;
    public animate(selector: any, keyFrames: any, duration: any, scrollTimeline?: any): void {
        return this.context.animate(selector, keyFrames, duration, scrollTimeline);
    }
    
    public clearAnimation(selector: string, callback: () => void): void;
    public clearAnimation(selector: string, options?: WechatMiniprogram.Component.ClearAnimationOptions,
            callback?: () => void): void;
    public clearAnimation(selector: any, options?: any, callback?: any): void {
        return this.context.clearAnimation(selector, options, callback);
    }

    public getOpenerEventChannel(): WechatMiniprogram.EventChannel {
        return this.context.getOpenerEventChannel();
    }

    //#endregion

}

/**
 * 页面控件
 * 用于管理页面的所有模组
 */
class Manager<WXC extends AnyWXContext = AnyWXContext> {

    /**
     * 微信生命周期
     */
    static readonly WxLifeCycle:(keyof ILifetime)[] = [
        "onShow", 
        "onReady", 
        "onHide", 
        "onUnload", 
        "onPullDownRefresh",
        "onReachBottom", 
        "onShareAppMessage", 
        "onShareTimeline",
        "onAddToFavorites",
        "onPageScroll", 
        "onResize", 
        "onTabItemTap"
    ]

    /**
     * 保存页面上下文
     */
    public context:WXC;

    /**
     * 一旦被类被构造，整个页面的全部申明周期将
     * 由该类实例控制，此后请勿修改任何生命周期函数
     */
    public constructor(context:WXC) {
 
        // 保存微信上下文
        this.context = context;
        
        // 初始化模组列表
        this.modules = [];
    }

    /**
     * 模组列表
     */
    public modules:Modular[];

    /**
     * 添加一个模块
     * @param mode 模块类
     * @param nameSpace 命名空间
     * @param depend 模块依赖
     * @returns 模块实例
     */
    public addModule<DEP extends Depends<this>, M extends Modular<this, DEP>>
    (mode: new (manager:Manager<WXC>, nameSpace:string, depend?:DEP) => M, 
    nameSpace:string, depend?:DEP):M {
        let mod = new mode(this, nameSpace, depend);
        this.modules.push(mod);
        return mod;
    }

    /**
     * 创建指定生命周期的钩子
     * @param key 生命周期键值
     */
    public creatHooks(key:keyof ILifetime):(...arg: any[]) => Promise<any> {
        return async (...arg: any[]) => {

            let hooks:Promise<any>[] = [];

            for(let i = 0; i < this.modules.length; i++) {

                let fn:Function = (this.modules[i] as IAnyTypeObject)[key];

                if(fn === void 0) continue;
                let res: Promise<any> | any = fn.apply(this.modules[i], arg);
                
                if (res instanceof Promise) {
                    hooks.push(res);
                } else {
                    hooks.push(Promise.resolve(res));
                }
            }

            if (
                key === "onShareAppMessage" || 
                key === "onShareTimeline" || 
                key === "onAddToFavorites"
            ) {
                
                // 如果返回值有特殊含义在处理时进行 MinIn
                return Promise.all(hooks).then((res) => {

                    let simple:IAnyTypeObject = {};

                    for(let i = 0; i < res.length; i++) {
                        simple = Object.assign({}, simple, res);
                    }

                    return Promise.resolve(simple);
                })
                
            }

            return Promise.all(hooks);
        }
    }

    /**
     * 创建全部生命周期钩子
     */
    public creatAllHooks() {
        for(let i = 0; i < Manager.WxLifeCycle.length; i++) {
            (this.context as IAnyTypeObject)[Manager.WxLifeCycle[i]] = 
            this.creatHooks(Manager.WxLifeCycle[i]);
        }
    }

    /**
     * 加载全部的模块
     * @param query onLoad 接收的参数
     */
    public loadAllModule(query:Record<string, string | undefined>) {

        // 创建全部钩子
        this.creatAllHooks();

        // 加载全部模组数据
        for(let i = 0; i < this.modules.length; i++) {

            if(this.modules[i].data)
            for(let key in this.modules[i].data) {

                if(this.context.data === void 0) this.context.data = {};

                if(this.modules[i].data !== void 0) {
                    this.context.data[`${ this.modules[i].nameSpace }$${ key }`] = 
                    ( this.modules[i].data as IAnyTypeObject )[key];
                    // this.modules[i]
                }
            }
        }

        // 将全部数据发布到视图层
        if(this.context.data !== void 0)
        this.context.setData(this.context.data);

        // 调用全部模块的 onLoad 周期
        let res = this.creatHooks("onLoad")(query as any); 

        // 打印每个模块的键值对使用情况
        for(let i = 0; i < this.modules.length; i++) {
            let data:string[] = [];
            let func:string[] = [];

            for(let key of this.modules[i].paramList) {
                data.push(`[${ key }]`);
            }

            for(let key of this.modules[i].functionList) {
                func.push(`[${ key }]`);
            }

            let log:string = `模块 [${ this.modules[i].nameSpace }] 加载完成...\n`;
            if(data.length > 0) log += `Using Props: ${ data.join(", ") }\n`;
            if(func.length > 0) log += `Using Function: ${ func.join(", ") }\n`;
            
            Logger.log(log, LevelLogLabel.TraceLabel, Manager.AddModuleLabel);
        }

        return res;
    }

    /**
     * 模块被添加时的标签
     */
    public static readonly AddModuleLabel = new LogLabel("addModule", 
        new LogStyle().setBorder("4px", `1px solid #8600FF`)
        .setColor("#FF00FF", "rgba(54, 0, 255, .2)").setBlank("0 5px")
    )

    /**
     * 加载 Manager 控件 
     * @param fn 约束后调用的函数用来添加模块
     */
    public static Page(fn:(manager:Manager<AnyWXContext>) => void) {
        Page({
            async onLoad(query) {
                let manager = new Manager(this);
                fn(manager);
                manager.loadAllModule(query);
            }
        })
    }

}

export { Manager, Modular, AnyWXContext, WXContext, ILifetime}