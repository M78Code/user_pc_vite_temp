/*
 * @Author: Supermark
 * @Date: 2021-02-09 18:15:32
 * @Description: 球类背景图base64类
 */

// 体育赛事的 背景图 集合
const sporting_type = [
  // 足球 1
  {
    B:
      `background: url("${ "image/bw3/jpg/details/football.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 篮球 2
  {
    B:
      `background: url("${ "image/bw3/jpg/details/basketball.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 棒球 3
  {
    B:
      `background: url("${ "image/bw3/jpg/details/baseball.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 冰球 4
  {
    B:
      `background: url("${ "image/bw3/jpg/details/ice_hockey.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 网球 5
  {
    B:
      `background: url("${ "image/bw3/jpg/details/tennis.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 美式足球 6
  {
    B:
      `background: url("${ "image/bw3/jpg/details/american_football.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 斯诺克 7
  {
    B:
      `background: url("${ "image/bw3/jpg/details/snooker_pool.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 乒乓球 8
  {
    B:
      `background: url("${ "image/bw3/jpg/details/ping_pong.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 排球 9
  {
    B:
      `background: url("${ "image/bw3/jpg/details/volleyball.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 羽毛球 10
  {
    B:
      `background: url("${ "image/bw3/jpg/details/badminton.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 手球 11
  {
    B:
      `background: url("${ "image/bw3/jpg/details/handball.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 拳击 12
  {
    B:
      `background: url("${ "image/bw3/jpg/details/boxing.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 沙滩排球 13
  {
    B:
      `background: url("${ "image/bw3/jpg/details/beach_volleyball.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 英式橄榄球 14
  {
    B:
      `background: url("${ "image/bw3/jpg/details/rugby.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 曲棍球 15
  {
    B:
      `background: url("${ "image/bw3/jpg/details/hockey.jpg" }") no-repeat center center/100%  content-box content-box;`
  },
  // 水球 16
  {
    B:
      `background: url("${ "image/bw3/jpg/details/water_polo.jpg" }") no-repeat center center/100%  content-box content-box;`
  }
]
// 电竞类的 图片背景集合
const gaming_type = {
  100: `background: url("${ "image/bw3/jpg/details/details-LOL.jpg" }") no-repeat center center/100%  content-box content-box;`,
  101: `background: url("${ "image/bw3/jpg/details/DOTA.jpg" }") no-repeat center center/100%  content-box content-box;`,
  102: `background: url("${ "image/bw3/jpg/details/CS_GO.jpg" }") no-repeat center center/100%  content-box content-box;`,
  103: `background: url("${ "image/bw3/jpg/details/details-KPL.jpg" }") no-repeat center center/100%  content-box content-box;`,
}
 // 此处空对象请勿删除;
 export default {
   sporting_type,
   gaming_type
 }
