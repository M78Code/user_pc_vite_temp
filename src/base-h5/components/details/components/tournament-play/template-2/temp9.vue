<!--
 * @Author: Supermark
 * @Date: 2020-12-29 10:35:16
 * @Description: 针对虚拟体育新增的玩法模板9
-->
<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp9 mx-5">
    <div class="hairline-border">
      <div class="row virtual-bet-wrapper">
        <div class="row justify-between champion-item col-6"
             v-for="(item,index) in champion_list" :key="index"
             @click="go_to_fun(index)"  :class="BetData.bet_oid_list.includes(item.oid)&& 'champion-item2'"
        >
          <div  class="row">
            <div class="temp9-sort" :class="`virtual-num-${index+1} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type} ${[1010].includes(sub_menu_type) ? `motorcycle-${index+1}` : ''}`"></div>
            <!-- 赛马赔率接口没有返回on，需从ot取名字 -->
            <div class="temp9-name">{{ item.on || (teams && teams[item.ot-1]) }}</div>
          </div>
          <div class="temp9-ov">
            <div v-if="item.os != 2">{{get_odds(item)}}</div>
            <div v-else><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters } from "vuex";
import store from "src/store-redux/index.js";
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
import { compute_value_by_cur_odd_type } from "src/output/index.js"
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5} from "src/output/index.js"
export default defineComponent({
  name: "temp9",
  props: ["item_data", "title", "csid", "teams"],
  setup(props, evnet) {
    let data = reactive({
      // 冠军投注项集合
      champion_list:[],
      // 赔率切换数据
      hsw_obj: null
    })
    // #TODO vuex
    // ...mapGetters({
    //   sub_menu_type: 'get_curr_sub_menu_type',
    // }),
    const sub_menu_type = computed(() => {
      return props.csid;
    });
    watch(
      () => props.item_data,
      (new_) => {
        init()
      },
      {deep: true}
    );
    onMounted(() => {
      // max_count_ol = get_ol_list();
    })
    const get_odds = (item) =>{
      let ov = '' ;
      if(props.item_data){
        ov =compute_value_by_cur_odd_type(
          item.ov,
          props.item_data._hpid,
          props.item_data.hsw,
          props.item_data.csid || props.csid
        )
      }
      return ov ? ov : '';
    };
    const init = () =>{
      data.champion_list = lodash.get(props.item_data,'hl[0].ol',[])
      data.hsw_obj = props.item_data.hsw
    };
    /**
     *@description 虚拟体育(赛马)点击详细页小方块投注
     *@param {Number} index 下标，用来识别第几匹马
     *@return {Undefined} undefined
     */
    const go_to_fun = (index) =>{
      let ol_item = data.champion_list[index]
      ol_item.num = index + 1
      go_to_bet(ol_item, 'h5_list')
    };
    onMounted(() => {
      init()
    })
    return {
      ...toRefs(data),
      
      BetData,
      // get_bet_list,
      sub_menu_type,
      get_odds,
      init,
      go_to_fun,
      LOCAL_PROJECT_FILE_PREFIX
    }
  }
})
</script>

<style lang="scss" scoped>
.temp9 {
  .virtual-bet-wrapper {
    border-radius: 0.08rem;
    overflow: hidden;
  }
}
.virtual-bet-wrapper {
  justify-content: space-between;
}
.champion-item {
  box-sizing: border-box;
  height: 0.4rem;
  padding: 0 0.15rem;
  align-items: center;
  width: 49%;
  background: var(--q-gb-bg-c-28);
  margin-top: 0.08rem;
  border-radius: 0.04rem;
  color: var(--q-gb-t-c-18);

  &:nth-child(2), &:nth-child(1) {
    border-top: 0px solid red;
  }

  &:nth-child(2n) {

  }

  .temp9-name {

    font-size: 0.12rem;

    line-height: 0.18rem;
    padding-left: 0.1rem;
    flex: 1;
    max-width: 0.75rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .temp9-ov {
    color: var(--q-gb-t-c-18);
    font-size: 0.14rem;
    font-weight: 700;;
    letter-spacing: 0;
  }
}

.temp9-sort {
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  text-align: center;
  background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png") no-repeat 0 0 / 100%;
  --per: -0.3rem;
}

div[class*="virtual-num"] {
  border-radius: 2px;
}

.virtual-num-1 {
  background-position-y: calc(var(--per) * 6);

  &.csid-1009 {
    background-position-y: calc(var(--per) * 14);
  }
}

.virtual-num-2 {
  background-position-y: calc(var(--per) * 7);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 1);
  }

  &.csid-1009 {
    background-position-y: calc(var(--per) * 15);
  }
}

.virtual-num-3 {
  background-position-y: calc(var(--per) * 8);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 2);
  }

  &.csid-1009 {
    background-position-y: calc(var(--per) * 16);
  }
}

.virtual-num-4 {
  background-position-y: calc(var(--per) * 9);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 3);
  }

  &.csid-1009 {
    background-position-y: calc(var(--per) * 17);
  }
}

.virtual-num-5 {
  background-position-y: calc(var(--per) * 10);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 4);
  }
}

.virtual-num-6 {
  background-position-y: calc(var(--per) * 11);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 5);
  }
}

.champion-item2 {
  background: var(--q-gb-bg-c-37);
  .temp9-name, .temp9-ov {
    
  }
}
</style>