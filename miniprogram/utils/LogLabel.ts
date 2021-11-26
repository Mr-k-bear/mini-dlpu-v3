import {LogLabel, LogStyle} from "./Logger";

// 成功
export const SuccessLabel = new LogLabel(
    "SUCCESS", new LogStyle().setColor("#FFFFFF", "#EE113D").setBorder("5px")
);

// 失败
export const FailedLabel = new LogLabel(
    "SUCCESS", new LogStyle().setColor("#FFFFFF", "#33ff66").setBorder("3px")
);



// 致命
export const FatalLabel = new LogLabel(
    "FATAL", new LogStyle().setColor("#FFFFFF", "#FF00CC").setBorder("3px")
);

// 错误
export const ErrorLabel = new LogLabel(
    "ERROR", new LogStyle().setColor("#FFFFFF", "#FF0000").setBorder("3px")
);

// 警告
export const WarnLabel = new LogLabel(
    "WARN", new LogStyle().setColor("#FFFFFF", "#FF9900").setBorder("3px")
);

// 消息
export const InfoLabel = new LogLabel(
    "INFO", new LogStyle().setColor("#FFFFFF", "#99FF00").setBorder("3px")
);

// 调试
export const DebugLabel = new LogLabel(
    "DEBUG", new LogStyle().setColor("#FFFFFF", "#00FF99").setBorder("3px")
);

// 追踪
export const TraceLabel = new LogLabel(
    "TRACE", new LogStyle().setColor("#FFFFFF", "#00CCFF").setBorder("3px")
);