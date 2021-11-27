import { Logger, LevelLogLabel } from "./logger/index";


App<IAppOption>({

    /**
     * 全局数据
     */
    globalData: {},

    /**
     * 小程序加载时
     */
    onLaunch() {

    console.log(Logger.l({val:"hh"}, 
    LevelLogLabel.FatalLabel,LevelLogLabel.ErrorLabel,LevelLogLabel.WarnLabel,
    LevelLogLabel.InfoLabel,LevelLogLabel.DebugLabel,LevelLogLabel.TraceLabel
    ));
    
    console.log(Logger.m(
        [LevelLogLabel.FatalLabel,LevelLogLabel.ErrorLabel,LevelLogLabel.WarnLabel,
            LevelLogLabel.InfoLabel,LevelLogLabel.DebugLabel,LevelLogLabel.TraceLabel], {val:"hh"}, "hh"
    ));

    console.log(Logger.ll({val:"hh"}, 
    LevelLogLabel.FatalLabel,LevelLogLabel.ErrorLabel,LevelLogLabel.WarnLabel,
    LevelLogLabel.InfoLabel,LevelLogLabel.DebugLabel,LevelLogLabel.TraceLabel
    ));

    console.log(Logger.lm(
        [LevelLogLabel.FatalLabel,LevelLogLabel.ErrorLabel,LevelLogLabel.WarnLabel,
            LevelLogLabel.InfoLabel,LevelLogLabel.DebugLabel,LevelLogLabel.TraceLabel], {val:"hh"}, "hh"
    ));
  }
})