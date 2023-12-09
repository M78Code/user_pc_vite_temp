/*
 * @Author: Cronus
 * @Date: 2021-01-05 21:38:34
 * @Description:
 */
import VSport from "src/public/utils/vsport/vsport.js"
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
export default {
  methods:{
  	// ...mapMutations(['set_video_process_loaded']),
	set_video_process_loaded(data){
		VR_CTR.set_video_process_loaded(data);
	},
    /**
     * 获取赛事比分
     * @param {Object} match 赛事
     * @param {Number} t 赛事进行时间
     * @return {String}
     */
    get_score_match(match){
      let f = 0;
      if(this.get_video_process_data){
        let p_data_detail = this.get_video_process_data.detail;
        let detail_copied = _.cloneDeep(p_data_detail);

        if(detail_copied && detail_copied[match.mid]){
          Object.assign(match,detail_copied[match.mid]);
          if(this.vsports){
            this.vsports.destroy();
          }
          this.vsports = new VSport(match,res => {
            match.show_time = res.show_time;
            match.match_status = res.match_status;

            //当赛事结束,检查所有赛事是否结束
            if(match.match_status == 2){
              this.$root.$emit(this.emit_cmd.EMIT_MATCH_EDNED_STATUS2,match);
            }
            if(match.match_status == 1 || match.match_status == 2){
              match.mhs = 1;
            }
            //视频时间更新,快进视频到相应的时间点
            if(res.upd == 1){
              this.$root.$emit(this.emit_cmd.EMIT_SYNC_VIDEO_DATA,res);
            }
            switch (Number(match.csid)) {
              case 1001:
              case 1004:
                if(res.upd == 1 && res.item_obj){
                  Object.assign(match,res.item_obj);
                }
                break;
              case 1011:
              case 1010:
              case 1002:
              case 1009:
                if(res.upd == 1 && res.item_obj){
                  this.$set(match,'upd_data', JSON.stringify(res.item_obj));
                }
                break;
              default:
                break;
            }
          });
        }
      }

      return f;
    },
    /**
     * 获取到视频进程接口
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    video_process_init_video(){
      this.get_score_match(this.match_item);
    }
  },
  computed:{
	//...mapGetters({
    //  video_process_loaded:'get_video_process_loaded',
    //  sub_menu_type: 'get_curr_sub_menu_type',
    //  current_league:'get_current_league',
    //  current_batch:'get_current_batch',
    //}),
	get_video_process_data(){return VR_CTR.get_video_process_loaded()},
	sub_menu_type(){return ''},
	get_video_process_data(){return VR_CTR.get_current_league()},
	get_video_process_data(){return VR_CTR.get_current_batch()},
  },
  watch:{
    get_video_process_data(){
      this.get_score_match(this.match_item);
    }
  }
}
