
import lodash from 'lodash'


    /**
     * @description 虚拟赛事换算走表步长
     * @param match 赛事信息
     * @param step 原来的步长
     * @return 换算后的步长
     */
    export function   match_vr_step(detail_data, step){
        let res = step;
        // 红猫赛事显示倒计时优化(使用每场比赛90分钟进行换算)
        if(lodash.get(detail_data,'cds')=='1500' && lodash.get(detail_data,'csid')==1){
          switch (lodash.get(detail_data,'mle')+'') {
            case '57': // 2 * 4分钟 加中场休息时间4分钟=>按照720秒换算
              res=7.5;
              break;
            case '66': // 2 * 5分钟  加中场休息时间4分钟=>按照840秒换算
              res=6.428571;
              break;
            case '55': //2 * 6分钟 (10.5s累加1分钟)
              res=5.7142;
              break;
            default:
              break;
          }
        } else if(lodash.get(detail_data,'ctt')==1 && [1,2].includes(lodash.get(detail_data,'csid')*1)){
          // 是机器开出的虚拟赛事时,使用atf时间系数换算时间
          // ctt (0 人 1机器)   atf (时间系数)
          res=Number(lodash.get(detail_data,'atf',1))*step;
        }
        return res;
      }