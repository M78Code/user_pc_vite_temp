/*
 * @Description: 用户信息金额
 */
const initialState = {
  amount:10000000,
  // 用户信息,用户金额,userId,语言 需要监听变化
  user: {
    "activityId": "10007,10008,10010",
    "activityList": [
      {
        "activityId": "10007",
        "endTime": null,
        "h5Url": "",
        "id": "4",
        "inEndTime": "0",
        "inStartTime": "1666779142601",
        "maintainStatus": null,
        "name": "每日任务",
        "pcUrl": "",
        "period": 2,
        "startTime": null,
        "status": 1,
        "type": 2
      },
      {
        "activityId": "10008",
        "endTime": null,
        "h5Url": "",
        "id": "5",
        "inEndTime": "0",
        "inStartTime": "1666779147371",
        "maintainStatus": null,
        "name": "成长任务",
        "pcUrl": "",
        "period": 2,
        "startTime": null,
        "status": 1,
        "type": 2
      },
      {
        "activityId": "10010",
        "endTime": null,
        "h5Url": "group1/M00/15/C2/CgURtmJGfTmAfLG-AAChk0JTn7o692.png",
        "id": "9999",
        "inEndTime": "0",
        "inStartTime": "1647263209000",
        "maintainStatus": null,
        "name": "老虎机活动",
        "pcUrl": "group1/M00/15/C3/CgURtWJGfT-ABbXtAAA2DscP7Dg590.png",
        "period": 2,
        "startTime": null,
        "status": 1,
        "type": 2
      }
    ],
    "addition2": "",
    "callbackUrl": "http://user-pc-entry.sportxxxw1box.com/#/",
    "chatRoomSwitch": 0,
    "configVO": {
      "appDefault": 1,
      "bannerUrl": "",
      "bookBet": 1,
      "bookMarketSwitch": 1,
      "bookMarketSwitchBasketball": 1,
      "compatLogoUrl": "group1/M00/18/66/CgURtWPZ-w6ADvGrAAAhd_KDBb8463.png",
      "configMap": {
        "1": "group1/M00/18/65/CgURtmPZ-viAKT7gAACYlgCrhNA555.png",
        "2": "group1/M00/18/66/CgURtWPZ-vGABdMYAACYlgCrhNA414.png"
      },
      "filterLeague": "",
      "filterSport": "",
      "h5Default": 2,
      "inlineWidth": null,
      "leagueLogoUrl": "",
      "loadLogoUrl": "",
      "marketConfigKey": "reservedBettingSwitch",
      "marketConfigValue": 1,
      "marketDefault": 1,
      "maxSeriesNum": 10,
      "minSeriesNum": 2,
      "nociceTag": 1,
      "pcLogoUrl": "group1/M00/18/66/CgURt2PZ-wmAUxVZAAAhd_KDBb8965.png",
      "profesTag": 1,
      "standardTag": 2,
      "title": "PM体育-亚洲在线体育竞猜投注",
      "titleMap": {
        "tw": "PM體育-亞洲在線體育競猜投注",
        "vi": "Thể thao PM - Nhà cái cá cược thể thao trực tuyến Châu Á",
        "th": "PM Sports - การเดิมพันกีฬาออนไลน์ในเอเชีย",
        "en": "PM Sports-Asian Online Gaming Platform",
        "zh": "PM体育-亚洲在线体育竞猜投注"
      },
      "videoLogoUrl": ""
    },
    "cvo": {
      "series": {
        "code": "1",
        "min": 5,
        "qfi": 500,
        "qfo": 200,
        "qon": 10,
        "qsi": 1000,
        "qth": 100,
        "qtw": 50
      },
      "single": {
        "code": "1",
        "min": 10,
        "qfi": 5000,
        "qfo": 2000,
        "qon": 100,
        "qth": 1000,
        "qtw": 500
      }
    },
    "favoriteButton": false,
    "gr": "common",
    "inActivity": true,
    "isNewUser": false,
    "jumpfrom": "zr",
    "jumpsupport": "zr",
    "languageList": "zh,en,tw,vi,th,ms,ad",
    "languageName": "zh",
    "languages": "",
    "loginUrl": "https://sports-pc.ponymuah.com?token=a78e2d06d46051131e052a780e0276858e761f4f&gr=common&tm=1&lg=zh&mk=EU&stm=blue&api=waePaJyIDTPvk8rv0tBlVeDiLz8U7GQGSYtJZq44Rfg=",
    "mId": "2",
    "maintainTime": null,
    "maintaining": false,
    "maintainingContent": "1",
    "maintainingH5Url": "group1/M00/15/01/CgURt2GmD0SAe0k9AAB1adcgZrg854.png",
    "maintainingPCUrl": "group1/M00/15/01/CgURtWGmD0uAQos1AAGvVmeFgFU357.png",
    "maintainingTime": "1638186459784",
    "maintainingTitle": "1",
    "marketLevel": 0,
    "matchId": null,
    "merchantEventSwitchVO": {
      "configKey": "merchantEventSwitch",
      "configValue": "0",
      "cornerEvent": 0,
      "eventSwitch": 0,
      "penaltyEvent": 0
    },
    "nickName": "tyWoSivZzjUs",
    "openEsport": 1,
    "openVrSport": 1,
    "oss": {
      "api": [
        "https://api.sportxxx278gwf4.com"
      ],
      "chatroomHttpUrl": [
        "null"
      ],
      "chatroomUrl": [
        "null"
      ],
      "img": [
        "https://image.gredfged.com"
      ],
      "live_h5": "https://sandboxliveh5.sportxxx13ky.com",
      "live_pc": "https://sandboxlivepc.sportxxx13ky.com",
      "loginUrl": "https://sports-pc.ponymuah.com?token=a78e2d06d46051131e052a780e0276858e761f4f&gr=common&tm=1&lg=zh&mk=EU&stm=blue&api=waePaJyIDTPvk8rv0tBlVeDiLz8U7GQGSYtJZq44Rfg=",
      "loginUrlArr": [
        "https://sports-pc.ponymuah.com?token=a78e2d06d46051131e052a780e0276858e761f4f&gr=common&tm=1&lg=zh&mk=EU&stm=blue&api=waePaJyIDTPvk8rv0tBlVeDiLz8U7GQGSYtJZq44Rfg="
      ]
    },
    "pcs": 0,
    "pullMsgRate": 10,
    "settleSwitch": 1,
    "sportId": null,
    "stm": "",
    "storeFlag": null,
    "tournamentId": null,
    "userBetPrefer": 2,
    "userId": "506797378241100277",
    "userMarketPrefer": "EU",
    "userName": "tyWoSivZzjUs",
    "videoManageVo": {
      "closedWithoutOperation": 0,
      "configKey": "videoControlSwitch",
      "configValue": "0",
      "customViewTime": null,
      "merchantCode": "111111",
      "noBackgroundPlay": 0,
      "videoSettings": 0,
      "videoSwitch": 0,
      "viewingTime": 15
    }
  },
  // 用户令牌信息
  user_token: '',
  // 登录用户的id
  user_logined_id:'',
  // 用户是否长时间未操作
  is_user_no_handle:false,
  // 用户信息数据
  user_info_data: {}
};

export default function userInfoReducer(state = initialState, action) {
  switch (action.type) {
     // 保存用户信息
    case "SET_AMOUNT_INFO":
      // console.error('action.data ',action.data)
      return {...state, amount: action.data };
    default:
      return state
  }
}
