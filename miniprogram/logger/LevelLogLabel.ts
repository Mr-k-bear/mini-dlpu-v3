import { LogStyle } from "./LogStyle";
import { LogLabel } from "./LogLabel";

/**
 * 生成圆角颜色标签样式
 */
const normalStyleGen = (color:string):LogStyle => {
    return new LogStyle().setBorder("4px", `1px solid ${color}`)
    .setColor(color).setBlank("0 5px");
}

/**
 * 调试等级标签
 */
class LevelLogLabel {

    /**
     * 致命
     */
    static readonly FatalLabel = new LogLabel(
        "FATAL", normalStyleGen("#FF00CC")
    );

    /**
     * 错误
     */
    static readonly ErrorLabel = new LogLabel(
        "ERROR", normalStyleGen("#FF0000")
    );

    /**
     * 警告
     */
    static readonly WarnLabel = new LogLabel(
        "WARN", normalStyleGen("#FF9900")
    );

    /**
     * 消息
     */
    static readonly InfoLabel = new LogLabel(
        "INFO", normalStyleGen("#99FF00")
    );

    /**
     * 调试
     */
    static readonly DebugLabel = new LogLabel(
        "DEBUG", normalStyleGen("#00FF99")
    );

    /**
     * 追踪
     */
    static readonly TraceLabel = new LogLabel(
        "TRACE", normalStyleGen("#00CCFF")
    );
}

export default LevelLogLabel;
export { LevelLogLabel };