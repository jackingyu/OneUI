<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" :bordered="false">
        <invoice-form ref="invoice" :showSubmit="false" />
      </a-card>
      <!-- table -->
      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="info" @click="back('/purchase/invoices')">返回供应商发票列表</a-button>
        <a-divider type="vertical" />
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
import { getInvoices, getInvoice, createInvoice, updateInvoice, delInvoice } from '@/api/api'
import { mapActions, mapGetters, mapState } from 'vuex'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
export default {
  name: 'Invoice',
  components: {
    PageView,
    FooterToolBar,
    InvoiceForm
  },
  mixins: [FormPageActionMixin],
  data() {
    return {
      cType: '',
      loading: false,
      model: {},
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
        this.$refs.invoice.add()
      }
    },
    $loadData(id) {
      getInvoice(id).then(res => {
        if (res.success) {
          this.model = res.result
          this.$refs.invoice.edit(res.result)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    submitInvoice(postData) {
      this.loading = true
      let promises
      if (postData.id) {
        promises = updateInvoice(postData)
      } else {
        promises = createInvoice(postData)
      }
      promises
        .then(res => {
          if (res.success) {
            if (res.result.id && !this.model.id) {
              this.closePathFreshDetail(res.result.id)
            }
            this.$loadData(res.result.id)
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
            'unitCode',
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