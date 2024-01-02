<!--
 * @Desc: 投注记录弹框已结算页
 * @Author: Router
-->
<template>
  <div class="mx-10 settle" ref="settle" @click="change_is_sort_show">
      <!-- 加载中 -->
      <SRecord v-if="is_loading" />
      <!-- 滚动部分 -->
      <scroll ref="myScroll" :on-pull="onPull" v-else>
        <div class="edit row items-center yb_fontsize12">
          <div class="time yb_mr6 relative-position" @click="change_date">
            <!-- TODO: 主题色背景色 -->
            <i class="calendar"></i><span>{{ date_limit == 7 ? i18n_t('bet_record.7day') :
              i18n_t('bet_record.30day') }}</span>
          </div>
          <div class="sort relative-position" @click.stop="change_sort($event)">
            <!-- TODO: 主题色背景色 -->
            <i :class="'sort-'+sort_active"></i>
            <span>{{sort_active == 2 ? i18n_t('bet_record.sort0') : sort_active == 1 ? i18n_t('bet_record.sort1') : i18n_t('bet_record.sort2')}}</span><span></span>
            <!-- 默認排序 -->
            <!-- 按投注时间排序 -->
            <!-- 按开赛时间排序 -->
            <!-- <p v-if="is_sort_show && 0" class="absolute">
              <span class="sort-text" :class="{'select': sort_active == 2}" data-num='2'><i class="sort0" :class="{'sort-2':sort_active == 2}"></i>{{ i18n_t('bet_record.sort3') }}</span>
              <span class="sort-text" :class="{'select': sort_active == 1}" data-num='1'><i class="sort1" :class="{'sort-1':sort_active == 1}"></i>{{ i18n_t('bet_record.sort4') }}</span>
              <span class="sort-text" :class="{'select': sort_active == 3}" data-num='3'><i class="sort2" :class="{'sort-3':sort_active == 3}"></i>{{ i18n_t('bet_record.sort5') }}</span>
            </p> -->
          </div>
          <div>
          <!-- 提前结算 TODO: 主题色背景色-->
          <span class="yb_fontsize12" @click.stop="change_early"
            :class="{ 'select': is_early, 'is-show': UserCtr.user_info.settleSwitch != 1 }">
            {{ i18n_t('early.btn2') }}<i class="early yb_ml4" :class="{ 'early2': is_early }"></i>
          </span>
          </div>
        </div>
        <template v-if="no_data">
          <!-- 排序和时间选择 -->
          <!-- 订单内容 -->
          <template v-if="!is_all_early_flag">
            <div v-for="(value, name, index) in list_data" :key="index">
              <template v-if="!is_early || (is_early && clac_is_early(value.data))">
                <!-- 时间和输赢统计  .Format(i18n_t('time2')) -->
                <p class="tittle-p row justify-between yb_px4" :class="{ 'tittle-p2': index == 0 }"
                  @click="toggle_show(value)">
                  <span>{{ format_M_D(new Date(name).getTime()) }}</span>
                  <span class="betamount" v-show="new_main_item == 1 && value.open">{{
                    i18n_t('bet.number_transactions') }}<span class="color-1 yb_m">{{ value.totalOrders }}</span>&emsp;{{
                      i18n_t('bet.betting') }}<span class="color-1">{{ value.betAmount }}</span>&emsp;{{
                        i18n_t('bet_record.bet_no_status03') }}/{{ i18n_t('bet_record.bet_no_status04') }}<span
                      class="color-1" :class="{ 'color-2': value.profit > 0 }"><template
                        v-if="value.profit > 0">+</template>{{ value.profit }}</span>
                  </span>
                  <span v-show="!value.open"><img class="icon-down-arrow"
                      :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon.svg`" /></span>
                </p>
                <div class="line" :class="!value.open && (index != Object.keys(list_data).length - 1) && 'line2'"></div>
                <q-slide-transition>
                  <div v-show="value.open">
                    <!-- 投注记录的每一个卡片 -->
                    <common-cathectic-item :main_item="main_item" :item_data="item2" v-for="(item2, key) in value.data" :key="key" class="yb_my12"
                      :key2="key" :len="value.data.length" :is_early="is_early"></common-cathectic-item>
                  </div>
              </q-slide-transition>
            </template>
          </div>
        </template>
      </template>
      <!-- 去投注 -->
      <settle-void :is_early="is_all_early_flag" v-if="(!no_data || is_all_early_flag)"
        :is_limit="is_limit"></settle-void>
    </scroll>
  </div>
</template>

<script setup>

import { watch, onUnmounted, ref, onMounted } from 'vue';
import { api_betting } from "src/api/index.js";
import commonCathecticItem from "src/base-h5/components/common/common-cathectic-item.vue";
import settleVoid from "./settle-void.vue";
import scroll from "src/base-h5/components/common/record-scroll/scroll.vue";
import SRecord from "src/base-h5/components/skeleton/record.vue";
import lodash from "lodash"
//import store from 'src/store-redux/index.js'
import { format_M_D } from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import { i18n_t } from "src/boot/i18n.js";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
//国际化


  // ws 数据接入  投注记录订单消息推送
// mixins: [skt_order]
const props = defineProps({
  main_item: {
    type: [String, Number],
  }
})
// 仓库数据
// let { cathecticReducer, userInfoReducer } = store.getState()
// let store_cathectic = cathecticReducer

// 锚点
const myScroll = ref(null)
//是否加载中
const is_loading = ref(true)
//列表数据集合
const list_data = ref({})
//list_data里面最后的一条数据的日期 '2020-11-17'
const last_record = ref('')
//是否没有数据
const no_data = ref(true)
// 按什么排序  2-默认排序（结算时间） 1-投注时间  3-开赛时间
const sort_active = ref(2)
// 展示多长时间的注单记录
const date_limit = ref(7)
// 是否存在下一页
const is_hasnext = ref(false)
//判断提前结算按钮是否选中，并且选中状态下所有订单是否存在已提前结算
const is_all_early_flag = ref(false)
// 提前结算图标是否选中
const is_early = ref(false)
// 排序设置弹框是否显示
const is_sort_show = ref(false)
// 接口是否返回错误码为0401038限频
const is_limit = ref(false)
const new_main_item = ref(props.main_item)

// onMounted(() => {
//   store_cathectic.main_item == 1 && init_data()
// })
watch(() => props.main_item, (newval) => {
  /**
   * @description 初次切换到已结算时加载数据
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
   new_main_item.value = newval
  if (newval == 1) {
    !last_record.value && init_data()
  }
})
/**
   *@description 点击其他地方要让排序设置弹框消失
*/
const change_is_sort_show = () => {
  if (is_sort_show.value) {
    is_sort_show.value = false
  }
}
/**
 * @description 判断单个订单是否有结算注单
 */
const clac_is_early = (value = []) => {
  return lodash.some(value, { is_show_early_settle: true })
}
/**
 * @description 判断所有订单是否有结算注单
*/
const clac_all_is_early = () => {
  const data = lodash.values(list_data.value)

  return lodash.find(data, (item) => {
    return lodash.some(item.data, { is_show_early_settle: true })
  }) ? false : true
}
/**
 *@description 切换日期
*/
const change_date = () => {
  date_limit.value = date_limit.value == 7 ? 30 : 7

  // 重置参数并调用接口
  last_record.value = ''
  list_data.value = {}
  is_hasnext.value = false
  // 请求注单记录数据
  init_data()
}
/**
 *@description 切换排序
*/
const change_sort = (evt) => {
  sort_active.value = sort_active.value == 2 ? 1 : 2
  // 重置参数并调用接口
  last_record.value = ''
  list_data.value = {}
  is_hasnext.value = false
  //请求注单记录数据
  init_data()
}
/**
 *@description 筛选所有提前结算注单
*/
const change_early = () => {
  is_early.value = !is_early.value
  // console.error(is_early.value);
}
/**
 *@description 初始请求注单记录数据
*@return {Undefined} undefined
*/
const init_data = (flag) => {
  // 接口参数
  var params = {
    searchAfter: last_record.value || undefined,
    orderStatus: '1',
    orderBy: sort_active.value,
    timeType: date_limit.value == 7 ? 3 : 4,
  };
  is_loading.value = !flag;
  let size = 0  //第一次加载时的注单数
  api_betting
    .post_getH5OrderList(params)
    .then(reslut => {
      let res = ''
      if (lodash.get(reslut, 'status')) {
        res = reslut.data
      } else {
        res = reslut
      }
      is_limit.value = false
      if (res.code == 200 && res.data) {
        is_loading.value = false;
        let { record, hasNext } = lodash.get(res, "data");
        is_hasnext.value = hasNext
        if (lodash.isEmpty(record)) {
          no_data.value = false;
          return;
        }
        no_data.value = true;
        // 合并数据
        let obj = lodash.cloneDeep(list_data.value)
        list_data.value = lodash.merge(obj, record)
        for (let item of Object.values(list_data.value)) {
          item.open = true
          size += item.data.length
        }
        last_record.value = lodash.findLastKey(record);
      } else if (res.code == '0401038') {
        is_limit.value = true
        no_data.value = false;
        is_loading.value = false;
        return
      } else {
        no_data.value = false;
        is_loading.value = false
        return;
      }
      //容错处理，接口再调一次
      if (size < 5 && size > 0 && lodash.get(res, 'data.hasNext') == true) {
        init_data()
      }
    })
    .catch(err => {
      is_loading.value = false;
      no_data.value = false;
      console.error(err)
      return
    });
}
/**
 *@description 页面上推分页加载
*@return {Undefined} undefined
*/
const onPull = () => {
  var params = {
    searchAfter: last_record.value || undefined,
    orderStatus: '1',
    orderBy: sort_active.value,
    timeType: date_limit.value == 7 ? 3 : 4,
  };
  let ele = myScroll.value
  if (!is_hasnext.value || last_record.value === undefined) {
    //没有更多
    ele.setState(7);
    return;
  }
  //加载中
  ele.setState(4)
  api_betting.post_getH5OrderList(params).then(reslut => {
    let res = ''
      if (lodash.get(reslut, 'status')) {
        res = reslut.data
      } else {
        res = reslut
      }
    if (!res.data) {
      // 为 null 时容错处理
      is_hasnext.value = false
      //没有更多
      ele.setState(7);
      return
    }
    //加载完成
    ele.setState(5);
    let { record, hasNext } = lodash.get(res, "data", {});
    is_hasnext.value = hasNext
    if (res.code == 200 && res.data && lodash.isPlainObject(record) && lodash.keys(record).length > 0) {
      for (let item of Object.values(record)) {
        item.open = true
      }
      last_record.value = lodash.findLastKey(record);
      // 合并数据
      let obj = lodash.cloneDeep(list_data.value)
      list_data.value = lodash.merge(obj, record)
    } else {
      //没有更多
      ele.setState(7);
    }
  }).catch(err => {
    console.error(err)
  });
}
/**
 *@description 展开与收起切换
*@param {Boolean} val 展开-true  收起-false
*@return {Undefined} undefined
*/
const toggle_show = (val) => {
  val.open = !val.open
  instance.proxy.$forceUpdate()
}

/**
 * @description 是否提前结算
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
watch(() => is_early.value, (_new) => {
  is_all_early_flag.value = _new ? clac_all_is_early() : false
})
onUnmounted(() => {
  //   for (const key in this.$data) {
  //     this.$data[key] = null
  //   }
})



</script>

<style lang="scss" scoped>
  /* **********已结算********************* *-S*/
  .settle {
    height: 100%;
    .settle-scroll{
      height: 100%;
    }
    /* **********时间和输赢统计********************* *-S*/
    .tittle-p {
      width: 3.55rem;
      height: 0.54rem;
      margin: 0 auto;
      padding: 0 0 0 0.04rem;
      line-height: 0.66rem;

      > span:nth-child(1) {
        font-size: 0.18rem;
        letter-spacing: 0;
        font-weight: bold;
      }
    }
    /* **********时间和输赢统计********************* *-E*/
    .tittle-p2 {
      width: 3.55rem;
      margin: 0 auto;
      padding: 0 0 0 0.04rem;
    }

    .line {
      height: 0.5px;
    }

    .icon-down-arrow {
      transform: scaleY(-1);
    }

    .betamount {
      font-size: 0.11rem;
      color: var(--q-cathectic-color-4);
      .color-1 {
        color: var(--q-cathectic-color-1);
      }
    }
  }

  .edit {
    height: 0.44rem;
    margin-bottom: -0.14rem;
    .select {
      color: var(--q-gb-t-c-12);
    }
    i {
      display: inline-block;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      vertical-align: text-bottom;
      width: 0.14rem;
      height: 0.14rem;
      margin-right: 0.04rem;
    }
  }

  .time {
    border-radius: 0.12rem;
    padding: 0.04rem 0.24rem 0.04rem 0.04rem;
    background-color: var(--q-gb-bd-c-15);
  }

  .sort {
    margin-right: auto;
    border-radius: 0.12rem;
    padding: 0.04rem 0.24rem 0.04rem 0.04rem;
    background-color: var(--q-gb-bd-c-15);

    p {
      width: max-content;
      box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
      border-radius: 0.08rem;
      line-height: 0.3rem;
      z-index: 100;
      top: 130%;

      &::after {
        content: "";
        position: absolute;
        width: 0.08rem;
        height: 0.08rem;
        top: -0.04rem;
        left: 0.2rem;
        transform: rotate(45deg);
        background-color: #fff;
      }
    }
  }

  .sort-text {
    display: block;
    padding: 0 0.08rem;
  }

  .early {
    display: inline-block;
    background: url($SCSSPROJECTPATH + "/image/svg/select_b.svg") no-repeat center / contain;
    vertical-align: text-bottom;
    width: 0.14rem;
    height: 0.14rem;
  }

  .early2 {
    background-image: url($SCSSPROJECTPATH + "/image/svg/select_a.svg");
  }

  .calendar {
    background-image: url($SCSSPROJECTPATH + "/image/record/calendar2.svg");  
  }
  /* ************** 排序按钮图标 ************** -S */

  .sort0 {
    background-image: var(--q-color-com-img-bg-76);
  }

  .sort1 {
    background-image: var(--q-color-com-img-bg-77);
  }

  .sort2 {
    background-image: var(--q-color-com-img-bg-78);
  }

  .sort-2 {
    background-image: url($SCSSPROJECTPATH + "/image/record/sort_settled_time2.svg");
  }

  .sort-1 {
    background-image: var(--q-color-com-img-bg-80);
  }

  .sort-3 {
    background-image: var(--q-color-com-img-bg-81);
  }
  /* ************** 排序按钮图标 ************** -E */

  .time,
  .sort {
    &::after {
      content: "";
      position: absolute;
      right: 0.08rem;
      top: 42%;
      border: 0.04rem solid;
      border-color: #bcbcbe transparent transparent;
    }
  }
  .is-show {
    visibility: hidden;
  }
</style>