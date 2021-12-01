import { Logger } from "../../core/Logger";
import { LevelLogLabel, LifeCycleLogLabel } from "../../core/PresetLogLabel";
import { Manager, Modular, AnyWXContext, ILifetime } from "../../core/Module";

let manager;

// Page({

//     /**
//      * 课程表页面加载
//      */
//     onLoad: async function (query) {

//         manager = new Manager(this);
//         console.log(manager);


//         // this.setData;

//         // Logger.log("课程表 (Timetable) 页面加载...", 
//         // LevelLogLabel.TraceLabel, LifeCycleLogLabel.OnLoadLabel);

//         // let systemInfo = wx.getSystemInfoSync();
 
//         // //状态栏高度
//         // let statusBarHeight = Number(systemInfo.statusBarHeight);
        
//         // let menu = wx.getMenuButtonBoundingClientRect()
        
//         // //导航栏高度
//         // let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2
        
//         // //状态栏加导航栏高度
//         // let navStatusBarHeight = statusBarHeight + menu.height + (menu.top - statusBarHeight) * 2
        
//         // console.log('状态栏高度',statusBarHeight)
        
//         // console.log('导航栏高度',navBarHeight)
        
//         // console.log('状态栏加导航栏高度',navStatusBarHeight)

//         // this.setData({barh: navStatusBarHeight});

//     }
  
// })


Manager.Page((manager)=>{
    let m1 = manager.addModule(M1, "m1");
    let m2 = manager.addModule(M2, "m2", {m1});
})


class M1<M extends Manager> extends Modular<M, {}> implements Partial<ILifetime> {

    data = {
        a:1,
        b:{}
    }

    public onLoad(){

    }

    public onReady() {
        console.log(this);
        this.emit("lll", {a:1})
    }
}

class M2<M extends Manager> extends Modular<M, {m1:M1<M>}> {

    data = {
        a: 1
    }

    public onLoad() {
        this.setData({a:1});
        this.depends?.m1.on("lll", (e)=>{
            console.log(e)
        })
        console.log(this);
    }
}