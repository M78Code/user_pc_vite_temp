/*
 * @Description: 时间格式化操作
 */
// import { ref, onUnmounted } from "vue";
import lodash from "lodash";
import store from "src/store-redux/index.js";
import licia_format from "licia/format";
import { format_time_zone_millisecond } from 'src/core/formart/module/format-date.js'

// const licia_format = require('licia/format');
/** 国际化 */
// const lang = ref('')
/** 获取服务器时间和本地时间差 */
// const get_timestamp = ref('')
/** stroe仓库 */
const unsubscribe = store.subscribe(store.getState)
// const unsubscribe = store.subscribe(() => {
// const new_state = store.getState()
// lang.value = new_state.lang
// get_timestamp.value = new_state.get_timestamp
// })
// onUnmounted(unsubscribe)

export default {
    data() {
        return {
            vx_get_timestamp: {}
        }
    },
    created() {
        this.vx_get_timestamp = lodash.get(store.getState(), 'get_timestamp', {
            remote_time: 0,
            local_time: 0
        })
    },
    methods: {
        /**
       * @description: 格式化时间
       * @param {Number} timestamp 时间戳
       * @param {String} fmt 自定义格式("mm月DD日 HH时MM")
       * @return {String} 格式好的时间
       */
        formatTime(timestamp, fmt) {
            try {
                // const date = new Date(parseInt(timestamp))
                const date = new Date(format_time_zone_millisecond(parseInt(timestamp)))
                let ret;
                let opt = {
                    "Y+": fmt.lastIndexOf("Y") - fmt.indexOf("Y") == 3 ? date.getFullYear().toString() : date.getFullYear().toString().substr(2, 2),        // 年
                    "y+": fmt.lastIndexOf("y") - fmt.indexOf("y") == 3 ? date.getFullYear().toString() : date.getFullYear().toString().substr(2, 2),        // 年
                    "m+": (date.getMonth() + 1).toString(),     // 月
                    "D+": date.getDate().toString(),            // 日
                    "d+": date.getDate().toString(),            // 日
                    "H+": date.getHours().toString(),           // 时
                    "h+": date.getHours().toString(),           // 时
                    "M+": date.getMinutes().toString(),         // 分
                    "S+": date.getSeconds().toString(),          // 秒
                    "s+": date.getSeconds().toString()          // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                };

                for (let k in opt) {
                    ret = new RegExp("(" + k + ")").exec(fmt);
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                    };
                };
                return fmt;

            } catch (error) {

            }
        },
        mx_get_remote_time() {
            let { local_time, remote_time } = this.vx_get_timestamp
            let now = new Date().getTime()
            let time = remote_time + (now - local_time);
            return time;
        },

        format_date_by_manage(value) {
            let time = new Date(parseInt(value));
            let y = time.getFullYear();
            // let m = (time.getMonth() + 1 + "").padStart(2, 0);
            let m = time.getMonth() + 1 + "";
            // let d = (time.getDate() + "").padStart(2, 0);
            let d = time.getDate() + ""
            let h = (time.getHours() + "").padStart(2, 0);
            let mm = (time.getMinutes() + "").padStart(2, 0);
            let s = (time.getSeconds() + "").padStart(2, 0);
            let arr = $root.$t('time.time_date_week');// ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            let i = time.getDay();
            let weekday = arr[i];
            // return `${m}月${d}日 (${weekday})`;
            return licia_format(this.$root.$t('time.time_date_2'), m, d, arr[i]);
        },
        format_day(value, separator = "/") {
            if (!value) { return '' }
            let [y, m, d, h, mm, s] = this.format_date_base(value)
            return `${y}${separator}${m}${separator}${d}`
        },
        format_month(value, separator) {
            if (!value) { return '' }
            // utc转成gmt+8
            let time = parseInt(value) + 8 * 60 * 60 * 1000
            let [y, m, d, h, mm, s] = this.format_date_base(time)
            separator = separator || '/'
            return `${m}${separator}${d} ${h}:${mm}:${s}`
        },
        format_date(value) {
            if (!value) { return '' }
            let [y, m, d, h, mm, s] = this.format_date_base(value)
            return `${y}-${m}-${d} ${h}:${mm}:${s}`;
        },
        format_date_base(value) {
            let time = new Date(parseInt(value));
            let y = time.getFullYear();
            let m = (time.getMonth() + 1 + "").padStart(2, 0);
            let d = (time.getDate() + "").padStart(2, 0);
            let h = (time.getHours() + "").padStart(2, 0);
            let mm = (time.getMinutes() + "").padStart(2, 0);
            let s = (time.getSeconds() + "").padStart(2, 0);
            return [y, m, d, h, mm, s]
        },

        format_date_base_obj(value) {
            let time = new Date(parseInt(value));
            let y = time.getFullYear();
            let m = (time.getMonth() + 1 + "").padStart(2, 0);
            let d = (time.getDate() + "").padStart(2, 0);
            let h = (time.getHours() + "").padStart(2, 0);
            let mm = (time.getMinutes() + "").padStart(2, 0);
            let s = (time.getSeconds() + "").padStart(2, 0);
            let w = time.getDay();
            return { y, m, d, h, mm, s, w };
        },

        format_date_today_base(value) {
            let time = new Date(parseInt(value));
            let y = time.getFullYear();
            let m = (time.getMonth() + 1 + "").padStart(2, 0);
            let d = (time.getDate() + "").padStart(2, 0);
            let h = (time.getHours() + "").padStart(2, 0);
            let mm = (time.getMinutes() + "").padStart(2, 0);
            let s = (time.getSeconds() + "").padStart(2, 0);
            return `${m}/${d} ${h}:${mm}`;
        },
        format_week(value) {
            // let arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            let i = new Date(parseInt(value)).getDay();
            // return a[i];
            return this.$root.$t('time.time_date_week')[i];
        },
        /**
         * @Description 时间戳转星期 
         * @param {number} value 时间戳
         * @param {string}
        */
        format_week2(value) {
            let i = new Date(parseInt(value)).getDay();
            return this.$root.$t('time.time_date_week_3')[i];
        },
        utc_to_gmt_8(value) {
            if (!value) { return '' }
            let time = parseInt(value) + 8 * 60 * 60 * 1000
            let [y, m, d, h, mm, s] = this.format_date_base(time)
            return `${m}/${d} ${h}:${mm}`;

        },
        utc_to_gmt_8_hm(value) {
            if (!value) { return '' }
            let time = parseInt(value) + 8 * 60 * 60 * 1000
            let [y, m, d, h, mm, s] = this.format_date_base(time)
            return `${h}:${mm}`;

        },
        utc_to_gmt_8_ms(value) {
            if (!value) { return '' }
            let time = parseInt(value) + 8 * 60 * 60 * 1000
            let [y, m, d, h, mm, s] = this.format_date_base(time)
            return `${mm}'${s}'`;
        },
        utc_to_gmt_no_8(value) {
            if (!value) { return '' }
            let time = parseInt(value);
            let [y, m, d, h, mm, s] = this.format_date_base(time)
            return `${m}/${d} ${h}:${mm}`;
        },
        utc_to_gmt_no_8_ms2(value) {
            if (!value) { return '' }
            // let time = this.$utils.format_time_zone_millisecond(parseInt(value));
            let time = format_time_zone_millisecond(parseInt(value));
            let [y, m, d, h, mm, s] = this.format_date_base(time)
            return `${h}:${mm}:${s}`;
        },
        utc_to_gmt_8_ms2(value) {

            if (!value) { return '' }
            let time = parseInt(value) * 1000 + 8 * 60 * 60 * 1000
            let [y, m, d, h, mm, s] = this.format_date_base(time)
            return `${h}:${mm}:${s}`;
        },
        utc_to_label_show(value) {
            if (!value) { return '' }
            let str = ''
            let time = parseInt(value) + 8 * 60 * 60 * 1000
            let time_local = new Date().getTime();
            if (time > time_local) {
                let cha_m = Math.floor((time - time_local) / (60 * 1000))
                str = `${cha_m}` + this.$root.$t('match_info.after_start');//分钟后开始
            } else {
                str = this.$root.$t('match_info.match_playing');//`已开赛`
            }
            return str
        },
        gmt_to_label_show(value) {
            if (!value) { return '' }
            let str = ''
            let time = parseInt(value);
            let time_local = new Date().getTime();
            if (time > time_local) {
                let cha_m = Math.floor((time - time_local) / (60 * 1000))
                str = `${cha_m}` + this.$root.$t('match_info.after_start');//分钟后开始
            } else {
                str = this.$root.$t('match_info.match_playing');//`已开赛`
            }
            return str
        },

        to_gmt_ms(tmp) {
            let mm = parseInt(tmp / 60);
            let s = tmp % 60;
            if (mm < 10) {
                mm = "0" + mm;
            }
            if (s < 10) {
                s = "0" + s;
            }
            return `${mm}'${s}'`;
        },
        /**
        * 将秒格式化为：分：秒
        * @param  {number} second  秒
        * @params {string} model 分隔符类型
        * @return {string} 分：秒
        */
        format_second_ms(second, model = "default") {

            if (second) {
                // let h = (Math.floor(second / 3600).toString()).padStart(2, 0);
                let m = (parseInt((second / 60)).toString()).padStart(2, 0);
                let s = (parseInt((second % 60)).toString()).padStart(2, 0);

                let date = model == 'default' ? `${m}:${s}` : `${m}'${s}"`;
                if (model == 'minute') {
                    date = parseInt(m) + "'";
                }
                //date = h > 0 ? (date = h + ":" + date) : date
                return date
            }
        }
    },

    destroyed() {
        unsubscribe()
    },
}