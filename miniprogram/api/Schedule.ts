import { API, HTTPMethod, IParamSetting, GeneralCallbackResult} from "../core/Api";

interface IScheduleInput {

    /**
     * session
     */
    cookie: string;

    /**
     * 学期
     */
    semester: string;
}

interface IScheduleOutput {

}

interface IScheduleEvent {
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
 * Schedule API
 * 需要session与semester
 * 此 API 用来向教务处发起获取课程表的请求
 * 请求成功后将获得教务处返回的课程表JSON文件
 */
class Schedlue extends API<IScheduleInput, IScheduleOutput, IScheduleEvent> {
    
    public override baseUrl: string = "jwc.2333.pub";
 
    public override url = "/course_timetable";

    public override method: HTTPMethod = HTTPMethod.GET;

    public override params: IParamSetting<IScheduleInput> = {

        cookie: {
            mapKey: "cookie",
            isHeader: true
        },

        semester: {
            mapKey: "semester",
        }
    };

    public constructor() {
        super();
        this.initDebugLabel("Schedule");
        
        this.addFailedCallBack();
    }
}