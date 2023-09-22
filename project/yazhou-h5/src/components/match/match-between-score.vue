<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页显示赛事当前局比分以及绿色小圆点显示发球方
-->
<template>
  <div class='match_between_score score-ball din-regular'>
    <span v-if="csid_arr.includes(detail_data.csid) && detail_data.ms == 1 && detail_data.msc.length != 0 && detail_data.mmp != 999">
      <!-- 发球方icon 不管字段mat存在与否 前端都不展示冰球发球方 -->
      <span v-if="detail_data.csid != '4'" :class="detail_data.mat == 'home'?'s-active-dot':'s-touming'" style="position:relative;right:0.06rem;"></span>
      <!-- 当前局比分 -->
      <div style="display:inline-block;">
        <!-- 网球取S103 -->
        <span style="fontSize:0.11rem;" v-if="detail_data.csid == 5 && current_score('S103')">({{current_score('S103') | format_score}})</span>
        <!-- 斯诺克, 乒乓球, 羽毛球, 排球, 沙滩排球 取赛事阶段范围内的最大为当前比分 -->
        <span style="fontSize:0.11rem;" v-if="detail_data.csid == 7 || detail_data.csid == 8 || detail_data.csid == 9 || detail_data.csid == 10 || detail_data.csid == 13">({{current_score(current_score_common()) | format_score}})</span>
        <!-- 冰球三节-局比分 -->
        <span style="fontSize:0.11rem;" v-if="detail_data.csid == 4 && mmp_arr1.includes(detail_data.mmp)">({{current_score(current_score_common()) | format_score}})</span>
        <!-- 冰球+橄榄球+曲棍球 加时赛比分 -->
        <span style="fontSize:0.11rem;" v-if="['4','14','15'].includes(detail_data.csid) && ['40','440','41','33','42'].includes(detail_data.mmp) && current_score('S7')">({{current_score('S7') | format_score}})</span>
        <!-- 冰球+橄榄球+曲棍球+水球 点球大战比分 -->
        <span style="fontSize:0.11rem;" v-if="['4','14','15','16'].includes(detail_data.csid) && (detail_data.mmp == 34 || detail_data.mmp == 50) && current_score('S170')">({{current_score('S170') | format_score}})</span>
      </div>
      <!-- 发球方icon 不管字段mat存在与否 前端都不展示冰球发球方 -->
      <span v-if="detail_data.csid != '4'" :class="detail_data.mat == 'away'?'s-active-dot':'s-touming'" style="position:relative;left:0.06rem;"></span>
    </span>
  </div>
</template>

<script>

export default {
  name: 'match_between_score',
  data(){
    return {
      // A代表ACE，就是俗称的发球直接得分！
      // ms 0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断
      // 4--冰球, 5--网球, 7--斯诺克, 8--乒乓球, 9--排球, 10--羽毛球, 13--沙滩排球,14--橄榄球, 15--曲棍球, 16--水球
      csid_arr:['4','5','7','8','9','10','13','14','15','16'], // 对应赛种才显示
      mmp_arr:['301','302','303', '304','305', '306','445'],// mmp rule array; // 斯诺克, 乒乓球, 羽毛球
      // 冰球三节显示局间比分的阶段
      mmp_arr1:['1','2','3','301','302']
    }
  },
  props: ['detail_data'],
  created(){
    examine_mmp(); // 检查mmp是否是局间休息，如果是，则不显示局间比分;
  },
  methods: {
    current_score(str) {
      let content = "";
      _.forEach(detail_data.msc, (v, k) => {
        if (v.split("|")[0] == str) {
          content = v.split("|")[1];
        }
      });
      return content;
    },
    current_score_common() {
      let num = 0;
      _.forEach(detail_data.msc, (v, k) => {
        let current = Number(v.split("|")[0].substring(1));
        if (current > num && (current >= 120 && current <= 159)) {
          num = Number(v.split("|")[0].substring(1));
        }
      });
      if (num != 0 || num != 1) {
        return `S${num}`;
      }
    },
    examine_mmp(){ // 将休息状态的发球方置空显示，不显示绿色小点;
      if(mmp_arr.includes(detail_data.mmp)){
        detail_data.mat = '';      
      }
    }
  }
}
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
  background: #6DD400;
  border-radius: 50%;
}

.s-touming {
  display: inline-block;
  width: 0.08rem;
  height: 0.08rem;
  border-radius: 50%;
}
</style>
