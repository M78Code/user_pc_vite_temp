declare namespace TYPES {
  /** 比赛详情 */ interface MatchDetail extends MATCH.mid, MATCH.csid, MATCH.tid, MATCH.csna
    , MATCH.man, MATCH.mhn, MATCH.cds, MATCH.tn, MATCH.tnjc, MATCH.tlev {
    mst: string,
    srid: string,
    mcg: number,
    atf: number,
    mf: boolean,
    mgt: string,
    maid: string,
    mct: number,
    mhlut: string,
    mo: number,
    ctt: number,
    mp: number,
    ms: number,
    cmec: string,
    mle: number,
    lvs: number,
    malu: Array<String>,
    lurl: string,
    mprmc: string,
    frmhn: Array<"R" | String>,
    mhs: number,
    mlet: string,
    mhid: string,
    mrmc: string,
    mess: number,
    mmp: string,
    mms: number,
    mbmty: number,
    /** 图片资源数组 */
    mhlu: Array<String>,
    seid: string,
    mstst: string,
    malut: string,
    frman: Array<"C" | String>,
    mat: string,
    mng: number,
    mststr: string,
    mvs: number,
    mearlys: number,
    mft: number,
    /** 比分 */ msc: Array<String>,
  }

  /** ol 赔率? */ interface Ol extends MATCH.ot, MATCH.ov, MATCH.oid, MATCH.obv, MATCH.os {
    /**  */

  }

  /** hl 盘口? */ interface Hl extends MATCH.mid, MATCH.t {
    /** 盘口ID */ hid: string,
    /** ? */ hmt: number,
    /** ? */ hn: number,
    /** ? */ hpid: string,
    /** ? */ hs: number,
    /** 赔率集合? 投注项集合? */ ol: Array<Ol>
  }
  namespace WS {
    /** WS C105指令的返回体 */ interface C105 extends MATCH.mid {
      /** 盘口集 */ hls:Array<Hl>
      /** ? */ ld:string
      /** ? */ marketLevel: string
      /** 时间戳 */ time: string
    }
  }
}

/** 复用注释 */
declare namespace MATCH {
  /** 球类ID */
  type csid = {
    /** 球类ID */ csid: string
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
  /** 球种名称 */ type csna = {
    /** 球种名称 */ csna: string
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
    /** 投注项状态 */ os: number
  };
  /** 赔率 */ type ov = {
    /** 赔率 */ ov: string
  };
  /** 断档赔率 */ type obv = {
    /** 断档赔率 */ obv: string
  };

  /** 投注項类型 */ type ot = {
    /** 投注項类型 */ ot: string
  };
  /** 玩法名称 */ type hpn = {
    /** 玩法名称 */ hpn: string
  };
  /** 时间戳 */ type t = {
    /** 时间戳 */ t: string
  };
}