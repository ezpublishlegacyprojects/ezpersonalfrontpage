//
// eZ Personal Frontpage
// Javascript required by Wheater Module
//
// Created on: <11.07.2007 14:31:01 tw>
//
// Copyright (C) 1999-2007 eZ systems as. All rights reserved.
//


function wheaterWidgetSearchLocal()
{
    var local = $( "wheater_widget_local" ).value;
    
    if( local === "" || local === undefined )
	{
        return;
    }
	
    var targetDiv = $( "wheater_widget_search_result" );
    var url = gHostUrl + "/ezpersonalfrontpage/wheater/(where)/" + local;
    
    sendAJAXRequest( url, wheaterWidgetSearchLocalResponseHandler, targetDiv );

    targetDiv.innerHTML = "Searching...";
}


function wheaterWidgetSearchLocalResponseHandler( result, target )
{
    debug( "ajax result: " + result );
    debug( "TARGET: " + target.id );
    
    target.innerHTML = result;
}  

function wheaterWidgetSelectLocal()
{
    var resultDiv = $( "wheater_widget_search_result" );
    var form = $( "WheaterModuleSelectLocal" );
    var selectedId = null;
    var selectedValue = null;
    
    for( var i = 0; i < form.length; i++ )
    {
        var temp = form.elements[i].type;
        
        if( ( temp == "radio" ) && ( form.elements[i].checked ) )
        {
            selectedId    = form.elements[i].id;
            selectedValue = form.elements[i].value;
            break;
        }
    }
    
    resultDiv.innerHTML = selectedValue;
    
    var widget = $( "wheater-widget" ).parentNode;
    var id     = widget.getAttribute( 'ezpersonalfrontpage:module_id' );   

    LoadModule( id, "(local)/" + selectedId );
}

function toggleWheaterSettings( inside )
{
    toggleById( 'wheater_widget_settings' );
    
    if( !inside )
    {
        hide( $( 'wheater-widget-outside-button' ) );
    }
    else
    {
        show( $( 'wheater-widget-outside-button' ) );    
    }
}
