/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 此文件 主要是应对 赔率转换(在转换为其他赔率时候，必须做欧洲赔率的配分)
 *
 * 使用  {{ compute_value_by_cur_odd_type(val}}
 * 实现 匹配不到 后 向下 取值
 */
import { utils } from "src/core/utils/common/module/utils.js";
export default {
  data() {
    return {
      /*
      需要显示三位小数点的,赛种编号
      100 英雄联盟
      101 dota2
      102 csgo
      103 王者荣耀
      */
      float_3_csid:[100,101,102,103],
      all_odds_arr: [], //所有的赔率数组
      cur_odds_arr: [], // 当前允许的赔率数组
      cur_odd: "EU", // 当前赔率
      // arr.push([`${EU}`, HK, MY, GB, US, ID]);
      // 欧洲赔率  1
      // 香港赔率  2
      // 马来赔率  3
      // 英式赔率  4
      // 美式赔率  5
      // 印尼赔率  6
      odds_constant: [
        { label: "印尼盘(ID)", value: "ID", icon: 'panda-icon-contryYN', id: 6 },
        { label: "美式盘(US)", value: "US", icon: 'panda-icon-contryUS', id: 5 },
        { label: "马来盘(MY)", value: "MY", icon: 'panda-icon-contryML', id: 3 },
        { label: "英式盘(GB)", value: "GB", icon: 'panda-icon-contryUK', id: 4 },
        { label: "香港盘(HK)", value: "HK", icon: 'panda-icon-contryHK', id: 2 },
        { label: "欧洲盘(EU)", value: "EU", icon: 'panda-icon-contryEU', id: 1 }
      ],
      oddsTable: {
        EU: '1',
        HK: '2',
        MY: '3',
        GB: '4',
        US: '5',
        ID: '6',
      },
      ol_list_0:[],
      ol_list_1:[],
      ol_list_2:[],
      other_item_list:[],
      max_count_ol:0,
    };
  },
  destroyed(){
    utils.del(this.all_odds_arr);
    utils.del(this.cur_odds_arr);
    utils.del(this.odds_constant);
    utils.del(this.oddsTable);
  },
  computed: {
    // ...mapGetters({
    //   // 所有赛事种类赔率对象
    //   allKindsOdds_obj: "get_allKindsOdds_obj",
    //   // 当前赔率
    //   'get_cur_odd': 'get_cur_odd'
    // })
    allKindsOdds_obj(){return ''},
    get_cur_odd(){return ''},
  },
  methods: {
    // 两个浮点数相减
    acc_sub(num1, num2 = num1) {
      var r1, r2, m;
      try {
        if (num1.toString().split('.')[1]) {
          r1 = num1.toString().split('.')[1].length;
        } else {
          r1 = 0;
        }
        if (num2.toString().split(".")[1]) {
          r2 = num2.toString().split(".")[1].length;
        } else {
          r2 = 0;
        }
      } catch (e) {
        console.error(e);
      }
      m = Math.pow(10, Math.max(r1, r2));
      let n = (r1 >= r2) ? r1 : r2;
      return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
    },    
    get_ol_list(){
      let max = 0,
        hl = this.item_data.hl[0],
        ol_list = hl.ol;

      this.item_data.title.forEach((tit,i) => {
        let other_items = ol_list.filter(ol_item => ol_item.ot == 'Other');
        if(other_items.length){
          // 合并数据，根据id去重
          const arr = [...other_items,...this.other_item_list]
          const uniq_arr = lodash.uniqWith(arr, (arr_val, oth_val)=>{
            if(arr_val.id_ === oth_val.id_ ) {
              return true
            }
            return false
          });
          this.other_item_list = uniq_arr
        }
        //os等于3需要隐藏投注项
        let filtered = ol_list.filter(ol_item => ol_item.otd == tit.otd && ol_item.ot != 'Other' && ol_item.os != 3 );
        if(i == 0){
          this.ol_list_0 = filtered;
        }
        else if(i == 1){
          this.ol_list_1 = filtered;
        }
        else if(i == 2){
          this.ol_list_2 = filtered;
        }
        let m_len = filtered.length;
        if(m_len > max) max = m_len;
      });

      return max;
    },
    compute_value_by_cur_odd_type(val, breakVal, hsw_param,flag,csid) {
      breakVal = '';
      // 此方法预留  后期 对于 不支持转换赔率的 盘口 做特殊加工
      // 是 对全局 赔率转换的 基础设定
      // arr: 当前盘口 支持的赔率转换类型的 全部值
      if (!val) return;
      let arr = [];
      this.cur_odd = this.get_cur_odd;
      let str = "";
      // 印尼盘(ID) id: 6
      // 美式盘(US) id: 5
      // 马来盘(MY) id: 3
      // 英式盘(GB) id: 4
      // 香港盘(HK) id: 2
      // 欧洲盘(EU) id: 1
      if((typeof hsw_param) == 'string'){
        arr = hsw_param.split(',');
      }else{
        arr = hsw_param;
      }
      if (!arr || arr.includes(this.oddsTable[this.cur_odd])) {
        //欧洲盘不用转换,香港盘直接减1处理,其他(目前不存在其他赔率类型)的走赔率转换方法
        if(this.cur_odd == 'EU'){
          str = this.calc_odds(val,csid)
        }else if(this.cur_odd == 'HK'){
          let calc_num = this.acc_sub(val,1)
          str = this.calc_odds(calc_num,csid)
        }else{
          str = this.compute_value_by_odd_type(breakVal ? breakVal : val, this.cur_odd)
        }
      } else {
        str = this.calc_odds(val,csid);
      }
      //投注的时候传值不需要格式化
      if (!flag) {
        str = this.format_odds(str,csid)
      }
      return str;
    },
    /**
     *@description 赔率展示优化，见优化单 13807,电竞不走这个逻辑
     *@param {Number|String} val 最终赔率 30.40 100.00
     *@param {Number|String} csid 球类id
     *@return {String} 优化后的赔率，30.4 100
     */
    format_odds (val, csid) {
      if(val=='' || val == undefined){
        return '';
      }
      if ( this.float_3_csid.includes(1*csid)) return val;
      val = (val || '0').toString();
      let ret = val;
      if (val.includes('.')){
        if (val >= 100) {
          if (val.split('.')[1] == '00') {
              ret = val.split('.')[0];
          } else {
            let len = val.length;
            if(val.indexOf('.0') == (len-2)){
              ret = val.substring(0,len-2);
            } else {
              ret = val;
            }
          }
        } else if (val >= 10) {
          if (val.split('.')[1][1] == '0') {
            ret = val.slice(0,val.length-1);
          } else {
            ret = val;
          }
        }
      }
      return ret;
    },
    //返回字符串保留两位小数
    calc_odds(val, csid){
      let N = val.toString();
      // 3位小数点处理
      if(this.float_3_csid.includes(1*csid)){
        if (N.includes(".")) {
          let S = N.split('.');
          if (S[1][2]) {
            val = S[0] + "." + S[1][0] + S[1][1]+ S[1][2];
          } else if (S[1][1]) {
            val = S[0] + "." + S[1][0] + S[1][1] + "0";
          } else {
            val = S[0] + "." + S[1][0] + "00";
          }
        } else {
          val = N + ".000";
        }
      } else { // 2位小数点处理
        if (N.includes(".")) {
          let S = N.split('.');
          if (S[1][1]) {
            val = S[0] + "." + S[1][0] + S[1][1];
          } else {
            val = S[0] + "." + S[1][0] + "0";
          }
        } else {
          val = N + ".00";
        }
      }
      return val;
    },
    //非欧盘时计算赔率转换
    compute_value_by_odd_type(val, odd_type, csid) {
      /**
       * val  : 原始欧洲赔率的 值
       * odd_type ： 需要转换到的赔率类型的 键名
       *
       * 把传入的值，计算为当前赔率
       * 这里必须清楚，我们始终以欧洲赔率作为标准
       * 数据里面永远存在欧洲赔率
       * 此处转换 传入的只能是 欧洲赔率的数值 和另一个赔率的 标识
       *
       * 存在问题 ，传入的必须是 赔率 不是金额
       * 金额需要另外套接
       *
       * 赔率 有粒度 不一定命中 这里需要做处理
       *
       *
       */

      //  EU_1.01
      /**
         * 切换通用规则：a，部分数据源给过来的赔率数据会落在断档区间内，则自动匹配区间值中小的那一个进行其他赔率转换，
         * 从其他赔率转换回欧洲赔率时直接变回源数据欧洲赔率。例如：数据源过来的赔率为2.58，在区间2.55-2.60之间，
         * 则将数据源的赔率匹配为2.55进行其他赔率转换；从其他赔率转换回欧洲赔率的时候直接回2.58。b，赔率负数要红色显示；正数用黑色显示。

         */
      /**
       *
       * 已和产品确认，和上游数据确认，传递给前端的 是 原始 欧洲赔率
       *
       */
      /**
             * 1	1.01-2.50，以0.01为单位，相应赔率转换
                2	2.5-5.0，以0.05为单位，相应赔率转换
                3	5.0-10，以x.2，x.5，x.7，x.0展示，相应赔率转化
                4   10-20，以0.5为单位，相应赔率转换
                5	20-30，以1为单位，相应赔率转换
                6	30-100，以5为单位，相应赔率转换

                和 产品确认， 负数 小于 -10 的 .5 不显示  ，正数 大于20的 .5 不显示
             */
      if (!val) {
        return "";
      }

      // 如果是香港赔率直接减1
      if(odd_type == 'HK'){
        val = this.acc_sub(val,1) //用浮点数的减法
        return val;
      }

      if (!odd_type || !this.allKindsOdds_obj) {
        return val;
      }
      
      // 赔率类型错误
      let index = lodash.findIndex(this.odds_constant, o => {
        return o.value == odd_type;
      });
      val = this.calc_odds(val,csid);
      if (index < 0) {
        // let message = "不存在所指定赔率类型 :" + odd_type;
        // this.$q.notify({
        //   message: `${message}`,
        //   color: "negative"
        // });
        return val;
      }

      if (val <= 1) {
        // let message = "原始赔率错误，原始赔率：" + val;
        // this.$q.notify({
        //   message: `${message}`,
        //   color: "negative"
        // });
        return val;
      }
      // 正常情况
      let obj = ``;
      let real = "";
      obj = this.allKindsOdds_obj[`EU_${val}`];
      if (val <= 2.5) {
        // 1	1.01-2.50，以0.01为单位，相应赔率转换
      } else if (val <= 5) {
        // 2.5-5.0，以0.05为单位，相应赔率转换  3.478
        if (!obj) {
          real = (Math.floor(val * 100) - (val)) / 100;
          obj = this.allKindsOdds_obj[`EU_${real}`];
        }
      } else if (val <= 10) {
        // 5.0-10，以x.2，x.5，x.7，x.0展示，相应赔率转化 5.478
        if (!obj) {
          let nnn = Math.floor(val * 10);
          let nnn_y = nnn % 10;
          if (nnn_y >= 0 && nnn_y < 2) {
            nnn_y = 0;
          } else if (nnn_y < 5) {
            nnn_y = 2;
          } else if (nnn_y < 7) {
            nnn_y = 5;
          } else if (nnn_y <= 9) {
            nnn_y = 7;
          }
          real = Math.floor(val) + nnn_y / 10;
          obj = this.allKindsOdds_obj[`EU_${real}`];
        }
      } else if (val <= 20) {
        // 4   10-20，以0.5为单位，相应赔率转换   10.476
        // 10.476%5=0.47600000000000087
        if (!obj) {
          // real = (Math.floor(val * 10) - (Math.floor(val * 10) % 5)) / 10;
          obj = this.allKindsOdds_obj[`EU_${real}`];
        }
      } else if (val <= 30) {
        // 5	20-30，以1为单位，相应赔率转换
        if (!obj) {
          real = Math.floor(val);
          obj = this.allKindsOdds_obj[`EU_${real}`];
        }
      } else if (val <= 100) {
        // 6	30-100，以5为单位，相应赔率转换
        if (!obj) {
          real = Math.floor(val) - (val);
          obj = this.allKindsOdds_obj[`EU_${real}`];
        }
      }
      if (obj) {
        return obj[odd_type];
      } else {
        return val;
      }
    }
  }
};
