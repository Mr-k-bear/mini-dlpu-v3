import { Modular, Manager, ILifetime } from "../../core/Module";
import { API, IParamSetting } from "../../core/Api";
import { Storage } from "../../core/Storage";

/**
 * 顶部状态栏
 */
class TestCore<M extends Manager> extends Modular<M> 
implements Partial<ILifetime> {

    public onLoad() {
        
        let s = new Storage("test", {
            a: new Date(),
            be: 2
        });

        setTimeout(() => {
            s.set("be", 12);
        }, 1000)

        interface ITestApiInput {
            name: string,
            id: number,
            info: {
                data: string
            }
        }
        
        class TestApi extends API<ITestApiInput, {}> {
        
            public override params: IParamSetting<ITestApiInput> = {
                name: {
                    tester: "123",
                    isHeader: true
                },
                id: {
                    parse: (i) => ++i,
                },
                info: {}
            }

            public constructor() {
                super();
                this.initDebugLabel("TestApi");
            }
        }

        let api = new TestApi();
        api.param({
            name: "123",
            id: 456,
            info: {
                data: "abc"
            }
        }).request();
    }
}

export default TestCore; 
export { TestCore };