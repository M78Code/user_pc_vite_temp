<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 虚拟体育中部期数+轮次tab(列表+详情共用)
-->
<template>
  <div ref='details_tab' class="row vir-details-tab" v-cloak>
    <!-- 收起的箭头 -->
    <!-- <div class="fat-btn" @click="change_btn()">
      <div class="tab-btn" :class="{collapsed:get_fewer != 2}"></div>
    </div> -->
    <!-- 灰色间隔线 -->
    <!-- <div class="menu-third"></div> -->
    <!-- 玩法集 -->
    <div class="menu-s" ref="reset_scroll_dom">
      <div class="menu-item" v-for="(item, i) in data_list" :key="i" @click.self="selete_item(item['id'],$event)" :class="get_details_item == item['id']?'t_color':''">
        {{item.marketName}}
      </div>
    </div>
    <!-- 分析icon(详情页面的时候显示分析,在其他页面不显示分析按钮) -->
    <!-- <div v-if="anlyse_show" class="icon-style" @click="analyse_btn">
      <div :class="[analyse ? 'analyse-icon':'analyse-close-icon']"></div>
    </div> -->
  </div>
</template>

<script>
import { api_common } from "src/api/index.js";
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
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
    //   'get_access_config',
    // ]),
    // ...mapGetters({
    //   matchid: "get_goto_detail_matchid",
    //   sub_menu_id: 'get_current_sub_menuid',
    //   sub_menu_type: 'get_curr_sub_menu_type',
    //   is_show_analyse: 'get_is_show_details_analyse'
    // }),
    get_details_item(){return VR_CTR.state.details_item  },
    get_uid(){return },
    get_tab_fix(){return },
    get_fewer(){return },
    get_current_league(){return VR_CTR.state.current_league},
    get_detail_data(){return VR_CTR.state.detail_data},
    get_access_config(){return {}},
    matchid(){return VR_CTR.state.goto_detail_matchid},
    sub_menu_id(){return VR_CTR.state.current_sub_menuid},
    sub_menu_type(){return VR_CTR.state.curr_sub_menu_type},
    is_show_analyse(){return VR_CTR.state.is_show_details_analyse},

    // 历史战绩：标准赛事详情页的时候不显示,只在虚拟体育详情显示历史战绩(其中篮球不显示历史战绩)
    anlyse_show(){
      return lodash.get(this.get_access_config, 'statisticsSwitch') && this.$route.name != 'virtual_sports' && this.get_detail_data.csid != 1004
    }
  },
  watch: {
    "batch"(){
      this.play_list()
    }
  },
  props:[
    "virtual_match_list",
    "batch", //赛马期
    "mid"
  ],
  created(){
    // 延时器
    this.timer1_ = null;
    this.timer_ = null;
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB, this.initEvent).off,
      useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB_BET, this.initEvent).off,
    ]
    this.initEvent();
    this.play_list()
    this.set_is_show_details_analyse(false)
  },
  methods:{
    // ...mapMutations([
    //   'set_details_item',
    //   'set_first_details_item',
    //   'set_fewer',
    //   'set_is_show_details_analyse'
    // ]),
    set_details_item(data){ return VR_CTR.state.details_item = data },
    set_first_details_item(data){},
    set_fewer(data){},
    set_is_show_details_analyse(data){},

    /**
     *@description: 虚拟体育分析按钮
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    analyse_btn() {
      this.analyse = !this.analyse
      this.set_is_show_details_analyse(!this.is_show_analyse)
    },
    change_btn(){
      // 设置vuex变量值
      if(this.get_fewer == 1 || this.get_fewer == 3){
        this.set_fewer(2)
      }else{
        this.set_fewer(1)
      }
    },
    // 单击玩法集
    selete_item(uId,e){
      // 点击的玩法是当前选中的玩法
      if(this.get_details_item == uId) return false;
      if(this.is_show_analyse){
        this.analyse = true
      }
      this.set_is_show_details_analyse(false)
      //实现动态效果
      try {
        let dom = this.$refs.reset_scroll_dom;
        if(!dom) return;

        let start_ = dom.scrollLeft;
        let end_ = e.target.offsetLeft + e.target.clientWidth/2 - dom.offsetWidth/2;
        if(start_ > end_ && end_ > 0){
          let s = start_;
          this.timer_ = setInterval(() => {
            dom.scrollLeft = s;
            s -= 7;
            if(s <= end_){
              clearInterval(this.timer_);
            }
          }, 18);
        }else if(start_ <= end_ && end_ > 0){
          let s = start_;
          this.timer_ = setInterval(() => {
            dom.scrollLeft = s;
            s += 7;
            if(s >= end_){
              clearInterval(this.timer_);
            }
          }, 18);
        }else if(end_ < 0){
          this.timer_ = setInterval(() => {
            dom.scrollLeft -= 7
            if(dom.scrollLeft <= 0){
              clearInterval(this.timer_);
            }
          }, 18);
        }
      } catch (error) {
        console.error(error)
      }

      this.set_details_item(uId);
      // 点击玩法对页面吸顶tab做高度处理
      useMittEmit(MITT_TYPES.EMIT_DETAILILS_TAB_CHANGED);
      // 虚拟体育切换玩法集,滚动条高度默认恢复为0
      this.$emit('virtual_play_height')
      if(this.get_fewer == 3){
        this.set_fewer(1)
      }
    },
    initEvent(){
      if(this.timer1_) { clearTimeout(this.timer1_) }
      this.timer1_ = setTimeout(() => {
        try{
          this.$refs && (this.$refs.reset_scroll_dom.scrollLeft = 0)
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
      if(![1001,1004].includes(this.sub_menu_type) || this.$route.name == 'virtual_sports_details'){
        let new_mid = ''
        if(this.batch){
          new_mid =  this.batch
        }else{
          new_mid = this.$route.query.mid || this.mid;
        }
        let params = { sportId: this.sub_menu_type,mid: new_mid};
        api_common.get_category_list(params).then(res =>{
          if(res.code == 200 && res.data){
            this.data_list = lodash.get(res, "data");
            let first_data_item = this.data_list[0];
            if(first_data_item){
              // 将玩法集第一个存入store，后续赛种/赛事期数跳转时做判断用
              this.set_first_details_item(first_data_item.id);
              this.set_details_item(first_data_item.id);
            }
          }
        })
      }
    }
  },
  unmounted() {
    this.emitters.map((x) => x())
    this.set_fewer(1);
    clearTimeout(this.timer1_)
    clearInterval(this.timer_);
  }
}
</script>

<style lang="scss" scoped>
.vir-details-tab {
  height: 0.4rem;
  margin-bottom: 0.04rem;
}

.menu-s {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: auto;
  white-space: nowrap;
  padding-left: 0.05rem;
  color: var(--q-gb-t-c-19);
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
  color: var(--q-gb-t-c-19);
}

/*************** 选中的玩法集 *************** -S*/
.t_color {
  position: relative;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  color: var(--q-gb-t-c-2);
  background: var(--q-gb-bg-c-1);
  width: 0.74rem;
  height: 0.3rem;
  line-height: 0.3rem;
  border-radius: 0.22rem;
  padding: 0;
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

/* 属性前缀 */
@mixin webkit($property, $value) {
  -webkit-#{$property}: $value;
  -moz-#{$property}: $value;
  -o-#{$property}: $value;
  #{$property}: $value;
}
.tab-btn {
  width: 0.12rem;
  height: 0.12rem;
  display: inline-block;
  background-image: var(--q-color-img-bg-97);
  background-size: 100% 100%;
  transform: rotateZ(180deg);
  @include webkit(transition, transform 0.3s);

  &.collapsed {
    transform: rotateZ(0);
    @include webkit(transition, transform 0.3s);
  }
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