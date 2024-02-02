<!--
 * @Description: 详情赛事下拉,赛事列表组件(包括引入的dialog-header子组件)
-->
<template>
  <div class="details-dialog" :style="page_style">
    <div class="detail-d-container">
      <!-- 引入的赛事顶部组件 -->
      <dialog-header
        v-if="detail_data.tn"
        :tn="detail_data.tn"
      ></dialog-header>
      <!-- 赛事列表部分 -->
      <div
        class="scroll"
        style="margin-top: 0.44rem; min-height:.35rem; max-height:520px;padding-bottom: 0.2rem; "
        ref="details_dialog_content"
      >

        <div
          v-for="(item, index) in math_list_data"
          :key="index"
          @click="change_active(item)"
        >
          <!-- 赛事列表里面每一项赛事 -->
          <div
            class="new-dialog-item"
            :data-mid="item.mid"
          >
            <!-- 灰色背景部分 -->
            <!--<div
              class="row text-center new-dialog-item-main"
              :class="detail_data.mid == item.mid ? 'details-dialog-bg' : 'details-dialog-bg_blue'"
            >-->
            <div
                class="row text-center new-dialog-item-main"
                :class="detail_data.mid == item.mid ? 'details-dialog-bg_blue' : 'details-dialog-bg'"
            >
              <!-- 单项赛事的左侧队伍 -->
              <div class="col">
                <!-- 字母图标 -->
                <div class="col">
                  <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
                  <team-img
                    :type="0"
                    :url="item.mhlu[0]"
                    :fr="item.frmhn[0]"
                    :size="22"
                    :csid="item.csid"
                    style="margin-top: 0.11rem;"
                  ></team-img>
                  <team-img
                    v-if="item.mhlu.length > 1"
                    :type="0"
                    :url="item.mhlu[1]"
                    :fr="item.frmhn[1]"
                    :size="22"
                    :csid="item.csid"
                    style="margin-top: 0.11rem; margin-left:-0.08rem;"
                  ></team-img>
                </div>
                <!-- 队伍名称 -->
                <div class="col ellipsis-2-lines dialog-text-style">{{ item.mhn }}</div>
              </div>
              <!-- 单项赛事的中间显示时间 -->
              <div class="col column score-wrapper-con">
                <!-- 相关联赛下的比赛 日期展示 -->
                <div class="show-font-style-a">
                  <span class="base-header-font">
                    <match-stage
                      :detail_data="item"
                      :dialog="true"
                    > </match-stage>
                  </span>
                </div>
                <!-- 相关联赛下的比赛 具体时间展示 -->
                <div class="show-font-style-b">
                  <span v-if="item.ms == 0 && !is_match_result">
                    <show-start-time :detail_data="item"></show-start-time>
                  </span>
                  <span
                    v-if="item.ms == 1 || item.ms == 2 || item.ms == 3 || item.ms == 4 || is_match_result"
                    class="decated"
                  >
                    <!-- 增加比分判定中的判断和显示 -->
                    <template v-if="is_eports_scoring(item)">
                      {{ i18n_t('mmp.eports_scoring') }}
                    </template>
                    <template v-else-if="is_match_result">
                      {{ calc_score(item) }}
                    </template>
                    <template v-else>
                      {{ format_total_score(item, 0) }} - {{ format_total_score(item, 1) }}
                    </template>
                  </span>
                </div>
              </div>
              <!-- 单项赛事的右侧队伍 -->
              <div class="col">
                <!-- 字母图标 -->
                <div class="col">
                  <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
                  <team-img
                    :type="1"
                    :url="item.malu[0]"
                    :fr="item.frman[0]"
                    :size="22"
                    :csid="item.csid"
                    style="margin-top: 0.11rem;"
                  ></team-img>
                  <team-img
                    v-if="item.malu.length > 1"
                    :type="1"
                    :url="item.malu[1]"
                    :fr="item.frman[1]"
                    :size="22"
                    :csid="item.csid"
                    style="margin-top: 0.11rem; margin-left:-0.08rem;"
                  ></team-img>
                </div>
                <!-- 队伍名称 -->
                <div class="col ellipsis-2-lines dialog-text-style">{{ item.man }}</div>
              </div>
            </div>
            <div
              v-if="index != math_list_data.length - 1"
              class="new-dialog-item-line details-border1-bottom"
            ></div>

            <span
              v-if="show_lvs(item)"
              :style="compute_css_obj('icon-video')"
            
              alt=""
              class="icon-style"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineComponent, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import lodash from 'lodash';
// 组件
import dialogHeader from 'src/base-h5/components/details/dialog/dialog-header.vue'   // 赛事详情头部点击下拉后显示  "↑ 收起" + "< 返回按钮"
import teamImg from 'src/base-h5/components/details/team-img.vue'    // 详情页蓝色背景上的大型字母图标
import matchStage from 'src/base-h5/components/match/match-stage.vue';   // 下拉列表赛事时间展示
import matchDialogStage from 'src/base-h5/components/match/match-dialog-stage.vue';   // 详情点击下拉显示当前赛事的时间
import showStartTime from 'src/base-h5/components/details/wight/show-start-time.vue'   // 详情页同联赛的赛事即将开赛显示时间
// 工具
import { UserCtr, MenuData,compute_css_obj,useMittEmit, MITT_TYPES, MatchDetailCalss, format_total_score } from "src/output/index.js";
import { compute_css_variables } from "src/core/css-var/index.js"
 

