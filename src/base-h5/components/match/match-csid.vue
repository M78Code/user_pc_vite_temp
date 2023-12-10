<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 根据赛事状态显示赛事时间
-->
<template>
  <span class="match_csid">
    <span v-if="dialog">
      <!-- dialog 弹窗 -->
      {{get_mmp_name(detail_data.csid,detail_data.mmp)}}
      <span
        v-if="mmp_arr.includes(detail_data.mmp) && showTime"
      >&nbsp;&nbsp;{{ $filters.format_mgt_time(showTime) }}</span>
      <span v-if="show_bsk_time">
        &nbsp;&nbsp;<span>10:00</span>
      </span>
    </span>
    <span v-else>
      <!-- 普通 -->
      {{get_mmp_name(get_detail_data.csid,get_detail_data.mmp)}}
      <span
        v-if="mmp_arr.includes(detail_data.mmp) && showTime"
      >&nbsp;&nbsp;{{ $filters.format_mgt_time(showTime) }}</span>
      <span v-if="show_bsk_time">
        &nbsp;&nbsp;<span>10:00</span>
      </span>
    </span>
  </span>
</template>

<script>
// import { mapGetters } from "vuex";
// import msc from "src/public/mixins/common/msc.js";
import { format_mgt_time } from "src/output/index.js"
export default {
  // mixins: [msc],
  name: "match_csid",
  data() {
    return {
      // 相关csid 1-足球   2-篮球  5-网球 7-斯诺克 8-乒乓球 10-羽毛球;
      // 足球： 6 上半场  7 下半场  41 加时赛上半场  42 加时下半场;
      // 篮球:  13 第一节 14 第二节 15 第三节  16 第四节 40加时赛  1 上半场 2 下半场;
      mmp_arr: ["6", "7", "41", "42", "13", "14", "15", "16", "40", "1", "2"],
    };
  },
  computed: {
    // ...mapGetters(["get_detail_data"]),
    show_bsk_time(){
      let array = [ '301', '302', '303' ];
      if(this.get_detail_data.csid == 2 && array.includes(this.get_detail_data.mmp) ){
        return true
      }else{
        return false
      }
    }
  },
  props: ["detail_data", "showTime", "dialog"],
};
</script>

<style lang="scss" scoped></style>