declare namespace TYPES {
  /** 比赛详情 */ interface MatchDetail extends K.mid, K.csid, K.tid, K.csna
    , K.man, K.mhn, K.cds, K.tn, K.tnjc, K.tlev, K.mo
    , K.mp, K.ms, K.msc
    , K.mgt, K.srid {
    mst: string,
    mcg: number,
    atf: number,
    mf: boolean,
    maid: string,
    mct: number,
    mhlut: string,
    ctt: number,
    cmec: string,
    mle: number,
    lvs: number,
    malu: Array<K.malu>,
    lurl: string,
    mprmc: string,
    frmhn: Array<"R" | String>,
    mhs: number,
    mlet: string,
    mhid: string,
    mrmc: string,
    mess: number,
    mmp: string,
    /** 视频数量 */ mms: number,
    mbmty: number,
    mhlu: Array<K.mhlu>,
    seid: string,
    mstst: string,
    malut: string,
    frman: Array<"C" | String>,
    mat: string,
    mng: number,
    mststr: string,
    /** 动画数量 */ mvs: number,
    mearlys: number,
    mft: number,
  }
  /** 盘口信息 */ interface OddInfo<T extends Ol|OlResult=Ol> extends K.hid,K.hpid,K.mid,K.hpn,K.hpt {
    hv:any,
    /** @deprecated 貌似没有这个属性 */ ol:T[]
    hl:Hl[]
    /** 置顶时间戳 */ hton: string
    /** 用于玩法置顶的key */ topKey: string
    /**  */ title:OddTitle[]
  }

  /** 玩法标题 */ interface OddTitle {
    /** 标题名字 */ osn:string
    /** ? */ otd: number
  }

  /** ol玩法投注项 */ interface Ol extends K.ot,K.on, K.ov, K.oid, K.obv, K.os,K.ott,K.otd,K.otv {
  }
  /** Ol投注项 结果 */ interface OlResult extends Ol,K.result{
  }

  /** 非足球活力值排名 */ interface Rank {
    /** 历史赛果 */ forecast: Array<any>
    /** 活力表现 */ form: Number
    /** 名称 */ name: String
    /** 编号 */ number: String
    /** 综合评分 */ star: String
  }

  /** hl 盘口? */ interface Hl extends K.mid, K.t, K.hpid,K.hs {
    /** 盘口ID */ hid: string,
    /** ? */ hmt: number,
    /** ? */ hn: number,
    /** 赔率集合? 投注项集合? */ ol: Array<Ol>
  }

  /**  */ interface S {

  }
  namespace WS {
    /** WS C105指令的返回体 */ interface C105 extends K.mid {
      /** 盘口集 */ hls: Array<Hl>
      /** ? */ ld: string
      /** ? */ marketLevel: string
      /** 时间戳 */ time: string
    }
  }
  type OlResultArray =  ['r-unkown','r-unkown2','r-tie','r-lose','r-win','r-win-half','r-lose-half']
  type OlResultState= OlResultArray[K.result[keyof K.result]]

  export type OlItemType =  'default' | 'fill' | 'auto' | 'column'
}

/** 属性字段复用注释 */
declare namespace K {
  /** 赛种id */
  type csid = {
    /** 赛种id */ csid: string
  };
  /** 数据源 */ type cds = {
    /** 数据源 */ cds: any
  };
  /** 赛事ID */ type mid = {
    /** 赛事ID */ mid: string
  };
  /** 联赛ID */ type tid = {
    /** 联赛ID */ tid: string
  };
  /** 联赛名称 */ type tnjc = {
    /** 联赛名称 */ tnjc: string
  };
  /** 联赛级别 */ type tlev = {
    /** 联赛级别 */ tlev: number
  };
  /** 球种名称/赛种名称 */ type csna = {
    /** 球种名称/赛种名称 */ csna: string
  };
  /** 赛事名称 */ type tn = {
    /** 赛事名称 */ tn: string
  };
  /** 主队名称 */ type mhn = {
    /** 主队名称 */ mhn: string
  };
  /** 客队名称 */ type man = {
    /** 客队名称 */ man: string
  };
  /** 投注项id */ type oid = {
    /** 投注项id */ oid: any
  };
  /** 投注项状态 */ type os = {
    /** 投注项状态:0开,1封,3隐藏 */ os: number
  };
  /** 赔率 */ type ov = {
    /** 赔率 */ ov: string
  };
  /** 断档赔率 */ type obv = {
    /** 断档赔率 */ obv: string
  };

