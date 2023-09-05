<template>
  <div class="hiegsada">
    <div v-for="item in match_list_s" :key="item.mid">
      <div>{{ item.tid }} - {{ item.csna }} - {{ item.tnjc }}</div>
      <div @click="on_go_detail(item) ">{{ item.mid }} - {{ item.man }} vs {{ item.mhn }}</div>

      <div v-for="(page,index) in item.hpsData" :key="index"> 
        <div>主盘口
          <div v-for="obj in page.hps" :key="obj.chpid">
            <div> 玩法ID：{{ obj.hpid }} - {{ play_id[obj.hpid] }}</div>
            <ul v-if="obj.hl.ol">
              <div> 盘口id: {{ obj.hl.hid }} - {{ obj.hl.hv }}</div>
              <li v-for="obj_ol in obj.hl.ol" :key="obj_ol.oid" class="ty-li" @click="set_bet_oid(item,obj,obj.hl,obj_ol)">
               投注项： {{ obj_ol.oid }} - {{ obj_ol.onb }} - 1 - {{ obj_ol.ov }} - {{ compute_value_by_cur_odd_type(obj_ol.ov,'','',item.csid) }}
              </li>
            </ul>
          </div>
        </div>
        <div>副盘口
          <div v-for="obj in page.hpsAdd" :key="obj.chpid">
            <div>玩法ID：  {{ obj.hpid }}  - {{ play_id[obj.hpid] }}</div>
              <template v-if="obj.hl.length">
                  <ul v-for="obj_hl in obj.hl" :key="obj_hl.hid">
                    <div> 盘口id: {{ obj_hl.hid }} - {{ obj_hl.hv }} </div>
                    <li v-for="obj_ol in obj_hl.ol" :key="obj_ol.oid" class="ty-li" @click="set_bet_oid(item,obj,obj_hl,obj_ol)">
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
import { UserCtr,compute_value_by_cur_odd_type } from "src/core/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"
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

    const set_bet_oid = (item,obj_hp,obj_hl,obj_ol) => {
      // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事")
      let matchType = 2 
      if( [1,2].includes(Number(item.ms)) ){
        matchType = 2
      }
      const bet_obj = {
        sportId: item.csid, // 球种id
        matchId: item.mid,  // 赛事id
        tournamentId: item.tid,  // 联赛id
        scoreBenchmark: item.msc[0],  //比分
        marketId: obj_hl.hid, //盘口ID
        marketValue: obj_hl.hv,
        playOptionsId: obj_ol.oid, //投注项id
        marketTypeFinally: 'EU',  // 欧洲版默认是欧洲盘 HK代表香港盘
        odds: obj_ol.ov,  //十万位赔率
        oddFinally: compute_value_by_cur_odd_type(obj_ol.ov,'','',item.csid), //最终赔率
        sportName: item.csna, //球种名称
        matchType,  //赛事类型
        matchName: item.tn, //赛事名称
        playOptionName: obj_ol.on, // 投注项名称
        playOptions: obj_ol.on,   // 投注项
        tournamentLevel: item.tlev, //联赛级别
        playId: obj_hp.hpid, //玩法ID
        playName: play_id.value[obj_hp.hpid], //玩法名称
        dataSource: item.cds, //数据源
        home: item.mhn, //主队名称
        away: item.man, //客队名称
        ot: obj_ol.ot, //投注項类型
        placeNum: null, //盘口坑位
        // 以下为 投注显示或者逻辑计算用到的参数
        bet_type: 'common_bet', // 投注类型
        tid_name: item.tnjc,  // 联赛名称
      }
      BetData.set_bet_read_write_refer_obj(bet_obj)
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