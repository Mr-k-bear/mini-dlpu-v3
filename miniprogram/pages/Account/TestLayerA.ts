import { Modular, Manager } from "../../core/Module";

type IUserCardEvent = {

    /**
     * 主题更换按钮点击事件
     */
    click: void;
}

class TestLayerA<M extends Manager> extends Modular<M, {}, IUserCardEvent> {

    public override onLoad() {
        this.setFunc(this.handleClick, "click");
    }
    
    /**
     * 弹窗点击时
     */
    private handleClick() {
        this.emit("click");
    }
}

export { TestLayerA };
export default TestLayerA;