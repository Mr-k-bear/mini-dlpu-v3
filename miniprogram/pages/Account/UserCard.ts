import { Modular, Manager } from "../../core/Module";
import { Mask } from "../../modular/Mask/Mask";

type IUserCardDependent<M extends Manager> = {
    mask: Mask<M>
}

class UserCard<M extends Manager> extends Modular<M, IUserCardDependent<M>> {

    public override onLoad() {
        this.setFunc(this.handleChangeTheme, "changeTheme")
    }
    
    /**
     * 处理主题更换
     */
    private handleChangeTheme() {
        this.depends?.mask.showMask();
    }
}

export { UserCard };
export default UserCard;