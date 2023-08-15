
// 公共默认配置
const common_template_config = {
  //体育类型区域 自身高0.26 margin top 0.11
  sport_type_space:.26+0.11,
  //联赛上边距 两个联赛的间隔 本来应为0.6 为了把间隙显示出来加了0.002 是为了留间隙
  league_spacing: .06+0.002,
  //联赛高度 理论上是0.397 设置大一点 显示边框
  league_height: .40,
  //时钟区域
  timer_height: 0.30,
  //未开赛标题
  weikaisai_title_space: .266, 
  //投注项区域  对应 match-odds-container 没有子玩法时 match-odds-containe 容器的高度 -  时钟区域 1.4099817961165049-0.2999
  //0.06rem 为match-odds-container 距离头部的间隔  + 0.01 是为了增加间隙
  odd_list_height: 1.110 + 0.06 , 
  //次要玩法头部
  secondary_head: .36,
  //次要玩法投注区域
  secondary_content: 1.109,
};

// 赛果冠军公共配置
const common_champion_config = {
  common: {
    timer_height: 0,
    odd_list_height: 1.13,
  },
  configs: [{
    // 赛果虚拟足球|篮球
    sub_types: [1001,1004],
    params: {
      league_height: .47,
      odd_list_height: 0.91
    }
  }, {
    // 赛果虚拟赛马|赛狗|摩托车
    sub_types: [1002,1011,1010,1009],
    params: {
      league_height: .47,
      odd_list_height: .45
    }
  }]
}

// 对应覆写配置
const common_overwrite_config = {
  // 隐藏联赛头部
  hidden_league: {
    league_spacing: 0,
    league_height: 0
  },
  // 隐藏次要玩法头部
  hidden_secondary: {
    secondary_head: 0,
  },
  // 隐藏开赛标题
  hidden_no_play_title:{
    weikaisai_title_space: 0
  },
  // 联赛折叠
  league_collapse: {
    timer_height: 0,
    odd_list_height: 0,
    secondary_head: 0,
    secondary_content: 0
  },
  // 二级菜单多选(滚球选中全部时)
  sport_type: {
    hidden: {
      sport_type_space: 0
    },
    show: {
      sport_type_space: 0.58
    }
  },
  // 是否显示次要玩法投注区域
  secondary_play: {
    hidden: {
      secondary_content: 0
    },
    // 需结合投注项动态计算
    show: {
      // 波胆玩法高度
      wave: 0.275,
      // 5分钟玩法高度
      five_time: 0.08,
      // 玩法高度
      play_height: 0.32,
      // 默认高度
      default_height: 0.3
    }
  },
  // 热门时间标题例如星期
  time_title: {
    time_title: .41
  }
}

/**
 * @type (3: 今日； 4： 早盘； 100： 冠军； 30： 竞足； 28： 赛果;)
 */
const template_config = {
  // 标准版配置
  standard: {
    source_data: [
      {
        // 主要赛事模板配置参数
        types: [3, 4, 30],
        common: null,
        configs: []
      },
      {
        // 赛果、冠军模板配置参数
        types: [100, 28],
        ...common_champion_config
      }
    ],
    ...common_overwrite_config
  },
  // 简单版配置
  simple: {
    source_data: [ 
      {
        // 主要赛事模板配置参数
        types: [3, 4, 30],
        common: {
          timer_height: 0,
          secondary_head: 0,
          secondary_content: 0,
          odd_list_height: 1.0197 + 0.06,
        },
        configs: []
      },
      {
        // 赛果、冠军模板配置参数
        types: [100, 28],
        ...common_champion_config
      }
    ],
    ...common_overwrite_config
  },
  // 商户定制化配置
  merchant: [{

  }]
}

const get_template_config = (config) => {
  // 赛事信息
  const { app_type, mid, menu_type, is_show_league, is_show_secondary_head, show_secondary_play_list, number_of_bets,
    is_collapse, is_show_no_play, show_sport_type, is_show_time_title, invok_source, sub_menu_type } = config
  
  // 对应覆写配置
  const { source_data, hidden_league, hidden_secondary, hidden_no_play_title, league_collapse, 
    sport_type, secondary_play, time_title } = template_config[app_type]

  //  最终结果
  const result = { mid, ...common_template_config }
  
  const source_config = source_data.find(t => t.types.includes(menu_type))
  
  if (source_config) {
    const { common, configs } = source_config
    // 匹配上获取对应球种配置
    if (configs.length < 1) return
    const sub_config = configs.find(t => t.sub_types.includes(sub_menu_type))
    if (sub_config) Object.assign(result, common, sub_config)
  }

  // 是否隐藏联赛头部
  !is_show_league && Object.assign(result, hidden_league)

  // 是否隐藏次要玩法头部
  !is_show_secondary_head && Object.assign(result, hidden_secondary)

  // 是否折叠赛事
  is_collapse && Object.assign(result, league_collapse)

  // 是否显示未开赛标题
  !is_show_no_play && Object.assign(result, hidden_no_play_title)

  // 二级菜单多选(滚球选中全部时)
  const sport_type_config =  !show_sport_type ? sport_type[hidden] : ['home_hot_page_schedule'].includes(invok_source) ? sport_type[show] : null
  Object.assign(result, sport_type_config)

  // 是否显示次要玩法投注区域
  let secondary_content = 0
  if (show_secondary_play_list) {
    const { wave, five_time, play_height, default_height } = secondary_play[show]
    secondary_content = default_height
    // 波胆玩法动态高度计算
    if ([18, 19].includes(+show_secondary_play_list)) {
      if (number_of_bets) {
        // 公共高度
        const target_height = number_of_bets * play_height
        // 18 波胆玩法； 19 15分玩法
        const height = target_height + show_secondary_play_list == 18 ? wave : five_time 
        // 保留小数点两位数
        secondary_content = Math.floor(height * 100) / 100;
      }
    }
  }
  Object.assign(result, { secondary_content })

  // 热门时间标题例如星期
  is_show_time_title && Object.assign(result, time_title)

  return result
}
