/**
 * 虚拟赛事 视频相关处理
 */

import VSport from "./vsport-class"
import lodash from 'lodash'
import Vue, { ref } from 'vue'
import store from "src/store-redux/index.js";
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"

const again_total = ref(0)
const current_match = ref({})
const api_video_params = ref({})
const is_video_playing = ref(false)
const procee_again_timer = ref(null)
const no_process_data_p_key = ref('')
const video_by_api_cache_key = ref('')
const no_video_data_invoke_match_data_count = ref(0)

/**
* @description 获取到视频进程接口
* @param  {Array} msc
* @return {object}
*/

export const video_process_init_video = (msc = [], is_init = false) => {
  let vsports = null
  const state = store.getState()
  if (state.get_video_process_data) {
    let p_data_detail = state.get_video_process_data.detail;
    let detail_copied = lodash.cloneDeep(p_data_detail);
    if (detail_copied && detail_copied[match.mid]) {
      Object.assign(match, detail_copied[match.mid]);
      if (vsports) {
        vsports.destroy();
      }
      vsports = new VSport(match, res => {
        match.show_time = res.show_time;
        match.match_status = res.match_status;

        //当赛事结束,检查所有赛事是否结束
        if (match.match_status == 2) {
          useMittEmit(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2, match);
        }
        if (match.match_status == 1 || match.match_status == 2) {
          match.mhs = 1;
        }
        //视频时间更新,快进视频到相应的时间点
        if (res.upd == 1) {
          useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, res);
        }
        switch (Number(match.csid)) {
          case 1001:
          case 1004:
            if (res.upd == 1 && res.item_obj) {
              Object.assign(match, res.item_obj);
            }
            break;
          case 1011:
          case 1010:
          case 1002:
          case 1009:
            if (res.upd == 1 && res.item_obj) {
              Vue.set(match, 'upd_data', JSON.stringify(res.item_obj));
            }
            break;
          default:
            break;
        }
      });
    }
  }
}

/**
 * 获取频进程数据
 * @param {Object} match
 */
export const get_match_video_process = (match) => {
  const state = store.getState()
  let video_process_obj = null
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
        if(video_process_obj && video_process_obj.destroy){
          video_process_obj.destroy();
        }
        video_process_obj = new VSport(match,res => {
          match.show_time = res.show_time;
          match.match_status = res.match_status;
          Vue.process_changing_match = match;

          //当赛事结束,检查所有赛事是否结束
          if(match.match_status == 2){
            is_video_playing.value = false;
            useMittEmit(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2,match);
          }
          if(match.match_status > 0){
            match.mhs = 1;
          }
          //视频时间更新,快进视频到相应的时间点
          if(res.upd == 1){
            useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA,res);
          }
          switch (Number(match.csid)) {
            case 1001:
            case 1004:
              if(res.upd == 1 && res.item_obj){
                Object.assign(match,res.item_obj);
              }
              break;
            case 1011: // 赛马
            case 1010: // 摩托车
            case 1002: // 赛狗
              if(res.upd == 1 && res.item_obj){
                Vue.set(match,'upd_data', JSON.stringify(res.item_obj));
              }
              break;
            default:
              break;
          }
        });
        useMittEmit(MITT_TYPES.EMIT_CURRENT_VIDEO_PROCESS_INITED,state.get_video_process_data);
      }
    }
  }
}

/**
 * 生成视频进程接口请求缓存key
 */
export const gen_video_api_cache_key = () => {
  let {sub_menu_type,current_league,current_batch} = state;
  if(!sub_menu_type || !current_league || !current_batch) {
    return {};
  }
  let params = {
    csid:sub_menu_type,
    tid:current_league.menuId,
    batchNo:current_batch.batchNo
  };
  video_by_api_cache_key.value = `${params.csid}-${params.tid}-${params.batchNo}`;
  return params;
}

/**
  * 获取赛事视频进程数据
  * @param {Undefined} Undefined
  * @param {Function} success_cb
  * @param {String|Booelan} is_no_match_data
  * @return {Undefined} Undefined
  */
export const  get_video_process_by_api = (success_cb,is_no_match_data) => {
  let params = gen_video_api_cache_key();
  if(!params.csid) return;
  if(current_match.value.orderNo){
    params.orderNo = current_match.value.orderNo;
    video_by_api_cache_key.value += `-${params.orderNo}`;
  }
  api_video_params.value = params;
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
          no_process_data_p_key.value = video_by_api_cache_key.value;
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
export const get_video_process_by_api_again = (success_cb) => {
  again_total.value++;
  if(again_total.value > 10){
    again_total.value = 0;
    clearTimeout(procee_again_timer.value);
    useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
    if(no_video_data_invoke_match_data_count.value < 1){
      no_video_data_invoke_match_data_count.value++;
    }
    return;
  }
  clearTimeout(procee_again_timer.value);
  procee_again_timer.value = setTimeout(() => {
    if(no_process_data_p_key.value){
      //切换赛事后参数不一样停止请求数据
      if(video_by_api_cache_key.value != no_process_data_p_key.value){
        again_total.value = 0;
        return;
      }
      let params = api_video_params.value;
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
    clearTimeout(procee_again_timer.value);
  },1000);
}

export { is_video_playing }