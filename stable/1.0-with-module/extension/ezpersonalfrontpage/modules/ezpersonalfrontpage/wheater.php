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
include_once( "kernel/classes/ezpreferences.php" );
include_once( "lib/ezxml/classes/ezxml.php" );
include_once( "lib/ezutils/classes/ezini.php" );

$ini    = eZINI::instance( "personalfrontpage.ini" );
$http   =& eZHTTPTool::instance();
$tpl    =& templateInit();

$Local  =  $Params['localID'];
$Where  =  $Params['where'];

$PartnerKey = $ini->variable( "WheaterModule", "PartnerID" );
$LicenseKey = $ini->variable( "WheaterModule", "LicenseKey" );
$Unit       = $ini->variable( "WheaterModule", "Unit" );

/*!
    Gets content from an eZ DOM hierarchy by
    a '/' seperated path.
*/
function GetXMLNodeContent( $Path, $eZXMLRootNode )
{
    if( $eZXMLRootNode == null || $Path == "" ) 
        return;
        
    $PathArray = explode( '/', $Path );
    $Element = $eZXMLRootNode;
    
    foreach( $PathArray as $PathEntry )
    {
        if( $PathEntry != "" && $Element != null )
        {
            $Element = $Element->elementByName( $PathEntry );
        }
    }
    
    if( $Element != null )
        $Element = $Element->firstChild();
        
    if( $Element != null )
        return $Element->content;
}

/*!
    Reads XML data from an external URL and
    returns the root node as eZDOMNode.
*/
function GetXMLContentAsRootNode( $Url )
{
    $XMLData = file_get_contents( $Url );

    $xml = new eZXML();

    $Root =& $xml->domTree( $XMLData );
    
    if( $Root != null )
        return $Root->root();
        
    return null;
}


if( $Where != "" )
{
    $Url = "http://xoap.weather.com/search/search?where=" . rawurlencode( $Where );
    
    $RootNode = GetXMLContentAsRootNode( $Url );    
    
    $SearchResult = array();
    
    foreach( $RootNode->Children as $Child )
    {
        $id     = $Child->attributeValue( 'id' );
        $name   = $Child->firstChild();
        
        $SearchResult[ $id ] = $name->content;        
    }

    $tpl->setVariable( "search_result",         $SearchResult );
    $tpl->setVariable( "show_search_result",    "true" );
}
else
{
    if( $Local == "" )
    {   
        $Local = eZPreferences::value( "personalfrontpage_wheater_widget" );
    }
    else
    {
        eZPreferences::setValue( "personalfrontpage_wheater_widget", $Local );
    }
    
    if( $Local != "" || $Local === "0" )
    {
        $Url =  "http://xoap.weather.com/weather/local/$Local"
               ."?cc=*"
               ."&prod=xoap"
               ."&par=$PartnerKey"
               ."&key=$LicenseKey"
               ."&unit=$Unit";

        $RootNode = GetXMLContentAsRootNode( $Url );
        
        $tpl->setVariable( "city",          GetXMLNodeContent( "cc/obst",   $RootNode ) );
        $tpl->setVariable( "weather",       GetXMLNodeContent( "cc/t",      $RootNode ) );
        $tpl->setVariable( "airpressure",   GetXMLNodeContent( "cc/bar/r",  $RootNode ) );
        $tpl->setVariable( "time",          GetXMLNodeContent( "cc/lsup",   $RootNode ) );
        $tpl->setVariable( "temp",          GetXMLNodeContent( "cc/tmp",    $RootNode ) );
        $tpl->setVariable( "icon",          GetXMLNodeContent( "cc/icon",   $RootNode ) );
        $tpl->setVariable( "wind",          GetXMLNodeContent( "cc/wind/s", $RootNode ) );
        $tpl->setVariable( "uv",            GetXMLNodeContent( "cc/uv/i",   $RootNode )
                                       ." ".GetXMLNodeContent( "cc/uv/t",   $RootNode ) );
                                                                                                
        $tpl->setVariable( "local_found",           "true");
        $tpl->setVariable( "show_search_result",    "false");
    }
    else
    {
        $tpl->setVariable( "local_found", "false");
    }
    $tpl->setVariable( "partnerKey", $PartnerKey );    
}

/* Disables debut output */
$GLOBALS['eZDebugEnabled'] = false;

$Result = array();
$Result['pagelayout'] = false;
$Result['content'] =& $tpl->fetch( "design:widgets/wheater.tpl" );

?>
