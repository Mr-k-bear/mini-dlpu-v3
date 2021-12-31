import { Modular, Manager, ILifetime } from "../../core/Module";
import { LevelLogLabel, LifeCycleLogLabel, NormalStyle } from "../../core/PresetLogLabel";
import { LogLabel } from "../../core/LogLabel";
import { Logger } from "../../core/Logger";

/**
 * 在 UI 中显示的数据
 */
type DisplayData = {

    /**
     * 显示内容
     */
    val:string;

    /**
     * 唯一键值 用来做判断
     */
    key:string;
};

/**
 * 模组事件
 */
type StatusBarEvent = {
    m: DisplayData
};

/**
 * 顶部状态栏
 */
class StatusBar<M extends Manager> extends Modular<M, {}, StatusBarEvent> 
implements Partial<ILifetime> {

    /**
     * 导航栏高度补偿
     */
    public static readonly StatusBarHeightExtend:number = 2;

    /**
     * 页面日志输出标签
     */
    public static readonly StatusBarLabel = new LogLabel(
        "StatusBar", NormalStyle
    );

    data = {

        // 导航栏高度
        barHeight: 65,
        
        // 状态栏高度
        barTop: 20,

        // 胶囊占位
        capsule: 94
    };

    /**
     * 设置顶部状态栏高度
     */
    public setHeight() {
        
        let systemInfo = wx.getSystemInfoSync();
        let headerPos = wx.getMenuButtonBoundingClientRect();

        //状态栏高度
        let statusBarHeight = Number(systemInfo.statusBarHeight);
        
        // 胶囊实际位置，坐标信息不是左上角原点
        let btnPosI = {

            // 胶囊实际高度
            height: headerPos.height,
            width: headerPos.width,
            
            // 胶囊top - 状态栏高度
            top: headerPos.top - statusBarHeight, 

            // 胶囊bottom - 胶囊height - 状态栏height （胶囊实际bottom 为距离导航栏底部的长度）
            bottom: headerPos.bottom - headerPos.height - statusBarHeight, 

            // 这里不能获取 屏幕宽度，PC端打开小程序会有BUG，要获取窗口高度 - 胶囊right
            right: systemInfo.windowWidth - headerPos.right 
        }

        // 计算顶部导航栏高度
        let barHeight =  btnPosI.height + btnPosI.top + btnPosI.bottom;

        // 计算胶囊展位
        let capsule = btnPosI.right + btnPosI.width;

        this.setData({

            // 不知道为什么总是差 4px 距离
            // 别问为什么 加上就对了
            barHeight: barHeight + 4 + StatusBar.StatusBarHeightExtend,
            barTop: statusBarHeight - StatusBar.StatusBarHeightExtend,
            capsule: capsule
        });

        Logger.log(`计算并设置 StatusBar 的高度为: ${ barHeight + 4 }px, ` +
        `状态栏高度: ${ statusBarHeight }px, 胶囊占位: ${ capsule }px`, 
        LevelLogLabel.InfoLabel, StatusBar.StatusBarLabel);

    }

    public onLoad() {
        
        Logger.log("StatusBar 模块加载...", 
        LevelLogLabel.InfoLabel, LifeCycleLogLabel.OnLoadLabel, StatusBar.StatusBarLabel);

        this.setHeight();
    }

}

export default StatusBar; 
export { StatusBar };