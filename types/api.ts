namespace AXIOS {
  export interface Resource<T> {
    /** "200"|"0000000" 表示请求成功 */
    code: "200" | "0000000" | String
    /** 接口返回的数据体 */
    data: T
    gcuuid: string
    /** 接口返回的消息 */
    message: string
    /** 时间戳(毫秒) */
    ts:number
  }
}

namespace API {
  export interface MatchDetails extends AXIOS.Resource<Array<TYPES.MatchDetail>> { }
}
