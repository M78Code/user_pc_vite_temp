<!--
 * @Author: Supermark
 * @Date: 2020-12-29 10:35:16
 * @Description: 针对虚拟体育新增的玩法模板9
-->
<template>
  <div class="temp9 mx-10">
    <div class="hairline-border">
      <div class="row virtual-bet-wrapper">
        <div class="row justify-between champion-item col-6"
             v-for="(item,index) in champion_list" :key="index"
             @click="go_to_bet(index)"  :class="is_select(item.oid) && 'champion-item2'"
        >
          <div  class="row">
            <div class="temp9-sort" :class="`virtual-num-${index+1} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type} ${[1010].includes(sub_menu_type) ? `motorcycle-${index+1}` : ''}`"></div>
            <div class="temp9-name">{{item.on}}</div>
          </div>
          <div class="temp9-ov">
            <div v-if="item.os != 2">{{get_odds(item)}}</div>
            <div v-else><img src="image/wwwassets/bw3/common/match-icon-lock.svg" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex 
// import { mapGetters } from "vuex";
// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "temp9",
  props:{
    item_data:Object
  },
  setup(props, evnet) {
    const data = reactive({
      // 冠军投注项集合
      champion_list:[],
      // 赔率切换数据
      hsw_obj: null
    })
    // #TODO vuex 
    // ...mapGetters(['get_bet_list']),
    // ...mapGetters({
    //   sub_menu_type: 'get_curr_sub_menu_type',
    // }),

    watch(
      () => item_data,
      (new_) => {
        this.init()
      },
      {deep: true}
    );
    onMounted(() => {
      max_count_ol = get_ol_list();
    })
    /**
     *@description 是否选中
     *@param {String} id 投注项id
     *@return {Boolean}
     */
    const is_select = computed(() => {
      return function(oid){
        return this.get_bet_list.includes(oid)
      }
    })
    const get_odds = (item) =>{
      let val = item.ov / 100000, hsw = this.item_data.hsw;
      let ov = this.compute_value_by_cur_odd_type(val, null, hsw);
      return ov ? ov : '';
    };
    const init = () =>{
      this.champion_list =  this.item_data.hl[0].ol
      this.hsw_obj = this.item_data.hsw
    };
    /**
     *@description 虚拟体育(赛马)点击详细页小方块投注
     *@param {Number} index 下标，用来识别第几匹马
     *@return {Undefined} undefined
     */
    const go_to_bet = (index) =>{
      let ol_item = this.champion_list[index]
      ol_item.num = index + 1
      this.$emit("bet_click_", {ol_item, hl_data:this.item_data});
    };
    onMounted(() => {
      this.init()
    })
    return {
      ...toRefs(data),
      
      is_select,
      get_odds,
      init,
      go_to_bet
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

.champion-item {
  box-sizing: border-box;
  height: 0.52rem;
  padding: 0 0.15rem;
  align-items: center;

  &:nth-child(2), &:nth-child(1) {
    border-top: 0px solid red;
  }

  &:nth-child(2n) {

  }

  .temp9-name {

    font-size: 0.14rem;

    line-height: 0.18rem;
    padding-left: 0.1rem;
    flex: 1;
    max-width: 0.75rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .temp9-ov {

    font-size: 0.16rem;

    letter-spacing: 0;
  }
}

.temp9-sort {
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  text-align: center;
  background: var(--q-color-com-img-bg-20) no-repeat 0 0 / 100%;
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
  .temp9-name, .temp9-ov {

  }
}
</style>
