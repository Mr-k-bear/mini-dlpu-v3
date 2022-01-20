import { Modular, Manager } from "../../core/Module";

class Mask<M extends Manager> extends Modular<M> {

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

	private disappearTimer?: number;
	
	/**
	 * 显示蒙版
	 */
	public showMask() {
		this.setData({ 
            isShow: true,
            isDisplay: true
        });
	}

	/**
	 * 隐藏蒙版
	 */
	public hideMask() {
		this.setData({ 
            isShow: false 
        });

        this.disappearTimer = setTimeout(() => {
            this.setData({ 
                isDisplay: false
            });
        }, Mask.animateTime);
	}
	
	public override onLoad() {
		this.setFunc(this.handleClickMask, "handleClickMask");
        // Do something
    }

	private handleClickMask() {
		this.hideMask();
	}
}

export { Mask };
export default Mask;