<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页显示赛事当前局比分以及绿色小圆点显示发球方
-->
<template>
  <div class="match_between_score score-ball din-regular">
    <!-- {{ detail_data.csid }}{{ detail_data.ms }}{{ detail_data.msc.length }}{{ detail_data.mmp }} -->
    <span
      v-if="
        csid_arr.includes(String(detail_data.csid)) &&
        detail_data.ms == 1 &&
        detail_data.msc.length != 0 &&
        detail_data.mmp != 999
      "
    >
     

      <!-- 当前局比分 此处主要用于复刻版，其余版本自行看适配不 -->
      <div class="match-score">
        <div class="sport-w-icon" v-if="detail_data.mat == 'home'">
          <span
            class="sport-icon-wrap"
            :style="
              compute_css_obj({
                key: 'menu-sport-active-image',
                position: format_type(MenuData.current_lv_2_menu),
              })
            "
          ></span>
        </div>
        <div v-else class="sport-w-icon" ></div>
        <div class="score-main">
          <!-- 网球取S103 -->
          <span
            style="fontsize: 0.11rem"
            v-if="detail_data.csid == 5 && current_score('S103')"
            >({{ format_score(current_score("S103")) }})</span
          >
          <!-- 斯诺克, 乒乓球, 羽毛球, 排球, 沙滩排球 取赛事阶段范围内的最大为当前比分 -->
          <span
            style="fontsize: 0.11rem"
            v-if="
              detail_data.csid == 7 ||
              detail_data.csid == 8 ||
              detail_data.csid == 9 ||
              detail_data.csid == 10 ||
              detail_data.csid == 13
            "
            >({{ format_score(current_score(current_score_common())) }})</span
          >
          <!-- 冰球三节-局比分 -->
          <span
            style="fontsize: 0.11rem"
            v-if="detail_data.csid == 4 && mmp_arr1.includes(detail_data.mmp)"
            >({{ format_score(current_score(current_score_common())) }})</span
          >
          <!-- 冰球+橄榄球+曲棍球 加时赛比分 -->
          <span
            style="fontsize: 0.11rem"
            v-if="
              ['4', '14', '15'].includes(detail_data.csid) &&
              ['40', '440', '41', '33', '42'].includes(detail_data.mmp) &&
              current_score('S7')
            "
            >({{ format_score(current_score("S7")) }})</span
          >
          <!-- 冰球+橄榄球+曲棍球+水球 点球大战比分 -->
          <span
            style="fontsize: 0.11rem"
            v-if="
              ['4', '14', '15', '16'].includes(detail_data.csid) &&
              (detail_data.mmp == 34 || detail_data.mmp == 50) &&
              current_score('S170')
            "
            >({{ format_score(current_score("S170")) }})</span
          >
        </div>
        <div
          class="sport-w-icon"
          v-if="detail_data.mat == 'away'"
          
        >
          <span
            class="sport-icon-wrap"
            :style="
              compute_css_obj({
                key: 'menu-sport-active-image',
                position: format_type(MenuData.current_lv_2_menu),
              })
            "
          ></span>
        </div>
        <div v-else class="sport-w-icon" ></div>
      </div>

    
    </span>
  </div>
</template>

