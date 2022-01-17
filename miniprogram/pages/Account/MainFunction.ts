import { Modular, Manager } from "../../core/Module";

class MainFunction<M extends Manager> extends Modular<M> {
    
    public override onLoad() {
        // Do something
    }
}

export { MainFunction };
export default MainFunction;