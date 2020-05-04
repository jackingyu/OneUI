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
      <template slot="goToInvoiceDetail" slot-scope="text, record, index">
        <a :href="`/purchase/invoice?id=${record.id}`" style="width:80px">{{record.invoiceNumber}}</a>
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

//供应商付款表
export default {
  name: 'VendorInvoiceTable',
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
        // {
        //   title: '供应商名称',
        //   align: 'center',
        //   dataIndex: 'vendorName'
        // },
        {
          title: '发票号码',
          align: 'center',
          dataIndex: 'invoiceNumber',
          scopedSlots: { customRender: 'goToInvoiceDetail' }
        },
        {
          title: '开票金额',
          align: 'center',
          dataIndex: 'amount'
        },
        {
          title: '税率',
          align: 'center',
          dataIndex: 'taxRate'
        },
        {
          title: '开票日期',
          align: 'center',
          dataIndex: 'invoiceDate'
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
      this.url.list = sloter(Rest.GET_VENDOR_INVOICE_REPORT.url, year, customerId)
      this.loadData()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
