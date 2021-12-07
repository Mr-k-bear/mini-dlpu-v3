import { Logger } from "./core/Logger";
import { LevelLogLabel, LifeCycleLogLabel } from "./core/PresetLogLabel";


App<IAppOption>({

    /**
     * 全局数据
     */
    globalData: {},

    /**
     * 小程序加载时
     */
    onLaunch() {
        Logger.log("小程序启动...", 
        LevelLogLabel.TraceLabel, LifeCycleLogLabel.OnLaunchLabel);
  }
})