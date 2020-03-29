export const formItems = [
  {
    label: '项目',
    valueKey: 'projectId',
    inputType: 'select',
    required: true,
    settlementType: '',
    order: 4,
    tableRender: function (rowData = {}) {
      return rowData.projectName || rowData.projectId_dictText
    }
  },
  {
    label: '合同',
    valueKey: 'contractNumber',
    inputType: 'select',
    required: true,
    settlementType: '',
    noTable: true,
    tableRender: function (rowData = {}) {
      return rowData.contractTitle
    }
  },
  {
    label: '行项目号',
    valueKey: 'contractItemId',
    inputType: 'select',
    required: true,
    settlementType: '',
    order: 0,
    tableRender: function (rowData = {}) {
      return rowData.contractItemNo
    }
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
    order: 1,
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
    order: 2,
    tableRender: function (rowData = {}) {
      return rowData.materialName || rowData.materialId_dictText
    },
    evalue: function (rowData = {}) {
      return rowData.materialName || rowData.materialId_dictText
    }
  },
  {
    label: '合同内容',
    valueKey: 'contractContent',
    inputType: 'label',
    readOnly: true,
    settlementType: '',
    order: 3,
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
    order: 4,
    evalue: function (currentCRowData = {}) {
      if (currentCRowData.unitPrice) {
        return currentCRowData.unitPrice + ' / ' + currentCRowData.unitCode_dictText
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
    order: 5,
    settlementType: '',
  },
  {
    label: '合价',
    valueKey: 'totalAmount',
    inputType: 'label',
    readOnly: true,
    justShow: true,
    order: 6,
    settlementType: ''

  }
]