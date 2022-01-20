import { HTTPMethod, IParamSetting } from "../core/Api";
import { EduBase } from "./EduBase";

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

interface IClassData {

    /**
     * 课程名字
     */
    name: string;

    /**
     * 上课地点
     */
    room?: string;

    /**
     * 课程老师
     */
    teacher?: string;

    /**
     * 周数
     */
    week: string;
}

type IScheduleOutput = {

    /**
     * 课程列表
     */
    classList: IClassData[];

    /**
     * 稀疏矩阵编号
     */
    index: number;
}[];

/**
 * Schedule API
 * 需要session与semester
 * 此 API 用来向教务处发起获取课程表的请求
 * 请求成功后将获得教务处返回的课程表JSON文件
 */
class Schedlue extends EduBase<IScheduleInput, IScheduleOutput> {
    
    public override baseUrl: string = "https://jwc.2333.pub";
 
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
        
        this.useEduCallback((data) => {
            const res: IScheduleOutput = [];

            for( let i = 0; i < data.length; i++ ) {
                const classList: IClassData[] = [];
                const CTTDetails = data[i].CTTDetails ?? [];

                for( let j = 0; j < CTTDetails.length; j++ ) {

                    classList.push({
                        name: CTTDetails[j].Name,
                        room: CTTDetails[j].Room,
                        teacher: CTTDetails[j].Teacher,
                        week: CTTDetails[j].Week,
                    })
                }

                res.push({
                    classList,
                    index: data[i].Id
                })
            }
            return res;

        });
    }
}

export { Schedlue };
export default Schedlue;