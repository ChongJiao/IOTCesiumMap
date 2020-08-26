/*
 Navicat MySQL Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 80019
 Source Host           : localhost:3306
 Source Schema         : xmpp

 Target Server Type    : MySQL
 Target Server Version : 80019
 File Encoding         : 65001

 Date: 20/08/2020 20:10:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for record
-- ----------------------------
DROP TABLE IF EXISTS `record`;
CREATE TABLE `record`  (
  `resourceId` int(0) NOT NULL,
  `resourceName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fathercode` int(0) NULL DEFAULT NULL,
  `level` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` int(0) NULL DEFAULT NULL,
  `usercode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `updatetime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`resourceId`) USING BTREE
) ENGINE = InnoDB;


INSERT INTO `record` VALUES (1, '资源1号', 0, '1', 0, 'user_001', NULL);
INSERT INTO `record` VALUES (2, '资源2号', 0, '1', 1, 'user_001', NULL);

DROP TABLE IF EXISTS `task`;
CREATE TABLE `task`  (
  `taskId` int(0) NOT NULL,
  `usercode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` int(0) NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`taskId`) USING BTREE
) ENGINE = InnoDB;
INSERT INTO `task` VALUES (1, 'user_001', 1, NULL);
INSERT INTO `task` VALUES ( 2, 'user_001', 0, NULL);



DROP TABLE IF EXISTS `usertonet`;
CREATE TABLE `usertonet`  (
  `usercode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` int(0) NOT NULL,
  `longitude` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `latitude` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB;

INSERT INTO `usertonet` VALUES ('user_001', 1, NULL, NULL);
INSERT INTO `usertonet` VALUES ('user_002', 0, NULL, NULL);
INSERT INTO `usertonet` VALUES ('user_003', 0, NULL, NULL);
