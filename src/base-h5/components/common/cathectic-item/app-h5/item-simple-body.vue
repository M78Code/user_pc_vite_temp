<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
<!-- 矩形框中部 -->
  <div class="item-body yb_fontsize14">
    <div class="body-title">
      <span>{{data_b.matchInfo}}</span>
    </div>
    <div class="body-info">
      <div>
        <p>{{data_b.sportName}}</p>
        <p>{{data_b.sportName}}</p>
      </div>
      <span>大3.5 @{{data_b.oddFinally}}</span>
    </div>
    <div class="body-main">
      <p><label>投注单号：</label> <span>{{data_b.betNo}}</span></p>
      <p><label>投注时间：</label> <span>{{data_b.beginTime}}</span></p>
      <p><label>{{data_b.matchName}}</label></p>
      <p><label>投资额：</label> <span>{{data_b.betAmount}}元</span></p>
      <p><label>可赢额：</label> <span>{{data_b.oddsValue}}元</span></p>
      <p><label>注单状态：</label> <span>投注成功</span></p>
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
    console.log(props.data_b);
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
  padding: 0.12rem;
  .body-title {
    display: flex;
    justify-content: space-around;
    font-weight: bold;
    font-size: 0.14rem;
    line-height: 3;
  }
  .body-info {
    text-align: center;
    background-color: var(--q-gb-bg-c-9);
    padding: 0.1rem;
    border-radius: 0.1rem;
    color: var(--q-gb-t-c-14);
    & > div {
      display: flex;
      font-weight: bold;
      justify-content: space-around;
    }
  }
  .body-main {
    margin-top: 0.1rem;
    p {
      line-height: 2;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
