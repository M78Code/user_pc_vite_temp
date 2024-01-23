<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 动画,视频按钮，收藏的展示
-->
<template>
   <div class="match-icon" v-if="detail_data.mvs > -1 || (detail_data.mms > 1 && [1,2,7,10,110].includes(detail_data.ms*1))">
      <div class="match-icon-item" v-if="detail_data.mms > 1" @click="icon_click_muUrl">
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/live_app.svg`" alt />
        {{ i18n_t('match_info.video_live') }}</div>
      <div class="match-icon-item" v-if="detail_data.mvs > -1 && lodash.get(UserCtr, 'user_info.ommv')" @click="icon_click_animationUrl({match:detail_data, source:main_source})">
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/animate_app.svg`" alt />
        {{i18n_t('match_info.animation_live') }}</div>
    </div>
  <div class='team-match-icon' style="color: #fff;" v-if="false">
    <div class="icon-wrap">
          <!--  match["lvs"] == 2，显示直播按钮 i18n_t('match_info.lvs')是国际化取值 -->
        <match-icon v-if="show_lvs" class="fl"
          which="lvs" icon_class="lvs" :text="lodash.get(get_detail_data,'lss') == 1 ? i18n_t('match_info.lvs') : i18n_t('match_info.topic')">
        </match-icon>
      
      <!-- mvs动画状态：-1：没有配置动画源 | 0 ：已配置，但是不可用 | 1：已配置，可用，播放中 | 2：已配置，可用，播放中 -->
      <template v-if="detail_data.mvs > -1 || (detail_data.mms > 1 && [1,2,7,10,110].includes(detail_data.ms*1))">
        <!-- 视频状态大于1时，显示视频按钮 i18n_t('match_info.video')是国际化取值 -->
        <match-icon v-if="detail_data.mms > 1" class="fl" :status="detail_data.mms"
          which="muUrl" icon_class="shipin" :detail_data="detail_data" :text="i18n_t('match_info.video_live')">
        </match-icon>

        <!-- 动画状态大于-1时，显示动画按钮 i18n_t('match_info.animation')是国际化取值 -->
        <match-icon v-if="detail_data.mvs > -1" class="fl" :status="detail_data.mvs" :detail_data="detail_data"
          which="animationUrl" icon_class="donghua" :text="i18n_t('match_info.animation_live')">
        </match-icon>
      </template>
      <!-- 收藏按钮 -->
      <!-- <div v-if="GlobalAccessConfig.get_collectSwitch()" class="match-icon match-icon-single" @click="details_collect(get_detail_data)">
        <div class="collect-icon" :class="{active:get_detail_data.mf}"></div>
        <div class="text">{{ i18n_t('footer_menu.collect')}}</div>
      </div> -->
    </div>
  </div>
</template>

<script>
// #TODO vuex
// import {mapGetters, mapMutations} from "vuex"
import { reactive, computed, toRefs, defineComponent } from "vue";
import lodash from "lodash";
import UserCtr from "src/core/user-config/user-ctr.js";
import match_icon from "src/base-h5/components/details/match-icon/match-icon-2.vue"  // 赛事icon操作

import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { api_common } from "src/api/index.js";
// import { i18n_t } from "src/boot/i18n.js";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { useRoute } from 'vue-router';
import { useIconInfo } from "./match-icon/hooks";

