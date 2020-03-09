export const formItems = [
  {
    label: '项目',
    valueKey: 'projectId',
    inputType: 'select',
    contractType: ''
  },
  {
    label: '物料名称',
    valueKey: 'materialId',
    inputType: 'select',
    contractType: ''
  },
  {
    label: '合同内容',
    valueKey: 'contractContent',
    inputType: 'input',
    contractType: ''
  },
  {
    label: '合同',
    valueKey: 'contractId',
    inputType: 'select',
    contractType: ''
  },
  {
    label: '合同行项目',
    valueKey: 'contractItemId',
    inputType: 'select',
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
    evalue: function (unitPrice = 0, quantity = 0) {
      let val = unitPrice * quantity
      return isNaN(val) ? 0 : val.toFixed(2)
    }
  },


]