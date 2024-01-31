class CommonHeader1Subscribe {
    static instance = new CommonHeader1Subscribe();

    constructor() {
        this.callback = []; // 回调
        this.refresh_status = false; // 是否显示刷新按钮
    }

    init(fn) {
        this.callback.push(fn);
    }

    listener() {
        this.callback.forEach(e => {
            e?.call(this.refresh_status);
        })
    }

    change_status(status = false) {
        this.refresh_status =  status;
        this.listener();
    }

    dispose() {
        this.callback = [];
        this.refresh_status = false;
    }
}


export default CommonHeader1Subscribe;