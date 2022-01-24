import { IAnyData } from "core/Api";
import { Emitter } from "core/Emitter";
import { Modular, Manager } from "../core/Module";

/**
 * 动画类型
 */
enum AnimateType {
    fade = 1,
    scale = 2,
    none = 3,
}

/**
 * 显示层
 */
class DisplayLayer {

    /**
     * 类名
     */
    public get className(): string {
        let res = this.isDisplay ? "block" : "none";

        switch (this.animateType) {
            case AnimateType.fade:
                res += " mask";
                break;

            case AnimateType.scale:
                res += " layer";
                break;

            case AnimateType.none:
                res += " occlude";
                break;
        }

        switch (this.animateType) {
            case AnimateType.fade:
                res += this.isShow ? " show-fade" : " hide-fade";
                break;

            case AnimateType.scale:
                res += this.isShow ? " show-scale" : " hide-scale";
                break;

            case AnimateType.none:
                break;
        }

        return res;
    }

	/**
	 * Layer 使用的 key
	 */
	public key: string = "";

	/**
	 * 使用的动画类型
	 */
	public animateType: AnimateType = AnimateType.scale;

    /**
     * 动画时间
     */
    public get animateTime(): number {
        switch (this.animateType) {
            case AnimateType.fade:
                return 100;
            case AnimateType.scale:
                return 300;
            case AnimateType.none:
                return -1;
        }
    };
	
	/**
	 * 是否显示
	 */
	public isDisplay: boolean = false;

	 /**
	  * 是否显示
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

type commonLayerType = "mask" | "occlude";

/**
 * 弹出层
 */
class PopupLayer<
	L extends string,
	M extends Manager = Manager
> extends Modular<M, {}, IPopupLayerEvent<L | commonLayerType>> {

    /**
     * 当点击时是否自动关闭蒙版
     */
    public autoCloseOnClick: boolean = true;

    /**
     * 关闭动画执行时是否屏蔽用户点击
     */
    public showOccludeWhenHide: boolean = true;

    /**
     * 显示 Layer 时自动关闭其他层
     */
    public hideOtherWhenShow: boolean = true;

	/**
	 * 层列表
	 */
	private layers: Map<L | commonLayerType, DisplayLayer> = new Map();

    /**
     * 初始化层
     * @param key 初始化关键字
     */
    public initLayers(key: L[]) {
        for (let i = 0; i < key.length; i++) {
            this.render(this.getDisplayLayer(key[i]));
        }
    }

	public onLoad(): void {
		this.on("show", this.handleShowLayer);
		this.on("hide", this.handleHideLayer);
        this.setFunc(this.handleClickMask, "clickMask");

        // 添加蒙版层
        const maskLayer = this.getDisplayLayer("mask");
        maskLayer.animateType = AnimateType.fade;
        this.render(maskLayer);

        // 添加遮蔽层
        const occludeLayer = this.getDisplayLayer("occlude");
        occludeLayer.animateType = AnimateType.none;
        this.render(occludeLayer);
	}

    /**
     * 渲染 Layers
     */
    private render(layer: DisplayLayer) {
        this.setData({ [`${ layer.key }$className`]: layer.className });
    }

	/**
	 * 获取显示层
	 */
	private getDisplayLayer<K extends L | commonLayerType>(e: K): DisplayLayer {
		let displayLayer = this.layers.get(e);
		if (!displayLayer) {
			displayLayer = new DisplayLayer();
			displayLayer.key = e;
			this.layers.set(e, displayLayer);
		}
		return displayLayer;
	}

    /**
     * 响应蒙版点击事件
     */
    private handleClickMask = () => {

        if (!this.autoCloseOnClick) return;

        // 关闭全部开启的层
        this.layers.forEach((layer) => {
            if (layer.isShow) (this as Emitter<IAnyData>).emit("hide", layer.key);
        });

        // 关闭蒙版
        (this as Emitter<IAnyData>).emit("hide", "mask");
    }

	/**
	 * 响应显示层事件
	 */
	private handleShowLayer = <K extends L | commonLayerType>(e: K) => {
		let displayLayer = this.getDisplayLayer(e);

        // 阻止未发生的变化
        if (displayLayer.isShow) return;

        // 关闭其他层
        if (e !== "mask" && e !== "occlude" && this.hideOtherWhenShow) {
            this.layers.forEach((layer) => {
                if (layer.key === "mask" || layer.key === "occlude") return;
                if (layer.isShow) {
                    (this as Emitter<IAnyData>).emit("hide", layer.key);
                }
            });
        }

        // 显示蒙版
        if (e !== "mask" && e !== "occlude")
        (this as Emitter<IAnyData>).emit("show", "mask");

		// 取消消失定时
		displayLayer.disappearTimer && 
		clearTimeout(displayLayer.disappearTimer);

        displayLayer.isShow = true;
        displayLayer.isDisplay = true;
        this.render(displayLayer);

        this.emit("change", displayLayer);
	};

	/**
	 * 响应隐藏层事件
	 */
	private handleHideLayer = <K extends L | commonLayerType>(e: K) => {
		let displayLayer = this.getDisplayLayer(e);

        // 阻止未发生的变化
        if (!displayLayer.isShow) return;

        if (displayLayer.animateTime <= 0) {

            displayLayer.isShow = false;
            displayLayer.isDisplay = false;
            this.render(displayLayer);
        } else {

            displayLayer.isShow = false;
            this.render(displayLayer);

            // 开启遮蔽
            if (this.showOccludeWhenHide) {
                (this as Emitter<IAnyData>).emit("show", "occlude");
            }

            displayLayer.disappearTimer = setTimeout(() => {
                displayLayer.isDisplay = false;
                this.render(displayLayer);

                // 取消 timer
                displayLayer.disappearTimer = undefined;

                // 检测是否关闭遮蔽
                let needOcclude = true;
                this.layers.forEach((layer) => {
                    if (layer === displayLayer) return;
                    if (layer.disappearTimer) needOcclude = false;
                });

                // 关闭遮蔽
                if (needOcclude && this.showOccludeWhenHide) {
                    (this as Emitter<IAnyData>).emit("hide", "occlude");
                }

            }, displayLayer.animateTime);
        }

        // 关闭蒙版
        if (e !== "mask" && e !== "occlude") {
            let needMask = true;
            this.layers.forEach((layer) => {
                if (layer === displayLayer) return;
                if (layer.isShow) needMask = false;
            });

            if (needMask) (this as Emitter<IAnyData>).emit("hide", "mask");
        }

        this.emit("change", displayLayer);
	}
}

export { PopupLayer };
export default PopupLayer;