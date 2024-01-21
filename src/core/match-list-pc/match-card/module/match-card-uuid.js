

/**
 * 客户端列表赛事重复大一统方案
 * http://doc-web.sportxxxkd1.com/#/main/detail?type=doc&id=65aa6262a33d175f64a95fe8
 * 
 */
// 单个关键字 键值对 的键值 分隔符
const single_label_value_pairs_sep=":"
 
// 单个关键字 键值对 对象包装方法  
const single_label_value_pairs_wapper_fn=(value)=>{
    return  `[${value}]`
}

// 单个关键字 键值对 对象包装方法  
const single_label_value_pairs_resolve_fn=(str)=>{
    str = '' +str
    return   str.substring(1,str.length-1)  
}

// 不会重复的值  的键值对格式 ：clab:1   csid-2-1  类似的东西
// key 拼接 关键字  顺序队列关系    枚举定义
/**
 * 
 * key: 标识键
 * order： 排序
 * enable：是否启用这个标识
 * annotation：此标识的注释示意
 * multiple： 值是否可能在单一列表内存在多个
 * enumerable：值可枚举 
 * value_pairs：值可枚举 的 枚举值 ，用于参考 
 *  
 * 
 * 
 */
const match_acrd_labels={

    custom_label:{
        key:'clab',
        order:10, 
        enable:true, //启用 此标识
        annotation:  ' 列表自定义名字',
        multiple:false,//值可能在单一列表内存在多个 
        enumerable:true, // 值可枚举 
        value_pairs:[
            {value:'1', annotation:"滚球全部"},
            {value:'2', annotation:"滚球常规赛种其他"},
            {value:'3', annotation:"今日"},
            {value:'4', annotation:"早盘"},
            {value:'5', annotation:"竞足"},
            {value:'6', annotation:"热门联赛"},
            {value:'7', annotation:"冠军"},
            {value:'8', annotation:"滚球电竞赛事"},
            {value:'9', annotation:"VR赛事"},
        ]
    },
    pingtai:{
        key:'pingtai',
        order:13, 
        enable:true, //启用 此标识
        annotation:  '平台标识',
        enumerable:true, // 值可枚举 
        value_pairs:[
            {value:'ty', annotation:"体育"},
            {value:'zr', annotation:"真人"},
            {value:'cp', annotation:"彩票"},
        
        ]  
    },

     zaopan_gunqiu:{
        key:'zgqiu',
        order:20, 
        enable:true, //启用 此标识
        annotation:  ' 早盘滚球 未开赛已开赛',
        enumerable:true, // 值可枚举 
        value_pairs:[
            {value:'-1', annotation:"不区分"},
            {value:'1', annotation:"早盘"},
            {value:'2', annotation:"滚球"},
        ]
    },
     csid:{
        key:'csid',
        order:30, 
        enable:true, //启用 此标识
        annotation:  ' 赛种ID 可能出现重复',
        enumerable:false, // 值不可枚举 
        key_pairs:[
           
        ]
    },
    container:{
        key:'container',
        order:40, 
        enable:true, //启用 此标识
        annotation:  '容器标识 ',
        enumerable:true, // 值 可枚举 
        key_pairs:[
            {value:'zgqiu_title', annotation:"早盘滚球 未开赛已开赛 标题容器 "},
            {value:'csid_title', annotation:"球类  标题容器 "},
            {value:'tid_title', annotation:"联赛  标题容器 "},
            {value:'tid_container', annotation:"联赛  内容容器 "},
            {value:'mid_container', annotation:"单个赛事赛事ID  内容容器 "},
            {value:'vr_period_title', annotation:" VR 滚球标题 "},
            {value:'vr_tid_title', annotation:" VR 足球 联赛标题 "},
        ] 
    },
    tid:{
        key:'tid',
        order:50, 
        enable:true, //启用 此标识
        annotation:  '联赛ID 可能出现重复',
        enumerable:false, // 值不可枚举 
        key_pairs:[
           
        ]

    },
    mid:{
        key:'mid',
        order:60, 
        enable:true, //启用 此标识
        annotation:  '赛事ID 可能出现重复',
        enumerable:false, // 值不可枚举 
        key_pairs:[
           
        ]
    },


} 

/**
 * 计算 key 队列 
 * @returns 
 */
const compute_match_acrd_labels_queue=()=>{
    let arr=[]

    Object.values(match_acrd_labels)
    .sort((a,b)=>a.order-b.order)
    .filter(x=>x.enable)
    .map(x=>arr.push(x.key) )
    return arr
}

// key 队列 
const match_acrd_labels_queue=  compute_match_acrd_labels_queue()
 
/**
 * 生成 mcuuid 方法   
 * @param {*} params 
 */

const generate_match_card_uuid = (params={})=>{

    
    let str=''

    for(let key of match_acrd_labels_queue ){

        if(params.hasOwnProperty(key)){
        
        }

    }

    

}



/**
 * 解析 mcuuid 方法   
 * @param {*} params 
 */

const resolve_match_card_uuid = (params)=>{
    
}