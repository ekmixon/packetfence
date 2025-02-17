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
  name: 'Configuration',
  components: {
    pfSidebar
  },
  computed: {
    sections () {
      return [
        {
          name: this.$i18n.t('Policies and Access Control'),
          path: '/configuration/policies_access_control',
          icon: 'id-card',
          collapsable: true,
          items: [
            { name: this.$i18n.t('Roles'), path: '/configuration/roles' },
            { name: this.$i18n.t('Domains'),
              items: [
                { name: this.$i18n.t('Active Directory Domains'), path: '/configuration/domains' },
                { name: this.$i18n.t('Realms'), path: '/configuration/realms' }
              ]
            },
            { name: this.$i18n.t('Authentication Sources'), path: '/configuration/sources' },
            { name: this.$i18n.t('Network Devices'),
              items: [
                { name: this.$i18n.t('Switches'), path: '/configuration/switches' },
                { name: this.$i18n.t('Switch Groups'), path: '/configuration/switch_groups' }
              ]
            },
            { name: this.$i18n.t('Connection Profiles'),
              items: [
                { name: this.$i18n.t('Standard Connection Profiles'), path: '/configuration/connection_profiles' }
              ]
            }
          ]
        },
        {
          name: this.$i18n.t('Compliance'),
          path: '/configuration/compliance',
          icon: 'shield-alt',
          collapsable: true,
          items: [
            { name: this.$i18n.t('Fingerbank Profiling'),
              items: [
                { name: this.$i18n.t('General Settings'), path: '/configuration/fingerbank/general_settings' },
                { name: this.$i18n.t('Device change detection'), path: '/configuration/fingerbank/device_change_detection' },
                { name: this.$i18n.t('Combinations'), path: '/configuration/fingerbank/combinations' },
                { name: this.$i18n.t('Devices'), path: '/configuration/fingerbank/devices' },
                { name: this.$i18n.t('DHCP Fingerprints'), path: '/configuration/fingerbank/dhcp_fingerprints' },
                { name: this.$i18n.t('DHCP Vendors'), path: '/configuration/fingerbank/dhcp_vendors' },
                { name: this.$i18n.t('DHCPv6 Fingerprints'), path: '/configuration/fingerbank/dhcpv6_fingerprints' },
                { name: this.$i18n.t('DHCPv6 Enterprises'), path: '/configuration/fingerbank/dhcpv6_enterprises' },
                { name: this.$i18n.t('MAC Vendors'), path: '/configuration/fingerbank/mac_vendors' },
                { name: this.$i18n.t('User Agents'), path: '/configuration/fingerbank/user_agents' }
              ]
            },
            { name: this.$i18n.t('Network Anomaly Detection'), path: '/configuration/fingerbank/network_behavior_policies' },
            { name: this.$i18n.t('Scan Engines'), path: '/configuration/scan_engines' },
            { name: this.$i18n.t('Security Events'), path: '/configuration/security_events' }
          ]
        },
        {
          name: this.$i18n.t('Integration'),
          path: '/configuration/integration',
          icon: 'puzzle-piece',
          collapsable: true,
          items: [
            { name: this.$i18n.t('Cloud Services'), path: '/configuration/clouds' },
            { name: this.$i18n.t('Firewall SSO'), path: '/configuration/firewalls' },
            { name: this.$i18n.t('Web Services'), path: '/configuration/webservices' },
            { name: this.$i18n.t('Switch Templates'), path: '/configuration/switch_templates' },
            { name: this.$i18n.t('Syslog Parsers'), path: '/configuration/pfdetect' },
            { name: this.$i18n.t('Syslog Forwarding'), path: '/configuration/syslog' },
            { name: this.$i18n.t('Event Loggers'), path: '/configuration/event_loggers' },
            { name: this.$i18n.t('WRIX'), path: '/configuration/wrix' },
            { name: this.$i18n.t('PKI'),
              items: [
                { name: this.$i18n.t('Certificate Authorities'), path: '/configuration/pki/cas' },
                { name: this.$i18n.t('Templates'), path: '/configuration/pki/profiles' },
                { name: this.$i18n.t('Certificates'), path: '/configuration/pki/certs' },
                { name: this.$i18n.t('Revoked Certificates'), path: '/configuration/pki/revokedcerts' }
              ]
            }
          ]
        },
        {
          name: this.$i18n.t('Advanced Access Configuration'),
          path: '/configuration/advanced_access_configuration',
          icon: 'clipboard-list',
          collapsable: true,
          items: [
            { name: this.$i18n.t('Captive Portal'), path: '/configuration/captive_portal' },
            { name: this.$i18n.t('Filter Engines'), path: '/configuration/filter_engines' },
            { name: this.$i18n.t('Billing Tiers'), path: '/configuration/billing_tiers' },
            { name: this.$i18n.t('PKI Providers'), path: '/configuration/pki_providers' },
            { name: this.$i18n.t('Provisioners'), path: '/configuration/provisionings' },
            { name: this.$i18n.t('Portal Modules'), path: '/configuration/portal_modules' },
            { name: this.$i18n.t('Access Duration'), path: '/configuration/access_duration' },
            { name: this.$i18n.t('Self Service Portal'), path: '/configuration/self_services' }
          ]
        },
        {
          name: this.$i18n.t('Network Configuration'),
          path: '/configuration/network_configuration',
          icon: 'project-diagram',
          collapsable: true,
          items: [
            { name: this.$i18n.t('Networks'),
              items: [
                { name: this.$i18n.t('Network Settings'), path: '/configuration/network' },
                { name: this.$i18n.t('Interfaces'), path: '/configuration/interfaces' },
                { name: this.$i18n.t('Inline'), path: '/configuration/inline' },
                { name: this.$i18n.t('Inline Traffic Shaping'), path: '/configuration/traffic_shapings' },
                { name: this.$i18n.t('Fencing'), path: '/configuration/fencing' },
                { name: this.$i18n.t('Device Parking'), path: '/configuration/parking' }
              ]
            },
            { name: this.$i18n.t('SNMP'), path: '/configuration/snmp_traps' },
            { name: this.$i18n.t('Floating Devices'), path: '/configuration/floating_devices' }
          ]
        },
        {
          name: this.$i18n.t('System Configuration'),
          path: '/configuration/system_configuration',
          icon: 'cogs',
          collapsable: true,
          items: [
            { name: this.$i18n.t('Main Configuration'),
              items: [
                { name: this.$i18n.t('General Configuration'), path: '/configuration/general' },
                { name: this.$i18n.t('Alerting'), path: '/configuration/alerting' },
                { name: this.$i18n.t('Advanced'), path: '/configuration/advanced' },
                { name: this.$i18n.t('Maintenance'), path: '/configuration/maintenance_tasks' },
                { name: this.$i18n.t('Services'), path: '/configuration/services' }
              ]
            },
            { name: this.$i18n.t('Database'),
              items: [
                { name: this.$i18n.t('General'), path: '/configuration/database_general' },
                { name: this.$i18n.t('Advanced'), path: '/configuration/database_advanced' }
              ]
            },
            { name: this.$i18n.t('Cluster'), path: '/configuration/active_active' },
            { name: this.$i18n.t('RADIUS'),
              items: [
                { name: this.$i18n.t('General'), path: '/configuration/radius' },
                { name: this.$i18n.t('EAP Profiles'), path: '/configuration/radius/eap' },
                { name: this.$i18n.t('TLS Profiles'), path: '/configuration/radius/tls' },
                { name: this.$i18n.t('Fast Profiles'), path: '/configuration/radius/fast' },
                { name: this.$i18n.t('SSL Certificates'), path: '/configuration/radius/ssl' },
                { name: this.$i18n.t('OCSP Profiles'), path: '/configuration/radius/ocsp' }
              ]
            },
            { name: this.$i18n.t('DNS Configuration'), path: '/configuration/dns' },
            { name: this.$i18n.t('Admin Access'), path: '/configuration/admin_roles' },
            { name: this.$i18n.t('SSL Certificates'), path: '/configuration/certificates' },
            { name: this.$i18n.t('Tenants'), path: '/configuration/tenants' }
          ]
        }
      ]
    }
  }
}
</script>
