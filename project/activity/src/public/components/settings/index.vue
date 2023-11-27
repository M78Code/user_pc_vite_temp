<!--
 * @Author: MasterJ
 * @Date: 2022-08-03 14:48
 * @Description 公共设置组件
-->
<template>
  <div class="g-settings" style="max-width: 350px">
    <q-menu
      v-model="show_g_settings"
      self="bottom middle"
      :offset="[0, -32]"
      :content-class="get_theme.includes('y0')?'g-settings-style':get_menu_collapse_status?'g-settings-style':'g-settings-style-new'"
    >

      <q-list bordered class="rounded-borders">
        <div v-for="(settings, key) in settings_items_list" :key="settings.id">

          <!-- 全局设置项 -->
          <q-expansion-item
            group="settings"
            :expand-icon-class="settings.type === 'switch' ? 'settings-no-expand' : ''"
            :header-class="settings.type === 'switch' ? 'settings-item-header' : ''"
            expand-icon="icon-triangle1"
          >
            <template v-slot:header>
              <!-- 设置项 图标 -->
              <q-item-section avatar>
                <i class="icon settings-icon" :style="`background: url('${get_theme.includes('theme01') ? settings.icon.day : settings.icon.night}') no-repeat center`"></i>
              </q-item-section>

              <!-- 设置项 名称 -->
              <q-item-section>
                <div class="settings-label">{{ settings.name }}</div>
              </q-item-section>

              <!-- 设置项 当前状态 -->
              <q-item-section side>
                <div class="row items-center">

                  <!-- 盘口/多语言 -->
                  <div class="curr-item" v-if="settings.type === 'select'">
                    <template v-if="settings.id === 1">{{$root.$t('odds')[vx_cur_odd]}}</template>
                    <template v-else-if="settings.id === 2">{{langs[lang]}}</template>
                    <template v-else-if="settings.id === 3">{{ filter_time[time_value] }}</template>
                  </div>


                   <!-- 主题设置 -->
                   <div v-else>
                    <div v-if="settings.id === 3"  @click="change_theme" class="skin-toggle">
                    <div class="skin-icon skin-icon-day"></div>
                    <div class="skin-icon skin-icon-night"></div>
                  </div>
                   <!-- 版本设置 -->
                   <div v-if="settings.id === 5"  @click="change_version(current_version)" class="skin-toggle">
                    <div :class="{'skin-icon' :true,
                      'skin-version-old':current_version=='old'}" ></div>
                    <div :class="{'skin-icon' :true,
                      'skin-icon-night':current_version=='new'}"></div>
                  </div>
                  </div>
                </div>
              </q-item-section>
            </template>

            <q-card v-if="settings.type === 'select'">
              <q-card-section>

                <!-- 盘口选项 -->
                <!-- <template v-if="settings.id === 1">
                  <template v-for="(item,index) in settings.value_arr">
                    <div
                        v-if="['EU','HK'].includes(item.value)"
                        :key="index"
                        class="child-item item-odds relative-position"
                        :class="vx_cur_odd == item.value && 'active'"
                        @click="on_click_handicap(item)"
                    >
                      {{item.label}}
                      <i v-if="vx_cur_odd == item.value" class="icon-triangle3 q-icon c-icon arrow-show"></i>
                    </div>
                  </template>
                </template> -->

                <!-- 多语言选项 -->
                <!-- <template v-else-if="settings.id === 2">
                  <template v-for="(language, index) in settings.value_arr">
                    <div v-if="languageList.includes(language)" :key="index" class="child-item ellipsis relative-position" :class="[{active:lang==language}]" @click="on_click_lang(language)">
                      <span :class="['flag', language]"></span>{{langs[language]}}
                      <i v-if="lang==language" class="icon-triangle3 q-icon c-icon arrow-show"></i>
                    </div>
                  </template>
                </template> -->

                <!-- 近期开赛 -->
                <template v-if="settings.id === 3">
                  <template v-for="(item, index) in settings.value_arr">
                    <div :key="index" class="child-item item-odds relative-position"
                      :class="vx_cur_odd == item.value && 'active'" @click="select_time_change(item)">
                      {{ item.label }}
                      <i v-if="vx_cur_odd == item.value" class="icon-triangle3 q-icon c-icon arrow-show"></i>
                    </div>
                  </template>
                  </template>


              </q-card-section>
            </q-card>
          </q-expansion-item>

        </div>

      </q-list>

    </q-menu>

  </div>
