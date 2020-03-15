<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" :bordered="false">
        <payment-form ref="payform" :showSubmit="false" />
      </a-card>
      <!-- table -->
      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
        <!-- <a-divider type="vertical" />
        <a-button type="info" @click="validate" :loading="loading">暂存</a-button>-->
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'
import PaymentForm from './modules/form/PaymentForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import { getVendorPayment, getVendorPayments, createVendorPayment, updateVendorPayment } from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'Payment',
  components: {
    PageView,
    FooterToolBar,
    PaymentForm
  },
  data() {
    return {
      loading: false,
      model: {}
    }
  },
  // computed: {
  //   orgCode() {
  //     return this.userInfo().orgCode
  //   }
  // },
  mounted() {
    this.initModel()
  },
  methods: {
    ...mapGetters(['userInfo']),
    initModel() {
      let { id = undefined } = this.$route.query
      if (id) {
        getVendorPayment(id).then(res => {
          if (res.success) {
            this.model = res.result
            this.$refs.payform.edit(res.result)
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$refs.payform.add()
      }
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
      that.$refs.payform.form.validateFields((err, values) => {
        console.info('payform', values)
        if (!err) {
          let postData = {
            ...values,
            paymentDate: values.paymentDate + ' 00:00:00'
          }
          this.submitPayment(postData)
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