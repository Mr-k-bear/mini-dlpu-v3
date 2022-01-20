import { HTTPMethod, IParamSetting } from "../core/Api";
import { EduBase } from "./EduBase";

interface ILoginInput {

    /**
     * 学号
     */
    studentId: string;

    /**
     * 教务处密码
     */
    password: string;
}

interface ILoginOutput {

    /**
     * 身份证后六位
     * 用于尝试水卡登录
     */
    idCardLast6: string;

    /**
     * 使用的教务处链接
     */
    eduService: string;

    /**
     * 用户的真实姓名
     */
    actualName: string;

    /**
     * 用户是否关注了公共号
     */
    isSubscribeWxAccount: boolean;

    /**
     * 教务处的 session
     */
    eduSession: string;
}

/**
 * Login API
 * 此 API 用来向教务处发起登录请求
 * 请求成功后将获得教务处返回的 session
 */
class Login extends EduBase<ILoginInput, ILoginOutput> {

    public override url: string = "/login";

    public override method: HTTPMethod = HTTPMethod.POST;

    public override params: IParamSetting<ILoginInput> = {

        studentId: {
            mapKey: "id",
            tester: /^\d{8,12}$/,
        },

        password: {
            mapKey: "pwd"
        }
    };

    public constructor() {
        super();
        this.initDebugLabel("Login");

        this.useEduCallback((data) => ({
            idCardLast6: data.idCard,
            eduService: data.ip,
            actualName: data.name,
            isSubscribeWxAccount: data.official,
            eduSession: data.session
        }));
    }
}

export { Login, ILoginInput, ILoginOutput };