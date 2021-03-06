START TRANSACTION;

DROP TABLE IF EXISTS `annotation_types_attributes_temp`;

CREATE TABLE `annotation_types_attributes_temp` ( `id` INT(11) NOT NULL , `annotation_type_id` INT(11) NOT NULL , `name` VARCHAR(32) NOT NULL , `type` ENUM('radio', 'string') NOT NULL ) ENGINE = InnoDB;

INSERT INTO annotation_types_attributes_temp (id, annotation_type_id, name, type)
  SELECT ata.id, at.annotation_type_id, ata.name, ata.type FROM `annotation_types_attributes` ata
    JOIN annotation_types at ON at.name = ata.annotation_type;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `annotation_types_attributes`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `annotation_types_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `annotation_type_id` INT(11) NOT NULL,
  `name` varchar(32) CHARACTER SET utf8 NOT NULL,
  `type` enum('radio','string') CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  KEY `annotation_type_id` (`annotation_type_id`),
  CONSTRAINT `annotation_types_attributes_ibfk_1` FOREIGN KEY (`annotation_type_id`) REFERENCES `annotation_types` (`annotation_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

INSERT INTO annotation_types_attributes (id, annotation_type_id, name, type)
  SELECT * FROM `annotation_types_attributes_temp`;

DROP TABLE `annotation_types_attributes_temp`;

COMMIT;