export const formItems = [
  {
    label: '项目',
    valueKey: 'projectId',
    inputType: 'select',
    required: true,
    settlementType: ''
  },
  {
    label: '物料名称',
    valueKey: 'materialId',
    inputType: 'select',
    required: true,
    settlementType: ''
  },
  {
    label: '合同内容',
    valueKey: 'contractContent',
    inputType: 'input',
    required: true,
    settlementType: ''
  },
  {
    label: '合同',
    valueKey: 'contractId',
    inputType: 'select',
    required: true,
    settlementType: ''
  },
  {
    label: '合同行项目',
    valueKey: 'contractItemId',
    inputType: 'select',
    required: true,
    settlementType: ''
  },
  {
    label: '数量',
    valueKey: 'quantity',
    inputType: 'input',
    required: true,
    settlementType: '',
    suffix: {
      label: '单位',
      valueKey: 'unitCode',
      inputType: 'dict',
      required: true,
      dict: 'unit',
      settlementType: ''
    }
  },
  {
    label: '单价',
    valueKey: 'unitPrice',
    inputType: 'input',
    required: true,
    settlementType: '',
  },
  {
    label: '合价',
    valueKey: 'total',
    inputType: 'label',
    readOnly: true,
    justShow: true,
    settlementType: '',
    evalue: function (unitPrice = 0, quantity = 0) {
      let val = unitPrice * quantity
      return isNaN(val) ? 0 : val.toFixed(2)
    }
  }
]