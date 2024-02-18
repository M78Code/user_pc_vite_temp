# 投注模块 

## 投注类

### 1.投注方式
  投注分单关投注和串关投注两种投注类型
    
    1.单关投注
      单关投注又分为 单关单注和单关合并 两种方式
      单关单注：有且只有一个投注项
      单关合并：有多个投注项进行投注（当前版本不支持一个盘口多个投注项（注：2024-1-5）后续会支持）

可以选择任意投注项进行投注（第一版：同一个盘口只能选择一个投注项；第二版支持一个盘口多个投注项）

    2.串关投注
      串关投注又分为 普通投注和复试串关投注 两种方式
      串关投注最低两场赛事组合；getuserinfo接口获取配置最低/最高组合数据
      串关最少赛事数：maxSeriesNum
      串关最多赛事数：minSeriesNum
      
同一场赛事只能有一个投注项进行串关；（C01,O01,冠军赛事  不支持串关投注）

    3.预约投注
      预约投注只有一个投注项 - 默认单关单注
      当投注项中 marketValue 有值的情况下，可以进行盘口球头调整预约，没有就只有进行赔率预约；赔率预约最小值为当前投注项赔率；最大值赔率值为355
      调整球头的情况下 需要对盘口内已有的其他投注项进行筛选，marketValue 能匹配上，投注项类型能匹配上，那么预约赔率需要自动调整为匹配上的赔率进行正常逻辑的投注；

