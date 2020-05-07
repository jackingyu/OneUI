<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" :bordered="false">
        <invoice-form ref="invoice" :showSubmit="false" />

        <template>
          <a-divider style="margin-bottom: 32px" />
          <detail-list title="发票附件">
            <attach-files-form :fileScope="'70'" ref="rowfiles" :showSubmit="false" />
          </detail-list>
        </template>
      </a-card>
      <!-- table -->
      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="info" @click="back('/sales/invoices')">返回销售开票列表</a-button>
        <template v-if="!!model.id && !!model.allowedToApprove">
          <a-divider type="vertical" />
          <a-button type="primary" @click="e=>validate(true)" :loading="loading">提交审批</a-button>
        </template>
        <template v-if="!model.id || !!model.editable">
          <a-divider type="vertical" />
          <a-button
            type="info"
            @click="e=>validate(false)"
            :loading="loading"
          >{{$t('actions.submit')}}</a-button>
        </template>
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
import { getSaleInvoices, approveSaleInvoice, getSaleInvoice, createSaleInvoice, updateSaleInvoice } from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
import AttachFilesForm from '@/views/modules/attachment/AttachFilesForm.vue'
import DetailList from '@/components/tools/DetailList'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
export default {
  name: 'Invoice',
  components: {
    PageView,
    FooterToolBar,
    InvoiceForm,
    DetailList,
    AttachFilesForm
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
            this.$refs.rowfiles.edit(res.result)
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$refs.invoice.add()
      }
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
      approveSaleInvoice(postData)
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
      const canDo =
        (isApprove && this.model.allowedToApprove) || (!isApprove && (!this.model.id || this.model.editable))
      if (!canDo) {
        return
      }
      let that = this
      that.$refs.invoice.form.validateFields((err, values) => {
        console.info('invoice', values)
        if (!err) {
          let postData = values
          that.$refs.rowfiles.form.validateFields((errrr, files) => {
            if (!errrr) {
              let arData = []
              if (!(files.data instanceof Array)) {
                try {
                  arData = JSON.parse(files.data)
                } catch (error) {
                  arData = []
                }
              } else {
                arData = files.data
              }
              arData.forEach(element => {
                element.ossFileId = element.id
                delete element.key
                delete element.id
              })
              postData.attachments = arData
            }
            if (!isApprove) {
              that.submitInvoice(postData)
            } else {
              that.approve(postData)
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