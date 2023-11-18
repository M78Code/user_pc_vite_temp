namespace TYPES {
  export interface MatchDetail {
    tnjc: string,
    csna: string,
    /** 联赛ID */
    tid: string,
    mst: string,
    srid: string,
    mcg: number,
    atf: number,
    mf: boolean,
    mgt: string,
    maid: string,
    mct: number,
    tlev: number,
    mhlut: string,
    mo: number,
    ctt: number,
    mp: number,
    /** 球类ID */
    csid: string,
    ms: number,
    cmec: string,
    mle: number,
    lvs: number,
    malu: Array<String>,
    lurl: string,
    mprmc: string,
    mhn: string,
    cds: string,
    frmhn: Array<"R" | String>,
    mhs: number,
    mlet: string,
    mhid: string,
    mrmc: string,
    /** 赛事ID */
    mid: string,
    mess: number,
    mmp: string,
    mms: number,
    mbmty: number,
    /** 图片资源数组 */
    mhlu: Array<String>,
    seid: string,
    mstst: string,
    malut: string,
    man: string,
    frman: Array<"C" | String>,
    mat: string,
    mng: number,
    mststr: string,
    mvs: number,
    mearlys: number,
    mft: number,
    tn: string,
    msc: Array<String>,
  }
}

/** 复用注释 */ declare namespace MATCH {
  /** 球类ID */ export interface csid {
    /** 球类ID */ csid: string
  }
  /** 赛事ID */ export interface mid {
    /** 赛事ID */ mid: string
  }
  /** 联赛ID */ export interface tid { tid: string }
}