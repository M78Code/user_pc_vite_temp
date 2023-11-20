/*
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 用户信息操作使用
 */
import { reactive } from 'vue';
import { api_account } from "project/activity/src/public/api/index";
import { uid } from 'quasar';
import BaseUserInfo from "project/activity/src/public/utils/user/base_user_info"
import Fp from 'project/activity/src/public/api/module/fingerprint/fp-sdk-1.0.0';
import { loadLanguageAsync } from 'project/activity/src/boot/i18n'
import langs from "project/activity/src/i18n/langs/index";
import userCtr from 'project/activity/src/public/utils/user/userCtr';

const state = reactive({
    uuid: "",
    // 用户信息
    user: {},
    show_balance: true,
    show_login_popup: {
        isShow: false,
        redirect: null
    },
    is_invalid: false,  //token是否失效
    // 用户是否长时间未操作
    is_user_no_handle: false,
    // 是否首次登录
    is_new_user: false
})

const userStore =  {
    getters: {
        get_uid() {
            // 当用户未登录时返回时空uuid, 当用户登录时返回userId
            return (state.user && state.user.uid) ? state.user.uid : state.uuid;
        },
        //获取用户id
        get_uuid() {
            return state.uuid;
        },
        //获取用户信息
        get_user() {
            const _merchantEventSwitchVO = state.user.merchantEventSwitchVO || {}
            // 系统级别   configValue  1 开  0 关
            // 商户级别   eventSwitch  1 开  0 关
            return {
                ...state.user,
                merchantEventSwitchVO: {
                    cornerEvent: Number(_merchantEventSwitchVO.cornerEvent),
                    penaltyEvent: Number(_merchantEventSwitchVO.penaltyEvent),
                    eventSwitch: Number(_merchantEventSwitchVO.configValue) && Number(_merchantEventSwitchVO.eventSwitch)
                }
            };
        },
        //获取用户token
        get_user_token() {
            return state.user.token;
        },
        // 获取登录弹窗状态
        get_show_login_popup() {
            return state.show_login_popup;
        },
        //是否显示余额
        get_show_balance() {
            return state.show_balance;
        },
        //用户是否长时间未操作
        get_is_user_no_handle() {
            return state.is_user_no_handle;
        },
        //登录是否失效
        get_is_invalid() {
            return state.is_invalid;
        },
        // 是否首次登录
        get_is_new_user() {
            return state.is_new_user;
        }
    },

    actions: {
        //设置用户id
        set_uuid(uuid_str) {
            commit("set_uuid", uuid_str);
        },
        //清除用户id
        clear_uuid() {
            commit("clear_uuid");
        },
        //设置用户信息
        set_user({ token, view, finish_callback }) {
            let userInfo = userStore.getters.get_user;
            // 获取用户基本信息
            if (view) {
                let reload_flg = false;
                let obj_ = {
                    // axios api对象
                    axios_api: api_account.get_user_info,
                    // axios api对象参数
                    params: { token },
                    // axios中then回调方法
                    fun_then: () => {
                        let userinfo_data = userCtr.get_getuserinfo_data()
                        let data = _.get(userinfo_data, 'data')
                        if (data) {
                            let languageList = _.isEmpty(data.languageList) ? [] : _.split(data.languageList, ',');
                            let _user_data = {
                                uid: data.userId, uname: data.userName, token,
                                callbackUrl: data.callbackUrl, balance: userInfo && userInfo.balance ? userInfo.balance : 0,
                                userBetPrefer: data.userBetPrefer,
                                userMarketPrefer: _.toUpper(data.userMarketPrefer), languageName: data.languageName,
                                languageList, settleSwitch: data.settleSwitch ? data.settleSwitch : 0,
                                merchantCode: data.merchantCode
                            }
                            //用户信息的 gr 分组参数 判定 流程
                            reload_flg = userCtr.check_getuserinfo_gr(userinfo_data)

                            // 用户信息的  内的 视频多久 无操作 时间判定  计算
                            let setting_no_handle_time = userCtr.compute_video_no_handle_time(userinfo_data)
                            //  用户信息的  内的 视频多久 无操作 有真值 则 执行 相关流程
                            if (view.check_user_no_handle && setting_no_handle_time) {
                                view.check_user_no_handle(setting_no_handle_time)
                            }
                            //修正用户主题样式
                            userCtr.repair_user_theme(data);



                            if (!reload_flg) {
                                // 隐藏首屏loading动画
                                view.$utils.loading_animation_hidden();
                            }
                            // 如果没有返回语言，默认为中文
                            let languageName = data.languageName || 'zh';
                            let lang_arr = Object.keys(langs)
                            if (!lang_arr.includes(languageName)) {
                                languageName = 'zh'
                            }
                            console.log('view---', view);
                            if (window.url_lang && window.url_lang != languageName && lang_arr.includes(window.url_lang)) {
                                data.languageName = window.url_lang;
                                languageName = data.languageName;
                                api_account.set_user_lang({ token: view.get_user_token, languageName: window.url_lang });
                                window.url_lang = null;
                            }


                            // 设置快速切换语言使用到的变量,因为window.vue.lang有延迟,改变了10s后设置为空
                            window.reset_lang = languageName;


                            let set_init_fun = () => {
                                let temp_obj = _.cloneDeep(data)
                                Object.assign(temp_obj, _user_data)
                                BaseUserInfo.set(temp_obj);
                                commit("set_user", temp_obj)
                                // 是否首次登录
                                commit("set_is_new_user", temp_obj.isNewUser || false)
                                if (window.vue) {
                                    // 加载诸葛埋点sdk js
                                    window.vue.$utils.zhuge_load_sdk_js(temp_obj.mId);
                                    // 配置埋点信息
                                    window.vue.$utils.gtag_config_send(temp_obj.userId);
                                    // 发送埋点事件
                                    window.vue.$utils.zhuge_identify(temp_obj.userId, { name: temp_obj.userName, m_id: temp_obj.mId });

                                    // 如果没有返回盘口，默认为欧洲盘
                                    let userMarketPrefer = 'EU';
                                    let project_name = window.env.config.FINAL_TARGET_PROJECT_NAME;

                                    // 专业版获取从接口拉去到的用户偏好进行设置，没有获取到默认为欧洲盘
                                    if (['yabo'].includes(project_name) && data.userMarketPrefer) {
                                        userMarketPrefer = _.toUpper(data.userMarketPrefer);
                                    }
                                    // 设置盘口偏好
                                    window.vue.set_cur_odd(userMarketPrefer);
                                    // window.vue.set_pre_odd(userMarketPrefer);
                                    // 设置语言
                                    window.vue.set_lang(_.toLower(languageName));
                                    window.vue.$i18n.locale = _.toLower(languageName);

                                    window.vue.vx_set_mix_min_count(_.get(temp_obj, 'configVO.minSeriesNum', 2));
                                    window.vue.vx_set_mix_max_count(_.get(temp_obj, 'configVO.maxSeriesNum', 10));

                                    let fingerprint = window.localStorage.getItem('fingerprint');
                                    // 若指纹信息不存在则通过api获取
                                    if (!fingerprint) {
                                        Fp.getFp(function (fpId, components, version) {
                                            api_account.save_finger_print({ fpId, components, version }).then(res => {
                                                const data = _.get(res, "data.data");
                                                const code = _.get(res, "data.code");
                                                if (code == 200) {
                                                    window.localStorage.setItem('fingerprint', JSON.stringify({ fpId, components, version }));
                                                }
                                            });
                                        });
                                    }
                                }
                                api_account.check_balance({ uid: data.userId }).then(res => {
                                    const rs = _.get(res, "data.data");
                                    const code = _.get(res, "data.code");

                                    if (code == 200) {
                                        commit("set_user_balance", rs.amount);
                                    } else {
                                        commit("clear_user_token");
                                    }
                                });
                                // 发送用户基本信息到服务器
                                view.$root.$emit('EMIT_API_USER_PRO_INFO_CMD');
                                // window.opener.postmessage({name:"EMIT_API_USER_PRO_INFO_CMD"},"*")
                                view.$root.$emit('update-bonus', { id: 1, type: 'update_bonus' });

                                userCtr.set_web_meta_by_config()
                                view.is_init_config = true
                                view = null
                            }


                            // 设置国际化语言
                            loadLanguageAsync(languageName).then().finally(() => {
                                set_init_fun();

                                finish_callback && finish_callback()
                            });
                        } else {
                            // 拉不到用户数据 让逻辑报错 重新拉取接口
                            // data = a
                            // if(!reload_flg){
                            //   // 发送事件-隐藏首屏loading动画
                            //   view.$root.$emit('loading_animation_hidden');
                            // }
                            userCtr.set_web_meta_by_config()
                            view.is_init_config = true
                            // view = null

                            finish_callback && finish_callback()
                        }

                    },
                    // axios中catch回调方法
                    fun_catch: err => {
                        console.log('获取用户信息失败', err);
                        userCtr.set_web_meta_by_config()
                        view.is_init_config = true
                        if (window.vue) {
                            // 设置登录无效


                            // commit("set_is_invalid", true)
                            // window.vue.show_fail_alert();
                        }
                        if (!reload_flg) {
                            // 隐藏首屏loading动画
                            view.$utils.loading_animation_hidden();
                        }
                        view = null
                        if (finish_callback) {
                            finish_callback();
                        }
                    },
                    // 最大循环调用次数(异常时会循环调用),默认3次
                    max_loop: 2,
                    // 异常调用时延时时间,毫秒数,默认1000
                    timers: 2000
                }
                // axios_api轮询调用方法
                view.$utils.axios_api_loop(obj_);
            }
        },
        //更新用户余额
        set_user_balance(balance) {
            commit("set_user_balance", balance);
        },
        //设置用户余额是否展示状态
        set_show_balance(val) {
            commit("set_show_balance", val);
        },
        //  清除用户信息
        clear_user() {
            commit("clear_user");
        },
        //  清除用户token
        clear_user_token() {
            commit("clear_user_token");
        },
        //  设置登录弹窗状态
        set_show_login_popup(val) {
            commit("set_show_login_popup", val);
        },
        //保存token状态（是否失效）
        set_is_invalid(val) {
            commit("set_is_invalid", val);
        },
        //更新用户信息
        set_user_assign(val) {
            commit("set_user_assign", val);
        },
        //设置用户是否长时间未操作
        set_is_user_no_handle(val) {
            commit("set_is_user_no_handle", val);
        },
        // 是否首次登录
        set_is_new_user(val) {
            commit("set_is_new_user", val);
        },
        set_user_bet_prefer(val) {
            let userInfo = _.cloneDeep(window.vue.$store.getters.get_user);
            userInfo.userBetPrefer = val;
            BaseUserInfo.set(userInfo);
            commit("set_user", userInfo)
        }
    },

    mutations: {
        //保存用户id
        set_uuid(uuid_str) {
            if (uuid_str) {
                state.uuid = uuid_str;
            } else {
                let unique = localStorage.getItem("unique_uuid");
                if (unique) {
                    state.uuid = unique;
                } else {
                    state.uuid = uid().replace(/-/g, "");
                    localStorage.setItem("unique_uuid", state.uuid);
                }
            }
        },
        //清除用户id
        clear_uuid(state) {
            state.uuid = "";
            localStorage.setItem("unique_uuid", state.uuid);
        },
        //保存用户信息
        set_user(data) {
            state.user = data;
            state.is_invalid = false;
        },
        //更新用户余额
        set_user_balance(balance) {
            state.user.balance = balance;
        },
        //设置用户余额是否展示状态
        set_show_balance(val) {
            state.show_balance = val;
        },
        //  清除用户token
        clear_user_token(state) {
            delete state.token;
        },
        //  清除用户信息
        clear_user(state) {
            if (state.user) {
                for (const key in state.user) {
                    delete state.user[key];
                }
            }
            state.user = '';
        },
        //保存用户token
        set_user_token(token) {
            if (state.user) {
                Object.assign(state.user, { token });
            } else {
                state.user = { token };
            }
        },
        // 设置登录弹窗状态
        set_show_login_popup(val) {
            state.show_login_popup = Object.assign(state.show_login_popup, val)
        },
        //保存token状态（是否失效）
        set_is_invalid(val) {
            state.is_invalid = val;
        },
        //设置用户是否长时间未操作
        set_is_user_no_handle(val) {
            state.is_user_no_handle = val;
        },
        // 是否首次登录
        set_is_new_user(val) {
            state.is_new_user = val;
        },
        //更新用户信息
        set_user_assign(obj) {
            if (state.user && obj) {
                Object.assign(state.user, obj);
            }
        }
    }
};

/**
 * mutation commit
 * @param {*} flag 
 * @param  {...any} args 
 * @returns 
 */
function commit(flag, ...args) {
    return userStore.mutations[flag].apply(null, ...args);
}


export default userStore;

