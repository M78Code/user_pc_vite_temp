<!--
 * @Author:
 * @Date: 2021-08-29
 * @Description: 活动内容 主页面
-->
<template>
  <div>
    <div
      class="activity_task"
      :class="[is_maintaining && 'act-maintain']"
      v-show="the_first_time_show"
    >
      <img
        :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/common/go-back-icon-theme02.svg`"
        class="back_btn"
        @click="go_where({ back_to: 'go_back_from_activity' })"
        v-show="is_maintaining"
      />
      <!-- 活动返回按钮 及 标题 -->
      <div class="head yb_px14 yb_fontsize14" v-if="!isAPP && !is_maintaining">
        <img
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/common/go-back-icon-theme02.svg`"
          @click="go_where({ back_to: 'go_back_from_activity' })"
        />
        <span>{{
          is_maintaining
            ? "活动维护"
            : "每天做任务 惊喜转不停，运气爆棚 奖金最高10倍送"
        }}</span>
      </div>
 <!-- {{ tab_list }} -->
      <!-- 正常活动页面 -->
      <div v-show="!is_maintaining" class="activity_page" :class="{
        isAPP: isAPP
      }">
        <header class="activity_task-header"></header>
        <div class="header-tab">
          <div
            v-for="(item, i) in tab_list"
            :key="i + 'ii_id'"
            :class="{ 'is-active': tab_Id == item.activityId }"
            @click="tab_click(item, item.activityId, i, 'maintain')"
          >
            <span>
              {{ item.activityId == "10010" ? "老虎机" : item.name }}
              <img :src="item.state_url" />
            </span>
          </div>
        </div>
        <!-- 每日任务组件 -->
        <GrowthTask
          v-if="tab_Id == 10007"
          :key="'daily'"
          :isIphoneX="isIphoneX"
          :inStartTime="inStartTime"
          :activityIndex="activity_index"
          :inEndTime="inEndTime"
          :actId="1"
          @to_lucky="to_lucky"
          @to_maintenance="to_maintenance"
        />
        <!-- 成长任务组件 -->
        <GrowthTask
          v-if="tab_Id == 10008"
          :key="'growing'"
          :isIphoneX="isIphoneX"
          :inStartTime="inStartTime"
          :activityIndex="activity_index"
          :inEndTime="inEndTime"
          :actId="2"
          @to_lucky="to_lucky"
          @to_maintenance="to_maintenance"
        />
        <!-- 幸运盲盒组件 -->
        <LuckyBlindBox
          v-if="tab_Id == 10009"
          :isIphoneX="isIphoneX"
          :inStartTime="inStartTime"
          :inEndTime="inEndTime"
          :activityIndex="activity_index"
          :key="'lucky'"
          @to_maintenance="to_maintenance"
        />
        
        <SlotMachine
          v-if="tab_Id == 10010"
          :isIphoneX="isIphoneX"
          :inStartTime="inStartTime"
          :inEndTime="inEndTime"
          :activityIndex="activity_index"
          :key="'SlotMachine'"
          @to_maintenance="to_maintenance"
        />

       
      </div>
      <!-- 活动挂维护页面 -->
      <div v-show="is_maintaining" class="maintain-main">
        <img :src="get_file_path(get_user.maintainingH5Url)" />
        <div class="maintain-describe">
          <div class="title_1">{{ get_user.maintainingTitle }}</div>
          <div class="title_2">{{ style_special_treatment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import LuckyBlindBox from "./components/lucky_blind_box.vue";
import GrowthTask from "./components/growth_task.vue";
import SlotMachine from "./components/slot_machine.vue";
import page_entry_mixin  from "project/activity/src/mixins/page_entry/page_entry.js";  
export default {
  mixins: [ page_entry_mixin],
  components: {
    LuckyBlindBox,
    GrowthTask,
    SlotMachine,
  },
}
</script>
 
 
<style lang="scss" scoped>
.activity_page{
  padding-top: 0.44rem;
  &.isAPP{
    padding-top: 0;
  }
}
.head {
  position: fixed;
  width: 100%;
  line-height: 0.44rem;
  height: 0.44rem;
  left: 0;
  top: 0;
  color: #333333;

  background: #fff;
  z-index: 99;
  text-align: center;
  padding-left: 0.15rem;

  > span {
    font-family: PingFangSC-Medium sans-serif;
    font-size: 0.13rem;
    color: #333333;
  }

  img {
    position: absolute;
    left: 0.15rem;
    top: 0.12rem;
    display: inline-block;
    width: 0.12rem;
    height: 0.2rem;
    vertical-align: -0.04rem;
    // margin-left: 0.01rem;
  }
}

.activity_task {
  padding-bottom: 0.5rem;

  background: #fff;
  position: relative;

  .back_btn {
    position: absolute;
    left: 0.16rem;
    top: 0.12rem;
  }

  .activity_task-header {
    width: 100%;
    padding-top: 100%;
    background: var(--qq--com-img-bg-148) no-repeat;
    background-size: 100% auto;
    background-color: #fdfcfa;
    background-position: center;
  }

  .header-tab {
    width: 3.4rem;
    height: 0.49rem;
    padding: 0 0.05rem;
    display: flex;
    align-items: center;
    margin: 0 auto;
    box-sizing: border-box;
    background: #fafafa;
    background-image: linear-gradient(
      180deg,
      #ffffff 0%,
      #f3f3f3 77%,
      #fafdff 100%
    );
    border: 2px solid #f2f2f2;
    border-radius: 0.35rem;
    margin-top: 0.05rem;

    > div {
      height: 0.34rem;
      padding: 0 0.1rem;
      flex: 1;
      color: #666666;
      display: flex;
      justify-content: center;
      align-items: center;
      letter-spacing: 0;
      text-align: center;
      font-size: 0.12rem;

      > span {
        position: relative;

        > img {
          height: 0.2rem;
          position: absolute;
          top: -0.21rem;
          right: -0.26rem;
        }
      }

      &.is-active {
        background-image: linear-gradient(180deg, #ffe8bc 0%, #e79b40 99%);
        border-radius: 0.245rem;
        color: #ffffff;
        font-weight: bold;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        width: 1.1rem;
      }
    }
  }
}

.act-maintain {
  padding: unset;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--qq--com-img-bg-131) no-repeat;
  background-size: 100% 100%;

  .maintain-main {
    display: flex;
    flex-direction: column;
    align-items: center;

    > img {
      width: 3.44rem;
      height: 2.9rem;
      margin-top: 0.2rem;
    }

    .maintain-describe {
      width: 80%;
      margin: 0 auto;
      text-align: center;
      color: #000000;

      .title_1 {
        font-family: PingFangSC-Semibold;
        color: #576484;
        font-size: 0.32rem;
        font-weight: bold;
      }

      .title_2 {
        font-family: PingFangSC-Regular;
        color: #3f4d6a;
        font-size: 0.12rem;
        line-height: 0.24rem;
        font-weight: 400;
        white-space: pre-line;
      }
    }
  }
}

// y0 样式对应
.theme01_y0,
.theme02_y0 {
  .activity_task {
    .header-tab {
      > div {
        &.is-active {
          background-image: linear-gradient(
            180deg,
            #62b6ff 0.31%,
            #3d72fa 100%
          );
        }
      }
    }
  }
}
</style>
<style lang="scss">
 .absolute-right{
    position: initial !important;
  }
  .q-scrollarea__content {
    overflow: hidden !important;
}
</style>
 