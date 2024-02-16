
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
        this.notifyList = [];
    }

    /**
     * 修改状态 true -> 正常back false -> 不back，执行自定义操作
     * @param {boolean} status 
     */
    change_status(status) {
        console.log(status, "status");
        this.status = status;
        // console.log(this.callback);
        this.callback(status);
        // this.notify()
    }

    add_notify(callback) {
        this.notifyList.push(callback);
    }

    /**
     * 观察者，会把这里的全部发送给监听者
     * @param {boolean} value true -> 竖屏 false -> 横屏
     */
    notify(value) {
        console.log("notify", this.notifyList);
        this.notifyList.forEach(e => {
            e?.(value);
        })
    }

    /**
     * 获取状态
     * @returns {Promise} 
     */
    get_status() {
        return Promise.resolve(this.status);
    }

    /**
     * 视频页面销毁进入函数
     */
    destory_notify() {
        this.callback.call(false, true);
        this.status = false;
        // this.notifyList.pop();
        this.notifyList = [];
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