import { Modular, Manager } from "../../core/Module";

class Popups<M extends Manager> extends Modular<M> {

     /**
     * 动画运行时间
     */
    public static readonly animateTime: number = 100;

    public data? = {
        
        /**
		 *  弹出层是否显示
		 */
        display:false,

        /**
         * 弹出层动画
         */
        isShow:false
    };
    
    disappearTimer: number | undefined;

    /**
	 * 显示弹出层
	 */
	public showPopups() {
    this.setData({
      isShow:true,
      display:true
    });
	}

	/**
	 * 隐藏弹出层
	 */
	public hidePopups() {
		this.setData({
            isShow:false
        });
        
        this.disappearTimer = setTimeout(() => {
            this.setData({ 
                display: false
            });
        }, Popups.animateTime);

	}
	
	public override onLoad() {
        // Do something
    }

}

export { Popups };
export default Popups;