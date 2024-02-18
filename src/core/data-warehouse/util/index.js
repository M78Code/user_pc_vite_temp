
  /**
   * @description: 将赛事数据列表/对象转换成c8命令结构体
   * @param {Array/Object} match_any 赛事数据列表/对象
   * @return {Object} 转换后的C8 对象
   */
 export const  ws_c8_obj_format=(match_any)=>{
    let ret = {};
    if(match_any){
      if(Array.isArray(match_any)){
        match_any.map(match => {
          if(match && match.mid){
            ret[match.mid] = {mid:match.mid, ms:match.ms, csid:match.csid, mess:match.mess, mmp:match.mmp, hpids:[]};
          }
        })
      } else{
        if(match_any.mid){
          ret[match_any.mid] = {mid:match_any.mid, ms:match_any.ms,  csid:match_any.csid, mess:match_any.mess, mmp:match_any.mmp, hpids:[]};
        }
      }
    }
    return ret;
  }


  