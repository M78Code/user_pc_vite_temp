<!--
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-15 19:17:42
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-17 10:53:04
 * @FilePath       : \user-pc-vue3\src\project-ouzhou\pages\detail\analysis\compoments\venue_box\index.vue
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: cooper
 * @Date: 2023-06-06 14:13:55
 * @Description: 动画，比分榜组件
-->
<template>
    <div>
      <div class="analysis-body">
        <div class="analysis-top">
          <div class="analysis-top-l">
            <!-- <div class="v-icon switch-icon"></div> -->
            <sport_icon :sport_id="detail_info.csid" :status="false" size="18px" class="icon" style="margin:0 10px"/>
            <span class="analysis-top-txt">{{ detail_info.tn }}</span>
          </div>
          <div class="analysis-top-right">
            <img v-if="detail_info.mvs>-1" :src="animal_key?animal_active:animal" alt="" srcset="" style="margin-right:15px" @click="tab_click('animal')">
            <img :src="score_key?score_active:score" alt="" srcset="" @click="tab_click('score')">
          
          </div>
        </div>
     
        <animal_box v-if="animal_key"  :detail_info="detail_info" />
        <score_info v-show="score_key" :score_list="score_list" :detail_info="detail_info" />
       
  
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref,computed,watch } from "vue";
  import animal_box from './animal_box.vue'

  import score_info from './score_info.vue'
  import animal from 'src/assets/images/video/animal.png'
  import animal_active from 'src/assets/images/video/animal_active.png'
  import score from 'src/assets/images/video/score.png'
  import score_active from 'src/assets/images/video/score_active.png'
  import sport_icon from "./sport_icon.vue";
  
  const props =  defineProps({
    detail_info: {  // 赛事详情
      type: Object,
      default: () => {}
    },
    score_list: {  //比分详情
        type: Object,
        default: () => { }
    },
  })

  watch(()=>props.detail_info,val=>{
    animal_key.value = false
    score_key.value = true
  })


  const animal_key = ref(false)
  const score_key = ref(true)
  
  
  const tab_click = (type)=>{

   if(type=='animal'){
    animal_key.value = true
    score_key.value = false
   }else{
    animal_key.value = false
    score_key.value = true
   
   }
  } 
  </script>
  
  <style lang="scss" scoped>
  .analysis-body {
    // background: #ffffff;
    margin-bottom: 10px;
    .analysis-top {
      background: #ffffff;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .switch-icon {
        background-image: url("../../../../assets/images/football_icon.png");
        height: 16px;
        width: 16px;
        margin:0 6px 0 12px ;
      }
      .analysis-top-txt {
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        text-transform: capitalize;
        color: #1a1a1a;
      }
      .analysis-top-l{
        display: flex;
      }
      .analysis-top-right {
        display: flex;
        margin-right: 15px;
        img{
          height: 16px;
          cursor: pointer;
        }
        .switch-icon-1 {
          background-image: url("../../../../assets/images/switch_active.png");
          background-repeat: no-repeat;
          height: 16px;
          width: 16px;
          margin-right: 14px;
        }
        .switch-icon-2 {
          background-image: url("../../../../assets/images/score.png");
          background-repeat: no-repeat;
          height: 16px;
          width: 16px;
          margin-right: 14px;
        }
      }
    }
  }
  </style>
  