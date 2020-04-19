<template>
  <a-form :form="form" class="form">
    <a-form-item v-show="false">
      <a-input v-decorator="['data']" />
    </a-form-item>
    <a-table :columns="columns" :dataSource="data" :pagination="false">
      <template
        v-for="(col, i) in ['bankId', 'subBranchId','bankAccount','bankAccountName']"
        :slot="col"
        slot-scope="text, record, index"
      >
        <j-bank-select-tag
          v-if="'bankId'==col"
          :dictOptions="banks"
          :value="record.bankId"
          placeholder="请选择银行"
          :disabled="!record.editable"
          @change="val => handleChange(val, record.key, col)"
        />
        <j-bank-select-tag
          async
          :master="false"
          :disabled="!record.editable"
          @change="val => handleChange(val, record.key, col)"
          :dictOptions="defaultOptions(record)"
          :value="record.subBranchId"
          :searchWord="defaultSearchWord(record)"
          v-else-if="'subBranchId'==col"
          placeholder="请选择支行"
          :dict="record.bankId"
        />
        <a-input
          :key="col"
          v-else-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          :placeholder="columns[i].title"
          @change="e => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>{{ text }}</template>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <template v-if="record.editable">
          <span v-if="record.isNew">
            <a @click="saveRow(record.key)">添加</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="saveRow(record.key)">保存</a>
            <a-divider type="vertical" />
            <a @click="cancel(record.key)">取消</a>
          </span>
        </template>
        <span v-else>
          <a @click="toggle(record.key)">编辑</a>
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
      v-if="!single ||(single && data.length==0)"
      @click="newMember"
    >新增账号</a-button>
  </a-form>
</template>

<script>
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import { getBanks } from '@/api/api'
export default {
  name: 'BankForm',
  components: {
    JBankSelectTag
  },
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      // table
      columns: [
        {
          title: '银行名称',
          dataIndex: 'bankId',
          key: 'bankId',
          width: '15%',
          scopedSlots: { customRender: 'bankId' }
        },
        {
          title: '支行',
          dataIndex: 'subBranchId',
          key: 'subBranchId',
          width: '35%',
          scopedSlots: { customRender: 'subBranchId' }
        },
        {
          title: '账号',
          dataIndex: 'bankAccount',
          key: 'bankAccount',
          width: '20%',
          scopedSlots: { customRender: 'bankAccount' }
        },
        {
          title: '账号名称',
          dataIndex: 'bankAccountName',
          key: 'bankAccountName',
          width: '15%',
          scopedSlots: { customRender: 'bankAccountName' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      banks: [],
      data: []
    }
  },
  created() {
    this.loadMasterBanks()
  },
  methods: {
    edit(banks) {
      this.data = banks.map(item => {
        return {
          ...item,
          editable: false,
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
    loadMasterBanks() {
      let that = this
      getBanks().then(res => {
        if (res.success) {
          that.banks = res.result.map(item => {
            return {
              text: item.bank_name,
              title: item.bank_name,
              value: `${item.bank_id}`
            }
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleSubmit(e) {
      e.preventDefault()
    },
    newMember() {
      this.data.push({
        key: `${-new Date()}`,
        id: '',
        bankAccount: '',
        bankAccountName: '',
        bankId: '',
        bankName: '',
        createTime: '',
        subBranchId: '',
        subBranchName: '',
        editable: true,
        isNew: true
      })
    },
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
      this.setForm(this.data)
    },
    saveRow(key) {
      let target = this.data.filter(item => item.key === key)[0]
      target.editable = false
      target.isNew = false
      this.setForm(this.data)
    },
    toggle(key) {
      let target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    getRowByKey(key, newData) {
      const data = this.data
      return (newData || data).filter(item => item.key === key)[0]
    },
    cancel(key) {
      let target = this.data.filter(item => item.key === key)[0]
      target.editable = false
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