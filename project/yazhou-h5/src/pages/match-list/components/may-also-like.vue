<!--
 * @Description: 列表页猜你喜欢
-->

<template>
  <div class="may_also_like" v-if="slide_list.length">
    <div class="title">
      {{ $t('home_popular.you_may_also_like') }}
    </div>
    <div class="scroll-list">
      <div class="card2" :key="i" v-for="(item, i) in slide_list" @click="goto_detail_video(item)">
        <div class="card">
          <div class="card-title">
            <span class="ellipsis">{{ item.tnjc }}</span>
            <div class="right-time" :class="{'no-timer-card': [0, 31].includes(+item.mmp)}">
              <!-- 开赛时间 -->
              <div v-show="item.ms != 110 && !show_counting_down(item)">{{(new Date(+item.mgt)).Format(i18n_t('time3'))}}</div>
              <!-- 倒计时 -->
              <counting-down
                :title="item.ms == 0? i18n_t('list.match_no_start') : matchListClass.match_period_map(item)"
                :mmp="item.mmp"
                :m_id="item.mid"
                :second="item.mst"
                :match="item"
                :is_add="[1,4,11,14,100,101,102,103].includes(+item.csid)"
                u_like
              />
              <!-- 视频直播图标 -->
              <img v-if="item.mms == 2"  src="image/wwwassets/bw3/common/video.svg"/>
            </div>
          </div>
          <div class="card-content">
            <div class="card-team-time">
              <div>
                <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
                <template v-if="!([5,10,7,8].includes(Number(item.csid)))">
                  <team-img :type="0" :csid="item.csid" :url="item.mhlu[0]" :fr="item.frmhn[0]" :size="22"></team-img>
                  <team-img v-if="item.mhlu.length > 1" :type="0" :csid="item.csid" :url="item.mhlu[1]" :fr="item.frmhn[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
                </template>
                <span class="ellipsis">{{ item.mhn }}</span>
              </div>
              <span v-if="is_match_playing(item.ms)">{{ format_total_score(item, 0)}}</span>
              <div class="Handicap" v-if="item.hps[0]" @click.stop="bet_click_(item,0,normal_(item, 0))" :class="selected_(item,0) && 'Handicap2'">
                <template v-if="normal_(item, 0)">
                  <!-- 盘口 -->
                  <span v-html="handicap_on(item, 0)"></span>
                  <!-- 赔率 -->
                  <span v-html="handicap_ov(item, 0)"></span>
                </template>
                <template v-else>
                  <img src="image/wwwassets/bw3/common/match-icon-lock.svg">
                </template>
              </div>
            </div>
            <div class="card-team-time">
              <div>
                <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
                <template v-if="!([5,10,7,8].includes(Number(item.csid)))">
                  <team-img :type="1" :csid="item.csid" :url="item.malu[0]" :fr="item.frman[0]" :size="22"></team-img>
                  <team-img v-if="item.malu.length > 1" :type="1" :csid="item.csid" :url="item.malu[1]" :fr="item.frman[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
                </template>
                <span class="ellipsis">{{ item.man }}</span>
              </div>
              <span v-if="is_match_playing(item.ms)">{{ format_total_score(item, 1) }}</span>
              <div class="Handicap" v-if="item.hps[0]" @click.stop="bet_click_(item,1,normal_(item, 1))" :class="selected_(item,1) && 'Handicap2'">
                <template v-if="normal_(item, 1)">
                  <!-- 盘口 -->
                  <span v-html="handicap_on(item, 1)"></span>
                  <!-- 赔率 -->
                  <span v-html="handicap_ov(item, 1)"></span>
                </template>
                <template v-else>
                  <!-- 封盘图标 -->
                  <img src="image/wwwassets/bw3/common/match-icon-lock.svg">
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue"
import match_list_mixin from "src/project/mixins/match_list/match_list_mixin";  // 为赛事列表(专业版和新手版)提供逻辑方法，拆分组件复杂度
import counting_down from "src/project/components/common/counting-down";  // 赛事进行中每秒变化的计时器
import team_img from "src/project/components/details/team_img";   // 详情页蓝色背景上的大型字母图标
import betting from "src/project/mixins/betting/betting.js";    // 押注动作相关的所有方法写到这里
import {mapMutations, mapGetters} from "vuex";
import { format_total_score } from "src/core/format/index.js"
import {api_home} from "src/project/api";
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import { useRouter } from 'vue-router'
import { i18n_t} from 'src/core/index.js'
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import matchListClass from 'src/core/match-list-h5/match-class/match-list.js'

