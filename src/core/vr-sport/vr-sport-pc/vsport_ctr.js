import { api_virtual } from "src/api/index";
import VSport from "./vsport.js"
import { i18n_t} from  "src/core/index.js"
import { useMittOn, useMittEmit, useMittEmitterGenerator,MITT_TYPES  } from "src/core/mitt/index.js"
import PageSourceData  from  "src/core/page-source/page-source.js"
import { useRouter, useRoute } from 'vue-router'
import {msc_array_obj} from "src/core/format/index.js"
import { throttle } from "lodash";
const router = useRouter()
const route = useRoute()
let video_voice = false
export default class VsportCtr {
  /**
   * @description: 构造函数
   * @return {undefined} undefined
   */
  constructor( ) {
   
    // 数据加载状态
    this.load_data_state = 'loading'
    // 联赛积分榜
    this.league_rank_list = []
    // 小组赛积分榜
    this.group_rank_list = []
    // 淘汰赛积分榜
    this.elimination_rank = []
    // 淘汰赛决赛战队
    this.final = {}
    // 赛马赛果排行
    this.horse_rank = []
    // 赛马赛果玩法ID  [冠军，前二，前三]，[准确前二，前二组合，准确前三]，[单，小]
    this.horse_play_id = [[20033,20034,20035],[20036,20037,20038],[20039,20040]]
    // 赛马赛果玩法数据
    this.horse_play_data = {}
    // 圆弧路径
    this.path_d = ''
    // 剩余开赛时间
    this.rest_time_str = ''
    // 距离下一场开赛时间
    this.next_time_str = ''
    // 杯赛排行榜tab   group：小组赛  elimination：淘汰赛
    this.cup_tab = 'group'
    // 淘汰赛tab
    this.elimination_tab = ''
    this.elimination_tabs = [
      {key:'q8',value:i18n_t('vsport.etab1')}, // 16强
      {key:'q4',value:i18n_t('vsport.etab2')}, // 1/4决赛
      {key:'semifinal',value:i18n_t('vsport.etab3')}, // 半决赛
      {key:'final',value:i18n_t('vsport.etab4')}, // 决赛
    ]
    // 禁用的淘汰赛tab
    this.elimination_disable = []
    // 有高亮背景的淘汰赛tab
    this.elimination_tab_bg = []
    // 赛果样式
    this.result_style = ''
    // 赛事进程列表
    this.replay_list = []
    // 当前选中的赛事进程索引
    this.replay_index = 0
    // 赛事状态  0未开赛  1进行中   2已结束
    this.status = 0 
    // 赛事信息  mmp: 阶段 GROUPS 小组赛 Q32 32强 Q16 16强 Q8 8强 Q4 4强 SEMIFINAL 半决赛  FINAL 决赛  
    this.info = {}
    // 视频区域显示类型  result 赛果  video 视频  time 倒计时
    this.video_show_type = ''
    // 视频加载状态  loading 加载中  done 加载完成 play_end 播放完毕 error 加载失败
    this.video_load_state = 'loading'  
    // 视频链接
    this.video_url = ''  
    // 视频声音 true有声  false无声
    this.video_voice = video_voice 
    // 当前视频播放时间
    this.video_time = 0
    // 当前数据更新时间
    this.upd_time = 0
    // 是否调试
    this.is_test = sessionStorage.getItem('wsl')
    // 自动下发实时数据工具类实例
    this.VSport_obj_list = []
    // 组件key值
    this.vue_key = 0
    // 刷新视频节流
    this.reload_video =  throttle(this.reload_video,5000)
    // 定时器运行次数
    this.timer_count = 0
    // 篮球进度线宽度
    this.basketball_line_width = 0
    // 篮球赛前盘已开赛时间
    this.basketball_strat_time = ''
    //
    this.get_vsport_params={}
  }

  // 销毁函数
  destroy () {
    clearTimeout(this.player_timeout_id)
    clearTimeout(this.get_basketball_score_timer)
    clearTimeout(this.get_replay_timer)
    this.debounce_throttle_cancel(this.reload_video);
  }
  /**
   * @Description 初始化 
   * @param {undefined} undefined
  */
  init(){
    this.load_data_state = 'loading'
    this.video_load_state = 'loading'
    this.elimination_rank = []
    this.final = {}
    this.upd_time = 0
    this.destroy_video()
    this.destroy_vsport()
    this.get_replay()
  }

