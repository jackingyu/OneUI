<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" :bordered="false">
        <invoice-form ref="invoice" :showSubmit="false" />
      </a-card>
      <!-- table -->
      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="primary" @click="validate" :loading="loading">{{$t('actions.submit')}}</a-button>
        <!-- <a-divider type="vertical" />
        <a-button type="info" @click="validate" :loading="loading">暂存</a-button>-->
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'
import InvoiceForm from './modules/form/InvoiceForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import { getSaleReceipts, getSaleReceipt, createSaleReceipt, updateSaleReceipt } from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'Invoice',
  components: {
    PageView,
    FooterToolBar,
    InvoiceForm
  },
  data() {
    return {
      cType: '',
      loading: false,
      rowFields: []
    }
  },
  computed: {
    orgCode() {
      return this.userInfo().orgCode
    }
  },
  mounted() {
    this.initModel()
  },
  created() {},
  methods: {
    ...mapGetters(['userInfo']),
    initModel() {
      let { id = undefined } = this.$route.query
      if (id) {
        getSaleReceipt(id).then(res => {
          if (res.success) {
            this.$refs.invoice.edit(res.result)
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$refs.invoice.add()
      }
    },
    submitInvoice(postData) {
      this.loading = true
      let promises
      if (postData.id) {
        promises = updateSaleReceipt(postData)
      } else {
        promises = createSaleReceipt(postData)
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
      that.$refs.invoice.form.validateFields((err, values) => {
        console.info('invoice', values)
        if (!err) {
          let postData = pick(
            values,
            'id',
            'vendorId',
            'contractContent',
            'invoiceDate',
            'amount',
            'invoiceNumber',
            'taxRate'
          )
          postData.invoiceDate = postData.invoiceDate + ' 00:00:00'
          that.submitInvoice(postData)
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