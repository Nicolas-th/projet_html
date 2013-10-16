-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Mer 16 Octobre 2013 à 12:41
-- Version du serveur: 5.5.9
-- Version de PHP: 5.3.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Base de données: `like`
--

-- --------------------------------------------------------

--
-- Structure de la table `like`
--

CREATE TABLE `like` (
  `id_like` int(10) NOT NULL AUTO_INCREMENT,
  `id_user` int(10) NOT NULL,
  `id_lieu` int(10) NOT NULL,
  PRIMARY KEY (`id_like`),
  KEY `id_user` (`id_user`,`id_lieu`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `like`
--

INSERT INTO `like` VALUES(3, 23, 34);
INSERT INTO `like` VALUES(4, 35, 24);
INSERT INTO `like` VALUES(2, 45, 34);
INSERT INTO `like` VALUES(1, 63, 2);
