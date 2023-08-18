

  /**
     *  @description: 投注设置诸葛埋点
     *  @param {undefined} undefined
     *  @return {undefined} undefined
     */
 const bet_send_zhuge_event=()=>{
    let bet_source =  window.sessionStorage.getItem("_bet_source")
    let lcm_name = ""
    if(bet_source){
       switch (bet_source) {
         case 'hot':
           lcm_name = '热门推荐'
           break;
         case 'recent':
           lcm_name = '近期关注'
           break;

         default:
           break;
       }
    }
    if(lcm_name){
    //  this.$utils.send_zhuge_event(`PC_${lcm_name}_投注成功`, {"成单栏目类型": lcm_name});
    }
  }