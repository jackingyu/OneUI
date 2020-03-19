export const formItems = [
  {
    label: '项目',
    valueKey: 'projectId',
    inputType: 'select',
    required: true,
    settlementType: '',
    tableRender: function (rowData = {}) {
      return rowData.projectName
    }
  },
  {
    label: '合同',
    valueKey: 'contractNumber',
    inputType: 'select',
    required: true,
    settlementType: '',
    tableRender: function (rowData = {}) {
      return rowData.contractTitle
    }
  },
  {
    label: '合同行项目',
    valueKey: 'contractItemId',
    inputType: 'select',
    required: true,
    settlementType: ''
  },
  // {
  //   inputType: 'space',
  // },
  {
    label: '合同编码',
    valueKey: 'contractId',
    inputType: 'label',
    readOnly: true,
    justShow: true,
    settlementType: '',
    tableRender: function (rowData = {}) {
      return rowData.contractNumber
    },
    evalue: function (currentCRowData = {}) {
      return currentCRowData.contractNumber || ''
    }
  },
  {
    label: '物料名称',
    valueKey: 'materialName',
    inputType: 'label',
    readOnly: true,
    justShow: true,
    settlementType: '',
    evalue: function (currentCRowData = {}) {
      return currentCRowData.materialName || ''
    }
  },
  {
    label: '合同内容',
    valueKey: 'contractContent',
    inputType: 'label',
    readOnly: true,
    settlementType: '',
    evalue: function (currentCRowData = {}) {
      return currentCRowData.contractContent || currentCRowData.materialDescription || ''
    }
  },
  {
    label: '单价',
    valueKey: 'unitPrice',
    inputType: 'label',
    required: true,
    settlementType: '',
    evalue: function (currentCRowData = {}) {
      if (currentCRowData.unitPrice) {
        return currentCRowData.unitPrice + ' / ' + currentCRowData.unitName
      }
      return ''
    }
  },
  {
    label: '数量',
    valueKey: 'quantity',
    inputType: 'input',
    required: true,
    ruleKey: 'rnumber',
    settlementType: '',
  },
  {
    label: '合价',
    valueKey: 'totalAmount',
    inputType: 'label',
    readOnly: true,
    justShow: true,
    settlementType: ''

  }
]