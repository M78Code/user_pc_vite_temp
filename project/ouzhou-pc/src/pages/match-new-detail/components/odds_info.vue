<!--
 * @Author: cooper
 * @Date: 2023-05-19 15:13:55
 * @Description: 赛事详情页玩法
-->
<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}</div>
  <div class="match-detail-odds" ref="scrollRef">
    <div
      v-for="item in matchDetail"
      :key="item.topKey"
      :class="{ 'odds-wrap': item.hl[0].hs != 2 }"
    >
      <q-expansion-item
        v-if="item.hl[0].hs != 2"
        v-model="item.expanded"
        :expand-icon-toggle="false"
        :hide-expand-icon="true"
        expand-separator
        :default-opened="true"
        :header-style="{ backgroundColor: '#ffffff', height: '50px' }"
      >
        <!-- 赛事玩法名称  hs: 0开 1封 2关 11锁  -->
        <template v-slot:header>
          <div class="odds-item">
            {{ item.hpn }}
            <span v-if="item.hps && get_match_status(detail_info.ms) == 1">
              ({{ item.hps.split("|")[1] }})
            </span>
            <!-- 一键置顶 -->
            <img
              :src="parseInt(item.hton) > 0 ? set_top__active_png : set_top_png"
              alt=""
              @click.stop="set_top(item)"
              srcset=""
              class="set-icon"
            />
            <!-- 折叠 -->
            <img
              :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/down_arrow.png`"
              alt=""
              srcset=""
              class="expand-icon"
              :style="{
                transform: item.expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              }"
            />
          </div>
        </template>
        <q-card v-if="item.hl[0].hs != 2">
          <q-card-section>
            <!-- 详情页玩法名称 -->
            <div
              class="odds-title"
              :style="{ gridTemplateColumns: columnTotal(item) }"
            >
              <template v-if="item.title && item.title.length > 0">
                <span
                  v-if="[5].includes(item.hpt)"
                  class="odds-title-li"
                ></span>
                <div
                  v-for="opt in item.title"
                  :key="opt.otd"
                  class="odds-title-li"
                >
                  <span
                    v-if="![0, 1, 2, 3, 7, 10,14, 18].includes(item.hpt)"
                    class="handicap-value-text"
                    >{{ opt.osn }}</span
                  >
                  <!-- 模板4 -->
                  <template
                    v-if="
                      item.hpid == 103 ||
                      ([4, 6].includes(item.hpt) &&
                        sun_ol(item.hl[0].ol, item).length > 0)
                    "
                  >
                    <div class="temp-simple">
                      <div
                        v-for="ol in sun_ol(item.hl[0].ol, item)"
                        :key="ol.oid"
                      >
                        <template v-if="ol.otd === opt.otd || ol._otd === opt.otd">
                          <div
                            :class="{ tem4: true, 'close-tem4-hover': ol._mhs !=0 || ol._hs != 0 || ol.os != 1, 'tem4-active': BetData.bet_oid_list.includes( ol.oid ) }"
                            @click="betItemClick(item.hl[0], ol, item.hpn)"
                          >
                            <span style="line-height: 1;display: flex;justify-content:center;align-items: center">
                              <span v-if="txt_ol_name_fun(ol)" class="txt-ol-name">{{txt_ol_name_fun(ol)}}</span>
                              {{ ol.on }}
                            </span>
                            <span>
                            <!-- 有ov 才显示 -->
                              <bet-item
                              v-if="ol.ov"
                                :key="`bet_4_${ol.hild}`"
                                :ol_data="ol"
                                :current_ol="current_ol"
                              ></bet-item>
                            </span>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </div>
            <!-- 公共模板  51 为电子竞技模版 -->
            <common-template
              v-if="[0, 1, 2, 3, 7, 10,13,14,15,51].includes(item.hpt) && item.hpid != 103"
              :match_info="item"
              :get_icon="get_icon"
              :current_ol="current_ol"
              @betItemClick="betItemClick"
            />
            <!-- 模板5 -->
            <template5
              v-if="[5].includes(item.hpt)"
              :match_info="item"
              :hpid="item.hpid"
              :current_ol="current_ol"
              @betItemClick="betItemClick"
            />
            <!-- 模板18 -->
            <template18
              v-if="[18].includes(item.hpt)"
              :match_info="item"
              :hpid="item.hpid"
              :current_ol="current_ol"
              @betItemClick="betItemClick"
            />
             <!-- vr 虚拟体育模板 -->
             <virtual-template
              v-if="[11].includes(item.hpt)"
              :match_info="item"
              :current_ol="current_ol"
              :get_icon="get_icon"
              @betItemClick="betItemClick"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>
    <!-- 详情页有数据时展示白色底部 -->
    <div v-if="!show_close_thehand" class="bottom-height"></div>
    <!-- 无数据时展示无盘口的数据提示 -->
    <div v-else class="close_thehand_icap">
      <div>
        <img
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/close_the_handicap.png`"
          alt=""
          srcset=""
        />
        <div style="text-align: center; color: #a1a3a5; font-weight: 500">
          {{ i18n_t("ouzhou.detail.close_handicap") }}
        </div>
      </div>
    </div>

    <!-- <div class="detail-loading" v-if="loading">
      <q-circular-progress indeterminate rounded size="80px" :thickness="0.1" color="opt-basic" class="q-ma-md" />
    </div> -->

    <back-top :scroll-ele="scrollRef" />
  </div>
