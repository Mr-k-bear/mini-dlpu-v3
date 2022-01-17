import { Modular, Manager } from "../../core/Module";

class FunctionList<M extends Manager> extends Modular<M> {
    
    public override onLoad() {
        // Do something
    }
}

export { FunctionList };
export default FunctionList;