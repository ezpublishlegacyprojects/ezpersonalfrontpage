//
// eZ Personal Frontpage
// Javascript required by Weather Module
//
// Created on: <11.07.2007 14:31:01 tw>
//
// Copyright (C) 1999-2007 eZ Systems as. All rights reserved.
//


function weatherWidgetSearchLocal()
{
    var local = $( "weather_widget_local" ).value;
    
    if( local === "" || local === undefined )
	{
        return;
    }
	
    var targetDiv = $( "weather_widget_search_result" );
    var url = gHostUrl + "/ezpersonalfrontpage/weather/(where)/" + local;
    
    sendAJAXRequest( url, weatherWidgetSearchLocalResponseHandler, targetDiv );

    targetDiv.innerHTML = "Searching...";
}


function weatherWidgetSearchLocalResponseHandler( result, target )
{
    debug( "ajax result: " + result );
    debug( "TARGET: " + target.id );
    
    target.innerHTML = result;
}  

function weatherWidgetSelectLocal()
{
    var resultDiv = $( "weather_widget_search_result" );
    var form = $( "WeatherModuleSelectLocal" );
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
    
    var widget = $( "weather-widget" ).parentNode;
    var id     = widget.getAttribute( 'ezpersonalfrontpage:module_id' );   

    LoadModule( id, "(local)/" + selectedId );
}

function toggleWeatherSettings( inside )
{
    toggleById( 'weather_widget_settings' );
    
    if( !inside )
    {
        hide( $( 'weather-widget-outside-button' ) );
    }
    else
    {
        show( $( 'weather-widget-outside-button' ) );    
    }
}
