<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 动画,视频按钮，收藏的展示
-->
<template>
  <div class='team-match-icon'>
    <div class="icon-wrap">
          <!--  match["lvs"] == 2，显示直播按钮 t('match_info.lvs')是国际化取值 -->
        <match-icon v-if="show_lvs" class="fl"
          which="lvs" icon_class="lvs" :text="_.get(this.get_detail_data,'lss') == 1 ? t('match_info.lvs') : t('match_info.topic')">
        </match-icon>

      <!-- mvs动画状态：-1：没有配置动画源 | 0 ：已配置，但是不可用 | 1：已配置，可用，播放中 | 2：已配置，可用，播放中 -->
      <template v-if="get_detail_data.mvs > -1 || (get_detail_data.mms > 1 && [1,2,7,10,110].includes(get_detail_data.ms*1))">

        <!-- 视频状态大于1时，显示视频按钮 t('match_info.video')是国际化取值 -->
        <match-icon v-if="get_detail_data.mms > 1" class="fl" :status="get_detail_data.mms"
          which="muUrl" icon_class="shipin" :text="t('match_info.video')">
        </match-icon>

        <!-- 动画状态大于-1时，显示动画按钮 t('match_info.animation')是国际化取值 -->
        <match-icon v-if="get_detail_data.mvs > -1" class="fl" :status="get_detail_data.mvs"
          which="animationUrl" icon_class="donghua" :text="t('match_info.animation')">
        </match-icon>
      </template>
      <!-- 收藏按钮 -->
      <div v-if="GlobalAccessConfig.get_collectSwitch()" class="match-icon match-icon-single" @click="details_collect(get_detail_data)">
        <div class="collect-icon" :class="{active:get_detail_data.mf}"></div>
        <div class="text">{{t('footer_menu.collect')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import {mapGetters, mapMutations} from "vuex"
import { api_common } from "src/project/api/index.js";
import match_icon from "src/project/components/details/match_icon/match_icon.vue"  // 赛事icon操作
import utils from "src/core/utils/index.js";
import { t } from "src/boot/i18n";;
//国际化


export default {
  name: 'team_match_icon',
  data(){
    return {
      // 收藏|取消收藏是否请求中
      favorite_loading: false,
    }
  },
  computed:{
    ...mapGetters([
      'get_detail_data',
      'get_uid',
      // 投注成功的赛事id
      'get_match_id_bet_success',
      'GlobalAccessConfig',
      'get_lang',// 当前语言
    ]),
    // 展示lvs 图标
    show_lvs() {
      return this.get_detail_data.lvs && this.get_detail_data.lvs != -1 && ['string', 'number'].includes(typeof _.get(this.get_detail_data,'lss')) && ['zh','tw'].includes(this.get_lang)
    },
  },
  components: {
    'match-icon': match_icon,
  },
  watch:{
    // 监听是否投注成功，或者列表页是否点击收藏，同步更新 收藏按钮
    get_match_id_bet_success(bet_curr){
      let m_detail_data = _.cloneDeep(this.get_detail_data);
      let bet_mf = bet_curr.split('-')[1];
      if(bet_mf == 1 || bet_mf == 0){
        m_detail_data.mf = bet_mf == 1;
      }
      else{
        m_detail_data.mf = true;
      }
      this.set_detail_data(m_detail_data);
    }
  },
  methods: {
    ...mapMutations([
      "set_detail_data",
      "set_match_id_bet_success",
      // 修改收藏状态
      'set_details_changing_favorite',
      'set_toast'
    ]),
    /**
     * @description: 收藏与取消收藏
     * @param {Object} match 赛事信息
     * @return {String}
     */
    details_collect(match_obj) {
      if( !utils.judge_collectSwitch( GlobalAccessConfig.get_collectSwitch(),this ) ) return
      // 如果还在请求中则return
      if ( this.favorite_loading ) return;
      let txt = 0;
      let params = {
        // 赛事ID
        mid: match_obj.mid,
        // 1收藏||0取消收藏
        cf: Number(!match_obj.mf),
        // 用户id
        cuid: this.get_uid,
      };
      // 收藏赛事或取消收藏
      if (match_obj.mf) {
        txt = t('common.cancel');//'取消';
      } else {
        txt = t('collect.betted_title');//'收藏';
      }
      this.favorite_loading = true;
      // 更新收藏状态
      this.set_details_changing_favorite(1)

      api_common.add_or_cancel_match( params ).then( res => {
        this.favorite_loading = false;
        if (res.code == 200) {
          let cloneData = _.clone(this.get_detail_data)
          cloneData.mf = params.cf
          this.set_detail_data(cloneData);
          //同步列表页收藏状态
          this.set_match_id_bet_success(`${match_obj.mid}-${cloneData.mf}-${Math.random()}`);
        } else if (res.msg) {
          this.set_toast({ 'txt': res.msg });
        }
      }).catch((e) => {
        console.error(e)
        this.favorite_loading = false;
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.team-match-icon {
  height: 0.26rem;
  line-height: 0.24rem;
  display: flex;
  justify-content: center;
  margin-top: 0.07rem;
}

.icon-wrap {
  display: flex;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
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
    background-image: var(--q-color-com-img-bg-72);
    background-size: 100% 100%;
    margin-right: 0.05rem;
    margin-left: 0.08rem;

    &.active {
      background-image: var(--q-color-com-img-bg-74);
    }
  }
}

.text {
  padding-right: 0.08rem;
}

.fl {
  float: left;
}
</style>
