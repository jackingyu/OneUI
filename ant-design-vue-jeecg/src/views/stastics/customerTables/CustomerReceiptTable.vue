<template>
  <!-- table区域-begin -->
  <div>
    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="goToReceiptDetail" slot-scope="text, record, index">
        <a :href="`/sales/receipt?id=${text}`" style="width:80px">{{text}}</a>
      </template>
    </a-table>
  </div>
  <!-- table区域-end -->
</template>

<script>
import { putAction } from '@/api/manage'
import Rest, { sloter } from '@/config/api-mapper.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import moment from 'moment'
//供应商付款表
export default {
  name: 'CustomerReceiptTable',
  mixins: [JeecgListMixin],
  components: {
    JInput
  },
  data() {
    return {
      description: '',
      queryParam: {},
      materialGroups: [],
      oneTimeFlags: [],
      columns: [
        {
          title: '收款单号',
          align: 'center',
          dataIndex: 'id',
          scopedSlots: { customRender: 'goToReceiptDetail' }
        },
        {
          title: '收款方式',
          align: 'center',
          dataIndex: 'paymentMethodCode_dictText'
        },
        {
          title: '收款金额',
          align: 'center',
          dataIndex: 'amount'
        },
        {
          title: '收款日期',
          align: 'center',
          dataIndex: 'receiptDate',
          customRender: function(value, record) {
            return moment(value).format('YYYY-MM-DD')
          }
        }
      ],
      url: {
        list: 0
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    loadTable(year, customerId) {
      this.url.list = sloter(Rest.GET_CUSTOMER_SALES_RECEIPT_REPORT.url, year, customerId)
      this.loadData()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
