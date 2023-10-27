/**
 * 虚拟赛事 视频相关处理
 */


import lodash from 'lodash'
import store from "src/store-redux/index.js";
import VirtualClass from "./virtual-class"
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"

class VirtualVideo {

  constructor () {
    this.again_total = 0
    this.current_match = {}
    this.api_video_params = {}
    this.is_video_playing = false
    this.procee_again_timer = null
    this.no_process_data_p_key = ''
    this.video_by_api_cache_key = ''
    this.no_video_data_invoke_match_data_count = 0
  }

/**
 * 获取频进程数据
 * @param {Object} match
 */
get_match_video_process (match) {
  const state = store.getState()
  if(!match){
    return;
  }
  let got_data = false;
  if(state.get_video_process_data){
    let {batchNo} = match;

    if(state.get_video_process_data.batchNo == batchNo){
      let p_data_detail = state.get_video_process_data.detail;
      let detail_copied = _.cloneDeep(p_data_detail);
      if(detail_copied && detail_copied[match.mid]){
        got_data = true;
        Object.assign(match,detail_copied[match.mid]);
        VirtualClass.destroy();
        VirtualClass.update_match_video_data()
        useMittEmit(MITT_TYPES.EMIT_CURRENT_VIDEO_PROCESS_INITED,state.get_video_process_data);
      }
    }
  }
}

/**
 * 生成视频进程接口请求缓存key
 */
gen_video_api_cache_key () {
  let {sub_menu_type,current_league,current_batch} = state;
  if(!sub_menu_type || !current_league || !current_batch) {
    return {};
  }
  let params = {
    csid:sub_menu_type,
    tid:current_league.menuId,
    batchNo:current_batch.batchNo
  };
  this.video_by_api_cache_key = `${params.csid}-${params.tid}-${params.batchNo}`;
  return params;
}

/**
  * 获取赛事视频进程数据
  * @param {Undefined} Undefined
  * @param {Function} success_cb
  * @param {String|Booelan} is_no_match_data
  * @return {Undefined} Undefined
  */
get_video_process_by_api (success_cb,is_no_match_data) {
  let params = gen_video_api_cache_key();
  if(!params.csid) return;
  if(this.current_match.orderNo){
    params.orderNo = this.current_match.orderNo;
    this.video_by_api_cache_key += `-${params.orderNo}`;
  }
  this.api_video_params = params;
  api_v_sports.get_virtual_video_process(params).then(res => {
    if(res.code == 200){
      if(res.data && res.data.detail && Object.keys(res.data.detail).length){
        if(!is_no_match_data){
          let video_data = _.cloneDeep(res.data);
          store.dispatch({ type: 'SET_VIDEO_PROCESS_DATA',  data: video_data })
          useMittEmit(MITT_TYPES.EMIT_VIDEO_PROCESS_DATA_GOT,res.data);
        }
        if(success_cb){
          success_cb(res.data);
        }
      }
      else{
        if(!is_no_match_data){
          this.no_process_data_p_key = this.video_by_api_cache_key;
          get_video_process_by_api_again(success_cb);
        }
        else{
          success_cb(null);
        }
      }
    }
  });
}

/**
  * 1s后再次获取赛事视频进程数据
  * @param {Undefined} Undefined
  * @return {Undefined} Undefined
  */
get_video_process_by_api_again (success_cb) {
  this.again_total++;
  if(this.again_total > 10){
    this.again_total = 0;
    clearTimeout(this.procee_again_timer);
    useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
    if(this.no_video_data_invoke_match_data_count < 1){
      this.no_video_data_invoke_match_data_count++;
    }
    return;
  }
  clearTimeout(this.procee_again_timer);
  this.procee_again_timer = setTimeout(() => {
    if(this.no_process_data_p_key){
      //切换赛事后参数不一样停止请求数据
      if(this.video_by_api_cache_key != this.no_process_data_p_key){
        this.again_total = 0;
        return;
      }
      let params = this.api_video_params;
      if(!params.csid) return;
      api_v_sports.get_virtual_video_process(params).then(res => {
        let get_data = false;
        if(res.code == 200){
          if(res.data && res.data.detail && Object.keys(res.data.detail).length){
            get_data = true;
            let copied_video = _.cloneDeep(res.data);
            store.dispatch({ type: 'SET_VIDEO_PROCESS_DATA',  data: copied_video })
            useMittEmit(MITT_TYPES.EMIT_VIDEO_PROCESS_DATA_GOT,copied_video);
            if(success_cb){
              success_cb();
            }
          }
        }
        if(!get_data){
          get_video_process_by_api_again();
        }
      });
    }
    clearTimeout(this.procee_again_timer);
  },1000);
}


}

export default new VirtualVideo()