</template>

<script>
import {mapGetters, mapMutations ,mapActions} from "vuex";
import {api_account, api_betting, api_details} from "src/public/api";
import {loadLanguageAsync} from "boot/i18n";
import langs from "src/i18n/langs/index.mjs";
export default {
  name: "settings",
  props: {
    el: {
      type: String,
      default: ''
    },
    show_settings: {
      type: Boolean,
      default: false
    },
    settings_items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      skin: false,
      langs,
      current_version:'new',
       time_value:null,
      filter_time: {
        null: this.$t('common.all'),
        3: this.$t('filter.select_time.3h'),
        6: this.$t('filter.select_time.6h'),
        9: this.$t('filter.select_time.9h'),
        12: this.$t('filter.select_time.12h'),
      }

    }
  },
  created() {
    let session_version = sessionStorage.getItem("current_version")
    this.current_version = session_version? session_version:( location.host.includes('user-pc-new')?"new":'old')
    sessionStorage.setItem("current_version",this.current_version)
  },
  computed: {
    ...mapGetters([
      'get_theme',
      'get_user',
    ]),
    ...mapGetters({
       get_theme:'get_theme',
      vx_cur_odd: "get_cur_odd",
      vx_get_pre_odd: "get_pre_odd",
      lang: "get_lang",
      vx_is_bet_single: 'is_bet_single',
      // 单关投注对象
      vx_get_bet_single_obj: 'get_bet_single_obj',
      // 串关投注对象
      vx_get_bet_obj: 'get_bet_obj',
      // 是否为虚拟体育投注
      vx_get_is_virtual_bet: "get_is_virtual_bet",
      // 虚拟投注列表对象
      vx_get_virtual_bet_obj: "get_virtual_bet_obj",
      vx_cur_menu_type: "get_cur_menu_type",
      get_global_click: "get_global_click",
      vx_get_user: "get_user", // 获取用户信息
      get_menu_collapse_status:"get_menu_collapse_status", // 获取菜单收起状态
       // 获取当前菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
    }),
    languageList() {
      return _.get(this.get_user,'languageList', [])
    },
    show_g_settings: {
      get() {
        return this.show_settings
      },
      set(val) {

      }
    },
    // 菜单收起隐藏新版本切换
    settings_items_list(){
      let type_name = this.vx_cur_menu_type.type_name;
      let list = JSON.parse(JSON.stringify(this.settings_items))
      if(!['today'].includes(type_name)) {  // 今日才显示近期开赛
        list = list.filter(item=>item.id!==3)
      }

      if (this.get_theme.includes('y0')) {
        if (!this.get_menu_collapse_status) {
        return list.filter(item=>item.id!==5)
      }else{
        return list
      }
      }else{
        return list.filter(item=>item.id!==5)
      }
  }
},
  methods: {
    ...mapActions([
    'set_theme',
    ]),
    ...mapMutations([
      'set_lang',
      'set_lang_change',
      'set_user_assign',
      'set_cur_odd',
      'set_pre_odd',
      'set_filter_select_obj',
      'set_select_time'
    ]),

        /**
 * 近期开赛筛选
 */
    select_time_change(item) {
      this.time_value = item.value
      //设置session
      sessionStorage.setItem('is_select_time', '1')
      this.set_select_time(item.value);
      //清空联赛筛选条件
      this.set_filter_select_obj([]);
      this.$root.$emit(this.emit_cmd.EMIT_FETCH_MATCH_LIST, {});
    },
  


    /**
     * @Description:切换盘口
     * @param {object} row 盘口数据
     * @return {undefined} undefined
     */
    on_click_handicap(row) {
      if(this.vx_cur_odd != row.value) {
        this.set_user_preference(row.value);
      }
      this.$emit('auto_close')
    },
    /**
     * @Description:切换语言
     * @param {string} lang_ 语言
     * @return {undefined} undefined
     */
     on_click_lang(lang_) {
      if (this.$route.name == "search") {
        this.$router.push("/home")
      }
      // 冠军菜单不支持语言切换投注项名称国际化
      let is_winner = $menu.menu_data.match_tpl_number == 18;
      let fun = () => {
        if (!is_winner && this.lang != lang_) {
          this.set_lang_change(true);
          /* ids:是各种id，格式：赛事id-玩法id-盘口id-投注项id,赛事id-玩法id-盘口id-投注项id,...
          type:0表示普通赛事(默认值)，1虚拟赛事 */
          let type = this.vx_get_is_virtual_bet ? 1 : 0;
          let ids = [], bet_type;
          if (this.vx_get_is_virtual_bet) {
            bet_type = 'vx_get_virtual_bet_obj';
          } else if (this.vx_is_bet_single) {
            bet_type = 'vx_get_bet_single_obj';
          } else {
            bet_type = 'vx_get_bet_obj';
          }
          for (let obj of Object.values(this[bet_type])) {
            let match_id = _.get(obj, 'cs.match_id', '');
            let handicap_id = _.get(obj, 'cs.handicap_id', '');
            let play_id = _.get(obj, 'cs.play_id', '');
            let oid = _.get(obj, 'cs.oid', '');
            if (!_.isEmpty(match_id) &&
              !_.isEmpty(handicap_id) &&
              !_.isEmpty(play_id) &&
              !_.isEmpty(oid)) {
              ids.push(`${match_id}-${play_id}-${handicap_id}-${oid}`);
            }
          }
          if (!_.isEmpty(ids)) {
            if ($menu.menu_data.is_esports) {
              type = 2;
            }
            let params = {
              ids: ids.join(','),
              type
            }
            api_details.get_bet_olds(params).then(res => {
              let data = _.get(res, 'data.data');
              if (_.isArray(data) && data.length > 0) {
                if (this.vx_get_is_virtual_bet) {
                  this.virtual_common.update_bet_item_info(this, data);
                } else {
                  this.yabo_common.update_bet_item_info(this, data);
                }
                this.$root.$emit(this.emit_cmd.EMIT_UPDATE_HOME_AWAY_CMD);
                this.set_lang_change(false);
              }
            }).catch(error => {
              console.log(error);
            });
          }
        }
      }
      if (this.lang != lang_) {
        let user = this.get_user
        api_account.set_user_lang({ token: user.token, languageName: lang_ }).then(res => {
          let code = _.get(res, 'data.code');
          if (code == 200) {
            this.set_user_assign({ languageName: lang_ })
            this.set_lang(lang_);
            window.reset_lang = lang_;
            // 设置即将开赛筛选默认值为全部
            this.$store.state.filter.open_select_time = null;
            // 设置国际化语言
            loadLanguageAsync(lang_).then().finally(() => {
              fun();
              window.reset_lang = '';
            })
          }else if(code =='0401038'){
            this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t("common.code_empty"),3000);
          }
        })
      }
	  },
    /**
     * @Description:切换主题
     * @return {undefined} undefined
     */
    change_theme() {
      if (this.get_theme.includes('theme01')) {
        this.handle_set_theme('theme02')
      } else {
        this.handle_set_theme('theme01')
      }

      this.$emit('auto_close')
    },
    // 设置主题
    handle_set_theme(theme) {
      const curr_theme = this.get_theme

      if (curr_theme.includes('y0')) {
        this.set_theme(theme + '_y0')
      } else {
        this.set_theme(theme)
      }
    },
    /**
     * @Description:设置用户偏好
     * @param {string} curr_odd 目标盘口
     * @return {undefined} undefined
     */
    set_user_preference(curr_odd) {
      if(curr_odd) {
        let old_odd = this.vx_cur_odd
        let old_pre_odd = this.vx_get_pre_odd
        this.set_pre_odd(curr_odd);
        this.set_cur_odd(curr_odd);
        // 设置用户偏好
        api_betting.record_user_preference({userMarketPrefer: curr_odd}).then((res)=>{
          let code = _.get(res, 'data.code');
          if(code != 200) {
            this.set_pre_odd(old_pre_odd);
            this.set_cur_odd(old_odd);
          }
        }).catch(err => {
          console.error(err);
          this.set_pre_odd(old_pre_odd);
          this.set_cur_odd(old_odd);
        });
      }
    },
            /**
     * @Description:切换版本
     * @return {undefined} undefined
     */
     change_version(version) {
      const {current_env} = window.env.config
      const _arr = current_env=='local_test'?'test-user-pc':'user-pc-bw4'
      const token = sessionStorage.getItem("pc_token")
      const gr = (sessionStorage.getItem("gr") ||'').toLocaleLowerCase()
      const original_url = sessionStorage.getItem("original_url")
      let old_url = new URL(original_url)
      let  host    = old_url.host
      let host_arr =host.split('.')
      host_arr[0] =  _arr
      this.current_version = 'new'
      sessionStorage.setItem("current_version",this.current_version)
      host = host_arr.join('.')
      old_url.host = host
      let search =old_url.search
      //应对参数丢失 情况
      if(!search.includes('token=')){
        if(search){
          old_url.search +=`&token=${token}&gr=${gr}`
        }else{
          old_url.search  =`?token=${token}&gr=${gr}`
        }
      }
      location.href = old_url.href

     },

  }
}
</script>

