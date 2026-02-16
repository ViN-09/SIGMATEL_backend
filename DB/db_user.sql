-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 30, 2026 at 10:56 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_user`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `auth` int DEFAULT NULL,
  `password` varchar(190) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `auth`, `password`) VALUES
('22074311002', NULL, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('22074311004', NULL, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('7220004350', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND220743109', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311001', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311005', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311006', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311007', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311012', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311014', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND2207431102', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074312026', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074312053', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND220743124', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22084311043', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22084311045', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22084311046', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24014311047', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24014311048', 1, '$2y$12$p7VPxckaOE4SIlkljnuM6OycELf7cbcU7.WM.VUlYcPSXm0fL1HC.'),
('MND24014312055', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24024311049', 0, '$2y$12$OKI.UOhdKrd79BRtDZBzCuwt0woWHnjiMLakHPPGiqTwMVwSYDcda'),
('MND24074311051', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074311060', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312015', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312019', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312021', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312033', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312040', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312046', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312050', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312058', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25054312059', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25054312060', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25094311054', 1, '$2y$12$qDV./0fQ0JmrVSCh6FxFu.Py2pnVo0RnDjgpwMChhgT.qVD0/Mr2G'),
('MND25094312061', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25094312062', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25104311055', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('TEMP-PANIKI', 0, '$2y$12$QGuOiyEXVQVOgEbfMEbfdubCFbVwYxLcGDe7P/X5/iwOd13e5uVIW');

-- --------------------------------------------------------

--
-- Table structure for table `user_bio`
--

CREATE TABLE `user_bio` (
  `id` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Nama` varchar(900) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `site` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tl` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Alamat` varchar(900) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `noTELP` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gambar` varchar(900) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `idx` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_bio`
--

