import { Modular, Manager } from "../../core/Module";

class Popups<M extends Manager> extends Modular<M> {

    public data? = {
        
        /**
		 *  弹出层是否显示
		 */
		isShow: false
    };

    private disappearTimer?: number;

    /**
	 * 显示弹出层
	 */
	public showPopups() {
		this.setData({ isShow: true });
	}

	/**
	 * 隐藏弹出层
	 */
	public hidePopups() {
		this.setData({ isShow: false });
	}
	
	public override onLoad() {
        // Do something
    }

}

export { Popups };
export default Popups;