<style  lang="scss">
.g-settings-style {
  width: 240px;
  max-height: 700px !important;
  border-radius: 4px !important;
  padding: 5px 0 10px 0;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, .3));
  //filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, .05));
  overflow: unset;
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    top: -20px;
    left: 50%;
  }
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    top: -19px;
    left:50%;
  }
}
.g-settings-style-new {
  width: 240px;
  max-height: 700px !important;
  border-radius: 4px !important;
  padding: 5px 0 10px 0;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, .3));
  //filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, .05));
  overflow: unset;
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    top: -20px;
    left: 80%;
  }
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    top: -19px;
    left: 80%;
  }
}
.q-list--bordered {
    border: 0;
  }

  .settings-no-expand {
    display: none;
  }
  .settings-item-header {
    padding-right: 11px;
  }

  .skin-toggle {
    display: flex;
    width: 32px;
    height: 16px;
    justify-content: space-between;
    align-items: center;
    margin-right: 21px;
    padding: 0 3px;
    border-radius: 13px;
    .skin-icon {
      width: 8px;
      height: 8px;
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  .settings-icon {
    width: 14px;
    height: 14px;
  }

  .child-item {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 16px 0 17px;
    cursor: pointer;

    .flag {
      width: 14px;
      height: 10px;
      display: inline-block !important;
      background-image: url("~public/image/yabo/png/lang_flag.png");
      background-position-x: 0;
      background-repeat: no-repeat;
      background-size: 100%;
      margin-right: 6px;
      &.en {
        background-position-y: -15px;
      }
      &.tw {
        background-position-y: -30px;
      }
      &.vi {
        background-position-y: -45px;
      }
      &.ms  {
        background-position-y: -60px;
      }
      &.th {
        background-position-y: -75px;
      }
      &.ad {
        background-position-y: -90px;
      }
      &.mya {
        background-position-y: -105px;
      }
      &.ry {
        background-position-y: -120px;
      }
      &.pt {
        background-position-y: -135px;
      }
      &.ko {
        background-position-y: -150px;
      }
    &.es {
      background-position-y: -165px;
     }
    }

    i.arrow-show {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-weight: 700;
    }
  }

  i.icon-triangle1 {
    font-weight: 700;
  }

  .q-item {
    min-height: 40px;
  }

  .q-card__section {
    padding: 0;
  }

  .q-item__section--side {
    padding-left: 4px;
    &.q-item__section--avatar {
      min-width: 14px;
      padding-right: 6px;
      padding-left: 0;
    }
    .q-expansion-item__toggle-icon {
      font-size: 12px;
    }
  }


</style>
