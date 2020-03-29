<template>
  <a-form :form="form" class="form">
    <a-form-item v-show="false">
      <a-input v-decorator="['data']" />
    </a-form-item>
    <a-table :columns="columns" :dataSource="data" :pagination="false">
      <!-- <template
        v-for="(col, i) in ['bankId', 'subBranchId','bankAccount','bankAccountName']"
        :slot="col"
        slot-scope="text, record, index"
      >{{ text }}</template>-->
      <span slot="text" slot-scope="text, record, index">{{ text }}</span>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <a @click="editRow(record.key)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
    <a-button
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      type="dashed"
      icon="plus"
      @click="newMember"
    >新增行项目</a-button>
    <row-project-modal :type="this.contractType" @submit="getRowData" ref="projectModal" />
  </a-form>
</template>

<script>
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import RowProjectModal from '../RowProjectModal'
import { getBanks } from '@/api/api'
import { formItems } from '../formOptions'

import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

let getColumns = thiz => {
  let contractType = thiz.contractType
  return formItems
    .filter(item => !item.contractType || item.contractType == contractType)
    .filter(item => !item.noTable)
    .map(item => {
      let customRender = null
      if (item.dict) {
        customRender = text => {
          return filterDictText(thiz.dicts[item.dict] || [], text) || text
        }
      } else if (item.valueKey == 'materialId') {
        customRender = (text, record) => {
          return record.materialName
        }
      } else if (item.evalue) {
        customRender = (text, record) => {
          return item.evalue(record.unitPrice, record.quantity)
        }
      }
      return {
        title: item.label,
        dataIndex: item.valueKey,
        key: item.valueKey,
        // scopedSlots: { customRender: 'text' },
        customRender
      }
    })
}

export default {
  name: 'ContractRowProjectForm',
  components: {
    RowProjectModal
  },
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      contractType: '',
      banks: [],
      dicts: {},
      data: []
    }
  },
  mounted() {
    this.initDictConfig()
    
  },
  watch: {
    data(n) {
      this.setForm(this.data)
    }
  },
  computed: {
    columns() {
      let cl = getColumns(this)
      return [
        ...cl,
        {
          title: '操作',
          key: 'action',
          width: 120,
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  methods: {
    initDictConfig() {
      initDictOptions('payment_method').then(res => {
        if (res.success) {
          this.dicts.payment_method = res.result
        }
      })
    },
    contract(v) {
      this.contractType = v
    },
    edit(rows) {
      this.data = rows.map(item => {
        return {
          ...item,
          key: item.itemNo || `${+new Date()}`
        }
      })
      this.$nextTick(() => {
        this.setForm(this.data)
      })
    },
    setForm(val) {
      this.form.setFieldsValue({ data: JSON.stringify(val) })
    },
    defaultSearchWord(record) {
      if (record) {
        let m = this.banks.find(item => item.value == record.bankId)
        if (m) {
          return m.text
        }
      }
      return ''
    },
    defaultOptions(item) {
      if (item && item.subBranchId) {
        return [
          {
            text: item.subBranchName,
            title: item.subBranchName,
            value: item.subBranchId
          }
        ]
      }
      return []
    },
    handleSubmit(e) {
      e.preventDefault()
    },
    getRowData(row) {
      const newData = [...this.data]
      let index = newData.findIndex(item => !!row.key && row.key == item.key)
      if (index != -1) {
        newData[index] = row
        this.data = newData
      } else {
        this.data.push({
          key: row.itemNo || `${-new Date()}`,
          ...row
        })
      }
    },
    newMember() {
      if (!this.contractType) {
        this.$message.error('请先选择合同类型')
        return
      }
      let MaxRowNum = this.data.map(item => item.itemNo).sort()
      let maxCount = 0
      if (MaxRowNum && MaxRowNum.length > 0) {
        maxCount = MaxRowNum[MaxRowNum.length - 1]
      }
      this.$refs.projectModal.add(maxCount + 10)
    },
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
      this.setForm(this.data)
    },
    editRow(key) {
      let target = this.data.filter(item => item.key === key)[0] || {}
      target = {
        ...target,
        materialObj: {
          key: target.materialId,
          label: target.materialName
        }
        // taxRate: {
        //   key: target.taxRate,
        //   label: target.taxRate
        // }
      }
      this.$refs.projectModal.edit(target)
    }
    // handleChange(value, key, column) {
    //   const newData = [...this.data]
    //   const target = newData.filter(item => key === item.key)[0]
    //   if (target) {
    //     target[column] = value
    //     this.data = newData
    //     this.setForm(this.data)
    //   }
    // }
  }
}
</script>

<style scoped>
</style>