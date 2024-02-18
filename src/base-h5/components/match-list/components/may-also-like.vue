<!--
 * @Description: 列表页猜你喜欢
-->

<template>
  <div class="may_also_like" v-if="slide_list.length">
    <div class="title">
      {{ i18n_t('home_popular.you_may_also_like') }}
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
              />
              <!-- 视频直播图标 -->
              <img v-if="item.mms == 2"  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/video.svg`" alt="" />
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
                  <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" alt="" />
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
                  <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" alt="" />
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
import { format_total_score } from "src/output/index.js"
import { api_home } from "src/api/index.js";
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import { useRouter } from 'vue-router'
import { i18n_t, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import teamImg from "src/base-h5/components/details/team-img.vue";   // 详情页蓝色背景上的大型字母图标
import countingDown from "src/base-h5/components/common/counting-down.vue";  // 赛事进行中每秒变化的计时器
import matchListClass from 'src/core/match-list-h5/match-class/match-list.js'

// import skt_may_like from "/mixins/websocket/data/skt_may_like";   // 猜你喜欢模块ws相关逻辑处理
// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";   // 此文件 主要是应对 赔率转换(在转换为其他赔率时候，必须做欧洲赔率的配分)

const props = defineProps({
  from_where:  Number | String,
  show_: Boolean
})

const router = useRouter()
const slide_list = ref([])
const get_bet_list = ref([])

onMounted(() => {
  slide_list.value = []
  get_list()
})

watch(() => props.show_, () => {
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
      let res = await api_home.hot_ulike_recommendation({isHot: props.from_where})
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
        return compute_value_by_cur_odd_type(val, null, hsw,item.ciid) ? compute_value_by_cur_odd_type(val, null, hsw,item.csid) : '';
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
    set_bet_obj_config(match, match.hps[0], ol_item);
    //应对猜你喜欢模块的赔率盘口跟新不及时
    get_list()
  }
</script>

<style scoped lang="scss">
 @import "../styles/may-also-like.scss";
</style>