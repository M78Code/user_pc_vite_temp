namespace AXIOS {
  export interface Resource<T> {
    /** "200"|"0000000" 表示请求成功, code会被处理成200 */
    code: "200" | String
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
  export type Result<T = Object> = Promise<AXIOS.Resource<T>>
  export interface MatchDetails extends API.Result<Array<TYPES.MatchDetail>> { }
}
