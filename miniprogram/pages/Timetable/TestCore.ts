import { Modular, Manager, ILifetime } from "../../core/Module";
import { Login } from "../../api/Login";
import { Schedlue } from "../../api/Schedule"
import { Storage } from "../../core/Storage";

/**
 * 顶部状态栏
 */
class TestCore<M extends Manager> extends Modular<M> 
implements Partial<ILifetime> {

    public override onLoad() {
        
        let s = new Storage("test", {
            a: new Date(),
            be: 2
        });

        let s2 = new Storage("test", {
            be: 1,
            aa: "abc"
        });

        s2.set("be", 4);

        console.log(s, s2);

        setTimeout(() => {
            s.set("be", 12);
        }, 1000)
        
        // new Login().param({studentId: "2017060129", password: ""})
        // .request().wait({
        //     ok: (w) => {console.log("ok", w)},
        //     no: (w) => {console.log("no", w)},
        //     done: (w) => {console.log("done", w)}
        // });
        // new Schedlue().param({cookie:"C729D1AB1B17077485ACCD9279135C22",semester:"2020-2021-2"})
        // .request()
    }
}

export default TestCore; 
export { TestCore };