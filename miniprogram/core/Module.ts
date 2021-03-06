import { Emitter } from "./Emitter";
import { Logger, LogLabel, colorRadio, LevelLogLabel } from "./Logger";

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
 * 微信继承的函数
 */
class WXInstanceMethods<
    E extends IAnyTypeObject = IAnyTypeObject,
    W extends AnyWXContext = AnyWXContext
> 
extends Emitter<E>
implements InstanceMethods<W["data"]> {

    public superContext: W;

    public constructor(context: W) {
        super();
        this.superContext = context;
    }

    public setData(data: Partial<W["data"]> & WechatMiniprogram.IAnyObject, callback?: () => void): void {
        return this.superContext.setData(data, callback);
    }

    public hasBehavior(behavior: string): void {
        return this.superContext.hasBehavior(behavior);
    }

    public triggerEvent<DetailType = any>(name: string, detail?: DetailType, options?: WechatMiniprogram.Component.TriggerEventOption): void {
        return this.superContext.triggerEvent(name, detail, options)
    }

    public createSelectorQuery(): WechatMiniprogram.SelectorQuery {
        return this.superContext.createSelectorQuery();
    }
    
    public createIntersectionObserver(options: WechatMiniprogram.CreateIntersectionObserverOption): WechatMiniprogram.IntersectionObserver {
        return this.superContext.createIntersectionObserver(options);
    }

    public selectComponent(selector: string): WechatMiniprogram.Component.TrivialInstance {
        return this.superContext.selectComponent(selector);
    }

    public selectAllComponents(selector: string): WechatMiniprogram.Component.TrivialInstance[] {
        return this.superContext.selectAllComponents(selector);
    }

    public selectOwnerComponent(): WechatMiniprogram.Component.TrivialInstance {
        return this.superContext.selectOwnerComponent();
    }

    public getRelationNodes(relationKey: string): WechatMiniprogram.Component.TrivialInstance[] {
        return this.superContext.getRelationNodes(relationKey);
    }

    public groupSetData(callback?: () => void): void {
        return this.superContext.groupSetData(callback);
    }

    public getTabBar(): WechatMiniprogram.Component.TrivialInstance {
        return this.superContext.getTabBar();
    }

    public getPageId(): string {
        return this.superContext.getPageId();
    }

    public animate(selector: string, keyFrames: WechatMiniprogram.Component.KeyFrame[], duration: number, callback?: () => void): void;
    public animate(selector: string, keyFrames: WechatMiniprogram.Component.ScrollTimelineKeyframe[], duration: number, 
        scrollTimeline: WechatMiniprogram.Component.ScrollTimelineOption): void;
    public animate(selector: any, keyFrames: any, duration: any, scrollTimeline?: any): void {
        return this.superContext.animate(selector, keyFrames, duration, scrollTimeline);
    }

    public clearAnimation(selector: string, callback: () => void): void;
    public clearAnimation(selector: string, options?: WechatMiniprogram.Component.ClearAnimationOptions, callback?: () => void): void;
    public clearAnimation(selector: any, options?: any, callback?: any): void {
        return this.superContext.clearAnimation(selector, options, callback);
    }

    public getOpenerEventChannel(): WechatMiniprogram.EventChannel {
        return this.superContext.getOpenerEventChannel();
    }
}

/**
 * 微信继承的属性
 */
class WXInstanceProperties<
    E extends IAnyTypeObject = IAnyTypeObject,
    W extends AnyWXContext = AnyWXContext
>
extends WXInstanceMethods<E, W>
implements InstanceProperties {

    public override superContext: W;

    constructor(context: W) {
        super(context);
        this.superContext = context;
    }

    public get is(): string { return this.superContext.is };

    public get route(): string { return this.superContext.route };

    public get options(): Record<string, string | undefined> { return this.superContext.options };
}

class WXILifetime<
    E extends IAnyTypeObject = IAnyTypeObject,
    W extends AnyWXContext = AnyWXContext
