/*
 * @Date: 2021-07-03 14:41:26
 * @FilePath: /user-pc1/src/public/mixins/analysis/analysis.js
 * @Description: 
 * @Author: 
 */
import {api_analysis} from 'src/api/index'

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
      api_analysis.get_match_analysise_data(params).then((ret)=>{
        let data = lodash.get(ret, 'data');
        if(data && data.code == 200){
          cb(data)
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
          case 2: return i18n_t("analysis.level");
          case 3: return i18n_t("analysis.lose");
          case 4: return i18n_t("analysis.win");
        }
      } else if(type == 'resultwinlose'){
        switch(value){
          case 2: return i18n_t("analysis.flat");
          case 3: return i18n_t("analysis.negative");
          case 4: return i18n_t("analysis.victory");
          default: return i18n_t("analysis.no_data")
        }
      } else if(type == 'overunderLabel'){
        switch(value){
          case 2: return i18n_t("analysis.level");
          case 3: return i18n_t("analysis.small");
          case 4: return i18n_t("analysis.big");
          default: return i18n_t("analysis.no_data")
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