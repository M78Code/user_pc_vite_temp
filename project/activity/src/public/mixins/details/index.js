/*
 * @
 * @Author:
 * @Description: 详情页公共方法
 * @Date: 2020-10-25 19:10:38
 * @FilePath: /user-pc1/src/public/mixins/details/index.js
 */
import { mapActions } from "vuex";

const football = require('public/image/wwwassets/yabo/png/football.png');//足球
const basketball = require('public/image/wwwassets/yabo/png/basketball.png');//篮球
const baseball = require('public/image/wwwassets/yabo/png/baseball.png'); //棒球
const ice_hockey = require('public/image/wwwassets/yabo/jpg/ice_hockey.jpg'); //冰球
const tennis = require('public/image/wwwassets/yabo/jpg/tennis.png'); //网球
const usa_football = require('public/image/wwwassets/yabo/png/usa_football.png');// 美足
const snooker = require('public/image/wwwassets/yabo/jpg/snooker.jpg'); //斯诺克
const ping_pong = require('public/image/wwwassets/yabo/jpg/ping_pong.jpg'); //乒乓球
const volleyball = require('public/image/wwwassets/yabo/png/volleyball.png');// 排球
const badminton = require('public/image/wwwassets/yabo/jpg/badminton.jpg'); //羽毛球
const handball = require('public/image/common/png/handball.png'); //手球
const boxing = require('public/image/common/png/boxing.png'); //拳击
const beach_volleyball = require('public/image/common/png/beach_volleyball.png'); //沙滩排球
const rugby = require('public/image/common/png/rugby.png'); //橄榄球
const hockey = require('public/image/common/png/hockey.png'); //曲棍球
const polo = require('public/image/common/png/polo.png'); //水球
const virtual_dog = require('public/image/yabo/png/virtual_dog.png');//赛狗
const virtual_racing = require('public/image/yabo/png/virtual_racing.png'); //赛马

const motorcycle = require('public/image/wwwassets/yabo/png/motorcycle.png'); // 虚拟摩托车

const virtual_dirt_bike_details = require('public/image/wwwassets/yabo/png/virtual_dirt_bike_details.png');// 虚拟泥地摩托车

export default {
    methods: {
        ...mapActions({
            //设置详情比分面板，接口报错时的备用数据
            set_active_detail: "set_active_detail"
        }),
        /**
        * @description: 获取各球种背景图片
        * @param {String} csid 球种id
        * @return {String} 返回各球种背景图片
        */
        computed_background(csid){
            let background_img = ""
            // 3棒、4冰、5网、7斯诺克、8乒乓、10羽毛球 1001虚拟足球、1002赛狗、1011赛马
            switch (csid) {
                case "1": // 足球
                case "1001": // 虚拟足球
                    background_img = football;
                    break;
                case "2": // 篮球
                case "1004": // 虚拟篮球
                    background_img = basketball;
                    break;
                case "3": // 棒球
                    background_img = baseball;
                    break;
                case "4": // 冰球
                    background_img = ice_hockey;
                    break;
                case "5": // 网球
                    background_img = tennis;
                    break;
                case "6": // 美足
                    background_img = usa_football;
                    break;
                case "7": // 斯诺克
                    background_img = snooker;
                    break;
                case "8": // 乒乓
                    background_img = ping_pong;
                    break;
                case "9": // 排球
                    background_img = volleyball;
                    break;
                case "10": // 羽毛球
                    background_img = badminton;
                    break;
                case "11"://手球
                    background_img = handball;
                    break;
                case "12"://拳击
                    background_img = boxing;
                    break;
                case "13"://沙滩排球
                    background_img = beach_volleyball;
                    break;
                case "14"://橄榄球
                    background_img = rugby;
                    break;
                case "15"://曲棍球
                    background_img = hockey;
                    break;
                case "16"://水球
                    background_img = polo;
                    break;
                case "1002": // 虚拟赛狗
                    background_img = virtual_dog;
                    break;
                case "1011": // 虚拟赛马
                    background_img = virtual_racing;
                    break;
                case "1010": // 虚拟摩托
                    background_img = motorcycle;
                    break;
                case "1009": // 虚拟泥地摩托车
                    background_img = virtual_dirt_bike_details;
                    break;
            }
            if(background_img) this.$root.$emit('cmd_return_background_img', background_img) 
            return background_img
        },

        /**
        * @description: 保存跳转到详情页的赛事数据，用于详情接口报错数据填充
        * @param {}
        * @return {undefined} undefined
        */
        save_match_info(matchInfo){
            this.set_active_detail(matchInfo)
        },
        /**
         *
         * @param {*} data 接口返回的整个 data 对象
         * @returns msc: ["S1|48:52"] => msc: {S1:{home: 48,away: 52}}
         */
        build_msc(data) {
            let obj = {};
            let msc = _.get(data,'msc', []);
            if(!_.isEmpty(msc) && _.isArray(msc)) {
                let msc_array = _.cloneDeep(msc);
                _.forEach(msc_array, item => {
                    let format = item.split("|");
                    // 比分格式判断
                    if(!_.isEmpty(format) &&
                        !_.isEmpty(format[0]) &&
                        !_.isEmpty(format[1]) &&
                        _.includes(format[1], ":")) {
                        let score_type = format[0]; // 比分类型
                        let score_arr = format[1].split(':'); // 比分类型对应的比分
                        // 主队比分
                        let home = _.get(score_arr, '0', '0');
                        // 客队比分
                        let away = _.get(score_arr, '1', '0');
                        // 比分对象
                        obj[score_type] = {
                        home,
                        away,
                        percentage: 0
                        };
                        // 主队和客队必须有一个不为0
                        if(!(home==0 && away==0)) {
                            //统计面板百分比计算
                            // 计算主队得分的所占百分比
                            if (["S17", "S18", "S1101", "S108", "S107", "S110"].includes(score_type)) {
                                obj[score_type].percentage = parseInt(
                                (parseInt(obj[score_type].home) /
                                    (
                                    parseInt(obj[score_type].home) +
                                    parseInt(obj[score_type].away)
                                    ).toFixed(2)) *
                                    100
                                );
                            } else {
                                // 计算客队得分所占的百分比
                                obj[score_type].percentage = parseInt(
                                (parseInt(obj[score_type].away) /
                                    (
                                    parseInt(obj[score_type].home) +
                                    parseInt(obj[score_type].away)
                                    ).toFixed(2)) *
                                    100
                                );
                            }
                        }
                    }
                });
            }
            return obj;
        }
    },
}
