
<!--
 * @Author: cooper
 * @Date: 2023-05-19 15:13:55
 * @Description: 赛事详情页玩法
-->
<template>
  <div class="match-detail-odds">
    <div v-for="item in matchDetail" :key="item.topKey" class="odds-wrap">
      <q-expansion-item v-model="item.expanded" :expand-icon-toggle="false" :hide-expand-icon="true" expand-separator :default-opened="true"
        :header-style="{ backgroundColor: '#ffffff', height: '50px' }">
        <!-- 赛事玩法名称 -->
        <template v-slot:header>
          <div style="width:100%;line-height: 35px;font-weight: 500;">
            {{ item.hpn }}
            <span v-if="item.hps">({{ item.hps.split('|')[1] }})</span>
            <!-- <img v-if="item.mouse_in" :src="in_muse" alt="" srcset="" class="expand-mouse-in" :style="{transform:item.expanded?'rotate(0deg)':'rotate(180deg)'}" > -->
            <img  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/down_arrow.png`" alt="" srcset="" class="expand-icon" :style="{transform:item.expanded?'rotate(0deg)':'rotate(180deg)'}" >
          </div>
        </template>
        <q-card>
          <q-card-section>
            <!-- 详情页玩法名称 -->
            <div class="odds-title" :style="{ gridTemplateColumns: columnTotal(item) }">
              <template v-if="item.title && item.title.length > 0">
                <span v-if="[5].includes(item.hpt)" class="odds-title-li"></span>
                <div v-for="opt in item.title" :key="opt.otd" class="odds-title-li">
                  <span v-if="![0, 1, 2, 3, 7, 10].includes(item.hpt)" class="handicap-value-text">{{ opt.osn }}</span>
                  <!-- 模板4 -->
                  <template v-if="[4,6].includes(item.hpt)">
                    <div class="temp-simple">
                      <div v-for="ol in sun_ol(item.hl[0].ol, item)" :key="ol.oid">
                        <template v-if="ol.otd === opt.otd">
                          <div v-show="!item.hl[0].hs" :class="{ 'tem4': true, 'tem4-active': ol.oid == current_ol.oid }"
                            @click="betItemClick(item.hl[0], ol)">
                            <span :style="{ color: ol.oid == current_ol.oid ? '#ffffff' : '#ff7000' }" >{{ ol.on }}</span>
                            <span v-if="ol.ov" >{{Math.floor(ol.ov /1000) /100  }} </span>
                            <!-- <span>{{ sun_ov(ol) }}</span> -->

                          </div>
                          <div style="text-align: center;width:100%" class="tem4" v-show="item.hl[0].hs">
                            <img class="vector" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`" alt="" >
                          </div>
                           
                        </template>
                      </div>

                    </div>
                  </template>
                </div>
              </template>
              <template v-else>
                <div v-for="ol in item.hl" :key="ol.hid">
                  <!-- <div>{{ ol.hv }}</div> -->
                </div>
              </template>

            </div>
            <!-- 公共模板 -->
            <common_template v-if="[0, 1, 2, 3, 7, 10].includes(item.hpt)" :match_info="item" :current_ol="current_ol"
              @betItemClick="betItemClick" />
            <!-- 模板5 -->
            <template5 v-if=[5].includes(item.hpt) :match_info="item.hl" :current_ol="current_ol"
              @betItemClick="betItemClick" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>
    <!-- 详情页有数据时展示白色底部 -->
    <div  v-if="!show_close_thehand"  class="bottom-height"></div>
    <!-- 无数据时展示无盘口的数据提示 -->
    <div v-else class="close_thehand_icap">
      <div>
      <img src="" alt="" srcset="">
      <div style="text-align: center;color:#A1A3A5;font-weight: 500;">Close the Handicap</div>
      </div>
    </div>

    <!-- <div class="detail-loading" v-if="loading">
      <q-circular-progress indeterminate rounded size="80px" :thickness="0.1" color="opt-basic" class="q-ma-md" />
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, ref, computed,inject} from "vue";
import {LOCAL_PROJECT_FILE_PREFIX } from 'src/core/index.js';
import template5 from './template5.vue'
import common_template from './common_template.vue'
// import { storage_bet_info } from 'src/utils/bet_info'
// import down_arrow_fold from 'src/assets/images/down_arrow_fold.png'
// import close_thehand_icap from 'src/assets/images/close_the_handicap.png'//无盘口数据提示图片
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js" 
const props = defineProps({
  matchDetail: {
    type: Array,
    default: () => []
  },
  detail_info: {
    type: Object,
    default: () => { }
  },
  loading: {
    type: Boolean,
    default: false
  },
  show_close_thehand: {
    type: Boolean,
    default: false
  },
})
const mouse_in = ref(false)
const current_ol = ref({})
const emit = defineEmits(['change'])

 let all_hl_item = inject('all_hl_item')

