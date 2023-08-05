export  const score_format = function (str) {
    return str.replace(/:/, "-");
}
export  const format_score = function (str) {
    return str.split(":").join("-");
}
 


/**
 *@description 根据不同赛事阶段取不同的比分
 *@param {Object} match 赛事数据对象
 *@param {Number} num 0-主队  1-客队
 *@param {String} key 比赛结束显示指定比分
 *@return {Number} 主队或客队得分
 */
 export   const format_total_score = function (match, num,key) {
	try {
		if (!(match.msc && Array.isArray(match.msc) && match.msc.length)) return 0;
		let score_, mscmap = new Map(match.msc.map(item => [item.split('|')[0], item.split('|')[1].split(':')]));
		if (match.csid == "1" || match.csid == "11") {    //足球和手球
			switch (String(match.mmp)) {
				//  41 加时赛上半场  33 加时休息  42 加时下半场 110 加时赛结束
				case '41': case '33': case '42': case '110':
					score_ = mscmap.get('S7')
					break;
				// 50 点球大战  120 点球大战结束
				case '50': case '120':
					score_ = mscmap.get('S170')
					break;
				// 即将加时和等待点球的阶段固定取0
				case '32': case '34':
					score_ = 0
					break;
				//全场结束,取点球大战比分，加时赛比分或者全场比分
				case '999':
					score_ = mscmap.get('S170') || mscmap.get('S7') || mscmap.get('S1')
                    key && key.includes("S") && (score_ = mscmap.get(key))
					break;
				default:
					score_ = mscmap.get('S1')
					break;
			}
		} else {
			score_ = mscmap.get('S1')
		}
		return score_ && score_[num] || 0
	} catch (error) {
		console.error(error)
		return 0
	}	 
}




   /**
   * @description 序列化比分
   * @param  {Array} msc
   * @return {object}
   */
   export const serialized_score=(msc = [],is_init = false)=>{
	let score_obj = {}
	if(is_init){
	  score_obj = {
		S11:{
		  home:'',
		  away:''
		},
		S103:{
		  home:'0',
		  away:'0'
		},
		S5:{
		  home:'',
		  away:''
		},
		S10102:{
		  home:'',
		  away:''
		}
	  }
	}
	// 遍历接口比分数据 转成比分对象
	_.each(msc, score_str => {
	  let [key,value] = score_str.split('|')
	  if(value){
		let [home,away] = value.split(':')
		score_obj[key] = {home,away}
	  }
	})
	return  score_obj
   }