// import skt_may_like from "/mixins/websocket/data/skt_may_like";   // 猜你喜欢模块ws相关逻辑处理
// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";   // 此文件 主要是应对 赔率转换(在转换为其他赔率时候，必须做欧洲赔率的配分)

const { from_where, show_ } = defineProps({
  from_where: {
    type: Number | String,
    default: null,
  },
  show_:{
    type:Boolean,
    default:true
  }
})

const router = useRouter()
const store_state = store.getState()
const slide_list = ref([])
const get_bet_list = ref(store_state.get_bet_list)

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_bet_list.value = new_state.get_bet_list
})

onMounted(() => {
  get_list()
})

watch(() => show_, () => {
  //没有轮播图和没有赛事时触发事件
  if (!newVal && !slide_list.value.length) {
    useMittEmit(MITT_TYPES.EMIT_MAY_ALSO_LIKE_CHANGE)
  }
})

const selected_ = computed(() => {
  return function (item, index) {
    try {
      if (!item.hps[0].hl[0]) return
      let hl_ = item.hps[0].hl[0]
      if(!Object.keys(hl_).length) return
      let id_ = hl_.hn? `${item.mid}_${item.hps[0].chpid || item.hps[0].hpid}_${hl_.ol[index].ot}_${hl_.hn}`:hl_.ol[index].oid
      return get_bet_list.value.includes(id_)
    } catch (error) {
      console.error(error)
    }
  }
})

// 投注项状态是否正常
const normal_ = computed(() => {
  return function (item,index) {
    try {
      let mhs_ = item.mhs == 0 || item.mhs == 11
      let hs_ = lodash.get(item,'hps[0].hl[0].hs') == 0 || lodash.get(item,'hps[0].hl[0].hs') == 11
      let os_ = lodash.get(item,`hps[0].hl[0].ol[${index}].os`) == 1
      return mhs_ && hs_ && os_
    } catch (error) {
      return false
    }
  }
})

  // 赛事状态  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断
  /**
   * @description: 进行中的赛事显示累加计时|倒计时
   * @param {Object} match 赛事对象
   * @return {Boolean}
   */
  const show_counting_down = (match) => {
    return [1,2,10].includes(match.ms * 1)
  }
  const  get_list = async() => {
    try {
      let res = await api_home.hot_ulike_recommendation({isHot: from_where})
      if (lodash.get(res,'code') == 200 && lodash.get(res,'data.length') > 0) {
        slide_list.value = lodash.get(res,'data');
        store.dispatch({ type: 'matchReducer/updateHotReqTime',  payload: Date.now() });
      }
    } catch (error) {
      console.error(error);
    }
  }
  const goto_detail_video = (match) => {
    if ( !match || !match.mid ) return;
    // 设置去详情的赛事id
    store.dispatch({ type: 'matchReducer/set_goto_detail_matchid',  payload: match.mid });
    // 设置默认的选中的玩法id:0
    store.dispatch({ type: 'matchReducer/set_details_item',  payload: 0 });
    router.push({name:'category', params: {mid: match.mid, csid: match.csid}});
  }
  // 盘口内容
  const handicap_on = (item, index) => {
    try {
      if(item.hps && item.hps[0].hl[0]){
        return item.hps[0].hl[0].ol[index].on
      }
    }catch (e){
      console.error(e);
    }
  }
  // 赔率内容
  const handicap_ov = (item, index) => {
    try {
      if(item.hps && item.hps[0].hl[0]&& item.hps[0].hl[0].ol){
        let val = item.hps[0].hl[0].ol[index].ov / 100000, hsw = item.hps[0].hsw;
        return compute_value_by_cur_odd_type(val, null, hsw,null,item.ciid) ? compute_value_by_cur_odd_type(val, null, hsw,null,item.csid) : '';
      }
    }catch (e){
      console.error(e);
      return ''
    }
  }
  /**
   *@description 投注逻辑
    *@param {Object} match 赛事数据
    *@param {Number} index ol层的下标
    *@param {Boolean} flag 投注项是否正常
    *@return {Undefined} undefined
    */
  const bet_click_ = (match, index, flag) => {
    if (!(match.hps && match.hps[0].hl[0]&& match.hps[0].hl[0].ol && flag)) return
    let ol_item = match.hps[0].hl[0].ol[index]
    if (ol_item.os == 2 || !ol_item.ov || ol_item.ov < 101000) return
    bet_click(match, match.hps[0], ol_item);
    //应对猜你喜欢模块的赔率盘口跟新不及时
    get_list()
  }

  onBeforeMount(() => {
    slide_list.value = []
  })

  onUnmounted(() => {
    unsubscribe()
  })

