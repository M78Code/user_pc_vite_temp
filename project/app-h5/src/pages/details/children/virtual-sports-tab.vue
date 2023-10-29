<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 虚拟体育中部期数+轮次tab(列表+详情共用)
-->
<template>
  <div ref='details_tab' class="row vir-details-tab" v-cloak>
    <!-- 玩法集 -->
    <!-- <div class="menu-s" ref="reset_scroll_dom">
      <div class="menu-item" v-for="(item, i) in new_data_list" :key="i" @click.self="selete_item(item['id'],$event)" :class="get_details_item == item['id']?'t_color':''">
        {{item.marketName}}
      </div>
    </div> -->
      <q-tabs
        v-model="viewTab"
        inline-label
        narrow-indicator
        class="bg-tabs"
        active-color="active-tab"
        @update:model-value="change_tab"
        :content-class="curr_active_tab">
      <q-tab  :ripple="false" label="历史战绩" name="lszj" />
      <q-tab  name="bet" :ripple="false" label="投注"/>
      <q-tab  name="rank" :ripple="false" label="排行榜"/>      
    </q-tabs>
  </div>
</template>

<script>
// import { mapGetters,mapMutations } from "vuex"
import { api_common } from "src/api/index.js";
import { useRoute, useRouter } from "vue-router"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import lodash from "lodash"
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { MatchDetailCalss,MenuData,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance } from "src/core";
import { defineComponent,ref,onMounted,watch,onUnmounted,computed } from "vue";
import { details_main } from "../details";
export default defineComponent({
  props:[
    "virtual_match_list",
    "batch" //赛马期
  ],
  name:"virtual-sports-tab",
  setup(props,event){
    const viewTab =ref('bet')
    // 复刻版tab栏菜单
    const new_data_list = [
      {marketName:"历史战绩",id:1},
      {marketName:"投注",id:2},
      {marketName:"排行榜",id:3}
     ]
    const route = useRoute()
    const router = useRouter()
    // 默认显示虚拟体育分析按钮
    const analyse = ref(true)
    // 渲染的数据
    const data_list = ref([])
    //获取二级菜单ID
    const sub_menu_type = ref(MenuData.get_current_sub_menuid())
   // 正在跳转详情的赛事  
    const  get_details_item =ref( MatchDetailCalss.details_item)
   // 从数据仓库获取赛事详情 
    const  get_detail_data =ref(lodash.get(MatchDataWarehouseInstance, `list_to_obj.mid_obj[${route.params.mid}_]`))
    // 详情一键收起状态:
    const  get_fewer =ref( MatchDetailCalss.fewer) 
    let timer1_,timer_ = null
    const reset_scroll_dom = ref(null)
    const initEvent =()=>{
      if(timer1_) { clearTimeout(timer1_) }
      timer1_ = setTimeout(() => {
        try{
          // reset_scroll_dom.value.scrollLeft = 0 //todo
        }catch(e){
          console.error(e)
        }
      }, 400);
    }
    /* 
      *监听菜单版本获取最新的二级菜单id
      *
    */
    watch(()=>MenuData.update_time,()=>{
      sub_menu_type.value =MenuData.get_current_sub_menuid()
    })
    onMounted(()=>{
     // 延时器
      timer1_ = null;
      timer_ = null;
      initEvent()
      play_list()
      MatchDetailCalss.set_is_show_details_analyse(false)
    }) 
    const {off} = useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB, initEvent)
    const {off:OFF_TAB_BET} = useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB_BET, initEvent)

   watch(()=>props.batch,()=>{
    play_list()
    })
    // ...mapMutations([
    //   'set_details_item',
    //   'set_first_details_item',
    //   'set_fewer',
    //   'set_is_show_details_analyse'
    // ]),
    //详情是否显示统计信息
     const is_show_analyse =ref(MatchDetailCalss.is_show_details_analyse) 
    /**
     *@description: 虚拟体育分析按钮
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const analyse_btn =()=> {
      analyse.value = !analyse
      MatchDetailCalss.set_is_show_details_analyse(!is_show_analyse.value)
    }
    const change_btn=()=>{
      // 设置vuex变量值
      if(get_fewer.value == 1 || get_fewer.value == 3){
        MatchDetailCalss.set_fewer(2)
      }else{
        MatchDetailCalss.set_fewer(1)
      }
    }
    // 单击玩法集
    const selete_item =(uId,e)=>{
      // 点击的玩法是当前选中的玩法
      if(get_details_item.value == uId) return false;
      if(is_show_analyse.value){
        analyse.value = true
      }
      MatchDetailCalss.set_is_show_details_analyse(false)
      //实现动态效果
      try {
        let dom = reset_scroll_dom.value;
        if(!dom) return;

        let start_ = dom.scrollLeft;
        let end_ = e.target.offsetLeft + e.target.clientWidth/2 - dom.offsetWidth/2;
        if(start_ > end_ && end_ > 0){
          let s = start_;
          timer_ = setInterval(() => {
            dom.scrollLeft = s;
            s -= 7;
            if(s <= end_){
              clearInterval(timer_);
            }
          }, 18);
        }else if(start_ <= end_ && end_ > 0){
          let s = start_;
          timer_ = setInterval(() => {
            dom.scrollLeft = s;
            s += 7;
            if(s >= end_){
              clearInterval(timer_);
            }
          }, 18);
        }else if(end_ < 0){
          timer_ = setInterval(() => {
            dom.scrollLeft -= 7
            if(dom.scrollLeft <= 0){
              clearInterval(timer_);
            }
          }, 18);
        }
      } catch (error) {
        console.error(error)
      }

     MatchDetailCalss.set_details_item(uId);
      // 点击玩法对页面吸顶tab做高度处理
      useMittEmit(MITT_TYPES.EMIT_DETAILILS_TAB_CHANGED)
      // 虚拟体育切换玩法集,滚动条高度默认恢复为0
      event.emit('virtual_play_height')
      if(get_fewer.value == 3){
        MatchDetailCalss.set_fewer(1)
      }
    }

    /**
     *@description: 调用玩法集的接口
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const play_list=()=>{
      // 1.在足球页进入详情需要调用玩法集合接口
      // 2.在赛马页需要调用玩法集合接口
      if(![1001,1004].includes(sub_menu_type.value) || route.name == 'virtual_sports_details'){
        let new_mid = ''
        if(props.batch){
          new_mid = props.batch
        }else{
          new_mid = route.query.mid
        }
        let params = { sportId: sub_menu_type.value,mid: new_mid};
        api_common.get_category_list(params).then(res =>{
          if(res.code == 200 && res.data){
            data_list.value = lodash.get(res, "data");
            let first_data_item = data_list.value[0];
            if(first_data_item){
             // 将玩法集第一个存入详情类，后续赛种/赛事期数跳转时做判断用
             MatchDetailCalss.set_first_details_item(first_data_item.id);
             MatchDetailCalss.set_details_item(first_data_item.id);
             //玩法集存入数据仓库
             MatchDetailCalss.compute_category_refer(data_list.value); 
            }
          }
        })
      }
    }
      //   // 历史战绩：标准赛事详情页的时候不显示,只在虚拟体育详情显示历史战绩(其中篮球不显示历史战绩)
    const anlyse_show=computed(()=>{
      return   GlobalAccessConfig.get_statisticsSwitch()&& route.name != 'virtual_sports' && get_detail_data.value?.csid != 1004
    }) 
    const change_tab =(val)=>{
      viewTab.value =val
      event.emit('change_tab',val)
    }
    onUnmounted(()=>{
      OFF_TAB_BET()
      off()
      MatchDetailCalss.set_fewer(1);
      clearTimeout(timer1_)
      clearInterval(timer_);
    })
    const {
      scroller_scroll_top,
      curr_active_tab
    } = details_main()
    return {
      reset_scroll_dom,
      data_list,
      get_details_item,
      get_fewer,
      selete_item,
      anlyse_show,
      analyse,
      change_btn,
      analyse_btn,
      new_data_list,
      viewTab,
      change_tab,
      curr_active_tab
    }
  }

  //todo
  // computed:{
  //   // ...mapGetters([
  //   //   'get_details_item',
  //   //   'get_uid',
  //   //   'get_tab_fix',
  //   //   "get_fewer",
  //   //   "get_current_league",
  //   //   "get_detail_data",

  //   // ]),
  //   // ...mapGetters({
  //   //   matchid: "get_goto_detail_matchid",
  //   //   sub_menu_id: 'get_current_sub_menuid',
  //   //   sub_menu_type: 'get_curr_sub_menu_type',
  //   //   is_show_analyse: 'get_is_show_details_analyse'
  //   // }),


  

})


</script>
<style lang="scss" scoped>
.vir-details-tab {
  height: 0.4rem;
  margin-bottom: 0.04rem;
  width:100%;
}

.bg-tabs {
    width:100%;
    background: var(--q-gb-bg-c-15);
   
  .bg-active-tab {
    background: var(--q-gb-bg-c-15);
  
  }
  }
 .details-tab{
  border-top:0.5px solid #F2F2F6;
 }
 :deep(.q-tab) {
    min-height: 0.4rem;
    height: 0.4rem;

    &.text-active-tab {
      .q-tab__label {
        font-weight: bolder;
        color: var(--q-gb-t-c-1);
      }
    }

    .q-tab__label {
      font-size: 0.14rem;
      color: #999999; // var(--q-detials-color-7)
    }
  }

  :deep(.q-tab__indicator) {
    color: var(--q-gb-bg-c-13);
    border-radius: 1.5px;
    z-index: 1;
  } 
</style>
