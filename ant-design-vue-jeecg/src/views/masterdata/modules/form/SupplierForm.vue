<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="供应商编号">
          <a-input
            placeholder="请输入供应商编号"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入供应商编号', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item label="供应商名称">
          <a-input
            placeholder="请输入供应商名称"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入供应商名称', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item label="供应商分组">
          <j-dict-select-tag
            v-decorator="[ 'repository.manager', {rules: [{ required: true, message: '请选择管理员'}]} ]"
            :triggerChange="true"
            placeholder="请选择供应商分组"
            dictCode="vendor_group"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="联络人">
          <a-input
            placeholder="请输入联络人"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入联络人', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item label="联系电话">
          <a-input
            placeholder="请输入联系电话"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入联系电话', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item label="社会信用代码">
          <a-input
            placeholder="请输入社会信用代码"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入社会信用代码', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="纳税人资格">
          <a-input
            placeholder="请输入纳税人资格"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入纳税人资格', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item label="营业执照号码">
          <a-input
            placeholder="请输入营业执照号码"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入营业执照号码', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item label="税务登记号">
          <a-input
            placeholder="请输入税务登记号"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入税务登记号', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="应付总额">
          <a-input
            placeholder="请输入应付总额"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入应付总额', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item label="已付总额">
          <a-input
            placeholder="请输入已付总额"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '请输入已付总额', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import JBankSelectTag from '@/components/selector/JBankSelectTag'
export default {
  name: 'SupplierForm',
  components: {
    JBankSelectTag
  },
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    validate(rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        callback('需要以 user- 开头')
      }
      callback()
    }
  }
}
</script>

<style scoped>
</style>