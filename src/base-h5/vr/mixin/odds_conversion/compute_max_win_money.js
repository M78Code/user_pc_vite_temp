/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 此文件 主要是应对  根据转换 后的 赔率 计算(在转换为其他赔率时候，必须做欧洲赔率的配分)
 * 
 * 实现 匹配不到 后 向下 取值
 */
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
      oddsTable:{
        EU:1,
        HK:2,
        US:3,
        ID:4,
        MY:5,
        GB:6,
      }
    };
  },

  methods: {
    //返回字符串保留两位小数，电竞返回3位小数
    // 2.3 => 2.30  2 => 2.00  3.199 => 3.19  3.119 => 3.11
    calc_odds(val, csid){
      let N = val.toString();
      if(this.float_3_csid.includes(1*csid)){
        //3位小数点处理
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
      } else {
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
    compute_money_by_cur_odd_type(val,breakVal , arr, inputval,csid) {
      /**
       * 此方法预留  后期 对于 不支持转换赔率的 盘口 做特殊加工
       * 是 对全局 赔率转换的 基础设定
       * arr: 当前盘口 支持的赔率转换类型的 全部值
       *
       * 得出 转换后的 赔率 和 最终使用的赔率 类型， 根据 传入的本金 ，计算 可盈利数值 的 参考值 、
       * 实际的可盈利数值  由 多个 维度 比较 得出结果
       */
      breakVal = val;   //弃用断档赔率
      inputval = parseFloat(inputval) ? parseFloat(inputval) : 0;
      let str = "";
      let final_odd_type = "";
      if (!arr) {
        this.cur_odd =='EU' ? str= val : str = this.compute_value_by_odd_type(breakVal, this.cur_odd);
        final_odd_type = this.cur_odd;
      } else {
        // if (arr.includes(this.cur_odd)) {
        if (arr.includes(this.oddsTable[this.cur_odd])) {
          this.cur_odd =='EU' ? str= val : str = this.compute_value_by_odd_type(breakVal, this.cur_odd);
          final_odd_type = this.cur_odd;
        } else {
          str = val ;
          final_odd_type = "EU";
        }
      }
      let num = this.compute_money_by_odd_type_and_value_and_inputValue(
        val,
        str,
        final_odd_type,
        inputval,
        csid
      );
      if (isNaN(Number(num))) num = 0;
      return num;
    },
    compute_money_by_odd_type_and_value_and_inputValue(
      euval,
      oddval,
      oddtype,
      inputval,
      csid
    ) {
      let num = "";
      // { label: "欧洲盘(EU)", value: "EU" },
      // { label: "香港盘(HK)", value: "HK" },
      // { label: "马来盘(MY)", value: "MY" },
      // { label: "英式盘(GB)", value: "GB" },
      // { label: "美式盘(US)", value: "US" },
      // { label: "印尼盘(ID)", value: "ID" }
      euval = parseFloat(euval);
      switch (oddtype) {
        case "EU":
          num = this.compute_money_when_EU(this.calc_odds(euval,csid), oddval, inputval);

          break;
        case "HK":
          num = this.compute_money_when_HK(this.calc_odds(euval,csid), oddval, inputval);

          break;
        case "MY":
          num = this.compute_money_when_MY(this.calc_odds(euval,csid), oddval, inputval);

          break;
        case "GB":
          num = this.compute_money_when_GB(this.calc_odds(euval,csid), oddval, inputval);

          break;
        case "US":
          num = this.compute_money_when_US(this.calc_odds(euval,csid), oddval, inputval);

          break;
        case "ID":
          num = this.compute_money_when_ID(this.calc_odds(euval,csid), oddval, inputval);

          break;

        default:
          num = "";
          break;
      }

      return num;
    },
    compute_money_when_EU(euval, oddval, inputval) {
      return this.$mathjs.multiply(this.$mathjs.subtract(euval, 1), inputval)
    },
    compute_money_when_HK(euval, oddval, inputval) {
      let n = oddval*100000 * inputval;
      n=n/100000
      return n;
    },
    compute_money_when_MY(euval, oddval, inputval) {
      oddval = parseFloat(oddval);
      let n = 0;
      if (oddval > 0) {
        n = oddval * inputval;
      } else if (oddval < 0) {
        // n = (inputval * 10000) / (Math.abs(oddval) * 100);
        n = inputval;
      }
      return n;
    },
    compute_money_when_GB(euval, oddval, inputval) {
      let oddval_1=Number(oddval.split('/')[0]);
      let oddval_2=Number(oddval.split('/')[1]);
      oddval=oddval_1/oddval_2;
      let n = oddval*inputval;
      // let n = (parseInt(10000 * (euval - 1)) * inputval) / 10000;
      return n;
    },
    compute_money_when_US(euval, oddval, inputval) {
      oddval = parseFloat(oddval);
      let n = 0;
      if (oddval > 0) {
        n = oddval * (inputval / 100);
      } else if (oddval < 0) {
        // n = (100 * inputval) / Math.abs(oddval);
        n = (100 / Math.abs(oddval))*inputval;
      }
      return n;
    },
    compute_money_when_ID(euval, oddval, inputval) {
      oddval = parseFloat(oddval);
      let n = 0;
      if (oddval > 0) {
        n = oddval * inputval;
      } else if (oddval < 0) {
        n = inputval;
      }
      return n;
    }
  }
};
