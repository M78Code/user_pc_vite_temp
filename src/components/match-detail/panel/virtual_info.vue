<!--
 * @Date: 2021-09-19 22:33:15
 * @FilePath: /user-pc1/src/project/yabo/components/match_details/panel/virtual_info.vue
 * @Description: 虚拟赛狗/赛马/摩托 头部数据展示（历史赛果、活力表现、综合评级）
 * @Author:
-->
<template>
  <div class="virtual_info vtable" v-if="lodash.get(match_info, 'rank[length]')">
    <div class="vhead">
      <div class="vtr">
        <div class="vtd" ></div>
        <!-- 历史赛果 -->
        <div class="vtd">{{i18n_t("match_info.match_history")}}</div>
        <!-- 活力表现 -->
        <div class="vtd">{{i18n_t("match_info.power")}}</div>
        <!-- 综合评级 -->
        <div class="vtd">{{i18n_t("match_info.composite")}}</div>
      </div>
    </div>

    <div class="vbody">
      <div class="vtr" v-for="(item, index) in match_info.rank" :key="`rank-${index}`">
        <!-- 参赛者名字 -->
        <div class="vtd">
          <div class="ranking-no" :class="`ranking-bg-style1-${item.number} csid-${match_info.csid}`"></div>
          <span>{{item.name}}</span>
        </div>
        <!-- 历史赛果 -->
        <div class="vtd">
          <span v-for="(list,i) in item.forecast" :key="`forecast-${i}`">{{list?list:'X'}}</span>
        </div>
        <!-- 活力表现 -->
        <div class="vtd">
          <div class="progress">
            <q-linear-progress size="4px" :value="item.form/100" />
          </div>
          <span>{{item.form}}%</span>
        </div>
        <!-- 综合评级 -->
        <div class="vtd">
          <div class="rating">
            <rating :star="item.star"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rating from 'src/public/components/rating/rating'
export default {
  components:{
    rating
  },
  props:{
    match_info: Object
  }
};
</script>

<style lang="scss" scoped>
.vtable {
  width: 600px;

  background: rgba(228, 230, 234, 0.95);
  margin: auto;
  color: #5a6074;
  font-size: 12px;
  .vtr {
    height: 21px;
    border-bottom: 1px solid rgba(153, 163, 177, 0.95);
    display: flex;
    align-items: center;
    .vtd {
      text-align: center;
      &:first-child {
        width: 200px;
        text-align: left;
        padding-left: 30px;
      }
      &:nth-child(2) {
        width: 86px;
        margin-right: 28px;
      }
      &:nth-child(3) {
        width: 122px;
        margin-right: 46px;
      }
      &:nth-child(4) {
        width: 72px;
      }
    }
    &:last-child {
      border: none;
    }
  }
  .vhead {
    height: 24px;
    .vtr {
      height: 24px;
      background: rgba(65, 105, 123, 1);
      color: #99a3b1;
    }
  }
  .vbody {
    .vtr {
      .vtd {
        display: flex;
        align-items: center;
        color: #17191d;
        &:first-child {
          .ranking-no {
            width: 12px;
            height: 12px;
            margin-right: 10px;
          }
        }
        &:nth-child(2) {
          span {
            flex: 1;
          }
        }
        &:nth-child(3) {
          color: #5a6074;
          .progress {
            width: 80px;
            margin-right: 10px;
            :deep() {
              .q-linear-progress {
                color: #ff9124;
              }
              .q-linear-progress__track--light {
                background: #555;
              }
            }
          }
        }
      }
    }
  }
}
</style>
