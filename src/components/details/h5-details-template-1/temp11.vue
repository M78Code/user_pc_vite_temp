<!--
 * @Author: Supermark
 * @Date: 2020-12-29 10:35:26
 * @Description: 针对虚拟体育新增的玩法模板11
-->
<template>
  <div class="temp11 mx-10">
    <div class="hairline-border">
      <div class="row virtual-bet-wrapper">
        <!-- 分割线 -->
        <div v-for="(item,index) in odds_list"
             @click="go_to_bet(item)" :key="index"
             :style="{width:odds_list.length > 30 ?'25%':'20%'}"
             class="item-style2" :class="[![0,1,2,3,4].includes(index) ? 'border-bot':'',is_select(item.oid) ? 'blue-color':'']"
        >
          <div class="row justify-center">
            <div v-for="(item_data_count,index2) in item.two_num" :key="index2">
              <div class="virtual-count" :class="`virtual-num-${item_data_count} csid-${[1010].includes(sub_menu_type)?'1002':sub_menu_type} ${[1010].includes(sub_menu_type) ? `motorcycle-${item_data_count}` : ''}`">
              </div>
            </div>
          </div>
          <div class="odds-style">
            <div v-if="item.os != 2">{{compute_value_by_cur_odd_type(item.odds,null,hsw_single)}}</div>
            <div v-else><img src="image/wwwassets/bw3/common/match-icon-lock.svg" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex 
// import { mapGetters} from "vuex";
import { colors } from 'quasar';
// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "temp10",
  props:{
    item_data:Object
  },
  // #TODO mixins 
  // mixins:[odd_convert],
  setup(props, evnet) {
    const data = reactive({
      // 五列居中数据
      odds_list:[],
      // hsw切换赔率的值
      hsw_single: ''
    });
    // #TODO vuex 
    // ...mapGetters(['get_bet_list']),
    // ...mapGetters({
    //   sub_menu_type: 'get_curr_sub_menu_type',
    // }),
    /**
     *@description 是否选中
     *@param {String} id 投注项id
     *@return {Boolean}
     */
    const is_select = computed(() => {
      return function(id){
        return get_bet_list.includes(id)
      }
    })
    watch(
      // 深度监听数据的变化及时执行os修改函数
      () => item_data,
      () => {
        temp_odds()
      },
      {
        deep: true
      }
    );
    /**
     *@description 虚拟体育(赛马)点击详细页小方块投注
     *@param {Object} ol_item 里层ol数据
     *@return {Undefined} undefined
     */
    const go_to_bet = (ol_item) => {
      $emit("bet_click_", {ol_item});
    };
    const temp_odds = () => {
      hsw_single = _.get(item_data,'hsw').toString()
      let odd_ol_list = _.get(item_data,'hl[0].ol')
      let odds_list = []
      _.forEach(odd_ol_list,(ol_item,i) => {
        let odds_obj = {}
        let ol_on = ol_item.on.split('/');
        odds_obj['two_num'] = ol_on;
        odds_obj['odds'] = ol_item.ov / 100000;
        odds_obj['id'] = i+1;
        odds_obj['os'] = ol_item.os;
        Object.assign(odds_obj,ol_item);
        odds_list.push(odds_obj);
      });
      odds_list = odds_list
    };
    return {
      ...toRefs(data),
      is_select,
      go_to_bet,
      temp_odds
    }
  }
})
</script>

<style lang="scss" scoped>
/*  背景色 */
.temp11 {
  border-radius: 0.04rem;
}

/*************** 开始 *************** -S*/
.item-data {
  text-align: center;
  padding-bottom: 0.04rem;
}

/*************** 结束 *************** -E*/

/*************** 马数字开始 *************** -S*/
.virtual-count {
  margin: 0.05rem 0 0.03rem 0;
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  text-align: center;

  margin-right: 0.01rem;
  background: var(--q-color-com-img-bg-20) no-repeat 0 0 / 100%;
  --per: -0.3rem;
}

/*************** 马数字结束 *************** -E*/
/*************** 赔率开始 *************** -S*/
.odds-style {

  font-size: 0.16rem;
  letter-spacing: 0;
  text-align: center;
}

/*************** 赔率结束 *************** -E*/
.virtual-bet-wrapper {
  border-radius: 0.08rem;
  overflow: hidden;
}


.item-style2 {
  height: 0.52rem;

  &:nth-child(5n) {
    border-right: none;
  }
}

.blue-color {
  background: var(--q-gb-bd-c-13);

  .odds-style {
    color: var(--q-color-com-fs-color-8) !important;
  }

  .virtual-count {
    border-radius: 2px;
  }
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
</style>
