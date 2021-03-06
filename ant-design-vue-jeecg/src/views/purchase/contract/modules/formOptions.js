export const formItems = [
  {
    label: '合同行编号',
    valueKey: 'itemNo',
    inputType: 'input',
    readOnly: true,
    hidden: true,
    required: false,
    contractType: ''
  },
  {
    label: '物料分组',
    valueKey: 'materialGroupCode',
    inputType: 'dict',
    dict: 'material_group',
    noTable: true,
    required: false,
    contractType: ''
  },
  {
    label: '物料',
    valueKey: 'materialId',
    inputType: 'select',
    required: true,
    contractType: ''
  },
  {
    label: '合同内容',
    valueKey: 'materialDescription',
    inputType: 'textarea',
    required: true,
    contractType: ''
  },
  {
    label: '数量',
    valueKey: 'quantity',
    inputType: 'input',
    required: true,
    contractType: '',
    suffix_1: {
      label: '单位',
      valueKey: 'unitCode',
      inputType: 'dict',
      required: true,
      dict: 'unit',
      contractType: ''
    }
  },
  {
    label: '单位',
    valueKey: 'unitCode',
    inputType: 'dict',
    required: true,
    dict: 'unit',
    contractType: ''
  },
  {
    label: '单价',
    valueKey: 'unitPrice',
    inputType: 'input',
    required: true,
    contractType: '',
  },
  {
    label: '合价',
    valueKey: 'total',
    inputType: 'label',
    readOnly: true,
    justShow: true,
    required: false,
    contractType: '',
    evalue: function (unitPrice = 0, quantity = 0) {
      let val = unitPrice * quantity
      return isNaN(val) ? 0 : val.toFixed(2)
    }
  },
  {
    label: '约定税率',
    valueKey: 'taxRate',
    inputType: 'dict',
    dict: 'tax_rate',
    required: true,
    contractType: ''
  },
  {
    label: '验收标准',
    valueKey: 'acceptanceCriteria',
    inputType: 'input',
    required: true,
    contractType: 'st'
  },
  {
    label: '合同工期',
    valueKey: 'contractSchedule',
    inputType: 'input',
    required: true,
    contractType: 'st'
  },
  {
    label: '质量标准',
    valueKey: 'qualityStandard',
    inputType: 'input',
    required: true,
    contractType: 'st'
  },
  {
    label: '付款方式',
    valueKey: 'paymentMethodCode',
    inputType: 'dict',
    required: true,
    dict: 'payment_method',
  },
  {
    label: '付款节点',
    valueKey: 'paymentTerm',
    inputType: 'input',
    required: true,
    contractType: 'st'
  },
  {
    label: '保修期限',
    valueKey: 'warranty',
    inputType: 'input',
    required: true,
    contractType: 'subpack'
  },
  {
    label: '保修条款',
    valueKey: 'warrantyAgreement',
    inputType: 'input',
    required: true,
    contractType: 'subpack'
  }
]