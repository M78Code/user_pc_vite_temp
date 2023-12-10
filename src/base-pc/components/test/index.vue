<template>
  <div class="hiegsada">
    <div v-for="item in match_list_s" :key="item.mid">
      <div>{{ item.tid }} - {{ item.csna }} - {{ item.tnjc }}</div>
      <div @click="on_go_detail(item) ">{{ item.mid }} - {{ item.man }} vs {{ item.mhn }}</div>

      <div v-for="(page,index) in item.hpsData" :key="index"> 
        <div>主盘口
          <div v-for="(obj,index1) in page.hps" :key="index1">
            <div> 玩法ID：{{ obj.hpid }} - {{ play_id[obj.hpid] }}</div>
            <ul v-if="obj.hl.ol">
              <div> 盘口id: {{ obj.hl.hid }} - {{ obj.hl.hv }}</div>
              <li v-for="(obj_ol,index2) in obj.hl.ol" :key="index2" class="ty-li" @click="set_bet_obj_config(item,obj,obj.hl,obj_ol)">
               投注项： {{ obj_ol.oid }} - {{ obj_ol.onb }} - 1 - {{ obj_ol.ov }} - {{ compute_value_by_cur_odd_type(obj_ol.ov,'','',item.csid) }}
              </li>
            </ul>
          </div>
        </div>
        <div>副盘口
          <div v-for="(obj,index3) in page.hpsAdd" :key="index3">
            <div>玩法ID：  {{ obj.hpid }}  - {{ play_id[obj.hpid] }}</div>
              <template v-if="obj.hl.length">
                  <ul v-for="(obj_hl,index4) in obj.hl" :key="index4">
                    <div> 盘口id: {{ obj_hl.hid }} - {{ obj_hl.hv }} </div>
                    <li v-for="(obj_ol,index5) in obj_hl.ol" :key="index5" class="ty-li" @click="set_bet_obj_config(item,obj,obj_hl,obj_ol)">
                      投注项： {{ obj_ol.oid }} - {{ obj_ol.onb }} -  {{ obj_ol.ov }} - {{ compute_value_by_cur_odd_type(obj_ol.ov,'','',item.csid) }}
                      <!-- obj_ol.ov,'','', -->
                    </li>
                  </ul>
              </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { api_match,socket_api } from "src/api/index.js";
import { ref, reactive, onMounted,computed } from "vue"
import { compute_value_by_cur_odd_type } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"


import { useRouter } from "vue-router"

const router = useRouter()
    onMounted(()=>{
      api_list_data()
    })

    const play_id = ref({
      '1':"全场独赢",
      '4':"全场让球",
      '2':"全场大小",
      '17':"半场独赢",
      '19':"半场让球",
      '18':"半场大小",
    })
    //跳转到赛事详情
    const on_go_detail=(item)=>{
      let {mid,tid,csid} =item
      router.push({
            name: "details",
            params: {
              mid,
              tid,
              csid
            },
        })
    }
    const match_list_s = ref([])

    const euid = "3020101"

    const api_list_data = () => {
      let params ={"apiType":1,"cuid":UserCtr.get_uid(),euid,"orpt":"0","pids":"","sort":1,"tid":"","selectionHour":null}
      api_match.post_league_list(params).then(res=>{
        const {livedata,nolivedata} = res.data
        let mids = ''
        livedata.forEach(item=>{
          mids += ','+ item.mids
        })
        nolivedata.forEach(item=>{
          mids += ','+ item.mids
        })
        api_list_dymids(mids.substr(1))
      })
    }

    const api_list_dymids = mids => {
      // console.error('√',mids)
      let mid = mids.slice(0,88)
      let params = {mids:mid,"cuid":UserCtr.get_uid(),euid,"orpt":"0","sort":1,"pids":"","cos":0}
      socket_api.get_match_base_info_by_mids(params).then(res=>{
        let aaa = lodash.get(res,"data.data").map(item=>{
          return item
        })
        match_list_s.value = aaa
      })
    }



</script>

<style scoped lang="scss">
  .hiegsada{
    width: 90%;
    height: 90%;
    overflow-y: auto;
    margin-left: 5%;
  }
  .ty-li{
    cursor: pointer;
    &:hover{
      color: #ff0000;
    }
  }
</style>