const props = defineProps(['detail_data', 'math_list_data'])

const route = useRoute()
const router = useRouter()
const is_match_result = computed(() => ['result_details', 'match_result'].includes(route.name))
// 公共主题色
const page_style = reactive({});
// 定时器变量
const timer1_ = ref(null)
const clear_timer1_ = () => {
  if (timer1_.value) {
    clearInterval(timer1_.value)
    timer1_.value = null
  }
}
onUnmounted(clear_timer1_)
const timer2_ = ref(null)
const clear_timer2_ = () => {
  if (timer2_.value) {
    clearInterval(timer2_.value)
    timer2_.value = null
  }
}
onUnmounted(clear_timer2_)

const { menu_type, current_menu } = MenuData; //菜单选中项
// 公共全局主题色
function global_color_obj() {
  // 背景色
  let bg = compute_css_variables({ category: 'global', module: 'background' })
  // 边框色
  let bd = compute_css_variables({ category: 'global', module: 'border' })
  // 字体色
  let tc = compute_css_variables({ category: 'global', module: 'color' })
  // 渐变色
  let lg = compute_css_variables({ category: 'global', module: 'linear-gradient' })
  return { ...bg, ...bd, ...tc, ...lg }
}

// 展示lvs 图标
function show_lvs(item) {
  return item.lvs != -1 && ['string', 'number'].includes(typeof lodash.get(item, 'lss')) &&
    ['zh', 'tw', 'hk'].includes(UserCtr.lang) && menu_type != 3000
}
function is_eports_scoring(item) {
  //计算主分和客分，用全局的分支处理方法进行处理
  const home = format_total_score(item, 0)
  const away = format_total_score(item, 1)
  //比分判断处理
  let scoring = false
  //如果是电竞，则进行比分判定处理
  if (menu_type == 3000) {
    const mmp_state = item.mmp || 1
    if (mmp_state != (Number(home) + Number(away) + 1)) {
      scoring = true
    }
  }
  return scoring
}
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

function change_active(item) {
  useMittEmit(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, false);
  if (props.detail_data.mid == item.mid) return; // 如果选择当前页的比赛,则不给予跳转;
  MatchDetailCalss.set_match_details_params(item); //设置mid;
  MatchDetailCalss.set_playback_video_list([])
  if (!(lodash.get(current_menu, 'sub.menuType') == '5' && ['result_details', 'match_result'].includes(route.name))) {
    // TODO:  
    // set_details_item(get_details_tabs_list[0].id); // 选中的tab的item项;
  }
  
  useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS); // 刷新详情页头部信息;
  useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB); // 将tab的滚动距离回复到初始点;
  useMittEmit(MITT_TYPES.EMIT_CATEGORY_SKT); // 底部信息skt连接
  useMittEmit(MITT_TYPES.EMIT_DETAILS_SKT); // 头部信息skt连接
  // 触发category_list接口
  // useMittEmit(MITT_TYPES.EMIT_TABS_LIST_UPDATE_HANDLE);
  // 触发odds_info接口
  // useMittEmit(MITT_TYPES.EMIT_REF_API);
  timer1_.value = setInterval(() => {
    // 触发详情页页面初始化
    useMittEmit(MITT_TYPES.EMIT_MATCH_TIME_SHOW_INIT);
    // 详情页更新 正/倒 计时时间
    useMittEmit(MITT_TYPES.EMIT_UPDATE_GAME_TIME)
    clearInterval(timer1_.value)
    clearInterval(timer2_.value)
  }, 100)
  router.replace({ name: "category", params: { mid: item.mid } }); // todo 优化此处
}

const { ctx } = getCurrentInstance()
// 解决三星手机图片不出来问题
onMounted(() =>{
  Object.assign(page_style, global_color_obj())
  lodash.isFunction(ctx.$forceUpdate)&&ctx.$forceUpdate() //报错 不是 function
})
timer2_.value = setInterval(ctx.$forceUpdate, 2000);
</script>

<script>
export default defineComponent({
  name: "details-dialog",
})
</script>

<style lang="scss" scoped>
@import 'src/base-h5/components/details/styles/details-theme/details-dialog.scss';
.details-dialog-bg_blue{
  background: var(--q-gb-bg-c-31) ;
}
.details-dialog {
  max-width: 100%;
  width: 100%;

  .detail-d-container {
    width: 100%;
  }
}

.new-dialog-item {
  height: 0.88rem;
  font-size: 0.12rem;
  position: relative;

  .icon-style {
    width: 0.16rem;
    height: 0.16rem;
    position: absolute;
    left: 0;
    top: 0;
  }
}

.new-dialog-item-main {
  height: 100%;
  margin:0 0.12rem
}

.new-dialog-item-line {

}

.details-border1-bottom {
  border-bottom: 1px solid var(--q-gb-bd-c-6);
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

    :deep(.counting-down-wrap) {
      .counting {
        font-family: dinMedium;
        color:var(--q-gb-t-c-18) !important
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

.q-dialog__inner>.details-dialog {
  border-radius: 0;
}
:deep(.marquee-wrap){
  color: var(--q-gb-t-c-18);
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