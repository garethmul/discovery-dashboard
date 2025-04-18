-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 18, 2025 at 07:00 PM
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
-- Table structure for table `ai_app_color_schemes`
--

CREATE TABLE `ai_app_color_schemes` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `scheme_name` varchar(50) DEFAULT NULL,
  `primary_color` varchar(7) DEFAULT NULL,
  `secondary_color` varchar(7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ai_app_features`
--

CREATE TABLE `ai_app_features` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `feature` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ai_app_suggestions`
--

CREATE TABLE `ai_app_suggestions` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `app_name` varchar(255) DEFAULT NULL,
  `app_description` text,
  `target_audience` text,
  `monetization_strategy` text,
  `technical_requirements` text,
  `development_time_estimate` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ai_content_categories`
--

CREATE TABLE `ai_content_categories` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ai_marketing_tips`
--

CREATE TABLE `ai_marketing_tips` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `tip` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_analytics`
--

CREATE TABLE `app_analytics` (
  `id` int NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `event_data` json DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_demos`
--

CREATE TABLE `app_demos` (
  `id` varchar(36) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `access_token` varchar(64) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `settings` json NOT NULL,
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_demo_state`
--

CREATE TABLE `app_demo_state` (
  `id` int NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `organization_id` varchar(36) DEFAULT NULL,
  `state` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `background_jobs`
--

CREATE TABLE `background_jobs` (
  `id` varchar(36) NOT NULL,
  `job_type` varchar(100) NOT NULL,
  `priority` enum('high','standard','low') NOT NULL,
  `status` enum('pending','processing','completed','failed','retrying') NOT NULL,
  `payload` json NOT NULL,
  `result` json DEFAULT NULL,
  `error_message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `retry_count` int DEFAULT '0',
  `max_retries` int DEFAULT '3',
  `next_retry_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `isbn13` varchar(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `title_long` text,
  `dewey_decimal` varchar(50) DEFAULT NULL,
  `binding` varchar(100) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `date_published` date DEFAULT NULL,
  `edition` varchar(100) DEFAULT NULL,
  `pages` int DEFAULT NULL,
  `dimensions` varchar(255) DEFAULT NULL,
  `overview` text,
  `image` varchar(255) DEFAULT NULL,
  `image_original` varchar(255) DEFAULT NULL,
  `msrp` decimal(10,2) DEFAULT NULL,
  `excerpt` text,
  `synopsis` text,
  `dimensions_length_value` decimal(10,2) DEFAULT NULL,
  `dimensions_length_unit` varchar(10) DEFAULT NULL,
  `dimensions_width_value` decimal(10,2) DEFAULT NULL,
  `dimensions_width_unit` varchar(10) DEFAULT NULL,
  `dimensions_height_value` decimal(10,2) DEFAULT NULL,
  `dimensions_height_unit` varchar(10) DEFAULT NULL,
  `dimensions_weight_value` decimal(10,2) DEFAULT NULL,
  `dimensions_weight_unit` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_api_fetch` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_authors`
--

CREATE TABLE `book_authors` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_author_mapping`
--

CREATE TABLE `book_author_mapping` (
  `id` int NOT NULL,
  `book_id` int NOT NULL,
  `author_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_other_isbns`
--

CREATE TABLE `book_other_isbns` (
  `id` int NOT NULL,
  `book_id` int NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `binding` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_prices`
--

CREATE TABLE `book_prices` (
  `id` int NOT NULL,
  `book_id` int NOT NULL,
  `book_condition` varchar(100) DEFAULT NULL,
  `merchant` varchar(255) DEFAULT NULL,
  `merchant_logo` varchar(255) DEFAULT NULL,
  `merchant_logo_offset_x` int DEFAULT NULL,
  `merchant_logo_offset_y` int DEFAULT NULL,
  `shipping` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_reviews`
--

CREATE TABLE `book_reviews` (
  `id` int NOT NULL,
  `book_id` int NOT NULL,
  `review_text` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_search_cache`
--

CREATE TABLE `book_search_cache` (
  `id` int NOT NULL,
  `topic` varchar(255) NOT NULL,
  `results` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_subjects`
--

CREATE TABLE `book_subjects` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_subject_mapping`
--

CREATE TABLE `book_subject_mapping` (
  `id` int NOT NULL,
  `book_id` int NOT NULL,
  `subject_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brandfetch_colors`
--

CREATE TABLE `brandfetch_colors` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `color_type` varchar(50) DEFAULT NULL,
  `hex_value` char(7) DEFAULT NULL,
  `brightness` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brandfetch_company_info`
--

CREATE TABLE `brandfetch_company_info` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `employees` int DEFAULT NULL,
  `founded_year` int DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `company_type` varchar(50) DEFAULT NULL,
  `location_city` varchar(255) DEFAULT NULL,
  `location_country` varchar(255) DEFAULT NULL,
  `location_country_code` char(2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brandfetch_data`
--

CREATE TABLE `brandfetch_data` (
  `id` int NOT NULL,
  `domain` varchar(255) NOT NULL,
  `data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brandfetch_links`
--

CREATE TABLE `brandfetch_links` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `platform` varchar(50) DEFAULT NULL,
  `url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brandfetch_logos`
--

CREATE TABLE `brandfetch_logos` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `logo_type` varchar(50) DEFAULT NULL,
  `theme` varchar(50) DEFAULT NULL,
  `url` text,
  `format` varchar(10) DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brandfetch_metadata`
--

CREATE TABLE `brandfetch_metadata` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `long_description` text,
  `quality_score` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cached_books`
--

CREATE TABLE `cached_books` (
  `id` int NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `data` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `charity`
--

CREATE TABLE `charity` (
  `date_of_extract` date DEFAULT NULL COMMENT 'The date that the extract was taken from the main dataset',
  `organisation_number` int NOT NULL COMMENT 'The organisation number for the charity. This is the index value for the charity',
  `registered_charity_number` int NOT NULL,
  `linked_charity_number` int DEFAULT NULL COMMENT 'A number that uniquely identifies the subsidiary or group member associated with a registered charity. Used for user identification purposes where the subsidiary is known by the parent registration number and the subsidiary number. The main parent charity has a linked_charity_number of 0',
  `charity_name` varchar(255) DEFAULT NULL COMMENT 'The Main Name of the Charity',
  `charity_type` varchar(50) DEFAULT NULL COMMENT 'The type of the charity displayed on the public register of charities. Only the main parent charity will have a value for this field',
  `charity_registration_status` varchar(50) DEFAULT NULL COMMENT 'The charity registration status indicates whether a charity is registered or removed',
  `date_of_registration` date DEFAULT NULL COMMENT 'The date the charity was registered with the Charity Commission',
  `date_of_removal` date DEFAULT NULL COMMENT 'This is the date the charity was removed from the Register of Charities. This will not necessarily be the same date that the charity ceased to exist or ceased to operate. For non-removed charities the field is NULL',
  `charity_reporting_status` varchar(50) DEFAULT NULL COMMENT 'The current reporting status of the charity',
  `latest_acc_fin_period_start_date` date DEFAULT NULL,
  `latest_acc_fin_period_end_date` date DEFAULT NULL,
  `latest_income` decimal(15,2) DEFAULT NULL COMMENT 'The latest income submitted by the charity. This is the total gross income submitted on part A of the annual return submission',
  `latest_expenditure` decimal(15,2) DEFAULT NULL COMMENT 'The latest expenditure submitted by a charity. This is the expenditure submitted on part A of the annual return submission',
  `charity_contact_address1` varchar(255) DEFAULT NULL COMMENT 'Charity Address Line 1',
  `charity_contact_address2` varchar(255) DEFAULT NULL COMMENT 'Charity Address Line 2',
  `charity_contact_address3` varchar(255) DEFAULT NULL COMMENT 'Charity Address Line 3',
  `charity_contact_address4` varchar(255) DEFAULT NULL COMMENT 'Charity Address Line 4',
  `charity_contact_address5` varchar(255) DEFAULT NULL COMMENT 'Charity Address Line 5',
  `charity_contact_postcode` varchar(20) DEFAULT NULL COMMENT 'Charity Postcode',
  `charity_contact_phone` varchar(20) DEFAULT NULL COMMENT 'Charity Public Telephone Number',
  `charity_contact_email` varchar(100) DEFAULT NULL COMMENT 'Charity Public email address',
  `charity_contact_web` varchar(255) DEFAULT NULL COMMENT 'Charity Website Address',
  `charity_company_registration_number` varchar(50) DEFAULT NULL COMMENT 'Registered Company Number of the Charity as assigned by Companies House. Integer returned as string',
  `charity_insolvent` tinyint(1) DEFAULT NULL COMMENT 'Indicates if the charity is insolvent',
  `charity_in_administration` tinyint(1) DEFAULT NULL COMMENT 'Indicates if the charity is in administration',
  `charity_previously_excepted` tinyint(1) DEFAULT NULL COMMENT 'Indicates the charity was previously an excepted charity',
  `charity_is_cdf_or_cif` varchar(50) DEFAULT NULL COMMENT 'Indicates whether the charity is a Common Investment Fund or Common Deposit Fund',
  `charity_is_cio` tinyint(1) DEFAULT NULL COMMENT 'Indicates whether the charity is a Charitable Incorporated Organisation',
  `cio_is_dissolved` tinyint(1) DEFAULT NULL COMMENT 'Indicates the CIO is to be dissolved',
  `date_cio_dissolution_notice` date DEFAULT NULL,
  `charity_activities` text COMMENT 'The charity activities, the trustees description of what they do and who they help',
  `charity_gift_aid` tinyint(1) DEFAULT NULL COMMENT 'Indicates whether the charity is registered for gift aid with HMRC. True, False, NULL (not known)',
  `charity_has_land` tinyint(1) DEFAULT NULL COMMENT 'Indicates whether the charity owns or leases any land or buildings. True, False, NULL (not known)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `charity_analysis`
--

CREATE TABLE `charity_analysis` (
  `id` int NOT NULL,
  `organisation_number` int NOT NULL,
  `christianity_score` int NOT NULL,
  `is_church` enum('Yes','No','Unsure') DEFAULT NULL,
  `christianity_score_justification` text NOT NULL,
  `charity_analysis` text NOT NULL,
  `keywords` json NOT NULL,
  `created_at` datetime NOT NULL,
  `openai_model` varchar(100) DEFAULT NULL,
  `input_tokens` int DEFAULT NULL,
  `output_tokens` int DEFAULT NULL,
  `total_tokens` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `charity_annual_return_history`
--

CREATE TABLE `charity_annual_return_history` (
  `date_of_extract` date DEFAULT NULL COMMENT 'The date that the extract was taken from the main dataset',
  `organisation_number` int NOT NULL COMMENT 'The organisation number for the charity. This is the index value for the charity',
  `registered_charity_number` int DEFAULT NULL COMMENT 'The registration number of the registered organisation allocated by the Commission',
  `fin_period_start_date` date NOT NULL COMMENT 'The start date of the financial period which is detailed for the charity',
  `fin_period_end_date` date DEFAULT NULL COMMENT 'The end date of the financial period which is detailed for the charity',
  `ar_cycle_reference` varchar(50) DEFAULT NULL COMMENT 'The annual return cycle to which the submission details relate',
  `reporting_due_date` date DEFAULT NULL COMMENT 'The due date of the financial period which is detailed for the charity',
  `date_annual_return_received` date DEFAULT NULL COMMENT 'The date the annual return was received for the financial period which is detailed for the charity',
  `date_accounts_received` date DEFAULT NULL COMMENT 'The date the charity accounts were received for the financial period which is detailed for the charity',
  `total_gross_income` decimal(15,2) DEFAULT NULL COMMENT 'The total gross income reported on Part A of the annual return for the financial period detailed',
  `total_gross_expenditure` decimal(15,2) DEFAULT NULL COMMENT 'The total gross expenditure reported on Part A of the annual return for the financial period detailed',
  `accounts_qualified` tinyint(1) DEFAULT NULL COMMENT 'Indicates whether the accounts have a qualified opinion. (True or NULL)',
  `suppression_ind` tinyint(1) DEFAULT NULL COMMENT 'An indicator of whether the finances for this year are currently suppressed. 1 = Supressed, 0 = not supressed',
  `suppression_type` varchar(50) DEFAULT NULL COMMENT 'The type of suppression that is applied to the finances for this year'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` varchar(36) NOT NULL,
  `feature_reference` varchar(20) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `parent_id` varchar(36) DEFAULT NULL,
  `depth` int NOT NULL DEFAULT '0',
  `organization_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comment_reactions`
--

CREATE TABLE `comment_reactions` (
  `id` varchar(36) NOT NULL,
  `comment_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `emoji` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `common_domains_exclude`
--

CREATE TABLE `common_domains_exclude` (
  `id` int NOT NULL,
  `domain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_questions`
--

CREATE TABLE `core_questions` (
  `id` varchar(36) NOT NULL,
  `order_index` int NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('multiple_choice','boolean','tristate_boolean','slider','range','text') NOT NULL,
  `options` json DEFAULT NULL COMMENT 'JSON object containing question options like: \r\n    For range: {"min": 0, "max": 100000, "step": 1000, "prefix": "$"}\r\n    For multiple_choice: {"choices": ["option1", "option2"]}',
  `required` tinyint(1) DEFAULT '1',
  `depends_on` json DEFAULT NULL COMMENT 'JSON object containing dependency rules like:\r\n    {"questionId": true} for boolean questions\r\n    {"questionId": ["choice1", "choice2"]} for multiple choice\r\n    {"questionId": {"min": 1000, "max": 5000}} for range questions',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `core_question_responses`
--

CREATE TABLE `core_question_responses` (
  `id` varchar(36) NOT NULL,
  `question_id` varchar(36) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `response_value` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `response_json` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `core_question_responses`
--
DELIMITER $$
CREATE TRIGGER `validate_response_insert` BEFORE INSERT ON `core_question_responses` FOR EACH ROW BEGIN
    DECLARE q_type VARCHAR(20);
    DECLARE q_options JSON;

    -- Get question type and options
    SELECT question_type, options
      INTO q_type, q_options
      FROM core_questions
     WHERE id = NEW.question_id;

    -- Validate based on question type
    CASE q_type
        WHEN 'tristate_boolean' THEN
            IF NOT validate_tristate_response(NEW.response_value) THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Invalid tristate boolean value';
            END IF;
        WHEN 'multiple_choice' THEN
            IF NOT validate_multiple_choice_response(NEW.response_value, q_options) THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Invalid multiple choice value';
            END IF;
        WHEN 'range' THEN
            IF NOT validate_range_response(NEW.response_value, q_options) THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Invalid range value';
            END IF;
    END CASE;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `validate_response_update` BEFORE UPDATE ON `core_question_responses` FOR EACH ROW BEGIN
    DECLARE q_type VARCHAR(20);
    DECLARE q_options JSON;

    -- Get question type and options
    SELECT question_type, options
      INTO q_type, q_options
      FROM core_questions
     WHERE id = NEW.question_id;

    -- Validate based on question type
    CASE q_type
        WHEN 'tristate_boolean' THEN
            IF NOT validate_tristate_response(NEW.response_value) THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Invalid tristate boolean value';
            END IF;
        WHEN 'multiple_choice' THEN
            IF NOT validate_multiple_choice_response(NEW.response_value, q_options) THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Invalid multiple choice value';
            END IF;
        WHEN 'range' THEN
            IF NOT validate_range_response(NEW.response_value, q_options) THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Invalid range value';
            END IF;
    END CASE;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `crawl_tracking`
--

CREATE TABLE `crawl_tracking` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `url` varchar(2048) NOT NULL,
  `last_crawled_at` datetime NOT NULL,
  `crawl_count` int DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_ai_data`
--

CREATE TABLE `domain_ai_data` (
  `id` int NOT NULL,
  `domain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_analysis`
--

CREATE TABLE `domain_analysis` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `website_type` varchar(50) DEFAULT NULL,
  `content_relevance` json DEFAULT NULL,
  `entities` json DEFAULT NULL,
  `summary` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_apps`
--

CREATE TABLE `domain_apps` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `app_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `app_store` enum('google_play','apple_app_store','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `app_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `app_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `app_description` text COLLATE utf8mb4_unicode_ci,
  `icon_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discovered_on_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `context_text` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_app_ideas`
--

CREATE TABLE `domain_app_ideas` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `idea_number` int NOT NULL,
  `headline` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_app_suggestions`
--

CREATE TABLE `domain_app_suggestions` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `name_option_1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_option_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_option_3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `target_audience` text COLLATE utf8mb4_unicode_ci,
  `monetization_strategy` text COLLATE utf8mb4_unicode_ci,
  `development_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_blog_content`
--

CREATE TABLE `domain_blog_content` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `blog_url` varchar(255) DEFAULT NULL,
  `articles` json DEFAULT NULL,
  `has_blog` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_blog_info`
--

CREATE TABLE `domain_blog_info` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `blog_url` varchar(1024) NOT NULL,
  `blog_title` varchar(255) DEFAULT NULL,
  `blog_type` enum('blog','news','updates','articles','press','other') DEFAULT 'blog',
  `estimated_post_count` int DEFAULT NULL,
  `latest_post_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_brand_analysis`
--

CREATE TABLE `domain_brand_analysis` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `industry_category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_audience` text COLLATE utf8mb4_unicode_ci,
  `brand_voice` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand_values` text COLLATE utf8mb4_unicode_ci,
  `market_position` text COLLATE utf8mb4_unicode_ci,
  `competitive_advantage` text COLLATE utf8mb4_unicode_ci,
  `key_differentiators` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_calendar_sources`
--

CREATE TABLE `domain_calendar_sources` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `calendar_type` enum('embedded','ics_feed','events_page','api','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `calendar_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feed_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calendar_provider` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_colors`
--

CREATE TABLE `domain_colors` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `primary_color` varchar(20) DEFAULT NULL,
  `secondary_colors` json DEFAULT NULL,
  `palette` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_color_schemes`
--

CREATE TABLE `domain_color_schemes` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `scheme_number` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary_color` char(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `secondary_color` char(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accent_color` char(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_content_categories`
--

CREATE TABLE `domain_content_categories` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_crawl_progress`
--

CREATE TABLE `domain_crawl_progress` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `job_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pages_total` int DEFAULT '0',
  `pages_crawled` int DEFAULT '0',
  `current_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_active` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_downloads`
--

CREATE TABLE `domain_downloads` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `file_url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Filename extracted from URL or link text',
  `file_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pdf' COMMENT 'e.g., pdf, docx',
  `page_url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'The page where the download link was found',
  `link_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'The text of the link pointing to the file',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_events`
--

CREATE TABLE `domain_events` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `event_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_description` text COLLATE utf8mb4_unicode_ci,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `timezone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_address` text COLLATE utf8mb4_unicode_ci,
  `organizer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ics_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `extraction_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schema_markup` tinyint(1) DEFAULT '0',
  `recurring` tinyint(1) DEFAULT '0',
  `recurrence_pattern` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `domain_features`
--

CREATE TABLE `domain_features` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `priority` enum('high','medium','low') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_feeds_found`
--

CREATE TABLE `domain_feeds_found` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `feed_url` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feed_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `feed_type` enum('podcast','blog','comments','product','events','job','social','video','unknown') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `feed_format` enum('rss','atom','json','xml','ics','csv','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'xml',
  `has_enclosures` tinyint(1) DEFAULT '0',
  `item_count` int DEFAULT '0',
  `discovery_source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discovered_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_checked_at` datetime DEFAULT NULL,
  `last_updated_at` datetime DEFAULT NULL,
  `status` enum('active','inactive','error','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_images`
--

CREATE TABLE `domain_images` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `linkto_url` text,
  `file_name` varchar(255) DEFAULT NULL,
  `alt_text` text,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `file_format` varchar(20) DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `subcategory` varchar(50) DEFAULT NULL,
  `prominence_score` float DEFAULT NULL,
  `page_url` varchar(1024) DEFAULT NULL,
  `page_location` text,
  `context` text,
  `selector` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_info`
--

CREATE TABLE `domain_info` (
  `id` int NOT NULL,
  `domain` varchar(255) NOT NULL,
  `normalized_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','processing','complete','failed') DEFAULT 'pending',
  `last_crawled_at` datetime DEFAULT NULL,
  `error` text,
  `data` json DEFAULT NULL,
  `ai_analysis` json DEFAULT NULL,
  `processing_attempts` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by_user_id` varchar(255) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `error_message` text,
  `last_processed_at` timestamp NULL DEFAULT NULL,
  `screenshot_desktop` varchar(500) DEFAULT NULL,
  `screenshot_mobile` varchar(500) DEFAULT NULL,
  `screenshots_captured_at` datetime DEFAULT NULL,
  `screenshot_desktop_full` varchar(255) DEFAULT NULL,
  `screenshot_mobile_full` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_isbn_data`
--

CREATE TABLE `domain_isbn_data` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `isbn_type` enum('ISBN-10','ISBN-13') NOT NULL,
  `page_url` text NOT NULL,
  `context` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_isbn_images`
--

CREATE TABLE `domain_isbn_images` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `image_url` text NOT NULL,
  `page_url` text NOT NULL,
  `alt_text` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_jobs`
--

CREATE TABLE `domain_jobs` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `title` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employment_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'e.g., Full-time, Part-time, Contract',
  `page_url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'The page where the job was found (e.g., careers page)',
  `application_url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Direct link to apply, if available',
  `posted_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_marketing_tips`
--

CREATE TABLE `domain_marketing_tips` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `tip_text` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_media_content`
--

CREATE TABLE `domain_media_content` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `url` varchar(1024) NOT NULL,
  `title` varchar(512) DEFAULT NULL,
  `description` text,
  `media_type` enum('video','audio','image','pdf','other') NOT NULL DEFAULT 'video',
  `source` varchar(100) DEFAULT NULL,
  `source_id` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(1024) DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `embed_code` text,
  `page_url` varchar(1024) DEFAULT NULL,
  `content_type` varchar(100) DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_opengraph`
--

CREATE TABLE `domain_opengraph` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `site_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locale` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_fetched` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `platform` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_social_profile` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_pages`
--

CREATE TABLE `domain_pages` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `job_id` varchar(36) NOT NULL,
  `url` varchar(2048) NOT NULL,
  `title` varchar(512) DEFAULT NULL,
  `raw_html` longtext,
  `status_code` int DEFAULT NULL,
  `content_type` varchar(255) DEFAULT NULL,
  `crawled_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_podcast_episodes`
--

CREATE TABLE `domain_podcast_episodes` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `feed_id` int DEFAULT NULL,
  `guid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `audio_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `duration` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_podcast_feeds`
--

CREATE TABLE `domain_podcast_feeds` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `feed_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `feed_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'rss',
  `episode_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_ranked_keywords`
--

CREATE TABLE `domain_ranked_keywords` (
  `ranked_keyword_id` bigint NOT NULL,
  `domain_id` int NOT NULL,
  `keyword` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int NOT NULL,
  `previous_position` int DEFAULT NULL,
  `search_volume` int DEFAULT NULL,
  `cpc` decimal(10,2) DEFAULT NULL,
  `competition` decimal(5,4) DEFAULT NULL,
  `url` varchar(2083) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `retrieval_date` datetime NOT NULL COMMENT 'When this snapshot was taken',
  `raw_data` json DEFAULT NULL COMMENT 'Full API result for this row'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_robots`
--

CREATE TABLE `domain_robots` (
  `id` int NOT NULL,
  `domain` varchar(255) NOT NULL,
  `content` text,
  `last_fetched` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_rss_feeds`
--

CREATE TABLE `domain_rss_feeds` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `feed_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `feed_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'rss',
  `item_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_schema_markup`
--

CREATE TABLE `domain_schema_markup` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `page_id` int DEFAULT NULL,
  `url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `schema_type` varchar(255) NOT NULL,
  `schema_context` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `markup_format` enum('json-ld','microdata','rdfa') NOT NULL,
  `markup_data` json NOT NULL,
  `parent_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_seo_competitors`
--

CREATE TABLE `domain_seo_competitors` (
  `competitor_id` bigint NOT NULL,
  `domain_id` int NOT NULL,
  `total_count` int NOT NULL,
  `items_count` int NOT NULL,
  `retrieval_date` datetime NOT NULL COMMENT 'When this snapshot was taken'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_seo_competitors_cache`
--

CREATE TABLE `domain_seo_competitors_cache` (
  `id` int NOT NULL,
  `domain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `competitor_data` json NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_seo_competitor_domains`
--

CREATE TABLE `domain_seo_competitor_domains` (
  `competitor_domain_id` bigint NOT NULL,
  `competitor_id` bigint NOT NULL,
  `domain_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avg_position` decimal(10,2) DEFAULT NULL,
  `sum_position` int DEFAULT NULL,
  `intersections` int DEFAULT NULL,
  `raw_data` json DEFAULT NULL COMMENT 'Full API result for this competitor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_seo_competitor_metrics`
--

CREATE TABLE `domain_seo_competitor_metrics` (
  `metric_id` bigint NOT NULL,
  `competitor_domain_id` bigint NOT NULL,
  `metric_type` enum('metrics_organic','metrics_paid','competitor_metrics_organic','competitor_metrics_paid','full_domain_metrics_organic','full_domain_metrics_paid') COLLATE utf8mb4_unicode_ci NOT NULL,
  `pos_1` int DEFAULT '0',
  `pos_2_3` int DEFAULT '0',
  `pos_4_10` int DEFAULT '0',
  `pos_11_20` int DEFAULT '0',
  `pos_21_30` int DEFAULT '0',
  `pos_31_40` int DEFAULT '0',
  `pos_41_50` int DEFAULT '0',
  `pos_51_60` int DEFAULT '0',
  `pos_61_70` int DEFAULT '0',
  `pos_71_80` int DEFAULT '0',
  `pos_81_90` int DEFAULT '0',
  `pos_91_100` int DEFAULT '0',
  `etv` decimal(20,6) DEFAULT '0.000000',
  `impressions_etv` decimal(20,6) DEFAULT '0.000000',
  `count` int DEFAULT '0',
  `estimated_paid_traffic_cost` decimal(20,6) DEFAULT '0.000000',
  `is_new` int DEFAULT '0',
  `is_up` int DEFAULT '0',
  `is_down` int DEFAULT '0',
  `is_lost` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_seo_keywords_cache`
--

CREATE TABLE `domain_seo_keywords_cache` (
  `id` int NOT NULL,
  `domain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keywords_data` json NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_site_structure`
--

CREATE TABLE `domain_site_structure` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `site_map` json DEFAULT NULL,
  `prominent_links` json DEFAULT NULL,
  `navigation_structure` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_social_podcast`
--

CREATE TABLE `domain_social_podcast` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `social_links` json DEFAULT NULL,
  `social_content` json DEFAULT NULL,
  `podcast_feeds` json DEFAULT NULL,
  `podcast_episodes` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_website_metadata`
--

CREATE TABLE `domain_website_metadata` (
  `id` int NOT NULL,
  `page_id` int NOT NULL,
  `domain_id` int NOT NULL,
  `url` text NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `keywords` text,
  `author` varchar(255) DEFAULT NULL,
  `language` varchar(10) DEFAULT NULL,
  `meta_robots` varchar(255) DEFAULT NULL,
  `canonical_url` text,
  `favicon_url` text,
  `og_image_url` text,
  `og_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_youtube_captions`
--

CREATE TABLE `domain_youtube_captions` (
  `caption_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Primary key, YouTube''s unique identifier for the caption track.',
  `domain_id` int NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `video_id` char(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Foreign key to the video this caption belongs to.',
  `language` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Language code of the caption (e.g., "en" for English).',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Optional name/title of the caption track.',
  `auto_generated` tinyint(1) DEFAULT NULL COMMENT 'Whether this is an automatically generated caption track.',
  `caption_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Type of caption (e.g., "standard" or "ASR" for auto-generated).',
  `last_updated` datetime DEFAULT NULL COMMENT 'When the caption track was last updated.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_youtube_channels`
--

CREATE TABLE `domain_youtube_channels` (
  `domain_id` int NOT NULL COMMENT 'reference to domain id in domain_info table\r\n',
  `channel_id` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'YouTube''s unique identifier for the channel (starts with "UC").',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The display name/title of the YouTube channel.',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'The full channel description as provided by the channel owner.',
  `published_at` datetime DEFAULT NULL COMMENT 'When the channel was created on YouTube.',
  `thumbnail_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL to the channel''s default thumbnail/avatar image.',
  `subscriber_count` bigint DEFAULT NULL COMMENT 'Number of subscribers to the channel.',
  `view_count` bigint DEFAULT NULL COMMENT 'Total view count across all videos on the channel.',
  `video_count` int DEFAULT NULL COMMENT 'Total number of videos uploaded to the channel.',
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Country code where the channel is based (if provided).',
  `topic_categories` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON array of Wikipedia category URLs representing the channel''s topics.',
  `etag` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Entity tag for the resource',
  `kind` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Type of YouTube resource',
  `custom_url` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Custom URL for the channel',
  `default_language` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Default language of the channel',
  `localized_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Localized title',
  `localized_description` text COLLATE utf8mb4_unicode_ci COMMENT 'Localized description',
  `hidden_subscriber_count` tinyint(1) DEFAULT NULL COMMENT 'Whether subscriber count is hidden',
  `related_playlists` json DEFAULT NULL COMMENT 'Related playlists (likes, favorites, uploads)',
  `privacy_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Privacy status of the channel',
  `is_linked` tinyint(1) DEFAULT NULL COMMENT 'Whether the channel is linked to a Google account',
  `long_uploads_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Long uploads status',
  `made_for_kids` tinyint(1) DEFAULT NULL COMMENT 'Whether content is made for kids',
  `self_declared_made_for_kids` tinyint(1) DEFAULT NULL COMMENT 'Self-declared made for kids status',
  `branding_settings` json DEFAULT NULL COMMENT 'Channel branding settings',
  `audit_details` json DEFAULT NULL COMMENT 'Audit standing information',
  `content_owner` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Content owner ID',
  `time_linked` datetime DEFAULT NULL COMMENT 'When channel was linked to content owner',
  `localizations` json DEFAULT NULL COMMENT 'Titles and descriptions in different languages'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_youtube_comments`
--

CREATE TABLE `domain_youtube_comments` (
  `comment_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Primary key, YouTube''s unique identifier for the comment.',
  `domain_id` int NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `video_id` char(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Foreign key to the video this comment belongs to.',
  `parent_comment_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'For replies, the ID of the parent comment; NULL for top-level comments.',
  `author_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Display name of the comment author.',
  `author_channel_id` varchar(24) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YouTube channel ID of the comment author (if available).',
  `text` text COLLATE utf8mb4_unicode_ci COMMENT 'The comment text content.',
  `like_count` int DEFAULT NULL COMMENT 'Number of likes on this comment.',
  `published_at` datetime DEFAULT NULL COMMENT 'When the comment was posted.',
  `updated_at` datetime DEFAULT NULL COMMENT 'When the comment was last edited (if applicable).'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_youtube_playlists`
--

CREATE TABLE `domain_youtube_playlists` (
  `playlist_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Primary key, YouTube''s unique identifier for the playlist.',
  `domain_id` int NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `channel_id` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'YouTube channel ID that owns this playlist.',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The title of the playlist.',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'The description of the playlist (may be empty).',
  `published_at` datetime DEFAULT NULL COMMENT 'When the playlist was created.',
  `item_count` int DEFAULT NULL COMMENT 'Number of videos in the playlist.',
  `playlist_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Categorizes the playlist (e.g., "Uploads" for the auto-generated uploads playlist, or "Custom" for user-created playlists).'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_youtube_videos`
--

CREATE TABLE `domain_youtube_videos` (
  `video_id` char(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Primary key, YouTube''s unique identifier for the video.',
  `domain_id` int NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `channel_id` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The YouTube channel ID that uploaded this video.',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The title of the video.',
  `description` longtext COLLATE utf8mb4_unicode_ci COMMENT 'The full description of the video.',
  `published_at` datetime DEFAULT NULL COMMENT 'When the video was published on YouTube.',
  `duration` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Video length in ISO 8601 duration format (e.g., "PT1H30M15S" for 1 hour, 30 minutes, 15 seconds).',
  `definition` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Video quality, either "sd" (standard definition) or "hd" (high definition).',
  `caption_available` tinyint(1) DEFAULT NULL COMMENT 'Whether the video has any captions/subtitles available.',
  `licensed_content` tinyint(1) DEFAULT NULL COMMENT 'Whether the content is marked as licensed by YouTube.',
  `privacy_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Privacy setting of the video ("public", "unlisted", or "private").',
  `license` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'License type for the video (e.g., "youtube" for standard YouTube license, "creativeCommon" for CC license).',
  `view_count` bigint DEFAULT NULL COMMENT 'Number of views the video has received.',
  `like_count` bigint DEFAULT NULL COMMENT 'Number of likes the video has received.',
  `comment_count` bigint DEFAULT NULL COMMENT 'Number of comments on the video.',
  `category_id` int DEFAULT NULL COMMENT 'YouTube category ID for the video.',
  `tags` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON array of tags assigned to the video.',
  `topics` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON array of topic category URLs associated with this video.',
  `thumbnail_default` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL to the default (small) thumbnail image.',
  `thumbnail_high` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL to the high-resolution thumbnail image.',
  `made_for_kids` tinyint(1) DEFAULT NULL COMMENT 'Whether the video is designated as made for children.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_youtube_video_topics`
--

CREATE TABLE `domain_youtube_video_topics` (
  `id` int NOT NULL COMMENT 'Auto-increment primary key.',
  `domain_id` int NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `video_id` char(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Foreign key to the video.',
  `topic_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Optional identifier for the topic, may be NULL for category-only entries.',
  `topic_category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL to a Wikipedia category representing the topic (e.g., "https://en.wikipedia.org/wiki/Religion").',
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Classification of the topic reference (typically "category").'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `features`
--

CREATE TABLE `features` (
  `reference` varchar(20) NOT NULL,
  `section` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `requirement` varchar(50) DEFAULT NULL,
  `depends_on` json DEFAULT NULL,
  `version_id` varchar(36) DEFAULT NULL,
  `cost_indicator` enum('$','$$','$$$') DEFAULT NULL,
  `support_doc_url` varchar(255) DEFAULT NULL,
  `support_video_url` varchar(255) DEFAULT NULL,
  `warning_message` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_admin_comments`
--

CREATE TABLE `feature_admin_comments` (
  `id` varchar(36) NOT NULL,
  `feature_reference` varchar(20) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_admin_notes`
--

CREATE TABLE `feature_admin_notes` (
  `id` varchar(36) NOT NULL,
  `feature_reference` varchar(20) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `note_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_conflicts`
--

CREATE TABLE `feature_conflicts` (
  `id` varchar(36) NOT NULL,
  `feature_reference` varchar(20) NOT NULL,
  `conflicting_feature_reference` varchar(20) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_dependencies`
--

CREATE TABLE `feature_dependencies` (
  `id` varchar(36) NOT NULL,
  `feature_reference` varchar(20) NOT NULL,
  `required_feature_reference` varchar(20) NOT NULL,
  `description` text NOT NULL,
  `is_system_dependency` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_fair_prices`
--

CREATE TABLE `feature_fair_prices` (
  `id` varchar(36) NOT NULL,
  `feature_reference` varchar(20) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `price_amount` decimal(10,2) NOT NULL,
  `price_frequency` enum('one-off','monthly','yearly') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_versions`
--

CREATE TABLE `feature_versions` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `version_number` varchar(50) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_visibility_rules`
--

CREATE TABLE `feature_visibility_rules` (
  `id` varchar(36) NOT NULL,
  `feature_reference` varchar(20) NOT NULL,
  `rule_type` enum('show_if','hide_if') NOT NULL,
  `conditions` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feed_classification_diagnostics`
--

CREATE TABLE `feed_classification_diagnostics` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `feed_url` varchar(512) NOT NULL,
  `original_content` text,
  `detected_type` enum('podcast','blog','rss','atom','unknown') NOT NULL DEFAULT 'unknown',
  `classification_reason` text,
  `has_enclosures` tinyint(1) DEFAULT '0',
  `content_sample` text,
  `headers` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `imprints`
--

CREATE TABLE `imprints` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `publisher_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invitations`
--

CREATE TABLE `invitations` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `role` enum('admin','member','viewer') NOT NULL,
  `login_token` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `last_used` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `isbndb_api_requests`
--

CREATE TABLE `isbndb_api_requests` (
  `id` int NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `request_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status_code` int DEFAULT NULL,
  `response_message` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_tokens`
--

CREATE TABLE `login_tokens` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `token` varchar(36) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `org_type` enum('client','internal') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `website_url` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `feature_version_id` varchar(36) DEFAULT NULL,
  `preferred_currency` varchar(3) DEFAULT 'USD'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organization_app_settings`
--

CREATE TABLE `organization_app_settings` (
  `id` int NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `background_video_id` varchar(255) DEFAULT NULL,
  `background_video_url` text,
  `background_video_attribution` varchar(255) DEFAULT NULL,
  `app_style` varchar(50) DEFAULT 'classic',
  `feature_toggles` json DEFAULT NULL,
  `selected_books` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organization_members`
--

CREATE TABLE `organization_members` (
  `organization_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role` enum('admin','member','viewer') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_selected` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organization_questionnaire_responses`
--

CREATE TABLE `organization_questionnaire_responses` (
  `id` varchar(36) NOT NULL,
  `question_id` varchar(36) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `locked_to_user_id` varchar(36) DEFAULT NULL,
  `response_value` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organization_settings`
--

CREATE TABLE `organization_settings` (
  `organization_id` varchar(36) NOT NULL,
  `enable_fair_price` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `performance_thresholds`
--

CREATE TABLE `performance_thresholds` (
  `id` int NOT NULL,
  `metric_name` varchar(100) NOT NULL,
  `warning_threshold` decimal(10,2) NOT NULL,
  `critical_threshold` decimal(10,2) NOT NULL,
  `evaluation_period` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `platform_clients`
--

CREATE TABLE `platform_clients` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','completed','archived') DEFAULT 'active',
  `organization_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_participants`
--

CREATE TABLE `project_participants` (
  `project_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `invite_status` enum('pending','accepted','declined') DEFAULT 'pending',
  `last_active` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `publishers`
--

CREATE TABLE `publishers` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `organization_id` varchar(36) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questionnaire_comments`
--

CREATE TABLE `questionnaire_comments` (
  `id` varchar(36) NOT NULL,
  `question_id` varchar(36) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `parent_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questionnaire_comment_reactions`
--

CREATE TABLE `questionnaire_comment_reactions` (
  `id` varchar(36) NOT NULL,
  `comment_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `emoji` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questionnaire_completions`
--

CREATE TABLE `questionnaire_completions` (
  `id` varchar(36) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questionnaire_reactions`
--

CREATE TABLE `questionnaire_reactions` (
  `id` varchar(36) NOT NULL,
  `question_id` varchar(36) NOT NULL,
  `response_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `emoji` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quick_questionnaire_responses`
--

CREATE TABLE `quick_questionnaire_responses` (
  `id` varchar(36) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `submission_date` datetime NOT NULL,
  `source` varchar(255) NOT NULL,
  `app_type` varchar(255) DEFAULT NULL,
  `content_type` varchar(255) DEFAULT NULL,
  `monetization` varchar(255) DEFAULT NULL,
  `target_audience` varchar(255) DEFAULT NULL,
  `features` varchar(255) DEFAULT NULL,
  `launch_timeline` varchar(255) DEFAULT NULL,
  `content_volume` varchar(255) DEFAULT NULL,
  `budget_range` varchar(255) DEFAULT NULL,
  `customization_requirements` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` varchar(36) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `report_type` varchar(50) NOT NULL,
  `version` int NOT NULL DEFAULT '1',
  `filepath` varchar(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `download_count` int NOT NULL DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `generated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `settings_json` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `responses`
--

CREATE TABLE `responses` (
  `id` varchar(36) NOT NULL,
  `feature_reference` varchar(20) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `response_value` enum('required','nice_to_have','not_needed','dont_know') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `organization_id` varchar(36) DEFAULT NULL,
  `is_system_dependency` tinyint(1) DEFAULT '0',
  `system_dependency_source` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `responses_backup`
--

CREATE TABLE `responses_backup` (
  `id` varchar(36) NOT NULL,
  `feature_reference` varchar(20) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `response_value` enum('required','nice_to_have','not_needed') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `organization_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scheduled_jobs`
--

CREATE TABLE `scheduled_jobs` (
  `id` varchar(36) NOT NULL,
  `job_type` varchar(100) NOT NULL,
  `schedule_type` enum('cron','interval','one_time') NOT NULL,
  `schedule_value` varchar(100) NOT NULL,
  `last_run` timestamp NULL DEFAULT NULL,
  `next_run` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scraped_pages`
--

CREATE TABLE `scraped_pages` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `url` varchar(2048) NOT NULL,
  `title` varchar(512) DEFAULT NULL,
  `content_hash` varchar(64) DEFAULT NULL,
  `last_crawled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `crawl_count` int DEFAULT '1',
  `status_code` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scrape_jobs`
--

CREATE TABLE `scrape_jobs` (
  `id` varchar(36) NOT NULL,
  `domain` varchar(255) NOT NULL,
  `status` enum('queued','processing','complete','failed','cancelled') NOT NULL,
  `params` text,
  `max_pages` int DEFAULT '1',
  `created_at` datetime NOT NULL,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `error_message` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `section_visibility_rules`
--

CREATE TABLE `section_visibility_rules` (
  `id` varchar(36) NOT NULL,
  `section_name` varchar(100) NOT NULL,
  `rule_type` enum('show_if','hide_if') NOT NULL,
  `conditions` json NOT NULL COMMENT 'Array of condition objects with structure:\r\n{\r\n  "questionId": "UUID of core_question",\r\n  "type": "includes|excludes|equals|range",\r\n  "values": ["array", "of", "values"] for includes/excludes,\r\n  "value": true/false for equals,\r\n  "min": number, "max": number for range\r\n}',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_alerts`
--

CREATE TABLE `system_alerts` (
  `id` int NOT NULL,
  `alert_type` varchar(100) NOT NULL,
  `severity` enum('info','warning','critical') NOT NULL,
  `message` text NOT NULL,
  `component` varchar(100) NOT NULL,
  `metric_value` decimal(10,2) DEFAULT NULL,
  `threshold_value` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `resolution_note` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_metrics`
--

CREATE TABLE `system_metrics` (
  `id` int NOT NULL,
  `metric_name` varchar(100) NOT NULL,
  `metric_value` decimal(10,2) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `component` varchar(100) NOT NULL,
  `instance_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` varchar(36) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `team_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role` enum('lead','member') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_questionnaire_responses`
--

CREATE TABLE `user_questionnaire_responses` (
  `id` varchar(36) NOT NULL,
  `question_id` varchar(36) NOT NULL,
  `organization_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `response_value` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `response_json` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_search_cache`
--

CREATE TABLE `video_search_cache` (
  `id` int NOT NULL,
  `search_term` varchar(255) NOT NULL,
  `results` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `website_metadata`
--

CREATE TABLE `website_metadata` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `keywords` text,
  `body_text` text,
  `logo_url` text,
  `theme_color` varchar(7) DEFAULT NULL,
  `secondary_color` varchar(7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `website_social_links`
--

CREATE TABLE `website_social_links` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `platform` varchar(50) DEFAULT NULL,
  `url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `youtube_extraction_jobs`
--

CREATE TABLE `youtube_extraction_jobs` (
  `id` int NOT NULL COMMENT 'Auto-increment primary key for the job.',
  `domain_id` int NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `domain_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Domain name used for searching if channel ID not found in social links.',
  `channel_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','processing','completed','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'Current status of the job ("pending", "processing", "completed", or "failed").',
  `source_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Original URL of the channel if found via social media',
  `source` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result` json DEFAULT NULL COMMENT 'Result data from the extraction process, including success status and error details if applicable.',
  `created_at` datetime NOT NULL COMMENT 'When the job was created.',
  `updated_at` datetime NOT NULL COMMENT 'When the job was last updated.',
  `quota_credits` int DEFAULT '0' COMMENT 'Tracks the YouTube API quota credits used for this extraction job',
  `quota_usage_details` json DEFAULT (json_object()) COMMENT 'JSON field storing detailed breakdown of quota usage by API method'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_app_color_schemes`
--
ALTER TABLE `ai_app_color_schemes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `ai_app_features`
--
ALTER TABLE `ai_app_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `ai_app_suggestions`
--
ALTER TABLE `ai_app_suggestions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain_id` (`domain_id`);

--
-- Indexes for table `ai_content_categories`
--
ALTER TABLE `ai_content_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `ai_marketing_tips`
--
ALTER TABLE `ai_marketing_tips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `app_analytics`
--
ALTER TABLE `app_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_type` (`event_type`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `app_demos`
--
ALTER TABLE `app_demos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `access_token` (`access_token`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `app_demo_state`
--
ALTER TABLE `app_demo_state`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_org` (`user_id`,`organization_id`);

--
-- Indexes for table `background_jobs`
--
ALTER TABLE `background_jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status_priority` (`status`,`priority`),
  ADD KEY `idx_job_type` (`job_type`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`isbn`);
ALTER TABLE `books` ADD FULLTEXT KEY `title` (`title`,`publisher`);

--
-- Indexes for table `book_authors`
--
ALTER TABLE `book_authors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `book_author_mapping`
--
ALTER TABLE `book_author_mapping`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `book_id` (`book_id`,`author_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `book_other_isbns`
--
ALTER TABLE `book_other_isbns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `book_id` (`book_id`,`isbn`);

--
-- Indexes for table `book_prices`
--
ALTER TABLE `book_prices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `book_reviews`
--
ALTER TABLE `book_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `book_search_cache`
--
ALTER TABLE `book_search_cache`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `topic` (`topic`);

--
-- Indexes for table `book_subjects`
--
ALTER TABLE `book_subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `book_subject_mapping`
--
ALTER TABLE `book_subject_mapping`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `book_id` (`book_id`,`subject_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `brandfetch_colors`
--
ALTER TABLE `brandfetch_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_brandfetch_colors_domain` (`domain_id`);

--
-- Indexes for table `brandfetch_company_info`
--
ALTER TABLE `brandfetch_company_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_brandfetch_company_domain` (`domain_id`);

--
-- Indexes for table `brandfetch_data`
--
ALTER TABLE `brandfetch_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain` (`domain`);

--
-- Indexes for table `brandfetch_links`
--
ALTER TABLE `brandfetch_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_brandfetch_links_domain` (`domain_id`);

--
-- Indexes for table `brandfetch_logos`
--
ALTER TABLE `brandfetch_logos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_brandfetch_logos_domain` (`domain_id`);

--
-- Indexes for table `brandfetch_metadata`
--
ALTER TABLE `brandfetch_metadata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_brandfetch_metadata_domain` (`domain_id`);

--
-- Indexes for table `cached_books`
--
ALTER TABLE `cached_books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_isbn` (`isbn`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `charity`
--
ALTER TABLE `charity`
  ADD PRIMARY KEY (`organisation_number`),
  ADD KEY `idx_charity_registration` (`registered_charity_number`,`linked_charity_number`),
  ADD KEY `idx_charity_name` (`charity_name`),
  ADD KEY `idx_charity_postcode` (`charity_contact_postcode`),
  ADD KEY `idx_charity_company` (`charity_company_registration_number`),
  ADD KEY `idx_charity_status` (`charity_registration_status`),
  ADD KEY `idx_charity_registered_number` (`registered_charity_number`),
  ADD KEY `idx_charity_registration_number` (`registered_charity_number`);
ALTER TABLE `charity` ADD FULLTEXT KEY `charity_name` (`charity_name`);

--
-- Indexes for table `charity_analysis`
--
ALTER TABLE `charity_analysis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_analysis_org_number` (`organisation_number`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `fk_comments_organization` (`organization_id`);

--
-- Indexes for table `comment_reactions`
--
ALTER TABLE `comment_reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_reaction` (`comment_id`,`user_id`,`emoji`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `common_domains_exclude`
--
ALTER TABLE `common_domains_exclude`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain` (`domain`);

--
-- Indexes for table `core_questions`
--
ALTER TABLE `core_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order` (`order_index`);

--
-- Indexes for table `core_question_responses`
--
ALTER TABLE `core_question_responses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_org_question` (`organization_id`,`question_id`),
  ADD KEY `fk_question` (`question_id`),
  ADD KEY `fk_organization` (`organization_id`),
  ADD KEY `idx_response_json` ((cast(json_unquote(json_extract(`response_json`,_utf8mb4'$.min')) as unsigned)));

--
-- Indexes for table `crawl_tracking`
--
ALTER TABLE `crawl_tracking`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_domain_url` (`domain_id`,`url`(255));

--
-- Indexes for table `domain_ai_data`
--
ALTER TABLE `domain_ai_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_domain` (`domain`),
  ADD KEY `idx_domain` (`domain`);

--
-- Indexes for table `domain_analysis`
--
ALTER TABLE `domain_analysis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_analysis_domain_fk` (`domain_id`);

--
-- Indexes for table `domain_apps`
--
ALTER TABLE `domain_apps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_app` (`domain_id`,`app_store`,`app_id`);

--
-- Indexes for table `domain_app_ideas`
--
ALTER TABLE `domain_app_ideas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_app_suggestions`
--
ALTER TABLE `domain_app_suggestions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_blog_content`
--
ALTER TABLE `domain_blog_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_blog_content_domain_fk` (`domain_id`);

--
-- Indexes for table `domain_blog_info`
--
ALTER TABLE `domain_blog_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_domain_blog` (`domain_id`,`blog_url`(255));

--
-- Indexes for table `domain_brand_analysis`
--
ALTER TABLE `domain_brand_analysis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_calendar_sources`
--
ALTER TABLE `domain_calendar_sources`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_calendar` (`domain_id`,`calendar_url`(512));

--
-- Indexes for table `domain_colors`
--
ALTER TABLE `domain_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_colors_domain_fk` (`domain_id`);

--
-- Indexes for table `domain_color_schemes`
--
ALTER TABLE `domain_color_schemes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_content_categories`
--
ALTER TABLE `domain_content_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_crawl_progress`
--
ALTER TABLE `domain_crawl_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_domain_job` (`domain_id`,`job_id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_downloads`
--
ALTER TABLE `domain_downloads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_domain_download` (`domain_id`,`file_url`(512)),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_events`
--
ALTER TABLE `domain_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_domain_date` (`domain_id`,`start_date`);

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
-- Indexes for table `domain_features`
--
ALTER TABLE `domain_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_feeds_found`
--
ALTER TABLE `domain_feeds_found`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `feed_url_domain_idx` (`domain_id`,`feed_url`(255)),
  ADD KEY `domain_id_idx` (`domain_id`),
  ADD KEY `feed_type_idx` (`feed_type`),
  ADD KEY `feed_format_idx` (`feed_format`),
  ADD KEY `discovered_at_idx` (`discovered_at`);

--
-- Indexes for table `domain_images`
--
ALTER TABLE `domain_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_images_domain_fk` (`domain_id`);

--
-- Indexes for table `domain_info`
--
ALTER TABLE `domain_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain` (`domain`),
  ADD KEY `idx_domain_info_screenshots_captured_at` (`screenshots_captured_at`);

--
-- Indexes for table `domain_isbn_data`
--
ALTER TABLE `domain_isbn_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain_isbn` (`domain_id`,`isbn`);

--
-- Indexes for table `domain_isbn_images`
--
ALTER TABLE `domain_isbn_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_isbn_images_domain_fk` (`domain_id`);

--
-- Indexes for table `domain_jobs`
--
ALTER TABLE `domain_jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_marketing_tips`
--
ALTER TABLE `domain_marketing_tips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_media_content`
--
ALTER TABLE `domain_media_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_domain_media_content_domain` (`domain_id`),
  ADD KEY `idx_domain_media_content_type` (`media_type`),
  ADD KEY `idx_domain_media_content_source` (`source`,`source_id`);

--
-- Indexes for table `domain_opengraph`
--
ALTER TABLE `domain_opengraph`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain_id` (`domain_id`,`url`),
  ADD KEY `idx_social_profiles` (`domain_id`,`is_social_profile`);

--
-- Indexes for table `domain_pages`
--
ALTER TABLE `domain_pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_domain_pages_url` (`url`(255)),
  ADD KEY `idx_domain_pages_job_id` (`job_id`),
  ADD KEY `domain_pages_domain_fk` (`domain_id`);

--
-- Indexes for table `domain_podcast_episodes`
--
ALTER TABLE `domain_podcast_episodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_podcast_feeds`
--
ALTER TABLE `domain_podcast_feeds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_domain_feed` (`domain_id`,`feed_url`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_ranked_keywords`
--
ALTER TABLE `domain_ranked_keywords`
  ADD PRIMARY KEY (`ranked_keyword_id`),
  ADD KEY `idx_ranked_keywords_domain` (`domain_id`),
  ADD KEY `idx_ranked_keywords_keyword` (`keyword`);

--
-- Indexes for table `domain_robots`
--
ALTER TABLE `domain_robots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain` (`domain`),
  ADD KEY `idx_domain_robots_domain` (`domain`);

--
-- Indexes for table `domain_rss_feeds`
--
ALTER TABLE `domain_rss_feeds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_domain_rss` (`domain_id`,`feed_url`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `domain_schema_markup`
--
ALTER TABLE `domain_schema_markup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`),
  ADD KEY `page_id` (`page_id`),
  ADD KEY `idx_schema_type` (`schema_type`),
  ADD KEY `idx_markup_format` (`markup_format`);

--
-- Indexes for table `domain_seo_competitors`
--
ALTER TABLE `domain_seo_competitors`
  ADD PRIMARY KEY (`competitor_id`),
  ADD KEY `idx_competitors_domain` (`domain_id`);

--
-- Indexes for table `domain_seo_competitors_cache`
--
ALTER TABLE `domain_seo_competitors_cache`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_domain_cache` (`domain`);

--
-- Indexes for table `domain_seo_competitor_domains`
--
ALTER TABLE `domain_seo_competitor_domains`
  ADD PRIMARY KEY (`competitor_domain_id`),
  ADD KEY `idx_competitor_id` (`competitor_id`),
  ADD KEY `idx_competitor_domain` (`domain_name`);

--
-- Indexes for table `domain_seo_competitor_metrics`
--
ALTER TABLE `domain_seo_competitor_metrics`
  ADD PRIMARY KEY (`metric_id`),
  ADD KEY `idx_competitor_domain_id` (`competitor_domain_id`),
  ADD KEY `idx_metric_type` (`metric_type`);

--
-- Indexes for table `domain_seo_keywords_cache`
--
ALTER TABLE `domain_seo_keywords_cache`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_domain_cache` (`domain`);

--
-- Indexes for table `domain_site_structure`
--
ALTER TABLE `domain_site_structure`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_site_structure_domain_fk` (`domain_id`);

--
-- Indexes for table `domain_social_podcast`
--
ALTER TABLE `domain_social_podcast`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_social_podcast_domain_fk` (`domain_id`);

--
-- Indexes for table `domain_website_metadata`
--
ALTER TABLE `domain_website_metadata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_domain_website_metadata_page` (`page_id`),
  ADD KEY `idx_domain_website_metadata_domain` (`domain_id`);

--
-- Indexes for table `domain_youtube_captions`
--
ALTER TABLE `domain_youtube_captions`
  ADD PRIMARY KEY (`caption_id`),
  ADD KEY `idx_youtube_captions_domain_id` (`domain_id`),
  ADD KEY `idx_youtube_captions_video_id` (`video_id`);

--
-- Indexes for table `domain_youtube_channels`
--
ALTER TABLE `domain_youtube_channels`
  ADD PRIMARY KEY (`domain_id`,`channel_id`),
  ADD UNIQUE KEY `idx_youtube_channels_channel_id` (`channel_id`);

--
-- Indexes for table `domain_youtube_comments`
--
ALTER TABLE `domain_youtube_comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `idx_youtube_comments_domain_id` (`domain_id`),
  ADD KEY `idx_youtube_comments_video_id` (`video_id`),
  ADD KEY `idx_youtube_comments_parent_id` (`parent_comment_id`);

--
-- Indexes for table `domain_youtube_playlists`
--
ALTER TABLE `domain_youtube_playlists`
  ADD PRIMARY KEY (`playlist_id`),
  ADD KEY `idx_youtube_playlists_domain_id` (`domain_id`),
  ADD KEY `idx_youtube_playlists_channel_id` (`channel_id`);

--
-- Indexes for table `domain_youtube_videos`
--
ALTER TABLE `domain_youtube_videos`
  ADD PRIMARY KEY (`video_id`),
  ADD KEY `idx_youtube_videos_domain_id` (`domain_id`),
  ADD KEY `idx_youtube_videos_channel_id` (`channel_id`),
  ADD KEY `idx_youtube_videos_published_at` (`published_at`),
  ADD KEY `idx_youtube_videos_view_count` (`view_count`);

--
-- Indexes for table `domain_youtube_video_topics`
--
ALTER TABLE `domain_youtube_video_topics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_youtube_video_topics_video_topic` (`video_id`,`topic_category`(191)),
  ADD KEY `idx_youtube_video_topics_domain_id` (`domain_id`),
  ADD KEY `idx_youtube_video_topics_video_id` (`video_id`);

--
-- Indexes for table `features`
--
ALTER TABLE `features`
  ADD PRIMARY KEY (`reference`),
  ADD KEY `version_id` (`version_id`);

--
-- Indexes for table `feature_admin_comments`
--
ALTER TABLE `feature_admin_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feature_reference` (`feature_reference`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `feature_admin_notes`
--
ALTER TABLE `feature_admin_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feature_reference` (`feature_reference`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `feature_conflicts`
--
ALTER TABLE `feature_conflicts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feature_reference` (`feature_reference`),
  ADD KEY `conflicting_feature_reference` (`conflicting_feature_reference`);

--
-- Indexes for table `feature_dependencies`
--
ALTER TABLE `feature_dependencies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feature_reference` (`feature_reference`),
  ADD KEY `required_feature_reference` (`required_feature_reference`);

--
-- Indexes for table `feature_fair_prices`
--
ALTER TABLE `feature_fair_prices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_feature` (`feature_reference`,`organization_id`,`user_id`),
  ADD KEY `feature_fair_prices_ibfk_2` (`organization_id`),
  ADD KEY `feature_fair_prices_ibfk_3` (`user_id`);

--
-- Indexes for table `feature_versions`
--
ALTER TABLE `feature_versions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `feature_visibility_rules`
--
ALTER TABLE `feature_visibility_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_feature_ref` (`feature_reference`),
  ADD KEY `idx_feature_rules` (`feature_reference`,`rule_type`);

--
-- Indexes for table `feed_classification_diagnostics`
--
ALTER TABLE `feed_classification_diagnostics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_domain_id` (`domain_id`),
  ADD KEY `idx_feed_url` (`feed_url`(255));

--
-- Indexes for table `imprints`
--
ALTER TABLE `imprints`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_name_publisher` (`name`,`publisher_id`),
  ADD KEY `publisher_id` (`publisher_id`);

--
-- Indexes for table `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login_token` (`login_token`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `isbndb_api_requests`
--
ALTER TABLE `isbndb_api_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`isbn`,`request_time`);

--
-- Indexes for table `login_tokens`
--
ALTER TABLE `login_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_token` (`user_id`,`token`),
  ADD UNIQUE KEY `unique_token` (`token`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feature_version_id` (`feature_version_id`);

--
-- Indexes for table `organization_app_settings`
--
ALTER TABLE `organization_app_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_organization` (`organization_id`);

--
-- Indexes for table `organization_members`
--
ALTER TABLE `organization_members`
  ADD PRIMARY KEY (`organization_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `organization_questionnaire_responses`
--
ALTER TABLE `organization_questionnaire_responses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_org_question` (`organization_id`,`question_id`);

--
-- Indexes for table `organization_settings`
--
ALTER TABLE `organization_settings`
  ADD PRIMARY KEY (`organization_id`);

--
-- Indexes for table `performance_thresholds`
--
ALTER TABLE `performance_thresholds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_metric` (`metric_name`);

--
-- Indexes for table `platform_clients`
--
ALTER TABLE `platform_clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `project_participants`
--
ALTER TABLE `project_participants`
  ADD PRIMARY KEY (`project_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `publishers`
--
ALTER TABLE `publishers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_name_org` (`name`,`organization_id`);

--
-- Indexes for table `questionnaire_comments`
--
ALTER TABLE `questionnaire_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questionnaire_comment_reactions`
--
ALTER TABLE `questionnaire_comment_reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_reaction` (`comment_id`,`user_id`,`emoji`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `questionnaire_completions`
--
ALTER TABLE `questionnaire_completions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_org` (`organization_id`);

--
-- Indexes for table `questionnaire_reactions`
--
ALTER TABLE `questionnaire_reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_reaction` (`question_id`,`response_id`,`user_id`,`emoji`);

--
-- Indexes for table `quick_questionnaire_responses`
--
ALTER TABLE `quick_questionnaire_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_generated_at` (`generated_at`),
  ADD KEY `idx_org_date` (`organization_id`,`generated_at` DESC),
  ADD KEY `idx_report_settings` ((cast(json_extract(`settings_json`,_utf8mb4'$.paperSize') as char(10) charset utf8mb4)));

--
-- Indexes for table `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_response` (`feature_reference`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_responses_organization` (`organization_id`),
  ADD KEY `idx_response_system_dep` (`is_system_dependency`),
  ADD KEY `system_dependency_source` (`system_dependency_source`);

--
-- Indexes for table `scheduled_jobs`
--
ALTER TABLE `scheduled_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scraped_pages`
--
ALTER TABLE `scraped_pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `scrape_jobs`
--
ALTER TABLE `scrape_jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_scrape_jobs_domain` (`domain`),
  ADD KEY `idx_scrape_jobs_status` (`status`);

--
-- Indexes for table `section_visibility_rules`
--
ALTER TABLE `section_visibility_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_section` (`section_name`),
  ADD KEY `idx_section_rules` (`section_name`,`rule_type`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `idx_session_data` (`data`(100));

--
-- Indexes for table `system_alerts`
--
ALTER TABLE `system_alerts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_metrics`
--
ALTER TABLE `system_metrics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_metric_timestamp` (`metric_name`,`timestamp`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`team_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_user_enabled` (`enabled`);

--
-- Indexes for table `user_questionnaire_responses`
--
ALTER TABLE `user_questionnaire_responses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_question` (`organization_id`,`user_id`,`question_id`),
  ADD KEY `fk_user_question` (`question_id`),
  ADD KEY `fk_user_org` (`organization_id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `video_search_cache`
--
ALTER TABLE `video_search_cache`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `search_term` (`search_term`);

--
-- Indexes for table `website_metadata`
--
ALTER TABLE `website_metadata`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain_id` (`domain_id`);

--
-- Indexes for table `website_social_links`
--
ALTER TABLE `website_social_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `youtube_extraction_jobs`
--
ALTER TABLE `youtube_extraction_jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_youtube_extraction_jobs_domain_id` (`domain_id`),
  ADD KEY `idx_youtube_extraction_jobs_status` (`status`),
  ADD KEY `idx_youtube_extraction_jobs_created_at` (`created_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_app_color_schemes`
--
ALTER TABLE `ai_app_color_schemes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ai_app_features`
--
ALTER TABLE `ai_app_features`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ai_app_suggestions`
--
ALTER TABLE `ai_app_suggestions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ai_content_categories`
--
ALTER TABLE `ai_content_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ai_marketing_tips`
--
ALTER TABLE `ai_marketing_tips`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app_analytics`
--
ALTER TABLE `app_analytics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app_demo_state`
--
ALTER TABLE `app_demo_state`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_authors`
--
ALTER TABLE `book_authors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_author_mapping`
--
ALTER TABLE `book_author_mapping`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_other_isbns`
--
ALTER TABLE `book_other_isbns`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_prices`
--
ALTER TABLE `book_prices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_reviews`
--
ALTER TABLE `book_reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_search_cache`
--
ALTER TABLE `book_search_cache`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_subjects`
--
ALTER TABLE `book_subjects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_subject_mapping`
--
ALTER TABLE `book_subject_mapping`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brandfetch_colors`
--
ALTER TABLE `brandfetch_colors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brandfetch_company_info`
--
ALTER TABLE `brandfetch_company_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brandfetch_data`
--
ALTER TABLE `brandfetch_data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brandfetch_links`
--
ALTER TABLE `brandfetch_links`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brandfetch_logos`
--
ALTER TABLE `brandfetch_logos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brandfetch_metadata`
--
ALTER TABLE `brandfetch_metadata`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cached_books`
--
ALTER TABLE `cached_books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `charity_analysis`
--
ALTER TABLE `charity_analysis`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `common_domains_exclude`
--
ALTER TABLE `common_domains_exclude`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crawl_tracking`
--
ALTER TABLE `crawl_tracking`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_ai_data`
--
ALTER TABLE `domain_ai_data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_analysis`
--
ALTER TABLE `domain_analysis`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_apps`
--
ALTER TABLE `domain_apps`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_app_ideas`
--
ALTER TABLE `domain_app_ideas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_app_suggestions`
--
ALTER TABLE `domain_app_suggestions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_blog_content`
--
ALTER TABLE `domain_blog_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_blog_info`
--
ALTER TABLE `domain_blog_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_brand_analysis`
--
ALTER TABLE `domain_brand_analysis`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_calendar_sources`
--
ALTER TABLE `domain_calendar_sources`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_colors`
--
ALTER TABLE `domain_colors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_color_schemes`
--
ALTER TABLE `domain_color_schemes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_content_categories`
--
ALTER TABLE `domain_content_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_crawl_progress`
--
ALTER TABLE `domain_crawl_progress`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_downloads`
--
ALTER TABLE `domain_downloads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_events`
--
ALTER TABLE `domain_events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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

--
-- AUTO_INCREMENT for table `domain_features`
--
ALTER TABLE `domain_features`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_feeds_found`
--
ALTER TABLE `domain_feeds_found`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_images`
--
ALTER TABLE `domain_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_info`
--
ALTER TABLE `domain_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_isbn_data`
--
ALTER TABLE `domain_isbn_data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_isbn_images`
--
ALTER TABLE `domain_isbn_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_jobs`
--
ALTER TABLE `domain_jobs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_marketing_tips`
--
ALTER TABLE `domain_marketing_tips`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_media_content`
--
ALTER TABLE `domain_media_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_opengraph`
--
ALTER TABLE `domain_opengraph`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_pages`
--
ALTER TABLE `domain_pages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_podcast_episodes`
--
ALTER TABLE `domain_podcast_episodes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_podcast_feeds`
--
ALTER TABLE `domain_podcast_feeds`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_ranked_keywords`
--
ALTER TABLE `domain_ranked_keywords`
  MODIFY `ranked_keyword_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_robots`
--
ALTER TABLE `domain_robots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_rss_feeds`
--
ALTER TABLE `domain_rss_feeds`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_schema_markup`
--
ALTER TABLE `domain_schema_markup`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_seo_competitors`
--
ALTER TABLE `domain_seo_competitors`
  MODIFY `competitor_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_seo_competitors_cache`
--
ALTER TABLE `domain_seo_competitors_cache`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_seo_competitor_domains`
--
ALTER TABLE `domain_seo_competitor_domains`
  MODIFY `competitor_domain_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_seo_competitor_metrics`
--
ALTER TABLE `domain_seo_competitor_metrics`
  MODIFY `metric_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_seo_keywords_cache`
--
ALTER TABLE `domain_seo_keywords_cache`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_site_structure`
--
ALTER TABLE `domain_site_structure`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_social_podcast`
--
ALTER TABLE `domain_social_podcast`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_website_metadata`
--
ALTER TABLE `domain_website_metadata`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_youtube_video_topics`
--
ALTER TABLE `domain_youtube_video_topics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'Auto-increment primary key.';

--
-- AUTO_INCREMENT for table `feed_classification_diagnostics`
--
ALTER TABLE `feed_classification_diagnostics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `imprints`
--
ALTER TABLE `imprints`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `isbndb_api_requests`
--
ALTER TABLE `isbndb_api_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organization_app_settings`
--
ALTER TABLE `organization_app_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `performance_thresholds`
--
ALTER TABLE `performance_thresholds`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `publishers`
--
ALTER TABLE `publishers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scraped_pages`
--
ALTER TABLE `scraped_pages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_alerts`
--
ALTER TABLE `system_alerts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_metrics`
--
ALTER TABLE `system_metrics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `video_search_cache`
--
ALTER TABLE `video_search_cache`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `website_metadata`
--
ALTER TABLE `website_metadata`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `website_social_links`
--
ALTER TABLE `website_social_links`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `youtube_extraction_jobs`
--
ALTER TABLE `youtube_extraction_jobs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'Auto-increment primary key for the job.';

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_app_color_schemes`
--
ALTER TABLE `ai_app_color_schemes`
  ADD CONSTRAINT `ai_app_color_schemes_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ai_app_features`
--
ALTER TABLE `ai_app_features`
  ADD CONSTRAINT `ai_app_features_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ai_app_suggestions`
--
ALTER TABLE `ai_app_suggestions`
  ADD CONSTRAINT `ai_app_suggestions_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ai_content_categories`
--
ALTER TABLE `ai_content_categories`
  ADD CONSTRAINT `ai_content_categories_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ai_marketing_tips`
--
ALTER TABLE `ai_marketing_tips`
  ADD CONSTRAINT `ai_marketing_tips_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_demos`
--
ALTER TABLE `app_demos`
  ADD CONSTRAINT `app_demos_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `book_author_mapping`
--
ALTER TABLE `book_author_mapping`
  ADD CONSTRAINT `book_author_mapping_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_author_mapping_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `book_authors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `book_other_isbns`
--
ALTER TABLE `book_other_isbns`
  ADD CONSTRAINT `book_other_isbns_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `book_prices`
--
ALTER TABLE `book_prices`
  ADD CONSTRAINT `book_prices_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `book_reviews`
--
ALTER TABLE `book_reviews`
  ADD CONSTRAINT `book_reviews_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `book_subject_mapping`
--
ALTER TABLE `book_subject_mapping`
  ADD CONSTRAINT `book_subject_mapping_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_subject_mapping_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `book_subjects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `brandfetch_colors`
--
ALTER TABLE `brandfetch_colors`
  ADD CONSTRAINT `brandfetch_colors_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `brandfetch_company_info`
--
ALTER TABLE `brandfetch_company_info`
  ADD CONSTRAINT `brandfetch_company_info_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `brandfetch_links`
--
ALTER TABLE `brandfetch_links`
  ADD CONSTRAINT `brandfetch_links_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `brandfetch_logos`
--
ALTER TABLE `brandfetch_logos`
  ADD CONSTRAINT `brandfetch_logos_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `brandfetch_metadata`
--
ALTER TABLE `brandfetch_metadata`
  ADD CONSTRAINT `brandfetch_metadata_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comments_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`);

--
-- Constraints for table `comment_reactions`
--
ALTER TABLE `comment_reactions`
  ADD CONSTRAINT `comment_reactions_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `core_question_responses`
--
ALTER TABLE `core_question_responses`
  ADD CONSTRAINT `fk_core_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_core_question` FOREIGN KEY (`question_id`) REFERENCES `core_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `crawl_tracking`
--
ALTER TABLE `crawl_tracking`
  ADD CONSTRAINT `crawl_tracking_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_analysis`
--
ALTER TABLE `domain_analysis`
  ADD CONSTRAINT `domain_analysis_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_apps`
--
ALTER TABLE `domain_apps`
  ADD CONSTRAINT `domain_apps_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_app_ideas`
--
ALTER TABLE `domain_app_ideas`
  ADD CONSTRAINT `domain_app_ideas_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_app_suggestions`
--
ALTER TABLE `domain_app_suggestions`
  ADD CONSTRAINT `domain_app_suggestions_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_blog_content`
--
ALTER TABLE `domain_blog_content`
  ADD CONSTRAINT `domain_blog_content_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_blog_info`
--
ALTER TABLE `domain_blog_info`
  ADD CONSTRAINT `domain_blog_info_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_brand_analysis`
--
ALTER TABLE `domain_brand_analysis`
  ADD CONSTRAINT `domain_brand_analysis_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_calendar_sources`
--
ALTER TABLE `domain_calendar_sources`
  ADD CONSTRAINT `domain_calendar_sources_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_colors`
--
ALTER TABLE `domain_colors`
  ADD CONSTRAINT `domain_colors_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_color_schemes`
--
ALTER TABLE `domain_color_schemes`
  ADD CONSTRAINT `domain_color_schemes_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_content_categories`
--
ALTER TABLE `domain_content_categories`
  ADD CONSTRAINT `domain_content_categories_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_downloads`
--
ALTER TABLE `domain_downloads`
  ADD CONSTRAINT `fk_domain_downloads_domain_info` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_events`
--
ALTER TABLE `domain_events`
  ADD CONSTRAINT `domain_events_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_features`
--
ALTER TABLE `domain_features`
  ADD CONSTRAINT `domain_features_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_feeds_found`
--
ALTER TABLE `domain_feeds_found`
  ADD CONSTRAINT `fk_domain_feeds_domain` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `domain_images`
--
ALTER TABLE `domain_images`
  ADD CONSTRAINT `domain_images_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_isbn_data`
--
ALTER TABLE `domain_isbn_data`
  ADD CONSTRAINT `domain_isbn_data_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_isbn_images`
--
ALTER TABLE `domain_isbn_images`
  ADD CONSTRAINT `domain_isbn_images_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_jobs`
--
ALTER TABLE `domain_jobs`
  ADD CONSTRAINT `fk_domain_jobs_domain_info` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_marketing_tips`
--
ALTER TABLE `domain_marketing_tips`
  ADD CONSTRAINT `domain_marketing_tips_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_media_content`
--
ALTER TABLE `domain_media_content`
  ADD CONSTRAINT `fk_domain_media_content_domain` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_opengraph`
--
ALTER TABLE `domain_opengraph`
  ADD CONSTRAINT `domain_opengraph_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_pages`
--
ALTER TABLE `domain_pages`
  ADD CONSTRAINT `domain_pages_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `domain_pages_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `scrape_jobs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_ranked_keywords`
--
ALTER TABLE `domain_ranked_keywords`
  ADD CONSTRAINT `fk_ranked_dom` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_schema_markup`
--
ALTER TABLE `domain_schema_markup`
  ADD CONSTRAINT `fk_schema_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_schema_page_id` FOREIGN KEY (`page_id`) REFERENCES `domain_pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_seo_competitors`
--
ALTER TABLE `domain_seo_competitors`
  ADD CONSTRAINT `fk_competitors_dom` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_seo_competitor_domains`
--
ALTER TABLE `domain_seo_competitor_domains`
  ADD CONSTRAINT `fk_competitor_id` FOREIGN KEY (`competitor_id`) REFERENCES `domain_seo_competitors` (`competitor_id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_seo_competitor_metrics`
--
ALTER TABLE `domain_seo_competitor_metrics`
  ADD CONSTRAINT `fk_competitor_domain_id` FOREIGN KEY (`competitor_domain_id`) REFERENCES `domain_seo_competitor_domains` (`competitor_domain_id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_site_structure`
--
ALTER TABLE `domain_site_structure`
  ADD CONSTRAINT `domain_site_structure_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_social_podcast`
--
ALTER TABLE `domain_social_podcast`
  ADD CONSTRAINT `domain_social_podcast_domain_fk` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_website_metadata`
--
ALTER TABLE `domain_website_metadata`
  ADD CONSTRAINT `domain_website_metadata_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `domain_website_metadata_ibfk_2` FOREIGN KEY (`page_id`) REFERENCES `scraped_pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `features`
--
ALTER TABLE `features`
  ADD CONSTRAINT `features_ibfk_1` FOREIGN KEY (`version_id`) REFERENCES `feature_versions` (`id`);

--
-- Constraints for table `feature_admin_comments`
--
ALTER TABLE `feature_admin_comments`
  ADD CONSTRAINT `feature_admin_comments_ibfk_1` FOREIGN KEY (`feature_reference`) REFERENCES `features` (`reference`),
  ADD CONSTRAINT `feature_admin_comments_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`),
  ADD CONSTRAINT `feature_admin_comments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `feature_admin_notes`
--
ALTER TABLE `feature_admin_notes`
  ADD CONSTRAINT `feature_admin_notes_ibfk_1` FOREIGN KEY (`feature_reference`) REFERENCES `features` (`reference`),
  ADD CONSTRAINT `feature_admin_notes_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`),
  ADD CONSTRAINT `feature_admin_notes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `feature_conflicts`
--
ALTER TABLE `feature_conflicts`
  ADD CONSTRAINT `feature_conflicts_ibfk_1` FOREIGN KEY (`feature_reference`) REFERENCES `features` (`reference`),
  ADD CONSTRAINT `feature_conflicts_ibfk_2` FOREIGN KEY (`conflicting_feature_reference`) REFERENCES `features` (`reference`);

--
-- Constraints for table `feature_dependencies`
--
ALTER TABLE `feature_dependencies`
  ADD CONSTRAINT `feature_dependencies_ibfk_1` FOREIGN KEY (`feature_reference`) REFERENCES `features` (`reference`),
  ADD CONSTRAINT `feature_dependencies_ibfk_2` FOREIGN KEY (`required_feature_reference`) REFERENCES `features` (`reference`);

--
-- Constraints for table `feature_fair_prices`
--
ALTER TABLE `feature_fair_prices`
  ADD CONSTRAINT `feature_fair_prices_ibfk_1` FOREIGN KEY (`feature_reference`) REFERENCES `features` (`reference`),
  ADD CONSTRAINT `feature_fair_prices_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`),
  ADD CONSTRAINT `feature_fair_prices_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `feature_versions`
--
ALTER TABLE `feature_versions`
  ADD CONSTRAINT `feature_versions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `feature_visibility_rules`
--
ALTER TABLE `feature_visibility_rules`
  ADD CONSTRAINT `fk_feature_visibility` FOREIGN KEY (`feature_reference`) REFERENCES `features` (`reference`) ON DELETE CASCADE;

--
-- Constraints for table `feed_classification_diagnostics`
--
ALTER TABLE `feed_classification_diagnostics`
  ADD CONSTRAINT `fk_feed_diagnostics_domain` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `imprints`
--
ALTER TABLE `imprints`
  ADD CONSTRAINT `imprints_ibfk_1` FOREIGN KEY (`publisher_id`) REFERENCES `publishers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invitations`
--
ALTER TABLE `invitations`
  ADD CONSTRAINT `invitations_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invitations_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `login_tokens`
--
ALTER TABLE `login_tokens`
  ADD CONSTRAINT `fk_login_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`feature_version_id`) REFERENCES `feature_versions` (`id`);

--
-- Constraints for table `organization_members`
--
ALTER TABLE `organization_members`
  ADD CONSTRAINT `organization_members_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `organization_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organization_settings`
--
ALTER TABLE `organization_settings`
  ADD CONSTRAINT `organization_settings_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `platform_clients` (`id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`);

--
-- Constraints for table `project_participants`
--
ALTER TABLE `project_participants`
  ADD CONSTRAINT `project_participants_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `questionnaire_comment_reactions`
--
ALTER TABLE `questionnaire_comment_reactions`
  ADD CONSTRAINT `questionnaire_comment_reactions_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `questionnaire_comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `questionnaire_comment_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `questionnaire_completions`
--
ALTER TABLE `questionnaire_completions`
  ADD CONSTRAINT `questionnaire_completions_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quick_questionnaire_responses`
--
ALTER TABLE `quick_questionnaire_responses`
  ADD CONSTRAINT `quick_questionnaire_responses_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`),
  ADD CONSTRAINT `quick_questionnaire_responses_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `fk_reports_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reports_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `responses`
--
ALTER TABLE `responses`
  ADD CONSTRAINT `fk_responses_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`),
  ADD CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `responses_ibfk_2` FOREIGN KEY (`system_dependency_source`) REFERENCES `features` (`reference`) ON DELETE CASCADE;

--
-- Constraints for table `scraped_pages`
--
ALTER TABLE `scraped_pages`
  ADD CONSTRAINT `scraped_pages_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `website_metadata`
--
ALTER TABLE `website_metadata`
  ADD CONSTRAINT `website_metadata_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `website_social_links`
--
ALTER TABLE `website_social_links`
  ADD CONSTRAINT `website_social_links_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain_info` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
