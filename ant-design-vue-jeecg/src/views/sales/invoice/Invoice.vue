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
import { getSaleInvoices, getSaleInvoice, createSaleInvoice, updateSaleInvoice } from '@/api/api'
import { formItems } from './modules/formOptions'
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
      rowFields: [],
      model: {}
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
      this.$loadData(id)
    },
    $loadData(id) {
      if (id) {
        getSaleInvoice(id).then(res => {
          if (res.success) {
            this.model = {
              ...res.result
            }
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
        promises = updateSaleInvoice(postData)
      } else {
        promises = createSaleInvoice(postData)
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
          let postData = values
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