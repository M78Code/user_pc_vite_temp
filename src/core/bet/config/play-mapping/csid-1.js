// 足球即时比分对应的玩法id
export const FOOTBALL_TIMERLY_SCORE_HPID = [
    1,//全场独赢
    2,//全场大小
    3,//全场让球胜平负
    4,//全场让球
    5,//平局退款
    6,//双重机会
    7,//全场比分
    8,//{主队}准确进球数
    9,//{客队}准确进球数
    10,//{主队}进球大小
    11,//{客队}进球大小
    12,//两队都进球
    13,//独赢 & 进球大小
    14,//准确进球数
    15,//进球单/双
    16,//最多进球的半场
    17,//半场独赢
    18,//半场大小
    19,//半场让球
    20,//上半场比分
    21,//上半场{主队}准确进球数
    22,//上半场{客队}准确进球数
    23,//上半场准确进球数
    24,//上半场两队都进球
    25,//下半场独赢
    26,//下半场大小
    27,//剩余时间获胜
    28,//第{X}个进球
    29,//上半场剩余时间获胜
    30,//上半场第{X}个进球
    31,//第{X}个进球何时发生？
    32,//15分钟进球-独赢({a}-{b})
    33,//15分钟进球-让球({a}-{b})
    34,//15分钟进球-大小({a}-{b})
    35,//首个进球球员
    36,//任意时间进球球员
    42,//上半场进球单/双
    43,//上半场平局退款
    68,//总进球数区间
    69,//上半场让球胜平负
    70,//上半场双重机会
    71,//下半场让球胜平负
    72,//下半场双重机会
    73,//下半场准确进球数
    74,//下半场比分
    75,//下半场进球单/双
    76,//下半场两队都进球
    77,//{主队}获胜退款
    78,//{主队}进球单/双
    79,//{客队}零失球
    80,//{客队}零失球获胜
    81,//{主队}零失球
    82,//{主队}零失球获胜
    83,//{主队}上/下半场全胜
    84,//{主队}任意半场获胜
    85,//{主队}最高得分半场
    86,//{主队}上/下半场均进球
    87,//上半场{主队}进球大小
    88,//下半场{主队}进球大小
    89,//下半场{主队}零失球
    90,//上半场{主队}零失球
    91,//{客队}获胜退款
    92,//{客队}进球单/双
    93,//{客队}上/下半场全胜
    94,//{客队}任意半场获胜
    95,//{客队}最高得分半场
    96,//{客队}上/下半场均进球
    97,//上半场{客队}进球大小
    98,//下半场{客队}进球大小
    99,//下半场{客队}零失球
    100,//上半场{客队}零失球
    101,//独赢 & 两队都进球
    102,//进球大小 & 两队都进球
    103,//半/全场比分
    104,//半/全场
    105,//上半场独赢 & 上半场两队都进球
    106,//下半场独赢 & 下半场两队都进球
    107,//双重机会 & 两队都进球
    108,//上/下半场两队都进球
    109,//上/下半场进球数均大于{X.5}
    110,//上/下半场进球数均小于{X.5}
    111,//角球独赢
    112,//最后一个角球
    113,//角球让球
    114,//角球大小
    115,//{主队}角球大小
    116,//{客队}角球大小
    117,//角球总数区间
    118,//角球单/双
    119,//上半场角球独赢
    120,//上半场第{X}个角球
    121,//上半场角球让球
    122,//上半场角球大小
    123,//上半场{主队}角球大小
    124,//上半场{客队}角球大小
    125,//谁先获得{X}个角球
    126,//加时赛-独赢
    127,//加时赛-大小
    128,//加时赛-让球
    129,//加时赛-上半场独赢
    130,//加时赛-上半场让球
    131,//是否进行点球大战
    132,//点球大战-独赢
    133,//点球大战-第{X}个点球是否射进
    134,//点球大战-大小
    135,//晋级球队
    136,//谁会在决赛中获胜
    137,//获胜方式
    138,//比赛中出现红牌
    139,//{主队}获得红牌
    140,//{客队}获得红牌
    141,//净胜分
    142,//下半场平局退款
    143,//下半场让球
    144,//谁先开球
    148,//第{X}个进球球员
    149,//最后进球队伍
    150,//最后进球球员
    151,//进2+球的球员
    152,//进3+球的球员
    222,//第{X}个进球方式
    223,//谁会进球
    224,//第{X}张罚牌
    225,//第{X}个角球
    226,//{主队}角球总数区间
    227,//{客队}角球总数区间
    228,//上半场角球总数区间
    229,//上半场角球单/双
    230,//上半场谁先获得{X}个角球
    231,//15分钟角球-独赢({a}-{b})
    232,//15分钟角球-让球({a}-{b})
    233,//15分钟角球-大小({a}-{b})
    234,//加时赛是否进球
    235,//加时赛-第{X}个进球
    236,//加时赛-正确比分
    237,//点球大战-第{X}个进球
    238,//点球大战-净胜分
    239,//点球大战-准确进球数
    240,//点球大战-单/双
    241,//点球大战-正确比分
    269,//全场让球
    270,//半场让球
    306,//罚牌让分
    307,//罚牌大小
    308,//上半场罚牌让分
    309,//上半场罚牌大小
    310,//罚牌独赢
    311,//上半场罚牌独赢
    312,//罚牌单/双
    313,//上半场罚牌单/双
    314,//{主队}罚牌大小
    315,//{客队}罚牌大小
    316,//上半场{主队}罚牌大小
    317,//上半场{客队}罚牌大小
    318,//准确罚牌分数
    319,//上半场准确罚牌分数
    320,//{主队}准确罚牌分数
    321,//{客队}准确罚牌分数
    322,//上半场{主队}准确罚牌分数
    323,//上半场{客队}准确罚牌分数
    324,//黄牌让分
    325,//黄牌大小
    326,//黄牌独赢
    327,//上半场黄牌让分
    328,//上半场黄牌大小
    329,//上半场黄牌独赢
    330,//加时赛-单/双
    331,//加时赛-角球大小
    332,//加时赛-上半场大小
    333,//点球大战-前5轮独赢
    334,//点球大战-让球
    335,//点球大战-前5轮大小
    336,//第{X}进球
    367,//全场反波胆
    368,//上半场反波胆
    369,//下半场反波胆
    373,// 上半场{主队}进球单/双
    374,//上半场{客队}进球单/双
    375,//上半场{主队}零失球获胜
    376,// 上半场{客队}零失球获胜
    370, // 15分钟玩法罚牌独赢
    371,// 15分钟玩法罚牌让球
    372, //15分钟玩法罚牌大小
    377,//下半场{主队}进球单/双
    378,//下半场{客队}进球单/双
    381,//下半场{主队}零失球获胜
    382,//下半场{客队}零失球获胜
    10001,//冠军
    10002,//垫底
    10003,//前二
    10004,//前四
    10005,//前六
    10006,//升级
    10007,//降级
    10008,//排名上半区
    10009,//排名下半区
    10010,//进球最多的球队
    10011,//进球最少的球队
    10012 //最佳射手
  ];
  
  
  // 足球让球玩法
export const FOOTBALL_PLAY_LET_BALL = [
    '3', // 全场让球胜平负
    '4', // 全场让球
    '19', // 上半场让球
    '33', // 15分钟进球-让球({a}-{b})
    '69', // 上半场让球胜平负
    '71', // 下半场让球胜平负
    '113',// 角球让球盘
    '121', // 上半场角球让球
    '128', // 加时赛上半场
    '130', // 加时赛-上半场让球
    '143', // 下半场让球
    '232', // 15分钟角球让球
    '269', // 全场让球
    '270', // 半场让球
    '334' // 点球大战-让球
  ];
  