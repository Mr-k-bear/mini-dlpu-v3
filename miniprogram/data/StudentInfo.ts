import { Data } from "../core/Data";

/**
 * 登录状态
 */
enum LoginStatus {
    
}

/**
 * 学生信息数据结构
 */
type IStudentInfoData = {

    /**
     * 学号
     */
    studentId: {
        type: string,
    };

    /**
     * 教务处密码
     */
    password: {
        type: string
    };

    /**
     * 身份证后六位
     * 用于尝试水卡登录
     */
    idCardLast6: {
        type: string
    };

    /**
     * 使用的教务处链接
     */
    eduService: {
        type: string
    };
 
    /**
     * 用户的真实姓名
     */
    actualName: {
        type: string
    };
 
    /**
     * 用户是否关注了公共号
     */
    isSubscribeWxAccount: {
        type: boolean
    };
 
    /**
     * 教务处的 session
     */
    eduSession: {
        type: string
    };
}

/**
 * 学生信息
 */
class StudentInfo extends Data<IStudentInfoData> {

    public override onLoad() {
        
    }

}