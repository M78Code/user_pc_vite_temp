

  /**
   * @description: 获取国际化模板信息,进行二次操作
   * @param {String} t_path 国际化信息路径
   * @param {Number} csid 赛事种类
   * @return {Array} 国际化字符串信息
   */
  const get_match_tpl_title=(t_path, csid)=>{
    let ret = _.cloneDeep(window.vue.i18n.t(t_path));
    try {
      if(csid){
        if(window.vue.$i18n.locale == 'en'){
          // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球
          switch (t_path) {
            case 'list.match_tpl_title.tpl7.bet_col':
              if(ret && ret[2] && ret[2] == '1X2'){
                if(csid == 2) { //2-篮球
                  ret[2] = window.vue.i18n.t('list.play_name_other_name.play_capot_name2');
                }
              }
              break;
            case 'list.match_tpl_title.tpl0.bet_col':
            case 'list.match_tpl_title.tpl16.bet_col':
              if(ret){
                if(csid == 2 || csid == 6) { //2-篮球
                  let cur_title =  window.vue.i18n.t('list.play_name_other_name.play_capot_name2')
                  ret[0] = cur_title;
                 ret[3] &&  (ret[3] = ret[3].replace('1x2',cur_title))
                } else if(!(csid == 4 || csid == 1)){
                  ret[0] = window.vue.i18n.t('list.play_name_other_name.play_capot_name1');
                }
              }

              break;

            default:
              break;
          }
        } else if(window.vue.$i18n.locale == 'vi'){
          // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球
          switch (t_path) {
            case 'list.match_tpl_title.tpl9.bet_col':
              if(ret && ret[0] && ret[0] == '1X2'){
                if(csid == 5) { //5-网球
                  ret[0] = window.vue.i18n.t('list.play_name_other_name.play_capot_name1');
                }
              }
              break;
            default:
              break;
          }
        } else if(window.vue.$i18n.locale == 'zh'){
          // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 11-手球
          switch (t_path) {
            case 'list.match_tpl_title.tpl0.bet_col':
              if(ret){
                if(csid == 11) { //11-手球
                  ret = _.cloneDeep(window.vue.i18n.t('list.match_tpl_title.tpl0.bet_col_csid_11'));
                }
              }
              break;
            default:
              break;
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
    return ret;
  }