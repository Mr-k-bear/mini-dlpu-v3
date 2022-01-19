import { Modular, Manager } from "../../core/Module";

interface IFunctionListItem {

    /**
     * id
     */
    id?: number

    /**
     * 显示名称
     */
    displayName: string;

    /**
     * 图标路径
     */
    iconUrl: string;
}

interface IFunctionListData {
    functionList?: IFunctionListItem[];
};

class FunctionList<M extends Manager> extends Modular<M> {

    public static readonly functionList: IFunctionListItem[] = [
        { displayName: "赞助计划", iconUrl: "Sponsor" },
        { displayName: "公众号", iconUrl: "PubilcAccount" },
        { displayName: "自助问答", iconUrl: "FAQ" },
        { displayName: "关于我们", iconUrl: "AboutUs" },
        { displayName: "联系客服", iconUrl: "Support" }
    ];

    public data: IFunctionListData = {
        functionList: undefined
    };
    
    public override onLoad() {
        console.log(FunctionList.functionList)
        this.setData({
            functionList: FunctionList.functionList.map((value, index) => {
                value.id = index;
                return value;
            })
        })
    }
}

export { FunctionList };
export default FunctionList;