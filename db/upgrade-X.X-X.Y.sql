--
-- PacketFence SQL schema upgrade from X.X to X.Y
--


--
-- Setting the major/minor version of the DB
--

SET @MAJOR_VERSION = 11;
SET @MINOR_VERSION = 0;


SET @PREV_MAJOR_VERSION = 10;
SET @PREV_MINOR_VERSION = 3;
-- SET @PREV_SUBMINOR_VERSION = 0;

--
-- The VERSION_INT to ensure proper ordering of the version in queries
--

SET @VERSION_INT = @MAJOR_VERSION << 16 | @MINOR_VERSION << 8;

SET @PREV_VERSION_INT = @PREV_MAJOR_VERSION << 16 | @PREV_MINOR_VERSION << 8;
-- SET @PREV_VERSION_INT = @PREV_MAJOR_VERSION << 16 | @PREV_MINOR_VERSION << 8 | @PREV_SUBMINOR_VERSION;

DROP PROCEDURE IF EXISTS ValidateVersion;
--
-- Updating to current version
--
DELIMITER //
CREATE PROCEDURE ValidateVersion()
BEGIN
    DECLARE PREVIOUS_VERSION int(11);
    DECLARE PREVIOUS_VERSION_STRING varchar(11);
    DECLARE _message varchar(255);
    SELECT id, version INTO PREVIOUS_VERSION, PREVIOUS_VERSION_STRING FROM pf_version ORDER BY id DESC LIMIT 1;

      IF PREVIOUS_VERSION != @PREV_VERSION_INT THEN
        SELECT CONCAT('PREVIOUS VERSION ', PREVIOUS_VERSION_STRING, ' DOES NOT MATCH ', CONCAT_WS('.', @PREV_MAJOR_VERSION, @PREV_MINOR_VERSION)) INTO _message;
        -- SELECT CONCAT('PREVIOUS VERSION ', PREVIOUS_VERSION_STRING, ' DOES NOT MATCH ', CONCAT_WS('.', @PREV_MAJOR_VERSION, @PREV_MINOR_VERSION, @PREV_SUBMINOR_VERSION)) INTO _message;
        SIGNAL SQLSTATE VALUE '99999'
              SET MESSAGE_TEXT = _message;
      END IF;
END
//

DELIMITER ;
\! echo "Checking PacketFence schema version...";
call ValidateVersion;
DROP PROCEDURE IF EXISTS ValidateVersion;

\! echo "altering pki_profiles"
ALTER TABLE pki_profiles
    ADD COLUMN IF NOT EXISTS `cloud_enabled` int(11) DEFAULT NULL AFTER scep_days_before_renewal,
    ADD COLUMN IF NOT EXISTS `cloud_service` varchar(255) DEFAULT NULL AFTER cloud_enabled;

\! echo "Altering admin_api_audit_log"
ALTER TABLE admin_api_audit_log
    CHANGE COLUMN `created_at` `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;

\! echo "Altering dhcp_option82_history"
ALTER TABLE dhcp_option82_history
    CHANGE COLUMN `created_at` `created_at` datetime NOT NULL;

\! echo "Altering dns_audit_log"
ALTER TABLE dns_audit_log
    CHANGE COLUMN `created_at` `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

\! echo "Altering pki_cas"
ALTER TABLE pki_cas
    CHANGE COLUMN `created_at` `created_at` datetime DEFAULT NULL,
    CHANGE COLUMN `updated_at` `updated_at` datetime DEFAULT NULL,
    CHANGE COLUMN `deleted_at` `deleted_at` datetime DEFAULT NULL;

\! echo "Altering pki_certs"
ALTER TABLE pki_certs
    CHANGE COLUMN `created_at` `created_at` datetime DEFAULT NULL,
    CHANGE COLUMN `updated_at` `updated_at` datetime DEFAULT NULL,
    CHANGE COLUMN `deleted_at` `deleted_at` datetime DEFAULT NULL,
    CHANGE COLUMN `valid_until` `valid_until` datetime DEFAULT NULL,
    CHANGE COLUMN `date` `date` datetime DEFAULT CURRENT_TIMESTAMP;

\! echo "Altering pki_profiles"
ALTER TABLE pki_profiles
    CHANGE COLUMN `created_at` `created_at` datetime DEFAULT NULL,
    CHANGE COLUMN `updated_at` `updated_at` datetime DEFAULT NULL,
    CHANGE COLUMN `deleted_at` `deleted_at` datetime DEFAULT NULL;

\! echo "Altering pki_revoked_certs"
ALTER TABLE pki_revoked_certs
    CHANGE COLUMN `created_at` `created_at` datetime DEFAULT NULL,
    CHANGE COLUMN `updated_at` `updated_at` datetime DEFAULT NULL,
    CHANGE COLUMN `deleted_at` `deleted_at` datetime DEFAULT NULL,
    CHANGE COLUMN `valid_until` `valid_until` datetime DEFAULT NULL,
    CHANGE COLUMN `date` `date` datetime DEFAULT CURRENT_TIMESTAMP,
    CHANGE COLUMN `revoked` `revoked` datetime DEFAULT NULL;

\! echo "Altering radacct_log"
ALTER TABLE radacct_log
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT;

\! echo "Altering radius_audit_log"
ALTER TABLE radius_audit_log
    CHANGE COLUMN `created_at` `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;

\! echo "Altering sms_carrier"
ALTER TABLE sms_carrier
   CHANGE COLUMN `modified` `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'date this record was modified';

\! echo "Altering table billing"
ALTER TABLE billing
    CHANGE COLUMN `update_date` `update_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP;

\! echo "Altering table dhcp_option82"
ALTER TABLE dhcp_option82
    CHANGE COLUMN `created_at` `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;

\! echo "Altering table scan"
ALTER TABLE scan
   CHANGE COLUMN `update_date` `update_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP;

\! echo "Incrementing PacketFence schema version...";
INSERT IGNORE INTO pf_version (id, version, created_at) VALUES (@VERSION_INT, CONCAT_WS('.', @MAJOR_VERSION, @MINOR_VERSION), NOW());

\! echo "Upgrade completed successfully.";
