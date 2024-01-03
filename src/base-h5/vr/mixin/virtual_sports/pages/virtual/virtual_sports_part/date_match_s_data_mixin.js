/*
 * @Description: 虚拟体育篮球结束时对阵比分组件
 */
import teamImg from 'src/base-h5/vr/components/team_img.vue';

export default {
  props:{
    match_ended:Object,
    source:String,
  },
  components:{
    'team-img':teamImg
  }
}