export default defineComponent({
  name: "team_match_icon",
  components: {
    'match-icon': match_icon,
  },
  props: {
    detail_data: {
      type: Object,
      default: () => {},
    },
    main_source:{
      type: String,
      default: () => '',
    }
  },
  setup(props, evnet) {

    const route = useRoute()
    const state_data = reactive({
      // 收藏|取消收藏是否请求中
      favorite_loading: false,
    });
    const get_detail_data = reactive(props.detail_data)

    // 赛事id
const match_id = computed(() => route.params.mid || get_detail_data.mid)

const {icon_click_animationUrl,icon_click_muUrl,icon_click_lvs} =  useIconInfo(get_detail_data,match_id);

    // #TODO vuex
    // computed:{
    // ...mapGetters([
    //   'get_uid',
    //   // 投注成功的赛事id
    //   'get_match_id_bet_success',
    //   'get_access_config',
    //   'UserCtr.lang',// 当前语言
    // ]),
    // 展示lvs 图标
    const show_lvs = computed(() => {
      return get_detail_data.lvs && get_detail_data.lvs != -1 && ['string', 'number'].includes(typeof lodash.get(get_detail_data,'lss')) && ['zh','tw', 'hk'].includes(UserCtr.lang)
    });
    // 监听是否投注成功，或者列表页是否点击收藏，同步更新 收藏按钮 TODO: 待列表做好收藏后再确认需要监听的字段
    // watch(
    //   () => get_match_id_bet_success,
    //   (bet_curr) => {
    //     let m_detail_data = lodash.cloneDeep(get_detail_data);
    //     let bet_mf = bet_curr.split('-')[1];
    //     if(bet_mf == 1 || bet_mf == 0){
    //       m_detail_data.mf = bet_mf == 1;
    //     }
    //     else{
    //       m_detail_data.mf = true;
    //     }
    //     set_detail_data(m_detail_data);
    //   }
    // );
    // #TODO vuex
    // methods: {
    // ...mapMutations([
    //   "set_match_id_bet_success",
    //   // 修改收藏状态
    //   'set_details_changing_favorite',
    //   'set_toast'
    // ]),
    /**
     * @description: 收藏与取消收藏
     * @param {Object} match 赛事信息
     * @return {String}
     */
    const details_collect = (match_obj) => {
      if( !judge_collectSwitch( GlobalAccessConfig.get_collectSwitch(),this ) ) return

      // 如果还在请求中则return
      if ( state_data.favorite_loading ) return;
      let txt = 0;
      let params = {
        // 赛事ID
        mid: match_obj.mid,
        // 1收藏||0取消收藏
        cf: Number(!match_obj.mf),
        // 用户id
        cuid: UserCtr.uid,
      };
      // 收藏赛事或取消收藏
      if (match_obj.mf) {
        txt = i18n_t('common.cancel');//'取消';
      } else {
        txt = i18n_t('collect.betted_title');//'收藏';
      }
      state_data.favorite_loading = true;
      // 更新收藏状态
      // set_details_changing_favorite(1)

      api_common.add_or_cancel_match( params ).then( res => {
        state_data.favorite_loading = false;
        if (res.code == 200) {
          let cloneData = lodash.clone(get_detail_data)
          get_detail_data.mf = params.cf
          // set_detail_data(cloneData);
          //同步列表页收藏状态
          // set_match_id_bet_success(`${match_obj.mid}-${cloneData.mf}-${Math.random()}`);
        } else if (res.msg) {
          set_toast({ 'txt': res.msg });
        }
      }).catch((e) => {
        console.error(e)
        state_data.favorite_loading = false;
      });
    };
    return {
      ...toRefs(state_data),
      show_lvs,
      details_collect,
      get_detail_data,
      GlobalAccessConfig,
      lodash,
      UserCtr,
      i18n_t,
      icon_click_animationUrl,
      icon_click_muUrl,
      LOCAL_PROJECT_FILE_PREFIX
    }
  }
})
</script>

<style lang="scss" scoped>
.team-match-icon {
  // height: 0.26rem;
  line-height: 0.24rem;
  display: flex;
  // justify-content: center;
  // margin-top: 0.08rem;
  // margin-bottom: 0.08rem;
}

.icon-wrap {
  display: flex;
  justify-content: center;
  // background-color: rgba(255, 255, 255, 0.1); //todo 复刻版不需要
  border-radius: 4px;
}

.match-icon {
  height: 0.26rem;
  border-radius: 0.04rem;
  text-align: center;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 1px;
    height: 0.12rem;
    background: rgba(255, 255, 255, 0.6);
    right: 0;
    top: 0.06rem;
  }

  &:last-child:after {
    display: none;
  }
}

.match-icon-single {
  display: flex;
  color: #fff;
  align-items: center;

  .collect-icon {
    width: 0.16rem;
    height: 0.16rem;
    // TODO:
    background-image: url($SCSSPROJECTPATH + '/image/common/m-list-favorite.svg');
    background-size: 100% 100%;
    margin-right: 0.05rem;
    margin-left: 0.08rem;

    &.active {
      background-image: url($SCSSPROJECTPATH + "/image/common/m-list-favorite-s.svg");
    }
  }
}

.text {
  padding-right: 0.08rem;
}

.fl {
  float: left;
}

.match-icon {
  height: 26px;

  width: 100%;
  margin-bottom: 0.1rem;
  display: flex;
  justify-content: center;
  .match-icon-item {
    min-width: 0.82rem;
    height: 0.26rem;
    padding: 3px 6px 3px 6px;
    border-radius: 0.48rem;
    background: #00000080;

    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffffcc;
    font-size: 12px;
    margin-right: 0.06rem;
    cursor: pointer;
    img{
      margin-right: 0.04rem;;
      // height: 16px;
      // width: 16px;
    }
  }
}
</style>