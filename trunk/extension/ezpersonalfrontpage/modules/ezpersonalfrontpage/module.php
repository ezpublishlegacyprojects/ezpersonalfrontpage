<?php
//
// Created on: <17-Aug-2004 12:57:54 bf>
//
// SOFTWARE NAME: eZ publish
// SOFTWARE RELEASE: 3.9.2
// BUILD VERSION: 18839
// COPYRIGHT NOTICE: Copyright (C) 1999-2006 eZ systems AS
// SOFTWARE LICENSE: GNU General Public License v2.0
// NOTICE: >
//   This program is free software; you can redistribute it and/or
//   modify it under the terms of version 2.0  of the GNU General
//   Public License as published by the Free Software Foundation.
//
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//
//   You should have received a copy of version 2.0 of the GNU General
//   Public License along with this program; if not, write to the Free
//   Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
//   MA 02110-1301, USA.
//
//

$Module = array( 'name' => 'PersonalFrontpage',
                 'variable_params' => true );

$ViewList = array();

/* Weather.com Widget */
$ViewList['weather'] = array(
    'script' => 'weather.php',
    'unordered_params' => array( 'user'  => 'userID',
                                 'where' => 'where',
                                 'local' => 'localID' ) );

/* Example Widget */
$ViewList['example'] = array(
    'script' => 'example.php',
    'unordered_params' => array( 'user'   => 'userID',
                                 'param1' => 'param1' ) );

?>
