import { Logger } from "../../core/Logger";
import { LevelLogLabel, LifeCycleLogLabel } from "../../core/PresetLogLabel";
import { Manager, Modular, AnyWXContext, ILifetime } from "../../core/Module";

Page({

    /**
     * 课程表页面加载
     */
    onLoad: async function () {

        this;

        let manager = new Manager(this);
        let m1 = manager.addModule(M1, "m1");
        let m2 = manager.addModule(M2, "m2", {m1});

        let manager2 = new Manager(this);
        let m22 = manager.addModule(M2, "m1", {m1});

        this.setData;

        Logger.log("课程表 (Timetable) 页面加载...", 
        LevelLogLabel.TraceLabel, LifeCycleLogLabel.OnLoadLabel);

        let systemInfo = wx.getSystemInfoSync();
 
        //状态栏高度
        let statusBarHeight = Number(systemInfo.statusBarHeight);
        
        let menu = wx.getMenuButtonBoundingClientRect()
        
        //导航栏高度
        let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2
        
        //状态栏加导航栏高度
        let navStatusBarHeight = statusBarHeight + menu.height + (menu.top - statusBarHeight) * 2
        
        console.log('状态栏高度',statusBarHeight)
        
        console.log('导航栏高度',navBarHeight)
        
        console.log('状态栏加导航栏高度',navStatusBarHeight)

        this.setData({barh: navStatusBarHeight});

    }
  
})

class M1<M extends Manager> extends Modular<M, {}> {

    public onLoad(){

    }
}

class M2<M extends Manager> extends Modular<M, {m1:M1<M>}> {
    
    public onLoad() {
        // this.setData();
    }
    // hhh(){
        
    // }

    hh(){}
}