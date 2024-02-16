<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
<!-- 矩形框中部 -->
  <div class="item-body yb_fontsize14">
    <div class="body-title">
        <template v-if="data_b.seriesType == '3' && Item.sportName">
          <p style="text-wrap: nowrap;">[{{Item.sportName}}]</p>
        </template>
        <template v-if="Item.sportId == 1011 || Item.sportId == 1002">{{Item.batchNo}}</template>
        <template v-else>
          <span v-if="matchInfo(Item.matchInfo).length >= 1 " style="margin-Left: 4px">{{ matchInfo(Item.matchInfo)[0] }}</span>
          <template v-if="matchInfo(Item.matchInfo).length >= 2">
            <span>VS</span>
            <span>{{ matchInfo(Item.matchInfo)[1] }}</span>
          </template>
        </template>
    </div>
    <div class="body-info">
      <div>
          {{ i18n_t('app_h5.cathectic.bets') }}:[{{Item.sportName}}]:{{ i18n_t(`matchtype.${Item.matchType}`) }} {{Item.playName}} - {{i18n_t(`odds.${Item.marketType}`)}}
      </div>
      <span>
        <span>
          <template v-if="!([1011, 1002, 1010, 1009].includes(+Item.sportId) && calc_num(Item) && calc_num(Item).length > 1)">
            {{(BetRecordClass.selected === 1 || BetRecordClass.selected === 2) ? Item.playOptionName: Item.marketValue}}
          </template>
        </span>
        <!-- 大3.5  -->
        @{{ Item.oddFinally }}
      </span>
    </div>
    <div class="body-main">
      <p><label>{{ i18n_t('app_h5.cathectic.bet_number') }}：</label> 
        <span @click="copy">{{data_b.orderNo}}
          <img :src="compute_local_project_file_path('/image/svg/copy.svg')" alt=""  style="width:0.1rem" />
        </span>
      </p>
      <p><label>{{ [1,2].includes(BetRecordClass.selected) ? i18n_t('bet_record.bet_pre_time') : i18n_t('bet_record.bet_time')}}：</label> 
        <span>{{formatTime(+data_b.betTime, 'YYYY-mm-DD HH:MM')}}</span>
      </p>
      <p><label>[{{Item.sportName}}] {{Item.matchName}}</label></p>
      <!-- 可赢额、结算, 注单状态： -->
      <item-footer :data_f="data_b"></item-footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import { i18n_t } from "src/boot/i18n.js";;
import { formatTime, format_money2, compute_local_project_file_path } from 'src/output/index.js'
import { itemFooter } from "src/base-h5/components/common/cathectic-item/app-h5/index";
import ClipboardJS from "clipboard";
import { Platform } from "quasar";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"
let props = defineProps({
    data_b: {
      type: Object
    }
  })

  const Item = computed(() => {
    return props.data_b.orderVOS[0] || []
  })

  //虚拟赛马计算标识数量
  const calc_num = (Item) => {
    if (/[0-9]/.test(Item.playOptions)) {
      return Item.playOptions.split('/')
    } else {
      return false
    }
  }
  /**
 *@description 复制订单号
  *@param {Object} evt 事件对象
  */
const copy = (evt) => {
  let orderno = props.data_b.orderNo
  const clipboard = new ClipboardJS(".text-left", {
    text: () => orderno
  })
  clipboard.on('success', () => {
    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("bet_record.copy_suc"))
    // h5嵌入时Safari阻止弹窗
    if (!Platform.is.safari) {
      try {
        location.href = `pasteOrderAction://paste?orderSN=${orderno}`;
      } catch (error) {
        console.error(error)
      }
    }
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboard.destroy()
  })
  clipboard.onClick(evt)
}

const matchInfo = (matchInfo) => {
  return matchInfo ? matchInfo.split(" v ") : []
}
</script>

<style lang="scss" scoped>
template {
  display: block;
}
.item-body {
  padding: 0.12rem;
  color: var(--q-gb-t-c-18);
  .body-title {
    display: flex;
    justify-content: space-around;
    font-size: 0.12rem;
    line-height: 3;
    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .body-info {
    text-align: center;
    background-color: var(--q-gb-bg-c-13);
    padding: 0.1rem;
    border-radius: 0.1rem;
    color: var(--q-gb-t-c-14);
    font-size: 0.12rem;
    & > div {
      display: flex;
      font-weight: bold;
      justify-content: space-around;
    }
  }
  .body-main {
    margin-top: 0.1rem;
    font-size: 0.12rem;
    p {
      line-height: 2;
      display: flex;
      justify-content: space-between;
      &.acount {
        color: var(--q-gb-bg-c-13);
      }
    }
  }
  .green {
    color: #69C969
  }

  .red {
    color: #E93D3D
  }

  .black {
    color: #666666
  }

  .orange {
    color: #FFB001
  }

  .gray {
    color: #D2D2D2
  }
}
</style>