import { Logger } from "./core/Logger";
import { LevelLogLabel, LifeCycleLogLabel } from "./core/PresetLogLabel";
import { API, IParamSetting } from "./core/Api";
import { Storage } from "./core/Storage";


App({

    /**
     * 存储缓存键值
     */
    storageCache: new Set<string>(),

    /**
     * 小程序加载时
     */
    onLaunch() {
        Logger.log("小程序启动...", 
        LevelLogLabel.TraceLabel, LifeCycleLogLabel.OnLaunchLabel);

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

            public override key:string = "TestApi";
        
            public override params: IParamSetting<ITestApiInput> = {
                name: {
                    tester: "123"
                },
                id: {
                    parse: (i) => ++i,
                },
                info: {}
            }

            public constructor(data:ITestApiInput) {
                super(data);
                this.initLabel();
                this.initData();
            }
        }
        
        function testApi() {
            let api = new TestApi({
                name: "123",
                id: 456,
                info: {
                    data: "abc"
                }
            });
            console.log(api);
        }

        testApi();
    }
})