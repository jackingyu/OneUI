
export default {
  methods: {
    closePathFreshDetail(id) {
      this.$store.state.app.closedCmdTabkey = this.$route.fullPath
      this.$router.push({
        path: this.$route.path,
        query: {
          id
        }
      })
    },
    refreshPath(path) {
      location.href = path
    },
    back(path) {
      this.$router.replace({
        path: path
      })
    },
    resetForm() {
      if (this.form) {
        this.form.resetFields()
      }
    }
  }
}