</template>

<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { onMounted, ref, computed } from "vue";
import {
  LOCAL_PROJECT_FILE_PREFIX,
  MenuData,
  get_match_status,
} from "src/output/index.js";
import template5 from "./template5.vue";
import template18 from "./template18.vue";
import commonTemplate from "./common-template.vue";
import virtualTemplate from "./virtual-template.vue";
import betItem from "./bet-item-list-new-data.vue";
import { BackTop } from "src/components/back-top";
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";

const props = defineProps({
  matchDetail: {
    type: Array,
    default: () => [],
  },
  detail_info: {
    type: Object,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
  show_close_thehand: {
    type: Boolean,
    default: false,
  },
});

const set_top_png = `${LOCAL_PROJECT_FILE_PREFIX}/image/details/set_top.png`;
const set_top__active_png = `${LOCAL_PROJECT_FILE_PREFIX}/image/details/set_top_active.png`;
// `mhs` 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
// <!-- ms: 0未开赛，1 进行中 110 即将开赛-->
//     <!-- hs: 0开 1封 2关 11锁 -->
//     <!-- os: 1开 2封 3隐藏不显示不占地方-->
const mouse_in = ref(false);
const scrollRef = ref(null);
const current_ol = ref({ oid: "" });
const emit = defineEmits(["change"]);

const columnTotal = (item) => {
  let total;
  if (item.title?.length > 0) {
    total = [5].includes(item.hpt) ? item.title?.length + 1 : item.title?.length;
  } else {
    total = 2;
  }
  return `repeat(${total}, 1fr)`;
};

// 反波胆玩法增加'非'
const txt_ol_name_fun = (data) => {
  let res = (['367','368','369'].includes(data._hpid) && (data.ot != 'Other'))?i18n_t('common.non') : '';
  return res;
};
//  模板4 数据处理
const sun_ol = (ol, item) => {
  let maxCount = 0;
  const obj = {};
  let itemList = [];
  let result = [];
  let other_odd = ol.filter((i) => i.otd === -1);

  item.title.forEach((opt, index) => {
    itemList = ol.filter((i) => i.otd === opt.otd);
    obj[opt.otd] = itemList;
    if (itemList.length > maxCount) {
      maxCount = itemList.length; // 获取最大值那一列的数量
    }
  });
  for (const key in obj) {
    let ele = obj[key];
    let list = [];
    if (ele.length !== maxCount) {
      // 列数不够的话添加假数据
      for (let index = 0; index < maxCount - ele.length; index++) {
        list.push({ otd: Number(key), on: "", oid: key + "-" + index });
      }
    }

    obj[key] = [...obj[key], ...list];
    if (key == item.title[item.title.length - 1].otd) {
      if (other_odd.length > 0) {
        obj[key].push(other_odd[0]);
      }
    }
    result = [...result, ...obj[key]];
  }

  // 其他
  if (other_odd.length > 0) {
    result[result.length - 1]._otd = item.title[item.title.length - 2].otd;
  }

  return result;
};
// 一键置顶
const set_top = (item) => {
  useMittEmit(MITT_TYPES.EMIT_SET_PLAT_TOP, item);
};
// 获取图片
const get_icon = (otn) => {
  return new URL(
    `${LOCAL_PROJECT_FILE_PREFIX}/image/ranking/${props.detail_info.csid}_${otn}.png`,
    import.meta.url
  ).href;
};

//  投注项点击投注,
const betItemClick = (item, ol, play_name) => {
  // 挂锁不可点击  // hs 11 锁盘状态，可点击
  if ( (ol._mhs>0&&ol._mhs!=11) || (ol._hs>0&&ol._hs!=11)) {
    return;
  }
  if (ol.os != 1) {
      return;
    }
  // if (ol.cds) {
    current_ol.value = ol;
    let params = {
      oid: ol.oid, // 投注项id ol_obj
      _hid: ol._hid, // hl_obj
      _hn: ol._hn, // hn_obj
      _mid: ol._mid, //赛事id mid_obj
    };
    let bet_type = 'common_bet'
     // 冠军
     if (MenuData.is_kemp()) {
         bet_type = 'guanjun_bet'
     }
     // 电竞
     if (MenuData.is_esports()) {
         bet_type = 'esports_bet'
     }
     // vr体育
     if (MenuData.is_vr()) {
         bet_type = 'vr_bet'
     }
    let other = {
      is_detail: true,
      // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
      // 根据赛事纬度判断当前赛事属于 那种投注类型
      bet_type,
      // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
      device_type: 2,
      // 数据仓库类型
      match_data_type: "pc_detail", // h5_detail
      play_name,
    };
     set_bet_obj_config(params, other);
  // }
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.txt-ol-name{
  margin-right: 4px;
}
.match-detail-odds {
  height: calc(100vh - 248px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-right: -4px;
  position: relative;
  :deep(.close_thehand_icap) {
    width: 100%;
    height: 100%;
    background-color: white;
  }
  :deep(.close_thehand_icap > div) {
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translate(-50%, 0);
  }
  :deep(.q-card__section--vert) {
    padding: 0px;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--q-gb-bg-c-11);
    border-radius: 4px;
  }

  :deep(.q-focus-helper) {
    display: none;
  }
}

.odds-wrap {
  background: var(--q-gb-bg-c-4);
  box-sizing: border-box;
  border-bottom: 1px solid var(--q-gb-bd-c-1);

  .odds-hpn {
    display: block;
    font-weight: 500;
    font-size: 14px;
    line-height: 40px;
    height: 40px;
    margin-left: 16px;
    color: var(--q-gb-t-c-5);
  }

  .odds-title {
    // background: #F5F5F5;
    display: grid;
    text-align: center;
    // height: 26px;
    // line-height: 26px;

    .odds-title-li {
      background: var(--q-gb-bg-c-15);

      .handicap-value-text {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        color: var(--q-gb-t-c-5);
        opacity: 0.6;
        font-size: 12px;
      }
    }
  }
  :deep(.temp-simple) {
  .oid-width {
    min-width: 35px;
  }
}
}

.temp-simple {
  margin-left: -1px;
  border-top: 1px solid var(--q-gb-bd-c-2);
  background: var(--q-gb-bg-c-4);
}

.tem4 {
  height: 45px;
  // line-height: 45px;
  // padding: 0 20px;
  display: flex;
  font-weight: 500;
  align-items: center;
  // justify-content: center;
  color: var(--q-gb-t-c-5);
  //  border-top: 1px solid #E2E2E2;
  border-left: 1px solid var(--q-gb-bd-c-2);
  border-bottom: 1px solid var(--q-gb-bd-c-2);
  cursor: pointer;
  span {
    &:nth-child(1) {
      width: 50%;
      text-align: right;
      padding-right: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
       display: -webkit-box; /*1*/
      -webkit-line-clamp: 2; /*2*/ /*第几行裁剪*/
      -webkit-box-orient: vertical; /*3*/
      color: var(--q-gb-t-c-5);
    }
    &:nth-child(2) {
      overflow: hidden;
      width: 50%;
      min-width: 100px;
      display: flex;
     justify-content: flex-start;
     margin-left: 15px;
      color: var(--q-gb-t-c-2);
    }
  }

  &:hover {
    background: var(--q-gb-bg-c-5);
  }
  &.close-tem4-hover {
    &:hover {
      background: unset;
    }
  }
}

.tem4-active {
  background-color: var(--q-gb-bg-c-5) !important;

  &:hover {
    background: var(--q-gb-bg-c-5) !important;
    // color: var(--q-gb-t-c-1);
  }
}

.bottom-height {
  height: 50px;
  width: 100%;
  background-color: var(--q-gb-bg-c-4);
}

.detail-loading {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, 0);
}
.odds-item {
  width: 100%;
  line-height: 35px;
  position: relative;
  font-weight: 500;
  font-size: 15px;
}
.expand-icon {
  height: 9px;
  float: right;
  margin-top: 12px;
}

.vector {
  width: 16px;
  height: 16px;
}
.set-icon {
  position: absolute;
  right: -25px;
  top: 8px;
  height: 16px;
  width: 16px;
  margin-right: 50px;
  cursor: pointer;
}
</style>
