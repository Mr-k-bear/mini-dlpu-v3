
/**
 * 数据层键值设置
 */
interface IDataParamSettingItem {

    /**
     * 类型
     */
    type: any;

    /**
     * 键值是否可以获取
     */
    isGet: boolean;

    /**
     * 键值是否可以设置
     */
    isSet: boolean;

    /**
     * 是否仅为异步获取
     */
    isGetAsync?: boolean;

    /**
     * 是否仅为异步设置
     */
    isSetAsync?: boolean;
}

/**
 * 数据层参数类型
 */
interface IDataParamSetting {
    [x: string]: IDataParamSettingItem
}

type IGet<T> = () => T;
type IGetAsync<T> = () => Promise<T>;
type ISet<T> = (data: T) => INone;
type ISetAsync<T> = (data: T) => Promise<INone>;

type INone = undefined | void | unknown;

/**
 * 注册表结构
 */
type IRegistryItem<S extends IDataParamSettingItem> = {

    /**
     * 获取方法
     */
    get: S["isGetAsync"] extends true ? INone : S["isGet"] extends true ? IGet<S["type"]> : INone;

    /**
     * 异步获取方法
     */
    getAsync: S["isGet"] extends true ? IGetAsync<S["type"]> : INone;

    /**
     * 设置方法
     */
    set: S["isSetAsync"] extends true ? INone : S["isSet"] extends true ? ISet<S["type"]> : INone;

    /**
     * 异步设置方法
     */
    setAsync: S["isSet"] extends true ? ISetAsync<S["type"]> : INone;
}

/**
 * 注册表参数类型
 */
type IRegistry<D extends IDataParamSetting> = {
    [P in keyof D]: IRegistryItem<D[P]>;
}

type IRegistryPartial<D extends IDataParamSetting> = {
    [P in keyof D]?: Partial<IRegistryItem<D[P]>>;
}


type IAutoSelect<IF extends boolean, A, B> = IF extends true ? A : B;

/**
 * Core 数据层架构
 * 
 * 使用示例：
 * ```typescript
 * class TestData extends Data<{
 *     test: {
 *         type: number,
 *         isGet: true,
 *         isSet: true,
 *         isGetAsync: true
 *     }
 * }> {
 *     public onLoad() {
 *         let dataObject = {key: 1}
 *         this.getter("test", () => 1);
 *         this.registerKeyFromObject("test", "key", dataObject);
 *     }
 * }
 * ```
 */
class Data<D extends IDataParamSetting> {

    /**
     * getter setter 注册表
     */
    private registryList: IRegistryPartial<D> = {};

    /**
     * 加载函数
     */
    public onLoad(): any {};

    /**
     * 注册一个 Setter 到键值上
     * @param key 注册的键值
     * @param setter 注册的 Setter
     * @param isAsync 是否为异步函数
     */
    protected setter<KEY extends keyof D> (key: KEY, setter: IRegistryItem<D[KEY]>["set"]): this
    protected setter<KEY extends keyof D> (key: KEY, setter: IRegistryItem<D[KEY]>["setAsync"], isAsync: true): this
    protected setter<
        KEY extends keyof D, 
        ASYNC extends boolean
    > (
        key: KEY, 
        setter: IAutoSelect<ASYNC, IRegistryItem<D[KEY]>["setAsync"], IRegistryItem<D[KEY]>["set"]>, 
        isAsync?: ASYNC
    ): this {

        // 如果此键值不存在，新建
        if (!this.registryList[key]) this.registryList[key] = {};

        // 设置异步 setter
        if (isAsync) this.registryList[key]!.setAsync = setter as IRegistryItem<D[KEY]>["setAsync"];

        // 设置同步 setter
        else this.registryList[key]!.set = setter as IRegistryItem<D[KEY]>["set"];

        return this;
    }

    /**
     * 注册一个 Getter 到键值上
     * @param key 注册的键值
     * @param getter 注册的 Getter
     * @param isAsync 是否为异步函数
     */
    protected getter<KEY extends keyof D> (key: KEY, getter: IRegistryItem<D[KEY]>["get"]): this
    protected getter<KEY extends keyof D> (key: KEY, getter: IRegistryItem<D[KEY]>["getAsync"], isAsync: true): this
    protected getter<
        KEY extends keyof D, 
        ASYNC extends boolean
    > (
        key: KEY, 
        getter: IAutoSelect<ASYNC, IRegistryItem<D[KEY]>["getAsync"], IRegistryItem<D[KEY]>["get"]>, 
        isAsync?: ASYNC
    ): this {
 
        // 如果此键值不存在，新建
        if (!this.registryList[key]) this.registryList[key] = {};

        // 设置异步 getter
        if (isAsync) this.registryList[key]!.getAsync = getter as IRegistryItem<D[KEY]>["getAsync"];

        // 设置同步 getter
        else this.registryList[key]!.get = getter as IRegistryItem<D[KEY]>["get"];

        return this;
    }

    /**
     * 将对象的键值关联到 Data 层中
     * @param key Data 层键值
     * @param keyFromObject 对象源键值
     * @param object 关联对象
     */
    protected registerKeyFromObject<
        KEY extends keyof D, 
        F extends keyof O, 
        O extends {[K in F]: D[KEY]["type"]}
    > (key: KEY, keyFromObject: F, object: O) {

        // 注册同步获取
        this.getter(key, () => {
            return object[keyFromObject]
        });

        // 注册同步设置
        this.setter(key, (data: any) => {
            object[keyFromObject] = data
        })
    }

    /**
     * 导出数据对象
     * @returns 数据对象
     */
    public export(): IRegistry<D> {
        this.autoFillFunction();
        return this.registryList as IRegistry<D>;
    }

    /**
     * 自动填充缺失的异步函数
     * 在注册表中搜索全部的同步函数
     * 并自动填充对应的异步函数
     * 此函数会在 export 前静默执行
     */
    protected autoFillFunction(): void {

        // 填充函数
        const fillFunction = <KEY extends keyof D>(key: KEY): void => {

            const item = this.registryList[key] as IRegistryItem<D[KEY]>;
            if (!item) return;
    
            // 检验 getter
            if (item.get && !item.getAsync) {
                item.getAsync = this.syncFn2AsyncFn(item.get as IGet<D[KEY]["type"]>);
            }
    
            // 检验 setter
            if (item.set && !item.setAsync) {
                item.setAsync = this.syncFn2AsyncFn(item.set as ISet<D[KEY]["type"]>);
            }
        }

        // 在注册表中查找
        for (const key in this.registryList) fillFunction(key);
    }

    /**
     * 将同步函数转换为异步函数
     * @param fn 同步函数
     */
    protected syncFn2AsyncFn<D, H extends (IGet<D> | ISet<D>)> (fn: H): 
    IAutoSelect<H extends IGet<D> ? true : false, IGetAsync<D>, ISetAsync<D>> {
        const asyncFn = async (...param: [D]) => {
            return fn(...param);
        };
        return asyncFn as any;
    }
}