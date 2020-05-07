<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card">
        <form-composer ref="contract" />
        <!-- table -->
        <template>
          <a-divider style="margin-bottom: 32px" />
          <detail-list title="合同附件">
            <attach-files-form :fileScope="'50'" ref="rowfiles" :showSubmit="false" />
          </detail-list>
        </template>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="info" @click="back('/sales/contracts')">返回销售合同列表</a-button>
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
import AttachFilesForm from '@/views/modules/attachment/AttachFilesForm.vue'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import DetailList from '@/components/tools/DetailList'
import PageView from '@comp/layouts/PageView'
import {
  getSaleContract,
  approveSaleContract,
  getSaleContracts,
  createSaleContract,
  updateSaleContract
} from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
import FormComposer from '@/views/sales/contract/modules/FormComposer'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
export default {
  name: 'Contract',
  components: {
    PageView,
    FooterToolBar,
    AttachFilesForm,
    DetailList,
    'form-composer': FormComposer
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
  created() {},
  methods: {
    ...mapGetters(['userInfo']),
    initModel() {
      let { id = undefined } = this.$route.query
      this.$loadData(id)
    },
    $loadData(id) {
      if (id) {
        getSaleContract(id).then(res => {
          if (res.success) {
            this.model = {
              ...res.result
            }
            this.$refs.contract.edit(this.model)
            this.$refs.rowfiles.edit(res.result)
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$refs.contract.add()
      }
    },
    submitContract(postData) {
      this.loading = true
      let promises
      if (this.model.id) {
        postData.id = this.model.id
        promises = updateSaleContract(postData)
      } else {
        promises = createSaleContract(postData)
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
      approveSaleContract(postData)
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
      that.$refs.contract.form.validateFields((err, values) => {
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
              that.submitContract(postData)
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