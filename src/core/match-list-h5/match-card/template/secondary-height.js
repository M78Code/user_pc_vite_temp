

/**
 * 通过次要玩法 key  和数据 计算 次要玩法 高度   
 */



// 开关 赔率挂载键 映射 
let key_key={
     // 角球投注项模板
    // cosCorner:"hpsCorner",
    // cosOvertime,
    // cosPenalty,
    // cosPromotion,
    // 波胆
    // cosBold,
    // cosOutright,
    // cosPunish,
    // hpsAdd,
    // cos15Minutes,
    // cos5Minutes,
}






const  compute_secondary_height_case_1=({match,key ,sub_key})=>{

}





/**
 * 
 * @param {*} match 
 * @param {*} key  次要玩法 开关控制键 
 * @param {*} sub_key  次要玩法 下的 自玩法  开关控制键  /key   /hpid
 */
const compute_secondary_height=({match,key ,sub_key})=>{

let   result={}

if(['cosBold'].includes(key)){
 // 动态计算
 result= compute_secondary_height_case_1({match,key ,sub_key})

}else if( 1 ){
    // 五分钟

}
// 15 分钟等其他 
    
return  result
}





