
/**
 * 顶部状态栏 发布/订阅
 * @example 
 * 具体才做流程参照 user-pc-vite\project\ouzhou-h5\src\pages\detailnew\detail_header\detail_header_tem2.vue
 */
class NavbarSubscribe {
    static instance = new NavbarSubscribe();

    constructor() {
        // 状态，是否可以直接返回，默认true
        this.status = true;
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
     * 监听点击返回时会触发此回调，如果不是back操作，需要将状态置为false
     * @param {(status) => void} callback 
     */
    listener(callback) {
        this.callback = callback;
    }

    back() {
        this.callback?.call(this.status);
    }

}

export default NavbarSubscribe;