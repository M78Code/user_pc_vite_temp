<!--
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 公告栏滚动组件
-->
<template>
  <div class="marquee-wrap col">
    <!-- 内嵌收起菜单 左侧 注单历史/赛果 -->
    <div class="iframe-tab-wrapper iframe-tab-wrapper-left" v-show="is_iframe && get_menu_collapse_status">
      <div
        class="tab-item"
        v-for="(tab, index) in left_tabs"
        :key="index"
        @click="menu_change(tab)"
      >{{tab.tab_name}}</div>
    </div>

    <div class="label line-height">{{$root.$t('common.notice')}}</div>
    <div class="content col cursor-pointer  relative-position" ref="wrap" @click="$emit('navigate',{path: '/announce',_blank: true})">
      <!--谷歌浏览器  -->
      <marquee
        v-if="$q.platform.is.name == 'chrome'"
        class="line-height fit"
        scrollAmount="40"
        onMouseOut="this.start()"
        onMouseOver="this.stop()"
        v-html="data"
        scrolldelay="1000"
        truespeed="1000"
      ></marquee>
      <!-- 火狐浏览器 -->
      <div v-else class="animation-wrap line-height" ref="marquee" @mouseenter="animation_pause" @mouseleave="animation_start" v-html="data"></div>
    </div>

    <!-- 内嵌收起菜单 右侧 体育竞猜规则/任务中心/设置 -->
    <div class="iframe-tab-wrapper yb-ml20" v-show="is_iframe && get_menu_collapse_status" v-if="is_iframe || (is_iframe && get_menu_collapse_status)">
      <div
        :class="get_theme.includes('y0') ? `tab-icon-item-y0-${tab.icon_name}` : `tab-icon-item-${tab.icon_name}`"
        v-for="(tab, index) in (get_lang === 'zh' ? right_tabs.slice(0, 2) : right_tabs.slice(0, 1))"
        v-if="show_menu_icon(tab.id)"
        :key="index"
        @click="menu_change(tab)"
        @mouseenter="show_gif($event, tab, index)"
        @mouseleave="hide_gif($event, tab, index)"
      >
        <img
            v-show="tab.is_show"
            :ref="get_theme.includes('y0') ? tab.icon_name + '_y0' : tab.icon_name"
            :src="`${$g_image_preffix}/image/wwwassets/yabo/gif/${tab.icon_name}${get_theme.includes('y0') ? '_y0' : ''}.gif`"
            class="tab-icon-img"
        >
        <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style+';transform:translateY(34px)'"
        >{{$root.$t(tab.tab_name)}}</q-tooltip>
      </div>

      <settings />
      <popupLanguage />

    </div>
  </div>
</template>