const columnTotal = (item) => {
  let total;
  if (item.title.length > 0) {
    total = [5].includes(item.hpt) ? item.title.length + 1 : item.title.length
  } else {
    total = 2
  }
  return `repeat(${total}, 1fr)`
}

  //  计算赔率变化
const sun_ov = (ol)=>{
 
 
  if (all_hl_item.value.length>0&&ol) {
 
    const obj = all_hl_item.value.find(item=>item.oid==ol.oid)

  }

}
//  模板4 数据处理
const sun_ol = (ol, item) => {
  let maxCount = 0
  const obj = {}
  let itemList = []
  let result = []
  item.title.forEach((opt, index) => {
    itemList = ol.filter(i => i.otd === opt.otd)
    obj[opt.otd] = itemList
    if (itemList.length > maxCount) {
      maxCount = itemList.length   // 获取最大值那一列的数量
    }
  });
  for (const key in obj) {
    let ele = obj[key]
    let list = []
    if (ele.length !== maxCount) {
      // 列数不够的话添加假数据
      for (let index = 0; index < maxCount - ele.length; index++) {
        list.push({ otd: Number(key), on: '', oid: key + '-' + index })

      }
    }
    obj[key] = [...obj[key], ...list]
    result = [...obj[key], ...result]
  }
  return result
}
//  投注项点击投注,
const betItemClick = (item, ol) => {
  
  if (item.hs) {
    return
  }
  if (ol.cds) {
    current_ol.value = ol
    let params = {
    oid: ol.oid, // 投注项id ol_obj
    _hid: ol._hid, // hl_obj 
    _hn: ol._hn,  // hn_obj
    _mid: ol._mid,  //赛事id mid_obj
  }
  console.log("odds_info.vue", ol, params);
  let other = {
    is_detail: true,
    // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
    // 根据赛事纬度判断当前赛事属于 那种投注类型
    bet_type: 'common_bet',
    // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
    device_type: 2, 
    // 数据仓库类型
    match_data_type: "pc_detail", // h5_detail
  }
  set_bet_obj_config(params,other)

  }
}
// 事件执行函数

const active = ref(1)




onMounted(() => {

});
</script>

<style lang="scss" scoped>

.match-detail-odds {
  height: calc(100vh - 248px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-right: -4px;
  position: relative;
  :deep(.close_thehand_icap){
    width: 100%;
    height: 100%;
    background-color: white;
  }
  :deep(.close_thehand_icap>div){
  position: absolute;
  left: 50%;
  top: 10%;
  transform: translate(-50%,0);
  }
  :deep(.q-card__section--vert) {
    padding: 0px;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cccccc;
    border-radius: 4px;
  }

  :deep(.q-focus-helper){
 display: none;
  }


}


.odds-wrap {
  background: #FFFFFF;
  box-sizing: border-box;
  border-bottom: 1px solid #FF7000;

  .odds-hpn {
    display: block;
    font-weight: 500;
    font-size: 14px;
    line-height: 40px;
    height: 40px;
    margin-left: 16px;
    color: #1A1A1A;

  }

  .odds-title {
    // background: #F5F5F5;
    display: grid;
    text-align: center;
    // height: 26px;
    // line-height: 26px;

    .odds-title-li {
      background: #F5F5F5;

      .handicap-value-text {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        color: #1A1A1A;
        opacity: 0.6;
        font-size: 12px;

      }
    }
  }
}

.temp-simple {
  margin-left: -1px;
  background: #FFFFFF;
}

.tem4 {
  min-height: 45px;
  line-height: 45px;
  padding: 0 20px;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  color: #1A1A1A;
  //  border-top: 1px solid #E2E2E2;
  border-left: 1px solid #E2E2E2;
  border-bottom: 1px solid #E2E2E2;
  cursor: pointer;

  &:hover {
    background: #FFF1E6;
    ;
  }
}

.tem4-active {
  background-color: #FF7000;
  color: #FFFFFF;

  &:hover {
    background: #ff7000 !important;
    color: #ffffff;

  }
}

.bottom-height {
  height: 150px;
  width: 100%;
  background-color: #FFFFFF;
}

.detail-loading {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, 0);
}
.expand-icon{
  height: 9px;
  float: right;
  margin-top: 12px;
}

.vector {
    width: 16px;
    height: 16px;
  }

.expand-mouse-in{}
</style>
