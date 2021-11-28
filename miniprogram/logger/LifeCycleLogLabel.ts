import { LogStyle } from "./LogStyle";
import { LogLabel } from "./LogLabel";

/**
 * 生成圆角颜色标签样式
 */
const normalStyleGen = (r:number, g:number, b:number):LogStyle => {
    return new LogStyle().setBorder("4px", `1px solid rgb(${ r }, ${ g }, ${ b })`)
    .setColor(`rgb(${ r }, ${ g }, ${ b })`, `rgba(${ r }, ${ g }, ${ b }, .1)`)
    .setBlank("0 5px");
}

/**
 * 生命周期标签
 */
class LifeCycleLogLabel {

    /**
     * 小程序加载时
     */
    static readonly OnLaunchLabel = new LogLabel(
        "onLaunch", normalStyleGen(160, 32, 240)
    );

    /**
     * 生命周期函数--监听页面加载
     */
    static readonly OnLoadLabel = new LogLabel(
        "onLoad", normalStyleGen(255, 140, 105)
    );

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    static readonly OnReadyLabel = new LogLabel(
        "onReady", normalStyleGen(255, 127, 36)
    );

    /**
     * 生命周期函数--监听页面显示
     */
    static readonly OnShowLabel = new LogLabel(
        "onShow", normalStyleGen(255, 215, 0)
    )

    /**
     * 生命周期函数--监听页面隐藏
     */
    static readonly OnHideLabel = new LogLabel(
        "onHide", normalStyleGen(173, 255, 47)
    );

    /**
     * 生命周期函数--监听页面卸载
     */
    static readonly OnUnloadLabel = new LogLabel(
        "onUnload", normalStyleGen(127, 255, 212)
    );

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    static readonly OnPullDownRefreshLabel = new LogLabel(
        "onPullDownRefresh", normalStyleGen(0, 191, 255)
    );

    /**
     * 页面上拉触底事件的处理函数
     */
    static readonly OnReachBottomLabel = new LogLabel(
        "onReachBottom", normalStyleGen(84, 255, 159)
    );

    /**
     * 用户点击右上角分享
     */
    static readonly OnShareAppMessageLabel = new LogLabel(
        "onShareAppMessage", normalStyleGen(147, 112, 219)
    );
}

export default LifeCycleLogLabel;
export { LifeCycleLogLabel };