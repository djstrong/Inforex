CREATE TABLE IF NOT EXISTS `annotation_types_shortlist` (
  `annotation_type_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `shortlist` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `annotation_types`
ADD `shortlist` int(11) DEFAULT 0;

UPDATE `annotation_types` SET `shortlist`= 0 WHERE 1;

DROP TABLE `annotation_types_common`;
