-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 18, 2025 at 08:16 PM
-- Server version: 8.4.4
-- PHP Version: 8.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `c360req`
--

-- --------------------------------------------------------

--
-- Table structure for table `domain_external_links`
--

CREATE TABLE `domain_external_links` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `external_domain` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_count` int DEFAULT '1',
  `is_partner` tinyint(1) DEFAULT '0',
  `partner_confidence` float DEFAULT '0',
  `partner_context` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `example_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_external_links_detail`
--

CREATE TABLE `domain_external_links_detail` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `external_domain` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_partner` tinyint(1) DEFAULT '0',
  `partner_context` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `img_src` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_alt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `page_id` int DEFAULT NULL,
  `element_html` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `seen_in_last_crawl` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `last_seen_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `domain_external_links`
--
ALTER TABLE `domain_external_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id_idx` (`domain_id`);

--
-- Indexes for table `domain_external_links_detail`
--
ALTER TABLE `domain_external_links_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id_external_domain` (`domain_id`,`external_domain`),
  ADD KEY `idx_seen_active` (`domain_id`,`seen_in_last_crawl`,`is_active`),
  ADD KEY `idx_target_url` (`target_url`(255));

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `domain_external_links`
--
ALTER TABLE `domain_external_links`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_external_links_detail`
--
ALTER TABLE `domain_external_links_detail`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
