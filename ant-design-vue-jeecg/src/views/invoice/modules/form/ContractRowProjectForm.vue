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
          <a @click="edit(record.key)">编辑</a>
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

let columns = contractType => {
  return formItems
    .filter(item => !item.contractType || item.contractType == contractType)
    .map(item => {
      return {
        title: item.label,
        dataIndex: item.valueKey,
        key: item.valueKey,
        scopedSlots: { customRender: 'text' }
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
      data: []
    }
  },
  watch: {
    data(n) {
      this.setForm(this.data)
    }
  },
  computed: {
    columns() {
      let cl = columns(this.contractType)
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
    contract(v) {
      this.contractType = v
    },
    edit(banks) {
      this.data = banks.map(item => {
        return {
          ...item,
          key: item.key || item.id
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
      this.data.push({
        key: row.id || `${-new Date()}`,
        ...row
      })
    },
    newMember() {
      if (!this.contractType) {
        this.$message.error('请先选择合同类型')
        return
      }
      this.$refs.projectModal.add()
    },
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
      this.setForm(this.data)
    },
    edit(key) {
      let target = this.data.filter(item => item.key === key)[0]
      target = {
        ...target,
        materialCode: {
          key: target.materialCode,
          label: target.materialName
        },
        taxRate: {
          key: target.taxRate,
          label: target.taxRate
        }
      }
      this.$refs.projectModal.edit(target)
    },
    getRowByKey(key, newData) {
      const data = this.data
      return (newData || data).filter(item => item.key === key)[0]
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
        this.setForm(this.data)
      }
    }
  }
}
</script>

<style scoped>
</style>