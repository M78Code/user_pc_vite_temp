/*
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页蓝色背景上的大型字母图标
 */
export default {
  name: "team_img",

  props: {
    type: { // 0 主队  1 客队
      type: Number
    },
    url: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 44
    },
    fr: {
      type: String,
      default: ''
    },
    csid: { // 赛种
      type: String,
      default: ''
    }
  },
};
