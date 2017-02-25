
USE `dbchr_content_platform`;

DROP TABLE IF EXISTS `think_template`;
CREATE TABLE `think_template` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `think_field`;
CREATE TABLE `think_field` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `template_id` int(11) unsigned NOT NULL DEFAULT '0',
  `d_desc` varchar(50) NOT NULL DEFAULT '',
  `field_name` varchar(50) NOT NULL DEFAULT '',
  `d_type` varchar(50) NOT NULL DEFAULT '',
  `parent_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `think_data`;
CREATE TABLE `think_data` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `template_id` int(11) unsigned NOT NULL DEFAULT 0,
  `alias` varchar(50) NOT NULL DEFAULT '',
  `json` MEDIUMTEXT NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

