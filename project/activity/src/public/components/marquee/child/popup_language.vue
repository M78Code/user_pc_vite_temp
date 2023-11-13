<template>
  <div class="popup-wrap  relative-position" :class="[versions_class,{active:show_popup}]">
    <div class="langeuage-text popup-text" :class="{'active': show_popup}" @click="toggle_popup">
      <div>
         <span :class="['flag-round lang-active',lang]"></span>
         <!-- <span class="lang-label ellipsis">{{langs[lang]}}</span> -->
      </div>
      <!-- <div class="yb-icon-arrow"></div> -->
    </div>

    <div class="wrap-language" v-if="show_popup">
      <div class="triangle"></div>
        <template v-for="(language, index) in language_arr">
          <div v-if="languageList.includes(language)" :key="index" class="item ellipsis" :class="[{active:lang==language}]" @click="on_click_lang(language)">
            <span :class="['flag',language]"></span>{{langs[language]}}
          </div>
        </template>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex"
import { api_account,api_details } from 'src/public/api/index';
import { loadLanguageAsync } from 'src/boot/i18n'
import langs from "src/i18n/langs/index.mjs";
export default {
  data() {
    return {
      show_popup: false,
      languageList: [],
      language_arr: Object.keys(langs),
      hits: 0,//点击数
      langs
    };
  },
  created() {
    this.languageList = _.get(this.get_user,'languageList') || [];
  }, 
  watch:{
    // 全局点击事件
    get_global_click(){
      if(this.hits%2==1){
        this.hits++;
        return;
      }
      this.show_popup = false;
    }
  },   
  destroyed(){
     this.languageList = null;
  },
  methods: {
    ...mapActions([
      "set_lang", // 设置语言
      "set_lang_change",
      "set_user_assign",
    ]),
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
    * @description:
    * @param {}
    * @return {}
    */
   toggle_popup(){
    this.hits++;
    if(_.isEmpty(this.languageList)) {
       this.languageList = _.get(this.get_user,'languageList') || [];
    }
    this.show_popup = !this.show_popup
   }
  },
  computed:{
    ...mapGetters({
      //语言
      lang: "get_lang",
      //用户信息
      get_user: "get_user",
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
    }),
    versions_class(){
			return `versions-${window.env.config.DEFAULT_VERSION_NAME}`
		}
  }
};
</script>

<style lang="scss" scoped>
/* 专业版 */
.versions-zhuanye {
  .langeuage-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    height: 100%;
    .lang-active{
       margin-left: 9px;
    }
    .lang-label {
      margin-right: 8px;
    }
    .yb-icon-arrow {
      transition: transform 0.3s;
      transform: rotateZ(90deg);
    }
    &.active {
      .yb-icon-arrow {
        transform: rotateZ(-90deg);
      }
    }
  }
  .wrap-language {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 4px 0px;
    min-width: 116px;
    border-radius: 6px;
    background-color: var(--qq--wrap-lang-bg-color);
    color:var(--qq--theme-color-bet-zone);;
    text-align: left;
    .item {
      display: flex;
      align-items: center;
      height: 26px;
      cursor: pointer;
      padding: 0 8px;
      padding-left: 20px;
      &:hover{
        color:var(--qq--theme-menu-text-active);
      }
       &.active {
        color:var(--qq--theme-menu-text-active);
    }
    }
  }
  .triangle {
    left: 46px;
  }
  .flag{
    width: 14px;
    height: 10px;
    display: inline-block !important;
    background-image: url('~public/image/yabo/png/lang_flag.png');
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
    &.ms {
      background-position-y: -60px;
    }
    &.ad {
      background-position-y: -75px;
    }
    &.th {
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
  .flag-round{
    width: 22px;
    height: 22px;
    display: inline-block !important;
    background-image: url('~public/image/yabo/png/lang_cn.png');
    background-position-x: 0;
    background-repeat: no-repeat;
    background-size: 100%;
    margin-right: 6px;
    margin-top: 6px;
    &.en {
      background-image: url('~public/image/yabo/png/lang_en.png');
    }
    &.tw {
      background-image: url('~public/image/yabo/png/lang_tw.png');
    }
    &.vi {
      background-image: url('~public/image/yabo/png/lang_vi.png');
    }
    &.ms {
      background-image: url('~public/image/yabo/png/lang_ms.png');
    }
    &.ad {
      background-image: url('~public/image/yabo/png/lang_ad.png');
    }
    &.th {
      background-image: url('~public/image/yabo/png/lang_th.png');
    }
  }
}
</style>
