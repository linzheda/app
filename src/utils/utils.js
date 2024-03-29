const fmtYMD = 'yyyy-MM-dd';//时间格式 YMD
const fmtYMDHMS = 'yyyy-MM-dd hh:mm:ss';//时间格式 YMDHMS
const fmtYMDHM = 'yyyy-MM-dd hh:mm';//时间格式 YMDHMS

class utils {
    /**
     * 解决Vue Template模板中无法使用可选链的问题
     * @param obj
     * @param rest
     * @returns {*}
     */
    static optionalChaining = (obj, ...rest) => {
        let tmp = obj
        for (let key in rest) {
            let name = rest[key]
            tmp = tmp[name]
        }
        return tmp
    }
    //判断是否为空
    static isEmpty(value) {
        return value == null || Number.isNaN(value) || value == 'NaN' || (typeof value === 'string' && (value.trim().length === 0
            || value == undefined || value == 'undefined' || value == 'null' || value == ''));
    }

    //判断是否不为空
    static isNotEmpty(value) {
        return !this.isEmpty(value);
    }

    //日期格式化  日期转字符串
    static dateFormat(date, fmt) {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    //字符串转换成日期
    static parserDate(date) {
        if (this.isEmpty(date)) {
            return new Date();
        } else {
            let newDate = date.replace(/-/g, "/");
            let t = Date.parse(newDate);
            if (!isNaN(t)) {
                return new Date(t);
            } else {
                //ios日期格式
                let t = Date.parse(newDate + '/01');
                return new Date(t);
            }
        }
    }

    //获取日期
    static getDate(timestamp, fmt) {
        fmt = fmt || fmtYMDHMS;
        if (this.isEmpty(timestamp)) {
            return this.dateFormat(new Date(), fmt);
        } else {
            return this.dateFormat(new Date(timestamp), fmt);
        }
    }

    //获取日期变成描述 刚刚 几分钟前   几天前
    static getDateToDescription(date) {
        let oldTime = Date.parse(this.parserDate(date));
        let nowTime = Date.parse(new Date());
        if (oldTime > nowTime) {
            return this.dateFormat(this.parserDate(date), fmtYMDHM);
        }
        let diffTime = Math.abs(nowTime - oldTime);
        if (diffTime > 7 * 24 * 3600 * 1000) {
            return this.dateFormat(this.parserDate(date), fmtYMD);
        } else if (diffTime < 7 * 24 * 3600 * 1000 && diffTime >= 24 * 3600 * 1000) {
            //一周内
            let dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000));
            return dayNum + "天前";
        } else if (diffTime < 24 * 3600 * 1000 && diffTime >= 3600 * 1000) {
            //一天内
            let dayNum = Math.floor(diffTime / (60 * 60 * 1000));
            return dayNum + "小时前";
        } else if (diffTime < 3600 * 1000 && diffTime >= 60 * 1000) {
            //一小时内
            let dayNum = Math.floor(diffTime / (60 * 1000));
            return dayNum + "分钟前";
        } else if (diffTime < 60 * 1000 && diffTime >= 0) {
            //一分钟内
            return "刚刚";
        }
    }

    //获取当前年份
    static getCurrentYear() {
        return this.dateFormat(new Date(), 'yyyy');
    }

    //获取当前日期
    static getCurrentDay() {
        return this.dateFormat(new Date(), fmtYMD);
    }

    //获取某月第一天
    static getMonthFirst(myData) {
        let date = new Date(myData);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            return year + "-0" + month + "-01";
        } else {
            return year + "-" + month + "-01";
        }
    }

    //获取某月最后一天
    static getMonthLast(myDate) {
        let date = new Date(myDate);
        let currentMonth = date.getMonth();
        let nextMonth = ++currentMonth;
        let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        let oneDay = 1000 * 60 * 60 * 24;
        let lastTime = new Date(nextMonthFirstDay - oneDay);
        let month = parseInt(lastTime.getMonth() + 1);
        let day = lastTime.getDate();
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        return this.dateFormat(new Date(date.getFullYear() + '-' + month + '-' + day), 'yyyy-MM-dd');
    }

    //获取当月第一天
    static getCurrentMonthFirstDay() {
        let date = new Date();
        date.setDate(1)
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        return date.getFullYear() + '-' + month + '-' + day
    }

    //获取当月最后一天
    static getCurrentMonthLastDay() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month
        let day = new Date(year, month, 0)
        return year + '-' + month + '-' + day.getDate();
    }

    //获取本周第一天
    static getWeekStartDate() {
        let now = new Date(); //当前日期
        let nowDayOfWeek = now.getDay(); //今天本周的第几天
        let nowDay = now.getDate(); //日
        nowDayOfWeek = nowDayOfWeek == 0 ? 7 : nowDayOfWeek; // 如果是周日，就变成周七
        let weekStartDate = new Date(now.getFullYear(), now.getMonth(), nowDay - nowDayOfWeek + 1);
        return this.dateFormat(weekStartDate, fmtYMD);
    }

    //获取本周最后一天
    static getWeekEndDate() {
        let now = new Date(); //当前日期
        let nowDayOfWeek = now.getDay(); //今天本周的第几天
        let nowDay = now.getDate(); //日
        nowDayOfWeek = nowDayOfWeek == 0 ? 7 : nowDayOfWeek; // 如果是周日，就变成周七
        let weekEndDate = new Date(now.getFullYear(), now.getMonth(), nowDay + (6 - nowDayOfWeek + 1));
        return this.format(weekEndDate, fmtYMD);
    }

    //获取给定日期是周几
    static getWeekDay(date,fmt='星期'){
        let day = this.parserDate(date).getDay();
        let result = fmt;
        switch (day) {
            case 0:result += (fmt === '星期' ? '天' : '日');break;
            case 1:result +='一';break;
            case 2:result +='二';break;
            case 3:result +='三';break;
            case 4:result +='四';break;
            case 5:result +='五';break;
            case 6:result +='六';break;
        }
        return result;
    }

    //日期相加 date日期  type格式 offSet偏移量
    static addTime(date, type, fmt, offSet) {
        offSet = offSet || 1;//默认偏移量为1
        if (type == 'd') {//天
            fmt = fmt || fmtYMD;
            return this.dateFormat(new Date(this.parserDate(date).getTime() + offSet * 24 * 60 * 60 * 1000), fmt);
        } else if (type == 'h') {//小时
            fmt = fmt || fmtYMDHMS;
            return this.dateFormat(new Date(this.parserDate(date).getTime() + offSet * 60 * 60 * 1000), fmt);
        } else if (type == 'm') {//分钟
            fmt = fmt || fmtYMDHM;
            return this.dateFormat(new Date(this.parserDate(date).getTime() + offSet * 60 * 1000), fmt);
        } else if (type == 's') {//秒
            fmt = fmt || fmtYMDHMS;
            return this.dateFormat(new Date(this.parserDate(date).getTime() + offSet * 1000), fmt);
        } else {
            return date;
        }
    }

    //月份相加
    static addMonth(date, months) {
        return new Date(date.getFullYear(), date.getMonth() + months);
    }

    //日期相减
    static dateDiff(beginData, endData) {
        return (this.parserDate(endData).getTime() - this.parserDate(beginData).getTime()) / (24 * 60 * 60 * 1000);
    }

    //数字格式化  num 数值(Number或者String) cent 要保留的小数位(Number)  isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
    static formatNumber(num, cent, isThousand) {
        if(this.isEmpty(num)){
            return num;
        }
        // eslint-disable-next-line no-useless-escape
        num = num.toString().replace(/\$|\,/g, '');
        // 检查传入数值为数值类型
        if (isNaN(num)) {
            num = "0";
        }
        // 获取符号(正/负数)
        let sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);  // 把指定的小数位先转换成整数.多余的小数位四舍五入
        let cents = num % Math.pow(10, cent);              // 求出小数位数值
        num = Math.floor(num / Math.pow(10, cent)).toString();   // 求出整数位数值
        cents = cents.toString();               // 把小数位转换成字符串,以便求小数位长度
        // 补足小数位到指定的位数
        while (cents.length < cent) {
            cents = "0" + cents;
        }
        if (isThousand) {
            // 对整数部分进行千分位格式化.
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
            }
        }
        if (cent > 0) {
            return (((sign) ? '' : '-') + num + '.' + cents);
        } else {
            return (((sign) ? '' : '-') + num);
        }
    }

    //数组排序   array对象数组  property排序的属性及要排序的字段  type排序数据的类型  rev:true升序false降序  默认升序
    static arraySort(array, property, type, rev) {
        if (array.length > 0) {
            return array.sort(this.compare(property, type, rev));
        } else {
            return array;
        }
    }

    //排序的比较方法
    static compare(property, type, rev) {
        return (a, b) => {
            let value1 = a[property];
            let value2 = b[property];
            let result;
            if (type == 'date') {
                result = this.dateDiff(value2, value1);
            } else {
                result = value1 - value2;
            }
            if (rev == true) {
                return result;
            } else if (rev == false) {
                return 0 - result;
            } else {
                return result;
            }
        }
    }

    static countPercent(fz,fm,fixed=2){
        let result = '';
        if(this.isEmpty(fm)||fm==0){
            result='';
        }else{
            result = (parseFloat(fz) / parseFloat(fm) * 100).toFixed(fixed)+'%';
        }
        return result;
    }

    //关键信息隐藏
    static hideCode(str, frontLen, endLen) {
        if (this.isEmpty(str)) {
            return str;
        }
        if (str.length > 3) {
            var len = str.length - frontLen - endLen;
            var xing = '';
            for (var i = 0; i < len; i++) {
                xing += '*';
            }
            return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
        } else {
            return str.substring(0, 1) + '*';
        }
    }

    //判断字符串是否是https?:|mailto:|tal: 开头的
    static isExternal(path) {
        return /^(https?:|mailto:|tel:)/.test(path)
    }

    //获取身份证信息 type 1出生日期 2性别 3年龄
    static  getIDCardInfo(IDCard, type) {
        if (type == 1) {
            //获取出生日期
            let birth = IDCard.substring(6, 10) + "-" + IDCard.substring(10, 12) + "-" + IDCard.substring(12, 14);
            return birth;
        }
        if (type == 2) {
            //获取性别
            if (parseInt(IDCard.substr(16, 1)) % 2 == 1) {
                //男
                return "男";
            } else {
                //女
                return "女";
            }
        }
        if (type == 3) {
            //获取年龄
            let myDate = new Date();
            let month = myDate.getMonth() + 1;
            let day = myDate.getDate();
            let age = myDate.getFullYear() - IDCard.substring(6, 10) - 1;
            if (IDCard.substring(10, 12) < month || IDCard.substring(10, 12) == month && IDCard.substring(12, 14) <= day) {
                age++;
            }
            return age;
        }
    }

    //获取uuid
    static guid(needCut=false) {
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        if(needCut){
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        }else{
            return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
        }
    }

    //json 字符串 转换为就送对象
    static jsonFormat(str){
        if (typeof str == 'string') {
            try {
                let obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return obj;
                }else{
                    return str;
                }
            } catch(e) {
                return str;
            }
        }else{
            return str
        }
    }

    /**
     * 深拷贝对象
     */
    static copyObject(object) {
        if(!this.isEmpty(object)){
            return JSON.parse(JSON.stringify(object))
        }else {
            return null ;
        }
    }

    //驼峰转换下划线
    static camelToUnderline(str) {
        return str.replace(/([A-Z])/g,"_$1").toLowerCase();
    }

    //下划线转换驼峰
    static underlineToCamel(str) {
        // eslint-disable-next-line no-useless-escape
        return str.replace(/\_(\w)/g, (all,letter)=>letter.toUpperCase())
    }



}

export default utils

