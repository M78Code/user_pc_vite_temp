import lodash from "lodash"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"

export default class BetRecordWs {
    constructor() {
        this.run()
    }
    /**
    * @description: 开始WS
    * @param {undefined} undefined
    * @return {undefined} undefined
    */
    run() {
        if (this.message_fun) {
            // 移除之前的ws消息监听
            window.removeEventListener("message", this.message_fun);
        }
        // 设置动态监听方法(多实例使用)
        this.message_fun = (obj) => {
            this.r_ws_msg(obj);
        }
        // 增加ws消息监听
        window.addEventListener("message", this.message_fun);
    }
    /**
     * @description: ws消息监听
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    r_ws_msg(obj) {
        // 获取window.postMessage自定义命令
        const cmd = lodash.get(obj, 'data.cmd');
        if (cmd == 'WS_MSG_REV') {
            // 是ws推送过来的消息
            // 获取消息数据体
            const data = lodash.get(obj, 'data.data');
            if (data) {
                // ws推送消息分流
                const ws_cmd = lodash.get(data, 'cmd')
                switch (ws_cmd) {
                    case 'C201':
                        useMittEmit(MITT_TYPES.EMIT_C201_HANDLE, data)
                        break;
                    case 'C210':
                        useMittEmit(MITT_TYPES.EMIT_C210_HANDLE, data)
                        break;
                    default:
                        break;
                }
            }
        }
    }
    /**
     * @description: 销毁函数-清除所有数据和对象
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    destroy() {
        // 移除ws消息监听
        window.removeEventListener("message", this.message_fun);
    }
}
