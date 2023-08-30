<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情赛事下拉,赛事列表组件(包括引入的dialog-header子组件)
-->
<template>
  <div class="details-dialog">
    <div class="detail-d-container">
      <!-- 引入的赛事顶部组件 -->
      <dialog-header v-if="detail_data.tn" :tn="detail_data.tn"></dialog-header>
      <!-- 赛事列表部分 -->
      <div class="scroll" style="margin-top: 0.44rem; min-height:.35rem; max-height:520px;" ref="details_dialog_content">

        <div v-for="(item,index) in math_list_data" :key="index" @click="change_active(item)">
          <!-- 赛事列表里面每一项赛事 -->
          <div class="mx-12 new-dialog-item" :data-mid="item.mid">
            <!-- 灰色背景部分 -->
            <div class="row text-center new-dialog-item-main" :class="detail_data.mid == item.mid?'details-dialog-bg':''">
              <!-- 单项赛事的左侧队伍 -->
              <div class="col">
                <!-- 字母图标 -->
                <div class="col">
                  <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
                  <team-img :type="0" :url="item.mhlu[0]" :fr="item.frmhn[0]" :size="22" :csid="item.csid" style="margin-top: 0.11rem;"></team-img>
                  <team-img v-if="item.mhlu.length > 1" :type="0" :url="item.mhlu[1]" :fr="item.frmhn[1]" :size="22" :csid="item.csid" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
                </div>
                <!-- 队伍名称 -->
                <div class="col ellipsis-2-lines dialog-text-style">{{item.mhn}}</div>
              </div>
              <!-- 单项赛事的中间显示时间 -->
              <div class="col column score-wrapper-con">
                <!-- 相关联赛下的比赛 日期展示 -->
                <div class="show-font-style-a">
                  <span class="base-header-font">
                    <!-- 只有足球，篮球，有计时的时候才执行 -->
                    <match-dialog-stage :detail_data="detail_data" v-if="(detail_data.mid == item.mid) && (detail_data.csid == 1 || detail_data.csid == 2)"></match-dialog-stage>
                    <!-- normal -->
                    <match-stage :detail_data="item" :dialog="true" v-else> </match-stage>
                  </span>
                </div>
                <!-- 相关联赛下的比赛 具体时间展示 -->
                <div class="show-font-style-b">
                  <span v-if="item.ms == 0 && !is_match_result">
                    <show-start-time :detail_data="item"></show-start-time>
                  </span>
                  <span v-if="item.ms == 1 || item.ms == 2 || item.ms == 3 || item.ms == 4 || is_match_result" class="decated">
                    <!-- 增加比分判定中的判断和显示 -->
                    <template v-if="is_eports_scoring(item)">
                      {{t('mmp.eports_scoring')}}
                    </template>
                    <template v-else-if="is_match_result">
                      {{calc_score(item)}}
                    </template>
                    <template v-else>
                      {{format_total_score(item, 0)}} - {{format_total_score(item, 1)}}
                    </template>
                  </span>
                </div>
              </div>
              <!-- 单项赛事的右侧队伍 -->
              <div class="col">
                <!-- 字母图标 -->
                <div class="col">
                  <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
                  <team-img :type="1" :url="item.malu[0]" :fr="item.frman[0]" :size="22" :csid="item.csid" style="margin-top: 0.11rem;"></team-img>
                  <team-img v-if="item.malu.length > 1" :type="1" :url="item.malu[1]" :fr="item.frman[1]" :size="22" :csid="item.csid" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
                </div>
                <!-- 队伍名称 -->
                <div class="col ellipsis-2-lines dialog-text-style">{{item.man}}</div>
              </div>
            </div>
            <div v-if="index != math_list_data.length-1" class="new-dialog-item-line details-border1-bottom"></div>

            <img v-if="show_lvs(item)" :src="UserCtr.theme.includes('theme01') ? icon_video :
            icon_video_black" alt=""
                 class="icon-style">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import global_filters from 'src/boot/global-filters.js'
// 赛事详情头部点击下拉后显示  "↑ 收起" + "< 返回按钮"
import dialog_header from 'src/project/components/details/dialog/dialog_header.vue'
 // 详情页蓝色背景上的大型字母图标
import team_img from 'src/project/components/details/team_img.vue'
// 下拉列表赛事时间展示
import match_stage from 'src/project/components/match/match_stage.vue';
// 详情点击下拉显示当前赛事的时间
import match_dialog_stage from 'src/project/components/match/match_dialog_stage.vue';
 // 详情页同联赛的赛事即将开赛显示时间
import show_start_time from 'src/project/components/details/wight/show_start_time.vue'
import { t } from "src/boot/i18n.js";;
import { useRouter, useRoute } from "vue-router"
import { format_total_score } from 'src/core/format'
import UserCtr from "src/core/user-config/user-ctr.js";;


