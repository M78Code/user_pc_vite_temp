<template>
  <div>
    <!--详情页视频区域中部(主副队logo+主副队名+赛事[阶段+时间+比分])-->
    111
    <header-top :detail_data="match_detail" />
  </div>
</template>
<script setup>
// import headerTop from "src/base-h5/components/details/components/header/header-top.vue"; // 详情页视频区域中部(主副队logo+主副队名+赛事[阶段+时间+比分])
import { api_details } from "project/animation/src/public/api/index"
// import { MatchDataWarehouse_H5_Detail_Common } from "src/output/index.js";
import courseData from "src/core/match-detail/match-detail-h5/config/course.js";
import { ref,onMounted } from "vue";
import lodash from "lodash";
import { useRoute } from "vue-router";
const route =  useRoute()
let token = route.query.token

sessionStorage.setItem("token",token)
const userId = ref(null)
console.log(token,'route');
const match_detail = ref([])
function getMatchDetailMatchInfo() {
 let params = {
  mid:"2980198",
  cuid: userId.value,
 }
 api_details.get_matchDetail_MatchInfo(params).then((res) => {
    const res_data = lodash.get(res, "data.data");
    if (res_data && res_data.mhid) {
      match_detail.value = res_data;
      match_detail.value.course =
        lodash.get(res_data, "ms") == 110
          ? "Soon"
          : courseData[lodash.get(res_data, "csid")][
              lodash.get(res_data, "mmp")
            ] || "";
      console.log(match_detail,'match_detail');      
      // match_detail.value.mstValueTime = format_mst_data(match_detail.value);
   
    } 
    // MatchDataWarehouse_H5_Detail_Common.set_match_details(match_detail.value, []);
   });
}
const  get_user_info = async(token, callback)=> {
   console.log(token,'sessionStorage.getItem("token")');
    let res = await api_details.get_user_info({
      token
    });
    let obj = lodash.get(res, 'data.data', {});
    console.log(obj,obj);
    userId.value = obj.userId
    getMatchDetailMatchInfo()
  }
onMounted(()=>{
 
 get_user_info(token)
})
</script>
<style scoped></style>
