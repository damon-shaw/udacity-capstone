-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb:3306
-- Generation Time: Aug 19, 2020 at 11:27 PM
-- Server version: 10.3.24-MariaDB
-- PHP Version: 7.3.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `plates`
--

-- --------------------------------------------------------

--
-- Table structure for table `plates`
--

USE plates;

CREATE TABLE `plates` (
  `id` varchar(8) NOT NULL COMMENT 'The content of the license plate.',
  `available` tinyint(1) NOT NULL COMMENT 'Whether or not this plate is available.',
  `lastChecked` datetime NOT NULL COMMENT 'The last time this plate was checked against the authority source.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for table `plates`
--
ALTER TABLE `plates`
  ADD PRIMARY KEY (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
