
/**
 * 顶部状态栏 发布/订阅
 * @example 
 * 具体才做流程参照 user-pc-vite\project\ouzhou-h5\src\pages\detailnew\detail_header\detail_header_tem2.vue
 */
class OrientationSubscribe {
    static instance = new OrientationSubscribe();

    constructor() {
        // 视频点击是否全屏 
        this.status = false;
    }

    /**
     * 修改状态 true -> 正常back false -> 不back，执行自定义操作
     * @param {boolean} status 
     */
    change_status(status) {
        console.log(status, "status");
        this.status = status;
    }

    /**
     * 获取状态
     * @returns {Promise} 
     */
    get_status() {
        return Promise.resolve(this.status);
    }

    /**
     * 
     * @param {(status) => void} callback 
     */
    listener(callback) {
        this.callback = callback;
    }

}

export default OrientationSubscribe;