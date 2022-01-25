import { Storage } from "./Storage";

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
    get?: ((...P: any) => this["type"]) | INone;

    /**
     * 键值是否可以设置
     */
    set?: ((...P: [this["type"], ...any]) => any) | INone;

    /**
     * 是否仅为异步获取
     */
    getAsync?: ((...P: any) => Promise<this["type"]>) | INone;

    /**
     * 是否仅为异步设置
     */
    setAsync?: ((...P: [this["type"], ...any]) => Promise<any>) | INone;
}

/**
 * 数据层参数类型
 */
interface IDataParamSetting {
    [x: string]: IDataParamSettingItem
}

type INone = undefined | void;

/**
 * 注册表结构
 */
type IRegistryItem<S extends IDataParamSettingItem> = {

    /**
     * 获取方法
     */
    get: S["get"];

    /**
     * 异步获取方法
     */
    getAsync: S["getAsync"] extends Function ? S["getAsync"] : 
    S["get"] extends ((...P: any) => S["type"]) ? (...param: Parameters<S["get"]>) => Promise<S["type"]> : INone;

    /**
     * 设置方法
     */
    set: S["set"];

    /**
     * 异步设置方法
     */
    setAsync: S["setAsync"] extends Function ? S["setAsync"] : 
    S["set"] extends ((...P: [S["type"], ...any]) => any) ? (...param: Parameters<S["set"]>) => Promise<ReturnType<S["set"]>> : INone;
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
 *         type: number
 *         get: () => number,
 *         set: (val: number) => void,
 *         getAsync: () => Promise<number>
 *     }
 *     }> {
 *         public onLoad() {
 *         let dataObject = {key: 1}
 *         this.getter("test", () => 1);
 *         this.registerKeyFromObject(dataObject, "test", "key");
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
        F extends string, 
        O extends {[K in F]: D[KEY]["type"]}
    > (object: O, key: KEY, keyFromObject: F = key as any) {

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
     * 关联 Storage 中的 key
     * @param key Data 层键值
     * @param keyFromStorage StorageKey
     */
    protected registerKeyFromStorage<
        KEY extends keyof D,
        F extends string, 
        S extends Storage<{[K in F]: D[KEY]["type"]}>
    > (storage: S, key: KEY, keyFromStorage: F = key as any) {

        // 同步获取
        this.getter(key, () => {
            return storage.get(keyFromStorage);
        });

        // 同步设置
        this.setter(key, (data: any) => {
            storage.set(keyFromStorage, data);
        });

        // 异步设置
        this.setter(key, (async (data: any) => {
            await storage.set(keyFromStorage, data);
        }) as any, true);
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
                item.getAsync = this.syncFn2AsyncFn(item.get) as any;
            }
    
            // 检验 setter
            if (item.set && !item.setAsync) {
                item.setAsync = this.syncFn2AsyncFn(item.set) as any;
            }
        }

        // 在注册表中查找
        for (const key in this.registryList) fillFunction(key);
    }

    /**
     * 将同步函数转换为异步函数
     * @param fn 同步函数
     */
    protected syncFn2AsyncFn<F extends (...p: any) => any> (fn: F): (...param: Parameters<F>) => ReturnType<F> {
        const asyncFn = async (...param: [D]) => {
            return fn(...param);
        };
        return asyncFn as any;
    }
}

export { Data };
export default Data;