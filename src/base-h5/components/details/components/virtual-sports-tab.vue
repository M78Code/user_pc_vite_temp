<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 虚拟体育中部期数+轮次tab(列表+详情共用)
-->
<template>
  <div ref='details_tab' class="row vir-details-tab" v-cloak>
    <!-- 收起的箭头 -->
    <div class="fat-btn" @click="change_btn()">
      <div class="tab-btn" :class="{collapsed:get_fewer != 2}"></div>
    </div>
    <!-- 灰色间隔线 -->
    <div class="menu-third"></div>
    <!-- 玩法集 -->
    <div class="menu-s" ref="reset_scroll_dom">
      <div class="menu-item" v-for="(item, i) in data_list" :key="i" @click.self="selete_item(item['id'],$event)" :class="get_details_item == item['id']?'t_color':''">
        {{item.marketName}}
      </div>
    </div>
    <!-- 分析icon(详情页面的时候显示分析,在其他页面不显示分析按钮) -->
    <div v-if="anlyse_show" class="icon-style" @click="analyse_btn">
      <div :class="[analyse ? 'analyse-icon':'analyse-close-icon']"></div>
    </div>
  </div>
</template>

<script>
// import { mapGetters,mapMutations } from "vuex"
import { api_common } from "src/api/index.js";
import { useRoute, useRouter } from "vue-router"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import lodash from "lodash"
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
const route = useRoute()
const router = useRouter()

export default {
  name: 'virtual_sports_tab',
  data(){
    return {
      // 默认显示虚拟体育分析按钮
      analyse:true,
      // 渲染的数据
      data_list:[],
    }
  },
  computed:{
    // ...mapGetters([
    //   'get_details_item',
    //   'get_uid',
    //   'get_tab_fix',
    //   "get_fewer",
    //   "get_current_league",
    //   "get_detail_data",

    // ]),
    // ...mapGetters({
    //   matchid: "get_goto_detail_matchid",
    //   sub_menu_id: 'get_current_sub_menuid',
    //   sub_menu_type: 'get_curr_sub_menu_type',
    //   is_show_analyse: 'get_is_show_details_analyse'
    // }),
    // 历史战绩：标准赛事详情页的时候不显示,只在虚拟体育详情显示历史战绩(其中篮球不显示历史战绩)
    anlyse_show(){


      return   GlobalAccessConfig.get_statisticsSwitch()&& route.name != 'virtual_sports' && get_detail_data.csid != 1004
    }
  },
  watch: {
    "batch"(){
      play_list()
    }
  },
  props:[
    "virtual_match_list",
    "batch" //赛马期
  ],
  created(){
    // 延时器
    timer1_ = null;
    timer_ = null;
    useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB, initEvent)
    useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB_BET, initEvent)

    initEvent();
    play_list()
    set_is_show_details_analyse(false)
  },
  methods:{
    // ...mapMutations([
    //   'set_details_item',
    //   'set_first_details_item',
    //   'set_fewer',
    //   'set_is_show_details_analyse'
    // ]),
    /**
     *@description: 虚拟体育分析按钮
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    analyse_btn() {
      analyse = !analyse
      set_is_show_details_analyse(!is_show_analyse)
    },
    change_btn(){
      // 设置vuex变量值
      if(get_fewer == 1 || get_fewer == 3){
        set_fewer(2)
      }else{
        set_fewer(1)
      }
    },
    // 单击玩法集
    selete_item(uId,e){
      // 点击的玩法是当前选中的玩法
      if(get_details_item == uId) return false;
      if(is_show_analyse){
        analyse = true
      }
      set_is_show_details_analyse(false)
      //实现动态效果
      try {
        let dom = $refs.reset_scroll_dom;
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

      set_details_item(uId);
      // 点击玩法对页面吸顶tab做高度处理
      useMittEmit(MITT_TYPES.EMIT_DETAILILS_TAB_CHANGED)
      // 虚拟体育切换玩法集,滚动条高度默认恢复为0
      $emit('virtual_play_height')
      if(get_fewer == 3){
        set_fewer(1)
      }
    },
    initEvent(){
      if(timer1_) { clearTimeout(timer1_) }
      timer1_ = setTimeout(() => {
        try{
          $refs.reset_scroll_dom.scrollLeft = 0
        }catch(e){
          console.error(e)
        }
      }, 400);
    },
    /**
     *@description: 调用玩法集的接口
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    play_list(){
      // 1.在足球页进入详情需要调用玩法集合接口
      // 2.在赛马页需要调用玩法集合接口
      if(![1001,1004].includes(sub_menu_type) || $route.name == 'virtual_sports_details'){
        let new_mid = ''
        if(batch){
          new_mid =  batch
        }else{
          new_mid = $route.query.mid
        }
        let params = { sportId: sub_menu_type,mid: new_mid};
        api_common.get_category_list(params).then(res =>{
          if(res.code == 200 && res.data){
            data_list = lodash.get(res, "data");
            let first_data_item = data_list[0];
            if(first_data_item){
              // 将玩法集第一个存入store，后续赛种/赛事期数跳转时做判断用
              set_first_details_item(first_data_item.id);
              set_details_item(first_data_item.id);
            }
          }
        })
      }
    }
  },
  beforeUnmount() {
    useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB, initEvent).off;
    useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB_BET, initEvent).off
    set_fewer(1);
    clearTimeout(timer1_)
    clearInterval(timer_);
  }
}
</script>

<style lang="scss" scoped>
.vir-details-tab {
  height: 0.4rem;
  margin-bottom: 0.04rem;
}

.menu-s {
  max-width: 2.85rem;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.menu-item {
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  line-height: 0.4rem;
  padding: 0 0.12rem;
  display: inline-block;
}

/*************** 选中的玩法集 *************** -S*/
.t_color {
  position: relative;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  font-weight: bold;

  &:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 0.18rem;
    height: 0.03rem;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    border-radius: 0.08rem;
  }
}


/*************** 选中的玩法集 *************** -E*/
.fat-btn {
  width: 0.4rem;
  line-height: 0.42rem;
  text-align: center;
}

.tab-btn {
  width: 0.12rem;
  height: 0.12rem;
  display: inline-block;
  background-image: url($SCSSPROJECTPATH + "/image/svg/tab_up_btn.svg");
  background-size: 100% 100%;
  transform: rotateZ(180deg);
  // @include webkit(transition, transform 0.3s);

  // &.collapsed {
  //   transform: rotateZ(0);
  //   @include webkit(transition, transform 0.3s);
  // }
}

.menu-third {
  padding-right: 0.1rem;
  height: 0.4rem;
  line-height: 0.4rem;
  position: relative;
  float: left;
  text-align: center;

  &:after {
    content: ' ';
    display: block;
    width: 1px;
    height: 0.21rem;
    position: absolute;
    top: 0.1rem;
  }
}

.tab-fixed {
  position: fixed;
  top: 2.04rem;
  z-index: 90;
}

.icon-style {
  position: absolute;
  right: 0;
  width: 0.39rem;
  height: 0.39rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: -0.05rem 0 0.1rem -0.01rem rgba(0, 0, 0, 0.08);
}

.analyse-icon {
  width: 0.2rem;
  height: 0.2rem;
  background-image: var(--q-color-com-img-bg-97);
  background-size: 100% 100%;
}

.analyse-close-icon {
  width: 0.2rem;
  height: 0.2rem;
  background-image: var(--q-color-com-img-bg-98);
  background-size: 100% 100%;
}
</style>
