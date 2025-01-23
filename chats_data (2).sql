-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 23, 2025 at 01:36 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chats_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `created_at`) VALUES
(1, 1, 1, '2024-12-24 12:28:43'),
(2, 1, 2, '2024-12-24 12:29:10'),
(3, 6, 2, '2024-12-24 12:29:10'),
(4, 2, 6, '2024-12-24 12:29:10'),
(6, 1, 3, '2024-12-24 12:29:10');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `message` mediumtext DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `message_assagin`
--

CREATE TABLE `message_assagin` (
  `id` int(11) NOT NULL,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(255) NOT NULL,
  `encripted_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `unique_id`, `encripted_id`, `created_at`) VALUES
(1, '101', NULL, '2024-12-24 12:21:03'),
(2, '102', NULL, '2024-12-24 12:21:07'),
(3, '103', NULL, '2024-12-24 12:21:09'),
(4, '104', NULL, '2024-12-24 12:21:12'),
(5, '105', NULL, '2024-12-24 12:21:17'),
(7, '519092472416', '', '2025-01-04 14:24:02');

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `id` int(11) NOT NULL,
  `unique_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `number` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `birthdate` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`id`, `unique_id`, `name`, `password`, `number`, `email`, `address`, `birthdate`, `status`, `created_at`) VALUES
(1, 101, 'Me', '123456', NULL, 'rishi@gmail.com', NULL, NULL, 1, '2025-01-05 10:57:34'),
(2, 102, 'Rudhra', '123456', NULL, '123@gmail.com', NULL, NULL, 1, '2025-01-05 11:07:16'),
(3, 103, 'Rahul', '123456', NULL, 'foronlylapyy@gmail.com', NULL, NULL, 1, '2025-01-05 11:05:11'),
(4, 104, 'Ravi', '123456', NULL, '', NULL, NULL, 1, '2025-01-05 07:15:06'),
(5, 105, 'Sagar', '123456', NULL, '', NULL, NULL, 1, '2025-01-05 07:15:06'),
(6, 519092472416, 'Rishi', '123456', '', 'foronly@gmail.com', '', '0000-00-00 00:00:00', 1, '2025-01-05 11:05:15'),
(7, 287377317456, 'Rishis', '123456', '', 'rudhrasoni2003@gmail.com', '', '0000-00-00 00:00:00', 1, '2025-01-05 11:04:58'),
(8, 576240134518, 'Rishi2', '123456', '', 'test@gmail.com', '', '0000-00-00 00:00:00', 1, '2025-01-05 11:05:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message_assagin`
--
ALTER TABLE `message_assagin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_assagin`
--
ALTER TABLE `message_assagin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_data`
--
ALTER TABLE `user_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
