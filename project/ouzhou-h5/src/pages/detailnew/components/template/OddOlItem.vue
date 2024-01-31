<template>
   <div v-show="false">{{ BetData.bet_data_class_version }}</div>
  <div class="component odd-ol-item" v-show="value.os != 3"
    :class="[{ 'active': BetData.bet_oid_list.includes(value['oid'] ) }, status, type, calcOlResult(value['result'])]"
  >
    <div class="icontainer" v-if="vif"
      :class="{'ol-v-hide': isLock}"
      @click="onClick"
    >
      <!-- 欧洲h5 vr 详情专用 -->
      <!-- <div v-if="['virtual_sports_details'].includes(route.name) && lodash.get(value, 'result')" class="mock">
       {{ i18n_t('virtual_sports.result')[value['result']] }}
      </div> -->
      <template v-if="isLock" @click.stop>
        <div class="ol-lock" :class="{'ol-v-show': isLock}">
          <img :src="odd_lock_ouzhou" alt="lock" class="ol-lock-img">
        </div>
      </template>
      <div class="item ol-name" :alt="olName">
        <span class="ol-name-span" v-if="route.name != 'virtual_sports' && !lodash.isArray(olName)">
          <span v-if="txt_ol_name" class="ol-name-span2">{{ txt_ol_name }}</span>
          {{ olName }}
        </span>
        <span class="ol-name-span" v-if="route.name == 'virtual_sports' && lodash.isArray(olName)">
          <img v-if="olName.length == 2" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vr/${olName[0]}.png`">
          <img v-if="olName.length == 2" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vr/${olName[1]}.png`" style="margin-left: 5px;">
        </span>
      </div>
      <div class="separate"></div>
      <div class="item ol-content">
        <div class="ol-content-ov">
          <span v-if="isLock">0.xx</span>
          <span v-else>{{ compute_value_by_cur_odd_type(value.ov, value._hpid,value._hsw, sportId) }}</span>
          <img class="odd-image" v-show="status != 'none'"
            :src="oddUp ? ouzhou_hps_up : ouzhou_hps_down" />
        </div>
      </div>
    </div>
    <!-- 赛果 -->
    <div class="icontainer ol-result" v-if="value['result']"
    >
      <div class="item ol-name" :alt="olName">
        <span class="ol-name-span">{{ olName }}</span>
      </div>
      <div class="separate"></div>
      <div class="item ol-content or-state">
        <div class="ol-content-ov">
          {{ i18n_t('bet_record.bet_no_status0'+value['result']) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, computed, watch } from 'vue'
import { compute_value_by_cur_odd_type, MatchDetailCalss, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import common, { state } from './common.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import {
  odd_lock_ouzhou,
  ouzhou_hps_up,
  ouzhou_hps_down,
  ouzhou_white_down,
  ouzhou_white_up
} from "src/base-h5/core/utils/local-image.js";
import ResultOlItem from '../../result/ResultOlItem.vue';
import { calcOlResult } from 'src/output/index'
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"

const route = useRoute();
const router = useRouter();

/** @type {{value: TYPES.OlResult|TYPES.Ol,type?: TYPES.OlItemType}} */
const props = defineProps({
  value:Object,
  type:{
    type: String,
    required: false,
    default: "default"
  },
})
const sportId = MatchDetailCalss.params.sportId

const getNameBySportMenuId = ()=>{
  const csid = VR_CTR.state.virtual_current_sub_menuid;
  let name = ''
  if(csid == 1011){
      name = 'horse'
  }else if(csid == 1002){
    name = 'dog'
  }else if(csid == 1010){
    name = 'motorbike'
  }else if(csid == 1009){
    name = 'speedway'
  }
  return name;
}

//用图片替代数字
const computedOlName = (olName)=>{
  if(!lodash.includes(olName, '/')){
    return olName
  }
  const olNameArr = lodash.split(olName, '/')
  return lodash.map(olNameArr, (item)=>`${getNameBySportMenuId()}_${item}`)
}

// @ts-ignore
const vif =computed(()=>props.value._mhs == 0||props.value._mhs == 11 || props.value._mhs == 1)
const olName = (function(){
  let olName = '';
  if(props.type == 'fill'){
    olName = props.value.otv || props.value.on || props.value.ott
  }
  olName = props.value.on || props.value.ott

  if(route.name == 'virtual_sports'){
    return computedOlName(olName)
  }else{
    return olName
  }
})()


// const active = computed(()=> BetData.bet_oid_list.includes(props.value.oid))
const active = computed(() => state.active == props.value.oid)
/** @type {Ref<'up' | 'down' | 'none'>} */
const status = ref('none')
const oddUp = ref(false)

watch(() => props.value?.ov, (newVal, oldVal) => {
  status.value = (oddUp.value = newVal > oldVal) ? 'up' : 'down'
  resetStatus()
});

const ov = (() => {
  // @ts-ignore
  return compute_value_by_cur_odd_type(props.value.ov, props.value._hpid, props.value._hsw, sportId)
})()
/** Over|Under 添加 O|U;  反波胆玩法增加'非' */
const txt_ol_name = (function(){
  if(props.value.ot == 'Over'){
    return 'O  '
  }else if(props.value.ot == 'Under'){
    return 'U  '
  }
  let res = (['367','368','369'].includes(props.value._hpid) && (props.value.ot != 'Other'))?i18n_t('detail.non') : '';
  return res;
})()

const isLock = computed(() => {
  // console.log("props.value====", props.value)
  if (props.value) {
    // @ts-ignore
    const { _mhs,_hs } = props.value
    if(_mhs == 0 || _mhs == 11){
      if( _hs == 0 || _hs == 11){
        if(props.value.os == 1){
          return Number(ov) == 0
        }
      }
    }
  }
  return true
})

function onClick(){
  if(isLock.value){
    return
  }
  // console.log("lodash.get(props.value, 'result')", lodash.get(props.value, 'result'))
  if(lodash.get(props.value, 'result')){
    return
  }
  common.betClick(props.value)
}

let timer = 0
function resetStatus() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    status.value = 'none'
  }, 3000)
}
</script>

