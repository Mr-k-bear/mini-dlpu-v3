import { Modular, Manager } from "../../core/Module";

/**
 * 蒙版事件
 */
type IMaskEvent = {

    /**
     * 蒙版显示事件
     */
    show: void;

    /**
     * 蒙版隐藏事件
     */
    hide: void;

    /**
     * 蒙版状态改变事件
     */
    change: boolean;

    /**
     * 蒙版点击事件
     */
    click: void;
}

/**
 * 蒙版 Modular
 */
class Mask<M extends Manager> extends Modular<M, {}, IMaskEvent> {

    /**
     * 动画运行时间
     */
    public static readonly animateTime: number = 100;

	public data? = {

		/**
		 * 蒙版的层级
		 */
		zIndex: 1,

        /**
         * 蒙版是否显示
         */
        isDisplay: false,

		/**
		 * 蒙版是否显示
		 */
		isShow: false
	};

    /**
     * 当点击时是否自动关闭蒙版
     */
    public autoCloseOnClick: boolean = true;

    /**
     * 消失动画计时器
     */
	private disappearTimer?: number;

    public override onLoad() {
		this.setFunc(this.handleClickMask, "handleClickMask");
        this.on("show", this.showMask);
        this.on("hide", this.hideMask);
    }
	
	/**
	 * 显示蒙版
	 */
	private showMask = () => {

        this.disappearTimer && clearTimeout(this.disappearTimer);

		this.setData({ 
            isShow: true,
            isDisplay: true
        });

        this.emit("change", true);
	}

	/**
	 * 隐藏蒙版
	 */
    private hideMask = () => {
		this.setData({ 
            isShow: false 
        });

        this.disappearTimer = setTimeout(() => {
            this.setData({ 
                isDisplay: false
            });
        }, Mask.animateTime);

        this.emit("change", false);
	}

    /**
     * 处理蒙版点击事件
     */
	private handleClickMask() {
		if (this.autoCloseOnClick) this.emit("hide", void 0);
        this.emit("click", void 0);
	}
}

export { Mask };
export default Mask;