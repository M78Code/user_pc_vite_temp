<!--
 * @Desc: 投注记录弹框未结算页
 * @Author: Router
-->
<template>
    <div class="mx-10 unsettle" ref="unsettle">
      <!-- 加载中 -->
      <SRecord v-if="is_loading"/>
      <scroll ref="myScroll" :on-pull="onPull" v-else>
        <template v-if="no_data">
          <div class="filter-button" v-if="get_user.settleSwitch == 1">
            <!-- 提前结算筛选按钮 -->
            <i class="yb_fontsize12" @click.stop="change_early" :class="{'select':is_early}">
              {{ $root.$t('early.btn2') }}<i class="early yb_ml4" :class="{'early2': is_early}"></i>
            </i>
          </div>
          <!-- 订单内容 -->
          <template v-if="!is_all_early_flag">
            <div v-for="(value,name,index) in list_data" :key="index">
              <template v-if="!is_early|| (is_early && clac_is_early(value.data))">
                <p class="tittle-p row justify-between yb_px4" :class="index == 0 && 'tittle-p2'" @click="toggle_show(value)">
                  <span>{{(new Date(name)).Format($root.$t('time2'))}}</span>
                  <span v-if="!value.open && index != 0"><img class="icon-down-arrow" src="image/wwwassets/bw3/list/league-collapse-icon.svg" /></span>
                </p>
                <!--线-->
                <div class="line" :class="!value.open && (index != Object.keys(list_data).length-1) && 'line2'"></div>
                <q-slide-transition>
                  <div v-show="value.open">
                    <!--投注记录的页每一条注单-->
                    <common-cathectic-item :item_data="item2" v-for="(item2,key) in value.data" :key="key" class="my-4" :key2="key" :len="value.data.length" :is_early="is_early"></common-cathectic-item>
                  </div>
                </q-slide-transition>
              </template>
            </div>
          </template>
        </template>
        <!-- 去投注 -->
        <settle-void :is_early="is_all_early_flag" v-if="(!no_data || is_all_early_flag)" :is_limit="is_limit"></settle-void>
      </scroll>
    </div>
  </template>

  <script>
    import { defineComponent, ref } from "vue"
    let unsettle =  defineComponent({
        name: '',
        components: {},
        setup() {
          //是否在加载中
          let is_loading = ref(false)
          //列表数据
          let list_data = ref([])
          //是否没有数据
          let no_data = ref(true)
          // 提前结算图标是否选中
          let is_early = ref(false)
          // 是否存在下一页
          let is_hasnext = ref(false)
          //判断提前结算按钮是否选中，并且选中状态下所有订单是否存在已提前结算
          let is_all_early_flag = ref(false)
          // 接口是否返回错误码为0401038限频
          let is_limit = ref(false)
          //需要查绚提前结算金额的订单集合
          let orderNumberItemList = ref([])
          //错误码为0401038拉取接口次数
          let count = ref(0)
          //服务器返回错误为0401038拉取接口次数
          let count2 = ref(0)

          
          return {
            is_loading,
            list_data,
            no_data,
            is_early,
            is_hasnext,
            is_all_early_flag,
            is_limit,
            orderNumberItemList,
            count,
            count2,
          }
        }
    })
    export { unsettle }
  </script>

  <style lang="scss" scoped>

  </style>