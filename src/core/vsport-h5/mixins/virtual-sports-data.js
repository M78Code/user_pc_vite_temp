const virtual_sports_data = {
  /**
   * 获取本地缓存虚拟体育赛事列表
   * @param {String} cache_key 缓存键
   */
  get_local_cache_virtual_match(cache_key) {
    let pre_store_data = {};
    let data_store = sessionStorage.getItem(
      mixins_data.virtual_m_list_data_cache_key
    );
    if (data_store) {
      pre_store_data = JSON.parse(data_store);
    }
    return pre_store_data[cache_key];
  },
  /**
   * 设置缓存
   * @param {Array} match_list 写入缓存的赛事列表
   * @param {String} cache_key 缓存键
   */
  set_local_cache_virtual_match(match_list, cache_key) {
    let pre_store_data = {};
    let data_store = sessionStorage.getItem(
      mixins_data.virtual_m_list_data_cache_key
    );
    if (data_store) {
      pre_store_data = JSON.parse(data_store);
    }
    pre_store_data[cache_key] = match_list;
    sessionStorage.setItem(
      mixins_data.virtual_m_list_data_cache_key,
      JSON.stringify(pre_store_data)
    );
  },
  /**
   * @description: 获取虚拟体育赛事列表
   * @param {Object} params 接口参数
   * @return {String}
   */
  get_virtual_sport_local(is_user_clicked) {
    mixins_data.gen_video_api_cache_key();
    let params = mixins_data.param_generate();
    if (!params) {
      mixins_data.set_virtual_data_loading(0);
      mixins_data.virtual_data_loading = false;
      mixins_data.no_match_list_handle();
      return;
    }
    if (is_user_clicked != "is_user_refreshing") {
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING, true);
      mixins_data.virtual_match_list = [];
      mixins_data.match_list_by_no = [];
      mixins_data.no_title_list = [];
      mixins_data.virtual_data_loading = true;
    }
    api_v_sports
      .get_virtual_sport_list(params)
      .then((res) => {
        mixins_data.virtual_data_loading = false;
        useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING, false);
        mixins_data.set_virtual_data_loading(0);
        useMittEmit(MITT_TYPES.EMIT_IS_FIRST_LOADED);
        useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED);

        if (res.code == 200 && res.data && res.data.length) {
          mixins_data.virtual_match_list = mixins_data.append_result_fields(
            res.data
          );
          mixins_data.check_next_no_start_time();
          mixins_data.no_title_list = mixins_data.virtual_match_list.map(
            (m) => {
              let { no, mmp, batchNo } = m;
              m.matchs.forEach((match_item) => {
                if (match_item.homeScore) {
                  match_item.home = match_item.homeScore;
                }
                if (match_item.awayScore) {
                  match_item.away = match_item.awayScore;
                }
              });
              return {
                no,
                mmp,
                batchNo,
                match: m.matchs,
              };
            }
          );

          if (is_user_clicked) {
            mixins_data.is_user_switch_league = Math.random();
          }
          mixins_data.get_ol_dictionary();
          //赛马赛狗赛 摩托车事初始化
          if ([1002, 1011, 1010, 1009].includes(mixins_data.sub_menu_type)) {
            let found = res.data[0];
            if (found) {
              let c_match = mixins_data.append_init_fields(found.matchs[0]);
              let server_now = mixins_data.get_now_server();
              c_match.start_now_sub = Number(c_match.mgt) - server_now;
              mixins_data.current_match = c_match;
              mixins_data.set_current_mid(mixins_data.current_match.mid);
            }
          }
        } else {
          mixins_data.virtual_match_list = [];
          mixins_data.match_list_by_no = [];
        }
        mixins_data.match_list_is_empty =
          !mixins_data.virtual_match_list.length;
        if (mixins_data.match_list_is_empty) {
          mixins_data.current_match = {};
          mixins_data.virtual_m_list_no_data_();
        } else {
          if (!mixins_data.current_league) return;
          let p_key = `${mixins_data.sub_menu_type}-${mixins_data.current_league.menuId}`;
          let match_list_map = _.cloneDeep(mixins_data.get_prev_v_sports);
          if (!match_list_map) match_list_map = {};
          match_list_map[p_key] = _.cloneDeep(mixins_data.virtual_match_list);
          mixins_data.set_prev_v_sports(match_list_map);
          mixins_data.no_virtual_match = false;

          //选中上次选择的期
          let curr_batch = mixins_data.current_batch,
            found_batch_i = 0;
          if (!curr_batch) {
            curr_batch = mixins_data.virtual_match_list[0];
          }
          let found_batch = mixins_data.virtual_match_list.filter(
            (cu, cu_i) => {
              if (cu.batchNo == curr_batch.batchNo) {
                found_batch_i = cu_i;
                return true;
              }
              return false;
            }
          )[0];
          if (!found_batch) {
            found_batch = mixins_data.virtual_match_list[0];
          }
          mixins_data.sub_nav_changed({
            nav: found_batch,
            i: found_batch_i,
          });
        }
        mixins_data.is_reset_tab_i = Math.random();
      })
      .catch((e) => {
        mixins_data.virtual_data_loading = false;
        useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING, false);
        mixins_data.set_virtual_data_loading(0);
        useMittEmit(MITT_TYPES.EMIT_IS_FIRST_LOADED);
        useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED);

        mixins_data.virtual_match_list = [];
        mixins_data.match_list_by_no = [];
        mixins_data.match_list_is_empty = true;
        mixins_data.current_match = {};
        mixins_data.virtual_m_list_no_data_();
        mixins_data.is_reset_tab_i = Math.random();
      });
  },
  /**
   * 虚拟篮球更新下一期赛事  当有滚球和赛前 此时选中赛前不调用
   */
  v_basket_ball_update_n() {
    let params = mixins_data.param_generate();
    if (!params) return;
    api_v_sports
      .get_virtual_sport_list(params)
      .then((res) => {
        if (res.code == 200 && res.data && res.data.length) {
          mixins_data.virtual_match_list = mixins_data.append_result_fields(
            res.data
          );

          if (
            mixins_data.current_match.mmp == "INGAME" &&
            res.data.length < 2
          ) {
            return;
          }
          mixins_data.no_title_list = mixins_data.virtual_match_list.map(
            (m) => {
              let { no, mmp, batchNo } = m;
              m.matchs.forEach((match_item) => {
                if (match_item.homeScore) {
                  match_item.home = match_item.homeScore;
                }
                if (match_item.awayScore) {
                  match_item.away = match_item.awayScore;
                }
              });
              return {
                no,
                mmp,
                batchNo,
                match: m.matchs,
              };
            }
          );
          if (
            mixins_data.no_title_list &&
            mixins_data.no_title_list.length > 1
          ) {
            mixins_data.is_basket_ball_next_no = Math.random();
          }
        }
      })
      .catch((e) => {
        mixins_data.virtual_data_loading = false;
      });
  },
  /**
   * 篮球滚球开赛后10秒获取下一期篮球
   */
  get_next_pre_basketball() {
    clearTimeout(mixins_data.get_next_basketball_time);
    mixins_data.get_next_basketball_time = setTimeout(() => {
      let params = mixins_data.param_generate();
      if (!params) return;
      if (
        mixins_data.current_batch.mmp == "PREGAME" &&
        mixins_data.no_title_list.length == 2
      )
        return;
      api_v_sports
        .get_virtual_sport_list(params)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.length) {
            mixins_data.virtual_match_list = mixins_data.append_result_fields(
              res.data
            );
            if (
              mixins_data.current_match.mmp == "INGAME" &&
              res.data.length == 1 &&
              res.data[0].mmp == "PREGAME"
            ) {
              useMittEmit(MITT_TYPES.EMIT_FORCE_END_PLAYING_BASKETBALL);
              return;
            }
            mixins_data.no_title_list = mixins_data.virtual_match_list.map(
              (m) => {
                let { no, mmp, batchNo } = m;
                m.matchs.forEach((match_item) => {
                  if (match_item.homeScore) {
                    match_item.home = match_item.homeScore;
                  }
                  if (match_item.awayScore) {
                    match_item.away = match_item.awayScore;
                  }
                });
                return {
                  no,
                  mmp,
                  batchNo,
                  match: m.matchs,
                };
              }
            );
            // if(mixins_data.no_title_list && mixins_data.no_title_list.length > 1){
            //   mixins_data.is_basket_ball_next_no = Math.random();
            // }
            mixins_data.is_basket_ball_next_no = Math.random();
          }
        })
        .catch((e) => {
          mixins_data.virtual_data_loading = false;
        });
    }, 1000 * 10);
  },
  /**
   * 附加赛果到赛事列表
   * @param {Array} result_list 赛果数据
   * @param {Array} match_list_source 需要更新的赛事数据
   */
  append_match_result(result_list, match_list_source) {
    if (result_list && result_list.length && match_list_source.length) {
      result_list.forEach((match) => {
        match.forEach((hp) => {
          hp.hl.forEach((hl_item) => {
            hl_item.ol.forEach((ol_item_0) => {
              match_list_source.forEach((no_title_source) => {
                if (!no_title_source.matchs || !no_title_source.matchs.length) {
                  return;
                }
                no_title_source.matchs.forEach((match_source) => {
                  if (!match_source.hps || !match_source.hps.length) {
                    return;
                  }
                  match_source.hps.forEach((hp_source) => {
                    if (!hp_source.hl || !hp_source.hl.length) {
                      return;
                    }
                    hp_source.hl.forEach((hl_item_source) => {
                      if (!hl_item_source.ol || !hl_item_source.ol.length) {
                        return;
                      }
                      hl_item_source.ol.forEach((ol_item_source) => {
                        if (ol_item_0.oid == ol_item_source.oid) {
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
  },
  /**
   * 虚拟体育赛事接口未获取到数据处理
   */
  virtual_m_list_no_data_() {
    if (!mixins_data.current_league) {
      mixins_data.no_match_list_handle();
      return;
    }

    let p_key = `${mixins_data.sub_menu_type}-${mixins_data.current_league.menuId}`;
    //赛事列表
    let match_list = _.cloneDeep(mixins_data.get_prev_v_sports[p_key]);
    if (match_list) {
      match_list.forEach((m) => {
        m.mhs = 11;
      });
      mixins_data.virtual_match_list = match_list;
      mixins_data.sub_nav_changed({
        nav: _.cloneDeep(mixins_data.virtual_match_list[0]),
        i: 0,
      });
    } else {
      mixins_data.no_match_list_handle();
      return;
    }
    //当前赛事
    let match = _.cloneDeep(mixins_data.get_prev_v_sports_params[p_key]);
    if (match) {
      match.match_status = 2;
      mixins_data.is_video_playing = false;
      mixins_data.current_match = _.cloneDeep(match);
      if (match_list && match_list.length) {
        let params = { mids: match.mid };
        api_v_sports
          .get_virtual_match_result(params)
          .then((res) => {
            mixins_data.skeleton = false;
            if (res.code == 200) {
              let result_list = res.data;
              mixins_data.append_match_result(
                result_list,
                mixins_data.match_list_by_no
              );
              useMittEmit(
                MITT_TYPES.EMIT_MATCH_RESULT_DATA_LOADED,
                result_list
              );
            }
          })
          .catch((err) => {
            mixins_data.skeleton = false;
          });
      }
    }
  },
};
export default virtual_sports_data
