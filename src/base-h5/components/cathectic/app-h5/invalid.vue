<!--
 * @Desc: 预约投注记录
 * @Author: Iverson
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div class="pre_record" ref="pre_record">
    <!-- 加载中 -->
    <SRecord v-if="is_loading" />
    <scroll ref="myScroll" :on-pull="onPull" v-else>
      <template v-if="!lodash.isEmpty(BetRecordClass.list_data)">
        <!-- 订单内容 -->
        <div v-for="(value, name, index) in BetRecordClass.list_data" :key="index">
          <q-slide-transition>
              <div v-for="(item2, key) in value.data" :key="key" :item_data="item2" class="cathectic-item">
                <!-- 单关、串关内容显示 -->
                <template>
                  <item-simple-body v-if="item2.seriesType == '1'" :data_b="item2"></item-simple-body>
                  <item-multiple-body v-else :data_b="item2"></item-multiple-body>
                </template>
              </div>
            </q-slide-transition>
        </div>
      </template>
      <!-- 无数据展示 -->
      <settle-void v-else></settle-void>
    </scroll>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, onUnmounted, onMounted } from 'vue'
import BetRecordClass from "src/core/bet-record/bet-record.js";
import { api_betting } from "src/api/index.js";
import { itemSimpleBody, itemMultipleBody, cancelReserve } from "src/base-h5/components/common/cathectic-item/app-h5/index";
import settleVoid from "src/base-h5/components/cathectic/app-h5/settle-void.vue";
import scroll from "src/base-h5/components/common/record-scroll/scroll.vue";
import SRecord from "src/base-h5/components/skeleton/record.vue";
import lodash from "lodash";

// 页面锚点
const myScroll = ref(null)
//是否在加载中
const is_loading = ref(true)
//list_data里面最后的一条数据的日期 '2020-11-17'
const last_record = ref('')
// 是否存在下一页
const is_hasnext = ref(false)

/**
 *@description 初次切换到预约时加载数据
*@return {Undefined} undefined
*/
onMounted(() => {
  init_data()
})

/**
 *@description 初始请求注单记录数据
*@return {Undefined} undefined
*/
const init_data = () => {
  var params = {
    preOrderStatusList: [0]
  }
  is_loading.value = true
  //第一次加载时的注单数
  let size = 0
  api_betting.get_preOrderList_news(params).then(result => {
    let res = result.status ? result.data : result
    if (res.code == 200 && res.data) {
      is_loading.value = false
      let { record, hasNext } = lodash.get(res, "data");
      is_hasnext.value = hasNext
      if (lodash.isEmpty(record)) {
        return;
      }
      for (let item of Object.values(record)) {
        for (var i = 0; i < item.data.length; i++) {
          item.data[i].orderVOS = item.data[i].detailList
        }
        size += item.data.length
      }
      last_record.value = lodash.findLastKey(record);
      // 合并数据
      let obj = lodash.cloneDeep(BetRecordClass.list_data)
      BetRecordClass.set_list_data(Object.assign(obj, record))
    } else {
      is_loading.value = false;
      return;
    }
  }).catch((err) => {
    is_loading.value = false;
  })
}
/**
 *@description 页面上推分页加载
*@return {Undefined} undefined
*/
const onPull = () => {
  let ele = myScroll.value
  if (!is_hasnext.value || last_record.value === undefined) {
    //没有更多
    ele.setState(7);
    return;
  }
  var params = {
    preOrderStatusList: [0],
    searchAfter: last_record.value || undefined,
  };
  //加载中
  ele.setState(4);
  api_betting.get_preOrderList_news(params).then(result => {
    let res = result.status ? result.data : result
    // 为 null 时容错处理
    if (!res.data) {
      is_hasnext.value = false
      //没有更多
      ele.setState(7);
      return
    }
    //加载完成
    ele.setState(5);
    let { record, hasNext } = lodash.get(res, "data", {});
    is_hasnext.value = hasNext
    if (res.code == 200 && res.data) {
      for (let item of Object.values(record)) {
        for (var i = 0; i < item.data.length; i++) {
          item.data[i].orderVOS = item.data[i].detailList
        }
      }
      last_record.value = lodash.findLastKey(record);
      // 合并数据
      let obj = lodash.cloneDeep(BetRecordClass.list_data)
      BetRecordClass.set_list_data(Object.assign(obj, record))
    } else {
      //没有更多
      ele.setState(7);
    }
  }).catch(err => { console.error(err) });
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

.pre_record {
  height: 100%;

  .filter-button {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;
    top: 0.15rem;

    .select {
      color: var(--q-gb-t-c-12);
    }
  }

  .pretype-tabs {
    height: 0.28rem;
    border-radius: 0.14rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.1rem auto 0 auto;

    &>div {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.2rem;
      opacity: 0.6;
      font-size: 0.14rem;

      &.selected {
        border-radius: 0.12rem;
        font-size: 0.14rem;
        font-weight: 600;
      }
    }
  }

  .tittle-p {
    width: 3.55rem;
    margin: 0 auto;
    padding: 0 0 0 0.04rem;
    line-height: 0.18rem;
    margin-top: 0.16rem;
    margin-bottom: 0.1rem;

    span {
      font-size: 0.18rem;
      letter-spacing: 0;
      font-weight: bold;
    }
  }

  .tittle-p2 {
    width: 3.55rem;
    padding: 0 0 0 0.04rem;
  }

  .icon-down-arrow {
    transform: scaleY(-1);
  }

  .line {
    height: 0.5px;
  }
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
</style>