const router = useRouter()
const route = useRoute()
export default {
  name: "details_dialog",
  props:['detail_data','math_list_data'],
  components: {
    "dialog-header": dialog_header,
    "team-img": team_img,
    "match-stage": match_stage,
    "match-dialog-stage": match_dialog_stage,
    "show-start-time": show_start_time,
  },
  data() {
    return {
      icon_video: "image/wwwassets/bw3/common/icon_video.png",
      icon_video_black: "image/wwwassets/bw3/common/icon_video_black.png",
    }
  },
  computed: {
    ...mapGetters([
      'get_menu_type',
      'get_lang',
      'get_current_menu',
      'get_details_tabs_list',
    ]),
    is_match_result(){
      return ['result_details', 'match_result'].includes(route.name)
    }
  },
  created () {
    // 定时器变量
    timer1_ = null
    timer2_ = null;
  },
  methods: {
    ...mapMutations(["set_goto_detail_matchid", "set_details_item", 'set_event_list']),
    // 展示lvs 图标
    show_lvs(item) {
      return item.lvs != -1  && ['string', 'number'].includes(typeof _.get(item,'lss')) &&
          ['zh','tw'].includes(get_lang) && get_menu_type != 3000
    },
    is_eports_scoring(item) {
      //计算主分和客分，用全局的分支处理方法进行处理
      const home = format_total_score(item, 0)
      const away = format_total_score(item, 1)
      //比分判断处理
      let scoring = false
      //如果是电竞，则进行比分判定处理
      if(get_menu_type == 3000) {
        const mmp_state = item.mmp || 1
        if(mmp_state != (Number(home) + Number(away) +1)) {
          scoring = true
        }
      }
      return scoring
    },
    /**
     *@description 赛果进来时，这里直接取S1比分
     *@param {Object} val 赛事详情对象
     *@return {String} 比分
     */
    calc_score(val){
      try {
        let {groups:{m,s}} = /S1\|(?<m>\d+):(?<s>\d+)/.exec(val.msc.toString())
        return m + '-' + s
      } catch (error) {
        console.error(error)
        return "0-0"
      }
    },
    change_active(item) {
      useMittEmit(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, false);
      if (detail_data.mid == item.mid) return; // 如果选择当前页的比赛,则不给予跳转;
      set_goto_detail_matchid(item.mid); //设置mid;
      set_event_list([])

      if(!(_.get(get_current_menu,'sub.menuType') == '5' && ['result_details', 'match_result'].includes(route.name))) {
        set_details_item(get_details_tabs_list[0].id); // 选中的tab的item项;
      }
      router.replace({ name: "category", params: {mid: item.mid,index: '1' }}); // todo 优化此处
      useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS); // 刷新详情页头部信息;
      useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB); // 将tab的滚动距离回复到初始点;
      useMittEmit(MITT_TYPES.EMIT_CATEGORY_SKT); // 底部信息skt连接
      useMittEmit(MITT_TYPES.EMIT_DETAILS_SKT); // 头部信息skt连接
      timer1_ = setInterval(()=>{
        useMittEmit(MITT_TYPES.EMIT_MATCH_TIME_SHOW_INIT);
        useMittEmit(MITT_TYPES.EMIT_UPDATE_GAME_TIME)
        clearInterval(timer1_)
        clearInterval(timer2_)
      },100)
    }
  },
  mounted () {
    // 解决三星手机图片不出来问题
    $forceUpdate();
    timer2_ = setInterval($forceUpdate, 2000);
  },
  beforeDestroy () {
    clearInterval(timer2_)
    timer2_ = null
    clearInterval(timer1_)
    timer1_ = null
  },
};
</script>
<style lang="scss" scoped>
.details-dialog {
  max-width: 100%;
  width: 100%;

  .detail-d-container {
    width: 100%;
  }
}

.new-dialog-item {
  height: 1rem;
  font-size: 0.12rem;
  position: relative;
  .icon-style{
    width: 0.16rem;
    height: 0.16rem;
    position: absolute;
    left: 0;
    top: 0;
  }
}

.new-dialog-item-main {
  height: 0.88rem;
  border-radius: 0.04rem;
}

.new-dialog-item-line {

}

.dialog-text-style {
  width: 100%;
  line-height: 0.15rem;
}

.score-wrapper-con {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.show-font-style-a {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: normal;
  font-size: 0.12rem;

  .base-header-font {
    display: block;

    ::v-deep.counting-down-wrap {
      .counting {
        font-family: dinMedium;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.show-font-style-b {
  line-height: normal;
  font-size: 0.26rem;
  font-weight: bold;
}

.active {
  font-size: 0.14rem;
}

.q-dialog__inner > .details-dialog {
  border-radius: 0;
}
</style>
<style lang="scss">
.theme01 {
  .base-header-font {
    .counting-down-wrap {
      .counting {
        position: relative;
        top: 0.01rem;
        color: #414655 !important;
      }
    }
  }
}

.theme02 {
  .base-header-font {
    .counting-down-wrap {
      .counting {
        position: relative;
        top: 0.01rem;
        color: #fff !important;
      }
    }
  }
}
</style>
