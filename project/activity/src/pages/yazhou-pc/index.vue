<!--
 * @Date: 2021-05-15 21:49:11
 * @FilePath: /user-pc1/project/activity/src/pages/yazhou-pc/index.vue
 * @Description: 活动页
 * @Author: Echo
-->
<template>
  <q-scroll-area v-show="layout_show" class="five-activity-action" ref="scrollareaRef">
    <!-- {{ tab_Id }} -->
    <div state="false">
      <!-- 头部 banner 图 -->
      <div class="top-banner">
        <img
          :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/common/activity_banner/banner_slot.jpg`"
          alt=""
          width="100%"
        />
      </div>
      <!-- 内容部分 -->
      <div v-show="!is_maintaining">
        <div class="container">
          <!-- 三个活动的 tab 切换 -->
          <div class="tabs">
            <div
              v-for="(item, i) in _tab_list_"
              :key="i + '_'"
              class="tab-item text-gray relative-position"
              :class="tab_Id == item.activityId ? 'isActive' : ''"
              @click="tab_click(item, item.activityId, i, 'maintain')"
            >
              <span>
                {{ item.activityId == "10010" ? "老虎机" : item.name }}
                <img class="state_url" :src="item.state_url" />
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
      </div>
    </div>

    <!-- 活动挂维护页面 -->
    <div v-show="is_maintaining" class="maintain-main">
      <img :src="get_file_path(get_user.maintainingH5Url)" />
      <div class="maintain-describe">
        <div class="title_1">{{ get_user.maintainingTitle }}</div>
        <div class="title_2">{{ style_special_treatment }}</div>
      </div>
    </div>
  </q-scroll-area>
</template>

<script>
import LuckyBlindBox from "./components/lucky_blind_box.vue";
import GrowthTask from "./components/growth_task.vue";
import SlotMachine from "./components/slot_machine.vue";
import page_entry_mixin from "project/activity/src/mixins/page_entry/page_entry.js";

export default {
  mixins: [page_entry_mixin],
  components: {
    LuckyBlindBox,
    GrowthTask,
    SlotMachine,
  },
  data() {
    return {
      showAlert: false, // 展示登录失效弹窗,
      layout_show:false,
    };
  },
  computed: {
    _tab_list_(){
      return this.tab_list || [];
      // 不显示幸运盲盒
      return (this.tab_list || []).filter(v => v.activityId != '10009');
    }
  },
  mounted(){
    this.$nextTick(()=>{
      this.layout_show = true;
    })
  }
};
</script>
<style lang="scss">
//@import "./y0_activity.scss";
.five-activity-action {
  // min-width: 1200px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  color: var(--qq--activity-text-color);
  background-color: var(--qq--activity-bg-color);
  // overflow-y: scroll;
  .q-scrollarea__thumb {
    opacity: 1 !important;
    background: #d8d9dc;

    &.absolute-bottom {
      display: none;
    }

    &.absolute-right {
      width: 7px !important;
    }
  }

  .q-scrollarea__bar {
    &.absolute-right {
      width: 7px !important;
      background: var(--qq--activity-bg-color);
      opacity: 1 !important;
    }
  }

  .relative-position {
    .q-scrollarea__content {
    }

    .full-width {
      .load-data-wrap {
        .loading-wrap {
          margin-top: 400px;
        }
      }
    }
  }

  /*  顶部 banner */
  .top-banner {
    min-height: 384px;

    img {
      display: block;
      width: 100% !important;
    }
  }

  /*  内容 */
  .container {
    margin: 0 auto;
    position: static;

    /*  活动 tabs */
    .tabs {
      height: 70px;
      border: 2px solid var(--qq--activity-bd-color);
      border-radius: 35px;
      background-image: var(--qq--activity-bd-img-gradient);
      display: flex;
      justify-content: space-around;
      width: 1200px;
      margin: 0 auto;
      padding: 3px;
      box-shadow: var(--qq--activity-box-shadow);

      .tab-item {
        position: relative;
        display: inline-block;
        flex: 1;
        line-height: 60px;
        font-size: 26px !important;
        font-family: PingFangSC-Light;
        text-align: center;
        cursor: pointer;
        border-radius: 30px;
        transition: all 0.2s;
        color: var(--qq--activity-text-color-3);

        .state_url{
          position: absolute;
          width: 84px;
          top: -20px;
          right: 12%;
        }
        .tips {
          position: absolute;
          width: 84px;
          top: -30px;
          right: 12%;
          background: transparent;
        }
      }

      .isActive {
        background-image: var(--qq--activity-tab-bg-img-active);
        color: var(--qq--activity-text-color-active);
        font-family: PingFangSC-Regular;
      }
    }

    /*  活动内容页面 */
    .tabs_content {
      font-size: 16px !important;
      width: 1200px;
      margin: 40px auto 0;
      background: var(--qq--activity-bg-color);
      border-radius: 30px;

      .activity_content {
        background: var(--qq--activity-bg-color);
        border: 1px solid var(--qq--activity-bd-color-2);
        box-shadow: var(--qq--activity-box-shadow-2);
        border-radius: 30px;
        position: relative;
        padding-bottom: 80px;
        margin-top: 80px;

        .content {
          width: 980px;
          margin: 0 auto;
          font-family: SourceHanSansSC-Medium;
        }
      }

      .content_bottom {
        position: absolute;
        bottom: -12px;
        left: 50%;
        margin-left: -29px;
      }

      .content_title {
        width: 260px;
        height: 62px;
        background-image: var(--qq--activity-bd-img-1);
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        line-height: 62px;
        font-family: PingFangSC-Medium;
        font-size: 24px;
        color: var(--qq--activity-text-color-16);
        text-align: center;
        margin: 0 auto;
        position: relative;
        top: -25px;
        margin-bottom: 20px;
        /*  活动规则公共样式 */
      }

      .activity_rules {
        background: var(--qq--activity-bg-color);
        border: 1px solid var(--qq--activity-bd-color-2);
        box-shadow: var(--qq--activity-box-shadow-2);
        border-radius: 30px;
        margin-top: 75px;
        margin-bottom: 60px;
        padding-bottom: 30px;

        p {
          width: 980px;
          margin: 0 auto;
          background: var(--qq--activity-bd-img-2) no-repeat;
          padding-left: 30px;
          background-size: 12px;
          background-position-x: 0px;
          background-position-y: 7px;
          line-height: 27px;
          margin-bottom: 48px;
          color: var(--qq--activity-text-color-3);

          &:nth-child(1) {
            margin-top: 35px;
          }

          &:last-child {
            margin-bottom: 0;
          }

          font {
            color: var(--qq--activity-text-color-4);
          }
        }
      }
    }
  }
}

/*  公共字体颜色，三个活动都在用 */
.text-orange {
  color: var(--qq--activity-text-color-4) !important;
}

.text-666 {
  color: var(--qq--activity-text-color-3);
}

.text-333 {
  color: var(--qq--activity-text-color-2);
}

p {
  margin-bottom: 0;
  /*  公共样式，活动头部信息 */
}

.introduction {
  p {
    background: var(--qq--activity-bd-img-2);
    background-repeat: no-repeat;
    background-size: 12px;
    background-position: 80px 13px;
    padding-left: 110px;
    line-height: 40px;
    margin-bottom: 4px;
    font-family: PingFangSC-Medium;

    span:not(.text-orange) {
      font-weight: 700;
    }
  }
}

.q-menu {
    .q-virtual-scroll__content {
        .q-item {
            width: 260px !important;
            padding-left: 30px;
        }

        .q-item--active {
            background-image: url($SCSSPROJECTPATH+"/activity/yazhou-pc/activity_imgs/imgs/got.svg") !important;
            background-repeat: no-repeat;
            background-size: 16px;
            background-position-x: 7px;
            background-position-y: 15px;
        }
    }

    .q-item--active {
      background-image: url($SCSSPROJECTPATH+"/activity/yazhou-pc/activity_imgs/imgs/got.svg") !important;
      background-repeat: no-repeat;
      background-size: 16px;
      background-position-x: 7px;
      background-position-y: 15px;
    }
  }


.text-blue {
  color: var(--qq--activity-text-color-blue) !important;
}
</style>
<style lang="scss">
.text-gray {
  color: var(--qq--activity-text-color-gray);
}

.text-red {
  color: var(--qq--activity-text-color-red) !important;
}
.q-scrollarea { 
    overflow: hidden !important;
    position: initial !important;
    contain: inline-size !important;
  }
</style>
