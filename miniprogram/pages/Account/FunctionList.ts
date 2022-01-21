import { Modular, Manager } from "../../core/Module";

interface IFunctionListItem {

    /**
     * 显示名称
     */
    displayName: string;

    /**
     * 图标路径
     */
    iconUrl: string;
}

class FunctionList<M extends Manager> extends Modular<M> {

    public static readonly functionList: IFunctionListItem[] = [
        { displayName: "赞助计划", iconUrl: "Sponsor" },
        { displayName: "公众号", iconUrl: "PubilcAccount" },
        { displayName: "自助问答", iconUrl: "FAQ" },
        { displayName: "关于我们", iconUrl: "AboutUs" },
        { displayName: "联系客服", iconUrl: "Support" }
    ];

    public data = {
        functionList: FunctionList.functionList
    };
    
    public override onLoad() {
        // Do something
    }
}

export { FunctionList };
export default FunctionList;