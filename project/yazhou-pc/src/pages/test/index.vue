<template>
  <div class="hiegsada">
    <div v-for="item in match_list_s" :key="item.mid">
      <div>{{ item.tid }} - {{ item.csna }} - {{ item.tnjc }}</div>
      <div>{{ item.mid }} - {{ item.man }} vs {{ item.mhn }}</div>

      <div v-for="(page,index) in item.hpsData" :key="index"> 
        <div>主盘口
          <div v-for="obj in page.hps" :key="obj.chpid">
            {{ play_id[obj.hpid] }}
            <ul v-if="obj.hl.ol">
              <div> {{ obj.hl.hid }} </div>
              <li v-for="obj_ol in obj.hl.ol" :key="obj_ol.oid" class="ty-li" @click="set_bet_oid(item,'master')">
                {{ obj_ol.oid }} - {{ obj_ol.onb }} -  {{ compute_value_by_cur_odd_type(obj_ol.ov/100000,'','',item.csid) }}
              </li>
            </ul>
          </div>
        </div>
        <div>副盘口
          <div v-for="obj in page.hpsAdd" :key="obj.chpid">
            {{ obj.hpid }}
              <template v-if="obj.hl.length">
                  <ul v-for="obj_hl in obj.hl" :key="obj_hl.hid">
                    <li v-for="obj_ol in obj_hl.ol" :key="obj_ol.oid" class="ty-li" @click="set_bet_oid(item,'vice')">
                      {{ obj_ol.oid }} - {{ obj_ol.onb }} - {{ compute_value_by_cur_odd_type(obj_ol.ov/100000,'','',item.csid) }}
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
import { UserCtr,compute_value_by_cur_odd_type } from "src/core/index.js"

    onMounted(()=>{
      api_list_data()
    })

    const play_id = ref({
      '1':"全场独赢"
    })

    const match_list_s = ref([])

    const api_list_data = () => {
      let params ={"apiType":1,"cuid":UserCtr.get_uid(),"euid":"3020101","orpt":"0","pids":"","sort":1,"tid":"","selectionHour":null}
      api_match.post_league_list(params).then(res=>{
        const {livedata,nolivedata} = res.data.data
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
      console.error('√',mids)
      let params = {mids,"cuid":UserCtr.get_uid(),"euid":"3020101","orpt":"0","sort":1,"pids":"","cos":0}
      socket_api.get_match_base_info_by_mids(params).then(res=>{
        let aaa = res.data.data.data.map(item=>{
          return item
        })
        match_list_s.value = aaa
      })
    }

    const set_bet_oid = (item,type) => {

    }


</script>

<style scoped lang="scss">
  .hiegsada{
    width: 90%;
    height: 90%;
    overflow-y: auto;
  }
  .ty-li{
    cursor: pointer;
    &:hover{
      color: #ff0000;
    }
  }
</style>