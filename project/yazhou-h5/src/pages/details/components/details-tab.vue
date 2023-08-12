<template>
  <div ref='details_tab' :class="['details-tab',{'tab-fixed':get_tab_fix}]" v-cloak>

    <div class="fat-btn" @click="change_btn()">
      <div class="tab-btn" :class="{collapsed:get_fewer != 2}"></div>
    </div>
    <span class="menu-third"></span>

    <div class="menu-s" ref="reset_scroll_dom">
      <div class="menu-item" v-for="(item,index) in data_list" :key="index" @click.self="selete_item(item['id'],index,item)" :class="get_details_item == item['id']?'t_color':''">
        {{item.marketName}}
      </div>
    </div>

  </div>
</template>
<script>
// #TODO vuex 
// import { mapGetters, mapActions,mapMutations } from "vuex"
import utils from "src/core/utils/utils";
import { useMittOn, useMittEmit, MITT_KEY } from  "src/core/mitt"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "details_tab",
  props: {
    data_list: {
      type: Array,
      default: []
    },
    scroller_scroll_top: {
      type: Number,
      default: 0
    }
  },
  setup(props, evnet) {
    const data = reactive({
      emitters: [],
    });
    // #TODO VUEX 
    // computed:{
    // ...mapGetters([
    //   // 玩法tab 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
    //   'get_details_item',
    //   // 当用户未登录时返回uuid, 当用户登录时返回userId
    //   'get_uid',
    //   // 点击视频或者是动画的时候玩法集是否固定
    //   'get_tab_fix',
    //   // 一键收起状态: 1.全展开 2.全收起 3.部分展开 1和3箭头向上
    //   "get_fewer",
    //   "get_detail_data",
    //   "get_user",
    // ]),
    const match_id = computed(() => {
      return $route.params.mid || get_detail_data.mid
    });
    // #TODO VUEX 
    // methods:{
    // ...mapActions(['set_details_item','set_subscript_game_index']),
    // ...mapMutations(['set_fewer']),
    onMounted(() => {
      on_listeners();

      // 延时器
      timer1_ = null;
      initEvent();
    })
    onUnmounted(() => {
      off_listeners();
      set_fewer(1);
      clearTimeout(timer1_)
      set_subscript_game_index(0)
    });
    const change_btn = () => {
      // 设置vuex变量值,没有玩法数据时不能点击
      // if (data_list && data_list.length == 1 && get_details_item == '0') return;
      if(get_fewer == 1 || get_fewer == 3){
        set_fewer(2)
      }else{
        set_fewer(1)
      }
    };
    // 单击玩法集
    const selete_item = (uId, index,item) => {
      console.log(item,"itemitemitem");
      // 点击的玩法是当前选中的玩法
      if(get_details_item == uId) return false;
      // 移动当前玩法的位置
      utils.tab_move2(index, $refs.reset_scroll_dom)
      set_details_item(uId);
      set_subscript_game_index(index)
      let search_term = $route.query.search_term
      // 重新加载category组件，触发重新请求
      $router.replace({name: 'category', params: {mid: match_id, mcid: uId}, query: {search_term: search_term}})
      // 点击玩法对页面吸顶tab做高度处理
      // #TODO emit 
      useMittEmit(MITT_KEY.EMIT_DETAILILS_TAB_CHANGED);
      // $root.$emit(emit_cmd.EMIT_DETAILILS_TAB_CHANGED)
      if(get_fewer == 3){
        set_fewer(1)
      }
      // 发送埋点
      let zhuge_obj = {
        "玩法集名称": item.marketName,
        "玩法集ID": item.id,
        "球种名称": $utils.csid_to_sport_name(get_detail_data.csid)
      }
      $utils.zhuge_event_send('TY_H5_详情页/大屏_玩法分类导航_点击', get_user,zhuge_obj);
    };
    /**
     * @Description 获取当前选中详情玩法集
     * @param {undefined} undefined
    */
    const get_active_details_play_tab = (callback) => {
      let item = data_list.filter(item => get_details_item == item.id)[0]
      callback(item)
    };
    const initEvent = () => {
      try{
        if(timer1_) { clearTimeout(timer1_) }
        // 加上400毫秒解决scrollLeft未定义的问题
        timer1_ = setTimeout(() => {
          $refs.reset_scroll_dom.scrollLeft = 0
        }, 400);
      }catch(e){
        console.error(e);
      }
    };
    // 添加相应监听事件
    const on_listeners = () => {
      // #TODO emit 
      emitters = [
        useMittOn.on(MITT_KEY.EMIT_REFRESH_DETAILS_TAB, initEvent).off,
        useMittOn.on(MITT_KEY.EMIT_REFRESH_DETAILS_TAB_BET, initEvent).off,
        useMittOn.on(MITT_KEY.EMIT_GET_ACTIVE_DETAILS_PLAY_TAB, get_active_details_play_tab).off,
      ]
      // $root.$on(emit_cmd.EMIT_REFRESH_DETAILS_TAB, initEvent)
      // $root.$on(emit_cmd.EMIT_REFRESH_DETAILS_TAB_BET, initEvent)
      // $root.$on(emit_cmd.EMIT_GET_ACTIVE_DETAILS_PLAY_TAB,get_active_details_play_tab)
    };
    // 移除相应监听事件
    const off_listeners = () => {
      // #TODO emit 
      emitters.map((x) => x())
      // $root.$off(emit_cmd.EMIT_REFRESH_DETAILS_TAB, initEvent);
      // $root.$off(emit_cmd.EMIT_REFRESH_DETAILS_TAB_BET, initEvent)
      // $root.$off(emit_cmd.EMIT_GET_ACTIVE_DETAILS_PLAY_TAB,get_active_details_play_tab)
    };
    return {
      ...toRefs(data),
      match_id,
      change_btn,
      selete_item,
      get_active_details_play_tab,
      initEvent,
      on_listeners,
      off_listeners,
    }
  }
})
</script>

<style lang="scss" scoped>
.details-tab {
  height: 0.4rem;
}

.menu-s {
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
  box-sizing: content-box;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  width: auto;
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
    bottom: 0.05rem;
    border-radius: 0.08rem;
  }
}


/*************** 选中的玩法集 *************** -E*/
.fat-btn {
  float: left;
  text-align: center;
  padding-top: 0.03rem;

  width: 0.4rem;
}

.tab-btn {
  display: inline-block;
  width: 0.12rem;
  height: 0.12rem;
  margin-top: 0.09rem;
  background-image: var(--q-color-img-bg-97);
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
  position: relative;
  float: left;

  &:after {
    content: ' ';
    display: block;
    width: 1px;
    height: 0.14rem;
    position: absolute;
    top: 0.14rem;
  }
}

.tab-fixed {
  position: fixed;
  top: 2.04rem;
  z-index: 90;
}
</style>
