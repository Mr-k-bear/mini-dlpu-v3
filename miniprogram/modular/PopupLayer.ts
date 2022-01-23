import { Modular, Manager } from "../core/Module";

/**
 * 显示层
 */
class DisplayLayer {

	/**
	 * Layer 使用的 key
	 */
	public key: string = "";

	/**
	 * 使用的动画类型
	 */
	public animateTime: number = 300;
	
	/**
	 * 蒙版是否显示
	 */
	public isDisplay: boolean = false;

	 /**
	  * 蒙版是否显示
	  */
	public isShow: boolean = false;

	/**
     * 消失动画计时器
     */
	public disappearTimer?: number;
}

/**
 * 弹出层事件
 */
type IPopupLayerEvent<L extends string> = {

	/**
	 * 点击蒙版时
	 */
	clickMask: void

	/**
	 * 显示层
	 */
	show: L;

	/**
	 * 隐藏层
	 */
	hide: L;

	/**
	 * 层状态改变
	 */
	change: Readonly<DisplayLayer>;
}

/**
 * 弹出层
 */
class PopupLayer<
	L extends string,
	M extends Manager = Manager
> extends Modular<M, {}, IPopupLayerEvent<L>> {

	/**
	 * 层列表
	 */
	private layers: Map<L, DisplayLayer> = new Map();

	public onLoad(): void {
		this.on("show", this.handleShowLayer);
		this.on("hide", this.handleHideLayer);
	}

	/**
	 * 获取显示层
	 */
	private getDisplayLayer<K extends L>(e: K): DisplayLayer {
		let displayLayer = this.layers.get(e);
		if (!displayLayer) {
			displayLayer = new DisplayLayer();
			displayLayer.key = e;
			this.layers.set(e, displayLayer);
		}
		return displayLayer;
	}

	/**
	 * 响应显示层事件
	 */
	private handleShowLayer = <K extends L>(e: K) => {
		let displayLayer = this.getDisplayLayer(e);

		// 取消消失定时
		displayLayer.disappearTimer && 
		clearTimeout(displayLayer.disappearTimer);

		this.setData({ 
            [`${ e }$isShow`]: true,
            [`${ e }$isDisplay`]: true
        });

        this.emit("change", displayLayer);
	};

	/**
	 * 响应隐藏层事件
	 */
	private handleHideLayer = <K extends L>(e: K) => {
		let displayLayer = this.getDisplayLayer(e);

		this.setData({ 
            [`${ e }$isShow`]: false 
        });

        displayLayer.disappearTimer = setTimeout(() => {
            this.setData({ 
                [`${ e }$isDisplay`]: false
            });
        }, displayLayer.animateTime);

        this.emit("change", displayLayer);
	}
}

export { PopupLayer };
export default PopupLayer;