<!--
 * @Author: Router
 * @Description:15号模板,单一盘口，投注项总数ol超过4个时，换行展示，每行展示3个，不够一行的用空白灰框填充。否则一行最多4个，最少1个。如准确进球数、准确局数玩法
-->
<template>
  <div class="temp15 mx-10">
    <div class="hairline-border">
      <!-- justify-between -->
      <div v-for="(item,index) in item_data.hl" :key="index" class="row" :class="item_data.hl && item_data.hl.length > 1 ? 'many-item-border':'sigle-item-border'">
        <!-- ms: 0开 1封 2关 11锁 -->
        <!-- hs: 0开 1封 2关 11锁 -->
        <!-- os: 1开 2封 3隐藏不显示不占地方-->
        <!-- 按ol循环，不考虑按tittle循环-->
        <template v-for="(ol_item,index2) in item.ol">
          <!-- 开盘or锁盘 正常显示 -->
          
          <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
            <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
              <template v-if="ol_item.os == 1">
                <div @click="go_to_bet(ol_item)"
                     :class="[{'win':calc_win(ol_item.result),'active-play':get_bet_list.includes(ol_item.id_), 'border-top': index2 > 2},name_]"
                     :key="index2" class="play-box">
                  <div class="remark">{{olitem_name(ol_item)}}</div>
                  <div>
                    <odds-new :item_data="item_data" :ol_data="ol_item" ></odds-new>
                  </div>
                </div>
              </template>
              
              <template v-if="ol_item.os == 2">
                <!-- 锁状态 -->
                <div class="play-box" :class="[name_, get_detail_data.csid == 1? 'play-box-lock' : '', {'border-top': index2 > 2}]" :key="index2" >
                  <div class="remark" v-show="get_detail_data.csid != 1">{{olitem_name(ol_item)}}</div>
                  <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" class="icon-lock">
                </div>
              </template>
              <template v-if="ol_item.os == 3"></template>
            </template>
            <template v-if="ol_item._hs == 1">
              <template v-if="ol_item.os == 3"></template>
              <template v-else>
                <div class="play-box" :class="[name_, get_detail_data.csid == 1? 'play-box-lock' : '', {'border-top': index2 > 2} ]" :key="index2">
                  <div class="remark" v-show="get_detail_data.csid != 1">{{olitem_name(ol_item)}}</div>
                  <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" class="icon-lock">
                </div>
              </template>
            </template>
            <template v-if="ol_item._hs == 2"></template>
          </template>
          <template v-if="ol_item._mhs == 1">
            <div class="play-box" :class="[name_ , get_detail_data.csid == 1? 'play-box-lock' : '', {'border-top': index2 > 2} ]" :key="index2">
              <div class="remark" v-show="get_detail_data.csid != 1">{{olitem_name(ol_item)}}</div>
              <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" class="icon-lock">
            </div>
          </template>
          <template v-if="ol_item._mhs == 2"></template>
        </template>
        <!-- 数量不够时用来占位 -->
        <i class="play-box" :class="{'border-top': item.ol.length > 3}" v-for="(n) in calc_num(item.ol)" :key="'i' + n"></i>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters} from "vuex";
import { colors } from 'quasar';
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import odds_new from "src/base-h5/components/details/components/tournament-play/unit/odds-new.vue";
import store from "src/store-redux/index.js";
import {LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js';
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"

export default defineComponent({
  name: "temp15",
  props: ["item_data"],
  components: {
    oddsNew: odds_new,
  },
  // #TODO mixins
  // mixins:[odd_convert],
  setup(props, evnet) {
    const store_state = store.getState()
    const init_data = reactive({
      
      name_: '',  //计算类名
      len: 0,  //有效的ol的个数
    });
    // #TODO vuex
    // computed: {
    // ...mapGetters(["get_bet_list","get_detail_data"]),
    const get_bet_list = computed(() => {
      return []
    });
    const get_detail_data = computed(() => {
      return store_state.detailsReducer.details_data || {}
    });
    const olitem_name = computed(() => {
      return function (val) {
        if (val.ott && val.on) {
          return val.ott + ' ' + val.on
        } else {
          return val.ott || val.on
        }
      }
    })
    onUnmounted(() => {
      // for (const key in $data) {
      //   $data[key] = null
      // }
    });
    
    const go_to_bet = (ol_item) => {
      useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true);
    };
    /**
     *@description 计算要填充的数量
     *@return {Undefined} undefined
     */
    const calc_num = (val) => {
      let flag = val.every(item => {
        return item._mhs == 2 || item._hs == 2 || item.os == 3
      })
      if (flag) return 0
      if (init_data.len % 3 && init_data.len >= 5) {
        return 3 - init_data.len % 3
      } else {
        return 0
      }
    };
    /**
     *@description 计算类名
     *@param {Array} val ol数组
     *@return {Undefined} undefined
     */
    const calc_classname = (val) => {
      let name;
      init_data.len = val.filter(item => {
        return item.os != 3
      }).length;
      switch (init_data.len) {
        case 0: name = ''; break;
        case 1: name = 'every1'; break;
        case 2: name = 'every2'; break;
        case 3: name = 'every3'; break;
        case 4: name = 'every4'; break;
        default: name = 'every5'; break;
      }
      init_data.name_ = name
    };
    watch(
      () => props.item_data,
      (data) => {
        if (data.hl && data.hl[0] && data.hl[0].ol) {
          calc_classname(data.hl[0].ol)
        }
      }, {immediate: true}
    );
    return {
      ...toRefs(init_data),
      get_bet_list,
      get_detail_data,
      olitem_name,
      go_to_bet,
      calc_num,
      calc_classname,
      LOCAL_PROJECT_FILE_PREFIX
    }
  }
})
</script>

<style lang="scss" scoped>
.temp15 {
  border-radius: 4px;

  .every1 {
    flex: 1;
  }

  .every2 {
    flex-basis: 50%;
  }

  .every3 {
    flex-basis: 33.333%;

    &:nth-child(2) {
      div {
        border-radius: 0;
      }
    }
  }

  .every4 {
    flex-basis: 25%;
    color: var(--q-gb-t-c-11);
    // &:nth-child(n+5){
    //   border-bottom: 1px solid var(--q-gb-bd-c-7);
    // }

    &:nth-child(2), &:nth-child(3) {
      div {
        border-radius: 0;
      }
    }
  }

  .every5 {
    flex-basis: 33.333%;
    color: var(--q-gb-t-c-11);
    &:nth-child(3n-1) {
      div {
        border-radius: 0;
      }
    }
  }

  .every5 ~ i {
    flex-basis: 33.333%;
  }

  .play-box {
    // margin-bottom: 0.01rem;
    padding: 0.06rem 0.05rem 0;
    // border-bottom:1px solid  var(--q-gb-bd-c-7);

    height: 0.52rem;

    text-align: center;
  }

  .play-box-lock {
    padding: 0;
    line-height: 0.52rem;

    img {
      width: 0.12rem;
      height: 0.14rem;
      margin-top: 2px;
    }
  }

  .remark {

    height: 0.16rem;
    white-space: pre;
  }

  .icon-lock {
    width: 0.12rem;
    height: 0.14rem;
  }

}
</style>