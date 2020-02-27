<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" title="基础信息" :bordered="false">
        <supplier-form ref="supplier" :showSubmit="false" />
      </a-card>
      <!-- table -->
      <a-card class="card" title="银行账号">
        <bank-form ref="bank" :showSubmit="false" />
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'
import SupplierForm from './modules/form/SupplierForm'
import BankForm from './modules/form/BankForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import { getBanks, getSuplier, createVendor, updateVendor } from '@/api/api'

export default {
  name: 'AdvancedForm',
  components: {
    PageView,
    FooterToolBar,
    BankForm,
    SupplierForm
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.initModel()
  },
  methods: {
    initModel() {
      let { id = undefined } = this.$route.query
      if (id) {
        getSuplier(id).then(res => {
          if (res.success) {
            this.$refs.supplier.edit(res.result)
            this.$refs.bank.edit(res.result.bankAccounts)
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$refs.supplier.add()
      }
    },
    submitSupplier(postData) {
      this.loading = true
      let promises
      if (postData.id) {
        promises = updateVendor(postData)
      } else {
        promises = createVendor(postData)
      }
      promises
        .then(res => {
          if (res.success) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 最终全页面提交
    validate() {
      let that = this
      that.$refs.supplier.form.validateFields((err, values) => {
        console.info('supplier', values)
        if (!err) {
          let postData = pick(
            values,
            'id',
            'vendorCode',
            'vendorName',
            'vendorGroupCode',
            'contactPerson',
            'contactPhone',
            'contactPersonId',
            'socialCreditCode',
            'taxSubject',
            'businessLicense',
            'taxCode'
          )
          that.$refs.bank.form.validateFields((err, values) => {
            if (!err) {
              let arData = []
              if (!(values.data instanceof Array)) {
                try {
                  arData = JSON.parse(values.data)
                } catch (error) {
                  arData = []
                }
              } else {
                arData = values.data
              }
              let banks = arData.map(item => {
                return pick(item, 'id', 'bankAccount', 'bankAccountName', 'bankId', 'subBranchId')
              })
              postData.bankAccounts = banks
              that.submitSupplier(postData)
            }
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