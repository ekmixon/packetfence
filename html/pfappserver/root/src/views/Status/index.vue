<template>
  <b-row>
    <pf-sidebar v-model="sections"></pf-sidebar>
    <b-col cols="12" md="9" xl="10" class="pt-3 pb-3">
      <transition name="slide-bottom">
        <router-view></router-view>
      </transition>
    </b-col>
  </b-row>
</template>

<script>
import pfSidebar from '@/components/pfSidebar'

export default {
  name: 'Status',
  components: {
    pfSidebar
  },
  computed: {
    sections () {
      return [
        {
          name: this.$i18n.t('Dashboard'),
          path: '/status/dashboard',
          can: 'master tenant'
        },
        {
          name: this.$i18n.t('Network View'),
          path: '/status/network',
          saveSearchNamespace: 'network',
          can: 'read nodes'
        },
        {
          name: this.$i18n.t('Services'),
          path: '/status/services',
          can: 'read services'
        },
        {
          name: this.$i18n.t('Local Queue'),
          path: '/status/queue',
          can: 'master tenant'
        }
      ]
    },
    cluster () {
      return this.$store.state.$_status.cluster || []
    }
  },
  mounted () {
    if (this.cluster && this.cluster.length > 1) {
      this.sections.push({
        name: this.$i18n.t('Cluster'),
        items: [
          {
            name: this.$i18n.t('Services'),
            path: '/status/cluster/services'
          }
        ]
      })
    }
  }
}
</script>
