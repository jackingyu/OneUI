export const formItems = [
  {
    label: '合同行编号',
    valueKey: 'contractRowNum',
    inputType: 'input',
    readOnly: true,
    contractType: ''
  },
  {
    label: '物料类型',
    valueKey: 'materialGroupCode',
    inputType: 'dict',
    dict: 'material_group',
    contractType: ''
  },
  {
    label: '物料',
    valueKey: 'materialCode',
    inputType: 'select',
    contractType: ''
  },
  {
    label: '合同内容',
    valueKey: 'comments',
    inputType: 'textarea',
    contractType: ''
  },
  {
    label: '数量',
    valueKey: 'quantity',
    inputType: 'input',
    contractType: '',
    suffix: {
      label: '单位',
      valueKey: 'unitCode',
      inputType: 'dict',
      dict: 'unit',
      contractType: ''
    }
  },
  {
    label: '单价',
    valueKey: 'unitPrice',
    inputType: 'input',
    contractType: '',
  },
  {
    label: '合价',
    valueKey: 'total',
    inputType: 'label',
    readOnly: true,
    justShow: true,
    contractType: '',
    evalue: function (form) {
      let val = form.getFieldValue('unitPrice') * form.getFieldValue('quantity')
      return isNaN(val) ? 0 : val.toFixed(2)
    }
  },
  {
    label: '约定税率',
    valueKey: 'taxRate',
    inputType: 'select',
    contractType: ''
  },
  {
    label: '验收标准',
    valueKey: 'acceptanceCriteria',
    inputType: 'input',
    contractType: 'st'
  },
  {
    label: '合同工期',
    valueKey: 'contractSchedule',
    inputType: 'input',
    contractType: 'st'
  },
  {
    label: '质量标准',
    valueKey: 'qualityStandard',
    inputType: 'input',
    contractType: 'st'
  },
  {
    label: '付款方式',
    valueKey: 'paymentMethodCode',
    inputType: 'dict',
    dict: 'payment_method'
  },
  {
    label: '付款节点',
    valueKey: 'paymentTerm',
    inputType: 'input',
    contractType: 'st'
  },
  {
    label: '保修期限',
    valueKey: 'warranty',
    inputType: 'input',
    contractType: 'subpack'
  },
  {
    label: '保修条款',
    valueKey: 'warrantyAgreement',
    inputType: 'input',
    contractType: 'subpack'
  }
]