INSERT INTO `user_bio` (`id`, `Nama`, `jabatan`, `site`, `tl`, `Alamat`, `noTELP`, `email`, `gambar`, `idx`) VALUES
('22074311002', 'Fikri bualo', 'HK', 'TTC Teling', '1984-10-15', 'Sea', '82189223084', 'ttc1telingmanado@gmail.com', '0', NULL),
('22074311004', 'Laurin Maria Kalalo', 'HK', 'TTC Teling', '1997-06-04', 'Paniki Bawah', '85236366886', 'laurinkalalo28@gmail.com', 'C55CE736-D975-40CF-94F0-4D93E58BB351 - Laurin Kalalo.jpeg', NULL),
('7220004350', 'Alfian Arifin', 'ME', 'TTC Teling', '2000-08-28', 'Perum paniki', '82187663782', 'fianarifin20@gmail.com', 'WhatsApp Image 2024-10-12 at 19.55.35.jpeg', NULL),
('MND220743109', 'Yusri Radjaku', 'Security', 'TTC Teling', '1976-09-14', 'Banjer lingkungan 3', '82297528803', 'yusrimaldini02@gmail.com', '0', NULL),
('MND22074311001', 'Djefli', 'BM', 'TTC Teling', '1976-07-12', 'Jl.14.Februari 06 Teling Bawah', '8124419276', 'djefli76@gmail.com', '0', NULL),
('MND22074311005', 'Diyan', 'ME', 'TTC Teling', NULL, 'Permataklabat 2 paniki atas,minahasa utara', '81335993665', 'iyanz.dm3@gmail.com', '1609914588666 - Diyan Wahyu.jpg', NULL),
('MND22074311006', 'Dwi Rizky Irawan', 'ME', 'TTC Teling', '1993-05-25', 'Bumi beringin', '85298610099', 'dwirizkyirawan@gmail.com', '0', NULL),
('MND22074311007', 'Beni Riusdian Kusiandana', 'ME', 'TTC Teling', '1984-10-14', 'Jl. Tololiu Supit, Lingkungan 2, Kelurahan Tingkulu Kec. Wanea, Manado, Sulawesi Utara', '81359335975', 'rusdianbeni84@gmail.com', '0', NULL),
('MND22074311012', 'Kadriansah yusuf', 'Security', 'TTC Teling', '27/06/1985', 'Banjer lingkungan 1.kec tikala kota Manado Sulawesi Utara', '82292009922', 'kadriansah.jusuf@gmail.com', 'IMG_20250206_125155 - Ryant Joesuf.jpg', NULL),
('MND22074311014', 'Leonard Adi Saputra Mangensihi', 'Security', 'TTC Teling', '1992-05-22', 'Malalayang satu timur lingkungan dua', '82346160655', 'mangensihileonard@gmail.com', '0', NULL),
('MND2207431102', 'Patricio Alinski Rantung', 'Security', 'TTC Teling', '26/09/2001', 'Mahakeret Timur lingkungan 2', '81914248445', 'cioorantung@gmail.com', '1763114958219. - Cioo Rantung.jpg', NULL),
('MND22074312026', 'Safrudin Mahmud', 'Security', 'TTC Teling', '18/10/1969', 'Lawangirung Lingk 3 no 79 RT 009 RW 04 wenang, 2207Manado Sulit', '85179611869', 'safrudinmahmud189@gmail.com', '1762829981517325708635139195892 - Rudi M.jpg', NULL),
('MND22074312053', 'Dea Viorella Esterlita Lenzun', 'Security', 'TTC Teling', '2002-11-11', 'Desa Batu Jaga I Kecamatan Likupang Selatan', '82296367944', 'viorelladea11@gmail.com', 'IMG-20241216-WA0017 - dea viorella.jpg', NULL),
('MND220743124', 'Lukman djamil', 'Security', 'TTC Teling', '1972-06-30', 'Jl Brawijaya Rt 04 Mongkonai Kotamobagu Barat..', '85397688700', 'lukman.djamil1@gmail.com', '0', NULL),
('MND22084311043', 'Carla Paulina Umpenawany', 'ME', 'TTC Teling', '1987-01-21', 'Kelurahan Tingkulu link 4.kec wanea.Manado', '82249451122', 'carla.umpenawany21@gmail.com', 'IMG_9538 - Carla Umpenawany.JPG', NULL),
('MND22084311045', 'Rivo Rurut', 'ME', 'TTC Teling', '1988-01-24', 'Tampusu', '82187733313', 'amoremorte69@gmail.com', '1764122972_WhatsApp Image 2025-11-26 at 10.06.26.jpeg', NULL),
('MND22084311046', 'Imam Safei', 'ME', 'TTC Teling', '1984-04-01', 'Paniki bawah', '81242618588', 'oktavianinur668@gmail.com', '1763652288_WhatsApp Image 2025-11-20 at 22.23.15.jpeg', NULL),
('MND24014311047', 'Brian Alfonso Mamuaja', 'ME', 'TTC Teling', '24/04/1992', 'Kalasey 1 kec.mandolang kab.minahasa', '85240308086', 'brianmamuaja9@gmail.com', 'IMG-20240828-WA0284 - Brian Mamuaja.jpg', NULL),
('MND24014311048', 'Muhamad Akbar Paputungan', 'ME', 'TTC Teling', '2024-09-28', 'Jl kanaan politeknik', '82395782947', 'akbarpaputungan5@gmail.com', 'IMG_9482 - TL 2 D3 Muhamad Akbar Paputungan.JPG', NULL),
('MND24014312055', 'Rayhan Aslah', 'ME', 'TTC Paniki', '31-12-2000', 'Malalayang 1 Link 11', '85398567193', 'rayhanaslah@gmail.com', 'ME-rayhan.png', NULL),
('MND24024311049', 'Vinci S. F. Tampubolon', 'User', 'TTC Teling', '2000-05-09', 'Tatelu, Jaga III, Kec. Dimembe', '85240534296', 'vincitampubolon090500@gmail.com', '1769659970_31568-removebg-preview.png', NULL),
('MND24074311051', 'Franco Gino Bawiling', 'ME', 'TTC Teling', '2000-11-17', 'Kombos timur lingkungan 5', '82258443822', 'francobawiling17@gmail.com', 'IMG-20241114-WA0003 - Franco Bawiling.jpg', NULL),
('MND24074311060', 'Hernike Papendang', 'ME', 'TTC Teling', '1986-07-30', 'Taas', '82129706267', 'Hernike.ddsm@gmail.com', '1768644707_WhatsApp Image 2026-01-17 at 18.11.10.jpeg', NULL),
('MND24074312015', 'Fredrith Bernad Heydemans', 'BM', 'TTC Paniki', '26-09-1979', 'Malalayang 1', '082348851526', 'diditheydemans@gmail.com', 'BM-pakdidit.png', NULL),
('MND24074312019', 'Hendry Kantohe', 'ME', 'TTC Paniki', '19-09-1985', 'Perum Citra Regency 1 Blok A 73', '81356019019', 'hendry.kantohe19@gmail.com', 'ME-hendry.png', NULL),
('MND24074312021', 'Jonny Lapian Alow', 'ME', 'TTC Paniki', '31-12-1987', 'Bengkol Lingk. V Kec. Mapanget Manado', '85256654324', 'Dhoni.alow31@gmail.com', 'ME-doni.png', NULL),
('MND24074312033', 'Yusni Mokodongan', 'ME', 'TTC Paniki', '25-02-1998', 'Tudu Aog Kec. Bilalang ', '82135932073', 'yusnimokodongan768@gmail.com', 'ME-yusni.png', NULL),
('MND24074312040', 'Riki Narua', 'ME', 'TTC Paniki', '09-07-1986', 'Perum GPI JL FLAMBOYAN D no 2', '85340179196', 'rikynarua@gmail.com', 'ME-riki.png', NULL),
('MND24074312046', 'Danu Mardani', 'ME', 'TTC Paniki', '18-02-1994', 'Kombos Timur Kec. Singkil Manado', '81355040194', 'danucisco94@gmail.com', 'ME-danu.png', NULL),
('MND24074312050', 'Yeltsin Swars Rori', 'ME', 'TTC Paniki', '19-11-1994', 'karombasan selatan lingkungan 2', '85399067723', 'yeltsin.rori@gmail.com', 'ME-yelsin.png', NULL),
('MND24074312058', 'Muhammad Atthariq Z. Safii', 'ME', 'TTC Paniki', '02-07-2002', 'Jl. Pumorouw No. 54 Lingkungan II', '81354871151', 'atariksafii@gmail.com', 'ME-atar.png', NULL),
('MND25054312059', 'Adjie Chandra Arbie', 'ME', 'TTC Paniki', '05-08-2002', 'Jaga V Kecamatan Kalawat', '82191786987', 'adjiearbie6@gmail.com', 'ME-adjie.png', NULL),
('MND25054312060', 'Muzayin Musri', 'ME', 'TTC Paniki', '19-12-1997', 'BTN. Bukit Gojeng Permai D 17 Kelurahan Biringere Kec. Sinjai Utara', '82112756254', 'muzayinmusri@gmail.com', 'ME-zayin.png', NULL),
('MND25094311054', 'Rizky Walangadi', 'ME', 'TTC Teling', '2004-01-01', 'Maasing Lingkungan 3', '82197231636', 'rizky.walangadi1@gmail.com', '1767804551_Screenshot 2026-01-08 004746.jpg', NULL),
('MND25094312061', 'Yoel Jonathan Saisab', 'ME', 'TTC Paniki', '05-07-2003', 'Karombasan Selatan Lingkungan IV', '81342173232', 'yoeljonathan07@gmail.com', 'ME-yoel.png', NULL),
('MND25094312062', 'Amanda Tessa Anang', 'ME', 'TTC Paniki', '06-11-2002', 'Pineleng 1 Jaga IV', '82188573624', 'amandaanang6@gmail.com', 'ME-amanda.png', NULL),
('MND25104311055', 'Andika Maulana Alamsyah', 'ME', 'TTC Teling', '1999-06-11', 'Borong Raya', '85159538665', 'andika.maulana001@gmail.com', '', NULL),
('TEMP-PANIKI', 'Rayhan', 'ME', 'TTC Teling', NULL, '', NULL, NULL, '', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_bio`
--
ALTER TABLE `user_bio`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