>
extends WXInstanceProperties<E, W>
implements ILifetime {

    public onLoad(query: Record<string, string | undefined>): void | Promise<void> {};

    public onShow(): void | Promise<void> {};

    public onReady(): void | Promise<void> {};

    public onHide(): void | Promise<void> {};

    public onUnload(): void | Promise<void> {};

    public onPullDownRefresh(): void | Promise<void> {};

    public onReachBottom(): void | Promise<void> {};

    public onShareAppMessage(options: WechatMiniprogram.Page.IShareAppMessageOption): void | WechatMiniprogram.Page.ICustomShareContent {};

    public onShareTimeline(): void | WechatMiniprogram.Page.ICustomTimelineContent {};

    public onPageScroll(options: WechatMiniprogram.Page.IPageScrollOption): void | Promise<void> {};

    public onTabItemTap(options: WechatMiniprogram.Page.ITabItemTapOption): void | Promise<void> {};

    public onResize(options: WechatMiniprogram.Page.IResizeOption): void | Promise<void> {};
    
    public onAddToFavorites(options: WechatMiniprogram.Page.IAddToFavoritesOption): WechatMiniprogram.Page.IAddToFavoritesContent {
        return {};
    };
}

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
    E   extends IAnyTypeObject = IAnyTypeObject,
    TD  extends IAnyTypeObject = IAnyTypeObject
>
extends WXILifetime<E, M["context"]>
implements WXContext<TD, IAnyTypeObject> {

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
     * 模组使用的参数列表
     */
    public paramList:Set<string>;

    /**
     * 命名空间
     */
    public nameSpace:string;
    
    /**
     * 一旦被类被构造，整个页面的全部申明周期将
     * 由该类实例控制，此后请勿修改任何生命周期函数
     * @param manager 页面上下文
     * @param nameSpace 模组命名空间
     * @param depend 模组依赖
     */
    public constructor(manager:M, nameSpace:string, depend?: DEP) {

        super(manager.context);

        // 保存微信上下文
        this.manager = manager;

        // 保存模块依赖
        this.depends = depend;

        // 初始化内部属性
        this.functionList = new Set<string>();
        this.paramList = new Set<string>();
        this.nameSpace = nameSpace;
    }

    public override setData(data:Partial<TD>, callback?: () => void):void {

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
        "onShow", "onReady", "onHide", "onUnload", "onPullDownRefresh", "onReachBottom", 
        "onShareAppMessage", "onShareTimeline","onAddToFavorites","onPageScroll", "onResize", "onTabItemTap"
    ];

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
    public addModule<DEP extends Depends<this>, M extends Modular<this, DEP>> (
        mode: new (manager:this, nameSpace:string, depend?:DEP) => M, 
        nameSpace:string, depend?:DEP
    ):M {
        let mod = new mode(this, nameSpace, depend);
        this.modules.push(mod);
        return mod;
    }

    /**
     * 创建指定生命周期的钩子
     * @param key 生命周期键值
     */
    public creatHooks<Key extends keyof ILifetime>(key: Key): ILifetime[Key] {
        let hook = (async (...arg: any[]) => {

            let hooks:Promise<any>[] = [];

            for(let i = 0; i < this.modules.length; i++) {

                let fn:Function = this.modules[i][key];

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
        });

        // TODO: 此处为，关键位置，容易出错，请再次检查
        return (hook as any);
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
                    this.modules[i].paramList.add(key);
                }
            }
        }

        // 将全部数据发布到视图层
        if(this.context.data !== void 0)
        this.context.setData(this.context.data);

        // 调用全部模块的 onLoad 周期
        let res = this.creatHooks("onLoad")(query); 

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

            let log:string = `模块 [${ this.modules[i].nameSpace }] 完成绑定...\n`;
            if(data.length > 0) log += `Using Props: ${ data.join(", ") }\n`;
            if(func.length > 0) log += `Using Function: ${ func.join(", ") }\n`;
            
            Logger.log(log, LevelLogLabel.InfoLabel, Manager.AddModuleLabel);
        }

        return res;
    }

    /**
     * 模块被添加时的标签
     */
    public static readonly AddModuleLabel = new LogLabel(
        "addModule", 
        colorRadio(54, 0, 255)
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

    /**
     * 异步页面加载
     * 
     * *注意*
     * 页面模块加载后，必须手动执行 loadAllModule
     * loadAllModule Modular 才会真正的被加载
     * 模块加载后可以处理逻辑绑定
     */
    public static async PageAsync(): Promise<{
        manager: Manager<AnyWXContext>, 
        query: Record<string, string | undefined>
    }> {
        return new Promise((solve) => {
            Page({
                async onLoad(query) {
                    let manager = new Manager(this);
                    await solve({ manager, query });
                }
            })
        });
    }
}

export { Manager, Modular, AnyWXContext, WXContext, ILifetime}