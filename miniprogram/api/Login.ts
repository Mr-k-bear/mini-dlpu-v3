import { API, HTTPMethod, IParamSetting, GeneralCallbackResult } from "../core/Api";

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

interface ILoginEvent {

    /**
     * session 过期
     */
    expire: GeneralCallbackResult;

    /**
     * 登录失败
     */
    unauthorized: GeneralCallbackResult;

    /**
     * 未知的问题
     */
    error: GeneralCallbackResult;

    /**
     * 数据损坏或丢失
     */
    badData: GeneralCallbackResult;
}

/**
 * Login API
 * 此 API 用来向教务处发起登录请求
 * 请求成功后将获得教务处返回的 session
 */
class Login extends API<ILoginInput, ILoginOutput, ILoginEvent> {

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

        this.addFailedCallBack();

        this.on("success", (data) => {

            let isSuccess = true;
            let errMsg = "";
            let res: ILoginOutput | undefined;
            const info: any = data.data;

            // 数据缺失检测
            if(!info) {
                isSuccess = false;
                errMsg = "Bad Data";
                this.emit("badData", { errMsg });
            }

            if (isSuccess) switch (info.code) {
                case (1):
                    res = {
                        idCardLast6: info.data.idCard,
                        eduService: info.data.ip,
                        actualName: info.data.name,
                        isSubscribeWxAccount: info.data.official,
                        eduSession: info.data.session
                    };
                    errMsg = info.err_msg ?? "Success";
                    this.emit("ok", res);
                    break;

                case (2):
                    isSuccess = false;
                    errMsg = info.err_msg ?? "Session Expire";
                    this.emit("expire", { errMsg });
                    break;

                case (3):
                    isSuccess = false;
                    errMsg = info.err_msg ?? "Unauthorized";
                    this.emit("unauthorized", { errMsg });
                    break;

                case (4):
                    isSuccess = false;
                    errMsg = info.err_msg ?? "Error";
                    this.emit("error", { errMsg });
                    break;
            }

            if (!isSuccess) this.emit("no", { errMsg });
            this.emit("done", { errMsg, data: res });
        });
    }
}

export { Login, ILoginInput, ILoginOutput };