<style scoped lang="scss">
.ol-name-span2{
  margin-right: 2px;
  white-space: pre;
}
.overflow {
  flex: 1;
  width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
.ol-v-hide{
  visibility: hidden;
}
.ol-v-show{
  visibility: visible;
}

.component.odd-ol-item{
  width: 100%;
  height: .58rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  box-shadow: 0 0 1px 1px #F5F5F5;
  flex-grow: 1;
  flex-basis: 25%;

  --private-ol-content-color: #FF7000;
  &.r-win,&.r-win-half{
    background-color: #FFC8C8; //#TODO: css var
    .ol-result{
      --private-ol-content-color: #FF4646; //#TODO: css var
    }
  }
  &.active {
    background-color: #FF70001A;
  }
  &.none {}

  &.up,
  &.down {

  }

  &.up {
    --private-ol-content-color: #FF4646;
  }

  &.down {
    --private-ol-content-color: #17A414;
  }
}

.icontainer {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  &.ol-result{
    --private-ol-content-color: #8A8986; //#TODO: css var
  }

  // .mock{
  //   position: absolute; 
  //   z-index: 11; 
  //   // float: left; 
  //   width: 100%; 
  //   padding: 0.2rem 0; 
  //   background-color: rgba(200, 200, 200, 0.9); 
  //   color: red; 
  //   text-align: center;
  // }
}

.separate {
  width: 10px;
}

.item {
  flex-basis: 25%;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.ol-name {
  text-align: right;
  justify-content: end;
}

.ol-content {
  color: var(--private-ol-content-color);
  position: relative;
  display: flex;
  align-items: center;
  vertical-align: middle;
}
.ol-content-ov{
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}
.odd-image {
  display: flex;
  --private-local-odd-image-size: 14px;
  width: var(--private-local-odd-image-size);
  height: var(--private-local-odd-image-size);
  position: absolute;
  object-fit: contain;
  left: 100%;
}

.ol-lock {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ol-lock-img {
  width: 16px;
  // height: 1rem;
  line-height: 100%;
}
.component{
  &.fill{
    .icontainer{
      padding: 0 20px;
    }
    .ol-name{
      text-align: left;
      justify-content: start;
      @extend .overflow;
      .ol-name-span{
        @extend .overflow;
      }
    }
    .ol-content{
      flex: none;
      justify-content: end;
    }
  }
  &.column{
    padding: 10px 0;
    .icontainer{
      width: 100%;
      flex-direction: column;
      justify-content: center;
    }
    .separate{
      display: none;
    }
    .item{
      margin: 2px 5px;
      justify-content: center;
    }
    .ol-name{
      @extend .overflow;
      width: 100%;
      text-align: center;
      .ol-name-span{
        @extend .overflow;
      }
    }
  }
  &.auto{
    padding: 10px 0;
    .icontainer{
      margin-top: 10px;
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
    }
    .separate{
      display: none;
    }
    .item,.ol-lock-img{
      margin: 2px 5px;
    }
    .item{
      flex: 1;
      justify-content: center;
    }
    .ol-name{
      flex-basis: 50%;
    }
    .ol-content{
      flex-basis: 30%;
    }
  }
}
</style>