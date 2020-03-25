
export default {
  computed: {
    multipage() {
      return this.$store.state.app.multipage
    }
  },
  methods: {
    closePathFreshDetail(id) {
      if (this.form) {
        this.form.resetFields()
      }
      try {
        if (this.multipage) {
          this.$store.state.app.closedCmdTabkey = this.$route.fullPath
          this.$router.push({
            path: this.$route.path,
            query: {
              id
            }
          })
        } else {
          this.$router.replace({
            path: this.$route.path,
            query: {
              id
            }
          })
        }
      } catch (error) {
        location.href = `${this.$route.path}?id=${id}&t=${+new Date()}`
      }

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