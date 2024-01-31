class CommonHeader1Subscribe {
    static instance = new CommonHeader1Subscribe();

    constructor() {
        this.callback = []; // 回调
        this.refresh_status = false; // 刷新按钮状态
        this.show_refresh = false; // 是否显示刷新按钮
    }

    init(fn) {
        this.callback.push(fn);
    }
    
    /**
     * 
     * @param {'refresh_status'|'show_refresh'} key 
     */
    listener(key, value) {
        console.log(this.callback, "change_status");
        this.callback.forEach(e => {
            e.apply(this,[key, value]);
        })
    }

    change_status(status = false) {
        this.refresh_status =  status;
        console.log("change_status", status);
        this.listener("refresh_status", status);
    }

    change_show_status(status = false) {
        this.show_refresh = status;
        this.listener("show_refresh", status);
    }

    dispose() {
        this.callback = [];
        this.refresh_status = false;
        this.show_refresh = false; // 是否显示刷新按钮
    }
}


export default CommonHeader1Subscribe;