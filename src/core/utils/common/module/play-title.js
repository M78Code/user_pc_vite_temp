import { i18n_t } from "src/boot/i18n.js";
export const play_title = (title = 'coming song') => {
  return [
    {// 晋级
      title: i18n_t('football_playing_way.promotion'),
      id:3,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'-135,-136',
      hps_key:'hpsPromotion',
      play_id:1005,
    },
    // 冠军
    {
      title: i18n_t('football_playing_way.champion'),
      id:30,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'136',
      hps_key:'hpsOutright',
      play_id:1006,
    },
    { // 角球
      title: i18n_t('football_playing_way.corner'),
      id:1,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'-111,113,-114,-119,-121,-122',
      hps_key:'hpsCorner',// 角球
      play_id:1001,
    },
    {  // 十五分钟玩法
      title: i18n_t('football_playing_way.hps15Minutes'),
      id:17,
      unfold:0,
      show_tab:false,
      hps15Minutes:[{
        hl:[{}]
      }],
      pids:'32,33,34,231,232,233',
      hps_key:'hps15Minutes',// 15分钟
      play_id:1007,
    },
    { // 波胆
      title: i18n_t('football_playing_way.hpsBold'),
      id: 18,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids: "7",
      hps_key:'hpsBold',
      play_id:1008,
    },
    { // 特色组合
      title: i18n_t('football_playing_way.feature'),
      id: 11,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids: "13,101,345,105",
      hps_key:'hpsCompose',
      play_id:1010,
    },
    {// 罚牌
      title: i18n_t('football_playing_way.penalty_cards'),
      id:5,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'310,306,307,311,308,309',
      hps_key:'hpsPunish',// 罚牌
      play_id:1003,
    },
    // 加时
    {
      title: i18n_t('football_playing_way.overtime'),
      id:4,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'-126,-128,-127,-129,-130,-332',
      hps_key:'hpsOvertime', 
      play_id:1002,
    },
    // 点球大战
    {
      title: i18n_t('football_playing_way.penalty_shootout'),
      id:2,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'-333,-334,-335',
      hps_key:'hpsPenalty', 
      play_id:1004,
    },
    // 篮球
    {
      title:  i18n_t('basketball_playing_way.quarter'),
      id:6,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'48,46,45',
      hps_key:'hpsAdd', // 篮球小节玩法
      play_id:2003,
    },
    // 网球
    {
      title: title,
      id:7,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'162,163,164',
      hps_key:'hpsAdd',
      play_id:2003,
    },
    //乒乓球
    {
      title: title,
      id:8,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'175,176,177',
      hps_key:'hpsAdd',
      play_id:2003,
    },
    //斯诺克
    {
      title: title,
      id:9,
      unfold:0,
      show_tab:false,
      hps:[{
        hl:[{}]
      }],
      pids:'184,185,186,190,191',
      hps_key:'hpsAdd',
      play_id:2003,
    },
  ]
}