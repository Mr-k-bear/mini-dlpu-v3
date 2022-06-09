import { Data } from "../core/Data";
import { Storage } from "../core/Storage";
import { Login, ILoginOutput } from "../api/Login";

/**
 * 登录状态
 */
enum LoginStatus {

    /**
     * 已认证
     */
    verified = 1,

    /**
     * 失效的认证
     * 通常为用户名密码错误
     */
    invalid = 2,

    /**
     * 没有登录信息
     */
    none = 3
}

/**
 * API 返回数据
 */
type ILoginApiData = {
    [P in keyof ILoginOutput]: {
        type: ILoginOutput[P];
        getAsync: () => Promise<ILoginOutput[P]>;
    }
}

/**
 * Storage 缓存数据类型
 */
type IStudentInfoStorageData = ILoginOutput & {
    [P in keyof IStudentInfoData]: IStudentInfoData[P]["type"];
};

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
     * 登录状态
     */
    loginStatus: {
        type: LoginStatus
    }

    /**
     * 上次登录时间
     * 时间戳
     */
    lastLoginTime: {
        type: number
    }

    /**
     * 距离上次登录后
     * 学号和密码是否发生过改变
     */
    isUserInfoChange: {
        type: boolean
    }
}

/**
 * 学生信息
 */
class StudentInfo extends Data<IStudentInfoData & ILoginApiData> {

    /**
     * 学生信息缓存
     */
    private eduStorage = new Storage<IStudentInfoStorageData>("StudentInfo", {
        idCardLast6: "",
        eduService: "",
        actualName: "",
        eduSession: "",
        studentId: "",
        password: "",
        loginStatus: LoginStatus.none,
        lastLoginTime: 0,
        isUserInfoChange: false
    });

    public override onLoad() {
        
    }

    /**
     * 用户登录
     */
    private async login(): Promise<boolean> {

        // 获取账号密码
        const stuId = this.eduStorage.get("studentId");
        const pwd = this.eduStorage.get("password");

        if (!stuId || !pwd) return false;

        // 发送请求
        const data = await new Login().param({
            studentId: stuId,
            password: pwd
        }).request().wait();

        // 请求成功
        let res = data.data;
        if (res) {

            // 保存数据
            this.eduStorage.set("actualName", res.actualName);
            this.eduStorage.set("eduService", res.eduService);
            this.eduStorage.set("eduSession", res.eduSession);
            this.eduStorage.set("idCardLast6", res.idCardLast6);

            // 记录时间
            this.eduStorage.set("lastLoginTime", new Date().getTime());

            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取状态
     */
    private async getStatus() {}
}

export { StudentInfo };
export default StudentInfo;