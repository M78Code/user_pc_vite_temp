<!--
 * @Author: Supermark
 * @Date: 2020-12-29 10:35:26
 * @Description: 针对虚拟体育新增的玩法模板10
-->
<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp10 mx-5">
    <div class="hairline-border">
      <div class="row virtual-bet-wrapper">
        <div v-for="(item,index) in odds_list" :key="index"
             class="col-4 item-height"
             :class="[index >= 3 ? 'border-bot':'',BetData.bet_oid_list.includes(item.oid) ? 'active':'']"
             @click="go_to_bet(item)"
        >
          <div class="row justify-center">
            <div v-for="(item_data_count,index2) in item.two_num" :key="index2">
              <div class="virtual-count" :class="`virtual-num-${item_data_count} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type} ${[1010].includes(sub_menu_type) ? `motorcycle-${item_data_count}` : ''}`">
                <!-- {{item_data_count}} -->
              </div>
            </div>
          </div>
          <div class="odds-style">
            <div v-if="item.os != 2">{{compute_value_by_cur_odd_type(item.ov,item._hpid,item._hsw,item._csid)}}</div>
            <div v-else><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters} from "vuex";
import lodash from "lodash";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import store from "src/store-redux/index.js";
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"
import { project_name,MatchDetailCalss } from "src/output/index.js"
import { go_to_bet } from "src/core/bet/class/bet-box-submit.js";
import { compute_value_by_cur_odd_type } from "src/output/index.js"
export default defineComponent({
  name: "temp10",
  props: ["item_data", "title"],
  // #TODO mixins
  // mixins:[odd_convert],
  setup(props, evnet) {
    const store_state = store.getState()
    // #TODO vuex
    // ...mapGetters(['get_bet_list']),
    // ...mapGetters({
    //   sub_menu_type: 'get_curr_sub_menu_type',
    // }),
    const sub_menu_type = computed(() => {
      return props.csid;
    });
    const get_bet_list = computed(() => {
      return []
    });
    const get_curr_sub_menu_type = computed(() => {
      return ""
    });
    let data = reactive({
      odds_list: [],
      // hsw切换赔率的值
      hsw_single: ''
    })
    watch(
      // 深度监听数据的变化及时执行os修改函数
      () => props.item_data,
      () => {
        temp_odds()
      },
      {
        deep: true
      }
    );
    const temp_odds = () => {
      data.hsw_single = lodash.get(props.item_data,'hsw').toString()
      let odd_ol_list = lodash.get(props.item_data,'hl[0].ol')

      let odds_list = []
      lodash.forEach(odd_ol_list,(ol_item,i) => {
        let odds_obj = {}
        let ol_on = ol_item.on.split('/');
        odds_obj['two_num'] = ol_on;
        odds_obj['odds'] = ol_item.ov / 100000;
        odds_obj['id'] = i+1;
        odds_obj['os'] = ol_item.os;
        Object.assign(odds_obj,ol_item);
        odds_list.push(odds_obj);
      });
      data.odds_list = odds_list
    };
    onMounted(() => {
      temp_odds()
    })
    return {
      ...toRefs(data),
      go_to_bet,
      compute_value_by_cur_odd_type,
      lodash,
      BetData,
      get_bet_list,
      get_curr_sub_menu_type,
      temp_odds,
      LOCAL_PROJECT_FILE_PREFIX,
      sub_menu_type
    }
  }
})
</script>

<style lang="scss" scoped>
/*  背景色 */
.temp10 {

  border-radius: 0.04rem;
}

/*************** 开始 *************** -S*/
.item-data {
  text-align: center;
  padding-bottom: 0.04rem;
}

/*************** 结束 *************** -E*/
/*************** 白色下分割线开始 *************** -S*/
.border-bot {

}


/*************** 白色下分割线结束 *************** -E*/

/*************** 马数字开始 *************** -S*/
.virtual-count {
  margin: 0.05rem 0 0.03rem 0;
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  text-align: center;

  margin-right: 0.01rem;
  background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png")  no-repeat 0 0 / 100%;
  --per: -0.3rem;
}

/*************** 马数字结束 *************** -E*/
/*************** 赔率开始 *************** -S*/
.odds-style {
  color: var(--q-gb-t-c-18);
  font-size: 0.12rem;
  margin-top: 0.1rem;
  letter-spacing: 0;
  text-align: center;
}

/*************** 赔率结束 *************** -E*/
.virtual-bet-wrapper {
  border-radius: 0.08rem;
  padding: .12rem !important;
  box-sizing: border-box;
  overflow: hidden;
  display: grid;
   grid-column-gap: .08rem;
    grid-row-gap: .06rem;
  grid-template-columns: repeat(3, 1fr);
}

.item-height {
  height: 0.67rem;
  background: var(--q-gb-bg-c-28);
  width: 100%;
  padding-top: 0.07rem;
}

.blue-color {
  .odds-style {

  }

  .virtual-count {


    border-radius: 2px;
  }

  .virtual-num2, .virtual-num4 {

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
</style>src/output