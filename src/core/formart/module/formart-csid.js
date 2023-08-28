 
import { CSID_CONST } from "src/core/match-constant/config/csid.js"

  /**
   * @Description 根据球种ID获取球种中文名称
   * @param {undefined} undefined
  */
  export const csid_to_sport_name=(csid)=>{
    csid = parseInt(csid)
    let sport_name = ''

   let obj = CSID_CONST[`CSID_${csid}`] 

   if(obj){
    return  obj['mark']
   }else{
    return  csid
   }

   
  }