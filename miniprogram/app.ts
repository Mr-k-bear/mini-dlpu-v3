import { Logger } from "./core/Logger";
import { LevelLogLabel, LifeCycleLogLabel } from "./core/PresetLogLabel";

import { Storage } from "./core/Storage";


App({

    /**
     * 存储缓存键值
     */
    storageCache: new Set<string>(),

    /**
     * 小程序加载时
     */
    onLaunch() {
        Logger.log("小程序启动...", 
        LevelLogLabel.TraceLabel, LifeCycleLogLabel.OnLaunchLabel);

        let s = new Storage("test", {
            a: new Date(),
            be: 2
        });

        setTimeout(() => {
            s.set("be", 12);
        }, 1000)
    }
})