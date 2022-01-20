import Popups from "modular/Popups/Popups";
import { Modular, Manager } from "../../core/Module";
import { Mask } from "../../modular/Mask/Mask";

type IUserCardDependent<M extends Manager> = {
    mask: Mask<M>
    popups:Popups<M>
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
        this.depends?.popups.showPopups();
    }
}

export { UserCard };
export default UserCard;