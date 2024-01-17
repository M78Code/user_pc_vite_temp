import { onMounted, ref, onUnmounted, computed, watch, inject } from "vue";
import lodash from 'lodash'
import { get_odds_active, MenuData } from "src/output/index.js";
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import BetData from "src/core/bet/class/bet-data-class.js";

export function use_bet_item(props) {

    // 定时器对象
    let timer_obj = {};

    const is_mounted = ref(true);
    // 赔率升降 up:上升 down:下降
    const odds_lift = ref("");

    // 盘口状态 active:选中 lock:锁盘 seal:封盘 close:关盘
    const odds_state = computed(() => {
        let { _mhs, _hs, os } = props.ol_data || {};
        return get_odds_state(_mhs, _hs, os);
    });

    //玩法比分
    const score = computed(() => {
        let score = "";
        let { _hpid: hpid, ot = "", on } = props.ol_data;
        // 比分玩法的显示
        if ([7, 20, 74, 341, 342].includes(+hpid) && !lodash.isEmpty(ot)) {
            if (ot.includes(":")) {
                score = ot.replace(":", "-");
            } else if (lodash.toLower(ot) == "other") {
                score = on;
            }
        }
        return score;
    });
    onMounted(() => {
        // 异步设置组件是否挂载完成
        // setTimeout(() => {
        //   is_mounted.value = true;
        // });
    });
    // 监听oid 取消赔率升降
    // 监听玩法ID变化 取消赔率升降 
    // 监听oid 取消赔率升降
    // 监听玩法ID变化 取消赔率升降 
    watch(() => [props.ol_data._hpid, props.ol_data.oid], (v, o) => {
        if (v[0] != o[0] || v[1] != o[1]) { //地址可能会变  但是oid不一定
            clear_odds_lift()
        }
    })
    // 监听投注项赔率变化
    watch(() => props.ol_data.ov, (cur, old) => {
        if (cur == old) return
        // 红升绿降变化
        set_odds_lift(cur, old);
    }, { deep: true })
    let tid;
    /**
     * 设置赔率升降
     * @param  {number} cur - 当前赔率值
     * @param  {number} old - 上次赔率值
     * @return {undefined} undefined
     */
    const set_odds_lift = (cur, old) => {
        if (!["lock", 'seal'].includes(odds_state.value) && old && !is_odds_seal()
        ) {
            if (cur > old) {
                odds_lift.value = 'up'
            }
            else if (old > cur) {
                odds_lift.value = 'down'
            }
            clearTimeout(tid)
            tid = setTimeout(() => {
                odds_lift.value = "";
            }, 3000);
        }
    };

    /**
     * 取消赔率升降
     */
    const clear_odds_lift = () => {
        clearTimeout(tid)
        odds_lift.value = "";
    };

    /**
     * 当赔率对应的欧赔小于1.01时，强制转换成封盘的状态 对盘口加锁
     * @return {boolean}
     */
    function is_odds_seal() {
        let ov = lodash.get(props.ol_data, "ov");
        let obv = lodash.get(props.ol_data, "obv");
        let _odds = ov || obv;
        return _odds < 101000;
    };

    /**
       * @description: 检查是否选中
       * @param {String} 对象id
       * @return {Boolean} 是否包含
       */
    function bet_item_select(id) {
        // 检查串关是否选中
        return BetData.bet_oid_list.includes(id);
    };

    /**
      * @Description 简化盘口文本
      * @param {string} lang 语言
      * @param {string} onb 盘口文本
      * @return  {string} text 盘口文本
     */
    const disk_text_replace = (lang, onb) => {
        let text = ''
        if (onb) {
            switch (lang) {
                case 'en':
                case 'ad':
                case 'ms':
                    text = onb.replace("Home", "1").replace("Away", "2").replace("Draw", "x")
                    break;
                case 'vi':
                    text = onb.replace("Chủ", "C").replace("Khách", "K").replace("Hòa", "H")
                    break;
                case 'th':
                    text = onb.replace("เจ้าบ้าน", "H").replace("แขก", "A").replace("วาด", "D")
                    break;
                case 'zh':
                case 'hk':
                case 'tw':
                    text = onb.replace("胜", "").replace("局", "").replace("勝", "")
                    break;
                case 'ko':
                    text = onb.replace("홈팀", "H").replace("방문자", "A").replace("무승부", "D")
                    break;
                case 'es':
                    text = onb.replace("Visitante", "V").replace("Empate", "E").replace("Inicio", "I").replace("sobre", "S").replace("debajo", "D").replace("bajo", "B")
                    break;
                case 'pt':
                    text = onb.replace('Empate', 'EMP').replace("over", "S").replace('under', 'I')
                    break;
                default:
                    text = onb
                    break;
            }
        }
        return text
    }

    /**
     * @description 获得最新的盘口状态
     * @param  {number} mhs  赛事级 0：开 1：封 2：关 11：锁
     * @param  {number} hs   盘口级 0：开 1：封 2：关 11：锁
     * @param  {number} os  投注项级 1：开 2：封 3：关 4：锁
     * @return {undefined} undefined
     */
    function get_odds_state(mhs, hs, os) {
        let _active = get_odds_active(mhs, hs, os);
        let id = lodash.get(props.ol_data, "oid");
        let state = "";
        const STATE = {
            // 封盘
            2: "seal",
            // 关盘
            3: "close",
        };
        if (!id) {
            state = "disable";
        } else if (STATE[_active]) {
            state = STATE[_active];
        } else {
            let selected_class;
            selected_class = bet_item_select(id);
            state = selected_class ? "active" : "normal";
        }
        // 当赔率对应的欧赔小于1.01时 ！！！！！！！！！！！！！！！！并且当前不在关盘状态，强制转换成封盘的状态 对盘口加锁
        return is_odds_seal() && _active !== 3 ? "seal" : state;
    };

    /**
     * @description 投注项点击
     * @return {undefined} undefined  组装投注项的数据
     */
    const bet_click_ol = () => {
        if (!props.ol_data.oid || odds_state.value == "lock" || odds_state.value == "seal") return
        const { oid, _hid, _hn, _mid } = props.ol_data
        let params = {
            oid, // 投注项id ol_obj
            _hid, // hl_obj 
            _hn,  // hn_obj
            _mid,  //赛事id mid_obj
        }
        let bet_type = 'common_bet'
        // 冠军
        if (MenuData.is_kemp()) {
            bet_type = 'guanjun_bet'
        }
        // 电竞
        if (MenuData.is_esports()) {
            bet_type = 'esports_bet'
        }
        // vr体育
        if (MenuData.is_vr()) {
            bet_type = 'vt_bet'
        }
        let other = {
            is_detail: false,
            // 投注类型 "vt_bet", "common_bet", "guanjun_bet", "esports_bet"
            // 根据赛事纬度判断当前赛事属于 那种投注类型
            bet_type,
            // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
            device_type: 2,
            // 数据仓库类型
            match_data_type: props.match_data_type, // h5_detail
            // match_data_type: "h5_list", // h5_detail
        }
        // //点击后再次点击，取消选中状态
        // const current_id = `${_mid}${oid}`;
        // if (props.active_score === current_id) {
        //   emit('update_score', '')
        // } else {
        //   emit('update_score', current_id)
        // }
        set_bet_obj_config(params, other)
        BetData.set_bet_state_show(true)
    };

    onUnmounted(() => {
        // 清除定时器
        clearTimeout(tid)
    });
    return {
        bet_click_ol,disk_text_replace,bet_item_select,score,odds_state,odds_state,odds_lift,is_mounted
    }
}