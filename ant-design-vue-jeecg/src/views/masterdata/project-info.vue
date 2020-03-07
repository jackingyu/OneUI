<template>
  <page-view>
    <div slot="route-view">
      <a-card>
        <detail-list title="基础信息">
          <project-form ref="repository" :showSubmit="false" />
        </detail-list>
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
import ProjectForm from './modules/form/ProjectForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import PageView from '@comp/layouts/PageView'
import DetailList from '@/components/tools/DetailList'
export default {
  name: 'AdvancedForm',
  components: {
    DetailList,
    PageView,
    FooterToolBar,
    ProjectForm
  },
  data() {
    return {
      description: '高级表单常见于一次性输入和提交大批量数据的场景。',
      loading: false,
      // table
      columns: [
        {
          title: '银行名称',
          dataIndex: 'bankName',
          key: 'bankName',
          width: '20%',
          scopedSlots: { customRender: 'bankName' }
        },
        {
          title: '支行',
          dataIndex: 'subBranchName',
          key: 'subBranchName',
          width: '25%',
          scopedSlots: { customRender: 'subBranchName' }
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
          width: '20%',
          scopedSlots: { customRender: 'bankAccountName' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: []
    }
  },
  methods: {
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