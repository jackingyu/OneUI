<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" title="基础信息" :bordered="false">
        <supplier-form ref="repository" :showSubmit="false" />
      </a-card>
      <!-- table -->
      <a-card class="card" title="银行账号">
        <form :autoFormCreate="(form) => this.form = form">
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
                @change="val => handleChange(val, record.key, col)"
              />
              <j-bank-select-tag
                async
                :master="false"
                :value="record.subBranchId"
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
            @click="newMember"
          >新增成员</a-button>
        </form>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button>暂存</a-button>
        <a-divider type="vertical" />
        <a-button type="primary" @click="validate" :loading="loading">提交审批</a-button>
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import SupplierForm from './modules/form/SupplierForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import { getBanks } from '@/api/api'
export default {
  name: 'AdvancedForm',
  components: {
    PageView,
    FooterToolBar,
    JBankSelectTag,
    SupplierForm
  },
  data() {
    return {
      description: '高级表单常见于一次性输入和提交大批量数据的场景。',
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
    window.thiz = this
  },
  methods: {
    loadMasterBanks() {
      getBanks().then(res => {
        if (res.success) {
          this.banks = res.result.map(item => {
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
        key: '-1',
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
    },
    saveRow(key) {
      let target = this.data.filter(item => item.key === key)[0]
      target.editable = false
      target.isNew = false
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
      }
    },

    // 最终全页面提交
    validate() {
      this.$refs.repository.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 24px;
}
</style>