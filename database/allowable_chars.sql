--
-- Table structure for table `allowable_chars`
--

USE plates;

CREATE TABLE `allowable_chars` (
  `state` varchar(2) NOT NULL COMMENT 'The state that the allowed list applies to.',
  `charset` varchar(32) NOT NULL COMMENT 'The allowed character list, in Regex.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for table `allowable_chars`
--
ALTER TABLE `allowable_chars`
  ADD PRIMARY KEY (`state`);