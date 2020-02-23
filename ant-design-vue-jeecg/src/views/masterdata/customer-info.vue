<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" title="基础信息" :bordered="false">
        <customer-form ref="repository" :showSubmit="false" />
      </a-card>

      <div class="drawer-bootom-button" v-show="!disableSubmit">
        <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
          <a-button style="margin-right: .8rem">取消</a-button>
        </a-popconfirm>
        <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
      </div>
    </div>
  </page-view>
</template>

<script>
import CustomerForm from './modules/form/CustomerForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import PageView from '@comp/layouts/PageView'
export default {
  name: 'AdvancedForm',
  components: {
    PageView,
    FooterToolBar,
    CustomerForm
  },
  data() {
    return {
      description: '高级表单常见于一次性输入和提交大批量数据的场景。',
      loading: false,
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