  set_get_vsport_params(obj){
   this.get_vsport_params={...obj}
  }
  /**
   * @Description 获取赛事进程数据 
   * @param {undefined} undefined
  */
  get_replay(){
    let params = _.clone(this.get_vsport_params)
    delete params.id
    // 虚拟足球  虚拟篮球
    if([1001,1004].includes(params.csid*1)){
      delete params.mid
      if(!params.orderNo){
        delete params.orderNo
      }
    }else{
      delete params.batchNo
      delete params.orderNo
      delete params.tid
    }
    if(params.csid == 0){
      this.load_data_state = 'empty'
      return
    }
    api_virtual.post_virtual_replay(params).then( res => {
      let code = _.get(res,'data.code')
      this.info = _.get(res,'data.data.matchs[0]') || {}
      if(code == 200 && this.info.mid){
        if(this.info.mmp == 'GROUPS'){
          this.cup_tab = 'group'
        }else{
          this.cup_tab = 'elimination'
        }
        let replay_data = _.get(res,'data.data.detail')
        this.rest_star_time = this.info.mgt - this.get_remote_time()
        this.rest_time_str = this.get_rest_time_str(this.rest_star_time)
        this.info.next_no = this.get_next_no(res)
        this.info.next_time = _.get(res,'data.data.nextTime')
        // 如果有下一期
        if(this.info.next_time && this.info.next_no){
          this.info.has_next = true
        }else{
          this.info.has_next = false
        }
        let status = 0
        // 未开赛
        if(this.rest_star_time > 1000){
          this.start_animation()
        }else if(Math.abs(this.rest_star_time) > this.get_max_video_time(replay_data)){
          // 已结束
          status = 2
        }else{
          // 进行中 无视频数据 并且 开赛时间小于20秒
          if(!replay_data && Math.abs(this.rest_star_time) < 20000){
            if(this.get_replay_timer ){
              clearTimeout(this.get_replay_timer)
              this.get_replay_timer =null
            }
            this.get_replay_timer = setTimeout(() => {
              this.get_replay()
            },2000)
          }
          status = 1
          this.video_url = _.get(replay_data,`${this.get_vsport_params.mid}.thirdMatchVideoUrl`) || new Date() * 1
        }
        this.set_status(status)
        // 足球
        if([1001,1004].includes(this.info.csid*1)){
          this.set_footbal_replay(res)
          this.mid_change(this.get_vsport_params.mid)
          if(status==1){
          this.get_basketball_score()
          }
        }else{
          // 赛马
          this.set_horse_replay(res)
        }
        this.set_video_show_type(true)
        this.star_vsport()
        this.set_elimination_disable()
        this.vue_key++
        this.load_data_state = 'data'
      }else{
        this.load_data_state = 'empty'
      }
    }).catch( err => {
      console.error(err);
      this.load_data_state = 'empty'
    })
  }
  /**
   * @Description 设置赛马进程
   * @param {object} res 接口返回数据
  */
  set_horse_replay(res){
    let horse_replay = _.get(res,`data.data.detail.${this.info.mid}`) || {}
    let match_teams = _.get(res,'data.data.matchs[0].teams') || []
    let hl_obj = this.get_horse_hl(res)
    let team = {}
    let rankings = []
    let hsw = {}
    _.each(_.get(res,'data.data.matchs[0].hpsPns'), item => {
      hsw[item.hpid] = item.hsw
    })
    for(let i = 0; i < match_teams.length; i++){
      let code = i+1
      horse_replay['ranking'+code] = code
      rankings.push('ranking'+code)
      team[code] = {
        name:match_teams[i],
        play20033:{
          ov:this.get_ov(hl_obj,20033,i),
          hsw:hsw[20033]
        },
        play20034:{
          ov:this.get_ov(hl_obj,20034,i),
          hsw:hsw[20034]
        },
        play20035:{
          ov:this.get_ov(hl_obj,20035,i),
          hsw:hsw[20035]
        },
      }
    }
    horse_replay.rankings = rankings
    horse_replay.rankings = rankings
    horse_replay.team = team
    this.replay_index = 0
    this.replay_list = [horse_replay]
  }
  /**
   * @Description 获取赛马投注项 
   * @param {object} res 接口返回数据
   * @param {undefined} undefined
  */
  get_horse_hl(res){
    let hps = _.get(res,'data.data.matchs[0].hpsData[0].hps') || []
    let obj = {}
    for(let i = 0; i < hps.length; i++){
      if(hps[i] && hps[i].hpid){
        obj[hps[i].hpid] = _.get(hps[i],'hl.ol')
      }
    }
    return obj
  }
  /**
   * @Description 获取赛马赔率 
   * @param {object} hl_obj 投注项obj
   * @param {number} hpid 玩法ID
   * @param {number} i 投注项索引
   * @param {undefined} undefined
  */
  get_ov(hl_obj,hpid,i){
    let ov = _.get(hl_obj,`${hpid}[${i}].ov`)
    if(ov){
      return ov / 100000
    }else{
      return ''
    }
  }
  /**
   * @Description 设置足球进程
   * @param {object} res 接口返回数据
   * @param {array} 
  */
  set_footbal_replay(res){
    let matchs = _.get(res,'data.data.matchs') || []
    let replay_list = []
    for(let i = 0; i < matchs.length; i++){
      let item = _.clone(matchs[i])
      Object.assign(item,_.get(res,`data.data.detail.${item.mid}`) || {})
      item.home_name = item.teams[0]
      item.away_name = item.teams[1]
      item.home = 0
      item.away = 0
      item.penalty_score_home = ''
      item.penalty_score_away = ''
      // 篮球比分
      if(item.csid == 1004 && item.mmp == 'INGAME'){
        let score = _.get(res,`data.data.lastMatchScore.${item.mid}.S1`)
        if(score){
          let arr = score.split(':')
          item.home = arr[0]
          item.away = arr[1]
        }
      }
      if(this.status == 2){
        // 如果赛事已结束  给足球添加比分
        let score =  msc_array_obj(item.score);
        if(score.S1){
          item.home = score.S1.home
          item.away = score.S1.away
        }
      }
      item.show_time = 0
      item.status = this.status
      item.show_result = false
      item.result = []
      replay_list.push(item)
    }
    this.replay_list = replay_list
  }
  /**
   * @Description 设置赛果弹窗样式
   * @param {undefined} undefined
  */
  set_result_style(){
    let el = document.getElementById('virtual-right-wrap')
    if(!el){
      return
    }
    let result_style
    // 专业版
    let width = el.clientWidth - 14
    result_style = `transform:translateX(2px);width:${width}px;`
    this.result_style = result_style
  }
  /**
   * @Description 获取下一期 期号 
   * @param {object} res 接口返回数据
   * @param {string}
  */
  get_next_no(res){
    let no,key
    // 足球
    if(this.info.csid == 1001){
      no = _.get(res,'data.data.nextNo')
      key = 'vsport.xlun'
    }else{
      no = _.get(res,'data.data.nextBatchNo')
      key = 'vsport.xqi'
    }
    if(no){
      no = i18n_t(key).replace('%s',no)  
    }
    return no
  }
  /**
   * @Description 启动实时数据工具类
   * @param {undefined} undefined
  */
  star_vsport(){
    // 如果是篮球赛前
    if(this.csid == 1004 && this.info.mmp == 'PREGAME') return
    // 进行中 并且有视频数据
    if(this.status != 1) return
    this.destroy_vsport()
    this.replay_list.forEach( (match,index) => {
      if(!match.list) return
      this.VSport_obj_list[index] = new VSport(match, res => {
        this.upd_time = res.upd_time
        match.show_time = Math.max(res.show_time,0)
        // 有数据更新 并且赛事不是结束状态
        if(res.upd && match.status != 2 && this.status != 2){
          Object.assign(match,res.item_obj)
        }
        // 赛事结束 并且视频不是加载完成状态 或者当前播放的不是此赛事
        if(res.match_status == 2){
          match.score_end = true
          if(this.video_load_state != 'done' || this.get_vsport_params.mid != match.mid){
            if(this.VSport_obj_list[index]){
              this.VSport_obj_list[index].destroy()
            }
            match.status = 2
            if(match.csid == 1001 && match.isc == 1){
              let main_score = _.get(this.basketball_score,`${match.mid}.S1`,"")
              let [home,away] = main_score.split(':')
              if(home && away) {
               Object.assign(match,{home,away})
              }
            }
            this.set_status_end()
          }
        }
      })
    })
  }
  /**
   * @Description 销毁 实时数据工具类
   * @param {undefined} undefined
  */
  destroy_vsport(){
    this.VSport_obj_list.forEach( item => {
      item.destroy()
    })
  }
  /**
   * @Description 播放视频 
   * @param {undefined} undefined
  */
  play_video(){
    clearTimeout(this.player_timeout_id)
    this.destroy_video()
    if(!this.video_url || this.status != 1){
      return
    }
    if(typeof this.video_url == 'number'){
      this.video_load_state = 'error' 
      return
    }
    this.video_load_state = 'loading' 
    this.video_load_time = new Date() * 1
    this.video_time = 0
    // 如果js文件没加载成功 延迟200再次尝试
    // #TODO 替换window
    // if(!window.Hls || !window.DPlayer){
    //   this.player_timeout_id = setTimeout(() => {
    //     this.play_video()
    //   },200)
    //   return
    // }
    this.player = new DPlayer({
      container: document.getElementById('dplayer'),
      live: true,
      autoplay: true,
      video: {
        url:this.video_url,
        type:'hls',
        autoplay: true,
      },
    });
    this.capture_video_error()
    let seek_time = parseInt((this.get_remote_time() - this.info.mgt) / 1000) 
    if(seek_time > 0){
      this.player.seek(seek_time)
    }
    // 监听视频可以播放
    this.player.on('canplaythrough', () => {
      let val = video_voice ? 1 : 0
      this.player.volume(val, true, false)
      this.player.play();
      this.video_duration = this.player.video.duration
      this.video_load_state = 'done' 
    });
    // 监听视频播放完毕
    this.player.on('ended', () => {
      this.video_load_state = 'play_end'
      if(this.replay_list[this.replay_index].score_end){
        this.set_cur_match_end()
      }
      // 泥地摩托车视频播放完毕展示赛果
      if(this.info.csid == 1009){
        this.set_status_end()
      }
    })
  }
  /**
   * @Description 切换足球赛事 
   * @param {number} mid 赛事ID
   * @param {undefined} undefined
  */
  switch_footbal(mid){
    if(this.info.csid == 1004){
      return
    }
     
    this.get_vsport_params.mid =mid
  }
  /**
   * @Description 刷新视频   
   * @param {undefined} undefined
  */
  reload_video(){
    this.play_video()
  }
  /**
   * @Description 设置视频声音 
   * @param {undefined} undefined
  */
  set_video_voice(){
    this.video_voice = !this.video_voice
    video_voice = this.video_voice
    let val = video_voice ? 1 : 0
    this.player.volume(val, true, false)
  }
  /**
   * @Description 设置当前播放赛事结束
   * @param {undefined} undefined
  */
  set_cur_match_end(){
    this.replay_list[this.replay_index].status = 2
    this.set_status_end()
  }
  /**
   * @Description 设置所有赛事结束 
   * @param {undefined} undefined
  */
  set_status_end(){
    // 赛马
    if(![1001,1004].includes(this.info.csid*1)){
      this.set_status(2)
      return
    }
    // 足球
    let end = true
    for(let i = 0; i < this.replay_list.length; i++){
      if(this.replay_list[i].status != 2){
        end = false
        break
      }
    }
    if(end){
      this.set_status(2)
    }
    this.set_video_show_type()
  }
  /**
   * @Description 同步视频播放时间 如果网络卡顿导致视频慢 则快进
   * @param {undefined} undefined
  */
  sync_video_play_time(){
    // 如果不是开赛状态
    if(this.status != 1) return
    // 如果视频加载时间超过5秒  则刷新视频 重新加载
    if(this.video_load_state == 'loading' && new Date() * 1 - this.video_load_time > 5000 && document.getElementById('dplayer')){
      this.reload_video()
    }
    let seek_time = parseInt((this.get_remote_time() - this.info.mgt) / 1000)
    // 超过90秒结束赛事
    if(seek_time > 90){
      this.set_status(2)
      return
    }
    // 视频加载状态不是完成
    if(this.video_load_state != 'done') return
    this.video_time = this.player.video.currentTime
    if(this.upd_time < this.video_duration && this.upd_time - this.player.video.currentTime > 1){
      this.player.seek(this.upd_time)
    }
    if(this.upd_time > this.video_duration){
      this.set_cur_match_end()
    }
    // 如果视频卡了5秒  则刷新视频
    if(this.upd_time - this.player.video.currentTime > 5){
      this.reload_video()
    }
  }
  /**
   * @Description 每10S拉一次足球积分榜 
   * @param {undefined} undefined
  */
  reload_footbal_rank(){
    this.timer_count++
    if(this.timer_count % 10 != 0) return
    // 不等于足球 或者 不是已结束状态
    if(this.info.csid != 1001 || this.status != 2) return
    if(this.info.isc == 1){
      // 淘汰赛
      this.set_elimination_rank()
      this.set_group_rank_list()
    }else{
      // 联赛
      this.set_league_rank_list()
    }
  }
  /**
   * @Description 设置赛事状态 
   * @param {number} status 状态
   * @param {undefined} undefined
  */
  set_status(status){
    if(this.info.csid == 1004){
      if(status == 2){
        this.basketball_line_width = 100
      }
      if(status == 0){  
        this.basketball_line_width = 0
      }
    }
    this.status = status
    this.set_video_show_type()
    // 赛事结束5秒后拉足球积分榜
    // if(status == 2 && this.info.csid == 1001){
    //   setTimeout( () => {
    //     if(this.info.isc == 1){
    //       this.set_elimination_rank()
    //       this.set_group_rank_list()
    //     }else{
    //       this.set_league_rank_list()
    //     }
    //   },5000)
    // }
  }
  /**
   * @Description 设置视频显示区域类型
   * @param {undefined} undefined
  */
  set_video_show_type(no_start_animation){
    this.video_show_type = this.get_video_show_type(no_start_animation)
     if((this.video_show_type == 'result' || this.video_show_type == 'basketball_result') && PageSourceData.page_source=='virtual_details'){
       // 赛事结束
      useMittEmit("virtual_match_done")
     }
    // 如果不是视频类型  销毁视频
    if(this.video_show_type != 'video'){
      this.destroy_video()
    }
  }
  /**
   * @Description 获取视频显示区域类型
   * @param {string} 
  */
  get_video_show_type(no_start_animation){
    if(this.status == 0){
      return 'time'
    }
    if(this.info.csid == 1004 && this.info.mmp == 'PREGAME'){
      if(!no_start_animation){
        this.start_animation_b()
      }
      return 'basketball_result'
    }
    if(this.status == 2 || _.get(this.replay_list[this.replay_index],'status') == 2){
      if(this.info.csid == 1004){
        return 'basketball_result'
      }else{
        return 'result'
      }
    }else{
      return 'video'
    }
  }
  /**
   * @Description 销毁视频 
   * @param {undefined} undefined
  */
  destroy_video(){
    clearTimeout(this.player_timeout_id)
    if(this.player){
      this.player.destroy()
    }
  }
  /**
   * @Description 捕获视频错误信息 
   * @param {undefined} undefined
  */
  capture_video_error(){
    if(!this.player.plugins.hls){
      return
    }
    this.player.plugins.hls.on(Hls.Events.ERROR, (event, data) => {
      // 致命错误  无法播放
      if(data.fatal){
        this.destroy_video()
        this.video_load_state = 'error'
      }
    })
  }
  /**
   * @Description 设置赛果 
   * @param {undefined} undefined
  */
  set_match_result(mid,index){
    mid = mid || this.get_vsport_params.mid
    api_virtual.get_match_result({mid}).then( res => {
      let code = _.get(res,'data.code')
      if(code == 200){
        // 足球
        if([1001,1004].includes(this.info.csid*1)){
          if(_.get('replay_list['+index+'].result')){
            this.replay_list[index].result = _.get(res,'data.data') || []
          } else {
            this.horse_rank = []
            this.horse_play_data = {}
          }
        }else{
          this.horse_rank = _.get(res,'data.data.rank') || []
          this.set_horse_play_data(_.get(res,'data.data.plays'))
        }
      }else{
        this.horse_rank = []
        this.horse_play_data = {}
      }
    }).catch( err => {
      console.error(err);
      this.horse_rank = []
      this.horse_play_data = {}
    })
  }
  /**
   * @Description 获取赛马赛果玩法 
   * @param {array} plays 
   * @param {undefined} undefined
  */
  set_horse_play_data(plays){
    let horse_play_data = {}
    plays = plays || []
    plays.forEach( item => {
      item.ol.forEach( ol => {
        if(ol.on && !this.horse_play_id[2].includes(item.playId*1)){
          ol.ons = ol.on.split("/");
        }else{
          ol.ons = []
        }
      })
      if(this.horse_play_id[2].includes(item.playId*1)){
        item.playName = _.get(item,'ol[0].on') || ''
      }
      horse_play_data[item.playId] = item
    });
    this.horse_play_data = horse_play_data
  }
  /**
   * @Description 设置小组赛积分榜数据 
   * @param {undefined} undefined
  */
  set_group_rank_list(){
    let params = {
      tid:this.get_vsport_params.tid
    }
    api_virtual.post_group_ranking(params).then( res => {
      let code = _.get(res,'data.code')
      let data = _.get(res,'data.data') || []
      if(code == 200){
        this.group_rank_list = data
      }else{
        this.group_rank_list = []
      }
    }).catch( err => {
      console.error(err);
      this.group_rank_list = []
    })
  }
  /**
   * @Description 赛事ID改变 
   * @param {number} mid 赛事ID
   * @param {undefined} undefined
  */
  mid_change(mid){
    for(let i = 0; i < this.replay_list.length; i++){
      if(mid == this.replay_list[i].mid){
        this.replay_index = i   
        this.set_video_show_type()
        break
      }
    }
    // 如果是足球 并且当场赛事正在比赛中
    if(this.info.csid == 1001 && this.replay_list[this.replay_index].status == 1){
      this.video_url = this.replay_list[this.replay_index].thirdMatchVideoUrl || new Date() * 1
    }
    // 如果是详情页  切换详情赛事
    if(PageSourceData.page_source == 'virtual_details'){
       router.push({
        name: 'virtual_details',
        params: {
          mid,
          tid: this.info.tid,
          csid: this.info.csid
        }
      })
    }
  }
  /**
   * @Description 设置杯赛tab
   * @param {string} val tab值
   * @param {undefined} undefined
  */
  set_cup_tab(val){
    if(val == 'elimination' && this.info.mmp == 'GROUPS'){
      return
    }
    this.cup_tab = val
  }
  /**
   * @Description 设置淘汰赛禁用的tab 
   * @param {undefined} undefined
  */
  set_elimination_disable(){
    let arr = []
    if(this.info.mmp == 'Q8'){
      arr = ['q4','semifinal','final']
    }
    if(this.info.mmp == 'Q4'){
      arr = ['semifinal','final']
    }
    if(this.info.mmp == 'SEMIFINAL'){
      arr = ['final']
    }
    this.elimination_disable = arr
  }
  /**
   * @Description 设置淘汰赛tab 
   * @param {string} key tab键值
   * @param {undefined} undefined
  */
  set_elimination_tab(key){
    if(this.elimination_disable.includes(key)){
      return
    }
    this.elimination_tab = key
    if(key == 'final'){
      this.elimination_rank = []
    }else{
      this.elimination_rank = this[key]
    }
    this.set_elimination_tab_bg()
  }
  /**
   * @Description 设置淘汰赛tab高亮背景
   * @param {undefined} undefined
  */
  set_elimination_tab_bg(){
    // q8 16强 ,  q4 1/4决赛, semifinal 半决赛, final 决赛
    if(this.elimination_tab == 'q4'){
      this.elimination_tab_bg = ['q8']
    }else if(this.elimination_tab == 'semifinal'){
      this.elimination_tab_bg = ['q8','q4']
    }else{
      this.elimination_tab_bg = []
    }
  }
  /**
   * @Description 设置淘汰赛积分榜  
   * @param {boolean} is_init 是否初始化
   * @param {undefined} undefined
  */
  set_elimination_rank(is_init){
    let params = {
      tid:this.get_vsport_params.tid,
      batchNo:this.info.batchNo,
      lod:this.info.lod || 1,
      beginTime:this.info.mgt,
      mmp:this.info.mmp,
    }
    api_virtual.get_elimination_rank(params).then( res => {
      let code = _.get(res,'data.code')
      if(code == 200){
        this.q8 = this.get_elimination_arr(_.get(res,'data.data.Q8'),i18n_t('vsport.etab2'))
        this.q4 = this.get_elimination_arr(_.get(res,'data.data.Q4'),i18n_t('vsport.etab3'))
        this.semifinal = this.get_elimination_arr(_.get(res,'data.data.SEMIFINAL'),i18n_t('vsport.etab4'))
        this.final = _.get(res,'data.data.FINAL[0]') || {}
        if(is_init){
          this.info.mmp && (this.elimination_tab = this.info.mmp.toLowerCase())
          this.set_elimination_tab_bg()
        }
        if(this.elimination_tab == 'final'){
          this.elimination_rank = []
        }else{
          this.elimination_rank = this[this.elimination_tab]
        }
      }else{
        this.elimination_rank = []
      }
    }).catch( err => {
      console.error(err);
      this.elimination_rank = []
    })
  }

