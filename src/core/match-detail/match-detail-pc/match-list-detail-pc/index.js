


import PageSourceData  from  "src/core/page-source-pc/page-source-pc.js"

/**
 * PC  列表 和 详情  之间的 数据中间件 
 */

class  MatchListDetailMiddleware{


    constructor(){

        // 前一个 详情 赛事ID 
        //当前要设置的 最新的 ，或者 就是当前显示的 赛事详情的 赛事 ID 

        // vx_set_vsport_params

        this.vsport_params={}

    }



    /**
     * 设置虚拟体育右侧
     */
     set_vsport_params(data){

        if(data.csid == 1001){
            data.id = data.tid + (data.batchNo || '')
        }else{
            data.id = data.tid + (data.mid || '')
        }
        this.vsport_params = data



    }

        /**
     * @description 常规赛事右侧切换
     * @param {*} cut 列表多行切换  cut   是否 切换右侧详情  true 不切换
     * @param {*} params
     */
        regular_events_set_match_details_params(cut,params){
            if(this.match_details_params_timer){
              clearTimeout(this.match_details_params_timer)
            }
            this.match_details_params_timer = setTimeout(() => {
              if(!cut) this.vx_set_match_details_params(params)
            }, 200);
          }

    /**
    * 设置赛事列表/详情选中赛事
    * @param  {number} remove_mid - 被移除赛事的ID
    * @return {undefined} undefined
    */
    mx_autoset_active_match(params = { mid: 0 }) {
        let {name:route_name,params:cur_parmas} = this.$route


        let return_status = (route_name ==='video' && [3,4,5].includes(+cur_parmas.play_type))  || (route_name ==='details'  && ['studio','topic','anchor'].includes(this.vx_play_media.media_type)) || $menu.menu_data.is_esports
        // 电竞不用调自动切右侧接口
        if(return_status){
          return
        }
  
        /** 非冠军联赛筛选 不调用右侧切换接口 ***********************/
        // 模板 ID
        let match_tpl_number  = $menu.menu_data.match_tpl_number
  
        //非 冠军
        if(match_tpl_number==18){
          let tid = this.mx_filter_select_ids()
  
          // 是联赛筛选
          if(tid){
            return false
          }
  
        }
  
        details.auto_swich_match = true
        let { mid: remove_mid, tid  } = params

        let {   page_source,   from_page_source } =  PageSourceData

 
  
        // 查找参数:1赛事列表，2现场滚球盘，3赛事筛选，4赛事搜索，如果不传，默认赛事列表
        let sm = 1
        if (page_source == "details" && MenuData.cur_menu_type.type_name == "play") {
          sm = 2
        } else if (page_source == "search" || from_page_source == "search") {
          sm = 4
        } else if (this.mx_filter_select_ids()) {
          sm = 3
        }
  
        let csid = 0
  
        if (page_source == "details") {
          let { tid: _tid, csid: _csid } = this.$route.params;
          if (_tid) {
            tid = _tid
            csid = _csid
          } else {
            tid = this.vx_details_params.tid
            csid = this.vx_details_params.csid
          }
  
        } else {
          tid = this.mx_filter_select_ids() || this.vx_details_params.tid
          csid = this.vx_details_params.csid
        }
  
        let md = ""
        if (["early"].includes(MenuData.cur_menu_type.type_name)) {
          md = $menu.match_list_api_params.md
        }
  
        /** 自动选择 */
        let _params = {
          sm,
          euid: $menu.match_list_api_params.euid,
          md,
          csid,
          tid,
          sort: this.vx_match_sort,
          keyword: this.vx_related_keyword.substr(5),
          cuid: UserCtr.get_uid(),
          mid: remove_mid,
        }
  
        // 如果是聚合冠军页面
        if(MenuData.cur_menu_type.type_name == 'winner_top'){
          _params.euid = ''
          delete _params.tid
          delete _params.keyword
          delete _params.md
          delete _params.mid
        }
  
         // 获得当前的模板ID
         let orpt = $menu.menu_data.match_tpl_number
         if(orpt){
          _params.orpt = orpt;
         }
  
        let latest_match_params_cur = JSON.stringify({ ..._params, time: Date.now() })
        // 防止同一请求连续多次发送
        if (latest_match_params_cur != this.latest_match_params_pre ) {
          this.latest_match_params_pre = latest_match_params_cur
  
          let api = page_source == "details" ? api_details.get_fetch_detail_latest_match(_params) : api_details.post_fetch_list_latest_match(_params)
  
          api.then(({ data }) => {
            if(!details.auto_swich_match) return
  
            let { mid = -1, csid: sportId, tid } = _.get(data, "data") || {};
            // 详情时重载页面
            if (page_source == "details" || page_source == 'video') {
              if (mid && mid != -1) {
                if(page_source == "details"){
                  this.$router.push({
                    name: 'details',
                    params: {
                      mid,
                      tid,
                      csid: sportId
                    }
                  })
                }
                // 大视频页面 切换一场有视频的赛事
                else if(page_source == 'video'){
                  video.match_close()
                }
              } else {
                if(_.isFunction(this.back_to)) {
                  this.back_to(false);
                }
              }
              return
            }
  
            // 切换右侧赛事
            let playId = this.vx_details_params.play_id;
            this.vx_set_match_details_params({
              mid,
              tid,
              sportId,
              playId,
              media_type: "auto"
            })
  
          });
        }
      }
    
}