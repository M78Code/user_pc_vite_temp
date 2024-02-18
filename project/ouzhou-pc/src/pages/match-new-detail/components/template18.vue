<!--
 * @Author: cooper
 * @Date: 2023-05-20 12:13:55
 * @Description:模板18
-->

<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="odds-title" :style="{ gridTemplateColumns: columnTotal() }">
    <template v-if="match_info.title && match_info.title.length > 0">
      <template v-for="(item, index) in match_info.title" :key="index">
        <div v-for="opt in item" :key="opt.otd" class="odds-title-li">
          <span class="handicap-value-text">{{ opt.osn }}</span>
          <!-- 模板18 -->
         
            <div class="temp-simple">
                
              <div v-for="ol in match_info.hl[0].ol" :key="ol.oid">
                <template v-if="ol.otd == opt.otd">
                  <div
                   
                    :class="{
                      tem4: true,
                      'tem4-active': BetData.bet_oid_list.includes(ol.oid),
                    }"
                    @click="betItemClick(match_info.hl[0], ol)"
                  >
                    <span>{{ ol.on }}</span>

                    <span >
                      <bet-item
                        :key="`bet_4_${ol.hild}`"
                        :ol_data="ol"
                        :current_ol="current_ol"
                      >
                      </bet-item>
                    </span>
                    <span ></span>
                  </div>
                  <div
                    class="tem4"
                    style="
                      justify-content: center;
                      align-items: center;
                      width: 100%;
                    "
                    v-show="match_info.hl[0].hs"
                  >
                    <img
                      class="vector"
                      :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`"
                      alt=""
                    />
                  </div>
                </template>
              </div>
            </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { onMounted, ref, computed } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import betItem from "./bet-item-list-new-data.vue";

const props = defineProps({
  match_info: {
    type: Object,
    default: () => {},
  },
  current_ol: {
    type: Object,
    default: () => {},
  },
  hpid: {
    type: String,
    default: "",
  },
});

const columnTotal = () => {
  return `repeat(3, 1fr)`;
};

const emit = defineEmits(["betItemClick"]);

const bet_oid = ref("");



const betItemClick = (item, o) => {
    // if (o.os!=1) {
    //     return
    // }
  bet_oid.value = o.oid;

  emit("betItemClick", item, o,props.match_info.hpn);
};

onMounted(() => {
 
});
</script>

<style lang="scss" scoped>
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
.temp-simple {
  margin-left: -1px;
  background: var(--q-gb-bg-c-4);
}

.tem4 {
  height: 45px;
  line-height: 45px;
  padding: 0 20px;
  display: flex;
  font-weight: 500;
  // justify-content: center;
  color: var(--q-gb-t-c-5);
  //  border-top: 1px solid #E2E2E2;
  border-left: 1px solid var(--q-gb-bd-c-2);
  border-bottom: 1px solid var(--q-gb-bd-c-2);
  cursor: pointer;
  span {
    &:nth-child(1) {
      width: 50%;
      display: block;
      text-align: right;
      padding-right: 20px;
      overflow: hidden;
      color: var(--q-gb-t-c-5);
    }
    &:nth-child(2) {
      overflow: hidden;
      width: 50%;
      min-width: 100px;
      display: block;
      margin-left: -40px;
      color: var(--q-gb-t-c-2);
    }
  }

  &:hover {
    background: var(--q-gb-bg-c-5);
  }
}

.tem4-active {
  background-color: var(--q-gb-bg-c-5) !important;
  // span {
  //   &:nth-child(1) {
  //     width: 50%;
  //     display: block;
  //     text-align: right;
  //     margin-right: 10px;
  //     overflow: hidden;
  //     color: var(--q-gb-t-c-14);
  //   }
  // }

  &:hover {
    background-color: var(--q-gb-bg-c-5) !important;
    color: var(--q-gb-t-c-1);
  }
}

.vector {
  width: 16px;
  height: 16px;
}
</style>