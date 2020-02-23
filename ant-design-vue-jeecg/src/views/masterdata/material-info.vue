<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" title="基础信息" :bordered="false">
        <material-form ref="materialForm" :showSubmit="false" />
      </a-card>
    </div>
  </page-view>
</template>

<script>
import MaterialForm from './modules/form/MaterialForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import PageView from '@comp/layouts/PageView'
export default {
  name: 'Material-InfoForm',
  components: {
    PageView,
    FooterToolBar,
    MaterialForm
  },
  data() {
    return {}
  },
  mounted() {
    this.initData()
  },
  activated() {
    this.initData()
  },
  methods: {
    initData() {
      let query = this.$route.query
      this.$refs.materialForm.edit(query)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 24px;
}
</style>