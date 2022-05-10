import utils from "@/utils/utils";

let filter = {
    //格式化时间
    date: (value, fmt) => {
        let formatStr = fmt || 'yyyy-MM-dd';
        if (utils.isEmpty(value)) {
            return "";
        } else {
            if (fmt != 'description') {
                let dateValue = utils.parserDate(value);
                let dateTime = utils.dateFormat(dateValue, formatStr);
                return dateTime;
            } else {
                return utils.getDateToDescription(value);
            }
        }
    },

    //电话号码脱敏
    telHide: str => {
        if (utils.isEmpty(str)) {
            return str;
        }
        //11位手机号
        let tel = new RegExp("(\\d{3})\\d{4}(\\d{4})");
        str = str.replace(tel, "$1****$2");
        //若包含*则认为已经脱敏，否则进行座机脱敏
        if (str.indexOf('*') == -1) {
            //7、8位座机号
            let phone = new RegExp("(\\d{2})\\d{3}(\\d{2})");
            str = str.replace(phone, "$1***$2");
        }
        return str;
    },

    // 身份证号脱敏('331082199708094687' 转换成 '33108219********87') 第8位开始替换8个
    idCardHide: value => {
        let data = utils.hideCode(value, 8, 2);
        return data;
    },

    //数字管道
    number: (value, cent, isThousand) => {
        return utils.formatNumber(value, cent, isThousand);
    },

    //附件id格式化  isThumb是否是缩略图  isSplit需要第几个
    fileFormat: (value, isThumb = true, isSplit = 0) => {
        let result = null;
        if (utils.isNotEmpty(value)) {
            let attchid = value;
            if (isSplit >= 0) {
                let arr = attchid.split(',')
                attchid = arr[isSplit];
            }
            result = process.env.VUE_APP_FILE_URL + attchid;
            if (isThumb) {
                result += '&isThumb=1'
            }
        }
        return result;
    },

    //类似 oracle 的decode 函数 {'1':'显示1','2':显示2,'3':显示3}
    decode:(value,params,defaultVal=null)=>{
        return params[value+'']||defaultVal;
    },

}

export default {
    install(Vue) {
        Object.keys(filter).forEach(key => {
            Vue.filter(key, filter[key]);
        });
    }
};
