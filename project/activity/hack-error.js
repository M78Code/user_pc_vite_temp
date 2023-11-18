/**
 * 这个文件的作用, 是为了解决各种乱七八糟的 扩展(window/date) 报错的问题;
 */
import 'project/activity/src/public/utils/window_env/window_env_default'
import "project/activity/src/public/utils/menuClass/menu_calss.js"

class HackError {
    constructor() {
        this.dateFormat();
        this.windowVue();
    }

    dateFormat() {
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, // 月份
                "d+": this.getDate(), // 日
                "h+": this.getHours(), // 小时
                "m+": this.getMinutes(), // 分
                "s+": this.getSeconds(), // 秒
                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                "S": this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
    }

    windowVue() {
        window.vue = window.vue || {}

    }
}

export { HackError };