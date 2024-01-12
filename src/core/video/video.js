/*
 * @Author: Cable
 * @Date: 2020-09-04 15:08:22
 * @Description: 视频相关操作
 */

import details from "src/core/match-detail/match-detail-pc/match-detail.js";
import User from "src/core/user-config/user-ctr.js"
import { api_details, api_common } from "src/api/index"
import { i18n_t} from "src/boot/i18n.js"
import BetCommonHelper from "src/core/bet/common-helper/index.js";
import { get_media_icon_index,get_match_status, is_eports_csid } from 'src/output/module/constant-utils.js'
import { MatchDetailCalss }  from "src/output/module/project-single.js";
import UserCtr from "src/core/user-config/user-ctr.js";
export default {

  /**
  * @Description:给iframe发送message消息
  * @Author Cable
  * @param {object} data 发送的数据
  */
  send_message(data){
    const el = document.getElementById("video-iframe")
    if(el){
      el.contentWindow.postMessage(data,"*");
      if(data.cmd == 'show_controller')
      {
        window.postMessage(data, '*');
      }
    }
  },
  from:'',
  /**
  * @Description:请求接口获取赛事详情
  * @Author Cable
  * @param {number} mid 赛事id
  * @param {function} callback 回调函数
  * @param {object} route 路由参数
  */
  api_get_match_info(mid,route,callback){
    let params = {
      mid,
      cuid: UserCtr.get_uid()
    };
    let api_ = null;
    // 判断是电竞还是其他赛种，区分接口
    if(is_eports_csid(route.params.csid)){
      api_ = api_details.get_match_detail_ESMatchInfo;
    } else {
      api_ = api_details.get_match_detail_MatchInfo;
    }
    api_(params).then( res => {
      console.log(res, params, api_, "res=====");
      let data = this.get_match_info(res)
      if(data.mid == mid){
        callback(data,'data')
      }else{
        callback(data,'empty')
      }
    }).catch( err => {
      console.error(err);
      if (lodash.get(err,'response.status') == 404) {
        callback({},'404')
      } else {
        callback({},'refresh')
      }
    })
  },
  /**
  * @Description:组装赛事详情接口返回的数据
  * @Author Cable
  * @param {object} res 接口返回数据
  * @return {object} 组装好的详情数据
  */
  get_match_info(res){
    let data = lodash.get(res,'data.data') || {}
    let match = lodash.cloneDeep(data)
    match.goal_info = {
      is_show:false,
      homeAway: 'home',  //主客进球  home主  away客
      secondsFromStart: 0,  //比赛进行时长
      t1: '',  //主队比分
      t2: ''   //客队比分
    }
    match.msc =BetCommonHelper.msc_array_obj(match.msc)
    // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
    details.init_score(match.msc,['S1'],true)
    //加时  点球比分
    details.init_score(match.msc,['S7','S170'])

    match.sports_name = details.get_sports_en(match.csid)
    //足球比分
    match.football_score = this.get_football_score(match)
    // 视频全屏下顶部比分数据
    match.score_full_screen = this.get_score_full_screen(match);

    match.score_list = this.get_score_list(match)

    match.progress_list = this.get_progress_list(match)
    return match
  },
  /**
  * @Description:获取右边比分数据
  * @Author Cable
  * @param {object} match 赛事信息
  * @return {array} 比分数据
  */
  get_progress_list(match){
    //棒球
    if(match.csid == 3){
      // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
      details.init_score(match.msc,['S3015'],true)
      let progress_list = [

      ]
      return progress_list
    }
    //冰球
    if(match.csid == 4){
      // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
      details.init_score(match.msc,['S4011','S4012','S4013'],true)
      let progress_list = [
        {
          name:i18n_t('common.big_penalty'),                  //大罚
          score:'S4011',
          nocale:false
        },
        // {
        //   name:i18n_t('common.shot_num'),                //射门
        //   score:'S4013',
        //   nocale:false
        // },
        {
          name:i18n_t('common.micro_penalty'),  //小罚
          score:'S4012',
          nocale:false
        },
      ]
      return progress_list
    }
    //网球
    if(match.csid == 5){
      // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
      details.init_score(match.msc,['S4','S103','S202','S114'],true)
      let progress_list = [
        {
          name:i18n_t('common.ace'),                  //发球得分
          score:'S4',
          nocale:false
        },
        {
          name:i18n_t('common.fault'),                //双发失误
          score:'S202',
          nocale:false
        },
        {
          name:i18n_t('common.break_point_success'),  //破发成功率
          score:'S114',
          nocale:true
        },
      ]
      return progress_list
    }
    //美足
    if(match.csid == 6){
      // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
      details.init_score(match.msc,['S6011','S6012','S6013','S6014'],true)
      let progress_list = [
        // {
        //   name:i18n_t('common.rushing_num'),                  //冲球数
        //   score:'S6011',
        //   nocale:false
        // },
        {
          name:i18n_t('common.shot_num'),                //射门
          score:'S6012',
          nocale:false
        },
        // {
        //   name:i18n_t('common.offense_num'),      //进攻数
        //   score:'S6013',
        //   nocale:false
        // },
        {
          name:i18n_t('common.touchdown'),        //达阵
          score:'S6014',
          nocale:false
        },
      ]
      return progress_list
    }
    //斯诺克
    if(match.csid == 7){
      // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
      details.init_score(match.msc,['S118','S119','S1190'],true)
      let progress_list = [
        {
          name:i18n_t('common.max_bureau'),                    //单杆最高
          name2:`(${i18n_t('common.bureau')})`,                    //局
          score:'S1190',
          nocale:false
        },
        {
          name:i18n_t('common.max_bureau'),   //单杆最高
          name2:`(${i18n_t('video.total')})`,                    //总
          score:'S119',
          nocale:false
        },
        {
          name:i18n_t('common.foul'),             //犯规
          score:'S118',
          nocale:false
        },
      ]
      return progress_list
    }
    //排球
    if(match.csid == 9){
      // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
      details.init_score(match.msc,['S4','S113'],true)
      let progress_list = [
        {
          name:i18n_t('common.ace'),                    //发球得分
          score:'S4',
          nocale:false
        },
        {
          name:i18n_t('common.sigle_fault'),   //发球失误
          score:'S113',
          nocale:false
        },
      ]
      return progress_list
    }
    //羽毛球
    if(match.csid == 10){
      // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
      details.init_score(match.msc,['S115','S116','S117'],true)
      let progress_list = [
        {
          name:i18n_t('common.score_'),                    //得分
          score:'S115',
          nocale:false
        },
        {
          name:i18n_t('common.receiving_point_score'),   //接收点得分
          score:'S116',
          nocale:true
        },
        {
          name:i18n_t('common.ace'),             //发球得分
          score:'S117',
          nocale:true
        },
      ]
      return progress_list
    }

    //篮球
    if(match.csid == 2){
      // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
      details.init_score(match.msc,['S107','S108','S110','S106'],true)
      let progress_list = [
        {
          name:i18n_t('video.score2'),                    //2分
          score:'S107',
          class:'',
          nocale:false
        },
        {
          name:i18n_t('video.score3'),                    //3分
          score:'S108',
          class:'home-wrap',
          nocale:false
        },
        {
          name:i18n_t('common.penalty_kick'),             //罚球
          score:'S110',
          class:'',
          nocale:false
        },
      ]
      //犯规次数、暂停数
      match.dict = {
        13: {
          foul: "S10601",
          stop: "S10901",
        }, //第一节
        301: {
          foul: "S10602",
          stop: "S10902",
        }, //第一节结束
        14: {
          foul: "S10602",
          stop: "S10902",
        }, //第二节
        302: {
          foul: "S10603",
          stop: "S10903",
        }, //第二节结束
        15: {
          foul: "S10603",
          stop: "S10903",
        }, //第三节
        303: {
          foul: "S10604",
          stop: "S10904",
        }, //第三节结束
        16: {
          foul: "S10604",
          stop: "S10904",
        }, //第四节
        100: {
          foul: "S10604",
          stop: "S10904",
        }, //第四节结束
        32: {
          foul: "S10605",
          stop: "S10906",
        }, //等待加时
        40: {
          foul: "S10605",
          stop: "S10906",
        }, //加时赛
        110: {
          foul: "S10605",
          stop: "S10906",
        }, //加时赛结束
        1: {
          foul: "S10606",
          stop: "S109",
        }, //上半场
        2: {
          foul: "S10607",
          stop: "S109",
        }, //下半场
        31: {
          foul: "S10606",
          stop: "S109",
        }, //中场休息
      };
      let score_key = []
      lodash.each(match.dict, item => {
        score_key.push(item.foul)
        score_key.push(item.stop)
      })
      details.init_score(match.msc,score_key,true)
      return progress_list
    }
    return []
  },
  /**
   * @Description:赛事阶段对应的比分
   * @param {number} csid 球种ID
   * @return {object} 比分字典
   */
  get_socre_dict(csid){
    // 赛事阶段参考 src/i18n/zh-cn/index.js 文件 mmp 字段， 比分参考 src/i18n/zh-cn/index.js 文件 msc 字段
    if(csid == 1){
      return {
        32:"S7",
        41:"S7",
        33:"S7",
        42:"S7",
        50:"S170",
        110:"S7"
      }
    }
    if(csid == 2){
      return {
        13: "S19",
        14: "S20",
        301: "S20",
        15: "S21",
        302: "S21",
        16: "S22",
        303: "S22",
        1: "S2",
        2: "S3",
        31: "S3",
        40: "S7",
      }
    }
    let dict = match_details.methods.socre_dict(csid)
    if(csid == 6){
      dict[32] = 'S7'
      dict[40] = 'S7'
    }
    return dict
  },
  /**
   * @Description:根据mmp阶段给比分设置默认0:0
   * @param {object} match 赛事详情
   * @return {undefined} undefined
   */
  set_mmp_score(match){
    let socre_dict = this.get_socre_dict(match.csid)
    let key = lodash.get(socre_dict,match.mmp)
    if(!key) return
    if(lodash.get(match.msc,key+'.home') === ''){
      match.msc[key] = {home:0,away:0}
    }
  },
  /**
  * @Description:获取比分数据
  * @Author Cable
  * @param {object} match 赛事信息
  * @return 比分数据
  */
  get_score_list(match){

    //网球5
    if(match.csid == 5){
      return this.get_tennis_score(match)
    }
    //兵乓球8 羽毛球10 斯诺克7 棒球3 冰球4 排球9 沙滩排球13
    if([3,4,7,8,9,10,13].includes(match.csid*1)){
      return this.get_snooker_score(match)
    }
    //篮球2 美足6 曲棍球15  水球16
    if([2,6,15,16].includes(match.csid*1)){
      return this.get_basketball_score(match)
    }
    return []
  },
  /**
  * @Description:获取网球比分数据
  * @Author Cable
  * @param {object} match 赛事信息
  * @return {array} 比分数据
  */
  get_tennis_score(match){
    // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
    details.init_score(match.msc,['S23','S39','S55','S71','S87'])
    let score_list = [
      {
        name:1,
        score:'S23',//第一盘
      },
      {
        name:2,
        score:'S39',//第二盘
      },
      {
        name:3,
        score:'S55',//第三盘
      },
    ]
    if(match.mft > 3){
      score_list.push({
        name:4,
        score:'S71',//第四盘
      })
      score_list.push({
        name:5,
        score:'S87',//第五盘
      })
    }
    return score_list
  },
  /**
  * @Description:获取斯诺克、兵乓球、羽毛球、棒球比分数据
  * @Author Cable
  * @param {object} match 赛事信息
  * @return {array} 比分数据
  */
  get_snooker_score(match){
    let key = []
    for(let i = 120;i < 160;i++){
      key.push('S'+i)
    }
    match.msc_key = key
    details.init_score(match.msc,key)
    let k = 120
    let mmp = 8
    let score_list = []
    //棒球局数
    if(match.csid == 3){
      // 没有赛制默认9局
      let mft = parseInt(match.mft) || 9
      match.mft = Math.max(mft,parseInt(match.mct))
    }
    //冰球固定3局
    if(match.csid == 4){
      match.mft = 3
    }
    for(let i = 1;i <= match.mft; i++){
      score_list.push({
        name:i,
        score:'S'+k,
        mmp
      })
      k++
      mmp++
    }
    return score_list
  },
  /**
  * @Description:获取篮球比分数据
  * @Author Cable
  * @param {object} match 赛事信息
  * @return {array} 比分数据
  */
  get_basketball_score(match){
    // 篮球3*3只有总分
    if(match.mle == 73){
      return []
    }
    // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
    details.init_score(match.msc,['S2','S3','S19','S20','S21','S22','S7'])
    details.init_score(match.msc,['S109'],true)    //暂停次数
    match.msc_key = ['S19','S20','S21','S22']
    let score_list = []
    let qstr = match.csid == 2 ? 'Q' :''
    //是否篮球半场
    if(match.csid == 2 && match.mle == 17){
      score_list = [
        {
          name:'H1',
          score:'S2',
        },
        {
          name:'H2',
          score:'S3',
        },
      ]
    }else{
      score_list = [
        {
          name:qstr+'1',
          score:'S19',
        },
        {
          name:qstr+'2',
          score:'S20',
        },
        {
          name:i18n_t('common.half_'),    //半场
          score:'S2',
        },
        {
          name:qstr+'3',
          score:'S21',
        },
        {
          name:qstr+'4',
          score:'S22',
        },
      ]
    }
    return score_list
  },
  /**
  * @Description:获取足球比分
  * @Author Cable
  * @param {object} match 赛事信息
  * @return {array} 比分数据
  */
  get_football_score(match){
    if(match.csid != 1) return []
    // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
    details.init_score(match.msc,['S2','S3','S5','S12','S11','S10','S17','S18','S105','S104','S8'],true)
    let arr = [
      {
        class:'rs_jiao_quan',
        tooltip:i18n_t('list.corner'),            //角球
        score:'S5',
      },
      {
        class:'rs_huang',
        tooltip:i18n_t('icon_tips.yellow_card'),  //黄牌
        score:'S12',
      },
      {
        class:'rs_hong',
        tooltip:i18n_t('icon_tips.red_card'),     //红牌
        score:'S11',
      },
      {
        class:'rs_dian',
        tooltip:i18n_t('icon_tips.penalty_kick'), //点球
        score:'S10',
      },
    ]
    return arr
  },
  /**
   * 全屏视频模式下顶部比分数据
   * @param {*} match
   * @returns
   */
  get_score_full_screen(match) {
    if(match.csid != 1 && match.csid != 2) return [[],[]]
    let arr = [];
    // 比分文档参考 src/i18n/zh-cn/index.js 文件 msc 字段值
    // 足球
    if (match.csid == 1) {
      details.init_score(match.msc,['S1','S2','S3','S5','S7','S12','S11','S10','S17','S18','S105','S104','S8'],true)
      // 足球顶部左侧阶段
      arr[0] = [
        // {
        //   class: "up_half",
        //   name: i18n_t('common.up_half'), // 上半场
        //   score: "S2",
        //   current_mmp: 6
        // },
        {
          class: "overall",
          name: i18n_t('icon_tips.overall'), // 全场
          score: "S1",
          current_mmp: null
        },
        {
          class: "add_time",
          name: i18n_t('common.add_time'),
          score: "S7",
          current_mmp: 13
        }
      ]
      // 足球顶部右侧比分
      arr[1] = [
        {
          class:'rs_hong',
          tooltip:i18n_t('icon_tips.red_card'),     //红牌
          score:'S11',
        },
        {
          class:'rs_huang',
          tooltip:i18n_t('icon_tips.yellow_card'),  //黄牌
          score:'S12',
        },
        {
          class:'rs_jiao_quan',
          tooltip:i18n_t('list.corner'),            //角球
          score:'S5',
        },
        {
          class:'rs_quan',
          tooltip:i18n_t('icon_tips.overall') + i18n_t('icon_tips.goal'), // 全场进球
          score:'S1',
        }
      ]
      // 篮球
    } else if (match.csid == 2) {
      details.init_score(match.msc,['S1','S2','S7','S19','S20','S21','S22','S107','S108','S109','S110','S106'],true)
      // 左侧顶部阶段比分
      arr[0] = [
        {
          class: "q1",
          name: i18n_t('mmp_v2.2.13'),
          score: "S19",
          current_mmp: 13
        },
        {
          class: "q2",
          name: i18n_t('mmp_v2.2.14'),
          score: "S20",
          current_mmp: 14
        },
        {
          class: "q3",
          name: i18n_t('mmp_v2.2.15'),
          score: "S21",
          current_mmp: 15
        },
        {
          class: "q4",
          name: i18n_t('mmp_v2.2.16'),
          score: "S22",
          current_mmp: 16
        },
        {
          class: "add_time",
          name: i18n_t('common.add_time'),
          score: "S7",
          current_mmp: 40
        },
        {
          class: "half_",
          name: i18n_t('common.half_'),
          score: "S2",
          current_mmp: 1
        },
        {
          class: "total",
          name: i18n_t('common.total'),
          score: "S1",
          current_mmp: null
        }
      ]
      // 右侧顶部比分
      arr[1] = [
        {
          name:i18n_t('video.score2'),                    //2分
          score:'S107'
        },
        {
          name:i18n_t('video.score3'),                    //3分
          score:'S108'
        },
        {
          name:i18n_t('common.pause'), // 暂停
          score: 'S109',
        },
        {
          name:i18n_t('common.penalty_kick'),             //罚球
          score:'S110',
          class: "penalty_kick"
        },
        {
          name: i18n_t('common.foul'), // 犯规
          score: 'S106'
        }
      ]
    }
    return arr;
  },
  /**
  * @Description:进入全屏
  * @Author Cable
  * @param {object} match  赛事信息
  * @param {number} play_type  数据源类型 1 ：源视频 2：动画 3 ：演播室 4 ：主播 5：专题
  * @param {object} route 路由参数
  * @param {function} router  路由方法 
  */
  full_screen(match,play_type,size,route,router){
    play_type = play_type || 1
    if(play_type == 2){
      this.send_message({
        cmd:'show_controller',
        val:false
      })
    }

    // 专题视频切换其他媒体类型前 通知子iframe记录当前播放时间
    if (lodash.get(route, 'params.play_type') == 5) {
      this.send_message({
        cmd: 'record_play_info',
        val: {
          record_play_time: true
        }
      })
    }
    
    if([1,3,5].includes(+play_type)){
      this.show_video_controller = true
    }
    
    const { mid, tid, csid } = match
    let video_size = '0'
    
    if((route.params.size == 1 || size == 'xl') && !is_eports_csid(match.csid)){
      video_size= '1'
    }

    clearTimeout(this.route_jump_timer)
    this.route_jump_timer = setTimeout(() => {
      router.push({
        name: 'video',
        params: {
          mid,
          tid,
          csid,
          play_type,
          video_size
        }
      })

      // 媒体类型标识转换（数字转字母标识）
      const media_type = get_media_icon_index(play_type)
      const media_info = {
        ...MatchDetailCalss.play_media,
        media_type
      }
      
      MatchDetailCalss.set_play_media(media_info)
      MatchDetailCalss.set_match_details_params({media_type})      
      clearTimeout(this.route_jump_timer)
      this.route_jump_timer = null
    }, 50)

  },
  /**
   * @Description 拼接视频播放地址
   * @param {object} res 接口返回数据
   * @param {number} mid 赛事ID
   * @param {number} live_type 1 视频源 3 演播厅lvs 4 主播  5 专题
   * @param {number} hd_sd  0标清, 1 高清
   * @param {string} 视频地址
  */
  get_video_url_h5(res,mid,live_type=1,hd_sd ){
    let media_src = ''
    let refer_url = lodash.get(res,'data.referUrl')
    if(refer_url){
      // refer_url = refer_url.replace(/https?:/, "");
      // refer_url = 'http://localhost:16677' ;
      let request_domain = lodash.get(window.BUILDIN_CONFIG,"DOMAIN_RESULT.first_one");
      let random = Math.random()
      let _token = User.get_user_token();
      media_src = `${refer_url}?live_type=${live_type}&hd_sd=${hd_sd}&random=${random}&mid=${mid}&domain=${request_domain}&is_client=1&load_error=${i18n_t('video.sorry')}&refresh=${i18n_t('footer_menu.refresh')}&token=${_token}`;
      // 本地代码解开，就能调试视频项目
      // media_src = `http://devliveh5.sportxxx13ky.com:4000?live_type=${live_type}&hd_sd=${hd_sd}&random=${random}&mid=${mid}&domain=${request_domain}&is_client=1&load_error=${i18n_t('video.sorry')}&refresh=${i18n_t('footer_menu.refresh')}&token=${_token}`;
      // 本地代码连生产环境时解开就可以播视频，不要推送到远端
      // media_src = 'https:' + media_src
      media_src = encodeURI(media_src)
    }
    return media_src
  },

  /**
  * @Description:获取视频播放地址，带判断是否登录，url是否可以打开
  * @Author Cable
  * @param {object} match  赛事信息
  * @param {function} callback  回调函数
  */
  get_video_url(match,route,callback){
    let { lvs = -1, mms = -1, tvs = -1,  zvs = -1,ms } = match
    let type = lodash.get(route,"params.play_type") || get_media_icon_index(MatchDetailCalss.play_media.media_type)
    // 是否滚球  并且视频状态等于2
    if(
      //源视频且滚球
    ((type == 1 && mms != 2) || type == 1 && (get_match_status(ms) != 1)) ||
    //演播厅
    ( type == 3 && lvs != 2) ||
    //主播
    ( type == 4 && tvs != 2) ||
    //专题
    ( type == 5 && lvs != 2)
    ){
      callback('no-video')
      return
    }
    //判断是否登录
    User.check_login( (islogin,is_limited)=> {
      if(!islogin){
        callback('no-login',is_limited)
        return
      }
      //获取视频播放域名
      this.get_video_refer(match.mid, url => {
        if(url == ''){
          callback('no-video')
          return
        }
       
        // 如果地址不是//开头  加上// 本地代码连生产时放开可播放大视频
        if(url.substr(0,2) != '//'){
          url = '//'+url
        }
        //校验url是否可以打开
        this.check_url(url, res => {
          if(res || window.BUILDIN_CONFIG.NODE_ENV == "development"){
            callback('play-video',url)
          } else {
            // 本地开发时不进行视频地址检测
            callback('no-video')
          }
        })
      })
    })
  },
  /**
  * @Description:获取视频播放地址，仅获取地址
  * @Author Cable
  * @param {number} mid 赛事id
  * @param {function} callback  回调函数
  */
  get_video_refer(mid,callback){
    let refer_url = lodash.get(window.BUILDIN_CONFIG.DOMAIN_RESULT,"live_domains[0]")
   
    // let refer_url = "https://prolivepc.sportxxx13ky.com"
    // if(refer_url){
    //   callback(this.join_video_url(mid,refer_url))
    //   return
    // }
    api_details.post_video_refer().then( res => {
      refer_url = lodash.get(res, "data.referUrl")
      if (!refer_url) {
        callback('')
        return
      }
      callback(this.join_video_url(mid,refer_url))
    }).catch( err => {
      console.error(err);
      callback('')
    })
  },
  /**
   * @Description 拼接视频地址
   * @param {string} refer_url 视频播放域名
   * @param {string} url 拼接好的视频播放地址
  */
  join_video_url(mid,refer_url){
    // 移除 http(s)
    refer_url = refer_url.replace(/https?:/, "")
    // let request_domain = window.BUILDIN_CONFIG.domain[window.BUILDIN_CONFIG.CURRENT_ENV][0]; todo
    let request_domain =lodash.get(window.BUILDIN_CONFIG, 'DOMAIN_RESULT.first_one')
    let url = ''
    // if (window.env.NODE_ENV == "development" && (refer_url.indexOf('//prolivepc') == 0)) {
    //   // 生产环境使用代理进行播放视频连接操作
    //   url = `/video/?mid=${mid}&domain=${request_domain}&style=${UserCtr.theme}`
    // } else {
      url = `${refer_url}?mid=${mid}&domain=${request_domain}&style=${UserCtr.theme}`
    // }
    url += `&load_error=${i18n_t('video.load_error')}&refresh=${i18n_t('common.refresh')}&pause=${i18n_t('video.pause')}&play=${i18n_t('video.play')}&mute=${i18n_t('video.mute')}&cancel_mute=${i18n_t('video.cancel_mute')}&refresh-icon=0&controls=1&is_client=1&open_pip=${i18n_t('video.open_pip')}&token=${UserCtr.user_token}&rdm=${new Date().getTime()}`
    url = encodeURI(url)
    //本地代码连生产时放开可播放大视频
    // url = 'https:' + url
    return  url
  },
  /**
  * @Description:校验url是否可以打开
  * @Author Cable
  * @param {string} url 链接地址
  * @param {function} callback  回调函数
  */
  check_url(url,callback){
    api_details.get_full_url(url).then( res => {
     
      if (res.data) {
        callback(true)
      } else {
        callback(true)
      }
    }).catch( err => {
      console.error(err)
      callback(true)
    })
  },
  /**
  * @Description:获取动画播放地址
  * @Author Cable
  * @param {object} match  赛事信息
  * @param {function} callback  回调函数
  */
  get_animation_url(match,callback){
    // 动画状态等于-1
    if(match.mvs < 0){
      callback('no-video')
      return
    }
    //获取动画播放地址
    let params = {
      mid:match.mid,
      type: "Animation",
      device: "PC"
    }
    api_common.videoAnimationUrl(params).then( res => {
      let animationUrl = ''
      //足篮棒网使用3.0动画  其他使用2.0
      if([1,2,3,5].includes(match.csid*1)){
        let style = UserCtr.theme.includes('day') ? 'theme01' : 'theme02'
        let animation3Url = lodash.get(res, "data.animation3Url") || []
        animation3Url.forEach( item =>{
          if(item.styleName.indexOf(style) >= 0){
            animationUrl = item.path
          }
        })
      }
      animationUrl = animationUrl || lodash.get(res, "data.animationUrl")
      if (animationUrl) {
        // 移除 http(s)
        animationUrl = animationUrl.replace(/https?:/, "")
        // 如果地址不是//开头  加上//
        if(animationUrl.substr(0,2) != '//'){
          animationUrl = '//'+animationUrl
        }
        animationUrl = animationUrl + `&rdm=${new Date().getTime()}`
        callback('play-video',animationUrl)
      } else {
        callback('no-video')
        return
      }
    }).catch( err => {
      console.error(err);
      callback('no-video')
    })
  },
  /**
   * @Description:设置播放类型
   * @param {number} mid 赛事ID
   * @param {string} media_type 播放类型
   * @return {undefined} undefined
   */
  set_play_media(mid,media_type){
    MatchDetailCalss.set_play_media({
      mid,
      media_type
    })
    //同步播放类型到详情
    let data =  lodash.cloneDeep(MatchDetailCalss.params)
    data.media_type = media_type
    MatchDetailCalss.set_match_details_params(data)    
  },
  /**
  * @Description:获取滚球视频列表
  * @Author Cable
  * @param:callback  回调函数
  */
  get_videos(callback) {
    let sm = ''
    let isAnimation = ""
    let media_type = MatchDetailCalss.play_media.media_type
    switch (media_type) {
      case 'studio':
        isAnimation = 3
        break;
      case 'topic':
        isAnimation = 4
        break;
      case 'animation':
         sm ='888'
        break;

      default:
        break;
    }

    // isAnimation:赛事是否有动画和视频 1 有 0 没有 2只有视频 3 只有直播 4 赛前节目 5 视频/直播/赛前节目
    // if(vue.$route.name === 'video'){
    //     isAnimation = 5
    //     // if( lodash.get(vue,'$route.params.play_type') === '2' ){
    //     //   sm ='888'
    //     // }
    // }
    api_common.get_videos({sm,isAnimation}).then( res => {
      let data = lodash.get(res,'data') || []
      // 根据商户过滤篮球赛事
      data.forEach( match => {
        match.msc = BetCommonHelper.msc_array_obj(match.msc)
        details.init_score(match.msc,['S1'],true)
      });
      callback(data)
    }).catch( err => {
      console.error(err)
      callback([])
    })
  },

  /**
  * @Description:大屏版赛事关闭，切换下一场有视频赛事，如果没有就返回列表
  * @Author Cable
  * @param {number} mid  关闭的赛事id
  * @param {number} router  路由方法
  */
  match_close(mid,router){
    this.is_video_end = true
    window.vue.useMittEmit('exit_browser_full_screen')
    router.push('/home')
    // this.get_videos( match_list => {
    //   for(let i in match_list){
    //     if(match_list[i].mid != mid){
    //       this.full_screen(match_list[i])
    //       return
    //     }
    //   }
    //   window.vue.$router.push('/home')
    // })
  }
}
