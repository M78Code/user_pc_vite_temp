/*
 * @Author: hanmar
 * @Date: 2023-09-15 17:13:55
 * @Description: websocket 组件(包括测试功能)
 */

<template>
  <div v-if="wslog.ws_run">
    <div class="time-show">
      <span>{{ CURRENT_ENV_MAP[CURRENT_ENV] }}:{{ log_time }}</span>
    </div>
    <div class="time-show-copy" @click="copy_token()"> 
      <span>☺</span>
    </div>
  </div>
</template>
<script setup>
import { copyToClipboard } from "quasar";
import { wslog } from "src/core/log/";
import WsMan from './ws-man.js';
import UserCtr from "src/core/user-config/user-ctr.js";
import MatchDataBase from "src/core/data-warehouse/match-ctr/match-ctr.js";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import { set_market_id_to_ws } from "src/core/bet/class/bet-box-submit.js"
import BUILDIN_CONFIG from "app/job/output/env/index.js";;

const { PROJECT_NAME,CURRENT_ENV } = BUILDIN_CONFIG ;

// 页面 失去 焦点后  WS 断开时间
const DOCUMENT_HIDDEN_WS_CLOSE_TIME = 5 * 60 * 1000;
// 当前环境
import {
  ref,
  onMounted,
  computed,
  defineAsyncComponent,
  reactive,
  nextTick,
  onBeforeUnmount,
  watch,
} from "vue";
// 环境对应关系
const CURRENT_ENV_MAP={ 
  'local_dev':'开发',
  'local_test':'测试',
  'idc_pre':'预发布',
  'idc_sandbox':'试玩',
  'idc_lspre':'隔离预发布',
  'idc_online':'生产',
  'idc_ylcs':'微型测试',
  'local_dev':'开发',
  'local_dev':'开发',
  'local_dev':'开发',
}
// 延时器使用
let timer = 0;
let timer2 = 0;
let timer_ws_msg = 0;
let timer_text = 0;
let log_time_timer = 0;
// 最后次ws断开时间
let lase_socket_close_time = new Date().getTime();
// ws状态变化
const ws_status = ref(0)
// ws开启页面提示时间
const log_time = ref(0)
// 测试使用到的仓库对象
// const match_data_base1 = reactive(new MatchDataBase({name_code:'1111'}));
// 测试使用到的方法
function test(){
  let a=function(){
    return {"code":"0000000","data":{"data":[{"mcid":"","tnjc":"FIFA 2023 - 土超 (8分钟)","cos":false,"hpsBold":[],"csna":"足球","tid":"29506","mst":"14","srid":"4931375953932675977","mcg":1,"cosCorner":false,"cosPunish":false,"cosOutright":false,"mdsc":null,"mc":11,"hpsOvertime":[],"mf":false,"mgt":"1692375000000","maid":"152454","hpsPns":[{"hids":0,"hpid":"1","hpon":7,"hpn":"全场独赢","mid":"2675977","hmm":0,"hshow":"Yes","hpnb":"全场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"4","hpon":4,"hpn":"全场让球","mid":"2675977","hmm":1,"hshow":"Yes","hpnb":"全场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"0.75"},{"hids":0,"hpid":"2","hpon":3,"hpn":"全场大小","mid":"2675977","hmm":1,"hshow":"Yes","hpnb":"全场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":null},{"hids":0,"hpid":"17","hpon":8,"hpn":"上半场独赢","mid":"2675977","hmm":0,"hshow":"Yes","hpnb":"上半场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"19","hpon":6,"hpn":"上半场让球","mid":"2675977","hmm":1,"hshow":"Yes","hpnb":"上半场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"1"},{"hids":0,"hpid":"18","hpon":5,"hpn":"上半场大小","mid":"2675977","hmm":1,"hshow":"Yes","hpnb":"上半场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":"1"}],"mct":0,"tlev":16,"mhlut":"","mo":0,"mp":0,"csid":"1","ms":1,"cmec":"match_status","cos5Minutes":false,"mle":71,"lvs":-1,"malu":["group1/M00/19/3D/CgURt2SG-bqAY0TWAAARTD504cY713.png"],"hpsData":[{"hps":[{"chpid":"1","hpid":"1","hl":{"hid":"149919184365455497","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"148443311014782458","os":1,"otd":47,"ot":"1","ov":470000,"onb":"主胜","on":"代米尔体育","onbl":"","cds":"BE","ots":"T1"},{"oid":"143274614311153176","os":1,"otd":49,"ot":"2","ov":166000,"onb":"客胜","on":"加拉塔萨雷","onbl":"","cds":"BE","ots":"T2"},{"oid":"144052386230459543","os":1,"otd":48,"ot":"X","ov":340000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"4","hpid":"4","hl":{"hid":"148075570158540613","hs":0,"hv":"0.5/1","hmt":0,"hn":1,"ol":[{"oid":"143104641340024823","os":1,"otd":3,"ot":"1","ov":183000,"onb":"+0.5/1","on":"+0.5/1","onbl":"","cds":"BE","ots":"T1"},{"oid":"145000154455984052","os":1,"otd":4,"ot":"2","ov":181000,"onb":"-0.5/1","on":"-0.5/1","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"2","hpid":"2","hl":{"hid":"141535314503421933","hs":0,"hv":"3","hmt":0,"hn":1,"ol":[{"oid":"145091585253123373","os":1,"otd":2,"ot":"Over","ov":185000,"onb":"3","on":"大 3","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"145712599134918845","os":1,"otd":1,"ot":"Under","ov":179000,"onb":"3","on":"小 3","onbl":"小 ","cds":"BE","ots":"T2"}]}},{"chpid":"17","hpid":"17","hl":{"hid":"141315441514092641","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"142705543441150036","os":1,"otd":101,"ot":"1","ov":450000,"onb":"主胜","on":"代米尔体育","onbl":"","cds":"BE","ots":"T1"},{"oid":"145572049747413025","os":1,"otd":103,"ot":"2","ov":203000,"onb":"客胜","on":"加拉塔萨雷","onbl":"","cds":"BE","ots":"T2"},{"oid":"141539530202217100","os":1,"otd":102,"ot":"X","ov":255000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"19","hpid":"19","hl":{"hid":"143285122423241435","hs":0,"hv":"0/0.5","hmt":0,"hn":1,"ol":[{"oid":"140826445322411492","os":1,"otd":146,"ot":"1","ov":199000,"onb":"+0/0.5","on":"+0/0.5","onbl":"","cds":"BE","ots":"T1"},{"oid":"146362155350552524","os":1,"otd":147,"ot":"2","ov":165000,"onb":"-0/0.5","on":"-0/0.5","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"18","hpid":"18","hl":{"hid":"144457284406373911","hs":0,"hv":"1.5","hmt":0,"hn":1,"ol":[{"oid":"142480547981053850","os":1,"otd":96,"ot":"Over","ov":190000,"onb":"1.5","on":"大 1.5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"141154293325684053","os":1,"otd":95,"ot":"Under","ov":174000,"onb":"1.5","on":"小 1.5","onbl":"小 ","cds":"BE","ots":"T2"}]}}],"hpsAdd":[{"chpid":"1","hpid":"1","hlnm":0,"hl":[]},{"chpid":"4","hpid":"4","hlnm":0,"hl":[]},{"chpid":"2","hpid":"2","hlnm":0,"hl":[]},{"chpid":"17","hpid":"17","hlnm":0,"hl":[]},{"chpid":"19","hpid":"19","hlnm":0,"hl":[]},{"chpid":"18","hpid":"18","hlnm":0,"hl":[]}]}],"hps15Minutes":[],"lurl":"group1/M00/19/48/CgURt2SKnXSAKzpUAAAL8K58qq4986.png","mprmc":"BTS","cosOvertime":false,"mhn":"代米尔体育","betAmount":"0.00","cds":"BE","frmhn":["D"],"operationTournamentSort":200,"cos15Minutes":false,"mhs":0,"mlet":"null:00","hps5Minutes":[],"cosPenalty":false,"hpsCorner":[],"mhid":"152491","hpsPunish":[],"mrmc":"","mid":"2675977","mess":1,"cosBold":false,"lss":null,"mmp":"6","mststi":"0","operationHotSortTop":0,"mms":2,"mbmty":2,"regionIdSort":9,"mhlu":["group1/M00/19/3D/CgURtmSHFymASm93AAAVRaGPIgs741.png"],"seid":"","mstst":"0","malut":"","man":"加拉塔萨雷","frman":["J"],"mat":"","mng":1,"mststr":"14","mvs":-1,"hpsPenalty":[],"mststs":0,"mearlys":0,"tf":false,"th":0,"cosPromotion":false,"mfo":null,"mft":0,"tn":"FIFA 2023 - 土耳其超级联赛 (8分钟)","msc":["S1|0:0","S2|0:0","S5|0:0","S555|0:0","S15|0:0","S12|0:0","S12001|0:0","S11|0:0","S11001|0:0","S1101|0:0","S13|0:0","S14|0:0","S10101|0:0","S10102|0:0","S10103|0:0","S1001|0:0","S1002|0:0","S1003|0:0","S1004|0:0","S1005|0:0","S1006|0:0","S5001|0:0","S5002|0:0","S5003|0:0","S5004|0:0","S5005|0:0","S5006|0:0","S104|0:0","S8|0:0","S105|0:0","S18|0:0","S17|0:0","S6|0:0","S10|0:0"],"hpsPromotion":[]},{"mcid":"","tnjc":"FIFA 2023 - 土超 (8分钟)","cos":false,"hpsBold":[],"csna":"足球","tid":"29506","mst":"46","srid":"4780221632812675975","mcg":1,"cosCorner":false,"cosPunish":false,"cosOutright":false,"mdsc":null,"mc":11,"hpsOvertime":[],"mf":false,"mgt":"1692375000000","maid":"152448","hpsPns":[{"hids":0,"hpid":"1","hpon":7,"hpn":"全场独赢","mid":"2675975","hmm":0,"hshow":"Yes","hpnb":"全场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"4","hpon":4,"hpn":"全场让球","mid":"2675975","hmm":1,"hshow":"Yes","hpnb":"全场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"0.75"},{"hids":0,"hpid":"2","hpon":3,"hpn":"全场大小","mid":"2675975","hmm":1,"hshow":"Yes","hpnb":"全场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":null},{"hids":0,"hpid":"17","hpon":8,"hpn":"上半场独赢","mid":"2675975","hmm":0,"hshow":"Yes","hpnb":"上半场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"19","hpon":6,"hpn":"上半场让球","mid":"2675975","hmm":1,"hshow":"Yes","hpnb":"上半场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"1"},{"hids":0,"hpid":"18","hpon":5,"hpn":"上半场大小","mid":"2675975","hmm":1,"hshow":"Yes","hpnb":"上半场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":"1"}],"mct":0,"tlev":16,"mhlut":"","mo":0,"mp":0,"csid":"1","ms":1,"cmec":"match_status","cos5Minutes":false,"mle":71,"lvs":-1,"malu":["group1/M00/19/48/CgURtmSKng2ANN3qAAAUVxfGEY4204.png"],"hpsData":[{"hps":[{"chpid":"1","hpid":"1","hl":{"hid":"145522052555120271","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"145777058353488561","os":1,"otd":47,"ot":"1","ov":285000,"onb":"主胜","on":"费内巴切","onbl":"","cds":"BE","ots":"T1"},{"oid":"145220146072007220","os":1,"otd":49,"ot":"2","ov":182000,"onb":"客胜","on":"贝西克塔斯","onbl":"","cds":"BE","ots":"T2"},{"oid":"144979255312507431","os":1,"otd":48,"ot":"X","ov":480000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"4","hpid":"4","hl":{"hid":"142956276404542041","hs":0,"hv":"0.5/1","hmt":0,"hn":1,"ol":[{"oid":"143397005152435476","os":1,"otd":3,"ot":"1","ov":178000,"onb":"+0.5/1","on":"+0.5/1","onbl":"","cds":"BE","ots":"T1"},{"oid":"140432076686542453","os":1,"otd":4,"ot":"2","ov":213000,"onb":"-0.5/1","on":"-0.5/1","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"2","hpid":"2","hl":{"hid":"144181215529443373","hs":0,"hv":"4/4.5","hmt":0,"hn":1,"ol":[{"oid":"146149656010933232","os":1,"otd":2,"ot":"Over","ov":187000,"onb":"4/4.5","on":"大 4/4.5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"142765043378160545","os":1,"otd":1,"ot":"Under","ov":203000,"onb":"4/4.5","on":"小 4/4.5","onbl":"小 ","cds":"BE","ots":"T2"}]}},{"chpid":"17","hpid":"17","hl":{"hid":"140303324182544145","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"140385213739114092","os":1,"otd":101,"ot":"1","ov":305000,"onb":"主胜","on":"费内巴切","onbl":"","cds":"BE","ots":"T1"},{"oid":"144901280313568427","os":1,"otd":103,"ot":"2","ov":217000,"onb":"客胜","on":"贝西克塔斯","onbl":"","cds":"BE","ots":"T2"},{"oid":"142703051111952532","os":1,"otd":102,"ot":"X","ov":310000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"19","hpid":"19","hl":{"hid":"149705325480504073","hs":0,"hv":"0/0.5","hmt":0,"hn":1,"ol":[{"oid":"148134404022120315","os":1,"otd":146,"ot":"1","ov":190000,"onb":"+0/0.5","on":"+0/0.5","onbl":"","cds":"BE","ots":"T1"},{"oid":"144593655133296117","os":1,"otd":147,"ot":"2","ov":200000,"onb":"-0/0.5","on":"-0/0.5","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"18","hpid":"18","hl":{"hid":"146530061183079244","hs":0,"hv":"2","hmt":0,"hn":1,"ol":[{"oid":"149405245288411222","os":1,"otd":96,"ot":"Over","ov":196000,"onb":"2","on":"大 2","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"146535852091901517","os":1,"otd":95,"ot":"Under","ov":194000,"onb":"2","on":"小 2","onbl":"小 ","cds":"BE","ots":"T2"}]}}],"hpsAdd":[{"chpid":"1","hpid":"1","hlnm":0,"hl":[]},{"chpid":"4","hpid":"4","hlnm":0,"hl":[]},{"chpid":"2","hpid":"2","hlnm":0,"hl":[]},{"chpid":"17","hpid":"17","hlnm":0,"hl":[]},{"chpid":"19","hpid":"19","hlnm":0,"hl":[]},{"chpid":"18","hpid":"18","hlnm":0,"hl":[]}]}],"hps15Minutes":[],"lurl":"group1/M00/19/48/CgURt2SKnXSAKzpUAAAL8K58qq4986.png","mprmc":"BTS","cosOvertime":false,"mhn":"费内巴切","betAmount":"0.00","cds":"BE","frmhn":["F"],"operationTournamentSort":200,"cos15Minutes":false,"mhs":0,"mlet":"null:00","hps5Minutes":[],"cosPenalty":false,"hpsCorner":[],"mhid":"152453","hpsPunish":[],"mrmc":"","mid":"2675975","mess":1,"cosBold":false,"lss":null,"mmp":"6","mststi":"0","operationHotSortTop":0,"mms":2,"mbmty":2,"regionIdSort":9,"mhlu":["group1/M00/19/3C/CgURtmSG-VmAN6AxAAANot9ps14101.png"],"seid":"","mstst":"0","malut":"","man":"贝西克塔斯","frman":["B"],"mat":"","mng":1,"mststr":"46","mvs":-1,"hpsPenalty":[],"mststs":0,"mearlys":0,"tf":false,"th":0,"cosPromotion":false,"mfo":null,"mft":0,"tn":"FIFA 2023 - 土耳其超级联赛 (8分钟)","msc":["S1|0:0","S2|0:0","S5|0:0","S555|0:0","S15|0:0","S12|0:0","S12001|0:0","S11|0:0","S11001|0:0","S1101|0:0","S13|0:0","S14|0:0","S10101|0:0","S10102|0:0","S10103|0:0","S1001|0:0","S1002|0:0","S1003|0:0","S1004|0:0","S1005|0:0","S1006|0:0","S5001|0:0","S5002|0:0","S5003|0:0","S5004|0:0","S5005|0:0","S5006|0:0","S104|0:0","S8|0:0","S105|0:0","S18|0:0","S17|0:0","S6|0:0","S10|0:0"],"hpsPromotion":[]},{"mcid":"","tnjc":"FIFA 2023 - Volta 国际联赛 (6分钟)","cos":false,"hpsBold":[],"csna":"足球","tid":"31022","mst":"25","srid":"4745055429062675971","mcg":1,"cosCorner":false,"cosPunish":false,"cosOutright":false,"mdsc":null,"mc":10,"hpsOvertime":[],"mf":false,"mgt":"1692375000000","maid":"152457","hpsPns":[{"hids":0,"hpid":"1","hpon":7,"hpn":"全场独赢","mid":"2675971","hmm":0,"hshow":"Yes","hpnb":"全场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"4","hpon":4,"hpn":"全场让球","mid":"2675971","hmm":1,"hshow":"Yes","hpnb":"全场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"0.75"},{"hids":0,"hpid":"2","hpon":3,"hpn":"全场大小","mid":"2675971","hmm":1,"hshow":"Yes","hpnb":"全场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":null},{"hids":0,"hpid":"17","hpon":8,"hpn":"上半场独赢","mid":"2675971","hmm":0,"hshow":"Yes","hpnb":"上半场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"19","hpon":6,"hpn":"上半场让球","mid":"2675971","hmm":1,"hshow":"Yes","hpnb":"上半场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"1"},{"hids":0,"hpid":"18","hpon":5,"hpn":"上半场大小","mid":"2675971","hmm":1,"hshow":"Yes","hpnb":"上半场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":"1"}],"mct":0,"tlev":16,"mhlut":"","mo":0,"mp":0,"csid":"1","ms":1,"cmec":"match_status","cos5Minutes":false,"mle":55,"lvs":-1,"malu":["group1/M00/19/3D/CgURt2SG-niABZ4qAAANULQDvV4336.png"],"hpsData":[{"hps":[{"chpid":"1","hpid":"1","hl":{"hid":"142208480815092153","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"141185335460889118","os":1,"otd":47,"ot":"1","ov":305000,"onb":"主胜","on":"波兰","onbl":"","cds":"BE","ots":"T1"},{"oid":"143807374991231663","os":1,"otd":49,"ot":"2","ov":180000,"onb":"客胜","on":"美国","onbl":"","cds":"BE","ots":"T2"},{"oid":"146437283625223247","os":1,"otd":48,"ot":"X","ov":450000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"4","hpid":"4","hl":{"hid":"142012274274905854","hs":0,"hv":"0.5/1","hmt":0,"hn":1,"ol":[{"oid":"148431070064515703","os":1,"otd":3,"ot":"1","ov":165000,"onb":"+0.5/1","on":"+0.5/1","onbl":"","cds":"BE","ots":"T1"},{"oid":"144482790328150460","os":1,"otd":4,"ot":"2","ov":195000,"onb":"-0.5/1","on":"-0.5/1","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"2","hpid":"2","hl":{"hid":"145448172530856032","hs":0,"hv":"5","hmt":0,"hn":1,"ol":[{"oid":"140001524005347193","os":1,"otd":2,"ot":"Over","ov":186000,"onb":"5","on":"大 5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"143552078141584853","os":1,"otd":1,"ot":"Under","ov":174000,"onb":"5","on":"小 5","onbl":"小 ","cds":"BE","ots":"T2"}]}},{"chpid":"17","hpid":"17","hl":{"hid":"142563990530125551","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"147244118642481516","os":1,"otd":101,"ot":"1","ov":520000,"onb":"主胜","on":"波兰","onbl":"","cds":"BE","ots":"T1"},{"oid":"149358439849774184","os":1,"otd":103,"ot":"2","ov":155000,"onb":"客胜","on":"美国","onbl":"","cds":"BE","ots":"T2"},{"oid":"142743911410825356","os":1,"otd":102,"ot":"X","ov":370000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"19","hpid":"19","hl":{"hid":"146235218033712225","hs":0,"hv":"0.5/1","hmt":0,"hn":1,"ol":[{"oid":"144422404180906078","os":1,"otd":146,"ot":"1","ov":190000,"onb":"+0.5/1","on":"+0.5/1","onbl":"","cds":"BE","ots":"T1"},{"oid":"145509776172940543","os":1,"otd":147,"ot":"2","ov":170000,"onb":"-0.5/1","on":"-0.5/1","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"18","hpid":"18","hl":{"hid":"143863824843026426","hs":0,"hv":"2.5/3","hmt":0,"hn":1,"ol":[{"oid":"149570207759264575","os":1,"otd":96,"ot":"Over","ov":178000,"onb":"2.5/3","on":"大 2.5/3","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"143505668248464217","os":1,"otd":95,"ot":"Under","ov":182000,"onb":"2.5/3","on":"小 2.5/3","onbl":"小 ","cds":"BE","ots":"T2"}]}}],"hpsAdd":[{"chpid":"1","hpid":"1","hlnm":0,"hl":[]},{"chpid":"4","hpid":"4","hlnm":0,"hl":[]},{"chpid":"2","hpid":"2","hlnm":0,"hl":[]},{"chpid":"17","hpid":"17","hlnm":0,"hl":[]},{"chpid":"19","hpid":"19","hlnm":0,"hl":[]},{"chpid":"18","hpid":"18","hlnm":0,"hl":[]}]}],"hps15Minutes":[],"lurl":"group1/M00/19/DA/CgURtWTdWDSAYxBLAAAOBp8zhng167.png","mprmc":"BTS","cosOvertime":false,"mhn":"波兰","betAmount":"0.00","cds":"BE","frmhn":["B"],"operationTournamentSort":260,"cos15Minutes":false,"mhs":0,"mlet":"06:00","hps5Minutes":[],"cosPenalty":false,"hpsCorner":[],"mhid":"152463","hpsPunish":[],"mrmc":"","mid":"2675971","mess":1,"cosBold":false,"lss":null,"mmp":"6","mststi":"0","operationHotSortTop":0,"mms":2,"mbmty":2,"regionIdSort":9,"mhlu":["group1/M00/19/3C/CgURtmSG_DuAMiLsAAAHzPT1slU693.png"],"seid":"","mstst":"0","malut":"","man":"美国","frman":["M"],"mat":"","mng":1,"mststr":"25","mvs":-1,"hpsPenalty":[],"mststs":0,"mearlys":0,"tf":false,"th":0,"cosPromotion":false,"mfo":null,"mft":0,"tn":"FIFA 2023 - Volta 国际联赛 (6分钟)","msc":["S1|0:0","S2|0:0","S5|0:0","S555|0:0","S15|0:0","S12|0:0","S12001|0:0","S11|0:0","S11001|0:0","S1101|0:0","S13|0:0","S14|0:0","S10101|0:0","S10102|0:0","S10103|0:0","S1001|0:0","S1002|0:0","S1003|0:0","S1004|0:0","S1005|0:0","S1006|0:0","S5001|0:0","S5002|0:0","S5003|0:0","S5004|0:0","S5005|0:0","S5006|0:0","S104|0:0","S8|0:0","S105|0:0","S18|0:0","S17|0:0","S6|0:0","S10|0:0"],"hpsPromotion":[]},{"mcid":"","tnjc":"FIFA 2023 - Volta 国际联赛 (6分钟)","cos":false,"hpsBold":[],"csna":"足球","tid":"31022","mst":"50","srid":"4626112970442675973","mcg":1,"cosCorner":false,"cosPunish":false,"cosOutright":false,"mdsc":null,"mc":10,"hpsOvertime":[],"mf":false,"mgt":"1692375000000","maid":"152458","hpsPns":[{"hids":0,"hpid":"1","hpon":7,"hpn":"全场独赢","mid":"2675973","hmm":0,"hshow":"Yes","hpnb":"全场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"4","hpon":4,"hpn":"全场让球","mid":"2675973","hmm":1,"hshow":"Yes","hpnb":"全场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"-0.75"},{"hids":0,"hpid":"2","hpon":3,"hpn":"全场大小","mid":"2675973","hmm":1,"hshow":"Yes","hpnb":"全场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":null},{"hids":0,"hpid":"17","hpon":8,"hpn":"上半场独赢","mid":"2675973","hmm":0,"hshow":"Yes","hpnb":"上半场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"19","hpon":6,"hpn":"上半场让球","mid":"2675973","hmm":1,"hshow":"Yes","hpnb":"上半场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"1"},{"hids":0,"hpid":"18","hpon":5,"hpn":"上半场大小","mid":"2675973","hmm":1,"hshow":"Yes","hpnb":"上半场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":"1"}],"mct":0,"tlev":16,"mhlut":"","mo":0,"mp":0,"csid":"1","ms":1,"cmec":"goal","cos5Minutes":false,"mle":55,"lvs":-1,"malu":["group1/M00/19/3C/CgURtmSG-smALSlNAAAISdLZyH8252.png"],"hpsData":[{"hps":[{"chpid":"1","hpid":"1","hl":{"hid":"146160365915239101","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"140163334046745937","os":1,"otd":47,"ot":"1","ov":162000,"onb":"主胜","on":"英格兰","onbl":"","cds":"BE","ots":"T1"},{"oid":"141134262511219073","os":1,"otd":49,"ot":"2","ov":380000,"onb":"客胜","on":"乌克兰","onbl":"","cds":"BE","ots":"T2"},{"oid":"149602041411215190","os":1,"otd":48,"ot":"X","ov":440000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"4","hpid":"4","hl":{"hid":"148950740629593852","hs":0,"hv":"0/0.5","hmt":0,"hn":1,"ol":[{"oid":"140261456740403954","os":1,"otd":3,"ot":"1","ov":171000,"onb":"+0/0.5","on":"+0/0.5","onbl":"","cds":"BE","ots":"T1"},{"oid":"143995400674853536","os":1,"otd":4,"ot":"2","ov":189000,"onb":"-0/0.5","on":"-0/0.5","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"2","hpid":"2","hl":{"hid":"141432933490163468","hs":0,"hv":"4.5/5","hmt":0,"hn":1,"ol":[{"oid":"143064933341237298","os":1,"otd":2,"ot":"Over","ov":179000,"onb":"4.5/5","on":"大 4.5/5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"142794183422533464","os":1,"otd":1,"ot":"Under","ov":181000,"onb":"4.5/5","on":"小 4.5/5","onbl":"小 ","cds":"BE","ots":"T2"}]}},{"chpid":"17","hpid":"17","hl":{"hid":"142145520385395513","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"143355931453095564","os":1,"otd":101,"ot":"1","ov":142000,"onb":"主胜","on":"英格兰","onbl":"","cds":"BE","ots":"T1"},{"oid":"141231462715761772","os":1,"otd":103,"ot":"2","ov":680000,"onb":"客胜","on":"乌克兰","onbl":"","cds":"BE","ots":"T2"},{"oid":"144250942552324504","os":1,"otd":102,"ot":"X","ov":380000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"19","hpid":"19","hl":{"hid":"142146513351007050","hs":0,"hv":"0","hmt":0,"hn":1,"ol":[{"oid":"149512142764990419","os":1,"otd":146,"ot":"1","ov":190000,"onb":"0","on":"0","onbl":"","cds":"BE","ots":"T1"},{"oid":"145381330724565360","os":1,"otd":147,"ot":"2","ov":170000,"onb":"0","on":"0","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"18","hpid":"18","hl":{"hid":"146430535813959011","hs":0,"hv":"2.5","hmt":0,"hn":1,"ol":[{"oid":"143834405132490512","os":1,"otd":96,"ot":"Over","ov":177000,"onb":"2.5","on":"大 2.5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"145053703410325335","os":1,"otd":95,"ot":"Under","ov":183000,"onb":"2.5","on":"小 2.5","onbl":"小 ","cds":"BE","ots":"T2"}]}}],"hpsAdd":[{"chpid":"1","hpid":"1","hlnm":0,"hl":[]},{"chpid":"4","hpid":"4","hlnm":0,"hl":[]},{"chpid":"2","hpid":"2","hlnm":0,"hl":[]},{"chpid":"17","hpid":"17","hlnm":0,"hl":[]},{"chpid":"19","hpid":"19","hlnm":0,"hl":[]},{"chpid":"18","hpid":"18","hlnm":0,"hl":[]}]}],"hps15Minutes":[],"lurl":"group1/M00/19/DA/CgURtWTdWDSAYxBLAAAOBp8zhng167.png","mprmc":"BTS","cosOvertime":false,"mhn":"英格兰","betAmount":"0.00","cds":"BE","frmhn":["Y"],"operationTournamentSort":260,"cos15Minutes":false,"mhs":0,"mlet":"06:00","hps5Minutes":[],"cosPenalty":false,"hpsCorner":[],"mhid":"156874","hpsPunish":[],"mrmc":"","mid":"2675973","mess":1,"cosBold":false,"lss":null,"mmp":"6","mststi":"0","operationHotSortTop":0,"mms":2,"mbmty":2,"regionIdSort":9,"mhlu":["group1/M00/19/86/CgURtWSlLOSAUkI8AAAF-fDtog0783.png"],"seid":"","mstst":"0","malut":"","man":"乌克兰","frman":["W"],"mat":"","mng":1,"mststr":"50","mvs":-1,"hpsPenalty":[],"mststs":0,"mearlys":0,"tf":false,"th":0,"cosPromotion":false,"mfo":null,"mft":0,"tn":"FIFA 2023 - Volta 国际联赛 (6分钟)","msc":["S1|1:0","S2|1:0","S5|0:0","S555|0:0","S15|0:0","S12|0:0","S12001|0:0","S11|0:0","S11001|0:0","S1101|4:1","S13|0:0","S14|0:0","S10101|0:0","S10102|0:0","S10103|0:0","S1001|1:0","S1002|0:0","S1003|0:0","S1004|0:0","S1005|0:0","S1006|0:0","S5001|0:0","S5002|0:0","S5003|0:0","S5004|0:0","S5005|0:0","S5006|0:0","S104|0:0","S8|0:0","S105|0:0","S18|4:1","S17|0:0","S6|0:0","S10|0:0","S50011|0:0","S10011|1:0"],"hpsPromotion":[]}],"pagedata":{"liveCto":0,"cto":"0"}},"msg":"成功","ts":1692375059626}
  }
  let b=a();
  // this.match_data_base1= new MatchDataBase({name_code:'1111'});
  clearTimeout(timer_text);
  timer_text=setTimeout(() => {
    // console.error('match_data_base1=',match_data_base1);
    // match_data_base1.set_list(b.data.data);
    // match_data_base1.set_quick_query_list(b.data.data);

    // match_data_base1.set_list_from_match_details(b.data.data[0]);
    

  }, 6000);
}
/**
 * @Description 设置时间 
 * @param {undefined} undefined
*/
function set_time_str(){
  try {
    log_time.value =  (new Date()).format_log("yyyy-MM-dd hh:mm:ss.S");
  } catch (error) {
    console.error(error);
    log_time.value = '';
  }
}
// copy缓存的参数
function copy_token(is_key_down) {
  copyToClipboard(SEARCH_PARAMS.init_param.toString());
}
/**
 * @description: visibilitychange事件监听
 */
function event_listener_visibilitychange(){
  get_vue_hidden_run();
}
/**
 * @description: 监听页面是否转入休眠状态
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
function get_vue_hidden_run() {
  // console.log(`---------------------进入了get_vue_hidden_run方法-------------------`);
  if (wslog && wslog.send_msg) {
    wslog.send_msg('WS---VUE:', {msg:'get_vue_hidden_run ',view:document.visibilityState})
  }
  if (document.visibilityState == 'hidden') {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (document.visibilityState == 'hidden') {
        let data =  {ws_status:0, ws_status_old:ws_status || 0};
        // 发送ws连接状态(0-断开,1-连接,2-断网续连状态)
        window.postMessage({event: 'WS', cmd:`WS_STATUS_CHANGE_EVENT`, data},'*');
        // console.log('---未在当前网站--关闭WS---',_.get(window.ws,'ws.url'));
        // WsMan.ws && window.ws.retInitData(true);
        if (wslog && wslog.send_msg) {
          wslog.send_msg('WS---VUE:', {msg:'get_vue_hidden_run send!',data, view:document.visibilityState})
        }
      }
    }, DOCUMENT_HIDDEN_WS_CLOSE_TIME);
  } else {
    // console.log(`---进入当前网站--开启WS---222222222222`)
    // if (!this./) {
      let data =  {ws_status:2, ws_status_old:ws_status || 0};
      // 发送ws连接状态(0-断开,1-连接,2-断网续连状态)
      window.postMessage({event: 'WS', cmd:`WS_STATUS_CHANGE_EVENT`, data},'*');
      if (wslog && wslog.send_msg) {
        wslog.send_msg('WS---VUE:', {msg:'get_vue_hidden_run send !!',data, view:document.visibilityState})
      }
      // console.log('---进入当前网站--开启WS---',_.get(window.ws,'ws.url'));
        WsMan.ws && WsMan.ws.connect('vue_hidden_to_show');
    // }
  }
}
/**
 * @description: 监控socket状态是否变化,如果断链以后启用重新连接
 * @param {Boolean} status
 * @return {undefined} undefined
 */
function socket_status(status, old_status) {
  //缓存变量
  ws_status.value = status;
  if (status) {
    if ((new Date().getTime() - lase_socket_close_time) > (1 * 1000)) {
      // this.set_socket_status(2);
      console.log('--------WS---断网太久重新刷新数据----------------');
    } else {
      // this.set_socket_status(1);
    }
    // 发送刷新菜单数量命令
    useMittEmit(MITT_TYPES.EMIT_MENU_REFRESH_COUNT_CMD);
  } else {
    lase_socket_close_time = new Date().getTime();
  }
  // 监听sockect连接状态
  if (status) {
    //当sockect重新连接时自动发送消息
    // 发送注单信息命令
    clearTimeout(timer);
    timer = setTimeout(() => {
      scmd_all();
    }, 600);
  }
}
/**
 * @Description:接收ws内部通信事件
 * @param: event 事件消息对象
 * @return:
 */
function rev_event_msg(event) {
  if(event && event.data && event.data.event == 'WS'){
    switch (event.data.cmd) {
      case 'WS_STATUS_CHANGE_EVENT': // ws链接状态变化 (0-断开,1-连接,2-断网续连状态)
        let ws_status = lodash.get(event.data.data,'ws_status');
        let ws_status_old = lodash.get(event.data.data,'ws_status_old');
        socket_status(ws_status, ws_status_old);
        // websocket链接状态变化
        useMittEmit(MITT_TYPES.EMIT_WS_STATUS_CHANGE_EVENT,{ws_status, ws_status_old});
        break;
      case 'WS_RESEND_SCMD_EVENT': // 重新定义所以赛事事件
        scmd_all();
        break;
      default:
        break;
    }
  } 
}
/**
 * @description: 赛事订阅(C2)-盘口/投注项(C106)
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
function scmd_c2() {
  // 投注项订阅
  set_market_id_to_ws();
}
/**
 * @description: 订单订阅(C3)-未结算订单数(C202)
 * @return {undefined} undefined
 */
function scmd_c3() {
  let obj = {};
  obj.cuid = UserCtr.get_uid();
  WsMan.skt_send_order(obj);
}
/**
 *  C4推送数据
 * `copen` 1:打开 2:关闭
 * @description: 辅助订阅C4-滚球新赛事通知(C302)
 * @return {undefined} undefined
 */
function scmd_c4(type=1) {
  let obj = { copen: 1 };
  WsMan.skt_send_initiative_push(obj);
}
/**
 * @description: 菜单订阅C5-菜单栏目统计(C301)
 * @return {undefined} undefined
 * `cdt` 设备类型 0:取消订阅 1:移动端188（欧洲版） 3:移动端panda（亚洲版） 4:PC端（专业版/标准版） 5:PC端--弃用（新手版） 6:新手版  7:H5 优化版
 * `说明:` 订阅后会推送C301,C3011,C501
 */
function scmd_c5() {
  let obj = {};
  let cdt = '4'
  if(PROJECT_NAME.indexOf('h5') > -1){
    cdt = '7'
  }
  obj.cdt = cdt
  WsMan.skt_send_menu(obj);
}
/**
 * @description: 全局开关
 * @return {undefined} undefined
 */
function scmd_c7() {
  WsMan.skt_send_switch();
}

/**
 * @description: 重新订阅所有公共订阅命令
 * @return {undefined} undefined
 */
 function scmd_all() {
  if(WsMan.ws && WsMan.ws.ws&& WsMan.ws.ws.readyState == 1){
    scmd_c3();
    scmd_c4();
    scmd_c5();
    scmd_c7();
    scmd_c2();
  } else {
    clearTimeout(timer_ws_msg);
    timer_ws_msg = setTimeout(() => {
      scmd_all();
    }, 1000);
  }
}


/**
 * @description: 菜单订阅C51菜单栏目统计(C501)
 * @param {Object} obj 推送的消息体
 * @return {undefined} undefined
 */
function scmd_c51(obj) {
  WsMan.skt_send_menu2(obj);
}
/**
 * @description: 改版新UI菜单栏目
 * @param {Object} obj 推送的消息体
 * @return {undefined} undefined
 */
function RCMD_C501(obj) {
  if (!obj) {
    return;
  }
  let skt_data = obj.cd;
  // 设置菜单数量
}
/**
 * @description: 全局开关推送
 * @param {Object} obj 推送的消息体
 * @return {undefined} undefined
 */
function RCMD_C701(obj) {
  let data = obj.cd
  let {
      //热门推荐
      hotRecommend: hot_recommend = 1,
      //统计
      statisticsSwitch: statistics_switch = 1,
      //收藏
      collectSwitch: collect_switch = 1,
      //近期
      recentSwitch: recent_switch = 1,
      //活动
      activitySwitch: activity_switch = 1,
      //搜索
      searchSwitch: search_switch = 1,
      //联赛筛选
      filterSwitch: filter_switch = 1,
      //盘口数量
      handicapNum: handicap_num = 1,
      //热门赛事
      hotMatchNum: hot_match_num = 1,
      //排序
      sortCut: sort_cut = 1,
      //滚球全部
      playAllShow: play_all_show = 1,
      //多列
      multiColumn: multi_column = 1,
  } = data
  let cur_obj = {
      hot_recommend,
      statistics_switch,
      collect_switch,
      recent_switch,
      activity_switch,
      search_switch,
      filter_switch,
      handicap_num,
      hot_match_num,
      sort_cut,
      play_all_show,
      multi_column
  }
  for (const key in cur_obj) {
      if (cur_obj[key] === 1) {  delete cur_obj[key] }
  }
  // TODO hanmar 设置全局开关 
}
/**
 * @description: 菜单栏目
 * @param {Object} obj 推送的消息体
 * @return {undefined} undefined
 */
function RCMD_C301(obj) {
  // console.log('-----------------菜单栏目C301------------');
  if (!obj) {
    return;
  }

  let skt_data = obj.cd;
  // 设置菜单数量
}
/**
 * C3011 推送数据
 * `refreshAll` 是否全刷，true：全刷，false：不全刷
 * @description: 菜单栏顺序变更(专业版处理)
 * @param {*} obj
 * @return {*}
 */
function RCMD_C3011(obj) {
  let skt_data = obj.cd;
}
/**
 * C201推动数据
 * `orderNo` 订单编号
 * `status` 订单状态(1:投注成功 2:投注失败)
 * `newTotalMaxWinAmount` 订单最高可赢金额
 * `isOddsChange` 赔率是否变更，为true时处理赔率变更集合
 * `newProcessOrder` 是否投注新流程订单 1:是 0:否
 * `tryNewProcessBet` 是否重试投注新流程订单 1:是 2:投注金额变更 0:否
 * `refuseCode` 拒单编码
 * `cuid` 用户Id
 * `preStatus` 是否提前结算状态：0:原有结算逻辑, 1:是提前结算
 * `orderStatus` 专指提前结算状态  1:通过  2:拒绝
 * @description:  订单状态
 * @param {Object} obj 推送的消息体
 * @return {undefined} undefined
 */
function RCMD_C201(obj) {
  // console.log('-----------------订单状态C201------------');
  if (!obj) {
    return;
  }
  let skt_data = obj.cd;
  // 订单无论成功还是失败都进行收藏
  if ([1,2].includes(skt_data.status)) {
    // console.log(`===================RCMD_C201RCMD_C201RCMD_C201===============================${JSON.stringify(this.view_ctr_obj)}`);
    // 自动收藏
    useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, { type: "bet" });
    // 统计未计算订单
    useMittEmit(MITT_TYPES.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
    // 更新提前结算金额
    useMittEmit(MITT_TYPES.EMIT_UPD_CASHOUT_MAX_AMOUNT_LIST_CMD, skt_data);
  }
}
// 用户账变(C203)
function RCMD_C203(obj){
    // console.log('-----------------订单状态C203------------');
  if (!obj) {
    return;
  }
  let skt_data = obj.cd;
  if (this.get_uid && skt_data.cuid == this.get_uid) {
    get_balance();
  }
}
/**
 * `hls` 盘口集合
 * `mid` 赛事Id
 * `hid` 盘口Id
 * `hpid` 玩法Id
 * `hs` 盘口状态 0:开盘 1:封盘 2:关盘 11:锁盘
 * `hn` 坑位 1:表示主盘，2:表示第一副盘，以此类推
 * `hps` 基准分S1|0:0  不存在基准分则不传输该字段
 * `hmt` 盘口类型 1:赛前盘 0:滚球盘
 * @description:  注单订阅盘口状态、赔率
 * @param {Object} obj 推送的消息体
 * @return {undefined} undefined
 */
function RCMD_C106(obj) {
  if (!obj) {
    return;
  }
}
/**
 * 109 推送数据
 * `mid` 赛事Id
 * `hs` 盘口状态
 * `csid` 球种Id
 * `ms` 赛事状态 赛事状态 0:未开赛 1:滚球 110:即将开赛
 * @description:  赛事级开盘推送
 * @param {Object} obj 推送的消息体
 * @return {undefined} undefined
 */
function RCMD_C109(obj) {
  console.log(`=============进入websocket========RCMD_C109`);
  if (!obj) return;
  let id, bet_obj, skt_data = obj.cd;
  let len = skt_data.length
}
/**
 * @更新用户余额
 * @param uid ：this.params.userId
 */
  function get_balance() {
  this.send_gcuuid = uid();
  let gcuuid = this.send_gcuuid;
  // console.log('get_balance====',JSON.stringify(gcuuid));

  api_account
    .check_balance({ uid: UserCtr.get_uid(), t: new Date().getTime(), gcuuid:gcuuid })
    .then((res) => {
    // console.log('get_balance====res===', this.send_gcuuid == res.config.gcuuid);
    // if(this.send_gcuuid != res.config.gcuuid) return;

    
    let gcuuid = _.get(res,'config.gcuuid')
    if(gcuuid && this.send_gcuuid != gcuuid) {
      return;
    }

      const result = _.get(res, "data.data");
      const code = _.get(res, "data.code");
      if (code == 200) {
        // TODO hanmar 通知更新用户金额
      }
  });
}

//设置计算属性
const get_uid = computed(() => {
  //是不是可以显示内嵌框
  return UserCtr.get_uid();
});
// 监听用户id变化
watch(
  () => [
    get_uid, //单关
  ],
  () => {
    scmd_all();
  },
  {
    immediate: true,
  }
);

onMounted(()=>{
  // 设置接收postMessage消息
  window.addEventListener("message", rev_event_msg);
  // 监听页面是否转入休眠状态
  document.addEventListener('visibilitychange', event_listener_visibilitychange);
  document.addEventListener('pagehide', event_listener_visibilitychange);
  // 启动WS操作对象
  WsMan.run();
  if(wslog.ws_run){
    clearInterval(log_time_timer);
    log_time_timer = setInterval(set_time_str, 100);
  }
  // 开启测试功能
  // test();
})

onBeforeUnmount(()=>{
  // 移除接收postMessage消息
  window.removeEventListener("message", rev_event_msg);
  // 移除监听页面是否转入休眠状态
  document.removeEventListener('visibilitychange', event_listener_visibilitychange);
  document.removeEventListener('pagehide', event_listener_visibilitychange);
  // 销毁延时器
  clearTimeout(timer);
  clearTimeout(timer2);
  clearTimeout(timer_text);
  clearTimeout(timer_ws_msg);
  clearInterval(log_time_timer);
  // 发送命令
  scmd_c4(2);
  // 销毁WS操作对象
  WsMan.destroyed();
})
</script>
<style lang="scss" scoped>
.time-show {
  position: fixed;
  top: 20px;
  width:  100vw;
  color: red;
  z-index: 9999999;
  font-size: 20px;
  text-align: center;
  pointer-events:none;
  span {
    background-color: rgba(255, 255, 255, 0.4);
    padding: 5px;
  }
}
.time-show-copy {
  position: fixed;
  left: -15px;
  padding-top: -90px !important;
  margin: 0px;
  top: -10px;
  width: 30px;
  height: 30px;
  color: red;
  z-index: 9999999;
  font-size: 30px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 20px 20px;
  span {
    position:relative;
    left: 0px;
    top: -10px;
  }
}
</style>