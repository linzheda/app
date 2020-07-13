import utils from '@/utils/utils'

// 身份证号脱敏('331082199708094687' 转换成 '33108219********87') 第8位开始替换8个
let idCardHide = value => {
    let data=utils.hideCode(value,8,2);
    return data
};

// 手机号脱敏('13912345678' 转换成 '139****5678') 第3位开始替换4个
let telHide = value => {
    let data=utils.hideCode(value,3,4);
    return data
};

//日期 过滤器
let date = (value, fmt) => {
    let formatStr = fmt || 'yyyy-MM-dd';
    if (utils.isEmpty(value)) {
        return "";
    } else {
        if(fmt!='description'){
            let dateValue = utils.parserDate(value);
            let dateTime = utils.dateFormat(dateValue, formatStr);
            return dateTime;
        }else{
            return utils.getDateToDescription(value);
        }
    }
};

//数字管道
let number = (value,cent,isThousand)=>{
    return utils.formatNumber(value,cent,isThousand);
};



export default {
    idCardHide,
    telHide,
    date,
    number
}
