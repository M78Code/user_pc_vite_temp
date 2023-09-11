/**
 * @Author: hanmar
 * @Date: 2023-08-20 12:45:19
 * @Description: match-ctr数据仓库测试使用
 * 
 */
<template>
  <div>
    obj={{ MatchDataWarehouseInstance.quick_query_list}}
  </div>
</template>
<script>
import MatchDataBase from "./match-ctr"
import _ from 'lodash'
export default {
  // reactive state
  data() {
    return {
      obj: {},
      MatchDataWarehouseInstance : new MatchDataBase({ name_code:'list' })
    }
  },

  // functions that mutate state and trigger updates
  methods: {
    /**
     * @description: 数据合并优化版函数
     * @param {*} obj_obj 旧数据
     * @param {*} src_obj 新数据
     */
    merge_with(obj_obj, src_obj){
      let customizer = (objValue, srcValue) => {
        let res = objValue;
        // 数据类型
        let type = typeof(objValue);
        if('object' == type){
          if(Array.isArray(objValue)){
            type = 'array';
          }
        }
        // console.error(type,'=====>',objValue);
        // 根据数据类型进行逻辑处理
        if('object' == type){
          // 为对象的操作
          if(!srcValue){
            res = srcValue;
          } else {
            for (const key in objValue) {
              if (objValue[key]) {
                if(srcValue[key] == undefined){
                  // 删除右侧没有的对象key数据
                  delete objValue[key]
                } else {
                  // if(typeof(objValue[key]) == 'object'){
                  //   // this.mergeWith2(objValue[key], srcValue[key],0);
                  // }
                }
              }
            }
          }
        } else if('array' == type){
			console.error('srcValue=',srcValue);
          // 为数组的操作
          let len = srcValue.length;
          // 删除多余的数组项
          objValue.splice(len,objValue.length-len);
        } else {
          // 普通类型不做处理
        }
      }
      _.mergeWith(obj_obj, src_obj,customizer);
    },
    /**
     * @description: 数据合并优化版函数
     * @param {*} obj_obj 旧数据
     * @param {*} src_obj 新数据
     */
     merge_clear(obj_obj, src_obj){
      let customizer = (objValue, srcValue) => {
        let res = objValue;
        // 数据类型
        let type = typeof(objValue);
        if('object' == type){
          if(Array.isArray(objValue)){
            type = 'array';
          }
        }
        // console.error(type,'=====>',objValue);
        // 根据数据类型进行逻辑处理
        if('object' == type){
          // 为对象的操作
          if(!srcValue){
            res = srcValue;
          } else {
            for (const key in objValue) {
              if (objValue[key]) {
                if(srcValue[key] == undefined){
                  // 删除右侧没有的对象key数据
                  delete objValue[key]
                } else {
                  // if(typeof(objValue[key]) == 'object'){
                  //   // this.mergeWith2(objValue[key], srcValue[key],0);
                  // }
                }
              }
            }
          }
        } else if('array' == type){
          // 为数组的操作
          let len = srcValue.length;
          // 删除多余的数组项
          objValue.splice(len,objValue.length-len);
        } else {
          // 普通类型不做处理
        }
      }
      _.mergeWith(obj_obj, src_obj,customizer);
    },

     clear_any_obj(obj) {
      console.error('clear_any_obj:',obj);
      if(typeof (obj) == "object")
      {
        for (const key in obj) {
          console.error(key+'___O__'+obj[key]);
          this.clear_any_obj(obj[key]);
          delete obj[key];
        }
        if(Array.isArray(obj))
        {
          obj.length = 0;
        }
      }
    }
  },
  watch: {
    // 监听csid的变化
    obj: {
      handler(n,o){
        console.error(JSON.stringify(n));
      },
      deep: true
    },
    "obj.list"(n){
      console.error('obj.list:',JSON.stringify(n));
    }
  },

  // lifecycle hooks
  mounted() {
    window.obj=this.obj;
    let oo = {
  "data" : [
    {
      "mcid" : "",
      "tnjc" : "秘魯甲",
      "cos" : false,
      "hpsBold" : [],
      "csna" : "足球",
      "tid" : "511",
      "mst" : "3398",
      "srid" : "10408369",
      "mcg" : 1,
      "cosCorner" : true,
      "cosPunish" : false,
      "cosOutright" : false,
      "mdsc" : null,
      "mc" : 47,
      "hpsOvertime" : [],
      "mf" : false,
      "mgt" : "1692235800000",
      "maid" : "1909",
      "hpsPns" : [
        {
          "hids" : 1,
          "hpid" : "1",
          "hpon" : 7,
          "hpn" : "全场独赢",
          "mid" : "2658053",
          "hmm" : 0,
          "hshow" : "Yes",
          "hpnb" : "全场独赢",
          "hpt" : 1,
          "hsw" : "1,4,5",
          "mct" : null
        },
        {
          "hids" : 1,
          "hpid" : "4",
          "hpon" : 4,
          "hpn" : "全场让球",
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "全场让球",
          "hpt" : 2,
          "hsw" : "1,2,3,4,5,6",
          "mct" : "0"
        },
        {
          "hids" : 1,
          "hpid" : "2",
          "hpon" : 3,
          "hpn" : "全场大小",
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "全场大小",
          "hpt" : 5,
          "hsw" : "1,2,3,4,5,6",
          "mct" : null
        },
        {
          "hids" : 1,
          "hpid" : "17",
          "hpon" : 8,
          "hpn" : "上半场独赢",
          "mid" : "2658053",
          "hmm" : 0,
          "hshow" : "Yes",
          "hpnb" : "上半场独赢",
          "hpt" : 1,
          "hsw" : "1,4,5",
          "mct" : "1"
        },
        {
          "hids" : 1,
          "hpid" : "19",
          "hpon" : 6,
          "hpn" : "上半场让球",
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "上半场让球",
          "hpt" : 2,
          "hsw" : "1,2,3,4,5,6",
          "mct" : "1"
        },
        {
          "hids" : 1,
          "hpid" : "18",
          "hpon" : 5,
          "hpn" : "上半场大小",
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "上半场大小",
          "hpt" : 5,
          "hsw" : "1,2,3,4,5,6",
          "mct" : "1"
        },
        {
          "hids" : 1,
          "hpid" : "111",
          "hpon" : 115,
          "hpn" : "角球独赢",
          "mid" : "2658053",
          "hmm" : 0,
          "hshow" : "Yes",
          "hpnb" : "角球独赢",
          "hpt" : 1,
          "hsw" : "1,4,5",
          "mct" : "1"
        },
        {
          "hids" : 1,
          "hpid" : "113",
          "hpon" : 114,
          "hpn" : "角球让球",
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "角球让球",
          "hpt" : 2,
          "hsw" : "1,2,3,4,5,6",
          "mct" : "1"
        },
        {
          "hids" : 1,
          "hpid" : "114",
          "hpon" : 113,
          "hpn" : "角球大小",
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "角球大小",
          "hpt" : 5,
          "hsw" : "1,2,3,4,5,6",
          "mct" : null
        },
        {
          "hids" : 1,
          "hpid" : "119",
          "hpon" : 121,
          "hpn" : "上半场角球独赢",
          "mid" : "2658053",
          "hmm" : 0,
          "hshow" : "Yes",
          "hpnb" : "上半场角球独赢",
          "hpt" : 1,
          "hsw" : "1,4,5",
          "mct" : "1"
        },
        {
          "hids" : 1,
          "hpid" : "121",
          "hpon" : 120,
          "hpn" : "上半场角球让球",
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "上半场角球让球",
          "hpt" : 2,
          "hsw" : "1,2,3,4,5,6",
          "mct" : "1"
        },
        {
          "hids" : 1,
          "hpid" : "122",
          "hpon" : 119,
          "hpn" : "上半场角球大小",
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "上半场角球大小",
          "hpt" : 5,
          "hsw" : "1,2,3,4,5,6",
          "mct" : "1"
        },
        {
          "hids" : 0,
          "hpid" : "32",
          "hpn" : "15分钟进球(下半场开始-59:59)-独赢",
          "hpon" : 123,
          "mid" : "2658053",
          "hmm" : 0,
          "hshow" : "Yes",
          "hpnb" : "15分钟进球(下半场开始-59:59)-独赢",
          "hpt" : 1,
          "hsw" : "1,4,5",
          "hSpecial" : "4",
          "mct" : "46"
        },
        {
          "hids" : 0,
          "hpid" : "33",
          "hpn" : "15分钟进球(下半场开始-59:59)-让球",
          "hpon" : 124,
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "15分钟进球(下半场开始-59:59)-让球",
          "hpt" : 2,
          "hsw" : "1,2,3,4,5,6",
          "hSpecial" : "4",
          "mct" : "0.0"
        },
        {
          "hids" : 1,
          "hpid" : "34",
          "hpn" : "15分钟进球(下半场开始-59:59)-大小",
          "hpon" : 126,
          "mid" : "2658053",
          "hmm" : 1,
          "hshow" : "Yes",
          "hpnb" : "15分钟进球(下半场开始-59:59)-大小",
          "hpt" : 5,
          "hsw" : "1,2,3,4,5,6",
          "hSpecial" : "4",
          "mct" : "46"
        },
        {
          "hids" : 1,
          "hpid" : "361",
          "hpon" : 225,
          "hpn" : "5分钟时段进球",
          "mid" : "2658053",
          "hmm" : 0,
          "hshow" : "No",
          "hpnb" : "5分钟时段进球",
          "hpt" : 4,
          "hsw" : "1,4,5",
          "mct" : "1"
        },
        {
          "hids" : 1,
          "hpid" : "362",
          "hpon" : 226,
          "hpn" : "第 1 个进球时分(5min)",
          "mid" : "2658053",
          "hmm" : 0,
          "hshow" : "No",
          "hpnb" : "第 1 个进球时分(5min)",
          "hpt" : 4,
          "hsw" : "1,4,5",
          "mct" : null
        }
      ],
      "mct" : 0,
      "tlev" : 7,
      "mhlut" : "",
      "mo" : 0,
      "mp" : 1,
      "csid" : "1",
      "ms" : 1,
      "cmec" : "danger_ball",
      "cos5Minutes" : true,
      "mle" : 0,
      "lvs" : -1,
      "malu" : [ "group1/M00/00/41/CgURtV8rkxWAIYZHAAAnL3tR92M502.png" ],
      "hpsData" : [
        {
          "hps" : [
            {
              "chpid" : "1",
              "hpid" : "1",
              "hl" : {
                "hid" : "141127045042233746",
                "hs" : 0,
                "hv" : null,
                "hmt" : 0,
                "hn" : null,
                "ol" : [
                  {
                    "oid" : "143265260423491454",
                    "os" : 1,
                    "otd" : 47,
                    "ot" : "1",
                    "ov" : 183000,
                    "onb" : "主胜",
                    "on" : "利马联盟",
                    "onbl" : "",
                    "cds" : "LS",
                    "ots" : "T1"
                  },
                  {
                    "oid" : "140014608496043304",
                    "os" : 1,
                    "otd" : 49,
                    "ot" : "2",
                    "ov" : 950000,
                    "onb" : "客胜",
                    "on" : "万卡约体育",
                    "onbl" : "",
                    "cds" : "LS",
                    "ots" : "T2"
                  },
                  {
                    "oid" : "142422314906056505",
                    "os" : 1,
                    "otd" : 48,
                    "ot" : "X",
                    "ov" : 240000,
                    "onb" : "平局",
                    "on" : "平局",
                    "onbl" : "",
                    "cds" : "LS",
                    "ots" : ""
                  }
                ]
              }
            },
            {
              "chpid" : "4",
              "hpid" : "4",
              "hl" : {
                "hid" : "141831211320371048",
                "hs" : 0,
                "hv" : "-0.5",
                "hmt" : 0,
                "hn" : 1,
                "ol" : [
                  {
                    "oid" : "140153965041301221",
                    "os" : 1,
                    "otd" : 3,
                    "ot" : "1",
                    "ov" : 183000,
                    "onb" : "-0.5",
                    "on" : "-0.5",
                    "onbl" : "",
                    "cds" : "LS",
                    "ots" : "T1"
                  },
                  {
                    "oid" : "141111251604443554",
                    "os" : 1,
                    "otd" : 4,
                    "ot" : "2",
                    "ov" : 199000,
                    "onb" : "+0.5",
                    "on" : "+0.5",
                    "onbl" : "",
                    "cds" : "LS",
                    "ots" : "T2"
                  }
                ]
              }
            },
            {
              "chpid" : "2",
              "hpid" : "2",
              "hl" : {
                "hid" : "148423517402112341",
                "hs" : 0,
                "hv" : "1",
                "hmt" : 0,
                "hn" : 1,
                "ol" : [
                  {
                    "oid" : "144607014637500124",
                    "os" : 1,
                    "otd" : 2,
                    "ot" : "Over",
                    "ov" : 187000,
                    "onb" : "1",
                    "on" : "大 1",
                    "onbl" : "大 ",
                    "cds" : "LS",
                    "ots" : "T1"
                  },
                  {
                    "oid" : "142153067175508523",
                    "os" : 1,
                    "otd" : 1,
                    "ot" : "Under",
                    "ov" : 193000,
                    "onb" : "1",
                    "on" : "小 1",
                    "onbl" : "小 ",
                    "cds" : "LS",
                    "ots" : "T2"
                  }
                ]
              }
            },
            {
              "chpid" : "",
              "hpid" : "17",
              "hl" : {}
            },
            {
              "chpid" : "",
              "hpid" : "19",
              "hl" : {}
            },
            {
              "chpid" : "",
              "hpid" : "18",
              "hl" : {}
            }
          ],
          "hpsAdd" : [
            {
              "chpid" : "1",
              "hpid" : "1",
              "hlnm" : 0,
              "hl" : []
            },
            {
              "chpid" : "4",
              "hpid" : "4",
              "hlnm" : 4,
              "hl" : [
                {
                  "hid" : "142501744918546127",
                  "hs" : 0,
                  "hv" : "-0.5/1",
                  "hmt" : 0,
                  "hn" : 2,
                  "ol" : [
                    {
                      "oid" : "143033779144351428",
                      "os" : 1,
                      "otd" : 3,
                      "ot" : "1",
                      "ov" : 220000,
                      "onb" : "-0.5/1",
                      "on" : "-0.5/1",
                      "onbl" : "",
                      "cds" : "LS",
                      "ots" : "T1"
                    },
                    {
                      "oid" : "147529343341151453",
                      "os" : 1,
                      "otd" : 4,
                      "ot" : "2",
                      "ov" : 165000,
                      "onb" : "+0.5/1",
                      "on" : "+0.5/1",
                      "onbl" : "",
                      "cds" : "LS",
                      "ots" : "T2"
                    }
                  ]
                },
                {
                  "hid" : "149274478240432555",
                  "hs" : 0,
                  "hv" : "-0/0.5",
                  "hmt" : 0,
                  "hn" : 3,
                  "ol" : [
                    {
                      "oid" : "145975246941972192",
                      "os" : 1,
                      "otd" : 3,
                      "ot" : "1",
                      "ov" : 147000,
                      "onb" : "-0/0.5",
                      "on" : "-0/0.5",
                      "onbl" : "",
                      "cds" : "LS",
                      "ots" : "T1"
                    },
                    {
                      "oid" : "141585569358011424",
                      "os" : 1,
                      "otd" : 4,
                      "ot" : "2",
                      "ov" : 253000,
                      "onb" : "+0/0.5",
                      "on" : "+0/0.5",
                      "onbl" : "",
                      "cds" : "LS",
                      "ots" : "T2"
                    }
                  ]
                },
                {
                  "hid" : "142002500393950508",
                  "hs" : 0,
                  "hv" : "-1",
                  "hmt" : 0,
                  "hn" : 4,
                  "ol" : [
                    {
                      "oid" : "147413438538045092",
                      "os" : 1,
                      "otd" : 3,
                      "ot" : "1",
                      "ov" : 292000,
                      "onb" : "-1",
                      "on" : "-1",
                      "onbl" : "",
                      "cds" : "LS",
                      "ots" : "T1"
                    },
                    {
                      "oid" : "146477294711554055",
                      "os" : 1,
                      "otd" : 4,
                      "ot" : "2",
                      "ov" : 134000,
                      "onb" : "+1",
                      "on" : "+1",
                      "onbl" : "",
                      "cds" : "LS",
                      "ots" : "T2"
                    }
                  ]
                },
                {
                  "hid" : "143509692510192304",
                  "hs" : 0,
                  "hv" : "0",
                  "hmt" : 0,
                  "hn" : 5,
                  "ol" : [
                    {
                      "oid" : "142199512327835305",
                      "os" : 1,
                      "otd" : 3,
                      "ot" : "1",
                      "ov" : 111000,
                      "onb" : "0",
                      "on" : "0",
                      "onbl" : "",
                      "cds" : "LS",
                      "ots" : "T1"
                    },
                    {
                      "oid" : "140449195487212339",
                      "os" : 1,
                      "otd" : 4,
                      "ot" : "2",
                      "ov" : 444000,
                      "onb" : "0",
                      "on" : "0",
                      "onbl" : "",
                      "cds" : "LS",
                      "ots" : "T2"
                    }
                  ]
                }
              ]
            },
            {
              "chpid" : "2",
              "hpid" : "2",
              "hlnm" : 4,
              "hl" : [
                {
                  "hid" : "145354853135223581",
                  "hs" : 0,
                  "hv" : "1/1.5",
                  "hmt" : 0,
                  "hn" : 2,
                  "ol" : [
                    {
                      "oid" : "145511928125177278",
                      "os" : 1,
                      "otd" : 2,
                      "ot" : "Over",
                      "ov" : 231000,
                      "onb" : "1/1.5",
                      "on" : "大 1/1.5",
                      "onbl" : "大 ",
                      "cds" : "LS",
                      "ots" : "T1"
                    },
                    {
                      "oid" : "147433301501262791",
                      "os" : 1,
                      "otd" : 1,
                      "ot" : "Under",
                      "ov" : 156000,
                      "onb" : "1/1.5",
                      "on" : "小 1/1.5",
                      "onbl" : "小 ",
                      "cds" : "LS",
                      "ots" : "T2"
                    }
                  ]
                },
                {
                  "hid" : "145414251042342719",
                  "hs" : 0,
                  "hv" : "0.5/1",
                  "hmt" : 0,
                  "hn" : 3,
                  "ol" : [
                    {
                      "oid" : "143021587455612125",
                      "os" : 1,
                      "otd" : 2,
                      "ot" : "Over",
                      "ov" : 154000,
                      "onb" : "0.5/1",
                      "on" : "大 0.5/1",
                      "onbl" : "大 ",
                      "cds" : "LS",
                      "ots" : "T1"
                    },
                    {
                      "oid" : "144432435870334091",
                      "os" : 1,
                      "otd" : 1,
                      "ot" : "Under",
                      "ov" : 235000,
                      "onb" : "0.5/1",
                      "on" : "小 0.5/1",
                      "onbl" : "小 ",
                      "cds" : "LS",
                      "ots" : "T2"
                    }
                  ]
                },
                {
                  "hid" : "148961773934863501",
                  "hs" : 0,
                  "hv" : "0.5",
                  "hmt" : 0,
                  "hn" : 4,
                  "ol" : [
                    {
                      "oid" : "148649456063333236",
                      "os" : 1,
                      "otd" : 2,
                      "ot" : "Over",
                      "ov" : 138000,
                      "onb" : "0.5",
                      "on" : "大 0.5",
                      "onbl" : "大 ",
                      "cds" : "LS",
                      "ots" : "T1"
                    },
                    {
                      "oid" : "145024673519120139",
                      "os" : 1,
                      "otd" : 1,
                      "ot" : "Under",
                      "ov" : 272000,
                      "onb" : "0.5",
                      "on" : "小 0.5",
                      "onbl" : "小 ",
                      "cds" : "LS",
                      "ots" : "T2"
                    }
                  ]
                },
                {
                  "hid" : "146274058048242238",
                  "hs" : 0,
                  "hv" : "1.5",
                  "hmt" : 0,
                  "hn" : 5,
                  "ol" : [
                    {
                      "oid" : "144416119231721675",
                      "os" : 1,
                      "otd" : 2,
                      "ot" : "Over",
                      "ov" : 272000,
                      "onb" : "1.5",
                      "on" : "大 1.5",
                      "onbl" : "大 ",
                      "cds" : "LS",
                      "ots" : "T1"
                    },
                    {
                      "oid" : "147472164818326330",
                      "os" : 1,
                      "otd" : 1,
                      "ot" : "Under",
                      "ov" : 138000,
                      "onb" : "1.5",
                      "on" : "小 1.5",
                      "onbl" : "小 ",
                      "cds" : "LS",
                      "ots" : "T2"
                    }
                  ]
                }
              ]
            },
            {
              "chpid" : "",
              "hpid" : "17",
              "hlnm" : 0,
              "hl" : []
            },
            {
              "chpid" : "",
              "hpid" : "19",
              "hlnm" : 0,
              "hl" : []
            },
            {
              "chpid" : "",
              "hpid" : "18",
              "hlnm" : 0,
              "hl" : []
            }
          ]
        }
      ],
      "hps15Minutes" : [
        {
          "chpid" : "3204",
          "hpid" : "32",
          "hl" : {
            "hid" : "142703593455434127",
            "hs" : 0,
            "hv" : null,
            "hmt" : 0,
            "hn" : null,
            "ad3" : "60",
            "ad5" : "10100000",
            "ol" : [
              {
                "oid" : "149521514247220353",
                "os" : 1,
                "otd" : 610,
                "ot" : "1",
                "ov" : 870000,
                "onb" : "主胜",
                "on" : "利马联盟",
                "onbl" : "",
                "cds" : "AO",
                "ots" : "T1"
              },
              {
                "oid" : "147564094435045712",
                "os" : 1,
                "otd" : 612,
                "ot" : "2",
                "ov" : 2000000,
                "onb" : "客胜",
                "on" : "万卡约体育",
                "onbl" : "",
                "cds" : "AO",
                "ots" : "T2"
              },
              {
                "oid" : "143322287427701779",
                "os" : 1,
                "otd" : 611,
                "ot" : "X",
                "ov" : 104000,
                "onb" : "平局",
                "on" : "平局",
                "onbl" : "",
                "cds" : "AO",
                "ots" : ""
              }
            ]
          },
          "hSpecial" : "4"
        },
        {
          "chpid" : "3304",
          "hpid" : "33",
          "hl" : {
            "hid" : "149354920451108751",
            "hs" : 0,
            "hv" : "0",
            "hmt" : 0,
            "hn" : null,
            "ad3" : "0",
            "ad5" : "46,60",
            "ol" : [
              {
                "oid" : "140611261365618363",
                "os" : 1,
                "otd" : 613,
                "ot" : "1",
                "ov" : 116000,
                "onb" : "0",
                "on" : "0",
                "onbl" : "",
                "cds" : "AO",
                "ots" : "T1"
              },
              {
                "oid" : "141431121616381270",
                "os" : 1,
                "otd" : 614,
                "ot" : "2",
                "ov" : 377000,
                "onb" : "0",
                "on" : "0",
                "onbl" : "",
                "cds" : "AO",
                "ots" : "T2"
              }
            ]
          },
          "hSpecial" : "4"
        },
        {
          "chpid" : "3404",
          "hpid" : "34",
          "hl" : {
            "hid" : "143006405077322310",
            "hs" : 0,
            "hv" : "0.5",
            "hmt" : 0,
            "hn" : null,
            "ad3" : "60",
            "ad5" : "",
            "ol" : [
              {
                "oid" : "147263527055737948",
                "os" : 1,
                "otd" : 615,
                "ot" : "Over",
                "ov" : 600000,
                "onb" : "0.5",
                "on" : "大 0.5",
                "onbl" : "大 ",
                "cds" : "AO",
                "ots" : "T1"
              },
              {
                "oid" : "140059910331042982",
                "os" : 1,
                "otd" : 616,
                "ot" : "Under",
                "ov" : 109000,
                "onb" : "0.5",
                "on" : "小 0.5",
                "onbl" : "小 ",
                "cds" : "AO",
                "ots" : "T2"
              }
            ]
          },
          "hSpecial" : "4"
        }
      ],
      "lurl" : "group1/M00/00/3D/CgURt18jIamAeDWsAAAddr1ouk4801.png",
      "mprmc" : "PA",
      "cosOvertime" : false,
      "mhn" : "利马联盟",
      "betAmount" : "102774.65",
      "cds" : "BG",
      "frmhn" : [ "L" ],
      "operationTournamentSort" : 189,
      "cos15Minutes" : true,
      "mhs" : 0,
      "mlet" : "45:00",
      "hps5Minutes" : [
        {
          "chpid" : "",
          "hpid" : "361",
          "hl" : {}
        },
        {
          "chpid" : "36201",
          "hpid" : "362",
          "hl" : {
            "hid" : "145476368133602546",
            "hs" : 0,
            "hv" : "1",
            "hmt" : 0,
            "hn" : null,
            "title" : [
              {
                "osn" : "00:00-04:59",
                "otd" : 1174
              },
              {
                "osn" : "05:00-09:59",
                "otd" : 1175
              },
              {
                "osn" : "10:00-14:59",
                "otd" : 1176
              },
              {
                "osn" : "15:00-19:59",
                "otd" : 1177
              },
              {
                "osn" : "20:00-24:59",
                "otd" : 1178
              },
              {
                "osn" : "25:00-29:59",
                "otd" : 1179
              },
              {
                "osn" : "30:00-34:59",
                "otd" : 1180
              },
              {
                "osn" : "35:00-39:59",
                "otd" : 1181
              },
              {
                "osn" : "40:00-45:00",
                "otd" : 1182
              },
              {
                "osn" : "下半场-49:59",
                "otd" : 1183
              },
              {
                "osn" : "50:00-54:59",
                "otd" : 1184
              },
              {
                "osn" : "55:00-59:59",
                "otd" : 1185
              },
              {
                "osn" : "60:00-64:59",
                "otd" : 1186
              },
              {
                "osn" : "65:00-69:59",
                "otd" : 1187
              },
              {
                "osn" : "70:00-74:59",
                "otd" : 1188
              },
              {
                "osn" : "75:00-79:59",
                "otd" : 1189
              },
              {
                "osn" : "80:00-84:59",
                "otd" : 1190
              },
              {
                "osn" : "85:00-90:00",
                "otd" : 1191
              },
              {
                "osn" : "无第 {X} 个进球",
                "otd" : 1192
              },
              {
                "osn" : "绝杀球(补时)",
                "otd" : 1193
              }
            ],
            "ol" : [
              {
                "oid" : "147205900012158464",
                "os" : 1,
                "otd" : 1186,
                "ot" : "61-65",
                "ov" : 630000,
                "onb" : "60:00-64:59",
                "on" : "60:00-64:59",
                "onbl" : "",
                "cds" : "AO",
                "ots" : ""
              },
              {
                "oid" : "141001342291531351",
                "os" : 1,
                "otd" : 1187,
                "ot" : "66-70",
                "ov" : 730000,
                "onb" : "65:00-69:59",
                "on" : "65:00-69:59",
                "onbl" : "",
                "cds" : "AO",
                "ots" : ""
              },
              {
                "oid" : "141352280022417440",
                "os" : 1,
                "otd" : 1188,
                "ot" : "71-75",
                "ov" : 840000,
                "onb" : "70:00-74:59",
                "on" : "70:00-74:59",
                "onbl" : "",
                "cds" : "AO",
                "ots" : ""
              },
              {
                "oid" : "144303509355500476",
                "os" : 1,
                "otd" : 1189,
                "ot" : "76-80",
                "ov" : 940000,
                "onb" : "75:00-79:59",
                "on" : "75:00-79:59",
                "onbl" : "",
                "cds" : "AO",
                "ots" : ""
              },
              {
                "oid" : "148081540450320816",
                "os" : 1,
                "otd" : 1190,
                "ot" : "81-85",
                "ov" : 1050000,
                "onb" : "80:00-84:59",
                "on" : "80:00-84:59",
                "onbl" : "",
                "cds" : "AO",
                "ots" : ""
              },
              {
                "oid" : "144221052193209021",
                "os" : 1,
                "otd" : 1191,
                "ot" : "86-90",
                "ov" : 1200000,
                "onb" : "85:00-90:00",
                "on" : "85:00-90:00",
                "onbl" : "",
                "cds" : "AO",
                "ots" : ""
              },
              {
                "oid" : "141018157452349816",
                "os" : 1,
                "otd" : 1192,
                "ot" : "NoGoal",
                "ov" : 269000,
                "onb" : "无第 1 个进球",
                "on" : "无第 1 个进球",
                "onbl" : "",
                "cds" : "AO",
                "ots" : ""
              }
            ]
          }
        }
      ],
      "cosPenalty" : false,
      "hpsCorner" : [
        {
          "chpid" : "",
          "hpid" : "111",
          "hl" : {}
        },
        {
          "chpid" : "",
          "hpid" : "113",
          "hl" : {}
        },
        {
          "chpid" : "114",
          "hpid" : "114",
          "hl" : {
            "hid" : "140423549945592915",
            "hs" : 1,
            "hv" : "9",
            "hmt" : 0,
            "hn" : 1,
            "ol" : [
              {
                "oid" : "142235625407612142",
                "os" : 1,
                "otd" : 397,
                "ot" : "Over",
                "ov" : 204000,
                "onb" : "9",
                "on" : "大 9",
                "onbl" : "大 ",
                "cds" : "LS",
                "ots" : "T1"
              },
              {
                "oid" : "147553601154852090",
                "os" : 1,
                "otd" : 396,
                "ot" : "Under",
                "ov" : 176000,
                "onb" : "9",
                "on" : "小 9",
                "onbl" : "小 ",
                "cds" : "LS",
                "ots" : "T2"
              }
            ]
          }
        },
        {
          "chpid" : "",
          "hpid" : "119",
          "hl" : {}
        },
        {
          "chpid" : "",
          "hpid" : "121",
          "hl" : {}
        },
        {
          "chpid" : "",
          "hpid" : "122",
          "hl" : {}
        }
      ],
      "mhid" : "1911",
      "hpsPunish" : [],
      "mrmc" : "",
      "mid" : "2658053",
      "mess" : 1,
      "cosBold" : true,
      "lss" : null,
      "mmp" : "7",
      "mststi" : "0",
      "operationHotSortTop" : 0,
      "mms" : 2,
      "mbmty" : 1,
      "regionIdSort" : 5,
      "mhlu" : [ "group1/M00/00/3E/CgURt18lhzaATvxKAAARBFD_kqo398.png" ],
      "seid" : "",
      "mstst" : "0",
      "malut" : "",
      "man" : "万卡约体育",
      "frman" : [ "W" ],
      "mat" : "",
      "mng" : 0,
      "mststr" : "3398",
      "mvs" : 1,
      "hpsPenalty" : [],
      "mststs" : 0,
      "mearlys" : 1,
      "tf" : false,
      "th" : 0,
      "cosPromotion" : false,
      "mfo" : null,
      "mft" : 0,
      "tn" : "秘鲁甲级联赛",
      "msc" : [
        "S1|0:0",
        "S2|0:0",
        "S5|4:0",
        "S555|4:0",
        "S15|3:0",
        "S12|1:2",
        "S12001|1:2",
        "S11|0:0",
        "S11001|0:0",
        "S1101|13:3",
        "S13|0:0",
        "S14|0:1",
        "S10101|1:2",
        "S10102|1:2",
        "S10103|0:1",
        "S1001|0:0",
        "S1002|0:0",
        "S1003|0:0",
        "S1004|0:0",
        "S1005|0:0",
        "S1006|0:0",
        "S5001|0:0",
        "S5002|2:0",
        "S5003|1:0",
        "S5004|1:0",
        "S5005|0:0",
        "S5006|0:0",
        "S104|66:47",
        "S8|36:16",
        "S105|0:0",
        "S18|4:1",
        "S17|9:2",
        "S6|13:9",
        "S10|0:0",
        "S50011|0:0",
        "S10011|0:0",
        "S10012|0:0",
        "S10013|0:0",
        "S50012|0:0",
        "S10021|0:0",
        "S10022|0:0",
        "S10023|0:0",
        "S50013|0:1",
        "S10031|0:0",
        "S10032|0:0",
        "S10033|0:0",
        "S10034|0:0",
        "S16|1:0",
        "S3|0:0",
        "S1302|0:0",
        "S1402|1:1",
        "S10104|1:1",
        "S50014|1:1",
        "S10041|0:0",
        "S10042|0:0",
        "S10043|0:0"
      ],
      "hpsPromotion" : []
    }
  ]
}

let b={"code":"0000000","data":{"data":[{"mcid":"","tnjc":"FIFA 2023 - 土超 (8分钟)","cos":false,"hpsBold":[],"csna":"足球","tid":"29506","mst":"14","srid":"4931375953932675977","mcg":1,"cosCorner":false,"cosPunish":false,"cosOutright":false,"mdsc":null,"mc":11,"hpsOvertime":[],"mf":false,"mgt":"1692375000000","maid":"152454","hpsPns":[{"hids":0,"hpid":"1","hpon":7,"hpn":"全场独赢","mid":"2675977","hmm":0,"hshow":"Yes","hpnb":"全场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"4","hpon":4,"hpn":"全场让球","mid":"2675977","hmm":1,"hshow":"Yes","hpnb":"全场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"0.75"},{"hids":0,"hpid":"2","hpon":3,"hpn":"全场大小","mid":"2675977","hmm":1,"hshow":"Yes","hpnb":"全场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":null},{"hids":0,"hpid":"17","hpon":8,"hpn":"上半场独赢","mid":"2675977","hmm":0,"hshow":"Yes","hpnb":"上半场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"19","hpon":6,"hpn":"上半场让球","mid":"2675977","hmm":1,"hshow":"Yes","hpnb":"上半场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"1"},{"hids":0,"hpid":"18","hpon":5,"hpn":"上半场大小","mid":"2675977","hmm":1,"hshow":"Yes","hpnb":"上半场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":"1"}],"mct":0,"tlev":16,"mhlut":"","mo":0,"mp":0,"csid":"1","ms":1,"cmec":"match_status","cos5Minutes":false,"mle":71,"lvs":-1,"malu":["group1/M00/19/3D/CgURt2SG-bqAY0TWAAARTD504cY713.png"],"hpsData":[{"hps":[{"chpid":"1","hpid":"1","hl":{"hid":"149919184365455497","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"148443311014782458","os":1,"otd":47,"ot":"1","ov":470000,"onb":"主胜","on":"代米尔体育","onbl":"","cds":"BE","ots":"T1"},{"oid":"143274614311153176","os":1,"otd":49,"ot":"2","ov":166000,"onb":"客胜","on":"加拉塔萨雷","onbl":"","cds":"BE","ots":"T2"},{"oid":"144052386230459543","os":1,"otd":48,"ot":"X","ov":340000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"4","hpid":"4","hl":{"hid":"148075570158540613","hs":0,"hv":"0.5/1","hmt":0,"hn":1,"ol":[{"oid":"143104641340024823","os":1,"otd":3,"ot":"1","ov":183000,"onb":"+0.5/1","on":"+0.5/1","onbl":"","cds":"BE","ots":"T1"},{"oid":"145000154455984052","os":1,"otd":4,"ot":"2","ov":181000,"onb":"-0.5/1","on":"-0.5/1","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"2","hpid":"2","hl":{"hid":"141535314503421933","hs":0,"hv":"3","hmt":0,"hn":1,"ol":[{"oid":"145091585253123373","os":1,"otd":2,"ot":"Over","ov":185000,"onb":"3","on":"大 3","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"145712599134918845","os":1,"otd":1,"ot":"Under","ov":179000,"onb":"3","on":"小 3","onbl":"小 ","cds":"BE","ots":"T2"}]}},{"chpid":"17","hpid":"17","hl":{"hid":"141315441514092641","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"142705543441150036","os":1,"otd":101,"ot":"1","ov":450000,"onb":"主胜","on":"代米尔体育","onbl":"","cds":"BE","ots":"T1"},{"oid":"145572049747413025","os":1,"otd":103,"ot":"2","ov":203000,"onb":"客胜","on":"加拉塔萨雷","onbl":"","cds":"BE","ots":"T2"},{"oid":"141539530202217100","os":1,"otd":102,"ot":"X","ov":255000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"19","hpid":"19","hl":{"hid":"143285122423241435","hs":0,"hv":"0/0.5","hmt":0,"hn":1,"ol":[{"oid":"140826445322411492","os":1,"otd":146,"ot":"1","ov":199000,"onb":"+0/0.5","on":"+0/0.5","onbl":"","cds":"BE","ots":"T1"},{"oid":"146362155350552524","os":1,"otd":147,"ot":"2","ov":165000,"onb":"-0/0.5","on":"-0/0.5","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"18","hpid":"18","hl":{"hid":"144457284406373911","hs":0,"hv":"1.5","hmt":0,"hn":1,"ol":[{"oid":"142480547981053850","os":1,"otd":96,"ot":"Over","ov":190000,"onb":"1.5","on":"大 1.5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"141154293325684053","os":1,"otd":95,"ot":"Under","ov":174000,"onb":"1.5","on":"小 1.5","onbl":"小 ","cds":"BE","ots":"T2"}]}}],"hpsAdd":[{"chpid":"1","hpid":"1","hlnm":0,"hl":[]},{"chpid":"4","hpid":"4","hlnm":0,"hl":[]},{"chpid":"2","hpid":"2","hlnm":0,"hl":[]},{"chpid":"17","hpid":"17","hlnm":0,"hl":[]},{"chpid":"19","hpid":"19","hlnm":0,"hl":[]},{"chpid":"18","hpid":"18","hlnm":0,"hl":[]}]}],"hps15Minutes":[],"lurl":"group1/M00/19/48/CgURt2SKnXSAKzpUAAAL8K58qq4986.png","mprmc":"BTS","cosOvertime":false,"mhn":"代米尔体育","betAmount":"0.00","cds":"BE","frmhn":["D"],"operationTournamentSort":200,"cos15Minutes":false,"mhs":0,"mlet":"null:00","hps5Minutes":[],"cosPenalty":false,"hpsCorner":[],"mhid":"152491","hpsPunish":[],"mrmc":"","mid":"2675977","mess":1,"cosBold":false,"lss":null,"mmp":"6","mststi":"0","operationHotSortTop":0,"mms":2,"mbmty":2,"regionIdSort":9,"mhlu":["group1/M00/19/3D/CgURtmSHFymASm93AAAVRaGPIgs741.png"],"seid":"","mstst":"0","malut":"","man":"加拉塔萨雷","frman":["J"],"mat":"","mng":1,"mststr":"14","mvs":-1,"hpsPenalty":[],"mststs":0,"mearlys":0,"tf":false,"th":0,"cosPromotion":false,"mfo":null,"mft":0,"tn":"FIFA 2023 - 土耳其超级联赛 (8分钟)","msc":["S1|0:0","S2|0:0","S5|0:0","S555|0:0","S15|0:0","S12|0:0","S12001|0:0","S11|0:0","S11001|0:0","S1101|0:0","S13|0:0","S14|0:0","S10101|0:0","S10102|0:0","S10103|0:0","S1001|0:0","S1002|0:0","S1003|0:0","S1004|0:0","S1005|0:0","S1006|0:0","S5001|0:0","S5002|0:0","S5003|0:0","S5004|0:0","S5005|0:0","S5006|0:0","S104|0:0","S8|0:0","S105|0:0","S18|0:0","S17|0:0","S6|0:0","S10|0:0"],"hpsPromotion":[]},{"mcid":"","tnjc":"FIFA 2023 - 土超 (8分钟)","cos":false,"hpsBold":[],"csna":"足球","tid":"29506","mst":"46","srid":"4780221632812675975","mcg":1,"cosCorner":false,"cosPunish":false,"cosOutright":false,"mdsc":null,"mc":11,"hpsOvertime":[],"mf":false,"mgt":"1692375000000","maid":"152448","hpsPns":[{"hids":0,"hpid":"1","hpon":7,"hpn":"全场独赢","mid":"2675975","hmm":0,"hshow":"Yes","hpnb":"全场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"4","hpon":4,"hpn":"全场让球","mid":"2675975","hmm":1,"hshow":"Yes","hpnb":"全场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"0.75"},{"hids":0,"hpid":"2","hpon":3,"hpn":"全场大小","mid":"2675975","hmm":1,"hshow":"Yes","hpnb":"全场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":null},{"hids":0,"hpid":"17","hpon":8,"hpn":"上半场独赢","mid":"2675975","hmm":0,"hshow":"Yes","hpnb":"上半场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"19","hpon":6,"hpn":"上半场让球","mid":"2675975","hmm":1,"hshow":"Yes","hpnb":"上半场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"1"},{"hids":0,"hpid":"18","hpon":5,"hpn":"上半场大小","mid":"2675975","hmm":1,"hshow":"Yes","hpnb":"上半场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":"1"}],"mct":0,"tlev":16,"mhlut":"","mo":0,"mp":0,"csid":"1","ms":1,"cmec":"match_status","cos5Minutes":false,"mle":71,"lvs":-1,"malu":["group1/M00/19/48/CgURtmSKng2ANN3qAAAUVxfGEY4204.png"],"hpsData":[{"hps":[{"chpid":"1","hpid":"1","hl":{"hid":"145522052555120271","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"145777058353488561","os":1,"otd":47,"ot":"1","ov":285000,"onb":"主胜","on":"费内巴切","onbl":"","cds":"BE","ots":"T1"},{"oid":"145220146072007220","os":1,"otd":49,"ot":"2","ov":182000,"onb":"客胜","on":"贝西克塔斯","onbl":"","cds":"BE","ots":"T2"},{"oid":"144979255312507431","os":1,"otd":48,"ot":"X","ov":480000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"4","hpid":"4","hl":{"hid":"142956276404542041","hs":0,"hv":"0.5/1","hmt":0,"hn":1,"ol":[{"oid":"143397005152435476","os":1,"otd":3,"ot":"1","ov":178000,"onb":"+0.5/1","on":"+0.5/1","onbl":"","cds":"BE","ots":"T1"},{"oid":"140432076686542453","os":1,"otd":4,"ot":"2","ov":213000,"onb":"-0.5/1","on":"-0.5/1","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"2","hpid":"2","hl":{"hid":"144181215529443373","hs":0,"hv":"4/4.5","hmt":0,"hn":1,"ol":[{"oid":"146149656010933232","os":1,"otd":2,"ot":"Over","ov":187000,"onb":"4/4.5","on":"大 4/4.5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"142765043378160545","os":1,"otd":1,"ot":"Under","ov":203000,"onb":"4/4.5","on":"小 4/4.5","onbl":"小 ","cds":"BE","ots":"T2"}]}},{"chpid":"17","hpid":"17","hl":{"hid":"140303324182544145","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"140385213739114092","os":1,"otd":101,"ot":"1","ov":305000,"onb":"主胜","on":"费内巴切","onbl":"","cds":"BE","ots":"T1"},{"oid":"144901280313568427","os":1,"otd":103,"ot":"2","ov":217000,"onb":"客胜","on":"贝西克塔斯","onbl":"","cds":"BE","ots":"T2"},{"oid":"142703051111952532","os":1,"otd":102,"ot":"X","ov":310000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"19","hpid":"19","hl":{"hid":"149705325480504073","hs":0,"hv":"0/0.5","hmt":0,"hn":1,"ol":[{"oid":"148134404022120315","os":1,"otd":146,"ot":"1","ov":190000,"onb":"+0/0.5","on":"+0/0.5","onbl":"","cds":"BE","ots":"T1"},{"oid":"144593655133296117","os":1,"otd":147,"ot":"2","ov":200000,"onb":"-0/0.5","on":"-0/0.5","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"18","hpid":"18","hl":{"hid":"146530061183079244","hs":0,"hv":"2","hmt":0,"hn":1,"ol":[{"oid":"149405245288411222","os":1,"otd":96,"ot":"Over","ov":196000,"onb":"2","on":"大 2","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"146535852091901517","os":1,"otd":95,"ot":"Under","ov":194000,"onb":"2","on":"小 2","onbl":"小 ","cds":"BE","ots":"T2"}]}}],"hpsAdd":[{"chpid":"1","hpid":"1","hlnm":0,"hl":[]},{"chpid":"4","hpid":"4","hlnm":0,"hl":[]},{"chpid":"2","hpid":"2","hlnm":0,"hl":[]},{"chpid":"17","hpid":"17","hlnm":0,"hl":[]},{"chpid":"19","hpid":"19","hlnm":0,"hl":[]},{"chpid":"18","hpid":"18","hlnm":0,"hl":[]}]}],"hps15Minutes":[],"lurl":"group1/M00/19/48/CgURt2SKnXSAKzpUAAAL8K58qq4986.png","mprmc":"BTS","cosOvertime":false,"mhn":"费内巴切","betAmount":"0.00","cds":"BE","frmhn":["F"],"operationTournamentSort":200,"cos15Minutes":false,"mhs":0,"mlet":"null:00","hps5Minutes":[],"cosPenalty":false,"hpsCorner":[],"mhid":"152453","hpsPunish":[],"mrmc":"","mid":"2675975","mess":1,"cosBold":false,"lss":null,"mmp":"6","mststi":"0","operationHotSortTop":0,"mms":2,"mbmty":2,"regionIdSort":9,"mhlu":["group1/M00/19/3C/CgURtmSG-VmAN6AxAAANot9ps14101.png"],"seid":"","mstst":"0","malut":"","man":"贝西克塔斯","frman":["B"],"mat":"","mng":1,"mststr":"46","mvs":-1,"hpsPenalty":[],"mststs":0,"mearlys":0,"tf":false,"th":0,"cosPromotion":false,"mfo":null,"mft":0,"tn":"FIFA 2023 - 土耳其超级联赛 (8分钟)","msc":["S1|0:0","S2|0:0","S5|0:0","S555|0:0","S15|0:0","S12|0:0","S12001|0:0","S11|0:0","S11001|0:0","S1101|0:0","S13|0:0","S14|0:0","S10101|0:0","S10102|0:0","S10103|0:0","S1001|0:0","S1002|0:0","S1003|0:0","S1004|0:0","S1005|0:0","S1006|0:0","S5001|0:0","S5002|0:0","S5003|0:0","S5004|0:0","S5005|0:0","S5006|0:0","S104|0:0","S8|0:0","S105|0:0","S18|0:0","S17|0:0","S6|0:0","S10|0:0"],"hpsPromotion":[]},{"mcid":"","tnjc":"FIFA 2023 - Volta 国际联赛 (6分钟)","cos":false,"hpsBold":[],"csna":"足球","tid":"31022","mst":"25","srid":"4745055429062675971","mcg":1,"cosCorner":false,"cosPunish":false,"cosOutright":false,"mdsc":null,"mc":10,"hpsOvertime":[],"mf":false,"mgt":"1692375000000","maid":"152457","hpsPns":[{"hids":0,"hpid":"1","hpon":7,"hpn":"全场独赢","mid":"2675971","hmm":0,"hshow":"Yes","hpnb":"全场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"4","hpon":4,"hpn":"全场让球","mid":"2675971","hmm":1,"hshow":"Yes","hpnb":"全场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"0.75"},{"hids":0,"hpid":"2","hpon":3,"hpn":"全场大小","mid":"2675971","hmm":1,"hshow":"Yes","hpnb":"全场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":null},{"hids":0,"hpid":"17","hpon":8,"hpn":"上半场独赢","mid":"2675971","hmm":0,"hshow":"Yes","hpnb":"上半场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"19","hpon":6,"hpn":"上半场让球","mid":"2675971","hmm":1,"hshow":"Yes","hpnb":"上半场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"1"},{"hids":0,"hpid":"18","hpon":5,"hpn":"上半场大小","mid":"2675971","hmm":1,"hshow":"Yes","hpnb":"上半场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":"1"}],"mct":0,"tlev":16,"mhlut":"","mo":0,"mp":0,"csid":"1","ms":1,"cmec":"match_status","cos5Minutes":false,"mle":55,"lvs":-1,"malu":["group1/M00/19/3D/CgURt2SG-niABZ4qAAANULQDvV4336.png"],"hpsData":[{"hps":[{"chpid":"1","hpid":"1","hl":{"hid":"142208480815092153","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"141185335460889118","os":1,"otd":47,"ot":"1","ov":305000,"onb":"主胜","on":"波兰","onbl":"","cds":"BE","ots":"T1"},{"oid":"143807374991231663","os":1,"otd":49,"ot":"2","ov":180000,"onb":"客胜","on":"美国","onbl":"","cds":"BE","ots":"T2"},{"oid":"146437283625223247","os":1,"otd":48,"ot":"X","ov":450000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"4","hpid":"4","hl":{"hid":"142012274274905854","hs":0,"hv":"0.5/1","hmt":0,"hn":1,"ol":[{"oid":"148431070064515703","os":1,"otd":3,"ot":"1","ov":165000,"onb":"+0.5/1","on":"+0.5/1","onbl":"","cds":"BE","ots":"T1"},{"oid":"144482790328150460","os":1,"otd":4,"ot":"2","ov":195000,"onb":"-0.5/1","on":"-0.5/1","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"2","hpid":"2","hl":{"hid":"145448172530856032","hs":0,"hv":"5","hmt":0,"hn":1,"ol":[{"oid":"140001524005347193","os":1,"otd":2,"ot":"Over","ov":186000,"onb":"5","on":"大 5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"143552078141584853","os":1,"otd":1,"ot":"Under","ov":174000,"onb":"5","on":"小 5","onbl":"小 ","cds":"BE","ots":"T2"}]}},{"chpid":"17","hpid":"17","hl":{"hid":"142563990530125551","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"147244118642481516","os":1,"otd":101,"ot":"1","ov":520000,"onb":"主胜","on":"波兰","onbl":"","cds":"BE","ots":"T1"},{"oid":"149358439849774184","os":1,"otd":103,"ot":"2","ov":155000,"onb":"客胜","on":"美国","onbl":"","cds":"BE","ots":"T2"},{"oid":"142743911410825356","os":1,"otd":102,"ot":"X","ov":370000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"19","hpid":"19","hl":{"hid":"146235218033712225","hs":0,"hv":"0.5/1","hmt":0,"hn":1,"ol":[{"oid":"144422404180906078","os":1,"otd":146,"ot":"1","ov":190000,"onb":"+0.5/1","on":"+0.5/1","onbl":"","cds":"BE","ots":"T1"},{"oid":"145509776172940543","os":1,"otd":147,"ot":"2","ov":170000,"onb":"-0.5/1","on":"-0.5/1","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"18","hpid":"18","hl":{"hid":"143863824843026426","hs":0,"hv":"2.5/3","hmt":0,"hn":1,"ol":[{"oid":"149570207759264575","os":1,"otd":96,"ot":"Over","ov":178000,"onb":"2.5/3","on":"大 2.5/3","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"143505668248464217","os":1,"otd":95,"ot":"Under","ov":182000,"onb":"2.5/3","on":"小 2.5/3","onbl":"小 ","cds":"BE","ots":"T2"}]}}],"hpsAdd":[{"chpid":"1","hpid":"1","hlnm":0,"hl":[]},{"chpid":"4","hpid":"4","hlnm":0,"hl":[]},{"chpid":"2","hpid":"2","hlnm":0,"hl":[]},{"chpid":"17","hpid":"17","hlnm":0,"hl":[]},{"chpid":"19","hpid":"19","hlnm":0,"hl":[]},{"chpid":"18","hpid":"18","hlnm":0,"hl":[]}]}],"hps15Minutes":[],"lurl":"group1/M00/19/DA/CgURtWTdWDSAYxBLAAAOBp8zhng167.png","mprmc":"BTS","cosOvertime":false,"mhn":"波兰","betAmount":"0.00","cds":"BE","frmhn":["B"],"operationTournamentSort":260,"cos15Minutes":false,"mhs":0,"mlet":"06:00","hps5Minutes":[],"cosPenalty":false,"hpsCorner":[],"mhid":"152463","hpsPunish":[],"mrmc":"","mid":"2675971","mess":1,"cosBold":false,"lss":null,"mmp":"6","mststi":"0","operationHotSortTop":0,"mms":2,"mbmty":2,"regionIdSort":9,"mhlu":["group1/M00/19/3C/CgURtmSG_DuAMiLsAAAHzPT1slU693.png"],"seid":"","mstst":"0","malut":"","man":"美国","frman":["M"],"mat":"","mng":1,"mststr":"25","mvs":-1,"hpsPenalty":[],"mststs":0,"mearlys":0,"tf":false,"th":0,"cosPromotion":false,"mfo":null,"mft":0,"tn":"FIFA 2023 - Volta 国际联赛 (6分钟)","msc":["S1|0:0","S2|0:0","S5|0:0","S555|0:0","S15|0:0","S12|0:0","S12001|0:0","S11|0:0","S11001|0:0","S1101|0:0","S13|0:0","S14|0:0","S10101|0:0","S10102|0:0","S10103|0:0","S1001|0:0","S1002|0:0","S1003|0:0","S1004|0:0","S1005|0:0","S1006|0:0","S5001|0:0","S5002|0:0","S5003|0:0","S5004|0:0","S5005|0:0","S5006|0:0","S104|0:0","S8|0:0","S105|0:0","S18|0:0","S17|0:0","S6|0:0","S10|0:0"],"hpsPromotion":[]},{"mcid":"","tnjc":"FIFA 2023 - Volta 国际联赛 (6分钟)","cos":false,"hpsBold":[],"csna":"足球","tid":"31022","mst":"50","srid":"4626112970442675973","mcg":1,"cosCorner":false,"cosPunish":false,"cosOutright":false,"mdsc":null,"mc":10,"hpsOvertime":[],"mf":false,"mgt":"1692375000000","maid":"152458","hpsPns":[{"hids":0,"hpid":"1","hpon":7,"hpn":"全场独赢","mid":"2675973","hmm":0,"hshow":"Yes","hpnb":"全场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"4","hpon":4,"hpn":"全场让球","mid":"2675973","hmm":1,"hshow":"Yes","hpnb":"全场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"-0.75"},{"hids":0,"hpid":"2","hpon":3,"hpn":"全场大小","mid":"2675973","hmm":1,"hshow":"Yes","hpnb":"全场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":null},{"hids":0,"hpid":"17","hpon":8,"hpn":"上半场独赢","mid":"2675973","hmm":0,"hshow":"Yes","hpnb":"上半场独赢","hpt":1,"hsw":"1,4,5","mct":null},{"hids":0,"hpid":"19","hpon":6,"hpn":"上半场让球","mid":"2675973","hmm":1,"hshow":"Yes","hpnb":"上半场让球","hpt":2,"hsw":"1,2,3,4,5,6","mct":"1"},{"hids":0,"hpid":"18","hpon":5,"hpn":"上半场大小","mid":"2675973","hmm":1,"hshow":"Yes","hpnb":"上半场大小","hpt":5,"hsw":"1,2,3,4,5,6","mct":"1"}],"mct":0,"tlev":16,"mhlut":"","mo":0,"mp":0,"csid":"1","ms":1,"cmec":"goal","cos5Minutes":false,"mle":55,"lvs":-1,"malu":["group1/M00/19/3C/CgURtmSG-smALSlNAAAISdLZyH8252.png"],"hpsData":[{"hps":[{"chpid":"1","hpid":"1","hl":{"hid":"146160365915239101","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"140163334046745937","os":1,"otd":47,"ot":"1","ov":162000,"onb":"主胜","on":"英格兰","onbl":"","cds":"BE","ots":"T1"},{"oid":"141134262511219073","os":1,"otd":49,"ot":"2","ov":380000,"onb":"客胜","on":"乌克兰","onbl":"","cds":"BE","ots":"T2"},{"oid":"149602041411215190","os":1,"otd":48,"ot":"X","ov":440000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"4","hpid":"4","hl":{"hid":"148950740629593852","hs":0,"hv":"0/0.5","hmt":0,"hn":1,"ol":[{"oid":"140261456740403954","os":1,"otd":3,"ot":"1","ov":171000,"onb":"+0/0.5","on":"+0/0.5","onbl":"","cds":"BE","ots":"T1"},{"oid":"143995400674853536","os":1,"otd":4,"ot":"2","ov":189000,"onb":"-0/0.5","on":"-0/0.5","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"2","hpid":"2","hl":{"hid":"141432933490163468","hs":0,"hv":"4.5/5","hmt":0,"hn":1,"ol":[{"oid":"143064933341237298","os":1,"otd":2,"ot":"Over","ov":179000,"onb":"4.5/5","on":"大 4.5/5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"142794183422533464","os":1,"otd":1,"ot":"Under","ov":181000,"onb":"4.5/5","on":"小 4.5/5","onbl":"小 ","cds":"BE","ots":"T2"}]}},{"chpid":"17","hpid":"17","hl":{"hid":"142145520385395513","hs":0,"hv":null,"hmt":0,"hn":null,"ol":[{"oid":"143355931453095564","os":1,"otd":101,"ot":"1","ov":142000,"onb":"主胜","on":"英格兰","onbl":"","cds":"BE","ots":"T1"},{"oid":"141231462715761772","os":1,"otd":103,"ot":"2","ov":680000,"onb":"客胜","on":"乌克兰","onbl":"","cds":"BE","ots":"T2"},{"oid":"144250942552324504","os":1,"otd":102,"ot":"X","ov":380000,"onb":"平局","on":"平局","onbl":"","cds":"BE","ots":""}]}},{"chpid":"19","hpid":"19","hl":{"hid":"142146513351007050","hs":0,"hv":"0","hmt":0,"hn":1,"ol":[{"oid":"149512142764990419","os":1,"otd":146,"ot":"1","ov":190000,"onb":"0","on":"0","onbl":"","cds":"BE","ots":"T1"},{"oid":"145381330724565360","os":1,"otd":147,"ot":"2","ov":170000,"onb":"0","on":"0","onbl":"","cds":"BE","ots":"T2"}]}},{"chpid":"18","hpid":"18","hl":{"hid":"146430535813959011","hs":0,"hv":"2.5","hmt":0,"hn":1,"ol":[{"oid":"143834405132490512","os":1,"otd":96,"ot":"Over","ov":177000,"onb":"2.5","on":"大 2.5","onbl":"大 ","cds":"BE","ots":"T1"},{"oid":"145053703410325335","os":1,"otd":95,"ot":"Under","ov":183000,"onb":"2.5","on":"小 2.5","onbl":"小 ","cds":"BE","ots":"T2"}]}}],"hpsAdd":[{"chpid":"1","hpid":"1","hlnm":0,"hl":[]},{"chpid":"4","hpid":"4","hlnm":0,"hl":[]},{"chpid":"2","hpid":"2","hlnm":0,"hl":[]},{"chpid":"17","hpid":"17","hlnm":0,"hl":[]},{"chpid":"19","hpid":"19","hlnm":0,"hl":[]},{"chpid":"18","hpid":"18","hlnm":0,"hl":[]}]}],"hps15Minutes":[],"lurl":"group1/M00/19/DA/CgURtWTdWDSAYxBLAAAOBp8zhng167.png","mprmc":"BTS","cosOvertime":false,"mhn":"英格兰","betAmount":"0.00","cds":"BE","frmhn":["Y"],"operationTournamentSort":260,"cos15Minutes":false,"mhs":0,"mlet":"06:00","hps5Minutes":[],"cosPenalty":false,"hpsCorner":[],"mhid":"156874","hpsPunish":[],"mrmc":"","mid":"2675973","mess":1,"cosBold":false,"lss":null,"mmp":"6","mststi":"0","operationHotSortTop":0,"mms":2,"mbmty":2,"regionIdSort":9,"mhlu":["group1/M00/19/86/CgURtWSlLOSAUkI8AAAF-fDtog0783.png"],"seid":"","mstst":"0","malut":"","man":"乌克兰","frman":["W"],"mat":"","mng":1,"mststr":"50","mvs":-1,"hpsPenalty":[],"mststs":0,"mearlys":0,"tf":false,"th":0,"cosPromotion":false,"mfo":null,"mft":0,"tn":"FIFA 2023 - Volta 国际联赛 (6分钟)","msc":["S1|1:0","S2|1:0","S5|0:0","S555|0:0","S15|0:0","S12|0:0","S12001|0:0","S11|0:0","S11001|0:0","S1101|4:1","S13|0:0","S14|0:0","S10101|0:0","S10102|0:0","S10103|0:0","S1001|1:0","S1002|0:0","S1003|0:0","S1004|0:0","S1005|0:0","S1006|0:0","S5001|0:0","S5002|0:0","S5003|0:0","S5004|0:0","S5005|0:0","S5006|0:0","S104|0:0","S8|0:0","S105|0:0","S18|4:1","S17|0:0","S6|0:0","S10|0:0","S50011|0:0","S10011|1:0"],"hpsPromotion":[]}],"pagedata":{"liveCto":0,"cto":"0"}},"msg":"成功","ts":1692375059626}
    // oo=[{a:1},{aaa:[1,2,3]},{b:2},{c:[1,2,3]}]
    // this.clear_any_obj(oo,{});
    // console.error('oo:',oo);

    // this.MatchDataWarehouseInstance = new MatchDataBase();
     this.MatchDataWarehouseInstance;
    // this.MatchDataWarehouseInstance.set_list(oo.data);
    // let aa= [...this.MatchDataWarehouseInstance.list]
    // this.MatchDataWarehouseInstance.set_quick_query_list(oo.data);

    // this.MatchDataWarehouseInstance.set_list(b.data.data,1);
    // this.MatchDataWarehouseInstance.set_quick_query_list(b.data.data,1);


    this.MatchDataWarehouseInstance.set_list(b.data.data);
    // this.MatchDataWarehouseInstance.set_list(oo.data,1);

    // this.MatchDataWarehouseInstance.set_quick_query_list(b.data.data);
    this.MatchDataWarehouseInstance.set_quick_query_list([b.data.data[0]]);
	// this.MatchDataWarehouseInstance.remove_match('2675977');
	this.MatchDataWarehouseInstance.ws_ctr.C105({});
	return
	this.MatchDataWarehouseInstance.upd_match({
	"mcid" : "",
	"tnjc" : "FIFA 2023 - 土超 (8分钟)",
	"cos" : false,
	"hpsBold" : [],
	"csna" : "足球",
	"tid" : "29506",
	"mst" : "14",
	"srid" : "4931375953932675977",
	"mcg" : 1,
	"cosCorner" : false,
	"cosPunish" : false,
	"cosOutright" : false,
	"mdsc" : null,
	"mc" : 11,
	"hpsOvertime" : [],
	"mf" : false,
	"mgt" : "1692375000000",
	"maid" : "152454",
	"hpsPns" : [
		{
			"hids" : 0,
			"hpid" : "1",
			"hpon" : 7,
			"hpn" : "全场独赢",
			"mid" : "2675977",
			"hmm" : 0,
			"hshow" : "Yes",
			"hpnb" : "全场独赢",
			"hpt" : 1,
			"hsw" : "1,4,5",
			"mct" : null
		},
		{
			"hids" : 0,
			"hpid" : "4",
			"hpon" : 4,
			"hpn" : "全场让球",
			"mid" : "2675977",
			"hmm" : 1,
			"hshow" : "Yes",
			"hpnb" : "全场让球",
			"hpt" : 2,
			"hsw" : "1,2,3,4,5,6",
			"mct" : "0.75"
		},
		{
			"hids" : 0,
			"hpid" : "2",
			"hpon" : 3,
			"hpn" : "全场大小",
			"mid" : "2675977",
			"hmm" : 1,
			"hshow" : "Yes",
			"hpnb" : "全场大小",
			"hpt" : 5,
			"hsw" : "1,2,3,4,5,6",
			"mct" : null
		},
		{
			"hids" : 0,
			"hpid" : "17",
			"hpon" : 8,
			"hpn" : "上半场独赢",
			"mid" : "2675977",
			"hmm" : 0,
			"hshow" : "Yes",
			"hpnb" : "上半场独赢",
			"hpt" : 1,
			"hsw" : "1,4,5",
			"mct" : null
		},
		{
			"hids" : 0,
			"hpid" : "19",
			"hpon" : 6,
			"hpn" : "上半场让球",
			"mid" : "2675977",
			"hmm" : 1,
			"hshow" : "Yes",
			"hpnb" : "上半场让球",
			"hpt" : 2,
			"hsw" : "1,2,3,4,5,6",
			"mct" : "1"
		},
		{
			"hids" : 0,
			"hpid" : "18",
			"hpon" : 5,
			"hpn" : "上半场大小",
			"mid" : "2675977",
			"hmm" : 1,
			"hshow" : "Yes",
			"hpnb" : "上半场大小",
			"hpt" : 5,
			"hsw" : "1,2,3,4,5,6",
			"mct" : "1"
		}
	],
	"mct" : 0,
	"tlev" : 16,
	"mhlut" : "",
	"mo" : 0,
	"mp" : 0,
	"csid" : "1",
	"ms" : 1,
	"cmec" : "match_status",
	"cos5Minutes" : false,
	"mle" : 71,
	"lvs" : -1,
	"malu" : [ "group1/M00/19/3D/CgURt2SG-bqAY0TWAAARTD504cY713.png" ],
	"hpsData" : [
		{
			"hps" : [
				{
					"chpid" : "1",
					"hpid" : "1",
					"hl" : {
						"hid" : "149919184365455497-2",
						"hs" : 0,
						"hv" : null,
						"hmt" : 0,
						"hn" : null,
						"ol" : [
							{
								"oid" : "148443311014782458-2",
								"os" : 1,
								"otd" : 47,
								"ot" : "1",
								"ov" : 470000,
								"onb" : "主胜",
								"on" : "代米尔体育",
								"onbl" : "",
								"cds" : "BE",
								"ots" : "T1"
							},
							{
								"oid" : "143274614311153176-2",
								"os" : 1,
								"otd" : 49,
								"ot" : "2",
								"ov" : 166000,
								"onb" : "客胜",
								"on" : "加拉塔萨雷",
								"onbl" : "",
								"cds" : "BE",
								"ots" : "T2"
							},
							{
								"oid" : "144052386230459543-2",
								"os" : 1,
								"otd" : 48,
								"ot" : "X",
								"ov" : 340000,
								"onb" : "平局",
								"on" : "平局",
								"onbl" : "",
								"cds" : "BE",
								"ots" : ""
							}
						]
					}
				},
				{
					"chpid" : "4",
					"hpid" : "4",
					"hl" : {
						"hid" : "148075570158540613",
						"hs" : 0,
						"hv" : "0.5/1",
						"hmt" : 0,
						"hn" : 1,
						"ol" : [
							{
								"oid" : "143104641340024823",
								"os" : 1,
								"otd" : 3,
								"ot" : "1",
								"ov" : 183000,
								"onb" : "+0.5/1",
								"on" : "+0.5/1",
								"onbl" : "",
								"cds" : "BE",
								"ots" : "T1"
							},
							{
								"oid" : "145000154455984052",
								"os" : 1,
								"otd" : 4,
								"ot" : "2",
								"ov" : 181000,
								"onb" : "-0.5/1",
								"on" : "-0.5/1",
								"onbl" : "",
								"cds" : "BE",
								"ots" : "T2"
							}
						]
					}
				},
				{
					"chpid" : "2",
					"hpid" : "2",
					"hl" : {
						"hid" : "141535314503421933",
						"hs" : 0,
						"hv" : "3",
						"hmt" : 0,
						"hn" : 1,
						"ol" : [
							{
								"oid" : "145091585253123373",
								"os" : 1,
								"otd" : 2,
								"ot" : "Over",
								"ov" : 185000,
								"onb" : "3",
								"on" : "大 3",
								"onbl" : "大 ",
								"cds" : "BE",
								"ots" : "T1"
							},
							{
								"oid" : "145712599134918845",
								"os" : 1,
								"otd" : 1,
								"ot" : "Under",
								"ov" : 179000,
								"onb" : "3",
								"on" : "小 3",
								"onbl" : "小 ",
								"cds" : "BE",
								"ots" : "T2"
							}
						]
					}
				},
				{
					"chpid" : "17",
					"hpid" : "17",
					"hl" : {
						"hid" : "141315441514092641",
						"hs" : 0,
						"hv" : null,
						"hmt" : 0,
						"hn" : null,
						"ol" : [
							{
								"oid" : "142705543441150036",
								"os" : 1,
								"otd" : 101,
								"ot" : "1",
								"ov" : 450000,
								"onb" : "主胜",
								"on" : "代米尔体育",
								"onbl" : "",
								"cds" : "BE",
								"ots" : "T1"
							},
							{
								"oid" : "145572049747413025",
								"os" : 1,
								"otd" : 103,
								"ot" : "2",
								"ov" : 203000,
								"onb" : "客胜",
								"on" : "加拉塔萨雷",
								"onbl" : "",
								"cds" : "BE",
								"ots" : "T2"
							},
							{
								"oid" : "141539530202217100",
								"os" : 1,
								"otd" : 102,
								"ot" : "X",
								"ov" : 255000,
								"onb" : "平局",
								"on" : "平局",
								"onbl" : "",
								"cds" : "BE",
								"ots" : ""
							}
						]
					}
				},
				{
					"chpid" : "19",
					"hpid" : "19",
					"hl" : {
						"hid" : "143285122423241435",
						"hs" : 0,
						"hv" : "0/0.5",
						"hmt" : 0,
						"hn" : 1,
						"ol" : [
							{
								"oid" : "140826445322411492",
								"os" : 1,
								"otd" : 146,
								"ot" : "1",
								"ov" : 199000,
								"onb" : "+0/0.5",
								"on" : "+0/0.5",
								"onbl" : "",
								"cds" : "BE",
								"ots" : "T1"
							},
							{
								"oid" : "146362155350552524",
								"os" : 1,
								"otd" : 147,
								"ot" : "2",
								"ov" : 165000,
								"onb" : "-0/0.5",
								"on" : "-0/0.5",
								"onbl" : "",
								"cds" : "BE",
								"ots" : "T2"
							}
						]
					}
				},
				{
					"chpid" : "18",
					"hpid" : "18",
					"hl" : {
						"hid" : "144457284406373911",
						"hs" : 0,
						"hv" : "1.5",
						"hmt" : 0,
						"hn" : 1,
						"ol" : [
							{
								"oid" : "142480547981053850",
								"os" : 1,
								"otd" : 96,
								"ot" : "Over",
								"ov" : 190000,
								"onb" : "1.5",
								"on" : "大 1.5",
								"onbl" : "大 ",
								"cds" : "BE",
								"ots" : "T1"
							},
							{
								"oid" : "141154293325684053",
								"os" : 1,
								"otd" : 95,
								"ot" : "Under",
								"ov" : 174000,
								"onb" : "1.5",
								"on" : "小 1.5",
								"onbl" : "小 ",
								"cds" : "BE",
								"ots" : "T2"
							}
						]
					}
				}
			],
			"hpsAdd" : [
				{
					"chpid" : "1",
					"hpid" : "1",
					"hlnm" : 0,
					"hl" : []
				},
				{
					"chpid" : "4",
					"hpid" : "4",
					"hlnm" : 0,
					"hl" : []
				},
				{
					"chpid" : "2",
					"hpid" : "2",
					"hlnm" : 0,
					"hl" : []
				},
				{
					"chpid" : "17",
					"hpid" : "17",
					"hlnm" : 0,
					"hl" : []
				},
				{
					"chpid" : "19",
					"hpid" : "19",
					"hlnm" : 0,
					"hl" : []
				},
				{
					"chpid" : "18",
					"hpid" : "18",
					"hlnm" : 0,
					"hl" : []
				}
			]
		}
	],
	"hps15Minutes" : [],
	"lurl" : "group1/M00/19/48/CgURt2SKnXSAKzpUAAAL8K58qq4986.png",
	"mprmc" : "BTS",
	"cosOvertime" : false,
	"mhn" : "代米尔体育-2",
	"betAmount" : "0.00",
	"cds" : "BE",
	"frmhn" : [ "D" ],
	"operationTournamentSort" : 200,
	"cos15Minutes" : false,
	"mhs" : 0,
	"mlet" : "null:00",
	"hps5Minutes" : [],
	"cosPenalty" : false,
	"hpsCorner" : [],
	"mhid" : "152491",
	"hpsPunish" : [],
	"mrmc" : "",
	"mid" : "2675977",
	"mess" : 1,
	"cosBold" : false,
	"lss" : null,
	"mmp" : "6",
	"mststi" : "0",
	"operationHotSortTop" : 0,
	"mms" : 2,
	"mbmty" : 2,
	"regionIdSort" : 9,
	"mhlu" : [ "group1/M00/19/3D/CgURtmSHFymASm93AAAVRaGPIgs741.png" ],
	"seid" : "",
	"mstst" : "0",
	"malut" : "",
	"man" : "加拉塔萨雷-2",
	"frman" : [ "J" ],
	"mat" : "",
	"mng" : 1,
	"mststr" : "14",
	"mvs" : -1,
	"hpsPenalty" : [],
	"mststs" : 0,
	"mearlys" : 0,
	"tf" : false,
	"th" : 0,
	"cosPromotion" : false,
	"mfo" : null,
	"mft" : 0,
	"tn" : "FIFA 2023 - 土耳其超级联赛 (8分钟)",
	"msc" : [
		"S1-2|0:0",
		"S2|0:0",
		"S5|0:0",
		"S555|0:0",
		"S15|0:0",
		"S12|0:0",
		"S12001|0:0",
		"S11|0:0",
		"S11001|0:0",
		"S1101|0:0",
		"S13|0:0",
		"S14|0:0",
		"S10101|0:0",
		"S10102|0:0",
		"S10103|0:0",
		"S1001|0:0",
		"S1002|0:0",
		"S1003|0:0",
		"S1004|0:0",
		"S1005|0:0",
		"S1006|0:0",
		"S5001|0:0",
		"S5002|0:0",
		"S5003|0:0",
		"S5004|0:0",
		"S5005|0:0",
		"S5006|0:0",
		"S104|0:0",
		"S8|0:0",
		"S105|0:0",
		"S18|0:0",
		"S17|0:0",
		"S6|0:0",
		"S10|0:0"
	],
	"hpsPromotion" : []
}
,0);
	


    let match_details = {
		"tnjc":"Spain Primera Division","csna":"Football","tid":"320","mst":"303","srid":"10245953","mcg":1,"mdsc":null,"mf":false,"mgt":"1692379800000","maid":"3818","mct":0,"tlev":2,"mhlut":"","mo":0,"mp":1,"csid":"1","ms":1,"cmec":"attack","mle":0,"lvs":-1,"malu":["group1/M00/00/25/CgURt17egX-AVZpKAAAZysFDUbw745.png"],"lurl":"group1/M00/19/99/CgURtWSyM0qAGqpZAAADLH17h_k076.png","mprmc":"PA","mhn":"Mallorca","cds":"BG","frmhn":["M"],"mhs":0,"mlet":"45:00","mhid":"3743","mrmc":"","mid":"2601549","mess":1,"lss":null,"mmp":"6","mststi":"0","mms":2,"mbmty":1,"mhlu":["group1/M00/00/25/CgURt17kE5aAKgY0AAAg-FOvq0A698.png"],"seid":"","mstst":"0","malut":"","man":"Villarreal","frman":["V"],"mat":"","mng":0,"mststr":"303","mvs":1,"mststs":0,"mearlys":0,"mfo":null,"mft":0,"tn":"Spain Primera Division","msc":["S1|0:0","S2|0:0","S5|0:0","S555|0:0","S15|0:0","S12|1:0","S12001|1:0","S11|0:0","S11001|0:0","S1101|0:0","S13|0:0","S14|1:0","S10101|1:0","S10102|1:0","S10103|1:0","S1001|0:0","S1002|0:0","S1003|0:0","S1004|0:0","S1005|0:0","S1006|0:0","S5001|0:0","S5002|0:0","S5003|0:0","S5004|0:0","S5005|0:0","S5006|0:0","S104|4:6","S8|1:1","S105|0:0","S18|0:0","S17|0:0","S6|0:3","S10|0:0","S50011|1:0","S10011|0:0"]};
    let odds_info={"code":"0000000","data":[{"hids":1,"chpid":"2","hlf":1,"hl":[{"hid":"140057031013200158","hon":"31947","hn":1,"hs":0,"ol":[{"otv":"over  2","obv":180000,"cds":"LS","os":1,"ot":"Over","ov":179000,"oid":"141764431890140473","otd":2,"ott":"over ","on":"2","ots":""},{"otv":"under  2","obv":210000,"cds":"LS","os":1,"ot":"Under","ov":209000,"oid":"141133724412532497","otd":1,"ott":"under ","on":"2","ots":""}],"hv":"2","hmt":0,"ad2":"","ad1":""},{"hid":"140101035528092357","hon":"33685","hn":2,"hs":0,"ol":[{"otv":"over  2/2.5","obv":205000,"cds":"LS","os":1,"ot":"Over","ov":211000,"oid":"144025351042479583","otd":2,"ott":"over ","on":"2/2.5","ots":""},{"otv":"under  2/2.5","obv":175000,"cds":"LS","os":1,"ot":"Under","ov":178000,"oid":"140325630870110211","otd":1,"ott":"under ","on":"2/2.5","ots":""}],"hv":"2/2.5","hmt":0,"ad2":"","ad1":""},{"hid":"141407429566429382","hon":"87596","hn":3,"hs":0,"ol":[{"otv":"over  2.5","obv":235000,"cds":"LS","os":1,"ot":"Over","ov":238000,"oid":"145082207514003701","otd":2,"ott":"over ","on":"2.5","ots":""},{"otv":"under  2.5","obv":157000,"cds":"LS","os":1,"ot":"Under","ov":160000,"oid":"142022469027284501","otd":1,"ott":"under ","on":"2.5","ots":""}],"hv":"2.5","hmt":0,"ad2":"","ad1":""},{"hid":"145882062525323424","hon":"94384","hn":4,"hs":0,"ol":[{"otv":"over  1.5/2","obv":155000,"cds":"LS","os":1,"ot":"Over","ov":158000,"oid":"145143402116840383","otd":2,"ott":"over ","on":"1.5/2","ots":""},{"otv":"under  1.5/2","obv":237000,"cds":"LS","os":1,"ot":"Under","ov":242000,"oid":"141393243428905355","otd":1,"ott":"under ","on":"1.5/2","ots":""}],"hv":"1.5/2","hmt":0,"ad2":"","ad1":""},{"hid":"142453839626174533","hon":"152705","hn":5,"hs":0,"ol":[{"otv":"over  1.5","obv":142000,"cds":"LS","os":1,"ot":"Over","ov":144000,"oid":"140034540285552432","otd":2,"ott":"over ","on":"1.5","ots":""},{"otv":"under  1.5","obv":275000,"cds":"LS","os":1,"ot":"Under","ov":278000,"oid":"140184440222331332","otd":1,"ott":"under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"O/U","topKey":"2","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":2},{"osn":"under ","otd":1}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"2","hpon":3,"hton":"1690707812257"},{"hids":1,"chpid":"24","hlf":0,"hl":[{"hid":"144259556540000036","hon":"587900","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":455000,"cds":"AO","os":1,"ot":"Yes","ov":444000,"oid":"143704106801182254","otd":99,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":110000,"cds":"AO","os":1,"ot":"No","ov":110000,"oid":"143256332751091402","otd":100,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Both Team to Score","topKey":"24","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":99},{"osn":"no","otd":100}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"24","hpon":25,"hton":"1681100426423"},{"hids":1,"chpid":"4","hlf":1,"hl":[{"hid":"145042415258505345","hon":"12648","hn":1,"hs":0,"ol":[{"otv":"Mallorca  0","obv":201000,"cds":"LS","os":1,"ot":"1","ov":202000,"oid":"148594545521591534","otd":3,"ott":"Mallorca ","on":"0","ots":""},{"otv":"Villarreal  0","obv":189000,"cds":"LS","os":1,"ot":"2","ov":188000,"oid":"142105045428544944","otd":4,"ott":"Villarreal ","on":"0","ots":""}],"hv":"0","hmt":0,"ad2":"","ad1":""},{"hid":"142124181604003010","hon":"62030","hn":2,"hs":0,"ol":[{"otv":"Mallorca  +0/0.5","obv":165000,"cds":"LS","os":1,"ot":"1","ov":168000,"oid":"144535727729832920","otd":3,"ott":"Mallorca ","on":"+0/0.5","ots":""},{"otv":"Villarreal  -0/0.5","obv":220000,"cds":"LS","os":1,"ot":"2","ov":228000,"oid":"145223189210124381","otd":4,"ott":"Villarreal ","on":"-0/0.5","ots":""}],"hv":"0/0.5","hmt":0,"ad2":"","ad1":""},{"hid":"142025477252255240","hon":"87596","hn":3,"hs":0,"ol":[{"otv":"Mallorca  -0/0.5","obv":235000,"cds":"LS","os":1,"ot":"1","ov":242000,"oid":"141487527997003820","otd":3,"ott":"Mallorca ","on":"-0/0.5","ots":""},{"otv":"Villarreal  +0/0.5","obv":157000,"cds":"LS","os":1,"ot":"2","ov":160000,"oid":"141636049241408004","otd":4,"ott":"Villarreal ","on":"+0/0.5","ots":""}],"hv":"-0/0.5","hmt":0,"ad2":"","ad1":""},{"hid":"140512185224012342","hon":"128388","hn":4,"hs":0,"ol":[{"otv":"Mallorca  +0.5","obv":147000,"cds":"LS","os":1,"ot":"1","ov":150000,"oid":"148211941457648356","otd":3,"ott":"Mallorca ","on":"+0.5","ots":""},{"otv":"Villarreal  -0.5","obv":260000,"cds":"LS","os":1,"ot":"2","ov":266000,"oid":"149250716160225482","otd":4,"ott":"Villarreal ","on":"-0.5","ots":""}],"hv":"0.5","hmt":0,"ad2":"","ad1":""},{"hid":"141759802880342143","hon":"140326","hn":5,"hs":0,"ol":[{"otv":"Mallorca  -0.5","obv":265000,"cds":"LS","os":1,"ot":"1","ov":275000,"oid":"148715004709627061","otd":3,"ott":"Mallorca ","on":"-0.5","ots":""},{"otv":"Villarreal  +0.5","obv":145000,"cds":"LS","os":1,"ot":"2","ov":147000,"oid":"142150429381935147","otd":4,"ott":"Villarreal ","on":"+0.5","ots":""}],"hv":"-0.5","hmt":0,"ad2":"","ad1":""}],"hpn":"Handicap","topKey":"4","mid":"2601549","hmm":1,"hps":"S1|0:0","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca ","otd":3},{"osn":"Villarreal ","otd":4}],"hpt":2,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"4","hpon":4,"hton":"0"},{"hids":1,"chpid":"18","hlf":1,"hl":[{"hid":"143533553016244116","hon":"5399","hn":1,"hs":0,"ol":[{"otv":"over  0.5/1","obv":190000,"cds":"LS","os":1,"ot":"Over","ov":191000,"oid":"141879203459252114","otd":96,"ott":"over ","on":"0.5/1","ots":""},{"otv":"under  0.5/1","obv":195000,"cds":"LS","os":1,"ot":"Under","ov":197000,"oid":"147726520311982717","otd":95,"ott":"under ","on":"0.5/1","ots":""}],"hv":"0.5/1","hmt":0,"ad2":"","ad1":""},{"hid":"145300401251403184","hon":"78943","hn":2,"hs":0,"ol":[{"otv":"over  0.5","obv":160000,"cds":"LS","os":1,"ot":"Over","ov":162000,"oid":"140310356225306244","otd":96,"ott":"over ","on":"0.5","ots":""},{"otv":"under  0.5","obv":230000,"cds":"LS","os":1,"ot":"Under","ov":235000,"oid":"141341515200322810","otd":95,"ott":"under ","on":"0.5","ots":""}],"hv":"0.5","hmt":0,"ad2":"","ad1":""},{"hid":"147528340157406371","hon":"114833","hn":3,"hs":0,"ol":[{"otv":"over  1","obv":250000,"cds":"LS","os":1,"ot":"Over","ov":256000,"oid":"143032510542510390","otd":96,"ott":"over ","on":"1","ots":""},{"otv":"under  1","obv":150000,"cds":"LS","os":1,"ot":"Under","ov":152000,"oid":"145227477179321401","otd":95,"ott":"under ","on":"1","ots":""}],"hv":"1","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - O/U","topKey":"18","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":96},{"osn":"under ","otd":95}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"18","hpon":5,"hton":"0"},{"hids":1,"chpid":"19","hlf":1,"hl":[{"hid":"143094542951128221","hon":"10809","hn":1,"hs":0,"ol":[{"otv":"Mallorca  0","obv":197000,"cds":"LS","os":1,"ot":"1","ov":200000,"oid":"143460070343439072","otd":146,"ott":"Mallorca ","on":"0","ots":""},{"otv":"Villarreal  0","obv":187000,"cds":"LS","os":1,"ot":"2","ov":188000,"oid":"146006404416425002","otd":147,"ott":"Villarreal ","on":"0","ots":""}],"hv":"0","hmt":0,"ad2":"","ad1":""},{"hid":"143151023453146536","hon":"140326","hn":2,"hs":0,"ol":[{"otv":"Mallorca  +0/0.5","obv":145000,"cds":"LS","os":1,"ot":"1","ov":146000,"oid":"144079225708195735","otd":146,"ott":"Mallorca ","on":"+0/0.5","ots":""},{"otv":"Villarreal  -0/0.5","obv":265000,"cds":"LS","os":1,"ot":"2","ov":272000,"oid":"140562205351704453","otd":147,"ott":"Villarreal ","on":"-0/0.5","ots":""}],"hv":"0/0.5","hmt":0,"ad2":"","ad1":""},{"hid":"146264835435045552","hon":"152705","hn":3,"hs":0,"ol":[{"otv":"Mallorca  -0/0.5","obv":275000,"cds":"LS","os":1,"ot":"1","ov":278000,"oid":"147339205703545327","otd":146,"ott":"Mallorca ","on":"-0/0.5","ots":""},{"otv":"Villarreal  +0/0.5","obv":142000,"cds":"LS","os":1,"ot":"2","ov":144000,"oid":"146416064198547153","otd":147,"ott":"Villarreal ","on":"+0/0.5","ots":""}],"hv":"-0/0.5","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Handicap","topKey":"19","mid":"2601549","hmm":1,"hps":"S2|0:0","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca ","otd":146},{"osn":"Villarreal ","otd":147}],"hpt":2,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"19","hpon":6,"hton":"0"},{"hids":1,"chpid":"1","hlf":0,"hl":[{"hid":"145195595565152503","hon":"28143","hn":null,"hs":0,"ol":[{"otv":"Mallorca ","obv":275000,"cds":"LS","os":1,"ot":"1","ov":275000,"oid":"140020193816463531","otd":47,"ott":"Mallorca","on":"","ots":""},{"otv":"draw ","obv":310000,"cds":"LS","os":1,"ot":"X","ov":310000,"oid":"147124756589483074","otd":48,"ott":"draw","on":"","ots":""},{"otv":"Villarreal ","obv":262000,"cds":"LS","os":1,"ot":"2","ov":262000,"oid":"143204493548049532","otd":49,"ott":"Villarreal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1x2","topKey":"1","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":47},{"osn":"draw","otd":48},{"osn":"Villarreal","otd":49}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"1","hpon":7,"hton":"0"},{"hids":1,"chpid":"17","hlf":0,"hl":[{"hid":"142134267710514200","hon":"128733","hn":null,"hs":0,"ol":[{"otv":"Mallorca ","obv":375000,"cds":"LS","os":1,"ot":"1","ov":375000,"oid":"140406005040262093","otd":101,"ott":"Mallorca","on":"","ots":""},{"otv":"draw ","obv":190000,"cds":"LS","os":1,"ot":"X","ov":190000,"oid":"141120123425370595","otd":102,"ott":"draw","on":"","ots":""},{"otv":"Villarreal ","obv":350000,"cds":"LS","os":1,"ot":"2","ov":350000,"oid":"143035893091375441","otd":103,"ott":"Villarreal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - 1x2","topKey":"17","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":101},{"osn":"draw","otd":102},{"osn":"Villarreal","otd":103}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"17","hpon":8,"hton":"0"},{"hids":1,"chpid":"7","hlf":0,"hl":[{"hid":"143071877045340254","hon":"193987800","hn":null,"hs":0,"ol":[{"otv":" 1-0","obv":770000,"cds":"AO","os":1,"ot":"1:0","ov":770000,"oid":"141463477388185626","otd":1,"ott":"","on":"1-0","ots":""},{"otv":" 2-0","obv":1300000,"cds":"AO","os":1,"ot":"2:0","ov":1300000,"oid":"145211111363442332","otd":1,"ott":"","on":"2-0","ots":""},{"otv":" 2-1","obv":1150000,"cds":"AO","os":1,"ot":"2:1","ov":1150000,"oid":"149589938262369776","otd":1,"ott":"","on":"2-1","ots":""},{"otv":" 3-0","obv":3000000,"cds":"AO","os":1,"ot":"3:0","ov":3200000,"oid":"143705436126230458","otd":1,"ott":"","on":"3-0","ots":""},{"otv":" 3-1","obv":2800000,"cds":"AO","os":1,"ot":"3:1","ov":2800000,"oid":"140714465461432171","otd":1,"ott":"","on":"3-1","ots":""},{"otv":" 3-2","obv":4500000,"cds":"AO","os":1,"ot":"3:2","ov":4500000,"oid":"142017531133530123","otd":1,"ott":"","on":"3-2","ots":""},{"otv":" 4-0","obv":8500000,"cds":"AO","os":1,"ot":"4:0","ov":8700000,"oid":"142903901749719923","otd":1,"ott":"","on":"4-0","ots":""},{"otv":" 4-1","obv":7500000,"cds":"AO","os":1,"ot":"4:1","ov":7900000,"oid":"141346277326555530","otd":1,"ott":"","on":"4-1","ots":""},{"otv":" 4-2","obv":11100000,"cds":"AO","os":1,"ot":"4:2","ov":11100000,"oid":"145165595625390572","otd":1,"ott":"","on":"4-2","ots":""},{"otv":" 4-3","obv":16838000,"cds":"AO","os":1,"ot":"4:3","ov":16800000,"oid":"141690048102313959","otd":1,"ott":"","on":"4-3","ots":""},{"otv":" 0-0","obv":850000,"cds":"AO","os":1,"ot":"0:0","ov":860000,"oid":"142631203598212111","otd":0,"ott":"","on":"0-0","ots":""},{"otv":" 1-1","obv":650000,"cds":"AO","os":1,"ot":"1:1","ov":660000,"oid":"144093819738912307","otd":0,"ott":"","on":"1-1","ots":""},{"otv":" 2-2","obv":1900000,"cds":"AO","os":1,"ot":"2:2","ov":1900000,"oid":"142513207206047181","otd":0,"ott":"","on":"2-2","ots":""},{"otv":" 3-3","obv":9000000,"cds":"AO","os":1,"ot":"3:3","ov":9100000,"oid":"143171431344719225","otd":0,"ott":"","on":"3-3","ots":""},{"otv":" 4-4","obv":21916000,"cds":"AO","os":1,"ot":"4:4","ov":21900000,"oid":"145170404899190471","otd":0,"ott":"","on":"4-4","ots":""},{"otv":" Others","obv":5500000,"cds":"AO","os":1,"ot":"Other","ov":5500000,"oid":"144258153804500114","otd":-1,"ott":"","on":"Others","ots":""},{"otv":" 0-1","obv":720000,"cds":"AO","os":1,"ot":"0:1","ov":740000,"oid":"145105499686821232","otd":2,"ott":"","on":"0-1","ots":""},{"otv":" 0-2","obv":1250000,"cds":"AO","os":1,"ot":"0:2","ov":1250000,"oid":"146716529271517096","otd":2,"ott":"","on":"0-2","ots":""},{"otv":" 1-2","obv":1100000,"cds":"AO","os":1,"ot":"1:2","ov":1100000,"oid":"141707291005202788","otd":2,"ott":"","on":"1-2","ots":""},{"otv":" 0-3","obv":3000000,"cds":"AO","os":1,"ot":"0:3","ov":3000000,"oid":"146915111812022782","otd":2,"ott":"","on":"0-3","ots":""},{"otv":" 1-3","obv":2700000,"cds":"AO","os":1,"ot":"1:3","ov":2700000,"oid":"145554241534017728","otd":2,"ott":"","on":"1-3","ots":""},{"otv":" 2-3","obv":4000000,"cds":"AO","os":1,"ot":"2:3","ov":4400000,"oid":"145411830524528067","otd":2,"ott":"","on":"2-3","ots":""},{"otv":" 0-4","obv":8000000,"cds":"AO","os":1,"ot":"0:4","ov":8000000,"oid":"141160137239235523","otd":2,"ott":"","on":"0-4","ots":""},{"otv":" 1-4","obv":7000000,"cds":"AO","os":1,"ot":"1:4","ov":7400000,"oid":"148052128651272485","otd":2,"ott":"","on":"1-4","ots":""},{"otv":" 2-4","obv":10707000,"cds":"AO","os":1,"ot":"2:4","ov":10700000,"oid":"144020433585253048","otd":2,"ott":"","on":"2-4","ots":""},{"otv":" 3-4","obv":16662000,"cds":"AO","os":1,"ot":"3:4","ov":16600000,"oid":"145052403351245931","otd":2,"ott":"","on":"3-4","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Correct Score","topKey":"7","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Draw","otd":0},{"osn":"Villarreal","otd":2}],"hpt":4,"hsw":"1,4,5","hlid":"0","hpid":"7","hpon":9,"hton":"0"},{"hids":1,"chpid":"367","hlf":0,"hl":[{"hid":"145520225142740374","hon":"115300","hn":null,"hs":0,"ol":[{"otv":" 1-0","obv":107000,"cds":"AO","os":1,"ot":"1:0","ov":107000,"oid":"148353065623936841","otd":1,"ott":"","on":"1-0","ots":""},{"otv":" 2-0","obv":101000,"cds":"AO","os":1,"ot":"2:0","ov":101000,"oid":"140531325336535051","otd":1,"ott":"","on":"2-0","ots":""},{"otv":" 2-1","obv":102000,"cds":"AO","os":1,"ot":"2:1","ov":102000,"oid":"143414843522875122","otd":1,"ott":"","on":"2-1","ots":""},{"otv":" 0-0","obv":105000,"cds":"AO","os":1,"ot":"0:0","ov":105000,"oid":"141009333434157588","otd":0,"ott":"","on":"0-0","ots":""},{"otv":" 1-1","obv":109000,"cds":"AO","os":1,"ot":"1:1","ov":109000,"oid":"147939690619901888","otd":0,"ott":"","on":"1-1","ots":""},{"otv":" 0-1","obv":107000,"cds":"AO","os":1,"ot":"0:1","ov":107000,"oid":"143030609193255100","otd":2,"ott":"","on":"0-1","ots":""},{"otv":" 0-2","obv":102000,"cds":"AO","os":1,"ot":"0:2","ov":102000,"oid":"145157149701098402","otd":2,"ott":"","on":"0-2","ots":""},{"otv":" 1-2","obv":103000,"cds":"AO","os":1,"ot":"1:2","ov":103000,"oid":"143714412535737667","otd":2,"ott":"","on":"1-2","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Inverse Correct Score","topKey":"367","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Draw","otd":0},{"osn":"Villarreal","otd":2}],"hpt":4,"hsw":"1,4,5","hlid":"0","hpid":"367","hpon":10,"hton":"0"},{"hids":1,"chpid":"341","hlf":0,"hl":[{"hid":"143420204024528049","hon":"828900300","hn":null,"hs":0,"ol":[{"otv":" 1-0","obv":470000,"cds":"AO","os":1,"ot":"1:0","ov":470000,"oid":"146727054051060324","otd":1,"ott":"","on":"1-0","ots":""},{"otv":" 2-0","obv":1850000,"cds":"AO","os":1,"ot":"2:0","ov":1850000,"oid":"140501401355422241","otd":1,"ott":"","on":"2-0","ots":""},{"otv":" 2-1","obv":3000000,"cds":"AO","os":1,"ot":"2:1","ov":3200000,"oid":"149851500149323398","otd":1,"ott":"","on":"2-1","ots":""},{"otv":" 3-0","obv":6500000,"cds":"AO","os":1,"ot":"3:0","ov":6600000,"oid":"144001541103283755","otd":1,"ott":"","on":"3-0","ots":""},{"otv":" 3-1","obv":8500000,"cds":"AO","os":1,"ot":"3:1","ov":8600000,"oid":"141227612435230233","otd":1,"ott":"","on":"3-1","ots":""},{"otv":" 3-2","obv":11182000,"cds":"AO","os":1,"ot":"3:2","ov":11100000,"oid":"147296604267301031","otd":1,"ott":"","on":"3-2","ots":""},{"otv":" 0-0","obv":242000,"cds":"AO","os":1,"ot":"0:0","ov":242000,"oid":"144312076339074015","otd":0,"ott":"","on":"0-0","ots":""},{"otv":" 1-1","obv":920000,"cds":"AO","os":1,"ot":"1:1","ov":920000,"oid":"145425158935525683","otd":0,"ott":"","on":"1-1","ots":""},{"otv":" 2-2","obv":7000000,"cds":"AO","os":1,"ot":"2:2","ov":7200000,"oid":"149274902510956859","otd":0,"ott":"","on":"2-2","ots":""},{"otv":" 3-3","obv":12142000,"cds":"AO","os":1,"ot":"3:3","ov":12100000,"oid":"145333409900353284","otd":0,"ott":"","on":"3-3","ots":""},{"otv":" Others","obv":8500000,"cds":"AO","os":1,"ot":"Other","ov":8700000,"oid":"144254260580402504","otd":-1,"ott":"","on":"Others","ots":""},{"otv":" 0-1","obv":430000,"cds":"AO","os":1,"ot":"0:1","ov":430000,"oid":"140201588932526343","otd":2,"ott":"","on":"0-1","ots":""},{"otv":" 0-2","obv":1550000,"cds":"AO","os":1,"ot":"0:2","ov":1550000,"oid":"142902505200532144","otd":2,"ott":"","on":"0-2","ots":""},{"otv":" 1-2","obv":3000000,"cds":"AO","os":1,"ot":"1:2","ov":3000000,"oid":"145018055252792133","otd":2,"ott":"","on":"1-2","ots":""},{"otv":" 0-3","obv":5500000,"cds":"AO","os":1,"ot":"0:3","ov":5800000,"oid":"145508637860330450","otd":2,"ott":"","on":"0-3","ots":""},{"otv":" 1-3","obv":8000000,"cds":"AO","os":1,"ot":"1:3","ov":8200000,"oid":"144219338919556246","otd":2,"ott":"","on":"1-3","ots":""},{"otv":" 2-3","obv":11083000,"cds":"AO","os":1,"ot":"2:3","ov":11000000,"oid":"141921189931012282","otd":2,"ott":"","on":"2-3","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Correct Score","topKey":"341","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Draw","otd":0},{"osn":"Villarreal","otd":2}],"hpt":4,"hsw":"1,4,5","hlid":"0","hpid":"341","hpon":11,"hton":"0"},{"hids":1,"chpid":"368","hlf":0,"hl":[{"hid":"141142717250832413","hon":"163300","hn":null,"hs":0,"ol":[{"otv":" 1-0","obv":111000,"cds":"AO","os":1,"ot":"1:0","ov":111000,"oid":"147659367050110495","otd":1,"ott":"","on":"1-0","ots":""},{"otv":" 0-0","obv":158000,"cds":"AO","os":1,"ot":"0:0","ov":158000,"oid":"149414008361330731","otd":0,"ott":"","on":"0-0","ots":""},{"otv":" 1-1","obv":101000,"cds":"AO","os":1,"ot":"1:1","ov":101000,"oid":"141393566410986816","otd":0,"ott":"","on":"1-1","ots":""},{"otv":" 0-1","obv":113000,"cds":"AO","os":1,"ot":"0:1","ov":113000,"oid":"141300101272010435","otd":2,"ott":"","on":"0-1","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Inverse Correct Score","topKey":"368","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Draw","otd":0},{"osn":"Villarreal","otd":2}],"hpt":4,"hsw":"1,4,5","hlid":"0","hpid":"368","hpon":12,"hton":"0"},{"hids":1,"chpid":"342","hlf":0,"hl":[{"hid":"143944858857004353","hon":"152145000","hn":null,"hs":0,"ol":[{"otv":" 1-0","obv":485000,"cds":"AO","os":1,"ot":"1:0","ov":485000,"oid":"140121604356444135","otd":1,"ott":"","on":"1-0","ots":""},{"otv":" 2-0","obv":1350000,"cds":"AO","os":1,"ot":"2:0","ov":1350000,"oid":"142082842695857404","otd":1,"ott":"","on":"2-0","ots":""},{"otv":" 2-1","obv":1900000,"cds":"AO","os":1,"ot":"2:1","ov":1900000,"oid":"141501742195799132","otd":1,"ott":"","on":"2-1","ots":""},{"otv":" 3-0","obv":4000000,"cds":"AO","os":1,"ot":"3:0","ov":4400000,"oid":"141153037769027866","otd":1,"ott":"","on":"3-0","ots":""},{"otv":" 3-1","obv":5500000,"cds":"AO","os":1,"ot":"3:1","ov":5600000,"oid":"143145353540317535","otd":1,"ott":"","on":"3-1","ots":""},{"otv":" 3-2","obv":9000000,"cds":"AO","os":1,"ot":"3:2","ov":9000000,"oid":"146742669314434261","otd":1,"ott":"","on":"3-2","ots":""},{"otv":" 0-0","obv":330000,"cds":"AO","os":1,"ot":"0:0","ov":330000,"oid":"148423134033841053","otd":0,"ott":"","on":"0-0","ots":""},{"otv":" 1-1","obv":700000,"cds":"AO","os":1,"ot":"1:1","ov":710000,"oid":"145399302954030105","otd":0,"ott":"","on":"1-1","ots":""},{"otv":" 2-2","obv":4000000,"cds":"AO","os":1,"ot":"2:2","ov":4400000,"oid":"143545428848123561","otd":0,"ott":"","on":"2-2","ots":""},{"otv":" 3-3","obv":11702000,"cds":"AO","os":1,"ot":"3:3","ov":11700000,"oid":"147578064000517102","otd":0,"ott":"","on":"3-3","ots":""},{"otv":" Others","obv":5000000,"cds":"AO","os":1,"ot":"Other","ov":5300000,"oid":"143213812072304745","otd":-1,"ott":"","on":"Others","ots":""},{"otv":" 0-1","obv":490000,"cds":"AO","os":1,"ot":"0:1","ov":490000,"oid":"140333312059335451","otd":2,"ott":"","on":"0-1","ots":""},{"otv":" 0-2","obv":1350000,"cds":"AO","os":1,"ot":"0:2","ov":1350000,"oid":"140460647273104252","otd":2,"ott":"","on":"0-2","ots":""},{"otv":" 1-2","obv":1900000,"cds":"AO","os":1,"ot":"1:2","ov":1900000,"oid":"145449347473505155","otd":2,"ott":"","on":"1-2","ots":""},{"otv":" 0-3","obv":4000000,"cds":"AO","os":1,"ot":"0:3","ov":4400000,"oid":"140955223406393642","otd":2,"ott":"","on":"0-3","ots":""},{"otv":" 1-3","obv":5500000,"cds":"AO","os":1,"ot":"1:3","ov":5700000,"oid":"142341764997249532","otd":2,"ott":"","on":"1-3","ots":""},{"otv":" 2-3","obv":9000000,"cds":"AO","os":1,"ot":"2:3","ov":9000000,"oid":"146969116276635031","otd":2,"ott":"","on":"2-3","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Correct Score","topKey":"342","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Draw","otd":0},{"osn":"Villarreal","otd":2}],"hpt":4,"hsw":"1,4,5","hlid":"0","hpid":"342","hpon":13,"hton":"0"},{"hids":1,"chpid":"369","hlf":0,"hl":[{"hid":"141521434814503060","hon":"135500","hn":null,"hs":0,"ol":[{"otv":" 1-0","obv":112000,"cds":"AO","os":1,"ot":"1:0","ov":112000,"oid":"142922554311211341","otd":1,"ott":"","on":"1-0","ots":""},{"otv":" 2-0","obv":101000,"cds":"AO","os":1,"ot":"2:0","ov":101000,"oid":"141943239082571352","otd":1,"ott":"","on":"2-0","ots":""},{"otv":" 0-0","obv":125000,"cds":"AO","os":1,"ot":"0:0","ov":125000,"oid":"146720749915417988","otd":0,"ott":"","on":"0-0","ots":""},{"otv":" 1-1","obv":105000,"cds":"AO","os":1,"ot":"1:1","ov":105000,"oid":"144726024465533007","otd":0,"ott":"","on":"1-1","ots":""},{"otv":" 0-1","obv":112000,"cds":"AO","os":1,"ot":"0:1","ov":112000,"oid":"146102152742037426","otd":2,"ott":"","on":"0-1","ots":""},{"otv":" 0-2","obv":101000,"cds":"AO","os":1,"ot":"0:2","ov":101000,"oid":"141972505560804945","otd":2,"ott":"","on":"0-2","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Inverse Correct Score","topKey":"369","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Draw","otd":0},{"osn":"Villarreal","otd":2}],"hpt":4,"hsw":"1,4,5","hlid":"0","hpid":"369","hpon":14,"hton":"0"},{"hids":0,"chpid":"344","hlf":0,"hl":[{"hid":"145539142975284331","hon":"42431500","hn":null,"hs":0,"ol":[{"otv":" 1-0/2-0/3-0","obv":415000,"cds":"AO","os":1,"ot":"1:0/2:0/3:0","ov":415000,"oid":"147030339622090733","otd":1,"ott":"","on":"1-0/2-0/3-0","ots":""},{"otv":" 2-1/3-1/4-1","obv":720000,"cds":"AO","os":1,"ot":"2:1/3:1/4:1","ov":730000,"oid":"147210828323412340","otd":1,"ott":"","on":"2-1/3-1/4-1","ots":""},{"otv":" 3-2/4-2/4-3/5-1","obv":2500000,"cds":"AO","os":1,"ot":"3:2/4:2/4:3/5:1","ov":2500000,"oid":"146633822492704112","otd":1,"ott":"","on":"3-2/4-2/4-3/5-1","ots":""},{"otv":" 4-0/5-0/6-0","obv":4500000,"cds":"AO","os":1,"ot":"4:0/5:0/6:0","ov":4500000,"oid":"148821772772392747","otd":1,"ott":"","on":"4-0/5-0/6-0","ots":""},{"otv":" MallorcawinsOthers","obv":6500000,"cds":"AO","os":1,"ot":"HomeOther","ov":6600000,"oid":"141692116209052204","otd":1,"ott":"","on":"MallorcawinsOthers","ots":""},{"otv":" DrawOthers","obv":300000,"cds":"AO","os":1,"ot":"DrawOther","ov":300000,"oid":"141930553012492564","otd":0,"ott":"","on":"DrawOthers","ots":""},{"otv":" 0-1/0-2/0-3","obv":400000,"cds":"AO","os":1,"ot":"0:1/0:2/0:3","ov":400000,"oid":"140142367365323162","otd":2,"ott":"","on":"0-1/0-2/0-3","ots":""},{"otv":" 1-2/1-3/1-4","obv":700000,"cds":"AO","os":1,"ot":"1:2/1:3/1:4","ov":700000,"oid":"145755127354167430","otd":2,"ott":"","on":"1-2/1-3/1-4","ots":""},{"otv":" 2-3/2-4/3-4/1-5","obv":2400000,"cds":"AO","os":1,"ot":"2:3/2:4/3:4/1:5","ov":2400000,"oid":"149414840324461460","otd":2,"ott":"","on":"2-3/2-4/3-4/1-5","ots":""},{"otv":" 0-4/0-5/0-6","obv":4000000,"cds":"AO","os":1,"ot":"0:4/0:5/0:6","ov":4200000,"oid":"143660262098334308","otd":2,"ott":"","on":"0-4/0-5/0-6","ots":""},{"otv":" VillarrealwinsOthers","obv":6000000,"cds":"AO","os":1,"ot":"AwayOther","ov":6400000,"oid":"145646111163341427","otd":2,"ott":"","on":"VillarrealwinsOthers","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Correct Score (Multi Bet)","topKey":"344","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Draw","otd":0},{"osn":"Villarreal","otd":2}],"hpt":4,"hsw":"1,4,5","hlid":"0","hpid":"344","hpon":15,"hton":"0"},{"hids":1,"chpid":"68","hlf":0,"hl":[{"hid":"149557852197518904","hon":"10807400","hn":null,"hs":0,"ol":[{"otv":" 0-1","obv":275000,"cds":"AO","os":1,"ot":"0-1","ov":275000,"oid":"143452270804292637","otd":0,"ott":"","on":"0-1","ots":""},{"otv":" 2-3","obv":188000,"cds":"AO","os":1,"ot":"2-3","ov":188000,"oid":"140546011976090005","otd":0,"ott":"","on":"2-3","ots":""},{"otv":" 4-6","obv":430000,"cds":"AO","os":1,"ot":"4-6","ov":430000,"oid":"141134594557031454","otd":0,"ott":"","on":"4-6","ots":""},{"otv":" 7+","obv":2700000,"cds":"AO","os":1,"ot":"7+","ov":2700000,"oid":"140444135032720056","otd":0,"ott":"","on":"7+","ots":""}],"hv":"7+","hmt":0,"ad2":"","ad1":""}],"hpn":"Total Goals Range","topKey":"68","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"68","hpon":17,"hton":"0"},{"hids":1,"chpid":"14","hlf":0,"hl":[{"hid":"140302438004255336","hon":"3045700","hn":null,"hs":0,"ol":[{"otv":" 0","obv":820000,"cds":"AO","os":1,"ot":"0","ov":820000,"oid":"147187207541502022","otd":0,"ott":"","on":"0","ots":""},{"otv":" 1","obv":380000,"cds":"AO","os":1,"ot":"1","ov":380000,"oid":"142405977506114354","otd":0,"ott":"","on":"1","ots":""},{"otv":" 2","obv":335000,"cds":"AO","os":1,"ot":"2","ov":335000,"oid":"140115009322009204","otd":0,"ott":"","on":"2","ots":""},{"otv":" 3","obv":435000,"cds":"AO","os":1,"ot":"3","ov":435000,"oid":"140633414572840802","otd":0,"ott":"","on":"3","ots":""},{"otv":" 4","obv":720000,"cds":"AO","os":1,"ot":"4","ov":730000,"oid":"141450111125556075","otd":0,"ott":"","on":"4","ots":""},{"otv":" 5","obv":1400000,"cds":"AO","os":1,"ot":"5","ov":1400000,"oid":"144341942041425385","otd":0,"ott":"","on":"5","ots":""},{"otv":" 6+","obv":2200000,"cds":"AO","os":1,"ot":"6+","ov":2200000,"oid":"142238346633180202","otd":0,"ott":"","on":"6+","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Exact Goals","topKey":"14","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"14","hpon":18,"hton":"0"},{"hids":1,"chpid":"23","hlf":0,"hl":[{"hid":"145455533442414325","hon":"1154900","hn":null,"hs":0,"ol":[{"otv":" 0","obv":242000,"cds":"AO","os":1,"ot":"0","ov":242000,"oid":"143580345033311440","otd":0,"ott":"","on":"0","ots":""},{"otv":" 1","obv":228000,"cds":"AO","os":1,"ot":"1","ov":228000,"oid":"144513133433305760","otd":0,"ott":"","on":"1","ots":""},{"otv":" 2","obv":445000,"cds":"AO","os":1,"ot":"2","ov":445000,"oid":"144013129242441191","otd":0,"ott":"","on":"2","ots":""},{"otv":" 3+","obv":900000,"cds":"AO","os":1,"ot":"3+","ov":910000,"oid":"143552965333977341","otd":0,"ott":"","on":"3+","ots":""}],"hv":"3+","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Exact Goals","topKey":"23","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"23","hpon":19,"hton":"0"},{"hids":1,"chpid":"8","hlf":0,"hl":[{"hid":"145062160800793153","hon":"682200","hn":null,"hs":0,"ol":[{"otv":" 0","obv":268000,"cds":"AO","os":1,"ot":"0","ov":269000,"oid":"147583479601323759","otd":0,"ott":"","on":"0","ots":""},{"otv":" 1","obv":243000,"cds":"AO","os":1,"ot":"1","ov":243000,"oid":"141881204625005759","otd":0,"ott":"","on":"1","ots":""},{"otv":" 2","obv":410000,"cds":"AO","os":1,"ot":"2","ov":410000,"oid":"140214220101052619","otd":0,"ott":"","on":"2","ots":""},{"otv":" 3+","obv":500000,"cds":"AO","os":1,"ot":"3+","ov":510000,"oid":"144483553128220017","otd":0,"ott":"","on":"3+","ots":""}],"hv":"3+","hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca Exact Goals","topKey":"8","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"8","hpon":20,"hton":"0"},{"hids":1,"chpid":"9","hlf":0,"hl":[{"hid":"145900050504156292","hon":"616200","hn":null,"hs":0,"ol":[{"otv":" 0","obv":275000,"cds":"AO","os":1,"ot":"0","ov":278000,"oid":"144330234920565480","otd":0,"ott":"","on":"0","ots":""},{"otv":" 1","obv":244000,"cds":"AO","os":1,"ot":"1","ov":244000,"oid":"146589638580532059","otd":0,"ott":"","on":"1","ots":""},{"otv":" 2","obv":400000,"cds":"AO","os":1,"ot":"2","ov":400000,"oid":"141085930913190816","otd":0,"ott":"","on":"2","ots":""},{"otv":" 3+","obv":500000,"cds":"AO","os":1,"ot":"3+","ov":510000,"oid":"144114399342141466","otd":0,"ott":"","on":"3+","ots":""}],"hv":"3+","hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal Exact Goals","topKey":"9","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"9","hpon":21,"hton":"0"},{"hids":1,"chpid":"21","hlf":0,"hl":[{"hid":"147833844276412695","hon":"8916900","hn":null,"hs":0,"ol":[{"otv":" 0","obv":149000,"cds":"AO","os":1,"ot":"0","ov":149000,"oid":"141575922927123226","otd":0,"ott":"","on":"0","ots":""},{"otv":" 1","obv":295000,"cds":"AO","os":1,"ot":"1","ov":298000,"oid":"148554788341188000","otd":0,"ott":"","on":"1","ots":""},{"otv":" 2","obv":1000000,"cds":"AO","os":1,"ot":"2","ov":1000000,"oid":"145051550332315081","otd":0,"ott":"","on":"2","ots":""},{"otv":" 3+","obv":620000,"cds":"AO","os":1,"ot":"3+","ov":620000,"oid":"140244377581035572","otd":0,"ott":"","on":"3+","ots":""}],"hv":"3+","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Mallorca Exact Goals","topKey":"21","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"21","hpon":22,"hton":"0"},{"hids":1,"chpid":"22","hlf":0,"hl":[{"hid":"141244542006069726","hon":"6985600","hn":null,"hs":0,"ol":[{"otv":" 0","obv":155000,"cds":"AO","os":1,"ot":"0","ov":155000,"oid":"147721800730227643","otd":0,"ott":"","on":"0","ots":""},{"otv":" 1","obv":285000,"cds":"AO","os":1,"ot":"1","ov":285000,"oid":"141825718531248248","otd":0,"ott":"","on":"1","ots":""},{"otv":" 2","obv":900000,"cds":"AO","os":1,"ot":"2","ov":910000,"oid":"142226784903301970","otd":0,"ott":"","on":"2","ots":""},{"otv":" 3+","obv":620000,"cds":"AO","os":1,"ot":"3+","ov":620000,"oid":"144114024452321531","otd":0,"ott":"","on":"3+","ots":""}],"hv":"3+","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Villarreal Exact Goals","topKey":"22","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"22","hpon":23,"hton":"0"},{"hids":1,"chpid":"12","hlf":0,"hl":[{"hid":"143552020965508382","hon":"29100","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":206000,"cds":"AO","os":1,"ot":"Yes","ov":206000,"oid":"145455062242932642","otd":50,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":178000,"cds":"AO","os":1,"ot":"No","ov":178000,"oid":"145570452560343621","otd":51,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Both Teams to Score","topKey":"12","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":50},{"osn":"no","otd":51}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"12","hpon":24,"hton":"0"},{"hids":1,"chpid":"76","hlf":0,"hl":[{"hid":"144493420383447490","hon":"288600","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":330000,"cds":"AO","os":1,"ot":"Yes","ov":332000,"oid":"142102279371954206","otd":320,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":125000,"cds":"AO","os":1,"ot":"No","ov":125000,"oid":"140102257342430122","otd":321,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Both Team to Score","topKey":"76","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":320},{"osn":"no","otd":321}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"76","hpon":26,"hton":"0"},{"hids":0,"chpid":"104","hlf":0,"hl":[{"hid":"149248549723639414","hon":"5289400","hn":null,"hs":0,"ol":[{"otv":"Mallorca/Mallorca ","obv":470000,"cds":"AO","os":1,"ot":"11","ov":470000,"oid":"142842045066784299","otd":353,"ott":"Mallorca/Mallorca","on":"","ots":""},{"otv":"Mallorca/draw ","obv":1600000,"cds":"AO","os":1,"ot":"1X","ov":1600000,"oid":"142235672230526239","otd":354,"ott":"Mallorca/draw","on":"","ots":""},{"otv":"Mallorca/Villarreal ","obv":3000000,"cds":"AO","os":1,"ot":"12","ov":3100000,"oid":"143212002941137180","otd":355,"ott":"Mallorca/Villarreal","on":"","ots":""},{"otv":"draw/Mallorca ","obv":570000,"cds":"AO","os":1,"ot":"X1","ov":580000,"oid":"140510813734224248","otd":356,"ott":"draw/Mallorca","on":"","ots":""},{"otv":"draw/draw ","obv":455000,"cds":"AO","os":1,"ot":"XX","ov":455000,"oid":"143221983431315539","otd":357,"ott":"draw/draw","on":"","ots":""},{"otv":"draw/Villarreal ","obv":570000,"cds":"AO","os":1,"ot":"X2","ov":580000,"oid":"147706635120402319","otd":358,"ott":"draw/Villarreal","on":"","ots":""},{"otv":"Villarreal/Mallorca ","obv":2900000,"cds":"AO","os":1,"ot":"21","ov":2900000,"oid":"141388731227740910","otd":359,"ott":"Villarreal/Mallorca","on":"","ots":""},{"otv":"Villarreal/draw ","obv":1450000,"cds":"AO","os":1,"ot":"2X","ov":1450000,"oid":"141122033825500434","otd":360,"ott":"Villarreal/draw","on":"","ots":""},{"otv":"Villarreal/Villarreal ","obv":425000,"cds":"AO","os":1,"ot":"22","ov":425000,"oid":"148428363830547275","otd":361,"ott":"Villarreal/Villarreal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Half Time/Full-Time","topKey":"104","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca/Mallorca","otd":353},{"osn":"Mallorca/draw","otd":354},{"osn":"Mallorca/Villarreal","otd":355},{"osn":"draw/Mallorca","otd":356},{"osn":"draw/draw","otd":357},{"osn":"draw/Villarreal","otd":358},{"osn":"Villarreal/Mallorca","otd":359},{"osn":"Villarreal/draw","otd":360},{"osn":"Villarreal/Villarreal","otd":361}],"hpt":10,"hsw":"1,4,5","hlid":"0","hpid":"104","hpon":27,"hton":"0"},{"hids":1,"chpid":"340","hlf":0,"hl":[{"hid":"140325901295665945","hon":"8581900","hn":null,"hs":0,"ol":[{"otv":"Mallorca-Win By 1 Goal","obv":430000,"cds":"AO","os":1,"ot":"1And1","ov":430000,"oid":"149514420677103143","otd":1,"ott":"Mallorca-Win By ","on":"1","ots":""},{"otv":"Villarreal-Win By 1 Goal","obv":415000,"cds":"AO","os":1,"ot":"2And1","ov":415000,"oid":"142014932369029170","otd":2,"ott":"Villarreal-Win By ","on":"1","ots":""},{"otv":"Mallorca-Win By 2 Goal","obv":870000,"cds":"AO","os":1,"ot":"1And2","ov":880000,"oid":"143424308581351965","otd":1,"ott":"Mallorca-Win By ","on":"2","ots":""},{"otv":"Villarreal-Win By 2 Goal","obv":820000,"cds":"AO","os":1,"ot":"2And2","ov":830000,"oid":"143115507560635543","otd":2,"ott":"Villarreal-Win By ","on":"2","ots":""},{"otv":"Mallorca-Win By 3 Goal","obv":2200000,"cds":"AO","os":1,"ot":"1And3","ov":2200000,"oid":"140730219370304411","otd":1,"ott":"Mallorca-Win By ","on":"3","ots":""},{"otv":"Villarreal-Win By 3 Goal","obv":2000000,"cds":"AO","os":1,"ot":"2And3","ov":2000000,"oid":"145576421401793003","otd":2,"ott":"Villarreal-Win By ","on":"3","ots":""},{"otv":"Mallorca-Win By 4+ Goal","obv":4500000,"cds":"AO","os":1,"ot":"1And4+","ov":4800000,"oid":"146141458556726145","otd":1,"ott":"Mallorca-Win By ","on":"4+","ots":""},{"otv":"Villarreal-Win By 4+ Goal","obv":4000000,"cds":"AO","os":1,"ot":"2And4+","ov":4400000,"oid":"141802724411400371","otd":2,"ott":"Villarreal-Win By ","on":"4+","ots":""},{"otv":" Draw and Goal","obv":485000,"cds":"AO","os":1,"ot":"X1","ov":485000,"oid":"142394771046559318","otd":0,"ott":"","on":"Draw and Goal","ots":""},{"otv":" None","obv":850000,"cds":"AO","os":1,"ot":"X0","ov":860000,"oid":"146882384565570882","otd":0,"ott":"","on":"None","ots":""}],"hv":"4","hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Winning Margin(4+)","topKey":"340","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Villarreal","otd":2}],"hpt":5,"hsw":"1,4,5","hlid":"0","hpid":"340","hpon":28,"hton":"0"},{"hids":0,"chpid":"359","hlf":0,"hl":[{"hid":"149500575160360121","hon":"1750300","hn":null,"hs":0,"ol":[{"otv":"Mallorca-Win By 1 Goal","obv":460000,"cds":"AO","os":1,"ot":"1And1","ov":460000,"oid":"142454951687642044","otd":1,"ott":"Mallorca-Win By ","on":"1","ots":""},{"otv":"Villarreal-Win By 1 Goal","obv":420000,"cds":"AO","os":1,"ot":"2And1","ov":420000,"oid":"141110735113441147","otd":2,"ott":"Villarreal-Win By ","on":"1","ots":""},{"otv":"Mallorca-Win By 2+ Goal","obv":1550000,"cds":"AO","os":1,"ot":"1And2+","ov":1550000,"oid":"141177000279246166","otd":1,"ott":"Mallorca-Win By ","on":"2+","ots":""},{"otv":"Villarreal-Win By 2+ Goal","obv":1300000,"cds":"AO","os":1,"ot":"2And2+","ov":1300000,"oid":"140007392738110882","otd":2,"ott":"Villarreal-Win By ","on":"2+","ots":""},{"otv":" Draw and Goal","obv":920000,"cds":"AO","os":1,"ot":"X1","ov":920000,"oid":"145674402330555650","otd":0,"ott":"","on":"Draw and Goal","ots":""},{"otv":" None","obv":238000,"cds":"AO","os":1,"ot":"X0","ov":238000,"oid":"140446672544452002","otd":0,"ott":"","on":"None","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Winning Margin","topKey":"359","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Villarreal","otd":2}],"hpt":5,"hsw":"1,4,5","hlid":"0","hpid":"359","hpon":29,"hton":"0"},{"hids":1,"chpid":"3","hlf":1,"hl":[{"hid":"143939285356331151","hon":"496500","hn":1,"hs":0,"ol":[{"otv":"Mallorca  +1","obv":150000,"cds":"AO","os":1,"ot":"1","ov":150000,"oid":"140730919316734340","otd":7,"ott":"Mallorca ","on":"+1","ots":""},{"otv":"Draw (Mallorca+1)","obv":415000,"cds":"AO","os":1,"ot":"X","ov":415000,"oid":"141744231710536027","otd":8,"ott":"Draw ","on":"+1","ots":""},{"otv":"Villarreal  -1","obv":550000,"cds":"AO","os":1,"ot":"2","ov":560000,"oid":"145512453470134724","otd":9,"ott":"Villarreal ","on":"-1","ots":""}],"hv":"1","hmt":0,"ad2":"","ad1":""},{"hid":"147440769703315458","hon":"553500","hn":2,"hs":0,"ol":[{"otv":"Mallorca  -1","obv":600000,"cds":"AO","os":1,"ot":"1","ov":600000,"oid":"143378635334710447","otd":7,"ott":"Mallorca ","on":"-1","ots":""},{"otv":"Draw (Mallorca-1)","obv":430000,"cds":"AO","os":1,"ot":"X","ov":430000,"oid":"141474470402051130","otd":8,"ott":"Draw ","on":"-1","ots":""},{"otv":"Villarreal  +1","obv":146000,"cds":"AO","os":1,"ot":"2","ov":146000,"oid":"145536576806228310","otd":9,"ott":"Villarreal ","on":"+1","ots":""}],"hv":"-1","hmt":0,"ad2":"","ad1":""}],"hpn":"3-Way Handicap","topKey":"3","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca ","otd":7},{"osn":"Draw ","otd":8},{"osn":"Villarreal ","otd":9}],"hpt":7,"hsw":"1,4,5","hlid":"0","hpid":"3","hpon":30,"hton":"0"},{"hids":1,"chpid":"69","hlf":1,"hl":[{"hid":"147735963441320960","hon":"1515000","hn":1,"hs":0,"ol":[{"otv":"Mallorca  +1","obv":130000,"cds":"AO","os":1,"ot":"1","ov":130000,"oid":"143258775705703095","otd":340,"ott":"Mallorca ","on":"+1","ots":""},{"otv":"Draw (Mallorca+1)","obv":405000,"cds":"AO","os":1,"ot":"X","ov":405000,"oid":"149530572115583166","otd":341,"ott":"Draw ","on":"+1","ots":""},{"otv":"Villarreal  -1","obv":1100000,"cds":"AO","os":1,"ot":"2","ov":1100000,"oid":"140274072049092410","otd":342,"ott":"Villarreal ","on":"-1","ots":""}],"hv":"1","hmt":0,"ad2":"","ad1":""},{"hid":"147166364312321304","hon":"1875500","hn":2,"hs":0,"ol":[{"otv":"Mallorca  -1","obv":1300000,"cds":"AO","os":1,"ot":"1","ov":1300000,"oid":"140033454786858024","otd":340,"ott":"Mallorca ","on":"-1","ots":""},{"otv":"Draw (Mallorca-1)","obv":440000,"cds":"AO","os":1,"ot":"X","ov":440000,"oid":"142635793436412409","otd":341,"ott":"Draw ","on":"-1","ots":""},{"otv":"Villarreal  +1","obv":125000,"cds":"AO","os":1,"ot":"2","ov":125000,"oid":"140544110346541498","otd":342,"ott":"Villarreal ","on":"+1","ots":""}],"hv":"-1","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - 3-Way Handicap","topKey":"69","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca ","otd":340},{"osn":"Draw ","otd":341},{"osn":"Villarreal ","otd":342}],"hpt":7,"hsw":"1,4,5","hlid":"0","hpid":"69","hpon":31,"hton":"0"},{"hids":1,"chpid":"6","hlf":0,"hl":[{"hid":"144924814780321953","hon":"18200","hn":null,"hs":0,"ol":[{"otv":" Mallorca or draw","obv":143000,"cds":"AO","os":1,"ot":"1X","ov":143000,"oid":"148407411280948343","otd":10,"ott":"","on":"Mallorca or draw","ots":""},{"otv":" Mallorca or Villarreal","obv":127000,"cds":"AO","os":1,"ot":"12","ov":127000,"oid":"148723425824758938","otd":11,"ott":"","on":"Mallorca or Villarreal","ots":""},{"otv":" draw or Villarreal","obv":139000,"cds":"AO","os":1,"ot":"X2","ov":139000,"oid":"145509182972513522","otd":12,"ott":"","on":"draw or Villarreal","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Double Chance","topKey":"6","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca or draw","otd":10},{"osn":"Mallorca or Villarreal","otd":11},{"osn":"draw or Villarreal","otd":12}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"6","hpon":32,"hton":"0"},{"hids":1,"chpid":"70","hlf":0,"hl":[{"hid":"143651344449929836","hon":"59700","hn":null,"hs":0,"ol":[{"otv":" Mallorca or draw","obv":126000,"cds":"AO","os":1,"ot":"1X","ov":126000,"oid":"141114614533120790","otd":227,"ott":"","on":"Mallorca or draw","ots":""},{"otv":" Mallorca or Villarreal","obv":171000,"cds":"AO","os":1,"ot":"12","ov":171000,"oid":"142423384301922451","otd":228,"ott":"","on":"Mallorca or Villarreal","ots":""},{"otv":" draw or Villarreal","obv":121000,"cds":"AO","os":1,"ot":"X2","ov":121000,"oid":"143144456015204154","otd":229,"ott":"","on":"draw or Villarreal","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Double Chance","topKey":"70","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca or draw","otd":227},{"osn":"Mallorca or Villarreal","otd":228},{"osn":"draw or Villarreal","otd":229}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"70","hpon":33,"hton":"0"},{"hids":1,"chpid":"5","hlf":0,"hl":[{"hid":"147892631476440410","hon":"10100","hn":null,"hs":0,"ol":[{"otv":"Mallorca ","obv":200000,"cds":"AO","os":1,"ot":"1","ov":200000,"oid":"142099156623514334","otd":5,"ott":"Mallorca","on":"","ots":""},{"otv":"Villarreal ","obv":190000,"cds":"AO","os":1,"ot":"2","ov":190000,"oid":"146304483523953255","otd":6,"ott":"Villarreal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Draw No Bet","topKey":"5","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":5},{"osn":"Villarreal","otd":6}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"5","hpon":34,"hton":"0"},{"hids":1,"chpid":"43","hlf":0,"hl":[{"hid":"141124972406202866","hon":"22400","hn":1,"hs":0,"ol":[{"otv":"Mallorca ","obv":205000,"cds":"AO","os":1,"ot":"1","ov":205000,"oid":"143753115277728132","otd":163,"ott":"Mallorca","on":"","ots":""},{"otv":"Villarreal ","obv":183000,"cds":"AO","os":1,"ot":"2","ov":183000,"oid":"141320251156256452","otd":164,"ott":"Villarreal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Draw No Bet","topKey":"43","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca","otd":163},{"osn":"Villarreal","otd":164}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"43","hpon":35,"hton":"0"},{"hids":1,"chpid":"15","hlf":0,"hl":[{"hid":"145876444404099236","hon":"4100","hn":null,"hs":0,"ol":[{"otv":"Odd ","obv":197000,"cds":"AO","os":1,"ot":"Odd","ov":197000,"oid":"142133151237318904","otd":125,"ott":"Odd","on":"","ots":""},{"otv":"Even ","obv":191000,"cds":"AO","os":1,"ot":"Even","ov":191000,"oid":"147513424515545355","otd":126,"ott":"Even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Odd/Even","topKey":"15","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Odd","otd":125},{"osn":"Even","otd":126}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"15","hpon":36,"hton":"0"},{"hids":1,"chpid":"42","hlf":0,"hl":[{"hid":"145140281110800854","hon":"61600","hn":null,"hs":0,"ol":[{"otv":"odd ","obv":225000,"cds":"AO","os":1,"ot":"Odd","ov":225000,"oid":"144471628342102125","otd":161,"ott":"odd","on":"","ots":""},{"otv":"even ","obv":166000,"cds":"AO","os":1,"ot":"Even","ov":166000,"oid":"145097102026441970","otd":162,"ott":"even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Odd/Even","topKey":"42","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"odd","otd":161},{"osn":"even","otd":162}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"42","hpon":37,"hton":"0"},{"hids":1,"chpid":"373","hlf":0,"hl":[{"hid":"140555283812751401","hon":"193700","hn":null,"hs":0,"ol":[{"otv":"odd ","obv":285000,"cds":"AO","os":1,"ot":"Odd","ov":285000,"oid":"145117324304333474","otd":1199,"ott":"odd","on":"","ots":""},{"otv":"even ","obv":134000,"cds":"AO","os":1,"ot":"Even","ov":134000,"oid":"145046649330398842","otd":1198,"ott":"even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st Half - Mallorca Odd/Even","topKey":"373","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"odd","otd":1199},{"osn":"even","otd":1198}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"373","hpon":38,"hton":"0"},{"hids":1,"chpid":"374","hlf":0,"hl":[{"hid":"140294658060323652","hon":"172600","hn":null,"hs":0,"ol":[{"otv":"odd ","obv":275000,"cds":"AO","os":1,"ot":"Odd","ov":275000,"oid":"141493373802158202","otd":1204,"ott":"odd","on":"","ots":""},{"otv":"even ","obv":137000,"cds":"AO","os":1,"ot":"Even","ov":137000,"oid":"143143415003057567","otd":1205,"ott":"even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st Half - Villarreal Odd/Even","topKey":"374","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"odd","otd":1204},{"osn":"even","otd":1205}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"374","hpon":39,"hton":"0"},{"hids":1,"chpid":"377","hlf":0,"hl":[{"hid":"140063930452743333","hon":"111800","hn":null,"hs":0,"ol":[{"otv":"odd ","obv":242000,"cds":"AO","os":1,"ot":"Odd","ov":242000,"oid":"142400982131895092","otd":1219,"ott":"odd","on":"","ots":""},{"otv":"even ","obv":150000,"cds":"AO","os":1,"ot":"Even","ov":150000,"oid":"145194020221219171","otd":1220,"ott":"even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd Half Mallorca Odd/Even","topKey":"377","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"odd","otd":1219},{"osn":"even","otd":1220}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"377","hpon":40,"hton":"0"},{"hids":1,"chpid":"378","hlf":0,"hl":[{"hid":"144341212256353569","hon":"113400","hn":null,"hs":0,"ol":[{"otv":"odd ","obv":242000,"cds":"AO","os":1,"ot":"Odd","ov":242000,"oid":"145492375131292853","otd":1197,"ott":"odd","on":"","ots":""},{"otv":"even ","obv":150000,"cds":"AO","os":1,"ot":"Even","ov":150000,"oid":"145510920631163015","otd":1196,"ott":"even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd Half Villarreal Odd/Even","topKey":"378","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"odd","otd":1197},{"osn":"even","otd":1196}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"378","hpon":41,"hton":"0"},{"hids":1,"chpid":"10","hlf":1,"hl":[{"hid":"140161518044428000","hon":"159900","hn":1,"hs":0,"ol":[{"otv":"over  0.5","obv":141000,"cds":"AO","os":1,"ot":"Over","ov":141000,"oid":"142538575014192310","otd":115,"ott":"over ","on":"0.5","ots":""},{"otv":"under  0.5","obv":268000,"cds":"AO","os":1,"ot":"Under","ov":269000,"oid":"141713446141324581","otd":114,"ott":"under ","on":"0.5","ots":""}],"hv":"0.5","hmt":0,"ad2":"","ad1":""},{"hid":"149313199594030150","hon":"177600","hn":2,"hs":0,"ol":[{"otv":"over  1.5","obv":280000,"cds":"AO","os":1,"ot":"Over","ov":281000,"oid":"149456217644582408","otd":115,"ott":"over ","on":"1.5","ots":""},{"otv":"under  1.5","obv":137000,"cds":"AO","os":1,"ot":"Under","ov":137000,"oid":"143475406796835235","otd":114,"ott":"under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca Total Goals","topKey":"10","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":115},{"osn":"under ","otd":114}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"10","hpon":42,"hton":"0"},{"hids":1,"chpid":"11","hlf":1,"hl":[{"hid":"145911043764204846","hon":"161600","hn":1,"hs":0,"ol":[{"otv":"over  1.5","obv":272000,"cds":"AO","os":1,"ot":"Over","ov":272000,"oid":"141473995728278213","otd":117,"ott":"over ","on":"1.5","ots":""},{"otv":"under  1.5","obv":140000,"cds":"AO","os":1,"ot":"Under","ov":140000,"oid":"148571506250548041","otd":116,"ott":"under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""},{"hid":"140401472215536255","hon":"173800","hn":2,"hs":0,"ol":[{"otv":"over  0.5","obv":138000,"cds":"AO","os":1,"ot":"Over","ov":138000,"oid":"140401238365340049","otd":117,"ott":"over ","on":"0.5","ots":""},{"otv":"under  0.5","obv":275000,"cds":"AO","os":1,"ot":"Under","ov":278000,"oid":"140400253350985709","otd":116,"ott":"under ","on":"0.5","ots":""}],"hv":"0.5","hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal Total Goals","topKey":"11","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":117},{"osn":"under ","otd":116}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"11","hpon":43,"hton":"0"},{"hids":1,"chpid":"81","hlf":0,"hl":[{"hid":"144148330051093347","hon":"173800","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":275000,"cds":"AO","os":1,"ot":"Yes","ov":278000,"oid":"143985133219114148","otd":330,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":138000,"cds":"AO","os":1,"ot":"No","ov":138000,"oid":"142001125425454028","otd":331,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca Clean Sheet","topKey":"81","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":330},{"osn":"no","otd":331}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"81","hpon":44,"hton":"0"},{"hids":1,"chpid":"79","hlf":0,"hl":[{"hid":"145002086341279210","hon":"159900","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":268000,"cds":"AO","os":1,"ot":"Yes","ov":269000,"oid":"149405452935426302","otd":326,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":141000,"cds":"AO","os":1,"ot":"No","ov":141000,"oid":"144225674539634743","otd":327,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal Clean Sheet","topKey":"79","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":326},{"osn":"no","otd":327}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"79","hpon":45,"hton":"0"},{"hids":1,"chpid":"375","hlf":0,"hl":[{"hid":"143178858010405085","hon":"322300","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":340000,"cds":"AO","os":1,"ot":"Yes","ov":343000,"oid":"145134153081142093","otd":1201,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":121000,"cds":"AO","os":1,"ot":"No","ov":121000,"oid":"141600013489855200","otd":1200,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st Half Mallorca To Win to Nil","topKey":"375","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":1201},{"osn":"no","otd":1200}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"375","hpon":46,"hton":"0"},{"hids":1,"chpid":"376","hlf":0,"hl":[{"hid":"140544015526984914","hon":"269700","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":315000,"cds":"AO","os":1,"ot":"Yes","ov":317000,"oid":"149358131115348220","otd":1202,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":126000,"cds":"AO","os":1,"ot":"No","ov":126000,"oid":"146132764487225000","otd":1203,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st Half Villarreal To Win to Nil","topKey":"376","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":1202},{"osn":"no","otd":1203}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"376","hpon":47,"hton":"0"},{"hids":1,"chpid":"381","hlf":0,"hl":[{"hid":"145213820136065644","hon":"264200","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":315000,"cds":"AO","os":1,"ot":"Yes","ov":317000,"oid":"143570342942904093","otd":1195,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":126000,"cds":"AO","os":1,"ot":"No","ov":126000,"oid":"146751238980070964","otd":1194,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd Half - Mallorca To Win to Nil","topKey":"381","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":1195},{"osn":"no","otd":1194}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"381","hpon":48,"hton":"0"},{"hids":1,"chpid":"382","hlf":0,"hl":[{"hid":"144042183980821553","hon":"269700","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":315000,"cds":"AO","os":1,"ot":"Yes","ov":317000,"oid":"146083233232313489","otd":1213,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":126000,"cds":"AO","os":1,"ot":"No","ov":126000,"oid":"143027211161849352","otd":1214,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd Half - Villarreal To Win to Nil","topKey":"382","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":1213},{"osn":"no","otd":1214}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"382","hpon":49,"hton":"0"},{"hids":1,"chpid":"82","hlf":0,"hl":[{"hid":"147139810007251654","hon":"346100","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":360000,"cds":"AO","os":1,"ot":"Yes","ov":363000,"oid":"143351839692518367","otd":332,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":120000,"cds":"AO","os":1,"ot":"No","ov":120000,"oid":"146458071186554394","otd":333,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca to Win to Nil","topKey":"82","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":332},{"osn":"no","otd":333}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"82","hpon":50,"hton":"0"},{"hids":1,"chpid":"80","hlf":0,"hl":[{"hid":"146736155177848314","hon":"319500","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":350000,"cds":"AO","os":1,"ot":"Yes","ov":350000,"oid":"145992205354612258","otd":328,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":122000,"cds":"AO","os":1,"ot":"No","ov":122000,"oid":"142660843855822854","otd":329,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal to Win to Nil","topKey":"80","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":328},{"osn":"no","otd":329}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"80","hpon":51,"hton":"0"},{"hids":1,"chpid":"16","hlf":0,"hl":[{"hid":"140699525095049603","hon":"159200","hn":null,"hs":0,"ol":[{"otv":"1st half ","obv":335000,"cds":"AO","os":1,"ot":"FirstHalf","ov":335000,"oid":"142868110124953750","otd":122,"ott":"1st half","on":"","ots":""},{"otv":"2nd half ","obv":202000,"cds":"AO","os":1,"ot":"SecondHalf","ov":202000,"oid":"143191840116350843","otd":123,"ott":"2nd half","on":"","ots":""},{"otv":"equal ","obv":320000,"cds":"AO","os":1,"ot":"Equals","ov":320000,"oid":"141021490514513744","otd":124,"ott":"equal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Highest Scoring Half - 1X2","topKey":"16","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"1st half","otd":122},{"osn":"2nd half","otd":123},{"osn":"equal","otd":124}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"16","hpon":55,"hton":"0"},{"hids":1,"chpid":"2801","hlf":0,"hl":[{"hid":"140502054544625915","hon":"767100","hn":null,"hs":0,"ol":[{"otv":"Mallorca ","obv":208000,"cds":"AO","os":1,"ot":"1","ov":208000,"oid":"140781533316942869","otd":148,"ott":"Mallorca","on":"","ots":""},{"otv":"none ","obv":850000,"cds":"AO","os":1,"ot":"None","ov":860000,"oid":"144722504235979297","otd":149,"ott":"none","on":"","ots":""},{"otv":"Villarreal ","obv":197000,"cds":"AO","os":1,"ot":"2","ov":197000,"oid":"142558441396501016","otd":150,"ott":"Villarreal","on":"","ots":""}],"hv":"1","hmt":0,"ad2":"","ad1":""}],"hpn":"1st Goal (1x2)","topKey":"28-1","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":148},{"osn":"none","otd":149},{"osn":"Villarreal","otd":150}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"28","hpon":57,"hton":"0"},{"hids":1,"chpid":"33601","hlf":0,"hl":[{"hid":"144554908027324350","hon":"11700","hn":null,"hs":0,"ol":[{"otv":"Mallorca  ","obv":197000,"cds":"AO","os":1,"ot":"1","ov":197000,"oid":"143703252106883770","otd":1050,"ott":"Mallorca ","on":"","ots":""},{"otv":"Villarreal  ","obv":185000,"cds":"AO","os":1,"ot":"2","ov":185000,"oid":"147135954341431851","otd":1051,"ott":"Villarreal ","on":"","ots":""}],"hv":"1","hmt":0,"ad2":"","ad1":""}],"hpn":"1st Goal (DNB)","topKey":"336-1","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca ","otd":1050},{"osn":"Villarreal ","otd":1051}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"336","hpon":58,"hton":"0"},{"hids":0,"chpid":"351","hlf":0,"hl":[{"hid":"141418424612213651","hon":"453300","hn":null,"hs":0,"ol":[{"otv":"odd & over  2.5","obv":340000,"cds":"AO","os":1,"ot":"OddAndOver","ov":340000,"oid":"140295722711008326","otd":1118,"ott":"odd & over ","on":"2.5","ots":""},{"otv":"odd & under  2.5","obv":380000,"cds":"AO","os":1,"ot":"OddAndUnder","ov":380000,"oid":"145340434534232748","otd":1119,"ott":"odd & under ","on":"2.5","ots":""},{"otv":"even & over  2.5","obv":600000,"cds":"AO","os":1,"ot":"EvenAndOver","ov":610000,"oid":"143552044930402386","otd":1120,"ott":"even & over ","on":"2.5","ots":""},{"otv":"even & under  2.5","obv":248000,"cds":"AO","os":1,"ot":"EvenAndUnder","ov":248000,"oid":"141449184036235104","otd":1121,"ott":"even & under ","on":"2.5","ots":""}],"hv":"2.5","hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Odd/Even & Total","topKey":"351","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"odd & over ","otd":1118},{"osn":"odd & under ","otd":1119},{"osn":"even & over ","otd":1120},{"osn":"even & under ","otd":1121}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"351","hpon":59,"hton":"0"},{"hids":0,"chpid":"102","hlf":0,"hl":[{"hid":"141195794138310249","hon":"1231100","hn":null,"hs":0,"ol":[{"otv":" over 2.5 & yes","obv":265000,"cds":"AO","os":1,"ot":"OverAndYes","ov":266000,"oid":"148033924098113982","otd":349,"ott":"","on":"over 2.5 & yes","ots":""},{"otv":" under 2.5 & yes","obv":600000,"cds":"AO","os":1,"ot":"UnderAndYes","ov":600000,"oid":"140072114170034508","otd":350,"ott":"","on":"under 2.5 & yes","ots":""},{"otv":" over 2.5 & no","obv":1000000,"cds":"AO","os":1,"ot":"OverAndNo","ov":1000000,"oid":"143748565041732967","otd":351,"ott":"","on":"over 2.5 & no","ots":""},{"otv":" under 2.5 & no","obv":192000,"cds":"AO","os":1,"ot":"UnderAndNo","ov":192000,"oid":"140084530870854630","otd":352,"ott":"","on":"under 2.5 & no","ots":""}],"hv":"2.5","hmt":0,"ad2":"","ad1":""}],"hpn":"Total Goals & Both Teams to Score","topKey":"102","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"over {total} & yes","otd":349},{"osn":"under {total} & yes","otd":350},{"osn":"over {total} & no","otd":351},{"osn":"under {total} & no","otd":352}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"102","hpon":60,"hton":"0"},{"hids":1,"chpid":"13","hlf":0,"hl":[{"hid":"145949053301101754","hon":"581200","hn":1,"hs":0,"ol":[{"otv":" Mallorca & over 1.5","obv":375000,"cds":"AO","os":1,"ot":"1AndOver","ov":375000,"oid":"144191042744915488","otd":14,"ott":"","on":"Mallorca & over 1.5","ots":""},{"otv":" Mallorca & under 1.5","obv":720000,"cds":"AO","os":1,"ot":"1AndUnder","ov":720000,"oid":"143831402442465295","otd":13,"ott":"","on":"Mallorca & under 1.5","ots":""},{"otv":" draw & over 1.5","obv":470000,"cds":"AO","os":1,"ot":"XAndOver","ov":470000,"oid":"147847950225982304","otd":16,"ott":"","on":"draw & over 1.5","ots":""},{"otv":" draw & under 1.5","obv":800000,"cds":"AO","os":1,"ot":"XAndUnder","ov":800000,"oid":"141392493060080138","otd":15,"ott":"","on":"draw & under 1.5","ots":""},{"otv":" Villarreal & over 1.5","obv":355000,"cds":"AO","os":1,"ot":"2AndOver","ov":355000,"oid":"145641893525472945","otd":18,"ott":"","on":"Villarreal & over 1.5","ots":""},{"otv":" Villarreal & under 1.5","obv":700000,"cds":"AO","os":1,"ot":"2AndUnder","ov":700000,"oid":"143576714625152165","otd":17,"ott":"","on":"Villarreal & under 1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"1x2 & Total Goals","topKey":"13","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca & over ","otd":14},{"osn":"Mallorca & under ","otd":13},{"osn":"draw & over ","otd":16},{"osn":"draw & under ","otd":15},{"osn":"Villarreal & over ","otd":18},{"osn":"Villarreal & under ","otd":17}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"13","hpon":61,"hton":"0"},{"hids":0,"chpid":"101","hlf":0,"hl":[{"hid":"144471672874108498","hon":"535200","hn":null,"hs":0,"ol":[{"otv":"Mallorca & yes ","obv":600000,"cds":"AO","os":1,"ot":"1AndYes","ov":610000,"oid":"141433257148334070","otd":343,"ott":"Mallorca & yes","on":"","ots":""},{"otv":"Mallorca & no ","obv":415000,"cds":"AO","os":1,"ot":"1AndNo","ov":415000,"oid":"140018762832569305","otd":344,"ott":"Mallorca & no","on":"","ots":""},{"otv":"draw & yes ","obv":470000,"cds":"AO","os":1,"ot":"XAndYes","ov":470000,"oid":"146561852943334550","otd":345,"ott":"draw & yes","on":"","ots":""},{"otv":"draw & no ","obv":800000,"cds":"AO","os":1,"ot":"XAndNo","ov":800000,"oid":"140502154633635089","otd":346,"ott":"draw & no","on":"","ots":""},{"otv":"Villarreal & yes ","obv":570000,"cds":"AO","os":1,"ot":"2AndYes","ov":590000,"oid":"142211273321989562","otd":347,"ott":"Villarreal & yes","on":"","ots":""},{"otv":"Villarreal & no ","obv":390000,"cds":"AO","os":1,"ot":"2AndNo","ov":390000,"oid":"144184817642693285","otd":348,"ott":"Villarreal & no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1x2 & Both Teams to Score","topKey":"101","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca & yes","otd":343},{"osn":"Mallorca & no","otd":344},{"osn":"draw & yes","otd":345},{"osn":"draw & no","otd":346},{"osn":"Villarreal & yes","otd":347},{"osn":"Villarreal & no","otd":348}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"101","hpon":62,"hton":"0"},{"hids":0,"chpid":"345","hlf":0,"hl":[{"hid":"144503343245431096","hon":"1167500","hn":null,"hs":0,"ol":[{"otv":"Mallorca & over  1.5","obv":1150000,"cds":"AO","os":1,"ot":"1AndOver","ov":1150000,"oid":"146872974051412934","otd":1060,"ott":"Mallorca & over ","on":"1.5","ots":""},{"otv":"Mallorca & under  1.5","obv":500000,"cds":"AO","os":1,"ot":"1AndUnder","ov":510000,"oid":"140727112604000477","otd":1061,"ott":"Mallorca & under ","on":"1.5","ots":""},{"otv":"draw & over  1.5","obv":920000,"cds":"AO","os":1,"ot":"XAndOver","ov":920000,"oid":"145531153143184133","otd":1062,"ott":"draw & over ","on":"1.5","ots":""},{"otv":"draw & under  1.5","obv":238000,"cds":"AO","os":1,"ot":"XAndUnder","ov":238000,"oid":"141004112311901596","otd":1063,"ott":"draw & under ","on":"1.5","ots":""},{"otv":"Villarreal & over  1.5","obv":1000000,"cds":"AO","os":1,"ot":"2AndOver","ov":1000000,"oid":"141414538437005310","otd":1064,"ott":"Villarreal & over ","on":"1.5","ots":""},{"otv":"Villarreal & under  1.5","obv":465000,"cds":"AO","os":1,"ot":"2AndUnder","ov":465000,"oid":"143041234516160628","otd":1065,"ott":"Villarreal & under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - 1x2 & Total","topKey":"345","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca & over ","otd":1060},{"osn":"Mallorca & under ","otd":1061},{"osn":"draw & over ","otd":1062},{"osn":"draw & under ","otd":1063},{"osn":"Villarreal & over ","otd":1064},{"osn":"Villarreal & under ","otd":1065}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"345","hpon":64,"hton":"0"},{"hids":0,"chpid":"346","hlf":0,"hl":[{"hid":"141614294316441034","hon":"407400","hn":null,"hs":0,"ol":[{"otv":"Mallorca & over  1.5","obv":670000,"cds":"AO","os":1,"ot":"1AndOver","ov":680000,"oid":"143822670371422538","otd":1066,"ott":"Mallorca & over ","on":"1.5","ots":""},{"otv":"Mallorca & under  1.5","obv":500000,"cds":"AO","os":1,"ot":"1AndUnder","ov":500000,"oid":"142321589904500402","otd":1067,"ott":"Mallorca & under ","on":"1.5","ots":""},{"otv":"draw & over  1.5","obv":650000,"cds":"AO","os":1,"ot":"XAndOver","ov":660000,"oid":"146108206455023399","otd":1068,"ott":"draw & over ","on":"1.5","ots":""},{"otv":"draw & under  1.5","obv":345000,"cds":"AO","os":1,"ot":"XAndUnder","ov":345000,"oid":"147204420163580213","otd":1069,"ott":"draw & under ","on":"1.5","ots":""},{"otv":"Villarreal & over  1.5","obv":670000,"cds":"AO","os":1,"ot":"2AndOver","ov":690000,"oid":"142911654922412544","otd":1070,"ott":"Villarreal & over ","on":"1.5","ots":""},{"otv":"Villarreal & under  1.5","obv":500000,"cds":"AO","os":1,"ot":"2AndUnder","ov":510000,"oid":"140560214002264317","otd":1071,"ott":"Villarreal & under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - 1x2 & Total","topKey":"346","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca & over ","otd":1066},{"osn":"Mallorca & under ","otd":1067},{"osn":"draw & over ","otd":1068},{"osn":"draw & under ","otd":1069},{"osn":"Villarreal & over ","otd":1070},{"osn":"Villarreal & under ","otd":1071}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"346","hpon":65,"hton":"0"},{"hids":0,"chpid":"107","hlf":0,"hl":[{"hid":"149744575211132020","hon":"125900","hn":null,"hs":0,"ol":[{"otv":"Mallorca/draw & yes ","obv":282000,"cds":"AO","os":1,"ot":"1XAndYes","ov":283000,"oid":"142315042050764004","otd":374,"ott":"Mallorca/draw & yes","on":"","ots":""},{"otv":"Mallorca/draw & no ","obv":285000,"cds":"AO","os":1,"ot":"1XAndNo","ov":289000,"oid":"145392079771026343","otd":375,"ott":"Mallorca/draw & no","on":"","ots":""},{"otv":"Mallorca/Villarreal & yes ","obv":320000,"cds":"AO","os":1,"ot":"12AndYes","ov":320000,"oid":"148083551718210850","otd":376,"ott":"Mallorca/Villarreal & yes","on":"","ots":""},{"otv":"Mallorca/Villarreal & no ","obv":211000,"cds":"AO","os":1,"ot":"12AndNo","ov":211000,"oid":"140640051833302002","otd":377,"ott":"Mallorca/Villarreal & no","on":"","ots":""},{"otv":"draw/Villarreal & yes ","obv":275000,"cds":"AO","os":1,"ot":"X2AndYes","ov":278000,"oid":"141119519201011906","otd":378,"ott":"draw/Villarreal & yes","on":"","ots":""},{"otv":"draw/Villarreal & no ","obv":275000,"cds":"AO","os":1,"ot":"X2AndNo","ov":279000,"oid":"146423014845641536","otd":379,"ott":"draw/Villarreal & no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Double Chance & Both Teams to Score","topKey":"107","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca/draw & yes","otd":374},{"osn":"Mallorca/draw & no","otd":375},{"osn":"Mallorca/Villarreal & yes","otd":376},{"osn":"Mallorca/Villarreal & no","otd":377},{"osn":"draw/Villarreal & yes","otd":378},{"osn":"draw/Villarreal & no","otd":379}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"107","hpon":66,"hton":"0"},{"hids":0,"chpid":"347","hlf":0,"hl":[{"hid":"144955051338682372","hon":"216800","hn":null,"hs":0,"ol":[{"otv":"Mallorca/draw & over  2.5","obv":400000,"cds":"AO","os":1,"ot":"1XAndOver","ov":400000,"oid":"141819805324406753","otd":1072,"ott":"Mallorca/draw & over ","on":"2.5","ots":""},{"otv":"Mallorca/draw & under  2.5","obv":222000,"cds":"AO","os":1,"ot":"1XAndUnder","ov":222000,"oid":"143494413846772123","otd":1073,"ott":"Mallorca/draw & under ","on":"2.5","ots":""},{"otv":"Mallorca/Villarreal & over  2.5","obv":260000,"cds":"AO","os":1,"ot":"12AndOver","ov":260000,"oid":"142354443918732723","otd":1074,"ott":"Mallorca/Villarreal & over ","on":"2.5","ots":""},{"otv":"Mallorca/Villarreal & under  2.5","obv":250000,"cds":"AO","os":1,"ot":"12AndUnder","ov":250000,"oid":"149142538712422118","otd":1075,"ott":"Mallorca/Villarreal & under ","on":"2.5","ots":""},{"otv":"Villarreal/draw & over  2.5","obv":385000,"cds":"AO","os":1,"ot":"X2AndOver","ov":385000,"oid":"146220593692948163","otd":1076,"ott":"Villarreal/draw & over ","on":"2.5","ots":""},{"otv":"Villarreal/draw & under  2.5","obv":218000,"cds":"AO","os":1,"ot":"X2AndUnder","ov":218000,"oid":"144940423450323846","otd":1077,"ott":"Villarreal/draw & under ","on":"2.5","ots":""}],"hv":"2.5","hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Double Chance & Total","topKey":"347","mid":"2601549","hmm":1,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca/draw & over ","otd":1072},{"osn":"Mallorca/draw & under ","otd":1073},{"osn":"Mallorca/Villarreal & over ","otd":1074},{"osn":"Mallorca/Villarreal & under ","otd":1075},{"osn":"Villarreal/draw & over ","otd":1076},{"osn":"Villarreal/draw & under ","otd":1077}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"347","hpon":67,"hton":"0"},{"hids":0,"chpid":"105","hlf":0,"hl":[{"hid":"140046405305779930","hon":"3947200","hn":null,"hs":0,"ol":[{"otv":"Mallorca & yes ","obv":2400000,"cds":"AO","os":1,"ot":"1AndYes","ov":2400000,"oid":"148982400553404086","otd":362,"ott":"Mallorca & yes","on":"","ots":""},{"otv":"Mallorca & no ","obv":395000,"cds":"AO","os":1,"ot":"1AndNo","ov":395000,"oid":"143524147934418403","otd":363,"ott":"Mallorca & no","on":"","ots":""},{"otv":"draw & yes ","obv":870000,"cds":"AO","os":1,"ot":"XAndYes","ov":880000,"oid":"145510584060157218","otd":364,"ott":"draw & yes","on":"","ots":""},{"otv":"draw & no ","obv":233000,"cds":"AO","os":1,"ot":"XAndNo","ov":233000,"oid":"148890435427302704","otd":365,"ott":"draw & no","on":"","ots":""},{"otv":"Villarreal & yes ","obv":2200000,"cds":"AO","os":1,"ot":"2AndYes","ov":2200000,"oid":"141436952195937732","otd":366,"ott":"Villarreal & yes","on":"","ots":""},{"otv":"Villarreal & no ","obv":355000,"cds":"AO","os":1,"ot":"2AndNo","ov":355000,"oid":"147829936111550222","otd":367,"ott":"Villarreal & no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - 1X2 & Both Teams to Score","topKey":"105","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca & yes","otd":362},{"osn":"Mallorca & no","otd":363},{"osn":"draw & yes","otd":364},{"osn":"draw & no","otd":365},{"osn":"Villarreal & yes","otd":366},{"osn":"Villarreal & no","otd":367}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"105","hpon":68,"hton":"0"},{"hids":0,"chpid":"106","hlf":0,"hl":[{"hid":"140522347307172221","hon":"1500700","hn":null,"hs":0,"ol":[{"otv":"Mallorca & yes ","obv":1350000,"cds":"AO","os":1,"ot":"1AndYes","ov":1350000,"oid":"145493008008891328","otd":368,"ott":"Mallorca & yes","on":"","ots":""},{"otv":"Mallorca & no ","obv":350000,"cds":"AO","os":1,"ot":"1AndNo","ov":350000,"oid":"142793033136362445","otd":369,"ott":"Mallorca & no","on":"","ots":""},{"otv":"draw & yes ","obv":620000,"cds":"AO","os":1,"ot":"XAndYes","ov":640000,"oid":"144134127175405094","otd":370,"ott":"draw & yes","on":"","ots":""},{"otv":"draw & no ","obv":335000,"cds":"AO","os":1,"ot":"XAndNo","ov":335000,"oid":"143550144594622493","otd":371,"ott":"draw & no","on":"","ots":""},{"otv":"Villarreal & yes ","obv":1350000,"cds":"AO","os":1,"ot":"2AndYes","ov":1350000,"oid":"148258054344523125","otd":372,"ott":"Villarreal & yes","on":"","ots":""},{"otv":"Villarreal & no ","obv":355000,"cds":"AO","os":1,"ot":"2AndNo","ov":355000,"oid":"143026030931226641","otd":373,"ott":"Villarreal & no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - 1X2 & Both Teams to Score","topKey":"106","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca & yes","otd":368},{"osn":"Mallorca & no","otd":369},{"osn":"draw & yes","otd":370},{"osn":"draw & no","otd":371},{"osn":"Villarreal & yes","otd":372},{"osn":"Villarreal & no","otd":373}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"106","hpon":69,"hton":"0"},{"hids":0,"chpid":"350","hlf":0,"hl":[{"hid":"141396346282934202","hon":"180300","hn":null,"hs":0,"ol":[{"otv":"odd/odd ","obv":390000,"cds":"AO","os":1,"ot":"Odd/Odd","ov":390000,"oid":"142385010105155356","otd":1114,"ott":"odd/odd","on":"","ots":""},{"otv":"odd/even ","obv":440000,"cds":"AO","os":1,"ot":"Odd/Even","ov":440000,"oid":"149244266330823302","otd":1115,"ott":"odd/even","on":"","ots":""},{"otv":"even/odd ","obv":330000,"cds":"AO","os":1,"ot":"Even/Odd","ov":330000,"oid":"142215550590575195","otd":1116,"ott":"even/odd","on":"","ots":""},{"otv":"even/even ","obv":292000,"cds":"AO","os":1,"ot":"Even/Even","ov":294000,"oid":"144350038122111204","otd":1117,"ott":"even/even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Halftime/Fulltime Odd/Even","topKey":"350","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"odd/odd","otd":1114},{"osn":"odd/even","otd":1115},{"osn":"even/odd","otd":1116},{"osn":"even/even","otd":1117}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"350","hpon":70,"hton":"0"},{"hids":0,"chpid":"348","hlf":0,"hl":[{"hid":"144110361545024536","hon":"5840000","hn":null,"hs":0,"ol":[{"otv":"Mallorca/Mallorca & over  2.5","obv":950000,"cds":"AO","os":1,"ot":"1/1AndOver","ov":950000,"oid":"142145298475911249","otd":1078,"ott":"Mallorca/Mallorca & over ","on":"2.5","ots":""},{"otv":"Mallorca/Mallorca & under  2.5","obv":1000000,"cds":"AO","os":1,"ot":"1/1AndUnder","ov":1000000,"oid":"146923229202450345","otd":1079,"ott":"Mallorca/Mallorca & under ","on":"2.5","ots":""},{"otv":"Mallorca/draw & over  2.5","obv":5000000,"cds":"AO","os":1,"ot":"1/XAndOver","ov":5200000,"oid":"144120167233644272","otd":1080,"ott":"Mallorca/draw & over ","on":"2.5","ots":""},{"otv":"Mallorca/draw & under  2.5","obv":2700000,"cds":"AO","os":1,"ot":"1/XAndUnder","ov":2700000,"oid":"140194232215521745","otd":1081,"ott":"Mallorca/draw & under ","on":"2.5","ots":""},{"otv":"Mallorca/Villarreal & over  2.5","obv":4500000,"cds":"AO","os":1,"ot":"1/2AndOver","ov":4500000,"oid":"146600212122862309","otd":1082,"ott":"Mallorca/Villarreal & over ","on":"2.5","ots":""},{"otv":"Mallorca/Villarreal & under  2.5","obv":0,"cds":"AO","os":2,"ot":"1/2AndUnder","ov":0,"oid":"141553020421371272","otd":1083,"ott":"Mallorca/Villarreal & under ","on":"2.5","ots":""},{"otv":"draw/Mallorca & over  2.5","obv":1600000,"cds":"AO","os":1,"ot":"X/1AndOver","ov":1600000,"oid":"141129583270643162","otd":1084,"ott":"draw/Mallorca & over ","on":"2.5","ots":""},{"otv":"draw/Mallorca & under  2.5","obv":970000,"cds":"AO","os":1,"ot":"X/1AndUnder","ov":990000,"oid":"148560232343434399","otd":1085,"ott":"draw/Mallorca & under ","on":"2.5","ots":""},{"otv":"draw/draw & over  2.5","obv":4000000,"cds":"AO","os":1,"ot":"X/XAndOver","ov":4200000,"oid":"147115446030556151","otd":1086,"ott":"draw/draw & over ","on":"2.5","ots":""},{"otv":"draw/draw & under  2.5","obv":520000,"cds":"AO","os":1,"ot":"X/XAndUnder","ov":540000,"oid":"142615102910310826","otd":1087,"ott":"draw/draw & under ","on":"2.5","ots":""},{"otv":"draw/Villarreal & over  2.5","obv":1600000,"cds":"AO","os":1,"ot":"X/2AndOver","ov":1600000,"oid":"145284045501015971","otd":1088,"ott":"draw/Villarreal & over ","on":"2.5","ots":""},{"otv":"draw/Villarreal & under  2.5","obv":1000000,"cds":"AO","os":1,"ot":"X/2AndUnder","ov":1000000,"oid":"146366121105701332","otd":1089,"ott":"draw/Villarreal & under ","on":"2.5","ots":""},{"otv":"Villarreal/Mallorca & over  2.5","obv":4000000,"cds":"AO","os":1,"ot":"2/1AndOver","ov":4100000,"oid":"144455033001361072","otd":1090,"ott":"Villarreal/Mallorca & over ","on":"2.5","ots":""},{"otv":"Villarreal/Mallorca & under  2.5","obv":0,"cds":"AO","os":2,"ot":"2/1AndUnder","ov":0,"oid":"148112590135534584","otd":1091,"ott":"Villarreal/Mallorca & under ","on":"2.5","ots":""},{"otv":"Villarreal/draw & over  2.5","obv":4500000,"cds":"AO","os":1,"ot":"2/XAndOver","ov":4700000,"oid":"147141003900139332","otd":1092,"ott":"Villarreal/draw & over ","on":"2.5","ots":""},{"otv":"Villarreal/draw & under  2.5","obv":2500000,"cds":"AO","os":1,"ot":"2/XAndUnder","ov":2500000,"oid":"146420299115985833","otd":1093,"ott":"Villarreal/draw & under ","on":"2.5","ots":""},{"otv":"Villarreal/Villarreal & over  2.5","obv":820000,"cds":"AO","os":1,"ot":"2/2AndOver","ov":840000,"oid":"144453232111303780","otd":1094,"ott":"Villarreal/Villarreal & over ","on":"2.5","ots":""},{"otv":"Villarreal/Villarreal & under  2.5","obv":950000,"cds":"AO","os":1,"ot":"2/2AndUnder","ov":950000,"oid":"147542450701311703","otd":1095,"ott":"Villarreal/Villarreal & under ","on":"2.5","ots":""}],"hv":"2.5","hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Halftime/Fulltime & Total","topKey":"348-2.5","mid":"2601549","hmm":1,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca/Mallorca & over ","otd":1078},{"osn":"Mallorca/Mallorca & under ","otd":1079},{"osn":"Mallorca/draw & over ","otd":1080},{"osn":"Mallorca/draw & under ","otd":1081},{"osn":"Mallorca/Villarreal & over ","otd":1082},{"osn":"Mallorca/Villarreal & under ","otd":1083},{"osn":"draw/Mallorca & over ","otd":1084},{"osn":"draw/Mallorca & under ","otd":1085},{"osn":"draw/draw & over ","otd":1086},{"osn":"draw/draw & under ","otd":1087},{"osn":"draw/Villarreal & over ","otd":1088},{"osn":"draw/Villarreal & under ","otd":1089},{"osn":"Villarreal/Mallorca & over ","otd":1090},{"osn":"Villarreal/Mallorca & under ","otd":1091},{"osn":"Villarreal/draw & over ","otd":1092},{"osn":"Villarreal/draw & under ","otd":1093},{"osn":"Villarreal/Villarreal & over ","otd":1094},{"osn":"Villarreal/Villarreal & under ","otd":1095}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"348","hpon":71,"hton":"0"},{"hids":0,"chpid":"349","hlf":0,"hl":[{"hid":"146411441916200125","hon":"39797100","hn":null,"hs":0,"ol":[{"otv":"Mallorca/Mallorca & over  1.5","obv":1450000,"cds":"AO","os":1,"ot":"1/1AndOver","ov":1450000,"oid":"145928508654122400","otd":1096,"ott":"Mallorca/Mallorca & over ","on":"1.5","ots":""},{"otv":"Mallorca/Mallorca & under  1.5","obv":750000,"cds":"AO","os":1,"ot":"1/1AndUnder","ov":750000,"oid":"141715912182111965","otd":1097,"ott":"Mallorca/Mallorca & under ","on":"1.5","ots":""},{"otv":"Mallorca/draw & over  1.5","obv":8500000,"cds":"AO","os":1,"ot":"1/XAndOver","ov":8800000,"oid":"141031450250541657","otd":1098,"ott":"Mallorca/draw & over ","on":"1.5","ots":""},{"otv":"Mallorca/draw & under  1.5","obv":2200000,"cds":"AO","os":1,"ot":"1/XAndUnder","ov":2200000,"oid":"141287826490112040","otd":1099,"ott":"Mallorca/draw & under ","on":"1.5","ots":""},{"otv":"Mallorca/Villarreal & over  1.5","obv":10100000,"cds":"AO","os":1,"ot":"1/2AndOver","ov":10100000,"oid":"148408448419313433","otd":1100,"ott":"Mallorca/Villarreal & over ","on":"1.5","ots":""},{"otv":"Mallorca/Villarreal & under  1.5","obv":5000000,"cds":"AO","os":1,"ot":"1/2AndUnder","ov":5200000,"oid":"141303094485174314","otd":1101,"ott":"Mallorca/Villarreal & under ","on":"1.5","ots":""},{"otv":"draw/Mallorca & over  1.5","obv":3000000,"cds":"AO","os":1,"ot":"X/1AndOver","ov":3000000,"oid":"145457354133503802","otd":1102,"ott":"draw/Mallorca & over ","on":"1.5","ots":""},{"otv":"draw/Mallorca & under  1.5","obv":770000,"cds":"AO","os":1,"ot":"X/1AndUnder","ov":770000,"oid":"144222423492295010","otd":1103,"ott":"draw/Mallorca & under ","on":"1.5","ots":""},{"otv":"draw/draw & over  1.5","obv":2400000,"cds":"AO","os":1,"ot":"X/XAndOver","ov":2400000,"oid":"141122026533454730","otd":1104,"ott":"draw/draw & over ","on":"1.5","ots":""},{"otv":"draw/draw & under  1.5","obv":600000,"cds":"AO","os":1,"ot":"X/XAndUnder","ov":600000,"oid":"140748021282120713","otd":1105,"ott":"draw/draw & under ","on":"1.5","ots":""},{"otv":"draw/Villarreal & over  1.5","obv":3000000,"cds":"AO","os":1,"ot":"X/2AndOver","ov":3000000,"oid":"142284404517431435","otd":1106,"ott":"draw/Villarreal & over ","on":"1.5","ots":""},{"otv":"draw/Villarreal & under  1.5","obv":770000,"cds":"AO","os":1,"ot":"X/2AndUnder","ov":780000,"oid":"144181845874551498","otd":1107,"ott":"draw/Villarreal & under ","on":"1.5","ots":""},{"otv":"Villarreal/Mallorca & over  1.5","obv":10100000,"cds":"AO","os":1,"ot":"2/1AndOver","ov":10100000,"oid":"148730926709432986","otd":1108,"ott":"Villarreal/Mallorca & over ","on":"1.5","ots":""},{"otv":"Villarreal/Mallorca & under  1.5","obv":4500000,"cds":"AO","os":1,"ot":"2/1AndUnder","ov":4700000,"oid":"145223945624753426","otd":1109,"ott":"Villarreal/Mallorca & under ","on":"1.5","ots":""},{"otv":"Villarreal/draw & over  1.5","obv":7500000,"cds":"AO","os":1,"ot":"2/XAndOver","ov":7900000,"oid":"140401527630595288","otd":1110,"ott":"Villarreal/draw & over ","on":"1.5","ots":""},{"otv":"Villarreal/draw & under  1.5","obv":2000000,"cds":"AO","os":1,"ot":"2/XAndUnder","ov":2000000,"oid":"143532505729604430","otd":1111,"ott":"Villarreal/draw & under ","on":"1.5","ots":""},{"otv":"Villarreal/Villarreal & over  1.5","obv":1250000,"cds":"AO","os":1,"ot":"2/2AndOver","ov":1250000,"oid":"145914423472319073","otd":1112,"ott":"Villarreal/Villarreal & over ","on":"1.5","ots":""},{"otv":"Villarreal/Villarreal & under  1.5","obv":670000,"cds":"AO","os":1,"ot":"2/2AndUnder","ov":690000,"oid":"142220081410256962","otd":1113,"ott":"Villarreal/Villarreal & under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Halftime/Fulltime & 1st half Total","topKey":"349-1.5","mid":"2601549","hmm":1,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca/Mallorca & over ","otd":1096},{"osn":"Mallorca/Mallorca & under ","otd":1097},{"osn":"Mallorca/draw & over ","otd":1098},{"osn":"Mallorca/draw & under ","otd":1099},{"osn":"Mallorca/Villarreal & over ","otd":1100},{"osn":"Mallorca/Villarreal & under ","otd":1101},{"osn":"draw/Mallorca & over ","otd":1102},{"osn":"draw/Mallorca & under ","otd":1103},{"osn":"draw/draw & over ","otd":1104},{"osn":"draw/draw & under ","otd":1105},{"osn":"draw/Villarreal & over ","otd":1106},{"osn":"draw/Villarreal & under ","otd":1107},{"osn":"Villarreal/Mallorca & over ","otd":1108},{"osn":"Villarreal/Mallorca & under ","otd":1109},{"osn":"Villarreal/draw & over ","otd":1110},{"osn":"Villarreal/draw & under ","otd":1111},{"osn":"Villarreal/Villarreal & over ","otd":1112},{"osn":"Villarreal/Villarreal & under ","otd":1113}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"349","hpon":72,"hton":"0"},{"hids":0,"chpid":"360","hlf":0,"hl":[{"hid":"148220619602543505","hon":"44834500","hn":null,"hs":0,"ol":[{"otv":"Mallorca/Mallorca 0","obv":0,"cds":"AO","os":2,"ot":"1/1And0","ov":0,"oid":"142582821811228787","otd":1,"ott":"Mallorca/Mallorca","on":"0","ots":""},{"otv":"Mallorca/Mallorca 1","obv":2000000,"cds":"AO","os":1,"ot":"1/1And1","ov":2000000,"oid":"140157710256307730","otd":1,"ott":"Mallorca/Mallorca","on":"1","ots":""},{"otv":"Mallorca/Mallorca 2","obv":2200000,"cds":"AO","os":1,"ot":"1/1And2","ov":2200000,"oid":"143453195800595597","otd":1,"ott":"Mallorca/Mallorca","on":"2","ots":""},{"otv":"Mallorca/Mallorca 3","obv":1750000,"cds":"AO","os":1,"ot":"1/1And3","ov":1750000,"oid":"146222033212030022","otd":1,"ott":"Mallorca/Mallorca","on":"3","ots":""},{"otv":"Mallorca/Mallorca 4","obv":3500000,"cds":"AO","os":1,"ot":"1/1And4","ov":3900000,"oid":"142973525469719255","otd":1,"ott":"Mallorca/Mallorca","on":"4","ots":""},{"otv":"Mallorca/Mallorca 5+","obv":4000000,"cds":"AO","os":1,"ot":"1/1And5+","ov":4200000,"oid":"140230501983421420","otd":1,"ott":"Mallorca/Mallorca","on":"5+","ots":""},{"otv":"Mallorca/Draw 0","obv":0,"cds":"AO","os":2,"ot":"1/XAnd0","ov":0,"oid":"147013511311731922","otd":2,"ott":"Mallorca/Draw","on":"0","ots":""},{"otv":"Mallorca/Draw 1","obv":0,"cds":"AO","os":2,"ot":"1/XAnd1","ov":0,"oid":"143009351237012143","otd":2,"ott":"Mallorca/Draw","on":"1","ots":""},{"otv":"Mallorca/Draw 2","obv":2900000,"cds":"AO","os":1,"ot":"1/XAnd2","ov":2900000,"oid":"140221176658502531","otd":2,"ott":"Mallorca/Draw","on":"2","ots":""},{"otv":"Mallorca/Draw 3","obv":0,"cds":"AO","os":2,"ot":"1/XAnd3","ov":0,"oid":"145455510173522131","otd":2,"ott":"Mallorca/Draw","on":"3","ots":""},{"otv":"Mallorca/Draw 4","obv":6500000,"cds":"AO","os":1,"ot":"1/XAnd4","ov":6900000,"oid":"143081258253290509","otd":2,"ott":"Mallorca/Draw","on":"4","ots":""},{"otv":"Mallorca/Draw 5+","obv":10100000,"cds":"AO","os":1,"ot":"1/XAnd5+","ov":10100000,"oid":"141243155366500734","otd":2,"ott":"Mallorca/Draw","on":"5+","ots":""},{"otv":"Mallorca/Villarreal 0","obv":0,"cds":"AO","os":2,"ot":"1/2And0","ov":0,"oid":"144373963502010208","otd":3,"ott":"Mallorca/Villarreal","on":"0","ots":""},{"otv":"Mallorca/Villarreal 1","obv":0,"cds":"AO","os":2,"ot":"1/2And1","ov":0,"oid":"140000008243230627","otd":3,"ott":"Mallorca/Villarreal","on":"1","ots":""},{"otv":"Mallorca/Villarreal 2","obv":0,"cds":"AO","os":2,"ot":"1/2And2","ov":0,"oid":"147075481128703347","otd":3,"ott":"Mallorca/Villarreal","on":"2","ots":""},{"otv":"Mallorca/Villarreal 3","obv":8000000,"cds":"AO","os":1,"ot":"1/2And3","ov":8300000,"oid":"146522714110217522","otd":3,"ott":"Mallorca/Villarreal","on":"3","ots":""},{"otv":"Mallorca/Villarreal 4","obv":10100000,"cds":"AO","os":1,"ot":"1/2And4","ov":10100000,"oid":"141130789059505675","otd":3,"ott":"Mallorca/Villarreal","on":"4","ots":""},{"otv":"Mallorca/Villarreal 5+","obv":10100000,"cds":"AO","os":1,"ot":"1/2And5+","ov":10100000,"oid":"148701638790572654","otd":3,"ott":"Mallorca/Villarreal","on":"5+","ots":""},{"otv":"Draw/Mallorca 0","obv":0,"cds":"AO","os":2,"ot":"X/1And0","ov":0,"oid":"144772297495175220","otd":4,"ott":"Draw/Mallorca","on":"0","ots":""},{"otv":"Draw/Mallorca 1","obv":1350000,"cds":"AO","os":1,"ot":"X/1And1","ov":1350000,"oid":"143418446082513513","otd":4,"ott":"Draw/Mallorca","on":"1","ots":""},{"otv":"Draw/Mallorca 2","obv":3500000,"cds":"AO","os":1,"ot":"X/1And2","ov":3900000,"oid":"146341141754053215","otd":4,"ott":"Draw/Mallorca","on":"2","ots":""},{"otv":"Draw/Mallorca 3","obv":2500000,"cds":"AO","os":1,"ot":"X/1And3","ov":2500000,"oid":"146467308408303210","otd":4,"ott":"Draw/Mallorca","on":"3","ots":""},{"otv":"Draw/Mallorca 4","obv":8500000,"cds":"AO","os":1,"ot":"X/1And4","ov":8900000,"oid":"140047110444325114","otd":4,"ott":"Draw/Mallorca","on":"4","ots":""},{"otv":"Draw/Mallorca 5+","obv":8500000,"cds":"AO","os":1,"ot":"X/1And5+","ov":8700000,"oid":"144210953624215171","otd":4,"ott":"Draw/Mallorca","on":"5+","ots":""},{"otv":"Draw/Draw 0","obv":850000,"cds":"AO","os":1,"ot":"X/XAnd0","ov":860000,"oid":"144861710145751260","otd":5,"ott":"Draw/Draw","on":"0","ots":""},{"otv":"Draw/Draw 1","obv":0,"cds":"AO","os":2,"ot":"X/XAnd1","ov":0,"oid":"143585473370840003","otd":5,"ott":"Draw/Draw","on":"1","ots":""},{"otv":"Draw/Draw 2","obv":1350000,"cds":"AO","os":1,"ot":"X/XAnd2","ov":1350000,"oid":"141245022310150002","otd":5,"ott":"Draw/Draw","on":"2","ots":""},{"otv":"Draw/Draw 3","obv":0,"cds":"AO","os":2,"ot":"X/XAnd3","ov":0,"oid":"144231008153672053","otd":5,"ott":"Draw/Draw","on":"3","ots":""},{"otv":"Draw/Draw 4","obv":5000000,"cds":"AO","os":1,"ot":"X/XAnd4","ov":5300000,"oid":"145022964233621728","otd":5,"ott":"Draw/Draw","on":"4","ots":""},{"otv":"Draw/Draw 5+","obv":10100000,"cds":"AO","os":1,"ot":"X/XAnd5+","ov":10100000,"oid":"142808543444546803","otd":5,"ott":"Draw/Draw","on":"5+","ots":""},{"otv":"Draw/Villarreal 0","obv":0,"cds":"AO","os":2,"ot":"X/2And0","ov":0,"oid":"148435246650007233","otd":6,"ott":"Draw/Villarreal","on":"0","ots":""},{"otv":"Draw/Villarreal 1","obv":1350000,"cds":"AO","os":1,"ot":"X/2And1","ov":1350000,"oid":"146512512225905777","otd":6,"ott":"Draw/Villarreal","on":"1","ots":""},{"otv":"Draw/Villarreal 2","obv":3500000,"cds":"AO","os":1,"ot":"X/2And2","ov":3900000,"oid":"143323557135055210","otd":6,"ott":"Draw/Villarreal","on":"2","ots":""},{"otv":"Draw/Villarreal 3","obv":2500000,"cds":"AO","os":1,"ot":"X/2And3","ov":2500000,"oid":"143349650326375554","otd":6,"ott":"Draw/Villarreal","on":"3","ots":""},{"otv":"Draw/Villarreal 4","obv":9000000,"cds":"AO","os":1,"ot":"X/2And4","ov":9100000,"oid":"144992262041058569","otd":6,"ott":"Draw/Villarreal","on":"4","ots":""},{"otv":"Draw/Villarreal 5+","obv":8500000,"cds":"AO","os":1,"ot":"X/2And5+","ov":8800000,"oid":"145323763847524174","otd":6,"ott":"Draw/Villarreal","on":"5+","ots":""},{"otv":"Villarreal/Mallorca 0","obv":0,"cds":"AO","os":2,"ot":"2/1And0","ov":0,"oid":"140022360240315803","otd":7,"ott":"Villarreal/Mallorca","on":"0","ots":""},{"otv":"Villarreal/Mallorca 1","obv":0,"cds":"AO","os":2,"ot":"2/1And1","ov":0,"oid":"142112031447710601","otd":7,"ott":"Villarreal/Mallorca","on":"1","ots":""},{"otv":"Villarreal/Mallorca 2","obv":0,"cds":"AO","os":2,"ot":"2/1And2","ov":0,"oid":"148371254839048232","otd":7,"ott":"Villarreal/Mallorca","on":"2","ots":""},{"otv":"Villarreal/Mallorca 3","obv":7500000,"cds":"AO","os":1,"ot":"2/1And3","ov":7500000,"oid":"149950141017485050","otd":7,"ott":"Villarreal/Mallorca","on":"3","ots":""},{"otv":"Villarreal/Mallorca 4","obv":10100000,"cds":"AO","os":1,"ot":"2/1And4","ov":10100000,"oid":"140355344863676170","otd":7,"ott":"Villarreal/Mallorca","on":"4","ots":""},{"otv":"Villarreal/Mallorca 5+","obv":10100000,"cds":"AO","os":1,"ot":"2/1And5+","ov":10100000,"oid":"144631855609767599","otd":7,"ott":"Villarreal/Mallorca","on":"5+","ots":""},{"otv":"Villarreal/Draw 0","obv":0,"cds":"AO","os":2,"ot":"2/XAnd0","ov":0,"oid":"144837580934080459","otd":8,"ott":"Villarreal/Draw","on":"0","ots":""},{"otv":"Villarreal/Draw 1","obv":0,"cds":"AO","os":2,"ot":"2/XAnd1","ov":0,"oid":"143633555366493543","otd":8,"ott":"Villarreal/Draw","on":"1","ots":""},{"otv":"Villarreal/Draw 2","obv":2700000,"cds":"AO","os":1,"ot":"2/XAnd2","ov":2700000,"oid":"140385224393339355","otd":8,"ott":"Villarreal/Draw","on":"2","ots":""},{"otv":"Villarreal/Draw 3","obv":0,"cds":"AO","os":2,"ot":"2/XAnd3","ov":0,"oid":"142882040433518944","otd":8,"ott":"Villarreal/Draw","on":"3","ots":""},{"otv":"Villarreal/Draw 4","obv":6000000,"cds":"AO","os":1,"ot":"2/XAnd4","ov":6100000,"oid":"142543505002493095","otd":8,"ott":"Villarreal/Draw","on":"4","ots":""},{"otv":"Villarreal/Draw 5+","obv":10100000,"cds":"AO","os":1,"ot":"2/XAnd5+","ov":10100000,"oid":"140815215791261563","otd":8,"ott":"Villarreal/Draw","on":"5+","ots":""},{"otv":"Villarreal/Villarreal 0","obv":0,"cds":"AO","os":2,"ot":"2/2And0","ov":0,"oid":"143584183327984220","otd":9,"ott":"Villarreal/Villarreal","on":"0","ots":""},{"otv":"Villarreal/Villarreal 1","obv":1800000,"cds":"AO","os":1,"ot":"2/2And1","ov":1800000,"oid":"147898581694140792","otd":9,"ott":"Villarreal/Villarreal","on":"1","ots":""},{"otv":"Villarreal/Villarreal 2","obv":2000000,"cds":"AO","os":1,"ot":"2/2And2","ov":2000000,"oid":"140039433224703433","otd":9,"ott":"Villarreal/Villarreal","on":"2","ots":""},{"otv":"Villarreal/Villarreal 3","obv":1550000,"cds":"AO","os":1,"ot":"2/2And3","ov":1550000,"oid":"140403598335386552","otd":9,"ott":"Villarreal/Villarreal","on":"3","ots":""},{"otv":"Villarreal/Villarreal 4","obv":3000000,"cds":"AO","os":1,"ot":"2/2And4","ov":3400000,"oid":"149943570526032290","otd":9,"ott":"Villarreal/Villarreal","on":"4","ots":""},{"otv":"Villarreal/Villarreal 5+","obv":3500000,"cds":"AO","os":1,"ot":"2/2And5+","ov":3700000,"oid":"144811454216184655","otd":9,"ott":"Villarreal/Villarreal","on":"5+","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Halftime/Fulltime & Exact Goals","topKey":"360","mid":"2601549","hmm":1,"hps":"","hshow":"No","jno":null,"title":[[{"osn":"Mallorca/Mallorca","otd":1},{"osn":"Mallorca/Draw","otd":2},{"osn":"Mallorca/Villarreal","otd":3}],[{"osn":"Draw/Mallorca","otd":4},{"osn":"Draw/Draw","otd":5},{"osn":"Draw/Villarreal","otd":6}],[{"osn":"Villarreal/Mallorca","otd":7},{"osn":"Villarreal/Draw","otd":8},{"osn":"Villarreal/Villarreal","otd":9}]],"hpt":18,"hsw":"1,4,5","hlid":"0","hpid":"360","hpon":73,"hton":"0"},{"hids":0,"chpid":"77","hlf":0,"hl":[{"hid":"140082119844457559","hon":"51200","hn":null,"hs":0,"ol":[{"otv":"draw ","obv":214000,"cds":"AO","os":1,"ot":"X","ov":214000,"oid":"141726457312469215","otd":322,"ott":"draw","on":"","ots":""},{"otv":"Villarreal ","obv":169000,"cds":"AO","os":1,"ot":"2","ov":169000,"oid":"145500250035416754","otd":323,"ott":"Villarreal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca No Bet","topKey":"77","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"draw","otd":322},{"osn":"Villarreal","otd":323}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"77","hpon":74,"hton":"0"},{"hids":0,"chpid":"91","hlf":0,"hl":[{"hid":"144035290532500224","hon":"40800","hn":null,"hs":0,"ol":[{"otv":"Mallorca ","obv":172000,"cds":"AO","os":1,"ot":"1","ov":172000,"oid":"145159203310125300","otd":303,"ott":"Mallorca","on":"","ots":""},{"otv":"draw ","obv":211000,"cds":"AO","os":1,"ot":"X","ov":211000,"oid":"141203551504258252","otd":304,"ott":"draw","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal No Bet","topKey":"91","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":303},{"osn":"draw","otd":304}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"91","hpon":75,"hton":"0"},{"hids":1,"chpid":"78","hlf":0,"hl":[{"hid":"142302032252514404","hon":"42600","hn":null,"hs":0,"ol":[{"otv":"odd ","obv":212000,"cds":"AO","os":1,"ot":"Odd","ov":212000,"oid":"145643621663091450","otd":324,"ott":"odd","on":"","ots":""},{"otv":"even ","obv":171000,"cds":"AO","os":1,"ot":"Even","ov":171000,"oid":"148516242224871541","otd":325,"ott":"even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca Odd/Even","topKey":"78","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"odd","otd":324},{"osn":"even","otd":325}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"78","hpon":76,"hton":"0"},{"hids":1,"chpid":"92","hlf":0,"hl":[{"hid":"148356807760087459","hon":"39600","hn":null,"hs":0,"ol":[{"otv":"odd ","obv":209000,"cds":"AO","os":1,"ot":"Odd","ov":209000,"oid":"141501555845327660","otd":301,"ott":"odd","on":"","ots":""},{"otv":"even ","obv":173000,"cds":"AO","os":1,"ot":"Even","ov":173000,"oid":"145455543603300247","otd":302,"ott":"even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal Odd/Even","topKey":"92","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"odd","otd":301},{"osn":"even","otd":302}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"92","hpon":77,"hton":"0"},{"hids":1,"chpid":"83","hlf":0,"hl":[{"hid":"145090184571555783","hon":"1226300","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":570000,"cds":"AO","os":1,"ot":"Yes","ov":550000,"oid":"145100342742313404","otd":334,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":103000,"cds":"AO","os":1,"ot":"No","ov":103000,"oid":"147984255245543550","otd":335,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca to Win Both Halves","topKey":"83","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":334},{"osn":"no","otd":335}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"83","hpon":78,"hton":"0"},{"hids":1,"chpid":"93","hlf":0,"hl":[{"hid":"148241321074931562","hon":"1098600","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":550000,"cds":"AO","os":1,"ot":"Yes","ov":530000,"oid":"141060813255321375","otd":299,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":104000,"cds":"AO","os":1,"ot":"No","ov":104000,"oid":"140395335181836950","otd":300,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal to Win Both Halves","topKey":"93","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":299},{"osn":"no","otd":300}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"93","hpon":79,"hton":"0"},{"hids":1,"chpid":"84","hlf":0,"hl":[{"hid":"145805471423253448","hon":"19400","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":201000,"cds":"AO","os":1,"ot":"Yes","ov":201000,"oid":"149169352773630162","otd":318,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":181000,"cds":"AO","os":1,"ot":"No","ov":181000,"oid":"143045741040863113","otd":319,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca to Win Either Half","topKey":"84","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":318},{"osn":"no","otd":319}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"84","hpon":80,"hton":"0"},{"hids":1,"chpid":"94","hlf":0,"hl":[{"hid":"142255303771848233","hon":"5400","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":194000,"cds":"AO","os":1,"ot":"Yes","ov":194000,"oid":"140471815015223261","otd":297,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":188000,"cds":"AO","os":1,"ot":"No","ov":188000,"oid":"148699534123542319","otd":298,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal to Win Either Half","topKey":"94","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":297},{"osn":"no","otd":298}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"94","hpon":81,"hton":"0"},{"hids":1,"chpid":"85","hlf":0,"hl":[{"hid":"145766262516312954","hon":"237400","hn":null,"hs":0,"ol":[{"otv":"1st half ","obv":410000,"cds":"AO","os":1,"ot":"FirstHalf","ov":410000,"oid":"146076475539908852","otd":315,"ott":"1st half","on":"","ots":""},{"otv":"2nd half ","obv":255000,"cds":"AO","os":1,"ot":"SecondHalf","ov":256000,"oid":"149215005253658550","otd":316,"ott":"2nd half","on":"","ots":""},{"otv":"equal ","obv":214000,"cds":"AO","os":1,"ot":"Equals","ov":214000,"oid":"145975321653803040","otd":317,"ott":"equal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca Highest Scoring Half","topKey":"85","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"1st half","otd":315},{"osn":"2nd half","otd":316},{"osn":"equal","otd":317}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"85","hpon":82,"hton":"0"},{"hids":1,"chpid":"95","hlf":0,"hl":[{"hid":"141433588204321606","hon":"195200","hn":null,"hs":0,"ol":[{"otv":"1st half ","obv":380000,"cds":"AO","os":1,"ot":"FirstHalf","ov":380000,"oid":"145325404161034555","otd":294,"ott":"1st half","on":"","ots":""},{"otv":"2nd half ","obv":265000,"cds":"AO","os":1,"ot":"SecondHalf","ov":265000,"oid":"142955044073080745","otd":295,"ott":"2nd half","on":"","ots":""},{"otv":"equal ","obv":217000,"cds":"AO","os":1,"ot":"Equals","ov":217000,"oid":"142444882085793650","otd":296,"ott":"equal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal Highest Scoring Half","topKey":"95","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"1st half","otd":294},{"osn":"2nd half","otd":295},{"osn":"equal","otd":296}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"95","hpon":83,"hton":"0"},{"hids":1,"chpid":"86","hlf":0,"hl":[{"hid":"145505671332550622","hon":"439900","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":400000,"cds":"AO","os":1,"ot":"Yes","ov":394000,"oid":"145805085373117536","otd":313,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":115000,"cds":"AO","os":1,"ot":"No","ov":115000,"oid":"140044181863420307","otd":314,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Mallorca to Score in Both Halves","topKey":"86","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":313},{"osn":"no","otd":314}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"86","hpon":84,"hton":"0"},{"hids":1,"chpid":"96","hlf":0,"hl":[{"hid":"144519418391731016","hon":"403300","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":385000,"cds":"AO","os":1,"ot":"Yes","ov":385000,"oid":"140183802841445123","otd":292,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":117000,"cds":"AO","os":1,"ot":"No","ov":117000,"oid":"147232473355706201","otd":293,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Villarreal to Score in Both Halves","topKey":"96","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"yes","otd":292},{"osn":"no","otd":293}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"96","hpon":85,"hton":"0"},{"hids":0,"chpid":"354","hlf":0,"hl":[{"hid":"141587212514807425","hon":"820100","hn":null,"hs":0,"ol":[{"otv":"1st half ","obv":151000,"cds":"AO","os":1,"ot":"FirstHalf","ov":151000,"oid":"146011350314408272","otd":1131,"ott":"1st half","on":"","ots":""},{"otv":"2nd half ","obv":305000,"cds":"AO","os":1,"ot":"SecondHalf","ov":305000,"oid":"145100396537027459","otd":1132,"ott":"2nd half","on":"","ots":""},{"otv":"no goal ","obv":720000,"cds":"AO","os":1,"ot":"NoGoal","ov":740000,"oid":"144764303202302733","otd":1133,"ott":"no goal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"FT - First Goal Half","topKey":"354","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"1st half","otd":1131},{"osn":"2nd half","otd":1132},{"osn":"no goal","otd":1133}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"354","hpon":86,"hton":"0"},{"hids":0,"chpid":"355","hlf":0,"hl":[{"hid":"140214026122502044","hon":"46100","hn":null,"hs":0,"ol":[{"otv":"1st half ","obv":247000,"cds":"AO","os":1,"ot":"FirstHalf","ov":247000,"oid":"146314536401135931","otd":1134,"ott":"1st half","on":"","ots":""},{"otv":"2nd half ","obv":285000,"cds":"AO","os":1,"ot":"SecondHalf","ov":285000,"oid":"145868021158372565","otd":1135,"ott":"2nd half","on":"","ots":""},{"otv":"no goal ","obv":272000,"cds":"AO","os":1,"ot":"NoGoal","ov":274000,"oid":"143270341523302904","otd":1136,"ott":"no goal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Mallorca First Goal Half","topKey":"355","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"1st half","otd":1134},{"osn":"2nd half","otd":1135},{"osn":"no goal","otd":1136}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"355","hpon":87,"hton":"0"},{"hids":0,"chpid":"356","hlf":0,"hl":[{"hid":"146455524885402075","hon":"80800","hn":null,"hs":0,"ol":[{"otv":"1st half ","obv":231000,"cds":"AO","os":1,"ot":"FirstHalf","ov":231000,"oid":"144042398251145595","otd":1137,"ott":"1st half","on":"","ots":""},{"otv":"2nd half ","obv":295000,"cds":"AO","os":1,"ot":"SecondHalf","ov":298000,"oid":"140235503710151425","otd":1138,"ott":"2nd half","on":"","ots":""},{"otv":"no goal ","obv":282000,"cds":"AO","os":1,"ot":"NoGoal","ov":283000,"oid":"147006433155535988","otd":1139,"ott":"no goal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"FT - Villarreal First Goal Half","topKey":"356","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"1st half","otd":1137},{"osn":"2nd half","otd":1138},{"osn":"no goal","otd":1139}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"356","hpon":88,"hton":"0"},{"hids":0,"chpid":"108","hlf":0,"hl":[{"hid":"144155551424524063","hon":"2804900","hn":null,"hs":0,"ol":[{"otv":"yes/yes ","obv":1600000,"cds":"AO","os":1,"ot":"YesYes","ov":1600000,"oid":"143773090128113140","otd":382,"ott":"yes/yes","on":"","ots":""},{"otv":"yes/no ","obv":700000,"cds":"AO","os":1,"ot":"YesNo","ov":710000,"oid":"140674582133509641","otd":381,"ott":"yes/no","on":"","ots":""},{"otv":"no/yes ","obv":410000,"cds":"AO","os":1,"ot":"NoYes","ov":410000,"oid":"146633532441754088","otd":383,"ott":"no/yes","on":"","ots":""},{"otv":"no/no ","obv":139000,"cds":"AO","os":1,"ot":"NoNo","ov":139000,"oid":"140420536141190400","otd":380,"ott":"no/no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"Both team to score in both halves","topKey":"108","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes/yes","otd":382},{"osn":"yes/no","otd":381},{"osn":"no/yes","otd":383},{"osn":"no/no","otd":380}],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"108","hpon":90,"hton":"0"},{"hids":0,"chpid":"10901","hlf":0,"hl":[{"hid":"145200729612763740","hon":"945700","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":520000,"cds":"AO","os":1,"ot":"Yes","ov":515000,"oid":"149628059960595342","otd":384,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":105000,"cds":"AO","os":1,"ot":"No","ov":105000,"oid":"143635013534810704","otd":385,"ott":"no","on":"","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"Both Halves More Than 1.5 Goals","topKey":"109-1.5","mid":"2601549","hmm":1,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":384},{"osn":"no","otd":385}],"hpt":3,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"109","hpon":91,"hton":"0"},{"hids":0,"chpid":"11001","hlf":0,"hl":[{"hid":"147063031331194784","hon":"29700","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":205000,"cds":"AO","os":1,"ot":"Yes","ov":205000,"oid":"140951474585106080","otd":386,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":177000,"cds":"AO","os":1,"ot":"No","ov":177000,"oid":"140324040893254658","otd":387,"ott":"no","on":"","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"Both Halves Less Than 1.5 Goals","topKey":"110-1.5","mid":"2601549","hmm":1,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":386},{"osn":"no","otd":387}],"hpt":3,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"110","hpon":92,"hton":"0"},{"hids":1,"chpid":"87","hlf":1,"hl":[{"hid":"145485782735155757","hon":"117800","hn":1,"hs":0,"ol":[{"otv":"over  0.5","obv":249000,"cds":"AO","os":1,"ot":"Over","ov":249000,"oid":"141974210370314278","otd":312,"ott":"over ","on":"0.5","ots":""},{"otv":"under  0.5","obv":149000,"cds":"AO","os":1,"ot":"Under","ov":149000,"oid":"144215820473533135","otd":311,"ott":"under ","on":"0.5","ots":""}],"hv":"0.5","hmt":0,"ad2":"","ad1":""},{"hid":"144052146121010545","hon":"1206400","hn":2,"hs":0,"ol":[{"otv":"over  1.5","obv":570000,"cds":"AO","os":1,"ot":"Over","ov":550000,"oid":"140378574145500731","otd":312,"ott":"over ","on":"1.5","ots":""},{"otv":"under  1.5","obv":103000,"cds":"AO","os":1,"ot":"Under","ov":103000,"oid":"140112252839135124","otd":311,"ott":"under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Mallorca Total Goals","topKey":"87","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":312},{"osn":"under ","otd":311}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"87","hpon":93,"hton":"0"},{"hids":1,"chpid":"97","hlf":1,"hl":[{"hid":"143151058201334709","hon":"92300","hn":1,"hs":0,"ol":[{"otv":"over  0.5","obv":236000,"cds":"AO","os":1,"ot":"Over","ov":236000,"oid":"143056311832340437","otd":291,"ott":"over ","on":"0.5","ots":""},{"otv":"under  0.5","obv":155000,"cds":"AO","os":1,"ot":"Under","ov":155000,"oid":"144319139495544128","otd":290,"ott":"under ","on":"0.5","ots":""}],"hv":"0.5","hmt":0,"ad2":"","ad1":""},{"hid":"142436570131567127","hon":"1019000","hn":2,"hs":0,"ol":[{"otv":"over  1.5","obv":550000,"cds":"AO","os":1,"ot":"Over","ov":530000,"oid":"144115300127443111","otd":291,"ott":"over ","on":"1.5","ots":""},{"otv":"under  1.5","obv":104000,"cds":"AO","os":1,"ot":"Under","ov":104000,"oid":"144531223316030331","otd":290,"ott":"under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Villarreal Total Goals","topKey":"97","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":291},{"osn":"under ","otd":290}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"97","hpon":94,"hton":"0"},{"hids":0,"chpid":"90","hlf":0,"hl":[{"hid":"140267034594538447","hon":"92300","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":155000,"cds":"AO","os":1,"ot":"Yes","ov":155000,"oid":"149085021206245861","otd":305,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":236000,"cds":"AO","os":1,"ot":"No","ov":236000,"oid":"148472913383759455","otd":306,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Mallorca Clean Sheet","topKey":"90","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":305},{"osn":"no","otd":306}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"90","hpon":95,"hton":"0"},{"hids":0,"chpid":"100","hlf":0,"hl":[{"hid":"149414704093154631","hon":"117800","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":149000,"cds":"AO","os":1,"ot":"Yes","ov":149000,"oid":"143599971741634279","otd":284,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":249000,"cds":"AO","os":1,"ot":"No","ov":249000,"oid":"141554276745638584","otd":285,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Villarreal Clean Sheet","topKey":"100","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":284},{"osn":"no","otd":285}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"100","hpon":96,"hton":"0"},{"hids":1,"chpid":"383","hlf":0,"hl":[{"hid":"144455526125148927","hon":"800900","hn":null,"hs":0,"ol":[{"otv":"Mallorca-Win By 1 Goal","obv":400000,"cds":"AO","os":1,"ot":"1And1","ov":400000,"oid":"148410500417203043","otd":1,"ott":"Mallorca-Win By ","on":"1","ots":""},{"otv":"Villarreal-Win By 1 Goal","obv":405000,"cds":"AO","os":1,"ot":"2And1","ov":405000,"oid":"141461303240230807","otd":2,"ott":"Villarreal-Win By ","on":"1","ots":""},{"otv":"Mallorca-Win By 2+ Goal","obv":920000,"cds":"AO","os":1,"ot":"1And2+","ov":920000,"oid":"143590935014101840","otd":1,"ott":"Mallorca-Win By ","on":"2+","ots":""},{"otv":"Villarreal-Win By 2+ Goal","obv":920000,"cds":"AO","os":1,"ot":"2And2+","ov":940000,"oid":"142532513523220759","otd":2,"ott":"Villarreal-Win By ","on":"2+","ots":""},{"otv":" Draw and Goal","obv":620000,"cds":"AO","os":1,"ot":"X1","ov":640000,"oid":"140440573492461595","otd":0,"ott":"","on":"Draw and Goal","ots":""},{"otv":" None","obv":335000,"cds":"AO","os":1,"ot":"X0","ov":335000,"oid":"143191087145733174","otd":0,"ott":"","on":"None","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd Half - Winning Margin","topKey":"383","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Villarreal","otd":2}],"hpt":5,"hsw":"1,4,5","hlid":"0","hpid":"383","hpon":98,"hton":"0"},{"hids":1,"chpid":"142","hlf":0,"hl":[{"hid":"140881910467482461","hon":"2500","hn":1,"hs":0,"ol":[{"otv":"Mallorca ","obv":184000,"cds":"AO","os":1,"ot":"1","ov":184000,"oid":"146820650229610014","otd":461,"ott":"Mallorca","on":"","ots":""},{"otv":"Villarreal ","obv":186000,"cds":"AO","os":1,"ot":"2","ov":186000,"oid":"141481723503441250","otd":462,"ott":"Villarreal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Draw No Bet","topKey":"142","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca","otd":461},{"osn":"Villarreal","otd":462}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"142","hpon":99,"hton":"0"},{"hids":1,"chpid":"26","hlf":1,"hl":[{"hid":"144618958449343571","hon":"24600","hn":1,"hs":0,"ol":[{"otv":"over  1/1.5","obv":206000,"cds":"AO","os":1,"ot":"Over","ov":206000,"oid":"144256816950124740","otd":98,"ott":"over ","on":"1/1.5","ots":""},{"otv":"under  1/1.5","obv":182000,"cds":"AO","os":1,"ot":"Under","ov":182000,"oid":"141604224515653145","otd":97,"ott":"under ","on":"1/1.5","ots":""}],"hv":"1/1.5","hmt":0,"ad2":"","ad1":""},{"hid":"141184094244060510","hon":"79900","hn":2,"hs":0,"ol":[{"otv":"over  1.0","obv":161000,"cds":"AO","os":1,"ot":"Over","ov":161000,"oid":"145562304050854901","otd":98,"ott":"over ","on":"1.0","ots":""},{"otv":"under  1.0","obv":236000,"cds":"AO","os":1,"ot":"Under","ov":236000,"oid":"141856956213016075","otd":97,"ott":"under ","on":"1.0","ots":""}],"hv":"1.0","hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Total Goals","topKey":"26","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":98},{"osn":"under ","otd":97}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"26","hpon":100,"hton":"0"},{"hids":1,"chpid":"143","hlf":1,"hl":[{"hid":"142000403512723405","hon":"2500","hn":1,"hs":0,"ol":[{"otv":"Mallorca  0","obv":193000,"cds":"AO","os":1,"ot":"1","ov":193000,"oid":"140529214100300935","otd":463,"ott":"Mallorca ","on":"0","ots":""},{"otv":"Villarreal  0","obv":197000,"cds":"AO","os":1,"ot":"2","ov":197000,"oid":"140585740420535414","otd":464,"ott":"Villarreal ","on":"0","ots":""}],"hv":"0","hmt":0,"ad2":"","ad1":""},{"hid":"142431333763014516","hon":"102000","hn":2,"hs":0,"ol":[{"otv":"Mallorca  -0/0.5","obv":250000,"cds":"AO","os":1,"ot":"1","ov":251000,"oid":"144335736237971704","otd":463,"ott":"Mallorca ","on":"-0/0.5","ots":""},{"otv":"Villarreal  +0/0.5","obv":156000,"cds":"AO","os":1,"ot":"2","ov":156000,"oid":"145450154445944745","otd":464,"ott":"Villarreal ","on":"+0/0.5","ots":""}],"hv":"-0/0.5","hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Handicap","topKey":"143","mid":"2601549","hmm":1,"hps":"S3|0:0","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca ","otd":463},{"osn":"Villarreal ","otd":464}],"hpt":2,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"143","hpon":101,"hton":"0"},{"hids":1,"chpid":"25","hlf":0,"hl":[{"hid":"147532512006165948","hon":"77600","hn":null,"hs":0,"ol":[{"otv":"Mallorca ","obv":300000,"cds":"AO","os":1,"ot":"1","ov":300000,"oid":"140393434402645242","otd":92,"ott":"Mallorca","on":"","ots":""},{"otv":"draw ","obv":237000,"cds":"AO","os":1,"ot":"X","ov":237000,"oid":"147113905451773216","otd":93,"ott":"draw","on":"","ots":""},{"otv":"Villarreal ","obv":305000,"cds":"AO","os":1,"ot":"2","ov":305000,"oid":"141504408055508643","otd":94,"ott":"Villarreal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - 1x2","topKey":"25","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":92},{"osn":"draw","otd":93},{"osn":"Villarreal","otd":94}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"25","hpon":102,"hton":"0"},{"hids":1,"chpid":"71","hlf":1,"hl":[{"hid":"141849122062638057","hon":"1015000","hn":1,"hs":0,"ol":[{"otv":"Mallorca  -1","obv":870000,"cds":"AO","os":1,"ot":"1","ov":880000,"oid":"148152930501743503","otd":230,"ott":"Mallorca ","on":"-1","ots":""},{"otv":"Draw (Mallorca-1)","obv":400000,"cds":"AO","os":1,"ot":"X","ov":400000,"oid":"145217451458411313","otd":231,"ott":"Draw ","on":"-1","ots":""},{"otv":"Villarreal  +1","obv":135000,"cds":"AO","os":1,"ot":"2","ov":135000,"oid":"142216351841712532","otd":232,"ott":"Villarreal ","on":"+1","ots":""}],"hv":"-1","hmt":0,"ad2":"","ad1":""},{"hid":"148772131107203526","hon":"1039300","hn":2,"hs":0,"ol":[{"otv":"Mallorca  +1","obv":134000,"cds":"AO","os":1,"ot":"1","ov":134000,"oid":"140134865395810137","otd":230,"ott":"Mallorca ","on":"+1","ots":""},{"otv":"Draw (Mallorca+1)","obv":400000,"cds":"AO","os":1,"ot":"X","ov":400000,"oid":"147053522220035013","otd":231,"ott":"Draw ","on":"+1","ots":""},{"otv":"Villarreal  -1","obv":870000,"cds":"AO","os":1,"ot":"2","ov":890000,"oid":"142544303053765665","otd":232,"ott":"Villarreal ","on":"-1","ots":""}],"hv":"1","hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Handicap 3 Way","topKey":"71","mid":"2601549","hmm":1,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca ","otd":230},{"osn":"Draw ","otd":231},{"osn":"Villarreal ","otd":232}],"hpt":7,"hsw":"1,4,5","hlid":"0","hpid":"71","hpon":103,"hton":"0"},{"hids":1,"chpid":"72","hlf":0,"hl":[{"hid":"145542103223105588","hon":"21700","hn":null,"hs":0,"ol":[{"otv":" Mallorca or draw","obv":130000,"cds":"AO","os":1,"ot":"1X","ov":130000,"oid":"149868515102524152","otd":233,"ott":"","on":"Mallorca or draw","ots":""},{"otv":" Mallorca or Villarreal","obv":148000,"cds":"AO","os":1,"ot":"12","ov":148000,"oid":"143560943388129214","otd":234,"ott":"","on":"Mallorca or Villarreal","ots":""},{"otv":" draw or Villarreal","obv":131000,"cds":"AO","os":1,"ot":"X2","ov":131000,"oid":"143153932202209361","otd":235,"ott":"","on":"draw or Villarreal","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Double Chance","topKey":"72","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca or draw","otd":233},{"osn":"Mallorca or Villarreal","otd":234},{"osn":"draw or Villarreal","otd":235}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"72","hpon":104,"hton":"0"},{"hids":1,"chpid":"73","hlf":0,"hl":[{"hid":"148994103333197278","hon":"373100","hn":null,"hs":0,"ol":[{"otv":" 0","obv":330000,"cds":"AO","os":1,"ot":"0","ov":330000,"oid":"142811243031445458","otd":0,"ott":"","on":"0","ots":""},{"otv":" 1","obv":252000,"cds":"AO","os":1,"ot":"1","ov":252000,"oid":"144439725555042430","otd":0,"ott":"","on":"1","ots":""},{"otv":" 2","obv":360000,"cds":"AO","os":1,"ot":"2","ov":360000,"oid":"145464442546431497","otd":0,"ott":"","on":"2","ots":""},{"otv":" 3+","obv":520000,"cds":"AO","os":1,"ot":"3+","ov":530000,"oid":"141552380421827414","otd":0,"ott":"","on":"3+","ots":""}],"hv":"3+","hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Exact Goals","topKey":"73","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"73","hpon":105,"hton":"0"},{"hids":1,"chpid":"379","hlf":0,"hl":[{"hid":"143106519553340147","hon":"3042200","hn":null,"hs":0,"ol":[{"otv":" 0","obv":175000,"cds":"AO","os":1,"ot":"0","ov":175000,"oid":"142276254830480907","otd":0,"ott":"","on":"0","ots":""},{"otv":" 1","obv":252000,"cds":"AO","os":1,"ot":"1","ov":253000,"oid":"147488232328153413","otd":0,"ott":"","on":"1","ots":""},{"otv":" 2","obv":650000,"cds":"AO","os":1,"ot":"2","ov":650000,"oid":"141540471792810340","otd":0,"ott":"","on":"2","ots":""},{"otv":" 3+","obv":1550000,"cds":"AO","os":1,"ot":"3+","ov":1550000,"oid":"144378839415946632","otd":0,"ott":"","on":"3+","ots":""}],"hv":"3+","hmt":0,"ad2":"","ad1":""}],"hpn":"2nd Half - Mallorca Exact Goals","topKey":"379","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"379","hpon":106,"hton":"0"},{"hids":1,"chpid":"380","hlf":0,"hl":[{"hid":"140140213123210516","hon":"3117300","hn":null,"hs":0,"ol":[{"otv":" 0","obv":174000,"cds":"AO","os":1,"ot":"0","ov":174000,"oid":"148173896153252419","otd":0,"ott":"","on":"0","ots":""},{"otv":" 1","obv":252000,"cds":"AO","os":1,"ot":"1","ov":254000,"oid":"140525113212314546","otd":0,"ott":"","on":"1","ots":""},{"otv":" 2","obv":650000,"cds":"AO","os":1,"ot":"2","ov":660000,"oid":"148247003675497473","otd":0,"ott":"","on":"2","ots":""},{"otv":" 3+","obv":1600000,"cds":"AO","os":1,"ot":"3+","ov":1600000,"oid":"141075616216428259","otd":0,"ott":"","on":"3+","ots":""}],"hv":"3+","hmt":0,"ad2":"","ad1":""}],"hpn":"2nd Half - Villarreal Exact Goals","topKey":"380","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[],"hpt":0,"hsw":"1,4,5","hlid":"0","hpid":"380","hpon":107,"hton":"0"},{"hids":1,"chpid":"75","hlf":0,"hl":[{"hid":"148218815134171714","hon":"27600","hn":null,"hs":0,"ol":[{"otv":"odd ","obv":206000,"cds":"AO","os":1,"ot":"Odd","ov":206000,"oid":"141248401561513374","otd":282,"ott":"odd","on":"","ots":""},{"otv":"even ","obv":180000,"cds":"AO","os":1,"ot":"Even","ov":180000,"oid":"140346418946650357","otd":283,"ott":"even","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Odd/Even","topKey":"75","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"odd","otd":282},{"osn":"even","otd":283}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"75","hpon":108,"hton":"0"},{"hids":1,"chpid":"88","hlf":1,"hl":[{"hid":"142674214434681073","hon":"8300","hn":1,"hs":0,"ol":[{"otv":"over  0.5","obv":196000,"cds":"AO","os":1,"ot":"Over","ov":196000,"oid":"149372803457532371","otd":310,"ott":"over ","on":"0.5","ots":""},{"otv":"under  0.5","obv":186000,"cds":"AO","os":1,"ot":"Under","ov":186000,"oid":"145301450942464452","otd":309,"ott":"under ","on":"0.5","ots":""}],"hv":"0.5","hmt":0,"ad2":"","ad1":""},{"hid":"142943590511344256","hon":"566400","hn":2,"hs":0,"ol":[{"otv":"over  1.5","obv":440000,"cds":"AO","os":1,"ot":"Over","ov":444000,"oid":"142851007615068840","otd":310,"ott":"over ","on":"1.5","ots":""},{"otv":"under  1.5","obv":111000,"cds":"AO","os":1,"ot":"Under","ov":111000,"oid":"148846029650245025","otd":309,"ott":"under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Mallorca Total Goals","topKey":"88","mid":"2601549","hmm":1,"hps":"","hshow":"No","jno":null,"title":[{"osn":"over ","otd":310},{"osn":"under ","otd":309}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"88","hpon":109,"hton":"0"},{"hids":1,"chpid":"98","hlf":1,"hl":[{"hid":"144438549174242524","hon":"10800","hn":1,"hs":0,"ol":[{"otv":"over  0.5","obv":197000,"cds":"AO","os":1,"ot":"Over","ov":197000,"oid":"141183069460038203","otd":289,"ott":"over ","on":"0.5","ots":""},{"otv":"under  0.5","obv":185000,"cds":"AO","os":1,"ot":"Under","ov":185000,"oid":"140301242186508012","otd":288,"ott":"under ","on":"0.5","ots":""}],"hv":"0.5","hmt":0,"ad2":"","ad1":""},{"hid":"140316235545019880","hon":"576400","hn":2,"hs":0,"ol":[{"otv":"over  1.5","obv":455000,"cds":"AO","os":1,"ot":"Over","ov":444000,"oid":"141315595130516514","otd":289,"ott":"over ","on":"1.5","ots":""},{"otv":"under  1.5","obv":110000,"cds":"AO","os":1,"ot":"Under","ov":110000,"oid":"142272912505238448","otd":288,"ott":"under ","on":"1.5","ots":""}],"hv":"1.5","hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Villarreal Total Goals","topKey":"98","mid":"2601549","hmm":1,"hps":"","hshow":"No","jno":null,"title":[{"osn":"over ","otd":289},{"osn":"under ","otd":288}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"98","hpon":110,"hton":"0"},{"hids":0,"chpid":"89","hlf":0,"hl":[{"hid":"143406524309427586","hon":"10800","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":185000,"cds":"AO","os":1,"ot":"Yes","ov":185000,"oid":"144102022724357317","otd":307,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":197000,"cds":"AO","os":1,"ot":"No","ov":197000,"oid":"147905573109934022","otd":308,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Mallorca Clean Sheet","topKey":"89","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":307},{"osn":"no","otd":308}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"89","hpon":111,"hton":"0"},{"hids":0,"chpid":"99","hlf":0,"hl":[{"hid":"142155654773292729","hon":"8300","hn":null,"hs":0,"ol":[{"otv":"yes ","obv":186000,"cds":"AO","os":1,"ot":"Yes","ov":186000,"oid":"140900014102120402","otd":286,"ott":"yes","on":"","ots":""},{"otv":"no ","obv":196000,"cds":"AO","os":1,"ot":"No","ov":196000,"oid":"145605455116637576","otd":287,"ott":"no","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"2nd half - Villarreal Clean Sheet","topKey":"99","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"yes","otd":286},{"osn":"no","otd":287}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"99","hpon":112,"hton":"0"},{"hids":1,"chpid":"114","hlf":1,"hl":[{"hid":"141190228224029917","hon":"27957","hn":1,"hs":0,"ol":[{"otv":"over  8.5","obv":177000,"cds":"LS","os":1,"ot":"Over","ov":176000,"oid":"140713370354324659","otd":397,"ott":"over ","on":"8.5","ots":""},{"otv":"under  8.5","obv":202000,"cds":"LS","os":1,"ot":"Under","ov":204000,"oid":"143169348209124821","otd":396,"ott":"under ","on":"8.5","ots":""}],"hv":"8.5","hmt":0,"ad2":"","ad1":""}],"hpn":"Total Corners","topKey":"114","mid":"2601549","hmm":1,"hps":"S5|0:0","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":397},{"osn":"under ","otd":396}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"114","hpon":113,"hton":"0"},{"hids":1,"chpid":"122","hlf":1,"hl":[{"hid":"143313268443242138","hon":"39491","hn":1,"hs":0,"ol":[{"otv":"over  3.5","obv":172000,"cds":"LS","os":1,"ot":"Over","ov":172000,"oid":"145561013514885549","otd":413,"ott":"over ","on":"3.5","ots":""},{"otv":"under  3.5","obv":207000,"cds":"LS","os":1,"ot":"Under","ov":208000,"oid":"148210543851501954","otd":412,"ott":"under ","on":"3.5","ots":""}],"hv":"3.5","hmt":0,"ad2":"","ad1":""}],"hpn":"1st half - Total Corners","topKey":"122","mid":"2601549","hmm":1,"hps":"S15|0:0","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":413},{"osn":"under ","otd":412}],"hpt":5,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"122","hpon":119,"hton":"0"},{"hids":0,"chpid":"3201","hlf":0,"hl":[{"hid":"142899226533583053","hon":"976800","hn":null,"hs":0,"ol":[{"otv":"Mallorca ","obv":820000,"cds":"AO","os":1,"ot":"1","ov":840000,"oid":"141930259556360030","otd":610,"ott":"Mallorca","on":"","ots":""},{"otv":"draw ","obv":117000,"cds":"AO","os":1,"ot":"X","ov":117000,"oid":"146135491345210510","otd":611,"ott":"draw","on":"","ots":""},{"otv":"Villarreal ","obv":770000,"cds":"AO","os":1,"ot":"2","ov":780000,"oid":"146238142101668350","otd":612,"ott":"Villarreal","on":"","ots":""}],"hv":null,"hmt":0,"ad2":"","ad1":""}],"hpn":"15 Minutes (begins-14:59) - 1X2","topKey":"32-1-15","mid":"2601549","hmm":0,"hps":"S1001|0:0","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":610},{"osn":"draw","otd":611},{"osn":"Villarreal","otd":612}],"hpt":1,"hsw":"1,4,5","hlid":"0","hpid":"32","hpon":123,"hton":"0"},{"hids":0,"chpid":"3301","hlf":1,"hl":[{"hid":"140426275251752301","hon":"19000","hn":null,"hs":0,"ol":[{"otv":"Mallorca  0","obv":205000,"cds":"AO","os":1,"ot":"1","ov":205000,"oid":"148442470645848435","otd":613,"ott":"Mallorca ","on":"0","ots":""},{"otv":"Villarreal  0","obv":185000,"cds":"AO","os":1,"ot":"2","ov":185000,"oid":"144112435080904622","otd":614,"ott":"Villarreal ","on":"0","ots":""}],"hv":"0","hmt":0,"ad2":"","ad1":""}],"hpn":"15 Minutes (begins-14:59) - Handicap","topKey":"33-1-15","mid":"2601549","hmm":1,"hps":"S1001|0:0","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca ","otd":613},{"osn":"Villarreal ","otd":614}],"hpt":2,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"33","hpon":124,"hton":"0"},{"hids":1,"chpid":"3401","hlf":1,"hl":[{"hid":"141140771068021250","hon":"372700","hn":null,"hs":0,"ol":[{"otv":"over  0.5","obv":400000,"cds":"AO","os":1,"ot":"Over","ov":394000,"oid":"140730183239345562","otd":615,"ott":"over ","on":"0.5","ots":""},{"otv":"under  0.5","obv":121000,"cds":"AO","os":1,"ot":"Under","ov":121000,"oid":"142521073231251901","otd":616,"ott":"under ","on":"0.5","ots":""}],"hv":"0.5","hmt":0,"ad2":"","ad1":""}],"hpn":"15 Minutes (begins-14:59) - Total Goals","topKey":"34-1-15","mid":"2601549","hmm":1,"hps":"S1001|0:0","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":615},{"osn":"under ","otd":616}],"hpt":2,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"34","hpon":126,"hton":"0"},{"hids":1,"chpid":"307","hlf":0,"hl":[{"hid":"145234346190731924","hon":"0","hn":1,"hs":0,"ol":[{"otv":"over  5.5","obv":183000,"cds":"LS","os":1,"ot":"Over","ov":189000,"oid":"141043971245685512","otd":966,"ott":"over ","on":"5.5","ots":""},{"otv":"under  5.5","obv":183000,"cds":"LS","os":1,"ot":"Under","ov":191000,"oid":"141741097133135358","otd":967,"ott":"under ","on":"5.5","ots":""}],"hv":"5.5","hmt":0,"ad2":"","ad1":""}],"hpn":"Total Bookings","topKey":"307","mid":"2601549","hmm":1,"hps":"S10102|1:0","hshow":"Yes","jno":null,"title":[{"osn":"over ","otd":966},{"osn":"under ","otd":967}],"hpt":2,"hsw":"1,2,3,4,5,6","hlid":"0","hpid":"307","hpon":132,"hton":"0"},{"hids":1,"chpid":"36","hlf":0,"hl":[{"hid":"144079302821371350","hon":"6629474","hn":null,"hs":0,"ol":[{"otv":" Vedat Muriqi","obv":231000,"cds":"BG","os":1,"ot":"2011003","ov":231000,"oid":"148020015845894051","otd":1,"ott":"","on":"Vedat Muriqi","ots":""},{"otv":" Gerard Moreno","obv":360000,"cds":"BG","os":1,"ot":"2030420","ov":360000,"oid":"142859236224356119","otd":2,"ott":"","on":"Gerard Moreno","ots":""},{"otv":" Alexander Sorloth","obv":360000,"cds":"BG","os":1,"ot":"2025500","ov":360000,"oid":"142148347252344233","otd":2,"ott":"","on":"Alexander Sorloth","ots":""},{"otv":" Amath Ndiaye","obv":405000,"cds":"BG","os":1,"ot":"2030376","ov":405000,"oid":"144352835255185460","otd":1,"ott":"","on":"Amath Ndiaye","ots":""},{"otv":" Ben Brereton","obv":420000,"cds":"BG","os":1,"ot":"2016067","ov":420000,"oid":"142444558573111132","otd":2,"ott":"","on":"Ben Brereton","ots":""},{"otv":" Alex Baena","obv":570000,"cds":"BG","os":1,"ot":"2030419","ov":570000,"oid":"146750381641731103","otd":2,"ott":"","on":"Alex Baena","ots":""},{"otv":" Dani Rodriguez Vazquez","obv":600000,"cds":"BG","os":1,"ot":"2030348","ov":600000,"oid":"147830441914071100","otd":1,"ott":"","on":"Dani Rodriguez Vazquez","ots":""},{"otv":" Dani Parejo","obv":1250000,"cds":"BG","os":1,"ot":"2030424","ov":1250000,"oid":"142321223170370701","otd":2,"ott":"","on":"Dani Parejo","ots":""},{"otv":" Manu Morlanes","obv":1400000,"cds":"BG","os":1,"ot":"2030418","ov":1400000,"oid":"146962500820236400","otd":1,"ott":"","on":"Manu Morlanes","ots":""},{"otv":" Antonio Raillo","obv":1400000,"cds":"BG","os":1,"ot":"2030338","ov":1400000,"oid":"142531382692160378","otd":1,"ott":"","on":"Antonio Raillo","ots":""},{"otv":" Pablo Maffeo","obv":1650000,"cds":"BG","os":1,"ot":"2030382","ov":1650000,"oid":"148101916121971751","otd":1,"ott":"","on":"Pablo Maffeo","ots":""},{"otv":" Ramon Terrats","obv":1850000,"cds":"BG","os":1,"ot":"289966702859059202","ov":1850000,"oid":"144283681144555644","otd":2,"ott":"","on":"Ramon Terrats","ots":""},{"otv":" Alfonso Pedraza","obv":2500000,"cds":"BG","os":1,"ot":"2030422","ov":2500000,"oid":"146141326138010742","otd":2,"ott":"","on":"Alfonso Pedraza","ots":""},{"otv":" Jaume Costa","obv":3000000,"cds":"BG","os":1,"ot":"2030380","ov":3000000,"oid":"146471403635570202","otd":1,"ott":"","on":"Jaume Costa","ots":""},{"otv":" Jorge Cuenca","obv":3500000,"cds":"BG","os":1,"ot":"2030430","ov":3700000,"oid":"142243055419871580","otd":2,"ott":"","on":"Jorge Cuenca","ots":""},{"otv":" Jose Manuel Arias Copete","obv":3500000,"cds":"BG","os":1,"ot":"2032260","ov":3800000,"oid":"141200851855471815","otd":1,"ott":"","on":"Jose Manuel Arias Copete","ots":""},{"otv":" Martin Valjent","obv":3500000,"cds":"BG","os":1,"ot":"2030342","ov":3800000,"oid":"147010218273667460","otd":1,"ott":"","on":"Martin Valjent","ots":""},{"otv":" Omar Mascarell","obv":4000000,"cds":"BG","os":1,"ot":"2025546","ov":4000000,"oid":"142042032295889413","otd":1,"ott":"","on":"Omar Mascarell","ots":""},{"otv":" Juan Foyth","obv":4000000,"cds":"BG","os":1,"ot":"2030431","ov":4100000,"oid":"140420620147731604","otd":2,"ott":"","on":"Juan Foyth","ots":""},{"otv":" Matteo Gabbia","obv":4000000,"cds":"BG","os":1,"ot":"2010798","ov":4100000,"oid":"145892491425413155","otd":2,"ott":"","on":"Matteo Gabbia","ots":""}],"hv":"2","hmt":0,"ad2":"","ad1":""}],"hpn":"Anytime Goalscorer","topKey":"36","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Villarreal","otd":2}],"hpt":6,"hsw":"1,4,5","hlid":"0","hpid":"36","hpon":184,"hton":"0"},{"hids":0,"chpid":"14801","hlf":0,"hl":[{"hid":"144673640711521492","hon":"16964846","hn":null,"hs":0,"ol":[{"otv":" Vedat Muriqi","obv":440000,"cds":"BG","os":1,"ot":"2011003","ov":440000,"oid":"140943113553233115","otd":1,"ott":"","on":"Vedat Muriqi","ots":""},{"otv":" Alexander Sorloth","obv":750000,"cds":"BG","os":1,"ot":"2025500","ov":760000,"oid":"141755910507051922","otd":2,"ott":"","on":"Alexander Sorloth","ots":""},{"otv":" Gerard Moreno","obv":770000,"cds":"BG","os":1,"ot":"2030420","ov":770000,"oid":"144001402025021496","otd":2,"ott":"","on":"Gerard Moreno","ots":""},{"otv":" No GoalScorer","obv":820000,"cds":"BG","os":1,"ot":"None","ov":830000,"oid":"147408526567848663","otd":0,"ott":"","on":"No GoalScorer","ots":""},{"otv":" Amath Ndiaye","obv":870000,"cds":"BG","os":1,"ot":"2030376","ov":890000,"oid":"149433224193484341","otd":1,"ott":"","on":"Amath Ndiaye","ots":""},{"otv":" Ben Brereton","obv":900000,"cds":"BG","os":1,"ot":"2016067","ov":910000,"oid":"142565263539513620","otd":2,"ott":"","on":"Ben Brereton","ots":""},{"otv":" Alex Baena","obv":1250000,"cds":"BG","os":1,"ot":"2030419","ov":1250000,"oid":"149417418176933224","otd":2,"ott":"","on":"Alex Baena","ots":""},{"otv":" Dani Rodriguez Vazquez","obv":1300000,"cds":"BG","os":1,"ot":"2030348","ov":1300000,"oid":"143803804023512517","otd":1,"ott":"","on":"Dani Rodriguez Vazquez","ots":""},{"otv":" Dani Parejo","obv":2700000,"cds":"BG","os":1,"ot":"2030424","ov":2700000,"oid":"149015387787238451","otd":2,"ott":"","on":"Dani Parejo","ots":""},{"otv":" Antonio Raillo","obv":3000000,"cds":"BG","os":1,"ot":"2030338","ov":3000000,"oid":"148547043122277687","otd":1,"ott":"","on":"Antonio Raillo","ots":""},{"otv":" Manu Morlanes","obv":3000000,"cds":"BG","os":1,"ot":"2030418","ov":3100000,"oid":"145534445854006385","otd":1,"ott":"","on":"Manu Morlanes","ots":""},{"otv":" Pablo Maffeo","obv":3500000,"cds":"BG","os":1,"ot":"2030382","ov":3500000,"oid":"148014557152482227","otd":1,"ott":"","on":"Pablo Maffeo","ots":""},{"otv":" Ramon Terrats","obv":4000000,"cds":"BG","os":1,"ot":"289966702859059202","ov":4100000,"oid":"144400273422217154","otd":2,"ott":"","on":"Ramon Terrats","ots":""},{"otv":" Alfonso Pedraza","obv":5000000,"cds":"BG","os":1,"ot":"2030422","ov":5100000,"oid":"146147417434059831","otd":2,"ott":"","on":"Alfonso Pedraza","ots":""},{"otv":" Jaume Costa","obv":6000000,"cds":"BG","os":1,"ot":"2030380","ov":6100000,"oid":"142121103519539653","otd":1,"ott":"","on":"Jaume Costa","ots":""},{"otv":" Jorge Cuenca","obv":7500000,"cds":"BG","os":1,"ot":"2030430","ov":7600000,"oid":"145661108392821651","otd":2,"ott":"","on":"Jorge Cuenca","ots":""},{"otv":" Jose Manuel Arias Copete","obv":8000000,"cds":"BG","os":1,"ot":"2032260","ov":8100000,"oid":"145585240731142044","otd":1,"ott":"","on":"Jose Manuel Arias Copete","ots":""},{"otv":" Omar Mascarell","obv":8000000,"cds":"BG","os":1,"ot":"2025546","ov":8100000,"oid":"144134869585472333","otd":1,"ott":"","on":"Omar Mascarell","ots":""},{"otv":" Martin Valjent","obv":8000000,"cds":"BG","os":1,"ot":"2030342","ov":8100000,"oid":"149031455013225462","otd":1,"ott":"","on":"Martin Valjent","ots":""},{"otv":" Juan Foyth","obv":8500000,"cds":"BG","os":1,"ot":"2030431","ov":8600000,"oid":"144646953306119095","otd":2,"ott":"","on":"Juan Foyth","ots":""},{"otv":" Matteo Gabbia","obv":8500000,"cds":"BG","os":1,"ot":"2010798","ov":8600000,"oid":"144466695660300650","otd":2,"ott":"","on":"Matteo Gabbia","ots":""}],"hv":"1","hmt":0,"ad2":"","ad1":""}],"hpn":"1st Goalscorer","topKey":"148-1","mid":"2601549","hmm":0,"hps":"","hshow":"Yes","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Villarreal","otd":2}],"hpt":6,"hsw":"1,4,5","hlid":"0","hpid":"148","hpon":189,"hton":"0"},{"hids":1,"chpid":"151","hlf":0,"hl":[{"hid":"149245574565218307","hon":"908990908","hn":null,"hs":0,"ol":[{"otv":" Vedat Muriqi","obv":900000,"cds":"BG","os":1,"ot":"2011003","ov":910000,"oid":"144326200355215201","otd":1,"ott":"","on":"Vedat Muriqi","ots":""},{"otv":" Gerard Moreno","obv":2200000,"cds":"BG","os":1,"ot":"2030420","ov":2200000,"oid":"146859353239509194","otd":2,"ott":"","on":"Gerard Moreno","ots":""},{"otv":" Alexander Sorloth","obv":2200000,"cds":"BG","os":1,"ot":"2025500","ov":2200000,"oid":"145480003423550515","otd":2,"ott":"","on":"Alexander Sorloth","ots":""},{"otv":" Amath Ndiaye","obv":2800000,"cds":"BG","os":1,"ot":"2030376","ov":2800000,"oid":"145865104001780570","otd":1,"ott":"","on":"Amath Ndiaye","ots":""},{"otv":" Ben Brereton","obv":3000000,"cds":"BG","os":1,"ot":"2016067","ov":3000000,"oid":"142183545281041530","otd":2,"ott":"","on":"Ben Brereton","ots":""},{"otv":" Alex Baena","obv":5000000,"cds":"BG","os":1,"ot":"2030419","ov":5100000,"oid":"145739707464525486","otd":2,"ott":"","on":"Alex Baena","ots":""},{"otv":" Dani Rodriguez Vazquez","obv":5500000,"cds":"BG","os":1,"ot":"2030348","ov":5600000,"oid":"144232265082346712","otd":1,"ott":"","on":"Dani Rodriguez Vazquez","ots":""},{"otv":" Jose Manuel Arias Copete","obv":10100000,"cds":"BG","os":1,"ot":"2032260","ov":10100000,"oid":"140112174614237158","otd":1,"ott":"","on":"Jose Manuel Arias Copete","ots":""},{"otv":" Jaume Costa","obv":10100000,"cds":"BG","os":1,"ot":"2030380","ov":10100000,"oid":"148099600432201380","otd":1,"ott":"","on":"Jaume Costa","ots":""},{"otv":" Jorge Cuenca","obv":10100000,"cds":"BG","os":1,"ot":"2030430","ov":10100000,"oid":"146307445156333514","otd":2,"ott":"","on":"Jorge Cuenca","ots":""},{"otv":" Juan Foyth","obv":10100000,"cds":"BG","os":1,"ot":"2030431","ov":10100000,"oid":"144115411354323569","otd":2,"ott":"","on":"Juan Foyth","ots":""},{"otv":" Matteo Gabbia","obv":10100000,"cds":"BG","os":1,"ot":"2010798","ov":10100000,"oid":"140285945287168941","otd":2,"ott":"","on":"Matteo Gabbia","ots":""},{"otv":" Pablo Maffeo","obv":10100000,"cds":"BG","os":1,"ot":"2030382","ov":10100000,"oid":"142712393984481900","otd":1,"ott":"","on":"Pablo Maffeo","ots":""},{"otv":" Omar Mascarell","obv":10100000,"cds":"BG","os":1,"ot":"2025546","ov":10100000,"oid":"140450085336021083","otd":1,"ott":"","on":"Omar Mascarell","ots":""},{"otv":" Manu Morlanes","obv":10100000,"cds":"BG","os":1,"ot":"2030418","ov":10100000,"oid":"145715109936622981","otd":1,"ott":"","on":"Manu Morlanes","ots":""},{"otv":" Dani Parejo","obv":10100000,"cds":"BG","os":1,"ot":"2030424","ov":10100000,"oid":"144538330943751441","otd":2,"ott":"","on":"Dani Parejo","ots":""},{"otv":" Alfonso Pedraza","obv":10100000,"cds":"BG","os":1,"ot":"2030422","ov":10100000,"oid":"147194563524425328","otd":2,"ott":"","on":"Alfonso Pedraza","ots":""},{"otv":" Antonio Raillo","obv":10100000,"cds":"BG","os":1,"ot":"2030338","ov":10100000,"oid":"140940255518243341","otd":1,"ott":"","on":"Antonio Raillo","ots":""},{"otv":" Ramon Terrats","obv":10100000,"cds":"BG","os":1,"ot":"289966702859059202","ov":10100000,"oid":"147496237033111216","otd":2,"ott":"","on":"Ramon Terrats","ots":""},{"otv":" Martin Valjent","obv":10100000,"cds":"BG","os":1,"ot":"2030342","ov":10100000,"oid":"149713448410552123","otd":1,"ott":"","on":"Martin Valjent","ots":""}],"hv":"","hmt":0,"ad2":"","ad1":""}],"hpn":"Player to Score 2+","topKey":"151","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Villarreal","otd":2}],"hpt":6,"hsw":"1,4,5","hlid":"0","hpid":"151","hpon":192,"hton":"0"},{"hids":1,"chpid":"152","hlf":0,"hl":[{"hid":"145544213142484250","hon":"2147383647","hn":null,"hs":0,"ol":[{"otv":" Vedat Muriqi","obv":4500000,"cds":"BG","os":1,"ot":"2011003","ov":4600000,"oid":"141502111024334848","otd":1,"ott":"","on":"Vedat Muriqi","ots":""},{"otv":" Alex Baena","obv":10100000,"cds":"BG","os":1,"ot":"2030419","ov":10100000,"oid":"143331980713705131","otd":2,"ott":"","on":"Alex Baena","ots":""},{"otv":" Ben Brereton","obv":10100000,"cds":"BG","os":1,"ot":"2016067","ov":10100000,"oid":"140010446035097504","otd":2,"ott":"","on":"Ben Brereton","ots":""},{"otv":" Jose Manuel Arias Copete","obv":10100000,"cds":"BG","os":1,"ot":"2032260","ov":10100000,"oid":"142786142183033503","otd":1,"ott":"","on":"Jose Manuel Arias Copete","ots":""},{"otv":" Jaume Costa","obv":10100000,"cds":"BG","os":1,"ot":"2030380","ov":10100000,"oid":"147070461761162026","otd":1,"ott":"","on":"Jaume Costa","ots":""},{"otv":" Jorge Cuenca","obv":10100000,"cds":"BG","os":1,"ot":"2030430","ov":10100000,"oid":"143816623881085127","otd":2,"ott":"","on":"Jorge Cuenca","ots":""},{"otv":" Juan Foyth","obv":10100000,"cds":"BG","os":1,"ot":"2030431","ov":10100000,"oid":"141356918741100944","otd":2,"ott":"","on":"Juan Foyth","ots":""},{"otv":" Matteo Gabbia","obv":10100000,"cds":"BG","os":1,"ot":"2010798","ov":10100000,"oid":"140934665051940230","otd":2,"ott":"","on":"Matteo Gabbia","ots":""},{"otv":" Pablo Maffeo","obv":10100000,"cds":"BG","os":1,"ot":"2030382","ov":10100000,"oid":"141140327927553464","otd":1,"ott":"","on":"Pablo Maffeo","ots":""},{"otv":" Omar Mascarell","obv":10100000,"cds":"BG","os":1,"ot":"2025546","ov":10100000,"oid":"149840583370147402","otd":1,"ott":"","on":"Omar Mascarell","ots":""},{"otv":" Gerard Moreno","obv":10100000,"cds":"BG","os":1,"ot":"2030420","ov":10100000,"oid":"145110024568716373","otd":2,"ott":"","on":"Gerard Moreno","ots":""},{"otv":" Manu Morlanes","obv":10100000,"cds":"BG","os":1,"ot":"2030418","ov":10100000,"oid":"141570200401248552","otd":1,"ott":"","on":"Manu Morlanes","ots":""},{"otv":" Amath Ndiaye","obv":10100000,"cds":"BG","os":1,"ot":"2030376","ov":10100000,"oid":"148545115004451017","otd":1,"ott":"","on":"Amath Ndiaye","ots":""},{"otv":" Dani Parejo","obv":10100000,"cds":"BG","os":1,"ot":"2030424","ov":10100000,"oid":"140550420459557563","otd":2,"ott":"","on":"Dani Parejo","ots":""},{"otv":" Alfonso Pedraza","obv":10100000,"cds":"BG","os":1,"ot":"2030422","ov":10100000,"oid":"141605702263253215","otd":2,"ott":"","on":"Alfonso Pedraza","ots":""},{"otv":" Antonio Raillo","obv":10100000,"cds":"BG","os":1,"ot":"2030338","ov":10100000,"oid":"144020861912931001","otd":1,"ott":"","on":"Antonio Raillo","ots":""},{"otv":" Dani Rodriguez Vazquez","obv":10100000,"cds":"BG","os":1,"ot":"2030348","ov":10100000,"oid":"148013076000002006","otd":1,"ott":"","on":"Dani Rodriguez Vazquez","ots":""},{"otv":" Alexander Sorloth","obv":10100000,"cds":"BG","os":1,"ot":"2025500","ov":10100000,"oid":"144047990749398675","otd":2,"ott":"","on":"Alexander Sorloth","ots":""},{"otv":" Ramon Terrats","obv":10100000,"cds":"BG","os":1,"ot":"289966702859059202","ov":10100000,"oid":"148565183175510327","otd":2,"ott":"","on":"Ramon Terrats","ots":""},{"otv":" Martin Valjent","obv":10100000,"cds":"BG","os":1,"ot":"2030342","ov":10100000,"oid":"147231091624731474","otd":1,"ott":"","on":"Martin Valjent","ots":""}],"hv":"","hmt":0,"ad2":"","ad1":""}],"hpn":"Player to Score 3+","topKey":"152","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"Mallorca","otd":1},{"osn":"Villarreal","otd":2}],"hpt":6,"hsw":"1,4,5","hlid":"0","hpid":"152","hpon":193,"hton":"0"},{"hids":1,"chpid":"36201","hlf":0,"hl":[{"hid":"144817002435854233","hon":"21865400","hn":null,"hs":0,"ol":[{"otv":"10:00-14:59 ","obv":820000,"cds":"AO","os":1,"ot":"11-15","ov":840000,"oid":"145351033028407529","otd":1176,"ott":"10:00-14:59","on":"","ots":""},{"otv":"15:00-19:59 ","obv":920000,"cds":"AO","os":1,"ot":"16-20","ov":920000,"oid":"146373200400045252","otd":1177,"ott":"15:00-19:59","on":"","ots":""},{"otv":"20:00-24:59 ","obv":1000000,"cds":"AO","os":1,"ot":"21-25","ov":1000000,"oid":"141564248452524680","otd":1178,"ott":"20:00-24:59","on":"","ots":""},{"otv":"25:00-29:59 ","obv":1100000,"cds":"AO","os":1,"ot":"26-30","ov":1100000,"oid":"146416129184016943","otd":1179,"ott":"25:00-29:59","on":"","ots":""},{"otv":"30:00-34:59 ","obv":1200000,"cds":"AO","os":1,"ot":"31-35","ov":1200000,"oid":"147558898232717785","otd":1180,"ott":"30:00-34:59","on":"","ots":""},{"otv":"35:00-39:59 ","obv":1300000,"cds":"AO","os":1,"ot":"36-40","ov":1300000,"oid":"149053507134952034","otd":1181,"ott":"35:00-39:59","on":"","ots":""},{"otv":"40:00-45:00 ","obv":1450000,"cds":"AO","os":1,"ot":"41-45","ov":1450000,"oid":"147013292168460672","otd":1182,"ott":"40:00-45:00","on":"","ots":""},{"otv":"2H-49:59 ","obv":1700000,"cds":"AO","os":1,"ot":"46-50","ov":1700000,"oid":"148473371624132687","otd":1183,"ott":"2H-49:59","on":"","ots":""},{"otv":"50:00-54:59 ","obv":1550000,"cds":"AO","os":1,"ot":"51-55","ov":1550000,"oid":"146404808486890005","otd":1184,"ott":"50:00-54:59","on":"","ots":""},{"otv":"55:00-59:59 ","obv":1750000,"cds":"AO","os":1,"ot":"56-60","ov":1750000,"oid":"141300145596097032","otd":1185,"ott":"55:00-59:59","on":"","ots":""},{"otv":"60:00-64:59 ","obv":2000000,"cds":"AO","os":1,"ot":"61-65","ov":2000000,"oid":"149827515473275518","otd":1186,"ott":"60:00-64:59","on":"","ots":""},{"otv":"65:00-69:59 ","obv":2300000,"cds":"AO","os":1,"ot":"66-70","ov":2300000,"oid":"147217200472517090","otd":1187,"ott":"65:00-69:59","on":"","ots":""},{"otv":"70:00-74:59 ","obv":2500000,"cds":"AO","os":1,"ot":"71-75","ov":2500000,"oid":"146325007123113374","otd":1188,"ott":"70:00-74:59","on":"","ots":""},{"otv":"75:00-79:59 ","obv":2800000,"cds":"AO","os":1,"ot":"76-80","ov":2800000,"oid":"144731736556154013","otd":1189,"ott":"75:00-79:59","on":"","ots":""},{"otv":"80:00-84:59 ","obv":3000000,"cds":"AO","os":1,"ot":"81-85","ov":3100000,"oid":"146402713844165003","otd":1190,"ott":"80:00-84:59","on":"","ots":""},{"otv":"85:00-90:00 ","obv":3000000,"cds":"AO","os":1,"ot":"86-90","ov":3400000,"oid":"145895613350551642","otd":1191,"ott":"85:00-90:00","on":"","ots":""},{"otv":"No 1st Goal ","obv":850000,"cds":"AO","os":1,"ot":"NoGoal","ov":860000,"oid":"143201429242252033","otd":1192,"ott":"No 1st Goal","on":"","ots":""}],"hv":"1","hmt":0,"ad2":"","ad1":""}],"hpn":"1st Goal  (5min)","topKey":"362-1","mid":"2601549","hmm":0,"hps":"","hshow":"No","jno":null,"title":[{"osn":"00:00-04:59","otd":1174},{"osn":"05:00-09:59","otd":1175},{"osn":"10:00-14:59","otd":1176},{"osn":"15:00-19:59","otd":1177},{"osn":"20:00-24:59","otd":1178},{"osn":"25:00-29:59","otd":1179},{"osn":"30:00-34:59","otd":1180},{"osn":"35:00-39:59","otd":1181},{"osn":"40:00-45:00","otd":1182},{"osn":"2H-49:59","otd":1183},{"osn":"50:00-54:59","otd":1184},{"osn":"55:00-59:59","otd":1185},{"osn":"60:00-64:59","otd":1186},{"osn":"65:00-69:59","otd":1187},{"osn":"70:00-74:59","otd":1188},{"osn":"75:00-79:59","otd":1189},{"osn":"80:00-84:59","otd":1190},{"osn":"85:00-90:00","otd":1191},{"osn":"No 1st Goal","otd":1192},{"osn":"Injury Time Goals","otd":1193}],"hpt":3,"hsw":"1,4,5","hlid":"0","hpid":"362","hpon":226,"hton":"0"}],"msg":"Success.","ts":1692380158893
	};

    // this.MatchDataWarehouseInstance.set_list_from_match_details(match_details);
    // this.MatchDataWarehouseInstance.set_quick_query_list_from_match_details(odds_info.data)



  let h5_list={
	"code":"0000000",
	"data":[
		{
			"mcid":"",
			"tnjc":"Auto Soccer Tournament",
			"hpsBold":[],
			"csna":"足球",
			"tid":"835439",
			"mst":"879",
			"srid":"1685555247930",
			"mcg":1,
			"cosCorner":false,
			"atf":"1",
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":71,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692609905219",
			"maid":"176510",
			"mct":0,
			"tlev":1,
			"mhlut":"",
			"mo":0,
			"ctt":0,
			"mp":0,
			"csid":"1",
			"ms":1,
			"cmec":"kick_off_team",
			"cos5Minutes":true,
			"mle":46,
			"lvs":-1,
			"malu":[
				""
			],
			"hps15Minutes":[],
			"lurl":"group1/M00/15/F4/rBKy62G1XXKAYOD7AAAQt5OQKuE740.png",
			"mprmc":"PA",
			"cosOvertime":false,
			"mhn":"Auto Soccer Test001",
			"betAmount":"1.00",
			"cds":"SR",
			"frmhn":[
				"A"
			],
			"operationTournamentSort":76,
			"cos15Minutes":true,
			"mhs":0,
			"mlet":"45:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"176509",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"3530423",
			"mess":1,
			"cosBold":true,
			"lss":null,
			"mmp":"6",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":-1,
			"mbmty":1,
			"regionIdSort":1,
			"mhlu":[
				""
			],
			"seid":"",
			"mstst":"0",
			"malut":"",
			"man":"Auto Soccer Test002",
			"frman":[
				"A"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"879",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":"",
			"mft":46,
			"tn":"自动化中文赛事2",
			"msc":[
				"S1|0:0",
				"S2|0:0",
				"S5|0:0",
				"S6|0:0",
				"S8|0:0",
				"S10|0:0",
				"S11|0:0",
				"S12|0:0",
				"S13|0:0",
				"S14|0:0",
				"S15|0:0",
				"S17|0:0",
				"S18|0:0",
				"S104|0:0",
				"S105|0:0",
				"S555|0:0",
				"S1001|0:0",
				"S1002|0:0",
				"S1003|0:0",
				"S1004|0:0",
				"S1005|0:0",
				"S1006|0:0",
				"S1101|0:0",
				"S5001|0:0",
				"S5002|0:0",
				"S5003|0:0",
				"S5004|0:0",
				"S5005|0:0",
				"S5006|0:0",
				"S10011|0:0",
				"S10101|0:0",
				"S10102|0:0",
				"S10103|0:0",
				"S11001|0:0",
				"S12001|0:0",
				"S50011|0:0"
			],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"Auto Soccer Tournament",
			"hpsBold":[],
			"csna":"足球",
			"tid":"835439",
			"mst":"269",
			"srid":"1685555247931",
			"mcg":1,
			"cosCorner":true,
			"atf":"1",
			"cosPunish":true,
			"cosOutright":true,
			"mdsc":null,
			"mc":144,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692618791797",
			"maid":"176510",
			"mct":0,
			"tlev":1,
			"mhlut":"",
			"mo":0,
			"ctt":0,
			"mp":0,
			"csid":"1",
			"ms":1,
			"cmec":"match_status",
			"cos5Minutes":false,
			"mle":46,
			"lvs":-1,
			"malu":[
				""
			],
			"hps15Minutes":[],
			"lurl":"group1/M00/15/F4/rBKy62G1XXKAYOD7AAAQt5OQKuE740.png",
			"mprmc":"PA",
			"cosOvertime":true,
			"mhn":"Auto Soccer Test001",
			"betAmount":"0.00",
			"cds":"SR",
			"frmhn":[
				"A"
			],
			"operationTournamentSort":76,
			"cos15Minutes":true,
			"mhs":0,
			"mlet":"45:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"176509",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"3530442",
			"mess":1,
			"cosBold":true,
			"lss":null,
			"mmp":"6",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":-1,
			"mbmty":1,
			"regionIdSort":1,
			"mhlu":[
				""
			],
			"seid":"",
			"mstst":"0",
			"malut":"",
			"man":"Auto Soccer Test002",
			"frman":[
				"A"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"269",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":"",
			"mft":46,
			"tn":"自动化中文赛事2",
			"msc":[
				"S1|0:0",
				"S2|0:0",
				"S5|0:0",
				"S6|0:0",
				"S8|0:0",
				"S10|0:0",
				"S11|0:0",
				"S12|0:0",
				"S13|0:0",
				"S14|0:0",
				"S15|0:0",
				"S17|0:0",
				"S18|0:0",
				"S104|0:0",
				"S105|0:0",
				"S555|0:0",
				"S1001|0:0",
				"S1002|0:0",
				"S1003|0:0",
				"S1004|0:0",
				"S1005|0:0",
				"S1006|0:0",
				"S1101|0:0",
				"S5001|0:0",
				"S5002|0:0",
				"S5003|0:0",
				"S5004|0:0",
				"S5005|0:0",
				"S5006|0:0",
				"S10101|0:0",
				"S10102|0:0",
				"S10103|0:0",
				"S11001|0:0",
				"S12001|0:0"
			],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"Club Friendlies Extra",
			"hpsBold":[],
			"csna":"足球",
			"tid":"1188757",
			"mst":"1042",
			"srid":"11222149",
			"mcg":1,
			"cosCorner":false,
			"atf":"1",
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":117,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692618120000",
			"maid":"188590",
			"mct":0,
			"tlev":8,
			"mhlut":"",
			"mo":0,
			"ctt":0,
			"mp":0,
			"csid":"1",
			"ms":1,
			"cmec":"kick_off_team",
			"cos5Minutes":true,
			"mle":0,
			"lvs":-1,
			"malu":[
				""
			],
			"hps15Minutes":[],
			"lurl":"",
			"mprmc":"PA",
			"cosOvertime":false,
			"mhn":"El-alkaz",
			"betAmount":"0.00",
			"cds":"LS",
			"frmhn":[
				"E"
			],
			"operationTournamentSort":10,
			"cos15Minutes":true,
			"mhs":0,
			"mlet":"45:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"188306",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"3530440",
			"mess":1,
			"cosBold":true,
			"lss":null,
			"mmp":"6",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":-1,
			"mbmty":1,
			"regionIdSort":9,
			"mhlu":[
				""
			],
			"seid":"",
			"mstst":"0",
			"malut":"",
			"man":"Al-Shamaly",
			"frman":[
				"A"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"1042",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":null,
			"mft":0,
			"tn":"Club Friendlies Extra",
			"msc":[
				"S1|0:0",
				"S2|0:0",
				"S5|0:0",
				"S6|0:0",
				"S8|0:0",
				"S10|0:0",
				"S11|0:0",
				"S12|0:0",
				"S13|0:0",
				"S14|0:0",
				"S15|0:0",
				"S17|0:0",
				"S18|0:0",
				"S104|0:0",
				"S105|0:0",
				"S555|0:0",
				"S1001|0:0",
				"S1101|0:0",
				"S5001|0:0",
				"S10011|0:0",
				"S10101|0:0",
				"S10102|0:0",
				"S10103|0:0",
				"S11001|0:0",
				"S12001|0:0",
				"S50011|0:0"
			],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"VS-PM独家欧洲联赛",
			"mstrc":"4429.4284",
			"hpsBold":[],
			"csna":"足球",
			"tid":"348385311093051393",
			"mst":"4418",
			"srid":"778621",
			"mcg":1,
			"cosCorner":false,
			"atf":null,
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":11,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692618504390",
			"maid":"348389086318972933",
			"mct":0,
			"tlev":0,
			"mhlut":"",
			"mo":0,
			"ctt":null,
			"mp":0,
			"csid":"1",
			"ms":1,
			"cmec":"match_status",
			"cos5Minutes":false,
			"mle":55,
			"lvs":-1,
			"malu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-173-crvenazvezda.webp"
			],
			"hps15Minutes":[],
			"lurl":"",
			"mprmc":"RC",
			"cosOvertime":false,
			"mhn":"REAL MADRID",
			"betAmount":"0.00",
			"cds":"C01",
			"frmhn":[
				"R"
			],
			"operationTournamentSort":0,
			"cos15Minutes":false,
			"mhs":0,
			"mlet":"06:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"348389086402859019",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"358091379352424450",
			"mess":1,
			"cosBold":false,
			"lss":null,
			"mmp":"7",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":2,
			"mbmty":4,
			"regionIdSort":9,
			"mhlu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-174-realmadrid.webp"
			],
			"seid":"130973",
			"mstst":"0",
			"malut":"",
			"man":"CRVENA ZVEZDA",
			"frman":[
				"C"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"4418",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":"",
			"mft":55,
			"tn":"VS-PM独家欧洲联赛",
			"msc":[
				"S1|0:0",
				"S2|0:0",
				"S3|0:0",
				"S5|0:0",
				"S6|0:0",
				"S8|0:0",
				"S10|0:0",
				"S11|0:0",
				"S12|0:0",
				"S13|0:0",
				"S14|0:0",
				"S15|0:0",
				"S16|0:0",
				"S17|0:0",
				"S18|0:0",
				"S104|0:0",
				"S105|0:0",
				"S555|0:0",
				"S1001|0:0",
				"S1002|0:0",
				"S1003|0:0",
				"S1004|0:0",
				"S1005|0:0",
				"S1006|0:0",
				"S1101|0:0",
				"S1302|0:0",
				"S1402|0:0",
				"S5001|0:0",
				"S5002|0:0",
				"S5003|0:0",
				"S5004|0:0",
				"S5005|0:0",
				"S5006|0:0",
				"S10101|0:0",
				"S10102|0:0",
				"S10103|0:0",
				"S10104|0:0",
				"S11001|0:0",
				"S12001|0:0"
			],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"VS-PM独家欧洲联赛",
			"mstrc":"2700.0",
			"hpsBold":[],
			"csna":"足球",
			"tid":"348385311093051393",
			"mst":"2700",
			"srid":"779950",
			"mcg":1,
			"cosCorner":false,
			"atf":null,
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":24,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692618731070",
			"maid":"348389086339944450",
			"mct":0,
			"tlev":0,
			"mhlut":"",
			"mo":0,
			"ctt":null,
			"mp":0,
			"csid":"1",
			"ms":1,
			"cmec":"match_status",
			"cos5Minutes":false,
			"mle":55,
			"lvs":-1,
			"malu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-167-milan.webp"
			],
			"hps15Minutes":[],
			"lurl":"",
			"mprmc":"RC",
			"cosOvertime":false,
			"mhn":"BORUSSIA DORTMUND",
			"betAmount":"0.00",
			"cds":"C01",
			"frmhn":[
				"B"
			],
			"operationTournamentSort":0,
			"cos15Minutes":false,
			"mhs":0,
			"mlet":"06:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"348389086801317890",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"358092318679388161",
			"mess":1,
			"cosBold":false,
			"lss":null,
			"mmp":"31",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":2,
			"mbmty":4,
			"regionIdSort":9,
			"mhlu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-161-borussiadortmund.webp"
			],
			"seid":"130973",
			"mstst":"0",
			"malut":"",
			"man":"MILAN",
			"frman":[
				"M"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"2700",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":"",
			"mft":55,
			"tn":"VS-PM独家欧洲联赛",
			"msc":[
				"S1|0:1",
				"S2|0:1",
				"S5|0:0",
				"S6|0:0",
				"S8|0:0",
				"S10|0:0",
				"S11|0:0",
				"S12|0:0",
				"S13|0:0",
				"S14|0:0",
				"S15|0:0",
				"S17|0:0",
				"S18|0:0",
				"S104|0:0",
				"S105|0:0",
				"S555|0:0",
				"S1001|0:0",
				"S1002|0:0",
				"S1003|0:0",
				"S1004|0:0",
				"S1005|0:0",
				"S1006|0:0",
				"S1101|0:0",
				"S5001|0:0",
				"S5002|0:0",
				"S5003|0:0",
				"S5004|0:0",
				"S5005|0:0",
				"S5006|0:0",
				"S10101|0:0",
				"S10102|0:0",
				"S10103|0:0",
				"S11001|0:0",
				"S12001|0:0"
			],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"VS-PM独家欧洲联赛",
			"mstrc":"2783.1414",
			"hpsBold":[],
			"csna":"足球",
			"tid":"348385311093051393",
			"mst":"2686",
			"srid":"779951",
			"mcg":1,
			"cosCorner":false,
			"atf":null,
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":22,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692618748293",
			"maid":"348389086402859019",
			"mct":0,
			"tlev":0,
			"mhlut":"",
			"mo":0,
			"ctt":null,
			"mp":0,
			"csid":"1",
			"ms":1,
			"cmec":"match_status",
			"cos5Minutes":false,
			"mle":55,
			"lvs":-1,
			"malu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-174-realmadrid.webp"
			],
			"hps15Minutes":[],
			"lurl":"",
			"mprmc":"RC",
			"cosOvertime":false,
			"mhn":"MANCHESTER UTD",
			"betAmount":"0.00",
			"cds":"C01",
			"frmhn":[
				"M"
			],
			"operationTournamentSort":0,
			"cos15Minutes":false,
			"mhs":0,
			"mlet":"06:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"348389086562242562",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"358092391328927745",
			"mess":1,
			"cosBold":false,
			"lss":null,
			"mmp":"6",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":2,
			"mbmty":4,
			"regionIdSort":9,
			"mhlu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-157-manchesterutd.webp"
			],
			"seid":"130973",
			"mstst":"0",
			"malut":"",
			"man":"REAL MADRID",
			"frman":[
				"R"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"2686",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":"",
			"mft":55,
			"tn":"VS-PM独家欧洲联赛",
			"msc":[
				"S1|2:0",
				"S2|2:0",
				"S5|0:0",
				"S6|0:0",
				"S8|0:0",
				"S10|0:0",
				"S11|0:0",
				"S12|0:0",
				"S13|0:0",
				"S14|0:0",
				"S15|0:0",
				"S17|0:0",
				"S18|0:0",
				"S104|0:0",
				"S105|0:0",
				"S555|0:0",
				"S1001|0:0",
				"S1002|0:0",
				"S1003|0:0",
				"S1004|0:0",
				"S1005|0:0",
				"S1006|0:0",
				"S1101|0:0",
				"S5001|0:0",
				"S5002|0:0",
				"S5003|0:0",
				"S5004|0:0",
				"S5005|0:0",
				"S5006|0:0",
				"S10101|0:0",
				"S10102|0:0",
				"S10103|0:0",
				"S11001|0:0",
				"S12001|0:0"
			],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"VS-PM独家欧洲联赛",
			"mstrc":"2432.571",
			"hpsBold":[],
			"csna":"足球",
			"tid":"348385311093051393",
			"mst":"2404",
			"srid":"779952",
			"mcg":1,
			"cosCorner":false,
			"atf":null,
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":16,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692618796020",
			"maid":"348385584242905089",
			"mct":0,
			"tlev":0,
			"mhlut":"",
			"mo":0,
			"ctt":null,
			"mp":0,
			"csid":"1",
			"ms":1,
			"cmec":"match_status",
			"cos5Minutes":false,
			"mle":55,
			"lvs":-1,
			"malu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-165-inter.webp"
			],
			"hps15Minutes":[],
			"lurl":"",
			"mprmc":"RC",
			"cosOvertime":false,
			"mhn":"NEWCASTLE UTD",
			"betAmount":"0.00",
			"cds":"C01",
			"frmhn":[
				"N"
			],
			"operationTournamentSort":0,
			"cos15Minutes":false,
			"mhs":0,
			"mlet":"06:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"348389086746791937",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"358092591728578561",
			"mess":1,
			"cosBold":false,
			"lss":null,
			"mmp":"6",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":2,
			"mbmty":4,
			"regionIdSort":9,
			"mhlu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-158-newcastleutd.webp"
			],
			"seid":"130973",
			"mstst":"0",
			"malut":"",
			"man":"INTER",
			"frman":[
				"I"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"2404",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":"",
			"mft":55,
			"tn":"VS-PM独家欧洲联赛",
			"msc":[
				"S1|0:3",
				"S2|0:3",
				"S5|0:0",
				"S6|0:0",
				"S8|0:0",
				"S10|0:0",
				"S11|0:0",
				"S12|0:0",
				"S13|0:0",
				"S14|0:0",
				"S15|0:0",
				"S17|0:0",
				"S18|0:0",
				"S104|0:0",
				"S105|0:0",
				"S555|0:0",
				"S1001|0:0",
				"S1002|0:0",
				"S1003|0:0",
				"S1004|0:0",
				"S1005|0:0",
				"S1006|0:0",
				"S1101|0:0",
				"S5001|0:0",
				"S5002|0:0",
				"S5003|0:0",
				"S5004|0:0",
				"S5005|0:0",
				"S5006|0:0",
				"S10101|0:0",
				"S10102|0:0",
				"S10103|0:0",
				"S11001|0:0",
				"S12001|0:0"
			],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"VS-PM独家欧洲联赛",
			"mstrc":"863.8568",
			"hpsBold":[],
			"csna":"足球",
			"tid":"348385311093051393",
			"mst":"841",
			"srid":"779953",
			"mcg":1,
			"cosCorner":false,
			"atf":null,
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":31,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692619055830",
			"maid":"348389086318972933",
			"mct":0,
			"tlev":0,
			"mhlut":"",
			"mo":0,
			"ctt":null,
			"mp":0,
			"csid":"1",
			"ms":1,
			"cmec":"match_status",
			"cos5Minutes":false,
			"mle":55,
			"lvs":-1,
			"malu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-173-crvenazvezda.webp"
			],
			"hps15Minutes":[],
			"lurl":"",
			"mprmc":"RC",
			"cosOvertime":false,
			"mhn":"FC BARCELONA",
			"betAmount":"0.00",
			"cds":"C01",
			"frmhn":[
				"F"
			],
			"operationTournamentSort":0,
			"cos15Minutes":false,
			"mhs":0,
			"mlet":"06:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"348389086893592578",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"358093681484255233",
			"mess":1,
			"cosBold":false,
			"lss":null,
			"mmp":"6",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":2,
			"mbmty":4,
			"regionIdSort":9,
			"mhlu":[
				"https://cdn.redcat88.com/media/inplaysims/teams/logos/logo2-176-fcbarcelona.webp"
			],
			"seid":"130973",
			"mstst":"0",
			"malut":"",
			"man":"CRVENA ZVEZDA",
			"frman":[
				"C"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"841",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":"",
			"mft":55,
			"tn":"VS-PM独家欧洲联赛",
			"msc":[
				"S1|2:0",
				"S2|2:0",
				"S5|0:0",
				"S6|0:0",
				"S8|0:0",
				"S10|0:0",
				"S11|0:0",
				"S12|0:0",
				"S13|0:0",
				"S14|0:0",
				"S15|0:0",
				"S17|0:0",
				"S18|0:0",
				"S104|0:0",
				"S105|0:0",
				"S555|0:0",
				"S1001|0:0",
				"S1002|0:0",
				"S1003|0:0",
				"S1004|0:0",
				"S1005|0:0",
				"S1006|0:0",
				"S1101|0:0",
				"S5001|0:0",
				"S5002|0:0",
				"S5003|0:0",
				"S5004|0:0",
				"S5005|0:0",
				"S5006|0:0",
				"S10101|0:0",
				"S10102|0:0",
				"S10103|0:0",
				"S11001|0:0",
				"S12001|0:0"
			],
			"hpsPromotion":[]
		},
		{
			"mcid":"周一001",
			"tnjc":"Auto Soccer Tournament",
			"hpsBold":[],
			"csna":"足球",
			"tid":"835439",
			"mst":"0",
			"srid":"187711166554",
			"mcg":3,
			"cosCorner":false,
			"atf":"1",
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":146,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692672501000",
			"maid":"96839",
			"mct":0,
			"tlev":1,
			"mhlut":"",
			"mo":0,
			"ctt":0,
			"mp":1,
			"csid":"1",
			"ms":0,
			"cmec":null,
			"cos5Minutes":true,
			"mle":46,
			"lvs":-1,
			"malu":[
				""
			],
			"hps15Minutes":[],
			"lurl":"group1/M00/15/F4/rBKy62G1XXKAYOD7AAAQt5OQKuE740.png",
			"mprmc":"PA",
			"cosOvertime":false,
			"mhn":"CIT专用足球队1对",
			"betAmount":"7.87",
			"cds":"SR",
			"frmhn":[
				"C"
			],
			"operationTournamentSort":76,
			"cos15Minutes":true,
			"mhs":0,
			"mlet":"45:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"101138",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"3516043",
			"mess":1,
			"cosBold":true,
			"lss":null,
			"mmp":"0",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":-1,
			"mbmty":1,
			"regionIdSort":1,
			"mhlu":[
				""
			],
			"seid":"",
			"mstst":"0",
			"malut":"",
			"man":"CIT专用足球队2队",
			"frman":[
				"C"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"0",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":"",
			"mft":46,
			"tn":"自动化中文赛事2",
			"msc":[],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"Auto Soccer Tournament",
			"hpsBold":[],
			"csna":"足球",
			"tid":"835439",
			"mst":"0",
			"srid":"187711166557",
			"mcg":3,
			"cosCorner":false,
			"atf":"1",
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":146,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692672750951",
			"maid":"96839",
			"mct":0,
			"tlev":1,
			"mhlut":"",
			"mo":0,
			"ctt":0,
			"mp":1,
			"csid":"1",
			"ms":0,
			"cmec":null,
			"cos5Minutes":true,
			"mle":46,
			"lvs":-1,
			"malu":[
				""
			],
			"hps15Minutes":[],
			"lurl":"group1/M00/15/F4/rBKy62G1XXKAYOD7AAAQt5OQKuE740.png",
			"mprmc":"PA",
			"cosOvertime":false,
			"mhn":"CIT专用足球队1对",
			"betAmount":"0.32",
			"cds":"SR",
			"frmhn":[
				"C"
			],
			"operationTournamentSort":76,
			"cos15Minutes":true,
			"mhs":0,
			"mlet":"45:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"101138",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"3516046",
			"mess":1,
			"cosBold":true,
			"lss":null,
			"mmp":"0",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":-1,
			"mbmty":1,
			"regionIdSort":1,
			"mhlu":[
				""
			],
			"seid":"",
			"mstst":"0",
			"malut":"",
			"man":"CIT专用足球队2队",
			"frman":[
				"C"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"0",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":null,
			"mft":0,
			"tn":"自动化中文赛事2",
			"msc":[],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"芬超",
			"hpsBold":[],
			"csna":"足球",
			"tid":"821927",
			"mst":"0",
			"srid":"10040132",
			"mcg":3,
			"cosCorner":false,
			"atf":"1",
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":50,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692630000000",
			"maid":"105332",
			"mct":0,
			"tlev":1,
			"mhlut":"",
			"mo":0,
			"ctt":0,
			"mp":1,
			"csid":"1",
			"ms":0,
			"cmec":null,
			"cos5Minutes":false,
			"mle":0,
			"lvs":-1,
			"malu":[
				""
			],
			"hps15Minutes":[],
			"lurl":"group1/M00/0F/03/rBKy62CsCQWALbsgAAAAI0aAAds135.png",
			"mprmc":"GTS",
			"cosOvertime":false,
			"mhn":"FC KTP 科特卡",
			"betAmount":"27.47",
			"cds":"BG",
			"frmhn":[
				"F"
			],
			"operationTournamentSort":4096,
			"cos15Minutes":false,
			"mhs":0,
			"mlet":"45:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"105346",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"3530208",
			"mess":1,
			"cosBold":false,
			"lss":null,
			"mmp":"0",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":1,
			"mbmty":1,
			"regionIdSort":1,
			"mhlu":[
				"group1/M00/17/DD/rBKy62L7tD6AHM0OAAAcf7XFRcA496.png"
			],
			"seid":"118747",
			"mstst":"0",
			"malut":"",
			"man":"哈卡",
			"frman":[
				"H"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"0",
			"hps":[],
			"mvs":1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":null,
			"mft":0,
			"tn":"超级联赛",
			"msc":[],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"白俄甲",
			"hpsBold":[],
			"csna":"足球",
			"tid":"821936",
			"mst":"0",
			"srid":"11177514",
			"mcg":3,
			"cosCorner":false,
			"atf":null,
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":6,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692628200000",
			"maid":"104334",
			"mct":0,
			"tlev":1,
			"mhlut":"",
			"mo":0,
			"ctt":null,
			"mp":1,
			"csid":"1",
			"ms":0,
			"cmec":null,
			"cos5Minutes":false,
			"mle":0,
			"lvs":-1,
			"malu":[
				""
			],
			"hps15Minutes":[],
			"lurl":"group1/M00/15/A4/rBKy62Ffv2OAYPFSAAAM7-NH1yw329.png",
			"mprmc":"PA",
			"cosOvertime":false,
			"mhn":"FK Bumprom",
			"betAmount":"1.30",
			"cds":"LS",
			"frmhn":[
				"F"
			],
			"operationTournamentSort":1037,
			"cos15Minutes":false,
			"mhs":0,
			"mlet":"45:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"193612",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"3530135",
			"mess":1,
			"cosBold":false,
			"lss":null,
			"mmp":"0",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":1,
			"mbmty":1,
			"regionIdSort":9,
			"mhlu":[
				""
			],
			"seid":"",
			"mstst":"0",
			"malut":"",
			"man":"FK Lida",
			"frman":[
				"F"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"0",
			"hps":[],
			"mvs":1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":null,
			"mft":0,
			"tn":"白俄罗斯甲级联赛",
			"msc":[],
			"hpsPromotion":[]
		},
		{
			"mcid":"",
			"tnjc":"La Liga Santander",
			"hpsBold":[],
			"csna":"足球",
			"tid":"826976",
			"mst":"0",
			"srid":"10245947",
			"mcg":3,
			"cosCorner":false,
			"atf":"1",
			"cosPunish":false,
			"cosOutright":false,
			"mdsc":null,
			"mc":35,
			"hpsOvertime":[],
			"mf":false,
			"mgt":"1692637200000",
			"maid":"95712",
			"mct":0,
			"tlev":1,
			"mhlut":"",
			"mo":0,
			"ctt":0,
			"mp":1,
			"csid":"1",
			"ms":0,
			"cmec":null,
			"cos5Minutes":false,
			"mle":0,
			"lvs":-1,
			"malu":[
				"group1/M00/15/A2/rBKy7WFcttKAM7DhAAAMhvLS-lo185.png"
			],
			"hps15Minutes":[],
			"lurl":"",
			"mprmc":"GTS",
			"cosOvertime":false,
			"mhn":"阿拉维斯",
			"betAmount":"0.50",
			"cds":"BG",
			"frmhn":[
				"A"
			],
			"operationTournamentSort":731,
			"cos15Minutes":false,
			"mhs":0,
			"mlet":"45:00",
			"cosBall":false,
			"hps5Minutes":[],
			"cosPenalty":false,
			"hpsCorner":[],
			"mhid":"97386",
			"hpsPunish":[],
			"mrmc":"",
			"mid":"3530415",
			"mess":1,
			"cosBold":false,
			"lss":null,
			"mmp":"0",
			"mststi":"0",
			"operationHotSortTop":0,
			"mms":-1,
			"mbmty":1,
			"regionIdSort":9,
			"mhlu":[
				"group1/M00/15/A1/rBKy62FctHqAHPlvAAAPj9x6oGY849.png"
			],
			"seid":"112094",
			"mstst":"0",
			"malut":"",
			"man":"塞维利亚",
			"frman":[
				"S"
			],
			"mat":"",
			"hpsAdd":[],
			"mng":0,
			"mststr":"0",
			"hps":[],
			"mvs":-1,
			"hpsPenalty":[],
			"mststs":0,
			"mearlys":0,
			"tf":false,
			"th":0,
			"cosPromotion":false,
			"mfo":null,
			"mft":0,
			"tn":"La Liga Santander",
			"msc":[],
			"hpsPromotion":[]
		}
	],
	"msg":"成功",
	"ts":1692619282550
};

let h5_bymid={
	"code" : "0000000",
	"data" : [
		{
			"mcid" : "",
			"tnjc" : "国际篮球友谊赛",
			"csna" : "篮球",
			"tid" : "1895",
			"mst" : "134",
			"srid" : "361393362987073538",
			"mcg" : 1,
			"mdsc" : null,
			"mc" : 17,
			"mf" : false,
			"mgt" : "1692619200000",
			"maid" : "150288",
			"mct" : 0,
			"tlev" : 9,
			"mhlut" : "",
			"mo" : 0,
			"mp" : 1,
			"csid" : "2",
			"ms" : 1,
			"cmec" : "time_start",
			"mle" : 0,
			"lvs" : -1,
			"malu" : [ "group1/M00/19/21/CgURtWR1opKAH9wIAAATEq_j5OI586.png" ],
			"lurl" : "group1/M00/0D/09/CgURtmDfNqGAIsbyAABrXtmKA-s894.png",
			"mprmc" : "PA",
			"mhn" : "巴西",
			"betAmount" : "13023.61",
			"cds" : "PD",
			"frmhn" : [ "B" ],
			"operationTournamentSort" : 72,
			"mhs" : 0,
			"mlet" : "10:00",
			"mhid" : "150287",
			"mrmc" : "",
			"mid" : "2682068",
			"mess" : 0,
			"lss" : null,
			"mmp" : "13",
			"operationHotSortTop" : 0,
			"mms" : 2,
			"mbmty" : 1,
			"regionIdSort" : 9,
			"mhlu" : [ "group1/M00/19/22/CgURt2R1okOAG7MDAAAI7Kp1YH8744.png" ],
			"seid" : "",
			"malut" : "",
			"man" : "塞尔维亚",
			"frman" : [ "S" ],
			"mat" : "",
			"mng" : 0,
			"mststr" : "134",
			"hps" : [
				{
					"mid" : "2682068",
					"chpid" : "39",
					"hpid" : "39",
					"hpon" : 1,
					"hshow" : "Yes",
					"hpn" : "全场让分",
					"hpnb" : "全场让分",
					"hpt" : 2,
					"hsw" : "1,2,3,4,5,6",
					"hmm" : 1,
					"hids" : 1,
					"hl" : [
						{
							"hid" : "145600208481949915",
							"hs" : 0,
							"hv" : "5.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "149600961335000121",
									"os" : 1,
									"otd" : 155,
									"ot" : "1",
									"ov" : 178000,
									"on" : "+5.5",
									"onb" : "+5.5",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "143861193327945831",
									"os" : 1,
									"otd" : 156,
									"ot" : "2",
									"ov" : 192000,
									"on" : "-5.5",
									"onb" : "-5.5",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					]
				},
				{
					"mid" : "2682068",
					"chpid" : "37",
					"hpid" : "37",
					"hpon" : 3,
					"hshow" : "Yes",
					"hpn" : "全场独赢",
					"hpnb" : "全场独赢",
					"hpt" : 3,
					"hsw" : "1,4,5",
					"hmm" : 0,
					"hids" : 1,
					"hl" : [
						{
							"hid" : "144422962559454434",
							"hs" : 0,
							"hv" : null,
							"hmt" : 0,
							"hn" : null,
							"ol" : [
								{
									"oid" : "146949247192937355",
									"os" : 1,
									"otd" : 225,
									"ot" : "1",
									"ov" : 266169,
									"on" : "",
									"onb" : "",
									"cds" : "LS",
									"ots" : "T1"
								},
								{
									"oid" : "144204637265519074",
									"os" : 1,
									"otd" : 226,
									"ot" : "2",
									"ov" : 137816,
									"on" : "",
									"onb" : "",
									"cds" : "LS",
									"ots" : "T2"
								}
							]
						}
					]
				},
				{
					"mid" : "2682068",
					"chpid" : "38",
					"hpid" : "38",
					"hpon" : 2,
					"hshow" : "Yes",
					"hpn" : "全场大小",
					"hpnb" : "全场大小",
					"hpt" : 5,
					"hsw" : "1,2,3,4,5,6",
					"hmm" : 1,
					"hids" : 1,
					"hl" : [
						{
							"hid" : "140248541402880890",
							"hs" : 0,
							"hv" : "166.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "144148970701350144",
									"os" : 1,
									"otd" : 153,
									"ot" : "Over",
									"ov" : 180000,
									"onb" : "大 166.5",
									"on" : "大 166.5",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "144606199208951281",
									"os" : 1,
									"otd" : 154,
									"ot" : "Under",
									"ov" : 180000,
									"onb" : "小 166.5",
									"on" : "小 166.5",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					]
				}
			],
			"mvs" : -1,
			"mearlys" : 0,
			"tf" : false,
			"th" : 0,
			"mfo" : null,
			"mft" : 0,
			"tn" : "国际篮球友谊赛",
			"msc" : [
				"S1|14:15",
				"S107|0:0",
				"S108|0:0",
				"S110|0:0",
				"S111|0.0:0.0",
				"S1088|0.0:0.0",
				"S1235|0.0:0.0",
				"S190|0:0",
				"S191|0:0",
				"S106|0:0",
				"S109|0:0",
				"S2|14:15",
				"S10606|0:0",
				"S19|14:15",
				"S10601|0:0",
				"S10901|0:0"
			],
			"cosBall" : true,
			"hpsAdd" : [
				{
					"hids" : 1,
					"hpid" : "48",
					"hl" : [ {} ],
					"hpon" : 34,
					"hpn" : "第1节独赢",
					"mid" : "2682068",
					"hmm" : 0,
					"hshow" : "Yes",
					"hpnb" : "第1节独赢",
					"hpt" : 3,
					"hsw" : "1,4,5",
					"mct" : "1"
				},
				{
					"hids" : 1,
					"hpid" : "46",
					"hl" : [
						{
							"hid" : "144101180459022348",
							"hs" : 0,
							"hv" : "2.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "145723724034352021",
									"os" : 1,
									"otd" : 170,
									"ot" : "1",
									"ov" : 180000,
									"onb" : "+2.5",
									"on" : "+2.5",
									"onbl" : "",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "140812331861322313",
									"os" : 1,
									"otd" : 171,
									"ot" : "2",
									"ov" : 188000,
									"onb" : "-2.5",
									"on" : "-2.5",
									"onbl" : "",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					],
					"hpon" : 32,
					"hpn" : "第1节让分",
					"mid" : "2682068",
					"hmm" : 1,
					"hshow" : "Yes",
					"hpnb" : "第1节让分",
					"hpt" : 2,
					"hsw" : "1,2,3,4,5,6",
					"mct" : "1"
				},
				{
					"hids" : 1,
					"hpid" : "45",
					"hl" : [
						{
							"hid" : "142157363024681132",
							"hs" : 0,
							"hv" : "40.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "144029520719201152",
									"os" : 1,
									"otd" : 168,
									"ot" : "Over",
									"ov" : 179000,
									"onb" : "大 40.5",
									"on" : "大 40.5",
									"onbl" : "大 ",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "144153240220378953",
									"os" : 1,
									"otd" : 169,
									"ot" : "Under",
									"ov" : 179000,
									"onb" : "小 40.5",
									"on" : "小 40.5",
									"onbl" : "小 ",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					],
					"hpon" : 33,
					"hpn" : "第1节大小",
					"mid" : "2682068",
					"hmm" : 1,
					"hshow" : "Yes",
					"hpnb" : "第1节大小",
					"hpt" : 5,
					"hsw" : "1,2,3,4,5,6",
					"mct" : "1"
				}
			]
		},
		{
			"mcid" : "",
			"tnjc" : "中国全国女子篮球锦标赛",
			"csna" : "篮球",
			"tid" : "23866",
			"mst" : "0",
			"srid" : "10377087",
			"mcg" : 1,
			"mdsc" : null,
			"mc" : 8,
			"mf" : false,
			"mgt" : "1692617400000",
			"maid" : "158554",
			"mct" : 0,
			"tlev" : 9,
			"mhlut" : "",
			"mo" : 0,
			"mp" : 1,
			"csid" : "2",
			"ms" : 1,
			"cmec" : "match_status",
			"mle" : 0,
			"lvs" : -1,
			"malu" : [ "group1/M00/19/97/CgURtmSxf5-AbpSkAAAUFngznw0733.png" ],
			"lurl" : "group1/M00/19/97/CgURtmSxdoqAEisDAAAJVaEMKYg331.png",
			"mprmc" : "PA",
			"mhn" : "北京首钢(女)",
			"betAmount" : "24966.91",
			"cds" : "BG",
			"frmhn" : [ "B" ],
			"operationTournamentSort" : 228,
			"mhs" : 0,
			"mlet" : "10:00",
			"cosBall" : true,
			"mhid" : "27297",
			"mrmc" : "",
			"mid" : "2671189",
			"mess" : 1,
			"lss" : null,
			"mmp" : "302",
			"operationHotSortTop" : 0,
			"mms" : 2,
			"mbmty" : 1,
			"regionIdSort" : 9,
			"mhlu" : [ "group1/M00/01/45/CgURt19_EGeAYamnAABUb5QdKbY873.png" ],
			"seid" : "135701",
			"malut" : "",
			"man" : "山西竹叶青酒(女)",
			"frman" : [ "S" ],
			"mat" : "",
			"hpsAdd" : [
				{
					"hids" : 0,
					"hpid" : "60",
					"hl" : [ {} ],
					"hpon" : 46,
					"hpn" : "第3节独赢",
					"mid" : "2683526",
					"hmm" : 0,
					"hshow" : "Yes",
					"hpnb" : "第3节独赢",
					"hpt" : 3,
					"hsw" : "1,4,5",
					"mct" : "3"
				},
				{
					"hids" : 0,
					"hpid" : "58",
					"hl" : [
						{
							"hid" : "143253347339651547",
							"hs" : 0,
							"hv" : "0.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "142988347570072200",
									"os" : 1,
									"otd" : 199,
									"ot" : "1",
									"ov" : 183000,
									"onb" : "+0.5",
									"on" : "+0.5",
									"onbl" : "",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "143509347344085320",
									"os" : 1,
									"otd" : 200,
									"ot" : "2",
									"ov" : 175000,
									"onb" : "-0.5",
									"on" : "-0.5",
									"onbl" : "",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					],
					"hpon" : 44,
					"hpn" : "第3节让分",
					"mid" : "2671189",
					"hmm" : 1,
					"hshow" : "Yes",
					"hpnb" : "第3节让分",
					"hpt" : 2,
					"hsw" : "1,2,3,4,5,6",
					"mct" : "3"
				},
				{
					"hids" : 0,
					"hpid" : "57",
					"hl" : [
						{
							"hid" : "142843736400435008",
							"hs" : 0,
							"hv" : "33.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "148744035143823716",
									"os" : 1,
									"otd" : 197,
									"ot" : "Over",
									"ov" : 179000,
									"onb" : "大 33.5",
									"on" : "大 33.5",
									"onbl" : "大 ",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "144140206571743758",
									"os" : 1,
									"otd" : 198,
									"ot" : "Under",
									"ov" : 179000,
									"onb" : "小 33.5",
									"on" : "小 33.5",
									"onbl" : "小 ",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					],
					"hpon" : 45,
					"hpn" : "第3节大小",
					"mid" : "2671189",
					"hmm" : 1,
					"hshow" : "Yes",
					"hpnb" : "第3节大小",
					"hpt" : 5,
					"hsw" : "1,2,3,4,5,6",
					"mct" : "3"
				}
			],
			"mng" : 0,
			"mststr" : "0",
			"hps" : [
				{
					"mid" : "2671189",
					"chpid" : "37",
					"hpid" : "37",
					"hpon" : 3,
					"hshow" : "Yes",
					"hpn" : "全场独赢",
					"hpnb" : "全场独赢",
					"hpt" : 3,
					"hsw" : "1,4,5",
					"hmm" : 0,
					"hids" : 0,
					"hl" : [ {} ]
				},
				{
					"mid" : "2671189",
					"chpid" : "39",
					"hpid" : "39",
					"hpon" : 1,
					"hshow" : "Yes",
					"hpn" : "全场让分",
					"hpnb" : "全场让分",
					"hpt" : 2,
					"hsw" : "1,2,3,4,5,6",
					"hmm" : 1,
					"hids" : 1,
					"hl" : [
						{
							"hid" : "141033714941134585",
							"hs" : 0,
							"hv" : "14.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "142774082796129543",
									"os" : 1,
									"otd" : 155,
									"ot" : "1",
									"ov" : 180000,
									"on" : "+14.5",
									"onb" : "+14.5",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "147455641510031052",
									"os" : 1,
									"otd" : 156,
									"ot" : "2",
									"ov" : 180000,
									"on" : "-14.5",
									"onb" : "-14.5",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					]
				},
				{
					"mid" : "2671189",
					"chpid" : "38",
					"hpid" : "38",
					"hpon" : 2,
					"hshow" : "Yes",
					"hpn" : "全场大小",
					"hpnb" : "全场大小",
					"hpt" : 5,
					"hsw" : "1,2,3,4,5,6",
					"hmm" : 1,
					"hids" : 1,
					"hl" : [
						{
							"hid" : "147527620609021164",
							"hs" : 0,
							"hv" : "125.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "141257164514555581",
									"os" : 1,
									"otd" : 153,
									"ot" : "Over",
									"ov" : 180000,
									"onb" : "大 125.5",
									"on" : "大 125.5",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "141433509437644511",
									"os" : 1,
									"otd" : 154,
									"ot" : "Under",
									"ov" : 180000,
									"onb" : "小 125.5",
									"on" : "小 125.5",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					]
				}
			],
			"mvs" : 1,
			"mearlys" : 0,
			"tf" : false,
			"th" : 0,
			"mfo" : null,
			"mft" : 0,
			"tn" : "中国全国女子篮球锦标赛",
			"msc" : [
				"S19|9:23",
				"S1|23:36",
				"S1111|23:36",
				"S2|23:36",
				"S106|9:5",
				"S10601|6:4",
				"S109|1:2",
				"S10901|1:1",
				"S110|2:7",
				"S191|0:4",
				"S111|100.0:63.6",
				"S10606|9:5",
				"S107|6:7",
				"S108|3:5",
				"S1088|100.0:33.3",
				"S1235|100.0:33.3",
				"S190|2:11",
				"S20|14:13",
				"S10602|3:1",
				"S10902|0:1",
				"S21|0:0",
				"S10603|0:0",
				"S10903|0:0",
				"S3|0:0",
				"S10607|0:0"
			]
		},
		{
			"mcid" : "",
			"tnjc" : "国际篮球友谊赛",
			"csna" : "篮球",
			"tid" : "1895",
			"mst" : "600",
			"srid" : "10430958",
			"mcg" : 1,
			"mdsc" : null,
			"mc" : 12,
			"mf" : false,
			"mgt" : "1692619200000",
			"maid" : "32827",
			"mct" : 0,
			"tlev" : 9,
			"mhlut" : "",
			"mo" : 0,
			"mp" : 1,
			"csid" : "2",
			"ms" : 1,
			"cmec" : "match_status",
			"mle" : 0,
			"lvs" : -1,
			"malu" : [ "group1/M00/0B/64/CgURt1_Da3qALyRWAAAMZLn7mkM232.png" ],
			"lurl" : "group1/M00/0D/09/CgURtmDfNqGAIsbyAABrXtmKA-s894.png",
			"mprmc" : "PA",
			"mhn" : "菲律宾",
			"betAmount" : "5610.43",
			"cds" : "BG",
			"frmhn" : [ "F" ],
			"operationTournamentSort" : 72,
			"mhs" : 0,
			"mlet" : "10:00",
			"cosBall" : true,
			"mhid" : "135229",
			"mrmc" : "",
			"mid" : "2675968",
			"mess" : 0,
			"lss" : null,
			"mmp" : "14",
			"operationHotSortTop" : 0,
			"mms" : -1,
			"mbmty" : 1,
			"regionIdSort" : 9,
			"mhlu" : [ "group1/M00/18/43/CgURt2PLeN2AN8E7AAAKqLD6STo301.png" ],
			"seid" : "130680",
			"malut" : "",
			"man" : "墨西哥",
			"frman" : [ "M" ],
			"mat" : "",
			"hpsAdd" : [
				{
					"hids" : 1,
					"hpid" : "43",
					"hl" : [
						{
							"hid" : "141230362925042303",
							"hs" : 1,
							"hv" : "",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "144841463227361484",
									"os" : 1,
									"otd" : 163,
									"ot" : "1",
									"ov" : 341646,
									"onb" : "",
									"on" : "",
									"onbl" : "",
									"cds" : "BG",
									"ots" : "T1"
								},
								{
									"oid" : "141211443837223894",
									"os" : 1,
									"otd" : 164,
									"ot" : "2",
									"ov" : 122955,
									"onb" : "",
									"on" : "",
									"onbl" : "",
									"cds" : "BG",
									"ots" : "T2"
								}
							]
						}
					],
					"hpon" : 26,
					"hpn" : "上半场独赢",
					"mid" : "2675968",
					"hmm" : 0,
					"hshow" : "Yes",
					"hpnb" : "上半场独赢",
					"hpt" : 3,
					"hsw" : "1,4,5",
					"mct" : "2"
				},
				{
					"hids" : 1,
					"hpid" : "19",
					"hl" : [
						{
							"hid" : "140633834020353136",
							"hs" : 0,
							"hv" : "5.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "147033221237101615",
									"os" : 1,
									"otd" : 146,
									"ot" : "1",
									"ov" : 180000,
									"onb" : "+5.5",
									"on" : "+5.5",
									"onbl" : "",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "141252302433185031",
									"os" : 1,
									"otd" : 147,
									"ot" : "2",
									"ov" : 188000,
									"onb" : "-5.5",
									"on" : "-5.5",
									"onbl" : "",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					],
					"hpon" : 24,
					"hpn" : "上半场让分",
					"mid" : "2675968",
					"hmm" : 1,
					"hshow" : "Yes",
					"hpnb" : "上半场让分",
					"hpt" : 2,
					"hsw" : "1,2,3,4,5,6",
					"mct" : "2"
				},
				{
					"hids" : 1,
					"hpid" : "18",
					"hl" : [
						{
							"hid" : "145717543450829646",
							"hs" : 0,
							"hv" : "99.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "146651470130230143",
									"os" : 1,
									"otd" : 96,
									"ot" : "Over",
									"ov" : 163000,
									"onb" : "大 99.5",
									"on" : "大 99.5",
									"onbl" : "大 ",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "143341118941014051",
									"os" : 1,
									"otd" : 95,
									"ot" : "Under",
									"ov" : 195000,
									"onb" : "小 99.5",
									"on" : "小 99.5",
									"onbl" : "小 ",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					],
					"hpon" : 25,
					"hpn" : "上半场大小",
					"mid" : "2675968",
					"hmm" : 1,
					"hshow" : "Yes",
					"hpnb" : "上半场大小",
					"hpt" : 5,
					"hsw" : "1,2,3,4,5,6",
					"mct" : "2"
				}
			],
			"mng" : 0,
			"mststr" : "600",
			"hps" : [
				{
					"mid" : "2675968",
					"chpid" : "37",
					"hpid" : "37",
					"hpon" : 3,
					"hshow" : "Yes",
					"hpn" : "全场独赢",
					"hpnb" : "全场独赢",
					"hpt" : 3,
					"hsw" : "1,4,5",
					"hmm" : 0,
					"hids" : 1,
					"hl" : [
						{
							"hid" : "141757905103366420",
							"hs" : 0,
							"hv" : "",
							"hmt" : 0,
							"hn" : null,
							"ol" : [
								{
									"oid" : "140715622244021544",
									"os" : 1,
									"otd" : 225,
									"ot" : "1",
									"ov" : 270635,
									"on" : "",
									"onb" : "",
									"cds" : "BG",
									"ots" : "T1"
								},
								{
									"oid" : "145747980490424310",
									"os" : 1,
									"otd" : 226,
									"ot" : "2",
									"ov" : 136165,
									"on" : "",
									"onb" : "",
									"cds" : "BG",
									"ots" : "T2"
								}
							]
						}
					]
				},
				{
					"mid" : "2675968",
					"chpid" : "39",
					"hpid" : "39",
					"hpon" : 1,
					"hshow" : "Yes",
					"hpn" : "全场让分",
					"hpnb" : "全场让分",
					"hpt" : 2,
					"hsw" : "1,2,3,4,5,6",
					"hmm" : 1,
					"hids" : 1,
					"hl" : [
						{
							"hid" : "142542456032474458",
							"hs" : 0,
							"hv" : "6.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "145389405410355110",
									"os" : 1,
									"otd" : 155,
									"ot" : "1",
									"ov" : 189000,
									"on" : "+6.5",
									"onb" : "+6.5",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "146059323473337486",
									"os" : 1,
									"otd" : 156,
									"ot" : "2",
									"ov" : 181000,
									"on" : "-6.5",
									"onb" : "-6.5",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					]
				},
				{
					"mid" : "2675968",
					"chpid" : "38",
					"hpid" : "38",
					"hpon" : 2,
					"hshow" : "Yes",
					"hpn" : "全场大小",
					"hpnb" : "全场大小",
					"hpt" : 5,
					"hsw" : "1,2,3,4,5,6",
					"hmm" : 1,
					"hids" : 1,
					"hl" : [
						{
							"hid" : "145271135160310252",
							"hs" : 0,
							"hv" : "185.5",
							"hmt" : 0,
							"hn" : 1,
							"ol" : [
								{
									"oid" : "149214874865212325",
									"os" : 1,
									"otd" : 153,
									"ot" : "Over",
									"ov" : 172000,
									"onb" : "大 185.5",
									"on" : "大 185.5",
									"cds" : "PA",
									"ots" : "T1"
								},
								{
									"oid" : "149783190650160025",
									"os" : 1,
									"otd" : 154,
									"ot" : "Under",
									"ov" : 188000,
									"onb" : "小 185.5",
									"on" : "小 185.5",
									"cds" : "PA",
									"ots" : "T2"
								}
							]
						}
					]
				}
			],
			"mvs" : 1,
			"mearlys" : 0,
			"tf" : false,
			"th" : 0,
			"mfo" : null,
			"mft" : 0,
			"tn" : "国际篮球友谊赛",
			"msc" : [
				"S19|27:31",
				"S1|27:31",
				"S1111|0:0",
				"S2|27:31",
				"S106|3:3",
				"S10601|3:3",
				"S109|0:0",
				"S10901|0:0",
				"S110|2:2",
				"S191|0:3",
				"S111|100.0:40.0",
				"S10606|3:3",
				"S107|8:4",
				"S108|3:7",
				"S1088|100.0:53.8",
				"S1235|100.0:44.0",
				"S190|2:5",
				"S20|0:0",
				"S10602|0:0",
				"S10902|0:0"
			]
		}
	],
	"msg" : "成功",
	"ts" : 1692620302126
}

;
    // this.MatchDataWarehouseInstance.set_list(h5_bymid.data);
    // this.MatchDataWarehouseInstance.set_quick_query_list(h5_bymid.data);


let h5_match_details={
	"code":"0000000",
	"data":{
		"tnjc":"中国全国女子篮球锦标赛",
		"csna":"篮球",
		"tid":"23866",
		"mst":"382",
		"srid":"10377087",
		"mcg":1,
		"mdsc":null,
		"mf":false,
		"mgt":"1692617400000",
		"maid":"158554",
		"mct":0,
		"tlev":9,
		"mhlut":"",
		"mo":0,
		"mp":1,
		"csid":"2",
		"ms":1,
		"cmec":"possession",
		"mle":0,
		"lvs":-1,
		"malu":[
			"group1/M00/19/97/CgURtmSxf5-AbpSkAAAUFngznw0733.png"
		],
		"lurl":"group1/M00/19/97/CgURtmSxdoqAEisDAAAJVaEMKYg331.png",
		"mprmc":"PA",
		"mhn":"北京首钢(女)",
		"cds":"BG",
		"frmhn":[
			"B"
		],
		"mhs":0,
		"mlet":"10:00",
		"mhid":"27297",
		"mrmc":"",
		"mid":"2671189",
		"mess":0,
		"lss":null,
		"mmp":"15",
		"mms":2,
		"mbmty":1,
		"mhlu":[
			"group1/M00/01/45/CgURt19_EGeAYamnAABUb5QdKbY873.png"
		],
		"seid":"135701",
		"malut":"",
		"man":"山西竹叶青酒(女)",
		"frman":[
			"S"
		],
		"mat":"",
		"mng":0,
		"mststr":"382",
		"mvs":1,
		"mearlys":0,
		"mfo":null,
		"mft":0,
		"tn":"中国全国女子篮球锦标赛",
		"msc":[
			"S19|9:23",
			"S1|35:38",
			"S1111|35:38",
			"S2|23:36",
			"S106|12:5",
			"S10601|6:4",
			"S109|1:3",
			"S10901|1:1",
			"S110|2:7",
			"S191|0:4",
			"S111|100.0:63.6",
			"S10606|9:5",
			"S107|9:8",
			"S108|6:5",
			"S1088|100.0:31.2",
			"S1235|100.0:34.2",
			"S190|2:11",
			"S20|14:13",
			"S10602|3:1",
			"S10902|0:1",
			"S21|12:2",
			"S10603|3:0",
			"S10903|0:1",
			"S3|12:2",
			"S10607|3:0"
		]
	},
	"msg":"成功",
	"ts":1692621391825
};
let h5_match_details_odds_info={
	"code":"0000000",
	"data":[
		{
			"hids":0,
			"chpid":"39",
			"hl":[{
				"hid":"146220119984262832",
				"hon":"999999999",
				"hn":1,
				"hs":0,
				"ol":[{
					"otv":"北京首钢(女)  +4.5",
					"obv":180000,
					"cds":"PA",
					"os":1,
					"ot":"1",
					"ov":180000,
					"oid":"141014072179145115",
					"otd":155,
					"ott":"北京首钢(女) ",
					"on":"+4.5",
					"ots":""
				},{
					"otv":"山西竹叶青酒(女)  -4.5",
					"obv":180000,
					"cds":"PA",
					"os":1,
					"ot":"2",
					"ov":180000,
					"oid":"141334503356930129",
					"otd":156,
					"ott":"山西竹叶青酒(女) ",
					"on":"-4.5",
					"ots":""
				}],
				"hv":"4.5",
				"hmt":0,
				"ad2":"",
				"ad1":""
			}],
			"hpn":"全场让分",
			"topKey":"39",
			"mid":"2671189",
			"hmm":1,
			"hps":"",
			"hshow":"Yes",
			"jno":null,
			"title":[
				{
					"osn":"北京首钢(女) ",
					"otd":155
				},
				{
					"osn":"山西竹叶青酒(女) ",
					"otd":156
				}
			],
			"hpt":13,
			"hsw":"1,2,3,4,5,6",
			"hlid":"0",
			"hpid":"39",
			"hpon":1,
			"hton":"0"
		},
		{
			"hids":0,
			"chpid":"38",
			"hl":[{
				"hid":"147025433705335018",
				"hon":"999999999",
				"hn":1,
				"hs":0,
				"ol":[{
					"otv":"大  127.5",
					"obv":180000,
					"cds":"PA",
					"os":1,
					"ot":"Over",
					"ov":180000,
					"oid":"148711998805143436",
					"otd":153,
					"ott":"大 ",
					"on":"127.5",
					"ots":""
				},{
					"otv":"小  127.5",
					"obv":180000,
					"cds":"PA",
					"os":1,
					"ot":"Under",
					"ov":180000,
					"oid":"145512395326351723",
					"otd":154,
					"ott":"小 ",
					"on":"127.5",
					"ots":""
				}],
				"hv":"127.5",
				"hmt":0,
				"ad2":"",
				"ad1":""
			}],
			"hpn":"全场大小",
			"topKey":"38",
			"mid":"2671189",
			"hmm":1,
			"hps":"",
			"hshow":"Yes",
			"jno":null,
			"title":[
				{
					"osn":"大 ",
					"otd":153
				},
				{
					"osn":"小 ",
					"otd":154
				}
			],
			"hpt":13,
			"hsw":"1,2,3,4,5,6",
			"hlid":"0",
			"hpid":"38",
			"hpon":2,
			"hton":"0"
		},
		{
			"hids":0,
			"chpid":"37",
			"hl":[{
				"hid":"143943616100479357",
				"hon":"170853",
				"hn":null,
				"hs":0,
				"ol":[{
					"otv":"北京首钢(女) ",
					"obv":310000,
					"cds":"BG",
					"os":1,
					"ot":"1",
					"ov":272925,
					"oid":"140335440202148330",
					"otd":225,
					"ott":"北京首钢(女)",
					"on":"",
					"ots":""
				},{
					"otv":"山西竹叶青酒(女) ",
					"obv":146000,
					"cds":"BG",
					"os":1,
					"ot":"2",
					"ov":136072,
					"oid":"144875123995512412",
					"otd":226,
					"ott":"山西竹叶青酒(女)",
					"on":"",
					"ots":""
				}],
				"hv":"",
				"hmt":0,
				"ad2":"",
				"ad1":""
			}],
			"hpn":"全场独赢",
			"topKey":"37",
			"mid":"2671189",
			"hmm":0,
			"hps":"",
			"hshow":"Yes",
			"jno":null,
			"title":[
				{
					"osn":"北京首钢(女)",
					"otd":225
				},
				{
					"osn":"山西竹叶青酒(女)",
					"otd":226
				}
			],
			"hpt":3,
			"hsw":"1,4,5",
			"hlid":"0",
			"hpid":"37",
			"hpon":3,
			"hton":"0"
		},
		{
			"hids":0,
			"chpid":"198",
			"hl":[{
				"hid":"142919276163074751",
				"hon":"999999999",
				"hn":1,
				"hs":0,
				"ol":[{
					"otv":"大  61.5",
					"obv":188000,
					"cds":"PA",
					"os":1,
					"ot":"Over",
					"ov":188000,
					"oid":"145367173040174305",
					"otd":617,
					"ott":"大 ",
					"on":"61.5",
					"ots":""
				},{
					"otv":"小  61.5",
					"obv":172000,
					"cds":"PA",
					"os":1,
					"ot":"Under",
					"ov":172000,
					"oid":"142513161029156106",
					"otd":618,
					"ott":"小 ",
					"on":"61.5",
					"ots":""
				}],
				"hv":"61.5",
				"hmt":0,
				"ad2":"",
				"ad1":""
			}],
			"hpn":"北京首钢(女) 总分",
			"topKey":"198",
			"mid":"2671189",
			"hmm":1,
			"hps":"",
			"hshow":"Yes",
			"jno":null,
			"title":[
				{
					"osn":"大 ",
					"otd":617
				},
				{
					"osn":"小 ",
					"otd":618
				}
			],
			"hpt":13,
			"hsw":"1,2,3,4,5,6",
			"hlid":"0",
			"hpid":"198",
			"hpon":4,
			"hton":"0"
		},
		{
			"hids":0,
			"chpid":"199",
			"hl":[{
				"hid":"145388229604450367",
				"hon":"999999999",
				"hn":1,
				"hs":0,
				"ol":[{
					"otv":"大  66",
					"obv":180000,
					"cds":"PA",
					"os":1,
					"ot":"Over",
					"ov":180000,
					"oid":"143358032145374384",
					"otd":619,
					"ott":"大 ",
					"on":"66",
					"ots":""
				},{
					"otv":"小  66",
					"obv":180000,
					"cds":"PA",
					"os":1,
					"ot":"Under",
					"ov":180000,
					"oid":"140562630891140109",
					"otd":620,
					"ott":"小 ",
					"on":"66",
					"ots":""
				}],
				"hv":"66",
				"hmt":0,
				"ad2":"",
				"ad1":""
			}],
			"hpn":"山西竹叶青酒(女) 总分",
			"topKey":"199",
			"mid":"2671189",
			"hmm":1,
			"hps":"",
			"hshow":"Yes",
			"jno":null,
			"title":[
				{
					"osn":"大 ",
					"otd":619
				},
				{
					"osn":"小 ",
					"otd":620
				}
			],
			"hpt":13,
			"hsw":"1,2,3,4,5,6",
			"hlid":"0",
			"hpid":"199",
			"hpon":5,
			"hton":"0"
		},
		{
			"hids":0,
			"chpid":"40",
			"hl":[{
				"hid":"145571718056062982",
				"hon":"999999999",
				"hn":null,
				"hs":0,
				"ol":[{
					"otv":"单 ",
					"obv":185000,
					"cds":"PA",
					"os":1,
					"ot":"Odd",
					"ov":185000,
					"oid":"140763108373092337",
					"otd":157,
					"ott":"单",
					"on":"",
					"ots":""
				},{
					"otv":"双 ",
					"obv":185000,
					"cds":"PA",
					"os":1,
					"ot":"Even",
					"ov":185000,
					"oid":"141505051431655510",
					"otd":158,
					"ott":"双",
					"on":"",
					"ots":""
				}],
				"hv":null,
				"hmt":0,
				"ad2":"",
				"ad1":""
			}],
			"hpn":"全场单/双",
			"topKey":"40",
			"mid":"2671189",
			"hmm":0,
			"hps":"",
			"hshow":"Yes",
			"jno":null,
			"title":[
				{
					"osn":"单",
					"otd":157
				},
				{
					"osn":"双",
					"otd":158
				}
			],
			"hpt":3,
			"hsw":"1,4,5",
			"hlid":"0",
			"hpid":"40",
			"hpon":6,
			"hton":"0"
		},
		{
			"hids":0,
			"chpid":"58",
			"hl":[{
				"hid":"145720114143984011",
				"hon":"999999999",
				"hn":1,
				"hs":0,
				"ol":[{
					"otv":"北京首钢(女)  -7.5",
					"obv":179000,
					"cds":"PA",
					"os":1,
					"ot":"1",
					"ov":179000,
					"oid":"143172040501097845",
					"otd":199,
					"ott":"北京首钢(女) ",
					"on":"-7.5",
					"ots":""
				},{
					"otv":"山西竹叶青酒(女)  +7.5",
					"obv":179000,
					"cds":"PA",
					"os":1,
					"ot":"2",
					"ov":179000,
					"oid":"147643530512086321",
					"otd":200,
					"ott":"山西竹叶青酒(女) ",
					"on":"+7.5",
					"ots":""
				}],
				"hv":"-7.5",
				"hmt":0,
				"ad2":"",
				"ad1":""
			}],
			"hpn":"第3节让分",
			"topKey":"58",
			"mid":"2671189",
			"hmm":1,
			"hps":"",
			"hshow":"Yes",
			"jno":null,
			"title":[
				{
					"osn":"北京首钢(女) ",
					"otd":199
				},
				{
					"osn":"山西竹叶青酒(女) ",
					"otd":200
				}
			],
			"hpt":2,
			"hsw":"1,2,3,4,5,6",
			"hlid":"0",
			"hpid":"58",
			"hpon":44,
			"hton":"0"
		},
		{
			"hids":0,
			"chpid":"57",
			"hl":[{
				"hid":"141070546009054731",
				"hon":"999999999",
				"hn":1,
				"hs":0,
				"ol":[{
					"otv":"大  34.5",
					"obv":179000,
					"cds":"PA",
					"os":1,
					"ot":"Over",
					"ov":179000,
					"oid":"145459566015335730",
					"otd":197,
					"ott":"大 ",
					"on":"34.5",
					"ots":""
				},{
					"otv":"小  34.5",
					"obv":179000,
					"cds":"PA",
					"os":1,
					"ot":"Under",
					"ov":179000,
					"oid":"142220467394156438",
					"otd":198,
					"ott":"小 ",
					"on":"34.5",
					"ots":""
				}],
				"hv":"34.5",
				"hmt":0,
				"ad2":"",
				"ad1":""
			}],
			"hpn":"第3节大小",
			"topKey":"57",
			"mid":"2671189",
			"hmm":1,
			"hps":"",
			"hshow":"Yes",
			"jno":null,
			"title":[
				{
					"osn":"大 ",
					"otd":197
				},
				{
					"osn":"小 ",
					"otd":198
				}
			],
			"hpt":2,
			"hsw":"1,2,3,4,5,6",
			"hlid":"0",
			"hpid":"57",
			"hpon":45,
			"hton":"0"
		},
		{
			"hids":0,
			"chpid":"59",
			"hl":[{
				"hid":"148543964053152020",
				"hon":"999999999",
				"hn":null,
				"hs":0,
				"ol":[{
					"otv":"单 ",
					"obv":185000,
					"cds":"PA",
					"os":1,
					"ot":"Odd",
					"ov":185000,
					"oid":"146305484077325140",
					"otd":201,
					"ott":"单",
					"on":"",
					"ots":""
				},{
					"otv":"双 ",
					"obv":185000,
					"cds":"PA",
					"os":1,
					"ot":"Even",
					"ov":185000,
					"oid":"140343220441156145",
					"otd":205,
					"ott":"双",
					"on":"",
					"ots":""
				}],
				"hv":"0",
				"hmt":0,
				"ad2":"",
				"ad1":""
			}],
			"hpn":"第3节单/双",
			"topKey":"59",
			"mid":"2671189",
			"hmm":0,
			"hps":"",
			"hshow":"Yes",
			"jno":null,
			"title":[
				{
					"osn":"单",
					"otd":201
				},
				{
					"osn":"双",
					"otd":205
				}
			],
			"hpt":3,
			"hsw":"1,4,5",
			"hlid":"0",
			"hpid":"59",
			"hpon":47,
			"hton":"0"
		}
	],
	"msg":"成功",
	"ts":1692621392091
};
	// this.MatchDataWarehouseInstance.set_list_from_match_details(h5_match_details.data);
    // this.MatchDataWarehouseInstance.set_quick_query_list_from_match_details(h5_match_details_odds_info.data)


	// let old_ = {a:[1,2,3,4]};
	// let new_ = {a:[0]};

	// let res=old_;
	// this.MatchDataWarehouseInstance.merge_with(old_,new_);
	// console.error('res = ',res);
  }
}
</script>
