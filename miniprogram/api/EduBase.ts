import { API, IAnyData, GeneralCallbackResult } from "../core/Api";
import { EventType, Emitter } from "../core/Emitter";

type ILoginEvent = {

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
 * 教务处基础 API
 * @template I API 输入数据
 * @template O API 输出数据
 * @template E API 中的事件
 * @template U 用户自定义的输出数据
 */
abstract class EduBase<
	I extends IAnyData = IAnyData, 
	O extends IAnyData = IAnyData,
	E extends Record<EventType, any> = {}
> extends API<I, O, {
	[P in (keyof ILoginEvent | keyof E)]: P extends keyof ILoginEvent ? ILoginEvent[P] : E[P]
}> {

	protected useEduCallback(
		parseFunction: (data: any) => O
	): void {

		this.addFailedCallBack();

        this.on("success", (data) => {

            let isSuccess = true;
            let errMsg = "";
            let res: O | undefined;
            const info: any = data.data;

            // 数据缺失检测
            if(!info) {
                isSuccess = false;
                errMsg = "Bad Data";
                (this as Emitter<IAnyData>).emit("badData", { errMsg });
            }

            if (isSuccess) switch (info.code) {
                case (1):
                    res = parseFunction(info.data);
                    errMsg = info.err_msg ?? "Success";
                    (this as Emitter<IAnyData>).emit("ok", res!);
                    break;

                case (2):
                    isSuccess = false;
                    errMsg = info.err_msg ?? "Session Expire";
                    (this as Emitter<IAnyData>).emit("expire", { errMsg });
                    break;

                case (3):
                    isSuccess = false;
                    errMsg = info.err_msg ?? "Unauthorized";
                    (this as Emitter<IAnyData>).emit("unauthorized", { errMsg });
                    break;

                case (4):
                    isSuccess = false;
                    errMsg = info.err_msg ?? "Error";
                    (this as Emitter<IAnyData>).emit("error", { errMsg });
                    break;
            }

            if (!isSuccess) (this as Emitter<IAnyData>).emit("no", { errMsg });
            (this as Emitter<IAnyData>).emit("done", { errMsg, data: res });
        });
	}
}

export { EduBase };
export default EduBase;