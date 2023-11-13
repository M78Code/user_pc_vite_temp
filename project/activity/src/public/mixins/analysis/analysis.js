/*
 * @Date: 2021-07-03 14:41:26
 * @FilePath: /user-pc1/src/public/mixins/analysis/analysis.js
 * @Description: 
 * @Author: 
 */
import {api_analysis} from 'src/public/api/index'

export default{
  props:{
    //赛事
    match: Object
  },
  methods: {
    /**
    * @description: 足球数据、情报、赔率接口
    */
     get_analysiseData(params, cb){
      api_analysis.post_getMatchAnalysiseData(params).then((ret)=>{
        let data = _.get(ret, 'data');
        if(data && data.code == 200){
          cb(data.data)
        }
      })
    },
    /**
    * @description: 胜平负、大小走水格式化
    * @return {}
    */
     result_filter(type, value){
      //  2平3输4赢, 2走水3小4大
      if( type == 'cls'){
        switch(value){
          case 2: return 'dogfall';
          case 3: return 'lose';
          case 4: return 'win';
          default: return 'default';
        }
      } else if(type == 'resultLabel'){
        switch(value){
          case 2: return this.$root.$t("analysis.level");
          case 3: return this.$root.$t("analysis.lose");
          case 4: return this.$root.$t("analysis.win");
        }
      } else if(type == 'resultwinlose'){
        switch(value){
          case 2: return this.$root.$t("analysis.flat");
          case 3: return this.$root.$t("analysis.negative");
          case 4: return this.$root.$t("analysis.victory");
          default: return this.$root.$t("analysis.no_data")
        }
      } else if(type == 'overunderLabel'){
        switch(value){
          case 2: return this.$root.$t("analysis.level");
          case 3: return this.$root.$t("analysis.small");
          case 4: return this.$root.$t("analysis.big");
          default: return this.$root.$t("analysis.no_data")
        }
      }
    },
    /**
    * @description: 百分比换算
    * @return {}
    */
    format_point(value){
      return (value*100).toFixed(2)
    }
  },
}