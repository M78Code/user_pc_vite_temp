import axios from "src/api/common/axios.wapper.js";


import * as mock_data from  "src/api/mock/index.js"

import STANDARD_KEY from  "src/core/standard-key/index.js"

export const handle_structureMatchBaseInfoByMids = (
    params={},
  url = "/yewu11/v1/w/structureMatchBaseInfoByMids"
) => {


let  final_params =  {
  ...mock_data.handle_structureMatchBaseInfoByMids_params,
  ...params
}

return  axios.post(url, { ...final_params  })

};

// export const handle_menu_init = (url = "/yewu11/v2/w/menu/init") => {
//   let params = {
//     sys: 4,
//     disabled: 3,
//     lang: "JC",
//     t: Date.now(),
//   };

//   return axios.get(url, params  );
// };



/**
 * 试玩
 * @param {*} url
 * @returns
 */
// https://api.sportxxxw1box.com/yewu6/user/tryPlay

export const handle_user_tryPlay = (url = "/yewu6/user/tryPlay") => {
  let params = {
    lang: "zh",
    terminal: "PC"
  };

  return axios.get(url, params );
};



/**
 *  获取列表队列
 * @param {*} params
 * @param {*} url
 */
export const handle_structureTournamentMatches = (
  params={},
url = "/yewu11/v1/w/structureTournamentMatches"
) => {


let  final_params =    {
  ...mock_data.handle_structureTournamentMatches_params,
   ...params
}

return axios.post(url, { ...final_params  })

};




/**
 * 获取用户信息
 * @param {*} url
 * @returns
 */
export const handle_getUserInfo = (url = "/yewu12/user/getUserInfo") => {
  let params = {
    token: sessionStorage.getItem(STANDARD_KEY.token),
t:  Date.now()
  };

  return axios.get(url, params );
};


// 查询用户余额
export const check_balance = (params, config={}, url = "/yewu12/user/amount") =>{
  return axios.get(url, params );
}

/**
 *  投注
 * @param {*} params
 * @param {*} url
 */
export const handle_betOrder_bet = (
  params={},
url = "/yewu13/v1/betOrder/bet"
) => {


let  final_params =    {

   ...params
}

return axios.post(url, { ...final_params  })

};






