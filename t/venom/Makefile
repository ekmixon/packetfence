#==============================================================================
# Specific variables
#==============================================================================
SHELL=/bin/bash
PFSERVERS_DIR=pfservers

#==============================================================================
# Targets
#==============================================================================
.PHONY: install
install:
	./install-venom.sh

# configurator is different: it runs **before** all test suites. It doesn't need
# a token to perform actions so there is no dependency to setup test suite
.PHONY: configurator
configurator:
	./venom-wrapper.sh $(PFSERVERS_DIR)/configurator

# test is the entrypoint: all test suites should be referenced as target dependency
# if setup is a dependency to test target, putting setup as a dependency to other
# targets doesn't cause a recall
.PHONY: test
test: setup global_config dot1x_eap_peap wired_mac_auth wireless_dot1x_eap_peap wireless_mac_auth dot1x_eap_tls_pfpki backup_db_and_restore global_teardown

.PHONY: setup
setup:
	./venom-wrapper.sh setup/00_setup.yml

.PHONY: setup_multi_tenant
setup_multi_tenant:
	./venom-wrapper.sh setup/00_setup_multi_tenant.yml

# teardown is done at end of all test suites: all things configured here have no impact
.PHONY: global_config
global_config: setup
	./venom-wrapper.sh $(PFSERVERS_DIR)/global_config

.PHONY: global_config_multi_tenant
global_config_multi_tenant:
	./venom-wrapper.sh $(PFSERVERS_DIR)/global_config_multi_tenant

.PHONY: dot1x_eap_peap
dot1x_eap_peap: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/dot1x_eap_peap
	./venom-wrapper.sh $(PFSERVERS_DIR)/dot1x_eap_peap/teardown

.PHONY: wired_mac_auth
wired_mac_auth: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/wired_mac_auth
	./venom-wrapper.sh $(PFSERVERS_DIR)/wired_mac_auth/teardown

.PHONY: wireless_dot1x_eap_peap
wireless_dot1x_eap_peap: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/wireless_dot1x_eap_peap
	./venom-wrapper.sh $(PFSERVERS_DIR)/wireless_dot1x_eap_peap/teardown

.PHONY: wireless_mac_auth
wireless_mac_auth: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/wireless_mac_auth
	./venom-wrapper.sh $(PFSERVERS_DIR)/wireless_mac_auth/teardown

.PHONY: captive_portal
captive_portal: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/captive_portal
	./venom-wrapper.sh $(PFSERVERS_DIR)/captive_portal/teardown

.PHONY: dot1x_eap_tls_pfpki
dot1x_eap_tls_pfpki: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/dot1x_eap_tls_pfpki
	./venom-wrapper.sh $(PFSERVERS_DIR)/dot1x_eap_tls_pfpki/teardown

.PHONY: pfdhcplistener_single_tenant
pfdhcplistener_single_tenant: setup
	./venom-wrapper.sh $(PFSERVERS_DIR)/pfdhcplistener_single_tenant
	./venom-wrapper.sh $(PFSERVERS_DIR)/pfdhcplistener_single_tenant/teardown

.PHONY: pfdhcplistener_multi_tenant
pfdhcplistener_multi_tenant: global_config_multi_tenant setup_multi_tenant
	./venom-wrapper.sh $(PFSERVERS_DIR)/pfdhcplistener_multi_tenant
	./venom-wrapper.sh $(PFSERVERS_DIR)/pfdhcplistener_multi_tenant/teardown

.PHONY: backup_db_and_restore
backup_db_and_restore: setup
	./venom-wrapper.sh $(PFSERVERS_DIR)/backup_db_and_restore
	./venom-wrapper.sh $(PFSERVERS_DIR)/backup_db_and_restore/teardown

.PHONY: global_teardown
global_teardown: setup
	./venom-wrapper.sh $(PFSERVERS_DIR)/global_teardown

# Targets for local tests
.PHONY: dot1x_eap_peap_no_teardown
dot1x_eap_peap_no_teardown: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/dot1x_eap_peap

.PHONY: wired_mac_auth_no_teardown
wired_mac_auth_no_teardown: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/wired_mac_auth

.PHONY: wireless_dot1x_eap_peap_no_teardown
wireless_dot1x_eap_peap_no_teardown: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/wireless_dot1x_eap_peap

.PHONY: wireless_mac_auth_no_teardown
wireless_mac_auth_no_teardown: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/wireless_mac_auth

.PHONY: captive_portal_no_teardown
captive_portal_no_teardown: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/captive_portal

.PHONY: dot1x_eap_tls_pfpki_no_teardown
dot1x_eap_tls_pfpki_no_teardown: setup global_config
	./venom-wrapper.sh $(PFSERVERS_DIR)/dot1x_eap_tls_pfpki

.PHONY: backup_db_and_restore_no_teardown
backup_db_and_restore_no_teardown: setup
	./venom-wrapper.sh $(PFSERVERS_DIR)/backup_db_and_restore
