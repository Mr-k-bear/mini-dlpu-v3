import { Modular, Manager } from "../../core/Module";

type IUserCardEvent = {

    /**
     * 主题更换按钮点击事件
     */
    clickChangeTheme: void;
}

class UserCard<M extends Manager> extends Modular<M, {}, IUserCardEvent> {

    public override onLoad() {
        this.setFunc(this.handleChangeTheme, "changeTheme");
    }
    
    /**
     * 处理主题更换
     */
    private handleChangeTheme() {
        this.emit("clickChangeTheme");
    }
}

export { UserCard };
export default UserCard;