<template>
  <a-form :form="form" class="form">
    <a-form-item v-show="false">
      <a-input v-decorator="['data']" />
    </a-form-item>
    <a-table :columns="columns" :dataSource="data" :pagination="false">
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
    <row-project-modal :type="this.settlementTypeCode" @submit="getRowData" ref="projectModal" />
  </a-form>
</template>

<script>
import RowProjectModal from '../RowProjectModal'
import { formItems } from '../formOptions'

import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

let getColumns = thiz => {
  let settlementTypeCode = thiz.settlementTypeCode
  return formItems
    .filter(item => !item.settlementType || item.settlementType == settlementTypeCode)
    .filter(item => !item.noTable)
    .map(item => {
      let customRender = null
      if (item.dict) {
        customRender = text => {
          return filterDictText(thiz.dicts[item.dict] || [], text) || text
        }
      } else {
        customRender = (text, record) => {
          if (item.tableRender) {
            return item.tableRender(record)
          }
          return text
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
  name: 'SettlementRowProjectForm',
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
      settlementTypeCode: '',
      model: {},
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
      // initDictOptions('payment_method').then(res => {
      //   if (res.success) {
      //     this.dicts.payment_method = res.result
      //   }
      // })
    },
    settlementType(v) {
      this.settlementTypeCode = v + ''
    },
    edit(rows) {
      this.data = rows.map(item => {
        return {
          ...item,
          key: item.id || `${-new Date()}`
        }
      })
      this.setForm(this.data)
    },
    setForm(val) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ data: JSON.stringify(val) })
        this.$emit('formChange', val)
      })
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
    getRowData(row) {
      const newData = [...this.data]
      let index = newData.findIndex(item => !!row.key && row.key == item.key)
      if (index != -1) {
        newData[index] = row
        this.data = newData
      } else {
        this.data.push({
          ...row
        })
      }
    },
    newMember() {
      if (!this.settlementTypeCode) {
        this.$message.error('请先选择结算类型')
        return
      }
      this.$refs.projectModal.add({
        ...this.model,
        key: `${-new Date()}`,
        settlementTypeCode: this.settlementTypeCode
      })
    },
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
      this.setForm(this.data)
    },
    editRow(key) {
      let target = this.data.filter(item => item.key === key)[0] || {}
      this.$refs.projectModal.edit({
        ...target
      })
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