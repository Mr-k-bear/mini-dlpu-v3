
/**
 * 多重内容捆绑
 * 用于 log 输出
 */
class MultipleLogContent<T extends Array<any>> {
    
    /**
     * 输出内容
     */
    private readonly content:T;
    
    /**
     * @param content 输出内容
     */
    public constructor(...content:T) {
        this.content = content;
    }

    /**
     * 获取内容
     */
    public getContent():T {
        return this.content;
    }
}

export default MultipleLogContent;
export { MultipleLogContent };