### 2.投注流程
  ##### 1.点击投注项
    调用 set_bet_obj_config(params,other);
    params = {
      oid,  // 投注项id
      _hid,  // 盘口id
      _hn,  // 坑位
      _mid  // 赛事id
    } // 固定四个参数 不变 需要增加在other中增加
    other = {
      bet_type: 'common_bet'|'guanjun_bet'|'vr_bet'|'esports_bet' 根据赛事纬度判断当前赛事属于 那种投注类型
      device_type: 设备类型, // 1:H5，2：PC,3:Android,4:IOS,5:其他设备
      match_data_type: // 数据仓库名称
      is_detail， // 列表还是详情页 ，列表和详情数据不同 
      ...
    }

  ##### 2.在数据仓库中获取对应维度的数据
    // 获取对应的仓库数据
    const hl_obj = lodash_.get(数据仓库, `hl_obj.${_mid}_${_hid}`, {})
    const hn_obj = lodash_.get(数据仓库, `hn_obj.${_hn}`, {})
    const mid_obj = lodash_.get(数据仓库, `mid_obj.${_mid}_`, {})
    const ol_obj = lodash_.get(数据仓库, `ol_obj.${_mid}_${oid}`, {})

    根据 other.bet_type 判断赛事类型
    matchType // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事
    
    调用 compute_value_by_cur_odd_type(万位赔率(ov),玩法id(hpid),支持的赔率类型(hsw),赛种id(scid)) 这个方法 设置投注项赔率 小数位
    compute_value_by_cur_odd_type() 用在所有显示赔率的地方；

  ##### 3.根据数据仓库中的数据，设置投注内容
    sportId: mid_obj.csid, // 球种id
    matchId: mid_obj.mid,  // 赛事id
    tournamentId: mid_obj.tid,  // 联赛id
    scoreBenchmark: lodash_.get(mid_obj, 'msc[0]'),  //比分
    marketId: hl_obj.hid || ol_obj._hid, //盘口ID
    marketValue: hl_obj.hv || '',
    playOptionsId: ol_obj.oid, //投注项id
    marketTypeFinally: UserCtr.odds.cur_odds,  // 欧洲版默认是欧洲盘 HK代表香港盘
    odds: ol_obj.ov,  //十万位赔率
    oddFinally: compute_value_by_cur_odd_type(ol_obj.ov,ol_obj._hpid, ol_obj._hsw, mid_obj.csid), //最终赔率
    sportName: mid_obj.csna || '', //球种名称
    matchType,  //赛事类型
    matchName: mid_obj.tn || '', //赛事名称
    playOptionName, // 投注项名称
    playOptions: ol_obj.ot,  // 投注项
    tournamentLevel: mid_obj.tlev, //联赛级别
    playId: hn_obj.hpid || ol_obj._hpid, //玩法ID
    playName: set_play_name(play_config), //玩法名称
    dataSource: ol_obj.cds, //数据源  // 使用投注项数据源， 操盘后台可以对玩法切换单独的数据源
    home: mid_obj.mhn , //主队名称
    away: mid_obj.man , //客队名称
    ot: ol_obj.ot, //投注項类型
    placeNum: hl_obj.hn || '', // 盘口坑位  // 盘口对应的坑位变更后 需要重新找到盘口下对应坑位的数据进行替换


    // 以下为 投注显示或者逻辑计算用到的参数
    bet_type: other.bet_type, // 投注类型
    tid_name: mid_obj.tn,  // 联赛名称
    match_ms: mid_obj.ms, // 赛事阶段
    match_time: mid_obj.mgt, // 开赛时间
    handicap: handicap.text, // 投注项名称
    handicap_hv: handicap.hv, // 投注项 球头
    mark_score: calc_bifen(mid_obj.msc, mid_obj.csid, mid_obj.ms, ol_obj._hpid), // 显示的基准分
    mbmty: mid_obj.mbmty, //  2 or 4的  都属于电子类型的赛事
    ol_os: ol_obj.os, // 投注项状态 1：开 2：封 3：关 4：锁
    hl_hs: hl_obj.hs || ol_obj._hs, // 盘口状态，玩法级别 0：开 1：封 2：关 11：锁
    mid_mhs: ol_obj._mhs, // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
    match_ctr: other.match_data_type, // 数据仓库 获取比分
    device_type: BetData.deviceType, // 设备号
    odds_hsw: ol_obj._hsw, // 投注项支持的赔率
    ispo: ol_obj._ispo || 0, // 电竞赛事 不支持串关的赛事

  ##### 4.根据以上的投注数据 进行ws订阅 和对应的推送code
    投注项发起 C2 订阅
    let cmd_obj = {};
    cmd_obj.cmd = "C2";  // 发起订阅的code
    cmd_obj.hid = obj.hid;  // 需要订阅的盘口id，多个以逗号","分隔
    cmd_obj.mid = obj.mid;  // 需要订阅的赛事id，多个以逗号","分隔
    cmd_obj.marketLevel = obj.marketLevel;  // 用户的赔率等级

    收到的推送指令
      赛事状态
      C101/C901
      {
        * `mid` 赛事Id
        * `ms` 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
      }
      需要对赛事状态 进行 （0 开盘, 1 封盘, 2 关盘, 11 锁盘状态）  操作
      设置 mid_mhs 

      赛事阶段
      C102
      {
        * `mid` 赛事Id
        * `mmp` 赛事阶段 999 结束
      }
      需要对赛事状态 进行 （0 开盘, 1 封盘, 2 关盘, 11 锁盘状态）  操作
      设置 mid_mhs 

      赛事比分变更
      C103
      {
        * `mid` 赛事Id
        * `msc` 赛事比分
      }
      设置基准分和全场比分

      赛事盘口状态
      C104
      {
        * `mid` 赛事Id
        * `ms` 赛事状态 （0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
      }
      需要对赛事状态 进行 （0 开盘, 1 封盘, 2 关盘, 11 锁盘状态）  操作
      设置 mid_mhs 

      赛事盘口数据变更推送 
      C105
      1.筛选推送的盘口id中是否有投注项的盘口id
      2.判断筛选后的盘口坑位是否和投注项中的盘口坑位一致；
      3.坑位不一致，需要找到当前推送的盘口数据中 玩法和坑位都和投注项中一致的数据；对投注项中的盘口id和投注项id替换，并且重新发起新的C2订阅，调用get_lastest_market_info()获取最新的盘口数据对整个投注项数据进行替换
      4.第一项，第二项都满足的情况下，判断盘口状态（ hl_hs ），（盘口状态 0：开 1：封 2：关 11：锁），不是开盘状态 直接设置其他状态改变投注项中的盘口状态；
      5.第一项，第二项都满足的情况下，并且第4项盘口开启，进行下一步赔率设置和红绿升降（更新 投注项 数据）红绿升降时间为 3s

      投注项盘口数据变更推送 (其他推送不是投注订阅的，只有C106需要投注订阅)
      C106 
      同C105逻辑一致（因为业务那边没有进行C2的订阅覆盖，会保留以前的订阅推送）

      玩法移除或开启
      C112
      {
        * `mid` 赛事Id
        * `mcms` 状态2:开启，3：删除（与上游一致）
        * `mcid` 玩法id集合
      }
      判断赛事ID 和 玩法id 
      设置盘口状态 hl_hs （盘口状态 0：开 1：封 2：关 11：锁）

  ##### 5.根据以上的投注数据 进行获取投注限额
    电子赛事/电竞/电竞冠军/VR体育
    get_query_bet_amount_esports_or_vr()

    常规赛事
    get_query_bet_amount_common()

  ##### 6.根据以上的投注数据 进行投注

    判断投注项中的 赛事状态/盘口状态/投注项状态 都为开启则进行投注

    单关投注：
      