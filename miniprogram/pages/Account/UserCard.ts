import { Modular, Manager } from "../../core/Module";
import { Mask } from "../../modular/Mask/Mask";

type IUserCardDependent<M extends Manager> = {
    // mask: Mask<M>
}

type IUserCardEvent = {

    /**
     * 主题更换按钮点击事件
     */
    clickChangeTheme: void;
}

class UserCard<M extends Manager> extends Modular<M, IUserCardDependent<M>, IUserCardEvent> {

    public override onLoad() {
        this.setFunc(this.handleChangeTheme, "changeTheme")
    }
    
    /**
     * 处理主题更换
     */
    private handleChangeTheme() {
        // this.depends?.mask.emit("show", void 0);
        this.emit("clickChangeTheme");
    }
}

export { UserCard };
export default UserCard;