<script>
import sportIcon from "src/components/sport_icon/sport-icon.vue";
import { compute_css_obj, MenuData } from "src/output/index.js";
export default {
  name: "match_between_score",
  components: { sportIcon },
  data() {
    return {
      // A代表ACE，就是俗称的发球直接得分！
      // ms 0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断
      // 4--冰球, 5--网球, 7--斯诺克, 8--乒乓球, 9--排球, 10--羽毛球, 13--沙滩排球,14--橄榄球, 15--曲棍球, 16--水球
      // Bug: 51980
      // 新增棒球 3--棒球
      // class="score-main" 等待单号：52566 一起处理
      csid_arr: ["3", "4", "5", "7","6" ,"8", "9", "10", "13", "14", "15", "16"], // 对应赛种才显示
      mmp_arr: ["301", "302", "303", "304", "305", "306", "445"], // mmp rule array; // 斯诺克, 乒乓球, 羽毛球
      // 冰球三节显示局间比分的阶段
      mmp_arr1: ["1", "2", "3", "301", "302"],
      MenuData,
      compute_css_obj,
    };
  },
  props: ["detail_data"],
  created() {
    this.examine_mmp(); // 检查mmp是否是局间休息，如果是，则不显示局间比分;
  },
  methods: {
    current_score(str) {
      let content = "";
      lodash.forEach(this.detail_data.msc, (v, k) => {
        if (v.split("|")[0] == str) {
          content = v.split("|")[1];
        }
      });
      return content;
    },
    /**
     * 比分格式设置
     */
    format_score(res) {
      let str = "";
      if (res.indexOf("|") != -1) {
        let arr = res.split("|");
        str = arr[1].split(":");
      } else if (res.indexOf(":") != -1) {
        str = res.split(":");
      }
      return `${str[0]} - ${str[1]}`;
    },

    /**
     * @description: 球类id转化背景
     * @param {String} id 球类id
     * @return {}
     */
    format_type(item = {}) {
      return this.MenuData.recombine_menu_bg(item, true);
    },
    current_score_common() {
      let num = 0;
      lodash.forEach(this.detail_data.msc, (v, k) => {
        let current = Number(v.split("|")[0].substring(1));
        if (current > num && current >= 120 && current <= 159) {
          num = Number(v.split("|")[0].substring(1));
        }
      });
      if (num != 0 || num != 1) {
        return `S${num}`;
      }
    },
    examine_mmp() {
      // 将休息状态的发球方置空显示，不显示绿色小点;
      if (this.mmp_arr.includes(this.detail_data.mmp)) {
        this.detail_data.mat = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.score-ball {
  position: absolute;
  font-size: 0.1rem;
  color: rgb(255, 255, 255);
  letter-spacing: 0px;
  width: 1rem;
  left: 50%;
  margin-left: -0.5rem;
  bottom: -0.12rem;
}

.s-active-dot {
  display: inline-block;
  width: 0.08rem;
  height: 0.08rem;
  background: #6dd400;
  border-radius: 50%;
}

.s-touming {
  display: inline-block;
  width: 0.08rem;
  height: 0.08rem;
  border-radius: 50%;
}

.sport-w-icon {
  height: 0.27rem;
  width: 0.27rem;
  display: inline-block;
  position: relative;
  margin-bottom: -0.1rem;

  .sport-icon-wrap {
    --per: -0.22rem;
    display: block;
    width: auto;
    height: 0.22rem;
    width: 0.22rem;
    background-position: 0 0;
    background-size: 0.22rem auto;
    scale: 0.8;

    &.focus-d {
      background-image: var(--q-color-com-img-bg-205);
    }

    &.focus-c {
      background-image: var(--q-color-com-img-bg-206);
    }

    &.focus-a {
      background-image: var(--q-color-com-img-bg-207);
    }

    &.focus-e {
      background-image: var(--q-color-com-img-bg-208);
    }

    &.focus-b {
      background-image: var(--q-color-com-img-bg-209);
    }
  }

  .sport-icon-wrap2 {
    position: absolute;
    bottom: 0;
    right: -0.04rem;
    width: 0.13rem;
    height: 0.14rem;
  }

  .sport-match-count {
    width: 1px;
    height: 1px;
    line-height: 1;
    position: absolute;
    right: -0.03rem;
    top: 0;
    font-size: 0.11rem;
  }
}

.match-score {
  display: flex;
  margin-bottom: -20px;
  align-items: center;
  height: 50px;
}
.score-main{
    margin-top: 8px;
    // margin-left: 8px;
    // margin-right: 8px;
    min-width: 0.5rem;

  }
</style>
