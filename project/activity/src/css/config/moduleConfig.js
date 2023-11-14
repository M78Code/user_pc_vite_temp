
const config = {
  global: {
    layout: {
      temp: 1,
    },
  },
  // 头部区域
  header: {
    show: false, //显示隐藏
    logo: {
      show: false, //logo显隐
      url_day: "",
      url_night: "",
    },
    navList: {
      show: false, //navList显隐
      nav_list: [1, 2, 3, 4, 5, 6, 7], //navList需要显示的id
    },
    // 头部右侧区域
    rightAd: {
      show: false, //显隐
      ad_url: "",
    },
  },
  // 菜单区域
  menu: {
    show: false, //显隐
    temp:1,    ////模板1,以后可能会开发多种模板
    bet_record: {
      // 投注记录
      show: true, // 投注记录显隐
      un_settled: true, // 未结算显隐
      settled: true, // 已结算显隐
      book: true, // 预约显隐
    },
    in_plays: true, //"滚球赛事",
    match_hot: true, //热门赛事
    match_winner:true, //冠军
    virtual_sports:true, //vr体育
    sport_menu: {
      //体育菜单
      show: false, //显隐
      today_early_btn: {
        // 今日早盘按钮
        show: true, //显隐
        temp: 1, //模板1,以后可能会多种组件
      },
    },
    bet: {  //投注
      temp:1 ,  //投注模板
      single_mix_btn: true, // 单关串关切换按钮
      single_merge: true, // 单关合并功能
      bet_btn: true, // 投注按钮
      cancel_bet: true, // 取消投注
    },
  },
  // 中间列表区域
  main:{
    notice:true,  //公告显隐
    match:{
      collect_btn: true, //收藏
      soon_btn: true,   //近期开赛
      sort_btn:true,    //排序
      refresh_btn: true,  //刷新 
      laguage_btn: true,  //语言切换
      theme_btn: true,  //背景色切换 
      area_Btn: true,  //欧洲盘香港盘切换
    },
      // 列表区域
  list: {
    config:{ //列表区域公共配置
      
      css:{  //列表公共css配置
        fontSize:'',
        fontWeight:'',
      }

    },
    sportId_1: {  // 足球
      rangqiudaxiao: {  //让球大小
       
      },
      bodan: {  //波胆
       
      },
      fifteen_minutes: {  //15分钟
       
      },
      half_full_court: {  //半/全场
       
      },
      danshuang: {   //单双
       
      },

      jinqiuqujian: {  //进球区间
       
      },
      jiaoqiu: {  //角球
       
      },
      faqiu: {  //罚球
       
      },
      guanjun: {  //冠军
       
      },
    },
  },
  },
   //  kyrie总结的  详情
   details: {
    show: true, // 是否显示
    expandCollapseButton: {  // 展开收起按钮
        show: true, // 是否显示
        color: '#666', // 颜色
        width: '15px', //宽度
        height: '15px', //高度
        iconUrl: '', //icon配置url地址
        prompText1: '展开', // 提示文字1
        prompText2: '收起' // 提示文字2
    },
    topButton: {  // 置顶按钮
        show: true, // 是否显示
        color: '#666', // 颜色
        width: '15px', //宽度
        height: '15px', //高度
        topIconUrl: '', //置顶url
        notTopIconUrl: '', //不置顶url
        prompText1: '展开', // 提示文字1
        prompText2: '收起' // 提示文字2
    },
    matchAnalysisButton: {  // 赛事分析按钮按钮
        show: true, // 是否显示
        color: '#666', // 颜色
        width: '15px', //宽度
        height: '15px', //高度
        iconUrl: '', //icon配置url地址
        tipTitle: '赛事分析', // 提示文字
    },
    showScoreColumnButton: {// 显示比分栏
        show: true, // 是否显示
        color: '#666', // 文字颜色
        width: '15px', //宽度
        height: '15px', //高度
        text: '显示比分栏', // 按钮文字
    },
    handicapStatus: { // 盘口状态 正常 关盘 锁盘 封盘
        closeIconUrl: '', // 关盘url
        lockIconUrl: '', // 锁盘url
        closureIconUrl: '', // 封盘url
    }


},
// 大屏
bigScreen: {
    show: true, // 是否显示
}
};
