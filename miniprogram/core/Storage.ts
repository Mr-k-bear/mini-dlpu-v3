import { Logger, LogLabel, LevelLogLabel, colorRadio } from "./Logger";

interface IAppStorageParam {

    /**
     * storage 缓存
     */
    storage: Map<string, Storage<IStorageData>>
}

/**
 * 状态
 */
enum StorageState {

    /**
     * 有 waiter 存在的工作状态
     */
    WORK = 1,

    /**
     * 无 waiter 存在的完成状态
     */
    DONE = 2
}

/**
 * 任务等待列表
 */
class Waiter {

    /**
     * 状态
     */
    public get state():StorageState {
        if(this.waiterList.length <= 0) {
            return StorageState.DONE;
        } else {
            return StorageState.WORK;
        }
    }
    
    /**
     * 函数列表
     */
    private waiterList:Function[] = [];

    /**
     * 添加等待者
     * @param fn 等待者
     */
    public addWaiter(fn:Function) {
        this.waiterList.push(fn);
    }

    /**
     * 完成
     * 清空 waiterList
     * 并返回合并的 waiterList
     */
    public done():Function {

        // 复制 waiterList 生成闭包
        let fnList = this.waiterList.concat([]);

        let runAllWaiter = () => {
            for(let i = 0; i < fnList.length; i++) {
                fnList[i]();
            }
        }
        
        this.waiterList = [];
        return runAllWaiter;
    }
}

/**
 * 存储数据类型
 */
type IStorageData = {
    [x:string]:any
}

/**
 * 存储库
 * @template T 数据类型
 * 
 * 特点：
 * 1. 该类封装了 wxStorage 操作
 * 2. 全异步获取无阻塞
 * 3. 使用数据缓缓冲区，优化高频存取
 * 4. 如果全局范围内已存在莫键值 storage 的实例
 * 则此实例将链接到已存在实例
 */
class Storage<T extends IStorageData> {

    /**
     * Logger 使用的标签
     */
    public StorageLogLabel:LogLabel;

    /**
     * 数据唯一索引
     */
    public key:string;

    /**
     * 数据键值的默认数据类型
     */
    private readonly defaultData:T;

    /**
     * 缓存数据
     */
    private _cache: T = {} as T;
    private set cache(data: T) {
        if (this.cacheStorage) {
            for (const key in data) {
                this.cacheStorage.cache[key] = data[key];
            }
        } else {
            for (const key in data) {
                this._cache[key] = data[key];
            }
        }
    }
    private get cache():T {
        if (this.cacheStorage) return this.cacheStorage.cache;
        else return this._cache;
    }

    /**
     * cache 到 storage 等待列表
     */
    private saveWaiter:Waiter = new Waiter();

    /**
     * 缓存对象
     */
    private cacheStorage:Storage<T> | undefined;

    /**
     * 将数据从 cache 同步到 storage
     */
    public async save():Promise<void> {

        // 如果存在链接的实例
        if (this.cacheStorage) return this.cacheStorage.save();

        // 如果没有开始存储
        // 发起一次异步读取
        if(this.saveWaiter.state === StorageState.DONE) 
        setTimeout(() => {

            // 获取函数绑定列表
            let fnList = this.saveWaiter.done();

            wx.setStorage<T>({
                key: this.key,
                data: this.cache,

                success: (data) => {
                    Logger.log(`数据保存成功! errMsg: ${ data.errMsg }`, 
                    LevelLogLabel.InfoLabel, this.StorageLogLabel);
                },

                fail: (data) => {
                    Logger.log(`数据保存失败! errMsg: ${ data.errMsg }`, 
                    LevelLogLabel.FatalLabel, this.StorageLogLabel);
                },

                complete: () => {
                    fnList();
                }
            });
        });

        return new Promise((r) => {

            // 加入等待队列
            this.saveWaiter.addWaiter(r);
        });
    }

    /**
     * 在缓存中搜索此键值的实例
     */
    private findStorageCache(): boolean {
        let { storage: storageMap } = getApp<IAppStorageParam>();

        // 查找缓存
        let storage = storageMap.get(this.key);
        if (storage) {
            this.cacheStorage = storage as Storage<T>;
            return true;
        };

        // 缓存此实例
        storageMap.set(this.key, this);
        return false;
    }

    /**
     * 重置全部数据
     */
    public async reset() {
        this.cache = this.defaultData;
        Logger.logMultiple([LevelLogLabel.InfoLabel, this.StorageLogLabel],
            `正在重置为默认数据... 数据内容:\n`, this.cache 
        );
        return this.save();
    }

    /**
     * @param defaultData 键值默认数据
     */
    public constructor(key:string, defaultData?:T) {
        this.key = key;
        this.defaultData = defaultData ?? {} as T;
        this.StorageLogLabel = new LogLabel(
            `Storage:${ this.key }`, colorRadio(34, 230, 258)
        );

        // 如果已找到其他实力，将此实例链接到目标实例
        if (this.findStorageCache()) {

            // 设置默认值
            for (const key in this.defaultData) {
                if (this.cache[key] === void 0) {
                    this.set(key, this.defaultData[key]);
                }
            }
            return;
        };

        // 读取数据到缓存
        this.cache = wx.getStorageSync<T>(this.key);

        // 使用默认值
        if(!this.cache) {
            Logger.log(`找不到 Storage 数据!`, 
            LevelLogLabel.InfoLabel, this.StorageLogLabel);
            this.reset();
        } else {
            Logger.logMultiple([LevelLogLabel.InfoLabel, this.StorageLogLabel],
            `数据成功从 Storage 读取, 数据内容:\n`, this.cache
            );
        }
    }

    /**
     * 获取键值对应数据
     * @param key 键值
     */
    public get<M extends keyof T>(key:M):T[M] {
        return this.cache[key];
    }

    /**
     * 设置键值对应数据
     * @param key 键值
     */
    public async set<M extends keyof T>(key:M, value:T[M]):Promise<void> {
        this.cache[key] = value;
        return this.save();
    }
}

export default Storage;
export { Storage, StorageState, Waiter, IAppStorageParam, IStorageData };