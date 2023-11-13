<template>
    <div class="iframe-settings" :class="get_theme.includes('y0') ? `tab-icon-item-y0-settings` : `tab-icon-item-settings`"
        @click="handle_settings_click" @mouseenter="show_gif($event, { icon_name: 'settings' }, 2)"
        @mouseleave="hide_gif($event, { icon_name: 'settings' }, 2)">
        <!-- 设置浮层弹窗 -->
        <g-settings v-if="show_g_settings" :show_settings="show_g_settings" :el="'.iframe-settings'"
            :settings_items="settings_items" @auto_close="show_g_settings = !show_g_settings"></g-settings>

        <!-- 设置tip -->
        <q-tooltip v-if="!text" anchor="top middle" self="center middle"
            :content-style="tooltip_style + ';transform:translateY(34px)'">{{ $root.$t('common.set') }}</q-tooltip>
        <div class="user_setting" :class="show_g_settings ? 'active' : ''"
            :ref="get_theme.includes('y0') ? 'settings_y0' : 'settings'" v-if="text">
            {{ text }}
            <div class="yb-icon-arrow"></div>
        </div>
        <!-- hover显示gif -->
        <img v-else v-show="right_tabs[2].is_show" :ref="get_theme.includes('y0') ? 'settings_y0' : 'settings'"
            :src="`${$g_image_preffix}/image/wwwassets/yabo/gif/${get_theme.includes('y0') ? 'settings_y0' : 'settings'}.gif`"
            class="tab-icon-img">

    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import g_settings from 'src/public/components/settings/index.vue';
