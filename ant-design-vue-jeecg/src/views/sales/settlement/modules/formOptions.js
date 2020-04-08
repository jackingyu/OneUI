export const formItems = [
  {
    label: '项目',
    valueKey: 'projectId',
    inputType: 'select',
    required: true,
    settlementType: '',
    evalueTable: function (kv) {
      return kv.projectId_dictText
    }
  },
  {
    label: '物料名称',
    valueKey: 'materialId',
    inputType: 'select',
    required: true,
    settlementType: '',
    evalueTable: function (kv) {
      return kv.materialId_dictText
    }
  },
  {
    label: '合同实施内容',
    valueKey: 'contractContent',
    inputType: 'input',
    required: true,
    settlementType: ''
  },
  {
    label: '月份',
    valueKey: 'clearPeriod',
    inputType: 'month',
    required: true,
    settlementType: ''
  },
  {
    label: '数量',
    valueKey: 'quantity',
    inputType: 'input',
    required: true,
    settlementType: '',
  },
  {
    label: '单位',
    valueKey: 'unitCode',
    inputType: 'dict',
    required: true,
    dict: 'unit',
    settlementType: '',
    evalueTable: function (kv) {
      return kv.unitCode_dictText
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
    evalue: function (record) {
      let unitPrice = record.unitPrice, quantity = record.quantity
      let val = unitPrice * quantity
      return isNaN(val) ? 0 : val.toFixed(2)
    }
  }
]