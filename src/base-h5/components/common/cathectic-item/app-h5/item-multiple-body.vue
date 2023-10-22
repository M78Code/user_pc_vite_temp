<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
<!-- 矩形框中部 -->
  <div class="item-body">
    <div class="yb_mx10 item-header yb_fontsize14 yb_py4">
      {{data_b.seriesValue}}
    </div>
    <div class="item-main">
      <div class="items">
        <div>
          <h2>普马斯</h2>
          <h3>1.64</h3>
        </div>
        <p>零失球</p>
        <span>普马斯 vs 电风扇科技</span>
      </div>
      <div class="items">
        <div>
          <h2>中央海岸选手</h2>
          <h3>1.64</h3>
        </div>
        <p>滚球 独赢 第三局</p>
        <div>
          <p>滚球 独赢 第三局</p>
          <h3>赢</h3>
        </div>
        <span>普马斯 vs 电风扇科技 vs 辅导时间诶玩过可根据</span>
      </div>
      <div class="items">
        <div>
          <h2>普马斯</h2>
          <h3>1.64</h3>
        </div>
        <p>零失球</p>
        <span>普马斯 vs 电风扇科技</span>
      </div>
    </div>
     <!-- 串关时大于2条时,显示 展开收起按钮-->
     <div class="toggle row justify-center" v-if="data_b.orderVOS.length > 2">
        <span class="btn_style" @click="toggle_box">
          <span class="text_c">{{btn_text}}</span>
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon.svg`" alt="" :class="direction">
        </span>
      </div>
  </div>
</template>

<script setup>
// 矩形框上部
import bodyTop from "src/base-h5/components/common/cathectic-item/item-body/body-top.vue";
// 矩形框主体
import bodyMain from "src/base-h5/components/common/cathectic-item/item-body/body-main.vue";
import lodash from 'lodash'
import { ref, onMounted, onUnmounted} from 'vue'
import { t } from "src/boot/i18n.js";;
import { project_name } from 'src/core'

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
          t("bet_record.pack_down"),
          "down"
        ];
        toggle_rule_b();
      } else {
        [btn_text, direction] = [
          t("bet_record.pack_up"),
          ""
        ];
        toggle_rule_a();
      }
    }
  const rules_normal = () => {
      [btn_text, direction, box_bool] = [
        // t("bet_record.pack_up"),
        "",
        false
      ];
    }
    // 串关并且长度大于等于3,默认收起,展示一条;
  const rules_a = () => {
      if ((props.is_pre && props.data_b.detailList) || props.data_b.orderVOS.length >= 3)
        [btn_text, direction, box_bool] = [
          t("bet_record.pack_down"),
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
      lodash.map(data_b.orderVOS, (item, index) => {
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
  
}
</style>
