export default{
    message: {
        required: "这是必填字段",
        email: "请输入有效的电子邮件地址",
        url: "请输入有效的网址",
        date: "请输入有效的日期",
        dateISO: "请输入有效的日期 (YYYY-MM-DD)",
        dateYM: "请输入正确的日期（YYYY-MM）",
        datetime: "请输入正确的日期（YYYY-MM-DD HH:mm:ss）",
        number: "请输入有效的数字",
        digits: "只能输入整数",
        maxlength: "最多可以输入 {0} 个字符",
        minlength: "最少要输入 {0} 个字符",
        rangelength: "请输入长度在 {0} 到 {1} 之间的字符串",
        range: "请输入范围在 {0} 到 {1} 之间的数值",
        percent: "请输入范围在 {0} 到 {1} 之间的数值",
        max: "请输入不大于 {0} 的数值",
        min: "请输入不小于 {0} 的数值",
        decimal: "请精确到小数点后 {0} 位",
        mindecimal: "请至少精确到小数点后 {0} 位",
        maxdecimal: "请最多精确到小数点后 {0} 位",
        rangedecimal: "请精确到小数点后 {0} 至 {1} 位",
        IDCard: "请输入合法的身份证号码",
        phone: "请输入合法的手机号码",
        password: "密码必须符合以下要求：长度为8~16位，至少包含一个大写字母、一个小写字母、一个数字、以及一个特殊符号",
        password2: "密码必须符合以下要求：长度为8~16位，至少8个字符，至少1个大写字母，1个小写字母和1个数字",
        email2: "请输入有效的电子邮件地址",
        number_0: "请输入非零的有效数字",
        digits_0: "请输入非零的整数",
        English_0: "请输入姓名拼音(小写)",
        space: "不能输入空格"
    },

    methods: {
        //必填
        required: function (value) {
            return this.trim(value).length > 0;
        },
        //邮箱
        email: function (value,) {
            if (value == null || this.trim(value) == "") return true;
            // eslint-disable-next-line no-useless-escape
            return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
        },
        //网址
        url: function (value) {
            if (value == null || this.trim(value) == "") return true;
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
        },
        //日期
        date: function (value) {
            if (value == null || this.trim(value) == "") return true;
            return !/Invalid|NaN/.test(new Date(value).toString());
        },
        //日期（ISO）
        dateISO: function (value) {
            if (value == null || this.trim(value) == "") return true;
            // eslint-disable-next-line no-useless-escape
            return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
        },
        dateYM: function (value) {
            if (value == null || this.trim(value) == "") return true;
            // eslint-disable-next-line no-useless-escape
            return /^\d{4}[\/\-]?(0[1-9]|1[012])$/.test(value);
        },
        datetime: function (value) {
            if (value == null || this.trim(value) == "") return true;
            // eslint-disable-next-line no-useless-escape
            return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s([01][0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9])$/.test(value);
        },
        //有效的数字
        number: function (value) {
            if (value == null || this.trim(value) == "") return true;
            return /^-?\d+(?:\.\d+)?$/.test(value);
        },
        //数字
        digits: function (value) {
            if (value == null || this.trim(value) == "") return true;
            return /^-?\d+$/.test(value);
        },
        //字符串至少n个字符
        minlength: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            return value.length >= param[0];
        },
        //字符串最多n个字符
        maxlength: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            return value.length <= param[0];
        },
        //字符串长度的范围
        rangelength: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            return (value.length >= param[0] && value.length <= param[1]);
        },
        //数字大于n
        min: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            return value >= param[0];
        },
        //数字小于n
        max: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            return value <= param[0];
        },
        //数字范围n-m
        range: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            return (value * 1 >= param[0] * 1 && value * 1 <= param[1] * 1);
        },
        //百分数
        percent: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            if (value.substr(value.length - 1) === "%") {
                value = value.substr(0, value.length - 1);
            }
            return (value >= param[0] && value <= param[1]);
        },
        //小数位数n位
        decimal: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            let rex = new RegExp("^-?\\d+(.\\d{" + param[0] + "," + param[0] + "})$");
            return rex.test(value);
        },
        //小数位数至少n位
        mindecimal: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            let rex = new RegExp("^-?\\d+(.\\d{" + param[0] + ",})$");
            return rex.test(value);
        },
        //小数位数最多n位
        maxdecimal: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            let rex = new RegExp("^-?\\d+(.\\d{1," + param[0] + "})?$");
            return rex.test(value);
        },
        //小数位数范围n-m位
        rangedecimal: function (value, element, param) {
            if (value == null || this.trim(value) == "") return true;
            let rex = new RegExp("^-?\\d+(.\\d{" + param[0] + "," + param[1] + "})$");
            return rex.test(value);
        },
        //身份证号码
        IDCard: function (value) {
            if (value == null || this.trim(value) == "") return true;
            let rex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/;
            return rex.test(value);
        },
        //手机号码
        phone: function (value) {
            if (value == null || this.trim(value) == "") return true;
            let rex = /^1[345789]\d{9}$/;
            return rex.test(value);
        },
        //手机号码（前面可能含有86）
        phone86: function (value) {
            if (value == null || this.trim(value) == "") return true;
            let rex = /^(86)?1[345789]\d{9}$/;
            return rex.test(value);
        },
        //密码
        password: function (value) {
            if (value == null || this.trim(value) == "") return true;
            let rex = /^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^A-Za-z0-9\s]+)\S{8,16}$/;
            return rex.test(value);
        },
        //密码2
        password2: function (value) {
            if (value == null || this.trim(value) == "") return true;
            let rex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
            return rex.test(value);
        },
        //邮箱
        email2: function (value) {
            if (value == null || this.trim(value) == "") return true;
            // eslint-disable-next-line no-useless-escape
            let rex = /^(([a-zA-Z0-9])*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}){1,2}$/;
            return rex.test(value);
        },
        //有效的数字（非0）
        number_0: function (value) {
            if (value == null || this.trim(value) == "") return true;
            if (this.trim(value) == "0") return false;
            return /^-?\d+(?:\.\d+)?$/.test(value);
        },
        //数字（非0）
        digits_0: function (value) {
            if (value == null || this.trim(value) == "") return true;
            if (this.trim(value) == "0") return false;
            return /^-?\d+$/.test(value);
        },
        //英文字母（小写）
        English_0: function (value) {
            if (value == null) return true;
            let rex = /^[a-z]{1,100}]?$/;
            return rex.test(value);
        },
        //非空格
        space: function (value) {
            if (value == null) return true;
            let rex = /^\S+$/;
            return rex.test(value);
        },
        trim(value) {
            return value.replace(/(^\s*)|(\s*$)/g, "");
        }
    }
}
