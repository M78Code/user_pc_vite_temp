/**
 * 虚拟赛事 源数据相关处理
 */

import { onMounted } from "vue"
import store from "src/store-redux/index.js";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { gen_video_api_cache_key } from './handle-video'

// TODO: set_virtual_data_loading 顶部菜单信息 store

export const use_virtual_data = (props) => {

  const { menu_list, tab_item_i, propsParams, tab_item_click_handle } = props

  const ol_dictionary = ref([])
  const no_title_list = ref([])
  const match_list_by_no = ref([])
  const no_virtual_match = ref(false)
  const virtual_match_list = ref([])
  const is_user_switch_league = ref(0)
  const virtual_data_loading = ref(false)
  const virtual_m_list_data_cache_key = ref('virtual_m_list_data_cache_key')

  onMounted(() => {
    useMittOn(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA, no_virtual_menu_data);
  })

  /**
     * 生成赛事请求接口参数
     */
  const param_generate = () => {
    let params = null;
    if(menu_list && menu_list[tab_item_i]){
      let league = menu_list[tab_item_i];
      params = {
        tid: league.field1,
        csid: propsParams.csid
      };
    }
    return params;
  }

  /**
   * @description: 虚拟菜单数据未空时的逻辑处理函数
   * @return {*}
   */
  const no_virtual_menu_data = () => {
    store.dispatch({ type: 'set_virtual_data_loading',  data: 0 })
    virtual_data_loading.value= false;
    no_match_list_handle();
  }
  /**
   * @description: 附加初始化赛果result字段
   * @param {Array} match_list 赛事列表
   * @return {String}
   */
  const append_result_fields = (no_title_list) => {
    if(no_title_list && no_title_list.length){
      no_title_list.forEach(no_title => {
        if(!no_title.matchs || !no_title.matchs.length) { return }
        no_title.matchs.forEach(match => {

          if(!match.hps || !match.hps.length) { return }
          match.hps.forEach(hp => {

            if(!hp.hl || !hp.hl.length) { return }
            hp.hl.forEach(hl_item => {

              if(!hl_item.ol || !hl_item.ol.length) {return}
              hl_item.ol.forEach(ol_item => {
                ol_item.result = "";
              });
            });
          });
        });
      });
    }
    return no_title_list
  }
  /**
   * 获取本地缓存虚拟体育赛事列表
   * @param {String} cache_key 缓存键
   */
  const get_local_cache_virtual_match = (cache_key) => {
    let pre_store_data = {};
    let data_store = sessionStorage.getItem(virtual_m_list_data_cache_key.value);
    if(data_store){
      pre_store_data = JSON.parse(data_store);
    }
    return pre_store_data[cache_key];
  }
  /**
   * 设置缓存
   * @param {Array} match_list 写入缓存的赛事列表
   * @param {String} cache_key 缓存键
   */
  const set_local_cache_virtual_match = (match_list,cache_key) => {
    let pre_store_data = {};
    let data_store = sessionStorage.getItem(virtual_m_list_data_cache_key.value);
    if(data_store){
      pre_store_data = JSON.parse(data_store);
    }
    pre_store_data[cache_key] = match_list;
    sessionStorage.setItem(virtual_m_list_data_cache_key.value,JSON.stringify(pre_store_data));
  }
  /**
   * @description: 获取虚拟体育赛事列表
   * @param {Object} params 接口参数
   * @return {String}
   */
  const get_virtual_sport_local = (is_user_clicked) => {
    gen_video_api_cache_key();
    let params = param_generate();
    if(!params) {
      store.dispatch({ type: 'set_virtual_data_loading',  data: 0 })
      virtual_data_loading.value= false;
      no_match_list_handle();
      return;
    }
    if(is_user_clicked != 'is_user_refreshing'){
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,true);
      virtual_match_list.value = [];
      match_list_by_no.value = [];
      no_title_list.value = [];
      virtual_data_loading.value= true;
    }
    api_v_sports.get_virtual_sport_list(params).then(res => {
      virtual_data_loading.value= false;
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
      store.dispatch({ type: 'set_virtual_data_loading',  data: 0 })
      useMittEmit(MITT_TYPES.EMIT_IS_FIRST_LOADED);
      useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED);

      if(res.code == 200 && res.data && res.data.length){
        virtual_match_list.value = append_result_fields(res.data);
        check_next_no_start_time();
        no_title_list.value = virtual_match_list.value.map(m => {
          let {no,mmp,batchNo} = m;
          m.matchs.forEach(match_item => {
            if(match_item.homeScore){
              match_item.home = match_item.homeScore;
            }
            if(match_item.awayScore){
              match_item.away = match_item.awayScore;
            }
          });
          return {
            no,
            mmp,
            batchNo,
            match:m.matchs
          };
        });

        if(is_user_clicked){
          is_user_switch_league.value = Math.random();
        }
        get_ol_dictionary();
        //赛马赛狗赛 摩托车事初始化
        if([1002,1011,1010,1009].includes(this.sub_menu_type)){
          let found = res.data[0];
          if(found){
            let c_match = this.append_init_fields(found.matchs[0]);
            let server_now = this.get_now_server();
            c_match.start_now_sub = Number(c_match.mgt) - server_now;
            this.current_match = c_match;
            this.set_current_mid(this.current_match.mid);
          }
        }
      }
      else{
        virtual_match_list.value = [];
        match_list_by_no.value = [];
      }
      this.match_list_is_empty = !virtual_match_list.value.length;
      if(this.match_list_is_empty){
        this.current_match = {};
        this.virtual_m_list_no_data_();
      }
      else{
        if(!this.current_league) return;
        let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
        let match_list_map = _.cloneDeep(this.get_prev_v_sports);
        if(!match_list_map) match_list_map = {};
        match_list_map[p_key] = _.cloneDeep(virtual_match_list.value);
        this.set_prev_v_sports(match_list_map);
        no_virtual_match.value = false;

        //选中上次选择的期
        let curr_batch = this.current_batch,found_batch_i = 0;
        if(!curr_batch){
          curr_batch = virtual_match_list.value[0];
        }
        let found_batch = virtual_match_list.value.filter((cu,cu_i) => {
          if(cu.batchNo == curr_batch.batchNo){
            found_batch_i = cu_i;
            return true;
          }
          return false;
        })[0];
        if(!found_batch){
          found_batch = virtual_match_list.value[0];
        }
        this.sub_nav_changed({
          nav:found_batch,
          i:found_batch_i
        });

      }
      this.is_reset_tab_i = Math.random();
    }).catch((e) => {
      virtual_data_loading.value= false;
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
      store.dispatch({ type: 'set_virtual_data_loading',  data: 0 })
      useMittEmit(MITT_TYPES.EMIT_IS_FIRST_LOADED);
      useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED);

      virtual_match_list.value = [];
      match_list_by_no.value = [];
      this.match_list_is_empty = true;
      this.current_match = {};
      this.virtual_m_list_no_data_();
      this.is_reset_tab_i = Math.random();
    });
  }

  /**
       * 附加赛果到赛事列表
       * @param {Array} result_list 赛果数据
       * @param {Array} match_list_source 需要更新的赛事数据
       */
  const append_match_result = (result_list,match_list_source) => {
    if(result_list && result_list.length && match_list_source.length){
      result_list.forEach(match => {
        match.forEach(hp => {
          hp.hl.forEach(hl_item => {
            hl_item.ol.forEach(ol_item_0 => {


              match_list_source.forEach(no_title_source => {
                if(!no_title_source.matchs || !no_title_source.matchs.length) { return }
                no_title_source.matchs.forEach(match_source => {

                  if(!match_source.hps || !match_source.hps.length) { return }
                  match_source.hps.forEach(hp_source => {

                    if(!hp_source.hl || !hp_source.hl.length) { return }
                    hp_source.hl.forEach(hl_item_source => {

                      if(!hl_item_source.ol || !hl_item_source.ol.length) {return}
                      hl_item_source.ol.forEach(ol_item_source => {
                        if(ol_item_0.oid == ol_item_source.oid){
                          ol_item_source.result = ol_item_0.result;
                        }
                      });
                    });
                  });
                });
              });

            });
          });
        });
      });
    }
  }
  /**
   * 虚拟体育赛事接口未获取到数据处理
   */
  const virtual_m_list_no_data_  = () => {
    if(!this.current_league) {
      no_match_list_handle();
      return;
    }

    let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
    //赛事列表
    let match_list = _.cloneDeep(this.get_prev_v_sports[p_key]);
    if(match_list){
      match_list.forEach(m => {
        m.mhs = 11;
      });
      virtual_match_list.value = match_list;
      this.sub_nav_changed({
        nav:_.cloneDeep(virtual_match_list.value[0]),
        i:0
      });
    }
    else{
      no_match_list_handle();
      return;
    }
    //当前赛事
    let match = _.cloneDeep(this.get_prev_v_sports_params[p_key]);
    if(match){
      match.match_status = 2;
      this.is_video_playing = false;
      this.current_match = _.cloneDeep(match);
      if(match_list && match_list.length){
        let params = {mids:match.mid};
        api_v_sports.get_virtual_match_result(params).then(res => {
          this.skeleton = false
          if(res.code == 200){
            let result_list = res.data;
            this.append_match_result(result_list,match_list_by_no.value);
            useMittEmit(MITT_TYPES.EMIT_MATCH_RESULT_DATA_LOADED,result_list);
          }
        }).catch((err)=>{
          this.skeleton = false
        })
      }
    }
    //

  }
  /**
   * 未获取到虚拟体育赛事列表设置空数据提醒
   */
  const no_match_list_handle = () => {
    no_virtual_match.value = true;
  }
  /**
   * 检测下一轮开赛时间刷新数据
   */
  const check_next_no_start_time = () => {
    if(virtual_match_list.value && virtual_match_list.value.length > 1){
      let mgt = Number(virtual_match_list.value[1].matchs[0].mgt);
      let now = this.get_now_server();
      let sub = mgt - now;
      //下一轮开赛
      if(sub <= 0){
        if(tab_item_click_handle && typeof tab_item_click_handle === 'function'){
          tab_item_click_handle(this.tab_item_i);
        }
      }
      else{
        clearTimeout(this.timer_super5);
        this.timer_super5 = setTimeout(() => {
          check_next_no_start_time();
        },1000);
      }
    }
  }
  /**
   * 获取投注项字典对象
   */
  const get_ol_dictionary = () => {
    Object.keys(ol_dictionary.value).forEach(k => {
      delete ol_dictionary.value[k];
    });

    if(no_title_list.value && no_title_list.value.length){
      no_title_list.value.forEach(no_title => {

        if(!no_title.match || !no_title.match.length) { return }
        no_title.match.forEach(match => {

          if(!match.hps || !match.hps.length) { return }
          match.hps.forEach(hp => {

            if(!hp.hl || !hp.hl.length) { return }
            hp.hl.forEach(hl_item => {

              if(!hl_item.ol || !hl_item.ol.length) {return}
              hl_item.ol.forEach(ol_item => {
                ol_dictionary.value[ol_item.oid] = ol_item;
              });
            });
          });
        });
      });
    }
  }
}