import { Modular, Manager } from "../../core/Module";

class Mask<M extends Manager> extends Modular<M> {

	public data? = {

		/**
		 * 蒙版的层级
		 */
		zIndex: 1,

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
		this.setData({ isShow: true });
	}

	/**
	 * 隐藏蒙版
	 */
	public hideMask() {
		this.setData({ isShow: false });
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