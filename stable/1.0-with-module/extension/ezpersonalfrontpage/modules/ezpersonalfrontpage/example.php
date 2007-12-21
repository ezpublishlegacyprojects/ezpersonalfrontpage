<?php
//
// Created on: <10-Nov-2004 11:42:23 bf>
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

include_once( "kernel/common/template.php" );

$http   =& eZHTTPTool::instance();

$Module =& $Params['Module'];
$User   =  $Params['userID'];
$Param1 =  $Params['param1'];

$tpl =& templateInit();

$tpl->setVariable( "user",      $User );
$tpl->setVariable( "param1",    $Param1 );

/* Disables debut output */
$GLOBALS['eZDebugEnabled'] = false;

$Result = array();
$Result['pagelayout'] = false;
$Result['content']    =& $tpl->fetch( "design:widgets/example.tpl" );


?>