</script>

<style scoped lang="scss">
 .may_also_like {
  padding-bottom: 0.06rem;
  > .title {
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 0.24rem;
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;

    letter-spacing: 0;
    font-weight: 700;
    position: relative;

    &:before {
      content: "";
      width: 0.03rem;
      height: 0.12rem;
      position: absolute;
      left: 0.16rem;
      top: 0.14rem;

      border-radius: 1.5px;
    }
  }

  & :deep(.q-card) {
    background: initial;
    box-shadow: initial;
    border-radius: initial;
  }
}

.scroll-list {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;

  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.card2 {
  padding-left: 0.06rem;
  scroll-snap-align: start;

  &:last-child {
    padding-right: 0.06rem;
  }

  &:nth-child(3n-1) {
    .card {
      background: var(--q-color-com-img-bg-15) no-repeat center / 100% 100%;
    }
  }

  &:nth-child(3n) {
    .card {
      background: var(--q-color-com-img-bg-16) no-repeat center / 100% 100%;
    }
  }

  &:nth-child(3n+1) {
    .card {
      background: var(--q-color-com-img-bg-17) no-repeat center / 100% 100%;
    }
  }
}

.card {
  min-width: 2.96rem !important;
  max-width: 2.96rem !important;
  height: 1.08rem;

  border-radius: 0.04rem;
  padding: 0.1rem 0.08rem 0 0.08rem;

  .card-title {
    opacity: 0.8;
    font-family: PingFangSC-Regular;
    font-size: 0.1rem;

    line-height: 0.12rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.1rem;

    .right-time {
      height: .12rem;
    }

    img {
      width: 0.18rem;
      margin-left: 0.08rem;
    }

    > .ellipsis {
      width: 1.2rem;
    }

    > div {
      position: relative;
      display: flex;

      > div:nth-child(1) {
        margin-right: 0.05rem;
      }
    }

    :deep(.counting-down-wrap) {
      width: 0.8rem;
      right: 100%;
      left: unset;
      font-size: 0.1rem;

      .counting {
        // color: var(--q-color-com-fs-color-38);
        color: var(--q-color-com-fs-color-8);
        margin-left: 0.05rem;
      }

      .title-space-1 {
        padding: unset;
        margin: unset;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .no-timer-card {
      .counting-down-wrap {
        position: unset;
      }
    }

    :deep(.special) {
      color: var(--q-color-com-fs-color-8);
      padding-top: 1px;
    }
  }

  .card-content {
    margin-top: 0.1rem;

    .card-team-time {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:nth-child(1) {
        min-height: 0.26rem;
        margin-bottom: 0.06rem;
      }

      > div {
        font-weight: 500;
        font-size: 0.12rem;
        display: flex;
        align-items: center;

        .ellipsis {
          width: 1.36rem;
        }

        &.Handicap {
          width: 0.88rem;
          height: 0.26rem;
          background: var(--q-color-com-bg-color-12);
          border-radius: 0.03rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 0.05rem;

          > span {
            &:nth-child(1) {
              width: 0.28rem;
              opacity: 0.75;
              font-family: dinMedium;
              font-size: 0.1rem;
              color: var(--q-color-com-fs-color-39);
              margin-right: 0.04rem;
            }

            &:nth-child(2) {
              font-family: dinMedium;
              font-size: 0.12rem;
              color: var(--q-color-com-fs-color-1);
              text-align: center;
            }
          }

          img {
            width: 12px;
            height: 13px;
          }
        }

        :deep(.team-img-s) {
          width: unset;
          height: unset;
          margin: 0 auto;
          display: unset;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 0.14rem;
            height: 0.14rem;
            margin-right: 0.03rem;
            position: relative;
          }
        }
      }

      > span {
        font-size: 0.1rem;
        line-height: 1;
      }
    }
  }
}
</style>