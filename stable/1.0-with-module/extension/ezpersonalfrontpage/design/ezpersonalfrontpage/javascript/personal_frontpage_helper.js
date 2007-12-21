//
// eZ Personal Frontpage
// Helper functions
//
// Created on: <25.05.2007 10:41:19 tw>
//
// Copyright (C) 1999-2007 eZ systems as. All rights reserved.
//

//------ Basic helper functions ------------------------------------------------

function $( element )
{
    return document.getElementById( element );   
}


function toggle( object )
{
    if( object !== undefined )
    {
        if( object.style.display === 'none' )
        {
            object.style.display = 'block';
            return true;
        }
        else
        {
            object.style.display = 'none';
            return false;
        }
    }
}

function toggleById( str )
{
    var obj = $( str );
    
    if( obj !== undefined )
    {
        return toggle( obj );
    }
}


function show( object )
{
    if( object !== undefined )
    {
        object.style.display = 'block';
        object.style.visibility = 'visible';
    }
}

function hide( object )
{      
    if(object !== undefined)
    {  
        object.style.display = 'none';
    }
}

function close( object ) { return hide( object ); }

function makeInsivible( object )
{
    if( object !== undefined )
    { 
		object.style.display    = 'block';
		object.style.visibility = 'hidden';
    }    
}

function isHidden( object )
{
    if(object !== undefined)
    {  
        if( object.style.display == 'none' ) {
            return true;
		}
    }
    return false;
}


function isDragableObject( object )
{
    if( object === undefined ) {
        return false;
	}
        
    if( object.getAttribute( 'ezdragdrop:isDragableObject' ) ) {
        return true;
	}
        
    return false;
}

function isDropTarget( object )
{
    if( object === undefined ) {
        return false;
	}
        
    if( object.getAttribute( 'ezdragdrop:isDropTarget' ) ) {
        return true;
    }
	
    return false;
}


function isDragableObjectHandler( object )
{
    if( object === undefined ) {
        return false;
	}

    try
    {        
        if( object.getAttribute( 'ezdragdrop:isDragableObjectHandler' ) ) {
            return true;
		}
    }
    catch(e)
    {
        return false;
    }
        
    return false;
}


// ---------------- Module Management ------------------------------------------

function addModuleWidget( id, url )
{
    gModuleList[ id ] = url;
}

function LoadModule( i, UserParams )
{
    debug( "Loading module [" + i + "]" );
    
    if( gModuleList[i] === undefined )
	{
        return;
    }
	
    var moduleURL = gHostUrl + "/" + gModuleList[i] + "/(user)/" + gUserID;
    
    if( UserParams !== undefined )
	{
        moduleURL += "/" + UserParams;
    }
	   
    var targetDiv = $( "module_content_" + i );
    
    var loadingAnimationContainer = $( 'loading_widget_' + i );
	
	if( loadingAnimationContainer !== null )
	{
	    var clone = loadingAnimationContainer.cloneNode(true);

    	clone.style.display = 'block';
    
	    targetDiv.innerHTML = "";
    	targetDiv.appendChild( clone );
	}

    debug( "Target DIV:" + "module_content_" + i );
    debug( "Module: " + moduleURL );

    sendAJAXRequest( moduleURL, moduleWidgetResponseHandler, targetDiv );
}

function moduleWidgetResponseHandler( result, target )
{
    debug( "TARGET: " + target.id );
    
    target.innerHTML = result;
}  


// ---------------- serialization ----------------------------------------------

function updateBoxSettingsOnHost()
{
    var containerArray = [];
    
    for( var x = 1; x <= gNumOfColumns; x++ )
    {
        containerArray.push( $( 'DragContainer' + x ) );
    }
    
    var strJSON = serializeBoxes( containerArray );
	
	if( strJSON.length > 100 )
	{
		debug( "FATAL: Maximum number of boxes reached" );
		alert( "Maximum number of boxes reached!" );
		return;
    }
	
    if( gPreviousJSON !== strJSON)
    { 
        sendAJAXRequest( gPreferencesHostUrl + "/"
                         + gPreferenceParameter + "/" + strJSON );
        debug( "Sent: " + strJSON );
    }
    else
    {
        debug( "Nothing changed!  JSON: " + strJSON ); 
    }
        
    gPreviousJSON = strJSON;
}

