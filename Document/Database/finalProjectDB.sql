-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: bike_hiring_management
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bd_user_role`
--

DROP TABLE IF EXISTS `bd_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bd_user_role` (
  `user_id` varchar(50) NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKngk025xymc6x59qcl4gfm6cu9` (`role_id`),
  CONSTRAINT `FKeat9al592bxs8uq64eb5n23oc` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKngk025xymc6x59qcl4gfm6cu9` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bd_user_role`
--

LOCK TABLES `bd_user_role` WRITE;
/*!40000 ALTER TABLE `bd_user_role` DISABLE KEYS */;
INSERT INTO `bd_user_role` VALUES ('admin001',1);
/*!40000 ALTER TABLE `bd_user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bike`
--

DROP TABLE IF EXISTS `bike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bike` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `bike_category_id` bigint DEFAULT NULL,
  `bike_color_id` bigint DEFAULT NULL,
  `bike_manual_id` varchar(255) NOT NULL,
  `bike_manufacturer_id` bigint DEFAULT NULL,
  `bike_no` varchar(50) NOT NULL,
  `hired_number` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bike`
--

LOCK TABLES `bike` WRITE;
/*!40000 ALTER TABLE `bike` DISABLE KEYS */;
INSERT INTO `bike` VALUES (1,'2023-01-29 16:35:16','admin001',_binary '\0','2023-03-06 22:33:38','admin001',1,1,'1',3,'000001',0,'NOUVO RED 2006','AVAILABLE'),(2,'2023-01-29 16:35:54','admin001',_binary '\0','2023-03-06 22:32:15','admin001',1,5,'2',3,'000002',0,'AIR BLADE BLACK 2013','AVAILABLE'),(3,'2023-01-29 16:36:33','admin001',_binary '\0','2023-03-06 22:31:14','admin001',1,2,'3',3,'000003',0,'YAMAHA EX BLUE 2018','AVAILABLE'),(4,'2023-01-29 16:36:59','admin001',_binary '\0','2023-03-06 22:27:31','admin001',1,3,'4',3,'000004',0,'YAMAHA VIOLET 2010','AVAILABLE'),(5,'2023-01-29 16:37:46','admin001',_binary '\0','2023-03-06 22:26:27','admin001',1,5,'5',3,'000005',0,'AIR BLADE BLACK 2008','AVAILABLE'),(6,'2023-01-29 16:38:20','admin001',_binary '\0','2023-03-06 22:25:33','admin001',2,6,'6',3,'000006',0,'AIR BLADE WHITE 2009','AVAILABLE'),(7,'2023-01-29 16:38:47','admin001',_binary '\0','2023-03-06 22:24:50','admin001',2,5,'7',1,'000007',0,'AIR BLADE BLACK 2000','AVAILABLE'),(8,'2023-01-29 16:39:31','admin001',_binary '\0','2023-03-06 22:23:36','admin001',2,8,'8',2,'000008',0,'ATTILA YELLOW 2000','AVAILABLE'),(9,'2023-01-29 16:40:05','admin001',_binary '\0','2023-03-06 22:21:32','admin001',2,5,'9',1,'000009',0,'AXELO BLACK RED 2000','AVAILABLE'),(10,'2023-01-29 16:40:50','admin001',_binary '\0','2023-05-15 21:51:05','admin001',2,9,'10',1,'000010',0,'ATTILA BROWN 2006','AVAILABLE');
/*!40000 ALTER TABLE `bike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bike_category`
--

DROP TABLE IF EXISTS `bike_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bike_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime NOT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bike_category`
--

LOCK TABLES `bike_category` WRITE;
/*!40000 ALTER TABLE `bike_category` DISABLE KEYS */;
INSERT INTO `bike_category` VALUES (1,'2022-11-12 15:03:34','admin001',_binary '\0','2022-11-19 13:44:19','admin001','Automatic Transmission',100000),(2,'2022-11-12 15:03:50','admin001',_binary '\0','2023-03-16 00:03:01','admin001','Manual Transmission',70000);
/*!40000 ALTER TABLE `bike_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bike_color`
--

DROP TABLE IF EXISTS `bike_color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bike_color` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime NOT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bike_color`
--

LOCK TABLES `bike_color` WRITE;
/*!40000 ALTER TABLE `bike_color` DISABLE KEYS */;
INSERT INTO `bike_color` VALUES (1,'2022-11-12 13:56:46','admin001',_binary '\0','2022-12-24 21:29:50','admin001','Red'),(2,'2022-11-12 13:56:51','admin001',_binary '\0',NULL,NULL,'Blue'),(3,'2022-11-12 13:56:54','admin001',_binary '\0',NULL,NULL,'Purple'),(5,'2022-12-24 21:28:43','admin001',_binary '\0',NULL,NULL,'Black'),(6,'2022-12-24 21:28:55','admin001',_binary '\0',NULL,NULL,'White'),(7,'2022-12-24 21:29:09','admin001',_binary '\0',NULL,NULL,'Gray'),(8,'2023-01-14 10:15:04','admin001',_binary '\0',NULL,NULL,'Yellow'),(9,'2023-01-14 10:15:24','admin001',_binary '\0',NULL,NULL,'Brown'),(10,'2023-01-29 20:08:16','admin001',_binary '\0','2023-02-20 21:50:47','admin001','Pink');
/*!40000 ALTER TABLE `bike_color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bike_image`
--

DROP TABLE IF EXISTS `bike_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bike_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `bike_id` bigint NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `path` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bike_image`
--

LOCK TABLES `bike_image` WRITE;
/*!40000 ALTER TABLE `bike_image` DISABLE KEYS */;
INSERT INTO `bike_image` VALUES (1,'2023-01-29 16:35:16','admin001',_binary '\0',NULL,NULL,1,'2-IMG20220725093312.jpg-mTihbKG3Cf','2-IMG20220725093312.jpg-mTihbKG3Cf?alt=media&token=2a63fe2c-41cd-4c96-be54-3bdcdb00774d'),(2,'2023-01-29 16:35:16','admin001',_binary '\0',NULL,NULL,1,'3-IMG20220725093331.jpg-DuCHcEq9Ai','3-IMG20220725093331.jpg-DuCHcEq9Ai?alt=media&token=96a7999b-29e6-4de2-8649-1a861c58f6fd'),(3,'2023-01-29 16:35:16','admin001',_binary '\0',NULL,NULL,1,'1-IMG20220725093217.jpg-QuHE7qLTeP','1-IMG20220725093217.jpg-QuHE7qLTeP?alt=media&token=6d37b4d3-f8e9-4f5f-81f0-5d2b807a9317'),(4,'2023-01-29 16:35:54','admin001',_binary '\0',NULL,NULL,2,'3-IMG20220725093650.jpg-L7lMiIJbYZ','3-IMG20220725093650.jpg-L7lMiIJbYZ?alt=media&token=136dc299-738b-4882-bb11-7ed7f85f67e4'),(5,'2023-01-29 16:35:54','admin001',_binary '\0',NULL,NULL,2,'1-IMG20220725093554.jpg-4lrvt13B06','1-IMG20220725093554.jpg-4lrvt13B06?alt=media&token=568f4ada-a4e1-4d44-bff7-850b2357a50a'),(6,'2023-01-29 16:35:54','admin001',_binary '\0',NULL,NULL,2,'2-IMG20220725093637.jpg-RR2SyWE31c','2-IMG20220725093637.jpg-RR2SyWE31c?alt=media&token=5a8ef107-476a-45b2-b961-701b3a9bb1ea'),(7,'2023-01-29 16:36:33','admin001',_binary '\0',NULL,NULL,3,'2-IMG20220727161106.jpg-JOx2XdqxOG','2-IMG20220727161106.jpg-JOx2XdqxOG?alt=media&token=59329763-214c-49cf-9b71-52f521b991a6'),(8,'2023-01-29 16:36:33','admin001',_binary '\0',NULL,NULL,3,'1-IMG20220727161033.jpg-uTA9YYvp2H','1-IMG20220727161033.jpg-uTA9YYvp2H?alt=media&token=30cb956c-fdf8-497d-b647-75ba5f833895'),(9,'2023-01-29 16:36:33','admin001',_binary '\0',NULL,NULL,3,'3-IMG20220727161125.jpg-YNgBmVNTrk','3-IMG20220727161125.jpg-YNgBmVNTrk?alt=media&token=1f506bc7-f6c3-4396-9044-0dd5dc9056eb'),(10,'2023-01-29 16:36:59','admin001',_binary '\0',NULL,NULL,4,'3-IMG20220727161404.jpg-TZdIf5Cn1n','3-IMG20220727161404.jpg-TZdIf5Cn1n?alt=media&token=73137c21-d863-42f5-854e-c64064872c05'),(11,'2023-01-29 16:36:59','admin001',_binary '\0',NULL,NULL,4,'1-IMG20220727161328.jpg-Qh3oBR7jft','1-IMG20220727161328.jpg-Qh3oBR7jft?alt=media&token=14bf05e6-2e7d-4333-9521-e52676c56489'),(12,'2023-01-29 16:36:59','admin001',_binary '\0',NULL,NULL,4,'2-IMG20220727161352.jpg-waGLyuKRCh','2-IMG20220727161352.jpg-waGLyuKRCh?alt=media&token=28391718-88aa-4002-8c7b-ab08c5730e0b'),(13,'2023-01-29 16:37:46','admin001',_binary '\0',NULL,NULL,5,'3-IMG20220727161616.jpg-ubaR7eAA9n','3-IMG20220727161616.jpg-ubaR7eAA9n?alt=media&token=0f5b7ed7-8c3e-4da1-aff6-4442e4ac6f4c'),(14,'2023-01-29 16:37:46','admin001',_binary '\0',NULL,NULL,5,'1-IMG20220727161545.jpg-FAQmgpJk9s','1-IMG20220727161545.jpg-FAQmgpJk9s?alt=media&token=0aa7c78d-6c23-4a3a-8d2c-3317d622d472'),(15,'2023-01-29 16:37:46','admin001',_binary '\0',NULL,NULL,5,'2-IMG20220727161608.jpg-cYTfRmSKt6','2-IMG20220727161608.jpg-cYTfRmSKt6?alt=media&token=734ef493-946d-42fb-8ce3-2839b4f42716'),(16,'2023-01-29 16:38:20','admin001',_binary '\0',NULL,NULL,6,'3-IMG20220729154442.jpg-NpUyU6GUg3','3-IMG20220729154442.jpg-NpUyU6GUg3?alt=media&token=b79e17ef-6783-4b39-814f-40cbf838fd22'),(17,'2023-01-29 16:38:20','admin001',_binary '\0',NULL,NULL,6,'2-IMG20220729154430.jpg-uOlHpMhNph','2-IMG20220729154430.jpg-uOlHpMhNph?alt=media&token=9ca04c9c-d5c5-4d9f-89a4-eb13c3570f35'),(18,'2023-01-29 16:38:20','admin001',_binary '\0',NULL,NULL,6,'1-IMG20220729154412.jpg-8w4bWuWU1L','1-IMG20220729154412.jpg-8w4bWuWU1L?alt=media&token=57f9a488-f7bf-4513-b3cf-2017af3e2f49'),(19,'2023-01-29 16:38:47','admin001',_binary '\0',NULL,NULL,7,'3-IMG20220729154626.jpg-pes0RDdQPd','3-IMG20220729154626.jpg-pes0RDdQPd?alt=media&token=67da837f-b029-463e-a146-f93f4eaf6bad'),(20,'2023-01-29 16:38:47','admin001',_binary '\0',NULL,NULL,7,'1-IMG20220729154536.jpg-ONSjH8AlyS','1-IMG20220729154536.jpg-ONSjH8AlyS?alt=media&token=a9e763da-1822-401b-9d5f-0d50be7747f2'),(21,'2023-01-29 16:38:47','admin001',_binary '\0',NULL,NULL,7,'2-IMG20220729154603.jpg-BdLfzk0ptC','2-IMG20220729154603.jpg-BdLfzk0ptC?alt=media&token=f8596c0f-b297-43c3-9e4c-47ff3c02c09b'),(22,'2023-01-29 16:39:31','admin001',_binary '\0',NULL,NULL,8,'1-IMG20220801085434.jpg-sfdvRhDs4b','1-IMG20220801085434.jpg-sfdvRhDs4b?alt=media&token=72f3340c-3c14-40d9-95f7-3622f8c07f19'),(23,'2023-01-29 16:39:31','admin001',_binary '\0',NULL,NULL,8,'3-IMG20220801085528.jpg-vRSVxFxcOk','3-IMG20220801085528.jpg-vRSVxFxcOk?alt=media&token=0cdb8f95-3e0d-4d66-a963-bea89ef0629a'),(24,'2023-01-29 16:39:31','admin001',_binary '\0',NULL,NULL,8,'2-IMG20220801085517.jpg-3NhTqWQKt5','2-IMG20220801085517.jpg-3NhTqWQKt5?alt=media&token=e0a62f4e-29ae-45f8-ade6-197eb778fdc6'),(25,'2023-01-29 16:40:05','admin001',_binary '\0',NULL,NULL,9,'3-IMG20220801085848.jpg-P3VzZObyla','3-IMG20220801085848.jpg-P3VzZObyla?alt=media&token=d03a3078-7165-4429-ac16-e3f06483004b'),(26,'2023-01-29 16:40:05','admin001',_binary '\0',NULL,NULL,9,'1-IMG20220801085802.jpg-quzgFdXZPs','1-IMG20220801085802.jpg-quzgFdXZPs?alt=media&token=4438e3d8-f8dd-4890-99a2-d64beea5c0c9'),(27,'2023-01-29 16:40:05','admin001',_binary '\0',NULL,NULL,9,'2-IMG20220801085827.jpg-zhgoFZSOEf','2-IMG20220801085827.jpg-zhgoFZSOEf?alt=media&token=a7770edc-3657-4f4d-b6a6-04a245c2280f'),(28,'2023-01-29 16:40:50','admin001',_binary '\0',NULL,NULL,10,'3-IMG20220801092928.jpg-a4AhCB4Xmp','3-IMG20220801092928.jpg-a4AhCB4Xmp?alt=media&token=e4ab7f27-c07f-40c1-be0f-50216bfc43a5'),(29,'2023-01-29 16:40:50','admin001',_binary '\0',NULL,NULL,10,'1-IMG20220801092824.jpg-q6A66WFzqM','1-IMG20220801092824.jpg-q6A66WFzqM?alt=media&token=de4f6016-5b42-4831-8eff-f1626246de9e'),(30,'2023-01-29 16:40:50','admin001',_binary '\0',NULL,NULL,10,'2-IMG20220801092857.jpg-yXH5bqgTsG','2-IMG20220801092857.jpg-yXH5bqgTsG?alt=media&token=efb95707-e771-418d-af10-69a98ac785cc');
/*!40000 ALTER TABLE `bike_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bike_manufacturer`
--

DROP TABLE IF EXISTS `bike_manufacturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bike_manufacturer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime NOT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bike_manufacturer`
--

LOCK TABLES `bike_manufacturer` WRITE;
/*!40000 ALTER TABLE `bike_manufacturer` DISABLE KEYS */;
INSERT INTO `bike_manufacturer` VALUES (1,'2022-11-12 13:57:10','admin001',_binary '\0',NULL,NULL,'Honda'),(2,'2022-11-12 13:57:14','admin001',_binary '\0',NULL,NULL,'Yamaha'),(3,'2022-11-17 21:45:45','admin001',_binary '\0','2022-12-24 21:54:08','admin001','Nouvo');
/*!40000 ALTER TABLE `bike_manufacturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `is_banned` bit(1) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formula`
--

DROP TABLE IF EXISTS `formula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formula` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `formula` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formula`
--

LOCK TABLES `formula` WRITE;
/*!40000 ALTER TABLE `formula` DISABLE KEYS */;
INSERT INTO `formula` VALUES (1,'2023-01-19 21:41:40','admin001',_binary '\0',NULL,NULL,'A * (((B - (B % 24)) / 24) + C)','Motorbike Rental Formula');
/*!40000 ALTER TABLE `formula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formula_coefficient`
--

DROP TABLE IF EXISTS `formula_coefficient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formula_coefficient` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `coefficient` double DEFAULT NULL,
  `formula_id` bigint DEFAULT NULL,
  `lower_limit` double DEFAULT NULL,
  `upper_limit` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formula_coefficient`
--

LOCK TABLES `formula_coefficient` WRITE;
/*!40000 ALTER TABLE `formula_coefficient` DISABLE KEYS */;
INSERT INTO `formula_coefficient` VALUES (1,'2023-01-19 21:41:40','admin001',_binary '\0',NULL,NULL,0,1,0,1),(2,'2023-01-19 21:41:40','admin001',_binary '\0',NULL,NULL,0.5,1,1,7),(3,'2023-01-19 21:41:40','admin001',_binary '\0',NULL,NULL,1,1,7,24);
/*!40000 ALTER TABLE `formula_coefficient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formula_variable`
--

DROP TABLE IF EXISTS `formula_variable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formula_variable` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `formula_id` bigint DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formula_variable`
--

LOCK TABLES `formula_variable` WRITE;
/*!40000 ALTER TABLE `formula_variable` DISABLE KEYS */;
INSERT INTO `formula_variable` VALUES (1,'2023-01-19 21:41:40','admin001',_binary '\0',NULL,NULL,'Total Bike Cost',1,'A'),(2,'2023-01-19 21:41:40','admin001',_binary '\0',NULL,NULL,'Actual Total Hiring Hour',1,'B'),(3,'2023-01-19 21:41:40','admin001',_binary '\0',NULL,NULL,'Coefficient',1,'C');
/*!40000 ALTER TABLE `formula_variable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action_type` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  `entity_id` bigint DEFAULT NULL,
  `entity_name` varchar(50) DEFAULT NULL,
  `field_name` varchar(100) DEFAULT NULL,
  `previous_value` varchar(100) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintain`
--

DROP TABLE IF EXISTS `maintain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintain` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `cost` double DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintain`
--

LOCK TABLES `maintain` WRITE;
/*!40000 ALTER TABLE `maintain` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintain_bike`
--

DROP TABLE IF EXISTS `maintain_bike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintain_bike` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `bike_id` bigint NOT NULL,
  `maintain_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintain_bike`
--

LOCK TABLES `maintain_bike` WRITE;
/*!40000 ALTER TABLE `maintain_bike` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintain_bike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `bike_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `actual_end_date` datetime DEFAULT NULL,
  `actual_start_date` datetime DEFAULT NULL,
  `calculated_cost` double DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  `deposit_amount` double DEFAULT NULL,
  `deposit_hotel` varchar(255) DEFAULT NULL,
  `deposit_identify_card` varchar(255) DEFAULT NULL,
  `deposit_type` varchar(255) DEFAULT NULL,
  `expected_end_date` datetime DEFAULT NULL,
  `expected_start_date` datetime DEFAULT NULL,
  `is_used_month_hiring` bit(1) DEFAULT NULL,
  `is_used_service` bit(1) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `service_cost` double DEFAULT NULL,
  `service_description` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `temp_customer_name` varchar(255) DEFAULT NULL,
  `temp_customer_phone` varchar(255) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime NOT NULL,
  `created_user` varchar(255) NOT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'2022-07-10 14:36:09','Tai Phuc',_binary '\0',NULL,NULL,'ADMIN');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(50) NOT NULL,
  `address` varchar(250) NOT NULL,
  `age` bigint DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `email` varchar(50) NOT NULL,
  `gender` varchar(15) NOT NULL,
  `is_admin` bit(1) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(15) NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin001','123/5 ABC',22,'2022-07-10 15:00:28','admin001@gmail.com','male',_binary '','Tai Phuc','$2a$10$G5tAg4AHCN8CQq/kzRYsbOFxPohiCctbn8X/0NBk.m0dVvhGrpy36','0999999999',NULL,'admin001');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-15 21:58:45
