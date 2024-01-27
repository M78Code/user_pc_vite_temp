<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 网络中断提示
-->
<template>
  <div class="body">
    <div v-if="type == 'activity'" class="activity_task" :class="[is_maintaining && 'act-maintain']">
      <!-- 活动返回按钮 及 标题 -->
      <div class="head yb_px14 yb_fontsize14" v-if="!isAPP && !is_maintaining">
        <!-- <img src="image/wwwassets/bw3/svg/go-back-icon-theme02.svg" @click="$common.go_where({back_to: 'go_back_from_activity'})"/> -->
        <GoBackSvg class="go-back" @click="go_back" />
        <span>{{(is_maintaining) ? '活动维护' : '每天做任务 惊喜转不停，运气爆棚 奖金最高10倍送'}}</span>
      </div>
    </div>
    <div class="fixed-center main_layout">
      <img v-if="lang=='zh'" style="width: 85vw;" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/${pc_or_h5}_topic_zh.png`" alt />
      <img v-else style="width: 80vw;" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/${pc_or_h5}_topic_en.png`" alt />
    </div>
  </div>
</template>

<script>
import UserCtr from 'src/core/user-config/user-ctr.js'
import { LOCAL_PROJECT_FILE_PREFIX} from "src/output/index.js";
import GoBackSvg from 'src/components/go_back/index.vue'
import { useRouter, useRoute } from "vue-router";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { IS_PC } = BUILDIN_CONFIG 
export default {
  components: {
    GoBackSvg
  },
  computed: {
    lang(){
      return UserCtr.lang;
    }
  },
  props: {
    type: { // activity 活动
      type: String,
      default:''
    }
  },
  data() {
    return {
      // 是否是原生APP 的banner点击过来
      isAPP: false,
      // 是否是维护阶段
      is_maintaining:false,
      LOCAL_PROJECT_FILE_PREFIX:LOCAL_PROJECT_FILE_PREFIX,
      router : useRouter(),
      // 项目pc/h5标识
      pc_or_h5: BUILDIN_CONFIG.IS_PC?'pc':'h5',
    }

  },
  mounted () {
    if (SEARCH_PARAMS.init_param.get("isAPP")) {
      this.isAPP = true;
    } 
  },
  methods: {
    /**
     * 返回功能
     */
    go_back(){
      this.router.push({ name: "matchList" });
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  div{
    background-color: #fff;
  }
}
.main_layout{
  background-color: #fff;
}
.text-center {
  margin-top: 15px;
  font-size: 16px;
  color: #999;
}
.refresh-btn {
  background: rgba(0, 169, 151, 0.02);
  color: #b1987f;
  border: 1px solid #b1987f;
  border-radius: 19px;
  width: 100px;
  height: 38px;
  line-height: 38px;
  margin: 20px auto;
  font-size: 16px;
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
    background: var(--q-color-com-img-bg-148) no-repeat;
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
          right: -.26rem;
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
.head {
  position: sticky;
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

  .go-back {
    position: absolute;
    left: 0.18rem;
    top: 0.12rem;
    display: inline-block;
    width: 0.12rem;
    height: 0.2rem;
    vertical-align: -0.04rem;
    // margin-left: 0.01rem;
    color: #A0A0A0;
  }
}
.head{
  position: fixed;
  width: 100%;
  line-height: .44rem;
  height: 0.44rem;
  left: 0;
  top: 0;
  color: #333;
  background: #fff;
  z-index: 99;
  text-align: center;
  padding-left: 0.15rem;
}
</style>