import langs from "src/i18n/langs/index.mjs";
export default {
    name: "settings",
    components: {
        'g-settings': g_settings,
    },
    props: {
        text: {
            type: String,
            default: ''
        },
    },
    data() {
        let hour = this.$t('common.hour')
        return {
            show_g_settings: false,
            // 内嵌版 收起右侧菜单
            right_tabs: [
                { id: 7, icon_name: 'sports_rules', tab_name: this.$root.$t("common.sports_betting_rules"), path: "/rule", is_show: false, _blank: true }, //体育竞猜规则
                { id: 9, icon_name: 'task_center', tab_name: "任务中心", icon: '', class: "activity_center animate-activity-entry activity_dot_bonus", path: "/activity", is_show: false, _blank: true },  // 任务中心
                { id: 99, icon_name: 'settings', tab_name: this.$root.$t("common.set"), is_show: false },  // 设置
            ],
            settings_items: [
            {
                    id: 5,
                    name: '新版本',
                    icon: {
                        day: require('public/image/yabo/svg/icon-version.svg'),
                        night: require('public/image/yabo/svg/icon-version-night.svg')
                    },
                    value_arr: [
                    ],
                    type: 'switch'
                },
                // {
                //     id: 1,
                //     name: this.$root.$t('common.odds_set'),
                //     icon: {
                //         day: require('public/image/yabo/svg/icon-odds.svg'),
                //         night: require('public/image/yabo/svg/icon-odds-night.svg')
                //     },
                //     value_arr: [
                //         { label: this.$root.$t('odds.EU'), value: "EU", icon: 'panda-icon-contryEU', id: 1 },//欧洲盘
                //         { label: this.$root.$t('odds.ID'), value: "ID", icon: 'panda-icon-contryYN', id: 6 },//印尼盘
                //         { label: this.$root.$t('odds.US'), value: "US", icon: 'panda-icon-contryUS', id: 5 },//美式盘
                //         { label: this.$root.$t('odds.MY'), value: "MY", icon: 'panda-icon-contryML', id: 3 },//马来盘
                //         { label: this.$root.$t('odds.GB'), value: "GB", icon: 'panda-icon-contryUK', id: 4 },//英式盘
                //         { label: this.$root.$t('odds.HK'), value: "HK", icon: 'panda-icon-contryHK', id: 2 },//香港盘
                //     ],
                //     type: 'select'
                // },
                // {
                //     id: 2,
                //     name: this.$root.$t('common.change_lang'),
                //     icon: {
                //         day: require('public/image/yabo/svg/icon-lang.svg'),
                //         night: require('public/image/yabo/svg/icon-lang-night.svg'),
                //     },
                //     value_arr: Object.keys(langs),
                //     type: 'select'
                // },

                {
                    id: 3,
                    name: this.$root.$t('common.match_soon_filtr'),
                    icon: {
                        day: require('public/image/yabo/svg/icon-time.svg'),
                        night: require('public/image/yabo/svg/icon-time-night.svg'),
                    },
                    value_arr: [
                        { label: this.$t('common.all'), title: this.$t('common.all'), value: null },
                        { label: this.$t('filter.select_time.3h'), title: '3' + hour, value: 3 },
                        { label: this.$t('filter.select_time.6h'), title: '6' + hour, value: 6 },
                        { label: this.$t('filter.select_time.9h'), title: '9' + hour, value: 9 },
                        { label: this.$t('filter.select_time.12h'), title: '12' + hour, value: 12 },
                    ],
                type: 'select'
                    },

        // {
        //     id: 4,
        //     name: this.$root.$t('common.change_skin'),
        //     icon: {
        //         day: require('public/image/yabo/svg/icon-skin.svg'),
        //         night: require('public/image/yabo/svg/icon-skin-night.svg'),
        //     },
        //     value_arr: [/*this.$root.$t('odds.HK'), this.$root.$t('odds.EU')*/],
        //     type: 'switch'
        // },
                ]
    }
},
computed: {
            ...mapGetters([
    'get_lang',
    'get_theme',
    'get_menu_collapse_status',
    'get_user_token',
    "get_global_click",
]),
        },
watch: {
    get_global_click() {
        this.show_g_settings = false
    }
},
methods: {
    /**
     * @Description 内嵌版 折叠菜单 鼠标悬浮显示 gif
     * @param e 当前事件
     * @param tab 菜单对象
     * @param index 右侧菜单下标
     */
    show_gif(e, tab, index) {
        if (this.text) { return }
        const icon_name = tab.icon_name

        // 显示gif
        this.$set(this.right_tabs[index], 'is_show', true)

        // 播放gif
        if (this.get_theme.includes('y0')) {
            if (!Array.isArray(this.$refs[icon_name + '_y0'])) {
                this.$refs[icon_name + '_y0'] = [this.$refs[icon_name + '_y0']]
            }
            this.$refs[icon_name + '_y0'][0].play && this.$refs[icon_name + '_y0'][0].play()
        } else {
            if (!Array.isArray(this.$refs[icon_name])) {
                this.$refs[icon_name] = [this.$refs[icon_name]]
            }
            this.$refs[icon_name][0].play && this.$refs[icon_name][0].play()
        }

        // gif播放完1次后，就停止播放
        clearTimeout(this.show_gif_timer)
        this.show_gif_timer = setTimeout(() => {
            this.$set(this.right_tabs[index], 'is_show', false)

            if (this.get_theme.includes('y0')) {
                this.$refs[icon_name + '_y0'][0].stop && this.$refs[icon_name + '_y0'][0].stop()
            } else {
                this.$refs[icon_name][0].stop && this.$refs[icon_name][0].stop()
            }
        }, 1800)
    },
    /**
     * @Description 内嵌版 折叠菜单 鼠标移开菜单后 显示 svg
     * @param e 当前事件
     * @param tab 菜单对象
     * @param index 右侧菜单下标
     */
    hide_gif(e, tab, index) {
        const icon_name = tab.icon_name
        // 隐藏gif
        this.$set(this.right_tabs[index], 'is_show', false)

        // 停止gif
        if (this.get_theme.includes('y0')) {
            this.$refs[icon_name + '_y0'][0] && this.$refs[icon_name + '_y0'][0].stop()
        } else {
            this.$refs[icon_name][0] && this.$refs[icon_name][0].stop()
        }
    },
    /**
     * @Description: 内嵌版 菜单折叠后 点击设置按钮处理
     * @param
     */
    handle_settings_click() {
        let show_g_settings = !this.show_g_settings

        clearTimeout(this.settings_timer)
        this.settings_timer = setTimeout(() => {
            this.show_g_settings = show_g_settings
        }, 50)
    },
},

    }
</script>

<style lang="scss" scoped>
    .user_setting {
        min-width: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--qq--settings-label-text-colo2);
        :deep(.yb-icon-arrow) {
            transition: transform 0.3s;
            transform: rotate(90deg);
            margin-left: 10px;
        }
    }
    .user_setting.active {
        :deep(.yb-icon-arrow) {
            transition: transform 0.3s;
            transform: rotate(270deg);
        }
    }

    :deep(.yb-icon-arrow) {
        transition: transform 0.3s;
        transform: rotate(90deg);
    }
.user_setting.active {
    :deep(.yb-icon-arrow) {
        transition: transform 0.3s;
        transform: rotate(270deg);
    }
}
</style>