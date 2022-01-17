import { Modular, Manager } from "../../core/Module";

class UserCard<M extends Manager> extends Modular<M> {
    
    public override onLoad() {
        // Do something
    }
}

export { UserCard };
export default UserCard;