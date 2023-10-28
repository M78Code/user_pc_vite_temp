<!--
 * @Desc: 投注记录弹框已结算页
 * @Author: Router
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div class="settle">
    <!-- 加载中 -->
    <SRecord v-if="is_loading" />
    <!-- 滚动部分 -->
    <scroll ref="myScroll" :on-pull="onPull" v-else>
      <template v-if="!lodash.isEmpty(BetRecordClass.list_data)">
        <!-- 订单内容 -->
        <div v-for="(value, name, index) in BetRecordClass.list_data" :key="index">
          <template>
            <q-slide-transition>
              <div v-show="value.open">
                <div v-for="(item2, key) in value.data" :key="key" :item_data="item2" class="cathectic-item">
                  <!-- 单关、串关内容显示 -->
                  <template>
                    <item-simple-body v-if="item2.seriesType == '1'" :data_b="item2"></item-simple-body>
                    <item-multiple-body v-else :data_b="item2"></item-multiple-body>
                  </template>
                  <!-- 已结算列表 => 提前结算详情 -->
                  <early-settled-detail :item_data="item2"></early-settled-detail>
                </div>
              </div>
            </q-slide-transition>
          </template>
        </div>
      </template>
      <!-- 没有数据 -->
      <settle-void v-else></settle-void>
    </scroll>
  </div>
</template>

<script setup>
import { watch, onUnmounted, ref, onMounted } from 'vue';
import { api_betting } from "src/api/index.js";
import BetRecordClass from "src/core/bet-record/bet-record.js";
import { itemSimpleBody, itemMultipleBody, earlySettledDetail } from "src/base-h5/components/common/cathectic-item/app-h5/index";
import settleVoid from "src/base-h5/components/cathectic/app-h5/settle-void.vue";
import scroll from "src/base-h5/components/common/record-scroll/scroll.vue";
import SRecord from "src/base-h5/components/skeleton/record.vue";
import lodash from "lodash"

// ws 数据接入  投注记录订单消息推送
// mixins: [skt_order]

// 锚点
const myScroll = ref(null)
//是否加载中
const is_loading = ref(true)
//列表数据集合
const list_data = ref({})
//list_data里面最后的一条数据的日期 '2020-11-17'
const last_record = ref('')
// 按什么排序  2-默认排序（结算时间） 1-投注时间  3-开赛时间
const sort_active = ref(2)
// 展示多长时间的注单记录
const date_limit = ref(7)
// 是否存在下一页
const is_hasnext = ref(false)
// 接口是否返回错误码为0401038限频
const is_limit = ref(false)

onMounted(() => {
  /**
   * @description 初次切换到已结算时加载数据
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init_data()
})

/**
 *@description 初始请求注单记录数据
*@return {Undefined} undefined
*/
const init_data = () => {
  // 接口参数
  var params = {
    searchAfter: last_record.value || undefined,
    orderStatus: '1',
    orderBy: sort_active.value,
    timeType: date_limit.value == 7 ? 3 : 4,
  };
  is_loading.value = true;
  let size = 0  //第一次加载时的注单数
  api_betting.post_getH5OrderList(params).then(reslut => {
      let res = reslut.status ? reslut.data : reslut
      is_limit.value = false
      if (res.code == 200 && res.data) {
        is_loading.value = false;
        let { record, hasNext } = lodash.get(res, "data");
        is_hasnext.value = hasNext
        if (lodash.isEmpty(record)) {
          is_loading.value = false;
          return;
        }
        // 合并数据
        let obj = lodash.cloneDeep(BetRecordClass.list_data)
        BetRecordClass.set_list_data(Object.assign(obj, record))
        for (let item of Object.values(list_data.value)) {
          size += item.data.length
        }
        last_record.value = lodash.findLastKey(record);
      } else if (res.code == '0401038') {
        is_limit.value = true
        is_loading.value = false;
        return
      } else {
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
    let res = reslut.status ? reslut.data : reslut
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
      last_record.value = lodash.findLastKey(record);
      // 合并数据
      let obj = lodash.cloneDeep(BetRecordClass.list_data)
      BetRecordClass.set_list_data(Object.assign(obj, record))
    } else {
      //没有更多
      ele.setState(7);
    }
  }).catch(err => {
    console.error(err)
  });
}

</script>

<style lang="scss" scoped>
template {
  display: block;
}

.cathectic-item {
  width: 100%;
  border-radius: 0.1rem;
  background: var(--q-gb-bg-c-15);
  overflow: hidden;
  margin: 0 0 0.1rem;
  padding-bottom: 0.2rem;
}

/* **********已结算********************* *-S*/
.settle {
  height: 100%;

  .settle-scroll {
    height: 100%;
  }

  /* **********时间和输赢统计********************* *-S*/
  .tittle-p {
    width: 3.55rem;
    height: 0.54rem;
    margin: 0 auto;
    padding: 0 0 0 0.04rem;
    line-height: 0.66rem;

    >span:nth-child(1) {
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
}</style>