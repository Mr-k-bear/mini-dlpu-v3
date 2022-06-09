import { Modular, Manager } from "../../core/Module";

type ILoginEvent = {
    
}

class Login<M extends Manager> extends Modular<M, {}> {

    public override onLoad() {
        
    }
}

export { Login };
export default Login;