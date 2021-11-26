import {Logger} from "./utils/Logger";
import * as label from "./utils/LogLabel";


App<IAppOption>({

  /**
   * 全局数据
   */
  globalData: {},

  /**
   * 小程序加载时
   */
  onLaunch() {

    Logger.log("hh", 
        label.FatalLabel,label.ErrorLabel,label.WarnLabel,
        label.InfoLabel,label.DebugLabel,label.TraceLabel
    );
    
    Logger.logM(
        [label.FatalLabel,label.ErrorLabel,label.WarnLabel,
        label.InfoLabel,label.DebugLabel,label.TraceLabel], "hh"
    );
  }
})