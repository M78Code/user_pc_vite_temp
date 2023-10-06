// 这里边是原来的licia/format 处理方法  先写一个处理 %s 的

export const format_string = (payload, replace_string) => {
    if (payload.indexOf('%s')) {
        return payload.replace('%s', replace_string)
    }
}   