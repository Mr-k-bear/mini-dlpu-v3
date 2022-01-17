// APP 全局配置文件

/**
 * 是否在控制台输出调试信息
 * 生产模式下一定要关闭此选项
 * 
 * 注意：
 * 1、Release 时必须置为 false
 * 2、调试模式将造成性能损失
 */
export const LOGGER_CONSOLE:boolean = true;

/**
 * 是否在控制台输出时启用标签样式
 * 如果在手机上调试可以关闭此选项
 * 因为手机上的控制台无法正确显示样式
 */
export const LOGGER_STYLE:boolean = true;

/**
 * 调试过滤器
 * 按照 LogLabel 进行过滤
 * 
 * 注意：
 * 1、行与行之间是 || 关系
 * 2、每行的元素之间是 && 关系
 * 3、支持正则表达式
 * 4、字符串使用 === 严格匹配
 * 5、尽量将范围大的 Filter 写在前面以提高性能
 */
export const LOGGER_FILTER:Array<RegExp | string>[] = [

    // 调试输出全部内容
    [/.*/],

    // 输出警告和错误
    // ["WARN", "ERROR", "FATAL"],
];

/**
 * 请求失败的提示用语
 * 请求失败时如果选择自动显示消息
 * 则会从以下内容中选择
 */
export const API_FAILED_SHOW_MESSAGE: string[] = [
    "失败啦(ó_ò。)", "服务器睡着了", "数据移民火星了",
    "数据在半路走丢了", "服务器打了个瞌睡", "服务器被玩坏了",
    "服务器在扶老奶奶过马路", "服务器累了", "服务器在拯救世界"
]