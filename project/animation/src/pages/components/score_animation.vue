<template>
  <div>
    <!--详情页视频区域中部(主副队logo+主副队名+赛事[阶段+时间+比分])-->
    <header-top :detail_data="match_detail" />
  </div>
</template>
<script setup>
import headerTop from "./header-top.vue"; // 详情页视频区域中部(主副队logo+主副队名+赛事[阶段+时间+比分])
import { api_details } from "project/animation/src/public/api/index"
// import { MatchDataWarehouse_H5_Detail_Common } from "src/output/index.js";
import { ref,onMounted ,onUnmounted} from "vue";
import lodash from "lodash";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { useRoute } from "vue-router";
const route =  useRoute()
let token =lodash.get(JSON.parse(sessionStorage.getItem("formData")),"token","bea5eddf73b1549cb330af08cd5255fd7b3e2ba4") 
const props = defineProps(["params"])
console.log(props.params,'params');
sessionStorage.setItem("token",token)
const userId = ref(null)
console.log(token,'route');
const match_detail = ref([])
function getMatchDetailMatchInfo() {
 let params = {
  mid:props.params?.matchId,
  cuid: userId.value,
 }
 api_details.get_matchDetail_MatchInfo(params).then((res) => {
    const res_data = lodash.get(res, "data.data");
    if (res_data && res_data.mhid) {
      match_detail.value = res_data;     
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
    userId.value = obj?.userId
    getMatchDetailMatchInfo()
  }
// watch(()=>props.params,(val)=>{
//   console.log(val,'getMatchDetailMatchInfo');
//   if(val) getMatchDetailMatchInfo()
// },{deep:true})  
const {off} = useMittOn(MITT_TYPES.EMIT_SHOW_SCORE,(val)=>{
  get_user_info(token)
})
let time = null
const getInfo4s=()=>{
  time = setInterval(()=>{
    getMatchDetailMatchInfo()
  }, 4000)
}
onMounted(()=>{
 get_user_info(token)
 getInfo4s()
})

onUnmounted(() => {
  off()
  clearInterval(time)
})
</script>
<style scoped></style>
