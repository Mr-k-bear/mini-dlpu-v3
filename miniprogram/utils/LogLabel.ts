import {LogLabel, LogStyle} from "../logger/index";

/**
 * border-radius 5px
 * padding 0 5px
 */
const border3PxStyle:LogStyle = new LogStyle().setBorder("5px").setBlank("0 5px");


/**
 * 定义状态
 */
export namespace Status {

    /**
     * 成功
     */
    export const SuccessLabel = new LogLabel(
        "SUCCESS", border3PxStyle.clone().setColor("#FFFFFF", "#EE113D")
    );

    /**
     * 失败
     */
    export const FailedLabel = new LogLabel(
        "SUCCESS", border3PxStyle.clone().setColor("#FFFFFF", "#33ff66")
    );
}

/**
 * 定义等级
 */
export namespace Level {

    /**
     * 致命
     */
    export const FatalLabel = new LogLabel(
        "FATAL", border3PxStyle.clone().setColor("#FFFFFF", "#FF00CC")
    );

    /**
     * 错误
     */
    export const ErrorLabel = new LogLabel(
        "ERROR", border3PxStyle.clone().setColor("#FFFFFF", "#FF0000")
    );

    /**
     * 警告
     */
    export const WarnLabel = new LogLabel(
        "WARN", border3PxStyle.clone().setColor("#FFFFFF", "#FF9900")
    );

    /**
     * 消息
     */
    export const InfoLabel = new LogLabel(
        "INFO", border3PxStyle.clone().setColor("#FFFFFF", "#99FF00")
    );

    /**
     * 调试
     */
    export const DebugLabel = new LogLabel(
        "DEBUG", border3PxStyle.clone().setColor("#FFFFFF", "#00FF99")
    );

    /**
     * 追踪
     */
    export const TraceLabel = new LogLabel(
        "TRACE", border3PxStyle.clone().setColor("#FFFFFF", "#00CCFF")
    );
}