  /**
   * @Description 设置淘汰赛积分榜      获取点球比分
   * @param {boolean} is_init 是否初始化
   * @param {undefined} undefined
  */
  get_basketball_score(){
    let mids = []
    this.replay_list.forEach( match => {
      mids.push(match.mid)
    })
    let params = {
      mids:mids.join(',')
    }
    api_virtual.get_basketball_score(params).then( res => {
      let code = _.get(res,'data.code')
      let basketball_score = _.get(res,'data.data')
      if(code == 200 && basketball_score[mids[0]]){
        _.each(basketball_score, item => {
          if(item.S1){
            item.score = item.S1.split(':')
          }
        })
        this.basketball_score = basketball_score
        //获取足球点球比分
        if(this.info.csid == 1001  && this.info.isc == 1)
        this.replay_list.forEach( match => {
          let score = _.get(basketball_score,`${match.mid}.S170`,"")
          if(score){
            let [penalty_score_home,penalty_score_away] = score.split(':')
            //合并比分
           Object.assign(match,{penalty_score_home,penalty_score_away})
          }
        })

      }else{
        this.get_basketball_score_count++
        if(this.get_basketball_score_count < 3){
          if(this.get_basketball_score_timer ){
            clearTimeout(this.get_basketball_score_timer)
            this.get_basketball_score_timer =null
          }
          this.get_basketball_score_timer = setTimeout(() => {
            this.get_basketball_score()
          },2000)
        }
      }
    }).catch( err => {
      console.error(err);
    })
  }
  /**
   * @Description 重新组装淘汰赛数组 
   * @param {array} data 接口原始数组
   * @param {string} type 淘汰赛类型
   * @param {array} 重新组装后的数组
  */
  get_elimination_arr(data,type){
    data = data || []
    let arr = []
    let number = 0
    let obj,item
    for(let i = 0; i < data.length; i++){
      item = data[i]
      if(i % 2 == 0){
        obj = {match_list:[]}
        obj.type = type
      }
      number++
      obj.match_list.push({
        name:item.homeName,
        score:this.get_elimination_score(item.homeScore),
        number
      })
      number++
      obj.match_list.push({
        name:item.awayName,
        score:this.get_elimination_score(item.awayScore),
        number
      })
      if(i % 2 != 0){
        arr.push(obj)
      }
    }
    return arr
  }
  /**
   * @Description 获取淘汰赛比分 
   * @param {string} data 接口原始比分
   * @param {array} 转换后的比分
  */
  get_elimination_score(data){
    let arr = data.split(',')
    let score = []
    for(let i = 0; i < 3; i++){
      if(typeof arr[i] == 'undefined'){
        score.push('')
      }else{
        score.push(arr[i])
      }
    }
    return score
  }
  /**
   * @Description 设置联赛积分榜数据 
   * @param {undefined} undefined
  */
  set_league_rank_list(){
    let params = {
      tid:this.get_vsport_params.tid
    }
    api_virtual.post_league_ranking(params).then( res => {
      let code = _.get(res,'data.code')
      let data = _.get(res,'data.data') || []
      if(code == 200){
        this.league_rank_list = data
      }else{
        this.league_rank_list = []
      }
    }).catch( err => {
      console.error(err);
      this.league_rank_list = []
    })
  }
  /**
   * @Description 获取最长视频时间 
   * @param {object} replay_data 视频进程数据
   * @param {number} 视频时长  单位毫秒
  */
  get_max_video_time(replay_data){
    let t = 0
    _.each(replay_data, item => {
      let t2 = _.get(item,'totalTime') || 0
      if(t2 > t) t = t2
    })
    let default_time = this.get_vsport_params.mid ? 90 : 20
    t = t == 0 ? default_time : t 
    t *= 1000
    return t
  }
  /**
   * @Description 获取剩余时间 字符串格式
   * @param {number} time 剩余时间毫秒
   * @param {string} 
  */
  get_rest_time_str(time){
    let minute = parseInt(time / 1000 / 60).toString().padStart(2,0)
    let second = parseInt(time / 1000 % 60).toString().padStart(2,0)
    return `${minute}'${second}''`
  }
  /**
   * @Description 定时器 
   * @param {undefined} undefined
  */
  timer(){
    this.set_rest_star_time()
    this.set_rest_next_time()
    this.sync_video_play_time()
    this.reload_footbal_rank()
  }
  /**
   * @Description:设置剩余开赛时间
   * @return {undefined} undefined
   */
  set_rest_star_time(){
    if(this.status != 0){
      return
    }
    let rest_star_time = this.info.mgt - this.get_remote_time()
    if(rest_star_time < 0){
      return
    }
    this.rest_time_str = this.get_rest_time_str(rest_star_time)
    if(rest_star_time < 1000){
      this.get_replay()
      return
    }
  }
  /**
   * @Description:设置展示赛果剩余时间
   * @return {undefined} undefined
   */
  set_rest_next_time(){
    if(!this.info.has_next){
      return
    }
    let next_time = this.info.next_time - this.get_remote_time()
    if(next_time < 0){
      return
    }
    this.next_time_str = this.get_rest_time_str(next_time)
  }
  /**
   * @Description 开始倒计时动画 
   * @param {undefined} undefined
  */
  start_animation(){
    if(this.interval_id){
      clearInterval(this.interval_id)
    }
    this.animation_time = parseInt(this.rest_star_time / 1000) * 1000 // 剩余时间秒
    this.init_time = new Date() * 1
    this.interval_id = setInterval(()=>{
      this.animation()
    },16);
  }
  /**
   * @Description 倒计时动画 
   * @param {undefined} undefined
  */
  animation(){
    let animation_time = this.animation_time - (new Date() * 1 - this.init_time)
    if(animation_time > 0){
      this.path_d = this.get_path_d(animation_time)
    }else{
      clearInterval(this.interval_id)
    }
  }
  /**
   * @Description 启动篮球橙色线性进度条动画
   * @param {undefined} undefined
  */
   start_animation_b(){
    this.get_basketball_score_count = 0
    if(this.get_basketball_score_timer ){
      clearTimeout(this.get_basketball_score_timer)
      this.get_basketball_score_timer =null
    }
    this.get_basketball_score_timer = setTimeout(() => {
      this.get_basketball_score()
    },1000)
    if(this.interval_id_b){
      clearInterval(this.interval_id_b)
    }
    let start_time = this.get_remote_time() - this.info.mgt
    this.start_time = parseInt(start_time / 1000) * 1000 // 已开赛时间
    this.init_time_b = new Date() * 1
    this.interval_id_b = setInterval(()=>{
      this.animation_b()
    },16);
  }
  /**
   * @Description 篮球橙色线性进度条动画
   * @param {undefined} undefined
  */
  animation_b(){
    if(this.info.mmp == 'INGAME'){
      return
    }
    let start_time = this.start_time + (new Date() * 1 - this.init_time_b)
    if(start_time < 6000){
      this.basketball_strat_time = this.get_rest_time_str(600000 - parseInt(start_time * 90))
      this.basketball_line_width = parseInt(start_time / 6000 * 10000) / 100 
      this.replay_list.forEach( match => {
        let score = _.get(this.basketball_score,`${match.mid}.score`) || [0,0]
        match.home = Math.ceil(this.basketball_line_width / 100 * score[0])
        match.away = Math.ceil(this.basketball_line_width / 100 * score[1])
      })
    }else{
      this.basketball_strat_time = "01'00''"
      this.basketball_line_width = 100
      clearInterval(this.interval_id_b)
    }
  }
  /**
   * @Description 获取圆弧路径 
   * @param {number} time 剩余时间毫秒
   * @param {undefined} undefined
  */
  get_path_d(time){
    let angle = (1 - this.to_fixed(time % 60000 / 60000)) * 360
    let width = 3.4
    let width_half = width / 2
    let r = 50 - width_half
    let x = this.to_fixed(Math.sin(angle * 0.01745) * r + 50)
    let y = this.to_fixed(50 - Math.cos(angle * 0.01745) * r)
    let is_big = angle > 180 ? 0 : 1
    // A参数详解
    // 半轴长度 
    // 半轴长度
    // 椭圆相对于坐标系的旋转角度，角度数而非弧度数
    // 标记绘制大弧(1) 还是小弧(0)
    // 标记向顺时针(1) 还是逆时针(0) 方向绘制
    // 圆弧终点的坐标x
    // 圆弧终点的坐标y
    return `M ${x} ${y} A ${r} ${r} 0 ${is_big} 1 50 ${width_half}`
  }
  /**
   * @Description 保留三位小数 
   * @param {number} 数字
   * @param {number} 
  */
  to_fixed(number){
    return parseInt(number * 1000) / 1000
  }
 
}