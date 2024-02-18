<!--
 * @Author: Supermark
 * @Date: 2021-02-07 20:06:26
 * @Description: 详情赛果赛事下拉,赛事列表组件(包括引入的dialog-header子组件)
-->
<template>
  <div class="result-details-dialog">
    <div class="detail-d-container">
      <!-- 引入的赛事顶部组件 -->
      <dialog-header v-if="detail_data.tn" :tn="detail_data.tn"></dialog-header>
      <!-- 赛事列表部分 -->
      <div class="scroll" style="margin-top: 0.44rem; max-width: 600px;min-height:.35rem; max-height:520px;"
        ref="details_dialog_content">
        <div v-for="(item, index) in math_list_data" :key="index" @click="change_active(item)">
          <!-- 赛事列表里面每一项赛事22 -->
          <div class="mx-12 new-dialog-item" :data-mid="item.mid">
            <!-- 灰色背景部分 -->
            <div class="row text-center new-dialog-item-main"
              :class="detail_data.mid == item.mid ? 'details-dialog-bg_blue' : ''">
              <!-- 单项赛事的左侧队伍 -->
              <div class="col column">
                <!-- 字母图标 -->
                <div class="col">
                  <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
                  <team-img :type="0" :url="item.mhlu[0]" :fr="item.frmhn[0]" :size="22" :csid="item.csid"
                    style="margin-top: 0.11rem;"></team-img>
                  <team-img v-if="item.mhlu.length > 1" :type="0" :url="item.mhlu[1]" :fr="item.frmhn[1]" :size="22"
                    :csid="item.csid" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
                </div>
                <!-- 队伍名称 -->
                <div class="col ellipsis-2-lines dialog-text-style">{{ item.mhn }}</div>
              </div>
              <!-- 单项赛事的中间显示时间 -->
              <div class="col column score-wrapper-con">
                <!-- 相关联赛下的比赛 日期展示 -->
                <div class="show-font-style-a">
                  <span class="base-header-font">
                    <!-- 只有足球，篮球，有计时的时候才执行 -->
                    <match-dialog-stage :detail_data="detail_data"
                      v-if="(detail_data.mid == item.mid) && (detail_data.csid == 1 || detail_data.csid == 2)"></match-dialog-stage>
                    <!-- normal -->
                    <match-stage :detail_data="item" :dialog="true" v-else> </match-stage>
                  </span>
                </div>
                <!-- 相关联赛下的比赛 具体时间展示 -->
                <div class="show-font-style-b">
                  <span v-if="item.ms == 0 && !['result_details', 'match_result'].includes(route.name)">
                    <show-start-time :detail_data="item"></show-start-time>
                  </span>
                  <span v-if="item.ms == 1 || item.ms == 2 || item.ms == 3 || item.ms == 4 || is_match_result"
                    class="decated">
                    <!-- 增加比分判定中的判断和显示 -->
                    <template v-if="is_eports_scoring(item)">
                      {{ i18n_t('mmp.eports_scoring') }}
                    </template>
                    <template v-if="is_match_result">
                      {{ calc_score(item) }}
                    </template>
                    <template v-else>
                      {{ format_total_score(item, 0) }} - {{ format_total_score(item, 1) }}
                    </template>
                  </span>
                </div>
              </div>
              <!-- 单项赛事的右侧队伍 -->
              <div class="col column">
                <!-- 字母图标 -->
                <div class="col">
                  <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
                  <team-img :type="1" :url="item.malu[0]" :fr="item.frman[0]" :size="22" :csid="item.csid"
                    style="margin-top: 0.11rem;"></team-img>
                  <team-img v-if="item.malu.length > 1" :type="1" :url="item.malu[1]" :fr="item.frman[1]" :size="22"
                    :csid="item.csid" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
                </div>
                <!-- 队伍名称 -->
                <div class="col ellipsis-2-lines dialog-text-style">{{ item.man }}</div>
              </div>
            </div>
            <div v-if="index != math_list_data.length - 1" class="new-dialog-item-line details-border1-bottom"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { mapGetters, mapMutations } from "vuex";
