// 欧洲赔率  1  
// 香港赔率  2  
// 马来赔率  3  
// 英式赔率  4  
// 美式赔率  5  
// 印尼赔率  6

export const odds_export constant = [{
        label: i18n.t('odds.EU'),
        value: "EU",
        icon: 'panda-icon-contryEU',
        id: 1
    }, //欧洲盘
    {
        label: i18n.t('odds.ID'),
        value: "ID",
        icon: 'panda-icon-contryYN',
        id: 6
    }, //印尼盘
    {
        label: i18n.t('odds.US'),
        value: "US",
        icon: 'panda-icon-contryUS',
        id: 5
    }, //美式盘
    {
        label: i18n.t('odds.MY'),
        value: "MY",
        icon: 'panda-icon-contryML',
        id: 3
    }, //马来盘
    {
        label: i18n.t('odds.GB'),
        value: "GB",
        icon: 'panda-icon-contryUK',
        id: 4
    }, //英式盘
    {
        label: i18n.t('odds.HK'),
        value: "HK",
        icon: 'panda-icon-contryHK',
        id: 2
    }, //香港盘
]