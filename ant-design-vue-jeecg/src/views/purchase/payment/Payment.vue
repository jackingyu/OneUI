<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" :bordered="false">
        <payment-form ref="payform" :showSubmit="false" />
        <a-divider style="margin-bottom: 32px" />
        <!-- <detail-list title="银行账号">
          <bank-form ref="bank" single :showSubmit="false" />
        </detail-list>-->
        <!-- <a-divider style="margin-bottom: 32px" /> -->
        <detail-list title="附件"></detail-list>
      </a-card>
      <!-- table -->
      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="info" @click="back('/purchase/payments')">返回供应商付款列表</a-button>
        <!-- <a-divider type="vertical" />
        <a-button type="info" @click="validate" :loading="loading">暂存</a-button>-->
        <template v-if="!!model.id && !!model.allowedToApprove">
          <a-divider type="vertical" />
          <a-button type="primary" @click="e=>validate(true)" :loading="loading">提交审批</a-button>
        </template>
        <template v-if="!model.id || !!model.editable">
          <a-divider type="vertical" />
          <a-button type="info" @click="e=>validate(false)" :loading="loading">暂存</a-button>
        </template>
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'
import DetailList from '@/components/tools/DetailList'
import PaymentForm from './modules/form/PaymentForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import {
  getVendorPayment,
  getVendorPayments,
  createVendorPayment,
  updateVendorPayment,
  approveVendorPayment
} from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
import BankForm from './modules/form/BankForm'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
export default {
  name: 'Payment',
  components: {
    PageView,
    FooterToolBar,
    DetailList,
    PaymentForm,
    BankForm
  },
  mixins: [FormPageActionMixin],
  data() {
    return {
      loading: false,
      model: {}
    }
  },
  mounted() {
    this.initModel()
  },
  updated() {
    if (this.model.id != this.$route.query.id) {
      this.initModel()
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    initModel() {
      let { id = undefined } = this.$route.query
      if (id) {
        this.$loadData(id)
      } else {
        this.$refs.payform.add()
      }
    },
    $loadData(id) {
      getVendorPayment(id).then(res => {
        if (res.success) {
          this.model = res.result
          this.$refs.payform.edit(res.result)
          // let bankModel = pick(res.result, 'bankId', 'bankName', 'bankAccountId', 'subBranchId')
          // bankModel.bankAccount = bankModel.bankAccountId
          // bankModel.key = -new Date()
          // delete bankModel.bankAccountId
          // this.$refs.bank.edit([bankModel])
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    submitPayment(postData) {
      this.loading = true
      let promises
      if (this.model.id) {
        postData = {
          ...postData,
          id: this.model.id
        }
      }
      if (postData.id) {
        promises = updateVendorPayment(postData)
      } else {
        promises = createVendorPayment(postData)
      }
      promises
        .then(res => {
          if (res.success) {
            if (res.result.id && !this.model.id) {
              this.closePathFreshDetail(res.result.id)
            }
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    approve(postData) {
      this.loading = true
      if (!this.model.id) {
        return
      }
      postData = {
        ...this.model,
        ...postData,
        id: this.model.id
      }
      approveVendorPayment(postData)
        .then(res => {
          if (res.success) {
            this.$loadData(this.model.id)
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
    validate(isApprove) {
      const canDo =
        (isApprove && this.model.allowedToApprove) || (!isApprove && (!this.model.id || this.model.editable))
      if (!canDo) {
        return
      }
      let that = this
      that.$refs.payform.form.validateFields((err, values) => {
        console.info('payform', values)
        if (!err) {
          let postData = {
            ...values,
            paymentDate: values.paymentDate + ' 00:00:00'
          }
          delete postData.accounts
          if (!isApprove) {
            that.submitPayment(postData)
          } else {
            that.approve(postData)
          }
          // this.$refs.bank.form.validateFields((err2, {data}) => {
          //   let banks
          //   if (data instanceof Array) {
          //     banks = data
          //   } else {
          //     banks = JSON.parse(data)
          //   }
          //   if (banks.length > 0) {
          //     let bankModel = banks[0]
          //     debugger
          //     delete bankModel.key
          //     postData = {
          //       ...postData,
          //       ...bankModel,
          //       bankAccountId: bankModel.bankAccount
          //     }
          //     this.submitPayment(postData)
          //   } else {
          //     this.$message.warning('请填写完整的账号信息')
          //   }
          // })
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