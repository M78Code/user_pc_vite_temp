<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
  <!-- 矩形框中部 -->
  <div class="item-body yb_fontsize14">
    <div class="item-header">
      {{ data_b.seriesValue }}
    </div>
    <div class="item-main three-more">
      <template v-for="(item, index) in data_b.orderVOS" :key="index">
        <div class="items" v-if="item.isBoolean">
          <div class="top">
            <p>{{ item.matchName }}</p>
            <span>{{ item.oddFinally }}</span>
          </div>
          <p class="list">{{ item.playName }}</p>
          <div class="list score">
            <p v-if="item.playName">{{ item.playName }}</p>
            <span v-if="item.playName">{{ item.playName }}</span>
          </div>
          <span class="info">{{ item.matchInfo }}</span>
        </div>
      </template>
      <!-- 串关时大于2条时,显示 展开收起按钮-->
      <div class="toggle row" v-if="data_b.orderVOS.length > 2">
        <span class="btn_style" @click="toggle_box">
          <span class="text_c">{{ btn_text }}</span>
        </span>
      </div>
    </div>
    <div class="foot-main">
      <p><label>投资额：</label> <span>10.00元</span></p>
      <template>
        <p v-if="type !== 'settle'" class="acount"><label>可赢额：</label> <span>5.60元</span></p>
        <p v-else class="acount"><label>结算：</label> <span>赢 5.60元</span></p>
      </template>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { t } from "src/boot/i18n.js";;
import { project_name } from 'src/core'

//按钮名字
let btn_text = ref(t("bet_record.pack_up"))
//是否展开
let box_bool = ref(false)
let props = defineProps({
  data_b: {
    type: Object
  },
  type: {
    type: String
  }
})

onMounted(() => {
  rules_a();
  rules_b();
  rules_c()
})

//切换是否展开
const toggle_box = () => {
  box_bool = !box_bool;
  if (box_bool == true) {
    [btn_text] = [
      t("bet_record.pack_down")
    ];
    toggle_rule_b();
  } else {
    [btn_text] = [
      t("bet_record.pack_up")
    ];
    toggle_rule_a();
  }
}
// 串关并且长度大于等于3,默认收起,展示一条;
const rules_a = () => {
  if (props.data_b.orderVOS.length >= 3) {
    btn_text.value = t("bet_record.pack_down");
    box_bool.value = true;
  }
}

const rules_b = () => {
  if (props.data_b.orderVOS.length <= 3) toggle_rule_a();
}
const rules_c = () => {
  if (props.data_b.orderVOS.length > 3) toggle_rule_b();
}
//小于等于3个时都展开
const toggle_rule_a = () => {
  lodash.map(props.data_b.orderVOS, (item, index) => {
    item.isBoolean = true;
    return item;
  });
}
//大于3个时，第一个和第二个展开
const toggle_rule_b = () => {
  lodash.map(props.data_b.orderVOS, (item, index) => {
    item.isBoolean = false;
    if (index < 3) {
      item.isBoolean = true;
    }
    return item;
  });
}
</script>

<style lang="scss" scoped>
template {
  display: block;
}
.item-body {
  .item-header {
    background-color: var(--q-gb-bg-c-9);
    color: var(--q-gb-bg-c-15);
    line-height: 0.4rem;
    padding-left: 0.12rem;
  }

  .item-main {
    padding: 0.12rem;

    .items {
      padding-bottom: 0.1rem;

      &:last-child {

        .list,
        .info {
          border: none;
        }
      }

      .top {
        display: flex;
        justify-content: space-between;
        font-size: 0.16rem;
        font-weight: bold;
        position: relative;
        padding-left: 0.14rem;

        span {
          color: var(--q-gb-bg-c-9);
        }
      }

      .list {
        line-height: 1.5;
        font-weight: bold;
        padding-left: 0.1rem;
        margin-left: 0.04rem;
        border-left: 1px solid var(--q-gb-bg-c-9);

        &.score {
          display: flex;
          justify-content: space-between;

          span {
            color: var(--q-gb-bg-c-13)
          }

          ;
        }
      }

      .info {
        padding-left: 0.1rem;
        margin-left: 0.04rem;
        border-left: 1px solid var(--q-gb-bg-c-9);
        font-size: 0.12rem;
        color: var(--q-gb-bg-c-6);
        display: block;
      }
    }
  }
  .toggle {
    position: relative;
    padding-left: 0.14rem;
    .text_c {
      display: block;
      padding: 0.02rem 0.1rem;
      background-color: var(--q-gb-bg-c-9);
      border-radius: 0.2rem;
      font-size: 0.12rem;
      color: var(--q-gb-bg-c-15);
    }
  }
  .toggle::after, .items .top::after {
    content: '';
    width: 0.1rem;
    height: 0.1rem;
    background-color: var(--q-gb-bg-c-15);
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    border-radius: 100%;
    border: 2px solid var(--q-gb-bg-c-9);
  }
  .foot-main {
    padding: 0 0.14rem 0.14rem;
    p {
      line-height: 2;
      display: flex;
      justify-content: space-between;
      &.acount {
        color: var(--q-gb-bg-c-9);
      }
    }
  }
}
</style>