function serializeBoxes( ContainerArray )
{
    var result = [];

	for( var j = 0; j < ContainerArray.length; j++ )
    {
        var container = ContainerArray[j];
		var columnResult = [];
        
        for( var i = 0; i < container.childNodes.length; i++ )
        {
			if( container.childNodes[i].nodeName !== "#text" )
			{
				columnResult[i] = container.childNodes[i].getAttribute( 'ezdragdrop:boxId' );
            }
        }
		
		result[j] = columnResult;
    }
	
	var jsonString = result.toJSONString();
	jsonString = jsonString.replace(/"/g, '');
	
    return jsonString;
}


// --------------- Move helper -------------------------------------------------

function moveWidget( containerName, boxName, id, pos )
{
    debug( "Moving " + id + " to " + pos );
    
    var container = $( containerName + ( pos + 1 ) );
    var box       = $( boxName + "_" + id );
    
    if( container && box )
    {
        debug( "... Widget moved!" );
        container.appendChild( $( boxName + "_" + id ) );
    }
}

function moveObjectToPosition( object, X, Y )
{
    if(object === undefined) {
		return;   
	}
	
	var ieOffset = getIEScrollOffset();
	
    object.style.left = ( X + ieOffset.x ) + 'px';
    object.style.top  = ( Y + ieOffset.y ) + 'px';
}

function moveElementToMousePosWithOffset( object, offsetX, offsetY )
{
    if(object !== undefined)
	{
		moveObjectToPosition( object, gMousePos.x + offsetX, gMousePos.y + offsetY );
	}
}

function moveElementToMousePos( object )
{
    moveElementToMousePosWithOffset( object, 0, 0 );
}


// --------------- Prototyping -------------------------------------------------

Number.prototype.NaN0 = function()
{
    return isNaN( this ) ? 0 : this;
};

// --------------- Mouse helper functions --------------------------------------


function mouseButtonClicked() 
{
    if( gIsMouseDown && !gPreviousMouseState ) {
        return true;
	}
    return false;
}

function mouseButtonReleased()
{
    if( !gIsMouseDown && gPreviousMouseState ) {
        return true;
	}
	
    return false;
}

function getObjectPosition( e )
{
	var left = 0;
	var top  = 0;
	
	while( e.offsetParent )
    {
		left += e.offsetLeft + ( e.currentStyle ? ( parseInt( e.currentStyle.borderLeftWidth ) ).NaN0() : 0);
		top  += e.offsetTop  + ( e.currentStyle ? ( parseInt( e.currentStyle.borderTopWidth  ) ).NaN0() : 0);
		
		e = e.offsetParent;
	}

    left += e.offsetLeft + ( e.currentStyle ? ( parseInt( e.currentStyle.borderLeftWidth ) ).NaN0() : 0);
	top  += e.offsetTop  + ( e.currentStyle ? ( parseInt( e.currentStyle.borderTopWidth  ) ).NaN0() : 0);

	return {
        x : left,
        y : top
    };
}

function getMouseScreenPosition( event )
{
    var X = 0;
    var Y = 0;
	if( event.pageX || event.pageY )
	{
	    /* Mozilla */
        return {
            x : event.pageX,
            y : event.pageY      
        };
    }
    else
    {
        /* Internet Explorer */
        return {
            x : event.clientX + document.body.scrollLeft - document.body.clientLeft,
            y : event.clientY + document.body.scrollTop  - document.body.clientTop
        };
    }
}

function getIEScrollOffset()
{
	var offsetScrollX = 0;
	var offsetScrollY = 0;	
	
	/* IE scroll offset */
    if (document.all && !document.captureEvents)
	{
		var doc = "body";
		
		if( typeof document.compatMode != "undefined" && 
            document.compatMode        != "BackCompat" ) {
		    doc = "documentElement";
		}
		
    	offsetScrollX    = document[doc].scrollLeft;
        offsetScrollY    = document[doc].scrollTop;
    }
	
	return {
		x : offsetScrollX,
		y : offsetScrollY
	};
}	

function getMouseOffset( target, event, mousePos )
{
	event = event || window.event;

	var docPos = getObjectPosition( target );
	var ieOffset = getIEScrollOffset();
	
	return {
        x : mousePos.x - docPos.x + ieOffset.x,	//??
        y : mousePos.y - docPos.y + ieOffset.y   //??
    };
}

// --------------- AJAX helper functions ---------------------------------------
function sendAJAXRequest( url, responseHandler, params )
{
    debug( "Sending AJAX Req. to " + url );
    var xmlHttp = null;
    
    /* Mozilla, IE 7 */
    if( typeof XMLHttpRequest != 'undefined' )
    {
        xmlHttp = new XMLHttpRequest();
    }
    if (!xmlHttp)
    {
        /* IE 6 */
        try {
            xmlHttp  = new ActiveXObject( "Msxml2.XMLHTTP" );
        } catch(e) {
            try {
                xmlHttp  = new ActiveXObject( "Microsoft.XMLHTTP" );
            } catch(e) {
                xmlHttp  = null;
            }
        }
    }
    
    if (xmlHttp)
    {
        xmlHttp.open( 'GET', url, true );
        xmlHttp.onreadystatechange = function()
            {
                if ( xmlHttp.readyState == 4 )
                {
                    if( responseHandler === undefined )
                    {
                        debug( "Data successfuly transfered!" );
                    }
                    else
                    {
                        responseHandler( xmlHttp.responseText, params );
                    }
                }
            };
        xmlHttp.send( null );
    }
}



// --------------- Debug helper functions --------------------------------------

function writeHistory( message, cssClass )
{
    if( gDebugEnabled && gHistoryDiv  )
    {
        var span = document.createElement( 'span' );
        span.setAttribute( 'class', cssClass );
        span.appendChild( document.createTextNode( message ) );
        
        gHistoryDiv.appendChild( span );
		gHistoryDiv.appendChild( document.createElement( 'br' ) );
		gHistoryDiv.scrollTop += 50;
    }
}

function debug( message )
{
	writeHistory( 'DEBUG: ' + message, 'msg-debug' );
}

function objectNotification( object, message )
{
	if( !object || !object.parentNode || !object.parentNode.getAttribute ) {
        return;
	}

    if( object.id )
    {
        writeHistory( object.id + ': ' + message, 'msg-notification' );
    }
    else
    {
        writeHistory( 'Unknown ID: ' + message, 'msg-notification-unknown-id' );
    }
}
