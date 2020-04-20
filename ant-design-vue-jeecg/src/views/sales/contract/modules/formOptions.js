export const formItems = [
  {
    label: '合同编号',
    valueKey: 'salesContractCode',
    inputType: 'input',
    required: true,
    baseField: true,
    contractType: ''
  },
  {
    label: '客户',
    valueKey: 'customerId',
    inputType: 'select',
    required: true,
    baseField: true,
    contractType: ''
  },
  {
    label: '项目名称',
    valueKey: 'projectId',
    inputType: 'select',
    required: false,
    baseField: true,
    contractType: ''
  },
  {
    label: '合同类型',
    valueKey: 'contractTypeCode',
    inputType: 'dict',
    required: true,
    baseField: true,
    dict: 'sales_settlement_type',
    contractType: '',
  },
  {
    label: '合同生效日期',
    valueKey: 'contractEffectDate',
    inputType: 'date',
    required: true,
    baseField: true,
    contractType: ''
  },
  {
    label: '状态',
    valueKey: 'status_dictText',
    inputType: 'label',
    readOnly: true,
    baseField: true,
    contractType: ''
  },
  {
    label: '联系人',
    valueKey: 'contactPerson',
    inputType: 'label',
    readOnly: true,
    contractType: ''
  },
  {
    label: '联系电话',
    valueKey: 'contactPersonMobile',
    inputType: 'label',
    readOnly: true,
    contractType: ''
  },
  {
    label: '担保人',
    valueKey: 'guarantor',
    inputType: 'input',
    required: true,
    contractType: 'st'
  },
  {
    label: '身份证号码',
    valueKey: 'contactPersonId',
    inputType: 'input',
    ruleKey: 'idCard',
    required: true,
    contractType: 'st'
  },
  {
    label: '项目地址',
    valueKey: 'projectAddress',
    inputType: 'input',
    required: true,
    contractType: 'st'
  },
  {
    label: '数量',
    valueKey: 'quantity',
    inputType: 'input',
    required: true,
    ruleKey: 'rinteger',
    contractType: 'st',
  },
  {
    label: '泵费单价',
    valueKey: 'bfUnitPrice',
    inputType: 'input',
    required: true,
    ruleKey: 'cash',
    contractType: 'st',
  },
  {
    label: '运费增加',
    valueKey: 'deliverCostAdjust',
    inputType: 'input',
    required: true,
    ruleKey: 'cash',
    contractType: 'st',
  },
  {
    label: '计量误差',
    valueKey: 'measureError',
    inputType: 'input',
    required: true,
    contractType: 'st',
  },
  {
    label: '税票约定',
    valueKey: 'invoiceAgreement',
    inputType: 'dict',
    dict: 'invoice_agreement',
    required: true,
    contractType: 'st',
  },
  {
    label: '约定税率',
    valueKey: 'taxRate',
    inputType: 'input',
    required: true,
    ruleKey: 'rinteger',
    contractType: ''
  },
  {
    label: '付款节点',
    valueKey: 'paymentTerms',
    inputType: 'input',
    required: true,
    contractType: ''
  },
  {
    label: '支付方式',
    valueKey: 'paymentMethodCode',
    inputType: 'input',
    required: true,
    contractType: 'st',
  },
  {
    label: '延期付款约定',
    valueKey: 'overduePaymentTerms',
    inputType: 'input',
    required: true,
    contractType: 'st',
  },
  {
    label: '中标总价',
    valueKey: 'bidAmount',
    inputType: 'input',
    required: true,
    ruleKey: 'cash',
    contractType: 'js',
  },
  {
    label: '结算方式',
    valueKey: 'clearMethodCode',
    inputType: 'dict',
    required: true,
    dict: 'clear_method',
    contractType: 'js',
  },
  {
    label: '合同金额',
    valueKey: 'contractAmount',
    inputType: 'input',
    required: true,
    ruleKey: 'cash',
    contractType: 'js',
  },
  {
    label: '工期目标',
    valueKey: 'scheduleTarget',
    inputType: 'input',
    required: true,
    contractType: 'js',
  },
  {
    label: '质量目标',
    valueKey: 'qualityTarget',
    inputType: 'input',
    required: true,
    contractType: 'js',
  },
  {
    label: '保修期限',
    valueKey: 'warranty',
    inputType: 'input',
    required: true,
    contractType: 'js',
  },
  {
    label: '安全目标',
    valueKey: 'safetyTarget',
    inputType: 'input',
    required: true,
    contractType: 'js',
  },
  {
    label: '监理单位',
    valueKey: 'supervisionPartner',
    inputType: 'input',
    required: true,
    contractType: 'js',
  },
  {
    label: '总监',
    valueKey: 'director',
    inputType: 'input',
    required: true,
    contractType: 'js',
  },
  {
    label: '项目经理',
    valueKey: 'projectManager',
    inputType: 'input',
    required: true,
    contractType: 'subpack'
  },
  {
    label: '违约责任',
    valueKey: 'contractBreak',
    inputType: 'input',
    required: true,
    contractType: 'subpack'
  }
]