<script>
import { api_announce } from "src/public/api/index";
import g_settings from 'src/public/components/settings/index.vue';
import langs from "src/i18n/langs/index.mjs";
import settings from "./child/settings.vue"
import popupLanguage from "./child/popup_language.vue"
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    'g-settings': g_settings,
    settings,
    popupLanguage
  },

  mounted() {
    this.is_destroy = false

    const announceData = localStorage.getItem("announceData")
    let today = new Date().getTime()
    let saveTime = 0
    if(JSON.parse(announceData)){
      saveTime  = new Date(JSON.parse(announceData).time).getTime()
    }
    if(announceData && (today - saveTime)/1000/60/60/24 <= 2 ){
      this.data = JSON.parse(announceData).text
      if (this.get_data_timer) {
          clearTimeout(this.get_data_timer)
          this.get_data_timer =null
          };
      this.get_data_timer = setTimeout(() => {
        this.get_marquee_data()
      }, 6000);
    }else{
      this.get_marquee_data();
    }
    if(this.$q.platform.is.name == 'chrome'){
      return
    }
    if (this.run_timer) {
          clearTimeout(this.run_timer)
          this.run_timer =null
          };
    this.run_timer = setTimeout(()=>{
      if(this.is_destroy){
        return
      }
      //设置宽度
      this.marquee_obj = this.$refs.marquee
      this.total_width = -parseInt(this.marquee_obj.offsetWidth);
      this.wrap_width = parseInt(this.$refs.wrap.offsetWidth);

      this.timer_id = setInterval(this.animation,this.timer_interval)

    },5000)
  },
  destroyed(){
    this.is_destroy = true
    this.clear_timer()
  },
  data() {
    return {
      total_width: 0,//公告栏总宽度
      wrap_width:0,//公告栏包裹宽度
      pause: false,//滚动是否暂停
      translateX:0,//滚动偏移量
      speed:1.5,//滚动速度
      timer_interval:32,//滚动时间间隔
      data:'',//公告栏数据
      is_iframe: window.is_iframe, // 是否内嵌
      show_g_settings: false,
      // 内嵌版 收起左侧菜单
      left_tabs: [
        { id: 2, tab_name: this.$root.$t('common.note_single_history'), path: "/bet_record",_blank:true}, //注单历史
        { id: 4, tab_name: this.$root.$t("common.amidithion"), path: "/match_results", _blank:true}, //赛果
      ],
      // 内嵌版 收起右侧菜单
      right_tabs: [
        { id: 7, icon_name: 'sports_rules', tab_name: this.$root.$t("common.sports_betting_rules"), path: "/rule", is_show: false, _blank:true }, //体育竞猜规则
        { id: 9, icon_name: 'task_center', tab_name: "任务中心", icon: '', class: "activity_center animate-activity-entry activity_dot_bonus", path: "/activity", is_show: false, _blank: true},  // 任务中心
        { id: 99, icon_name: 'settings', tab_name: this.$root.$t("common.set"), is_show: false},  // 设置
        
      ],
    };
  },
  computed: {
    ...mapGetters([
      'get_lang',
      'get_theme',
      'get_menu_collapse_status',
      'get_user_token',
      'get_global_switch'
    ]),
    ...mapGetters({
      get_global_click: "get_global_click",
      // 获取用户信息
      vx_get_user: "get_user",
    })
  },
  methods: {
    ...mapActions({
      vx_set_user: "set_user",
    }),
    // 内嵌版右侧菜单图标显示
    show_menu_icon(icon_id) {
      // 中文语言下不存在活动内容，则不显示任务中心图标
      if (this.get_lang === 'zh' && icon_id === 9 && !_.get(this.vx_get_user, 'activityList.length')) {
        return false
      }
      return true
    },
    /**
     * @Description: 内嵌版 菜单折叠后 点击处理
     * @param menu 当前点击菜单对象
     */
    menu_change(menu) {
      if(menu.path.includes('/activity') && !this.get_global_switch.activity_switch) return this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t("msg.msg_09"));
      if (menu.path.includes('/activity')) {
        if(this.get_user_token) {
          this.$utils.send_zhuge_event("PC_任务中心");
          // 记录用户点击活动入口，每点击一次计算一次，不在活动内计算
          this.$utils.gtag_event_send('PC_activity_click', 'PC_活动', 'PC_活动中心', new Date().getTime())
          this.vx_set_user({ token:this.get_user_token,view:this });
        }
      }

      this.$emit('navigate', menu)
    },
    /**
     * @Description 内嵌版 折叠菜单 鼠标悬浮显示 gif
     * @param e 当前事件
     * @param tab 菜单对象
     * @param index 右侧菜单下标
     */
    show_gif(e, tab, index) {
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
        this.$refs[icon_name + '_y0'][0].stop && this.$refs[icon_name + '_y0'][0].stop()
      } else {
        this.$refs[icon_name][0].stop && this.$refs[icon_name][0].stop()
      }
    },
    /**
     * @Description: 内嵌版 菜单折叠后 点击设置按钮处理
     * @param
     */
    handle_settings_click() {
      let show_g_settings = !this.show_g_settings

      clearTimeout(this.settings_timer)
      this.settings_timer =setTimeout(()=>{
        this.show_g_settings = show_g_settings
      },50)
    },
    /**
     * @Description:公告栏文字滚动动画
     * @return {undefined} undefined
     */
    animation() {
      if(!this.pause){
        this.translateX -= this.speed
        if(this.translateX < this.total_width){
          this.translateX = this.wrap_width
        }
        this.marquee_obj.style.transform = `translateX(${this.translateX}px)`
      }
    },
    /**
     * @Description:动画暂停
     * @return {undefined} undefined
     */
    animation_pause() {
      this.pause = true
    },
    /**
     * @Description:动画开始
     * @return {undefined} undefined
     */
    animation_start(){
      this.pause = false
    },
    /**
     * @Description:获取公告栏数据
     * @return {undefined} undefined
     */
    get_marquee_data() {
      this.data = ""
      api_announce.post_marquee_data().then(res=>{
        if (res && res.data && res.data.code == 200 && res.data.data) {
          _.each(_.get(res,'data.data'), (item,index) => {
            if(index != 0){
              this.data += '&ensp;&ensp;&ensp;&ensp;'
            }
            this.data += item.context
          })

          let obj = {
            text: this.data,
            time: new Date()
          }
          localStorage.setItem("announceData", JSON.stringify(obj))
        }
      })
    },
    // 清除当前组件所有定时器
    clear_timer() {
      // timeout定时器列表
      const timeout_timer_arr = [
        'get_data_timer',
        'run_timer',
        'settings_timer',
        'show_gif_timer',
      ]

      // interval定时器列表
      const interval_timer_arr = [
        'timer_id'
      ]

      // 批量清除timeout定时器
      for (const timer of timeout_timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }

      // 批量清除interval定时器
      for (const timer of interval_timer_arr) {
        clearInterval(this[timer])
        this[timer] = null
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.marquee-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  .iframe-tab-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 5px;
    &.iframe-tab-wrapper-left {
      margin-right: 20px;
    }
    .tab-item {
      cursor: pointer;
      height: 22px;
      line-height: 22px;
      padding: 0 12px;
      color: #ffffff;
      border: none;
      border-radius: 26px;
      &:first-child {
        margin-right: 5px;
      }
    }

    [class*=tab-icon-item] {
      cursor: pointer;
      width: 22px;
      height: 22px;
      margin-left: 8px;
      :deep(.tab-icon-img) {
        width: 22px;
        height: 22px;
      }
    }
    .tab-icon-item {
      &-sports_rules {
        background-image: url("~public/image/yabo/svg/sports_rules.svg");
        background-size: cover;
      }
      &-task_center {
        background-image: url("~public/image/yabo/svg/task_center.svg");
        background-size: cover;
      }
      &-settings {
        background-image: url("~public/image/yabo/svg/settings.svg");
        background-size: cover;
      }
    }
    .tab-icon-item-y0 {
      &-sports_rules {
        background-image: url("~public/image/yabo/svg/sports_rules_y0.svg");
        background-size: cover;
      }
      &-task_center {
        background-image: url("~public/image/yabo/svg/task_center_y0.svg");
        background-size: cover;
      }
      &-settings {
        background-image: url("~public/image/yabo/svg/settings_y0.svg");
        background-size: cover;
      }
    }
  }
  .line-height {
    height: 100%;
    line-height: 36px;
  }
  .label {
    padding: 0 6px;
    height: 22px;
    line-height: 22px !important;
    text-align: center;
    margin-right: 10px;
  }
  .content {
    height: 100%;
    overflow: hidden;
  }
  .animation-wrap {
    position: absolute;
    white-space: nowrap;
  }
}
</style>
