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
  `recordId` int(0) NOT NULL AUTO_INCREMENT,
  `resourceId` int(0) NOT NULL,
  `resourceName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fathercode` int(0) NULL DEFAULT NULL,
  `level` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` int(0) NULL DEFAULT NULL,
  `usercode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `updatetime` datetime(0) NULL DEFAULT NULL,
  `userId` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`recordId`) USING BTREE,
  INDEX `foreign_key1`(`usercode`) USING BTREE,
  INDEX `foreign_key3`(`userId`) USING BTREE,
  CONSTRAINT `foreign_key1` FOREIGN KEY (`usercode`) REFERENCES `usertonet` (`usercode`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `foreign_key3` FOREIGN KEY (`userId`) REFERENCES `usertonet` (`userId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of record
-- ----------------------------
INSERT INTO `record` VALUES (1, 1, '资源1号', 0, '1', 0, 'user_001', NULL, 1);
INSERT INTO `record` VALUES (2, 2, '资源2号', 0, '1', 1, 'user_001', NULL, 1);

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `taskId` int(0) NOT NULL,
  `usercode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` int(0) NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `foreign_key2`(`usercode`) USING BTREE,
  CONSTRAINT `foreign_key2` FOREIGN KEY (`usercode`) REFERENCES `usertonet` (`usercode`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task
-- ----------------------------
INSERT INTO `task` VALUES (1, 1, 'user_001', 1, NULL);
INSERT INTO `task` VALUES (2, 2, 'user_001', 0, NULL);

-- ----------------------------
-- Table structure for usertonet
-- ----------------------------
DROP TABLE IF EXISTS `usertonet`;
CREATE TABLE `usertonet`  (
  `userId` int(0) NOT NULL AUTO_INCREMENT,
  `usercode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` int(0) NOT NULL,
  `longitude` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `latitude` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`userId`) USING BTREE,
  INDEX `usercode`(`usercode`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of usertonet
-- ----------------------------
INSERT INTO `usertonet` VALUES (1, 'user_001', 1, NULL, NULL);
INSERT INTO `usertonet` VALUES (2, 'user_002', 0, NULL, NULL);
INSERT INTO `usertonet` VALUES (3, 'user_003', 0, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
