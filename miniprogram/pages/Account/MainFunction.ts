import { Modular, Manager } from "../../core/Module";

interface IMainFunctionItem {

    /**
     * 显示名称
     */
    displayName: string;

    /**
     * 图标路径
     */
    iconUrl: string;
}

class MainFunction<M extends Manager> extends Modular<M> {

    public static readonly MainFunctionList: IMainFunctionItem[] = [
        { displayName: "账号信息", iconUrl: "UserInfo" },
        { displayName: "课表缓存", iconUrl: "DateList" },
        { displayName: "功能定制", iconUrl: "Customer" },
        { displayName: "更多设置", iconUrl: "Settings" }
    ];

    public data? = {
        mainFunctionList: MainFunction.MainFunctionList
    }
    
    public override onLoad() {
        // Do something
    }
}

export { MainFunction };
export default MainFunction;