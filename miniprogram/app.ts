import { IAppAPIParam } from "./core/Api";
import { Logger, LevelLogLabel, LifeCycleLogLabel } from "./core/Logger";


App<IAppAPIParam>({

    /**
     * API 模块需要的全局数据
     * 参见 "/core/Api"
     */
    api: {
        nextId: 1,
        pool: new Set()
    },

    /**
     * 存储缓存键值
     */
    // storageCache: new Set<string>(),

    /**
     * 小程序加载时
     */
    onLaunch() {
        Logger.log("小程序启动...", 
        LevelLogLabel.InfoLabel, LifeCycleLogLabel.OnLaunchLabel);
    }
})