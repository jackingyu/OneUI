
export default {
  data() {
    return {
      Validators: {
        idCard: { title: '身份证号', value: 'idCard', pattern: '^\\d{6}(18|19|20)?\\d{2}(0[1-9]|1[012])(0[1-9]|[12]\\d|3[01])\\d{3}(\\d|[xX])$' },
        n6_16Num: { title: '6到16位数字', value: 'n6-16', pattern: /\d{6,18}/ },
        c6_16: { title: '6到16位任意字符', value: '*6-16', pattern: '^.{6,16}$' },
        url: { title: '网址', value: 'url', pattern: '^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$' },
        email: { title: '电子邮件', value: 'e', pattern: '^([\\w]+\\.*)([\\w]+)@[\\w]+\\.\\w{3}(\\.\\w{2}|)$' },
        phone: { title: '手机号码', value: 'm', pattern: '^1(3|4|5|7|8|9)\\d{9}$' },
        postcode: { title: '邮政编码', value: 'p', pattern: '^[1-9]\\d{5}$' },
        alpha: { title: '字母', value: 's', pattern: '^[A-Z|a-z]+$' },
        number: { title: '数字', value: 'n', pattern: '^-?\\d+\\.?\\d*$' },
        rnumber: { title: '数字', value: 'n', pattern: '^\\d+\\.?\\d*$' },
        rinteger: { title: '数量', value: 'n', pattern: /^[1-9]\d*$/ },
        inte: { title: '整数', value: 'z', pattern: '^-?\\d+$' },
        cash: { title: '金额', value: 'z', pattern: /^[1-9]\d*(\.\d{1,2})?$/ },
        money: { title: '金额', value: 'money', pattern: '^(([1-9][0-9]*)|([0]\\.\\d{0,2}|[1-9][0-9]*\\.\\d{0,2}))$' },
      }
    }
  },
  methods: {
    ruleWith(validatorName) {
      if (this.Validators[validatorName]) {
        let valid = this.Validators[validatorName]
        return {
          pattern: valid.pattern,
          message: `${valid.title}格式不正确`
        }
      }
      return {
        pattern: '^.*$',
        message: `格式不正确`
      }
    },
    ruleWithDefault(message = "", required = true) {
      return { required: required, message, whitespace: true }
    }
  }
}