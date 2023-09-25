/*
 * @Author: Cable
 * @Date: 2020-07-31 16:14:55
 * @Description: 右侧视频播放 控制栏组件
 */

// import { mapActions, mapGetters } from "vuex";
import sport_icon from "project_path/image/common/png/sport_icon.png";
import video from "src/core/video/video.js"
import details from "src/core/match-list-pc/details-class/details.js"
import store from "src/store-redux/index.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";
export default {
  components: {
    "sport-icon": sport_icon
  },

  props: {
    match_info: Object, //赛事详情
    icons_right:Number
  },

  data() {
    return {
      thumb_style2: {},//赛事列表滚动条样式
      height0: '100%',//战队信息盒子高度初始高度
      height1: '216px',//有视频的赛事列表滚动区域高度
      team_height: this.height0,//战队信息盒子高度
      videos: [],//有视频的赛事列表
      is_hover: false,//视频icon是否hover
       // 菜单数据
       menu_data:MenuData,
    }
  },
  computed: {
    // ...mapGetters({
    //   //视频播放类型
    //   vx_play_media: "get_play_media",
    //   //全局点击事件
    //   get_global_click: 'get_global_click',
    //   // 左侧详情参数
    //   vx_details_params: "get_match_details_params",
    //    //是否展开多列玩法
    //   get_unfold_multi_column:"get_unfold_multi_column",
    //   // 是否显示联赛筛选框
    //   vx_show_filter_popup: "get_show_filter_popup",
    //   //全局开关
    //   get_global_switch:'get_global_switch',
    //   //多语言
    //   lang: "get_lang",
    //   //视频是否展开状态
    //   vx_get_is_fold_status:'get_is_fold_status'
    // }),
    /**
     * @Description:视频按钮是否显示
     * @return {boolean} 
     */
    video_btn_show() {
      return this.match_info.mms == 2 && this.$utils.get_match_status(this.match_info.ms) == 1
    },
    /**
     * @Description:动画按钮是否显示
     * @return {boolean} 
     */
    animation_btn_show() {
      return this.match_info.mvs > -1
    },
    /**
     * @Description:演播室按钮是否显示
     * @returns 
     */
     studio_btn_show() {
      return this.match_info.lvs  == 2 && this.match_info.lss === 1 && ['zh','tw'].includes(this.lang)
    },
     /**
     * @Description:演播室按钮是否显示
     * @returns 
     */
      topic_btn_show() {
        return this.match_info.lvs  == 2 && this.match_info.lss === 0  && ['zh','tw'].includes(this.lang) && this.$utils.get_match_status(this.match_info.ms) !== 1
      }
  },
  watch: {
    //赛事改变
    // "match_info.mid"() {
    //   this.get_videos()
    // },
    //赛事开赛
    // "match_info.mms": {
    //   handler() {
    //     this.get_videos()
    //   }
    // },
    //切换赛事列表盒子高度改变
    team_height(res) {
      if (res == this.height1) {
        this.get_videos()
      }
    },
    //全局点击事件
    get_global_click() {
      this.team_height = this.height0
      this.is_show_content = false
    }
  },

  created() {
   /*  
   let thumb_style2 = _.cloneDeep(this.thumb_style)
    thumb_style2.width = '8px'
    thumb_style2.right = '4px' 
    this.thumb_style2 = thumb_style2
  */
    Object.assign(this.thumb_style2, {
      width: '8px',
      right: '4px'
    });    
    this.get_videos()
  },

  methods: {
    // ...mapActions({
    //   // 视频置顶开关
    //   set_isTop: "set_isTop",
    //   // 视频播放信息
    //   vx_set_play_media: "set_play_media",
    //   // ---未使用
    //   vx_set_video_init: "set_video_init",
    //   // ---未使用
    //   set_right_zoom: "set_right_zoom",
    //   // 赛事详细参数（赛事/联赛/球类/直播类型）
    //   vx_set_match_details_params: "set_match_details_params",
    //   //收起右侧详情 展开多列玩法
    //   set_unfold_multi_column:"set_unfold_multi_column",
    //   // 设置获取视频是否展开状态
    //   vx_set_is_fold_status: "set_is_fold_status"
    // }),
    /**
    * @Description:切换视频
    * @param {string} match 赛事信息
    */
    switch_video(match) {
      this.team_height = this.height0
      if (match.mid == this.match_info.mid) return

      let { mid, tid, csid: sportId } = match;
      let play_id = this.vx_details_params.play_id;
      this.vx_set_match_details_params({
        mid,
        tid,
        sportId,
        play_id,
        media_type: this.vx_play_media.media_type,
        category: this.$route.name == 'details' ? 1 : 0
      });
      if(this.$route.name == 'details'){
        this.$router.push({
          name: 'details',
          params: {
            mid,
            tid,
            csid:sportId
          }
        })
      }
    },
    /**
     * @Description:切换赛事列表弹层
     * @return {undefined} undefined
     */
    toggle_item() {
      // 如果右侧视频区是折叠，则会展开
      if(!this.vx_get_is_fold_status) {
        this.vx_set_is_fold_status(!this.vx_get_is_fold_status)
      }
      if (!['video','animation','studio','anchor','topic'].includes(this.vx_play_media.media_type) || !this.vx_get_is_fold_status) {
        this.team_height = this.height0
        return
      }
      this.team_height = this.team_height == this.height1 ? this.height0 : this.height1
    },
    /**
     * @Description:获取有视频的赛事列表
     * @return {undefined} undefined
     */
    get_videos() {
      video.get_videos( res =>{
        this.videos = res
        let index = details.get_match_index(this.match_info.mid,res)
        //当前选择赛事不在可见区域时 滚动到可见区域 
        if(index > 4){
          this.$nextTick(()=>{
            let top = (index - 3) * 36
            this.$refs.match_scroll_area && this.$refs.match_scroll_area.setScrollPosition(top,0)
          })
        }
      })
    },
    /**
    * @Description:切换视频或动画
    * @param {string} media_type 切换类型
    */
    toggle_play_media(media_type) {
      // 如果右侧视频区是折叠，则会展开
      if(!this.vx_get_is_fold_status) {
        this.vx_set_is_fold_status(!this.vx_get_is_fold_status)
      }
      let { mms, mvs, mid,lvs =-1, lss =-1 } = this.match_info
      let { mid: play_mid, media_type: play_media_type } = this.vx_play_media

      // 当前已在播放了 则不在重新加载
      if (mid != play_mid || (mid == play_mid && media_type != play_media_type)) {

        if (
          (media_type == "video" && mms == 2) ||
          (media_type == "animation" && mvs > -1) || 
          (media_type == "studio" && lvs  == 2 && lss === 1) || 
          (media_type == "topic" && lvs  == 2 && lss === 0) || 
          media_type == 'info'
        ) {
          if(media_type == 'info'){
            details.sync_mst(mid)
          }
          
          // 专题视频切换其他媒体类型前 通知子iframe记录当前播放时间
          if (play_media_type === 'topic') {
            video.send_message({
              cmd: 'record_play_info',
              val: {
                record_play_time: true
              }
            })
          }

          clearTimeout(this.set_play_media_timer)
          this.set_play_media_timer = setTimeout(() => {
            {
              mid,
              media_type,
              time
            }
            store.dispatch({
              type: 'SET_PLAY_MEDIA',
              data: { media_type, mid, time: Date.now() }
            });
          }, 50)

        }
      }

    },
    /**
    * @Description:视频进入全屏
    */
    full_screen(){
      // 根据icon获取数据源类型
      let play_type = this.$utils.get_media_icon_index(this.vx_play_media.media_type)
      video.full_screen(this.match_info,play_type)
    }
  },
  destroyed() {
    clearTimeout(this.set_play_media_timer)
    this.set_play_media_timer = null
  }
};