// import global_filters from 'src/boot/global-filters.js'
import dialogHeader from 'src/base-h5/components/details/dialog/dialog-header.vue'
import teamImg from 'src/base-h5/components/details/team-img.vue'
import matchStage from 'src/base-h5/components/match/match-stage.vue';
import MatchDialogStage from 'src/base-h5/components/match/match-dialog-stage.vue';
import ShowStartTime from 'src/base-h5/components/details/wight/show-start-time.vue'
import { format_total_score,useMittEmit,MITT_TYPES } from 'src/output/index.js'
import { useRoute, useRouter } from "vue-router"
import { MenuData } from 'src/output/project/index.js'
import { onUnmounted,onMounted,getCurrentInstance,computed } from 'vue';
import matchDetailClass from 'src/core/match-detail/match-detail-class';

let router = useRouter()
let route = useRoute()
// 延时器
let timer1_ = null;
let timer2_ = null;
const props = defineProps(['detail_data', 'math_list_data'])
const is_match_result = computed(() => {
  return ['result_details', 'match_result'].includes(route.name)
})


// ...mapMutations(["set_goto_detail_matchid", "set_details_item", 'set_event_list']),
/**
 *@description 赛果进来时，这里直接取S1比分
 *@param {Object} val 赛事详情对象
 *@return {String} 比分
 */
function calc_score(val) {
  try {
    let { groups: { m, s } } = /S1\|(?<m>\d+):(?<s>\d+)/.exec(val.msc.toString())
    return m + '-' + s
  } catch (error) {
    console.error(error)
    return "0-0"
  }
}
function is_eports_scoring(item) {
  //计算主分和客分，用全局的分支处理方法进行处理
  const home = format_total_score(item, 0)
  const away = format_total_score(item, 1)
  //比分判断处理
  let scoring = false
  //如果是电竞，则进行比分判定处理

  if (MenuData.menu_type.value == 3000) {
    const mmp_state = item.mmp || 1
    if (mmp_state != (Number(home) + Number(away) + 1)) {
      scoring = true
    }
  }
  return scoring
}
function change_active(item) {
  // 点击联赛页面收起下拉窗效果 传值false
  useMittEmit(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, false);
  // 如果选择当前页的比赛,则不给予跳转;
  if (props.detail_data.mid == item.mid) return;
  //设置赛事id:mid;
  matchDetailClass.set_goto_detail_matchid(item.mid)
  // 因为动画效果要走完，故而需要加上这个settimeout；
  timer1_ = setInterval(() => {
    // 点击联赛列表设置url赛事id todo优化此处 replace
    router.replace({ name: "result_details", params: { mid: item.mid, index: '1' } });
    // 触发调用赛事详情页面接口:getMatchDetail 刷新详情页头部信息;
    useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS);
    clearInterval(timer1_)
    clearInterval(timer2_)
  }, 400)
}
let {ctx:that} = getCurrentInstance()
onMounted(() => {
  // 解决三星手机图片不出来问题
  that.$forceUpdate();
  clearInterval(timer2_);
  timer2_ = setInterval(that.$forceUpdate, 2000);
})
onUnmounted(() => {
  clearInterval(timer2_)
  timer2_ = null
})
</script>
<style lang="scss" scoped>
.result-details-dialog {
  max-width: 600px;
  background-color: #ffffff;

  .detail-d-container {
    width: 100%;
  }
}

.new-dialog-item {
  height: 1rem;
  font-size: 0.12rem;
}
.details-dialog-bg_blue{
  background: var(--q-gb-bg-c-31) ;
  color: var(--q-gb-t-c-18);
}
.new-dialog-item-main {
  height: 0.88rem;
  border-radius: 0.04rem;
}

.new-dialog-item-line {
  height: 0.05rem;
}

.dialog-text-style {
  width: 100%;
  margin-top: 0.08rem;
  line-height: 0.2rem;
}

.score-wrapper-con {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.show-font-style-a {
  height: 0.32rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: normal;
  font-size: 0.12rem;

  .base-header-font {
    display: block;
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

// 强行修改 q-dialog 样式;
.q-dialog__inner--right>div,
.q-dialog__inner--top>div {
  // border-bottom-left-radius: 0.1rem;
}

.q-dialog__inner--left>div,
.q-dialog__inner--top>div {
  // border-bottom-right-radius: 0.1rem;
}
:deep(.marquee-wrap){
  color: var(--q-gb-t-c-18);
}
</style>