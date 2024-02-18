<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
<!-- 矩形框中部 -->
  <div class="item-body">
    <template v-if="!is_pre">
      <template v-for="(item, key) in data_b.orderVOS">
        <div v-if="item.isBoolean" :key="key">
          <!-- 非冠军玩法的单关 -->
          <body-top :top_="item" :preOrder="data_b.preOrder"  v-if="item.matchType != 3 && data_b.seriesType == '1'" class="mx-12 body_top half-border-bottom"></body-top>
          <!-- 中间主体区域 -->
          <body-main :main="item" :marketType="data_b.marketType" :type_="data_b" :box_bool="box_bool" :index_="key" :len="data_b.orderVOS.length"></body-main>
        </div>
      </template>

      <!-- 串关时大于2条时,显示 展开收起按钮-->
      <div class="toggle row justify-center" v-if="data_b.orderVOS.length > 2">
        <span class="btn_style" @click="toggle_box">
          <span class="text_c">{{btn_text}}</span>
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon.svg`" alt="" :class="direction">
        </span>
      </div>
    </template>
    <template v-else>
        <div :key="key" v-for="(item, key) in data_b.orderVOS">
          <!-- 非冠军玩法的单关 -->
          <body-top :pre_order_status="data_b.preOrderStatus"  :preOrder="data_b.preOrder" :orderNumber="data_b.orderNo" :top_="item" v-if="item.matchType != 3 && data_b.seriesType == '1'" class="mx-12 body_top half-border-bottom"></body-top>
          <!-- 中间主体区域 -->
          <body-main :main="item" :marketType="data_b.marketType" :is_pre="is_pre" :type_="data_b" :box_bool="box_bool" :index_="key" :len="data_b.orderVOS.length"></body-main>
        </div>
    </template>
  </div>
</template>

<script setup>
// 矩形框上部
import bodyTop from "src/base-h5/components/common/cathectic-item/item-body/body-top.vue";
// 矩形框主体
import bodyMain from "src/base-h5/components/common/cathectic-item/item-body/body-main.vue";
import lodash from 'lodash'
import { ref, onMounted, onUnmounted} from 'vue'
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"

  //按钮名字
  let btn_text = ref('')
  //按钮图标的方向
  let direction = ref('')
  //是否展开
  let box_bool = ref('')
  let props = defineProps({
    data_b: {
      type: Object
    },
    is_pre: {
      type: Boolean
    }
  })
  onMounted(() => {
    rules_normal();
    rules_a();
    rules_b();
    rules_c()

  })

  onUnmounted(() => {
    // for (const key in $data) {
    //   $data[key] = null
    // }
  })

    //切换是否展开
  const toggle_box = () => {
      box_bool = !box_bool;
      if (box_bool == true) {
        [btn_text, direction] = [
          i18n_t("bet_record.pack_down"),
          "down"
        ];
        toggle_rule_b();
      } else {
        [btn_text, direction] = [
          i18n_t("bet_record.pack_up"),
          ""
        ];
        toggle_rule_a();
      }
    }
  const rules_normal = () => {
      [btn_text, direction, box_bool] = [
        // i18n_t("bet_record.pack_up"),
        "",
        false
      ];
    }
    // 串关并且长度大于等于3,默认收起,展示一条;
  const rules_a = () => {
      if ((props.is_pre && props.data_b.detailList) || props.data_b.orderVOS.length >= 3)
        [btn_text, direction, box_bool] = [
          i18n_t("bet_record.pack_down"),
          "down",
          true
        ];
    }

  const rules_b = () => {
      if (props.data_b.orderVOS.length <= 2) toggle_rule_a();
    }
  const rules_c = () => {
      if (props.data_b.orderVOS.length >= 3) toggle_rule_b();
    }
    //小于2个时都展开
  const toggle_rule_a = () => {
      lodash.map(props.data_b.orderVOS, (item, index) => {
        item.isBoolean = true;
        return item;
      });
    }
    //大于等于3个时，第一个和第二个展开
  const toggle_rule_b = () => {
      lodash.map(props.data_b.orderVOS, (item, index) => {
        item.isBoolean = false;
        if (index == 0 || index == 1) {
          item.isBoolean = true;
        }
        return item;
      });
    }
</script>

<style lang="scss" scoped>
.item-body {
  .toggle {
    margin: 0.06rem 0.1rem 0.12rem;
    padding-top: 0.1rem;
  }
  .btn_style {
    display: inline-block;
    height: 0.18rem;
    line-height: 0.18rem;
    font-size: 0.1rem;
    border-radius: 0.04rem;
    padding: 0 0.08rem;
    color:var(--q-analysis-text-color-20);

    img {
      width: 0.08rem;
      margin-left: 2px;
      vertical-align: 1px;
    }
    .down {
      transform: scale(-1);
    }
  }
}
</style>