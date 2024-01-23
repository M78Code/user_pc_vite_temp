/*
 * @Author: Cable
 * @Date: 2020-08-22 09:31:03
 * @Description: 赛事详情相关操作类
 */
import { api_details } from "src/api/index";
import UserCtr from "src/core/user-config/user-ctr.js";
import { MenuData } from 'src/output/project/index.js'
import { update_match_time } from "src/core/bet/common-helper/module/common-sport.js"
import { MatchDataWarehouse_PC_Detail_Common as MatchDetailsData } from 'src/output/module/match-data-base.js'
import { MatchDetailCalss } from 'src/output/module/project-single.js'
import { is_virtual_csid,is_eports_csid } from 'src/output/module/constant-utils.js'
//引入列表跳详情中间件 
import  MatchListDetailMiddlewareClass  from "src/core/match-detail/match-detail-pc/match-list-detail-pc/index.js"
export default {
  //统计分析URL
  signal_url:'https://s5.sir.swiftscore.com',
  /**
  * @Description:跳转至详情
  * @Author Cable
  * @param:match  赛事详情
  * @return:
  */
  on_go_detail(match,keyword,router,route) {
    let { mid, tid= -1, csid, go_detail_type, varl, vurl, mms, ms, mvs } = match;
    if((+mid === 0) ||!csid){
      return
    }
      //是否虚拟体育球种id
    let is_virtual= is_virtual_csid(csid)
    let route_name =  is_virtual ? 'virtual_details' : 'details'
    let route_query = {}
    
    if(keyword){
      route_query = {
        keyword
      }
    }
    // 设置中间键参数
    MatchListDetailMiddlewareClass.set_back_to_source_params({
      mid,
      tid,
      csid,
      MatchDataWarehouse_source:MatchDetailsData,
      MatchDataWarehouse_target:MatchDetailsData,
      match
    })
    router.push({
      name: route_name,
      params: {
        mid,
        tid,
        csid
      },
      query: {...route_query,ms}  // 传多个ms  提前判断是否需要显示右侧
    });
    if(go_detail_type != 'no_switch' || ((varl || vurl) && mms == 2 && get_match_status(ms) == 1)){
      // 供右侧数据加载使用
      let media_type = mvs > -1 ? 'animation' : 'auto'
      this.on_switch_match(media_type,match);
    }

    let obj = {
      pre_route : route.name
    }
    
    // MenuData.set_router_info(obj)
  },
  /**
   * @Description 同步时间 
   * @param {number} mid 赛事ID
   * @param {undefined} undefined
  */
  sync_mst(mid,csid){
    // 电竞赛事
    if (is_eports_csid(csid)) {
      api_details.get_match_detail_ESMatchInfo({mid}).then(res => {
        let mst = lodash.get(res,'data.data.mst')
        if(mst){
          update_match_time({mid, mst});
        }
      })
    } else {
      api_details.get_match_detail_MatchInfo({mid}).then(res => {
        let mst = lodash.get(res,'data.data.mst')
        if(mst){
          let mstst = lodash.get(res,'data.data.mstst');
          let mststs = lodash.get(res,'data.data.mststs');
          update_match_time({mid, mst, mstst, mststs});
        }
      })
    }
  },
  /**
   * @Description:切换右侧赛事
   * @param {string} media_type 视频播放类型
   * @param {object} match 赛事详情
   * @return {undefined} undefined
   */
  on_switch_match(media_type,match,play_id) {
    this.auto_swich_match = false
    let { mid, tid, csid: sportId } = match;
    let old_mid = MatchDetailCalss.mid
    let old_media_type = MatchDetailCalss.params.media_type
    MatchDetailCalss.set_match_details_params({
      mid,
      tid,
      sportId,
      media_type: media_type || "",
      play_id
    })

    //如果是同场赛事切换 播放类型
    if((old_mid == mid && old_media_type != media_type) || media_type == 'auto'){
      setTimeout(() => {
        MatchDetailCalss.set_play_media({ media_type, mid, time: Date.now()})
      })
    }
  },
  /**
   * @Description:自动切换右侧视频赛事
   * @param {array} match_list 赛事列表
   * @return {undefined} undefined
   */
  auto_switch_match(match_list){
    if(window.vue.$route.name != 'home'){
      return
    }
    let match = lodash.get(match_list,'[0]') || {}
    if(!match.mid){
      let play_id =MatchDetailCalss.current_category_id;
      MatchDetailCalss.set_match_details_params({
        mid:0,
        tid:0,
        sportId:0,
        play_id,
        media_type: ""
      })
    }else{
      this.on_switch_match('auto',match)
    }
  },
  /**
  * @Description:给比分设置初始值
  * @param {Object} score 比分数据
  * @param {array} key  比分key
  * @param {boolean} is_zero 比分无数据是否设置为0
  */
  init_score(score,key,is_zero){
    let zero = is_zero ? {home:0,away:0} : {home:'',away:''}
    key.forEach( item => {
      if(!score[item]){
        score[item] = zero
      }
    })
  },
  /**
  * @Description:sr 分析数据点击跳转
  * @Author Cable
  * @param:match 赛事详情
  * @return:
  */
  sr_click_handle(match) {
    let full_url = this.get_full_sr_url(match) // seid,match.srid
    let euid = lodash.get(MenuData, 'match_list_api_config.match_list.params.euid')
    localStorage.setItem('test_match_info', JSON.stringify(match))
    // if(!GlobalAccessConfig.get_statisticsSwitch()) return window.vue.useMittEmit(window.vue.MITT_TYPES.EMIT_SHOW_TOAST_CMD, window.vue.i18n_t("msg.msg_09")); 
    // if([1,2].includes(match.csid*1)){
      full_url = `index.html#/analysis_header/${match.csid}/${match.mid}` // seid,match.srid
    //   store.dispatch("set_active_detail", match)
    // }
    
    let _window_width = 1200
    let _window_height = 650
    let _window_offset_left = (screen.width - _window_width) / 2
    let _window_offset_top = (screen.height - _window_height) / 2
    window.open(
      full_url,
      "",
      `height=${_window_height}, width=${_window_width},
      top=${_window_offset_top}, left=${_window_offset_left},
      toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
    );
    // if (full_url) {
    //   window.open(
    //     full_url,
    //     "",
    //     `height=${_window_height}, width=${_window_width},
    //     top=${_window_offset_top}, left=${_window_offset_left},
    //     toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
    //   );
    //   return full_url;
    // }
    
  },
  /**
  * @Description:获取数据分析url
  * @Author Cable
  * @param:match 赛事详情
  * @return:
  */
  get_full_sr_url(match) {
    let csid = lodash.get(match,'csid')
    let srid = lodash.get(match,'srid')
    if(!csid || !srid) return ''

    let csid_translate = csid, sr_prev = '';
    csid *= 1;
    switch (csid) {
      case 1:                    // 足球
      case 2:                    // 篮球
      case 5:                    // 网球
        csid_translate = csid;
        break;
      case 7:
        csid_translate = 19;   // 斯诺克
        break;
      case 8:
        csid_translate = 20;   // 乒乓球
        break;

      case 3:
        csid_translate = 3;   // 棒球
        break;
      case 4:
        csid_translate = 4;   // 冰球
        break;
      case 6:
        csid_translate = 16;   // 美式足球
        break;
      case 9:
        csid_translate = 23;   // 排球球
        break;

      case 10:
        csid_translate = 31;   // 羽毛球
        break;
    }
    let sr_lang = this.get_src_lang();
    sr_prev = `/kaihongman/${sr_lang}/${csid_translate}/match/${srid}`;
    //`https://s5.sir.swiftscore.com/kaihongman/zh/${csid_translate}/match/${srid}`

    return `${this.signal_url}${sr_prev}`;
  },
  /**
  * @Description:根据球种id获取球种英文名
  * @Author Cable
  * @param:csid 球种id
  * @return:球种英文名
  */
  get_sports_en(csid){
    if(csid == 1) return 'football'         //足球
    if(csid == 2) return 'basketball'     //篮球
    if(csid == 3) return 'baseball'     //棒球
    if(csid == 4) return 'iceball'       //冰球
    if(csid == 5) return 'tennis'        //网球
    if(csid == 6) return 'americaball'   //美式足球
    if(csid == 7) return 'snooker'       //斯诺克
    if(csid == 8) return 'pingpong'      //兵乓球
    if(csid == 9) return 'volleyball'    //排球
    if(csid == 10) return 'badminton'     //羽毛球
    if(csid == 17) return 'gaming'        //竞技
    return ''
  },
  /**
   * @Description:获取赛事在赛事数组中的索引
   * @param {number} mid 赛事ID
   * @param {array} list 赛事数组
   * @return {number} 数组索引
   */
  get_match_index(mid,list){
    if(!lodash.isArray(list)) return -1
    for (let i = 0; i < list.length; i++) {
      if(list[i].mid == mid){
        return i
      }
    }
    return -1
  },
  /**
   * @description: 将PC的语言类型转换成SR对应的语言类型
   */
  get_src_lang() {
    let all_sr_lang = {
      en: "en", // 英文
      th: "th", 
      zh: "zh", // 简体中文
      tw: "zht", // 繁体中文
      vi: "vi",
      ms: "ms",// 马来语
      de: "de", 
      fr: "fr", 
      ko: "ko", 
      ja: "ja", 
      es: "es",
      ad: "ad", // 印尼语
    }
    return all_sr_lang[UserCtr.lang];
  }
}