  /** 投注項类型? */ type ot = {
    /** 投注項类型? */ ot: string
  };
  /** 投注项的name? */ type on = {
    /** 投注项的name? */ on: string,
  };
    /** 投注项列ID? */ type otd = {
    /** 投注项列ID? */ otd: number
  };
  /** 投注项头名称 */ type ott = {
    /** 投注项头名称 */ ott: string
  };
  /** 投注项聚合名称 */ type otv = {
    /** 投注项聚合名称 */ otv: string
  };
  /** 玩法名称 */ type hpn = {
    /** 玩法名称 */ hpn: string
  };
  /** 时间戳 */ type t = {
    /** 时间戳 */ t: string
  };

  /** 视频状态 -1：没有配置视频源 ，0：已配置但不可用，1：已配置可用但暂未播放，2：已配置可用并播放中 */ type mms = {
    /** 视频状态 -1：没有配置视频源 ，0：已配置但不可用，1：已配置可用但暂未播放，2：已配置可用并播放中 */ mms: number
  };
  /** 客队logo缩略图的url地址 */ type malu = {
    /** 客队logo缩略图的url地址 */ malu: String
  };
  /** 赛事开始时间 */ type mgt = {
    /** 赛事开始时间 */ mgt: String
  };
  /** 主队logo缩略图的url地址 */ type mhlu = {
    /** 主队logo缩略图的url地址 */ mhlu: String
  };
  /** 比赛是否结束 */ type mo = {
    /** 比赛是否结束 */ mo: number
  };
  /** 是否支持赛前盘 */ type mp = {
    /** 是否支持赛前盘 */ mp: number
  };
  /** 赛事状态 */ type ms = {
    /** 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 
     * 9:延期 10:比赛中断 110:即将开赛 */ ms: number
  };
  /** 最近5场的比分 */ type msc = {
    /** 最近5场的比分 */ msc: Array<String>
  };
  /** 排序值 */ type orderNo = {
    /** 排序值 */ orderNo: number
  };
  /** 期号或者轮数 */ type no = {
    /** 期号或者轮数 */ no: String
  };
  /** 批次号 */ type batchNo = {
    /** 批次号 */ batchNo: number
  };
  /** 是否杯赛 1：是 */ type isc = {
    /** 是否杯赛 1：是 */ isc: number
  };
  /** 回合数 */ type lod = {
    /** 回合数 */ lod: number
  };
  /** 第三方赛事id */ type srid = {
    /** 第三方赛事id */ srid: String
  };
  /** 玩法ID */ type hpid = {
    /** 玩法ID */ hpid: string
  };
  /** 玩法模板 */ type hpt = {
    /** 玩法模板 */ hpt: number
  };
  /** 盘口状态 */ type hs = {
    /** 盘口状态:0开,1封,2关,11锁 */ hs: number,
  };
  /** 用户ID */ type cuid = {
    /** 用户ID */ cuid: number,
  };
  /** 投注项结果:0?,1?,2走水,3输,4赢,5赢半,6输半 */ type result = {
    /** 投注项结果:0?,1?,2走水,3输,4赢,5赢半,6输半 */ result: 0|1|2|3|4|5|6,
  };

  /** 盘口ID? */ type hid = {
    /** 盘口ID? */ hid: number,
  };
}

/** annotation */ type template = {
    /** annotation */ template: number,
  };