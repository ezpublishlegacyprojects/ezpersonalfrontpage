//
// eZ Personal Frontpage
// Drag and Drop capability 
//
// Created on: <25.05.2007 10:40:04 tw>
//
// Copyright (C) 1999-2007 eZ Systems as. All rights reserved.
//


//---------- global variables --------------------------------------------------

var gIsMouseDown        = false;
var gPreviousMouseState = false;
var gMousePos           = null;

var gDropRegionOffsetTop    = 30;
var gDropRegionOffsetBottom = 70;

var gPreviousJSON    = "";
var	gHistoryDiv      = null;

var gCurrentTarget   = null;
var gActiveContainer = null;
var gLastTarget      = null;
var gDragHelper      = null;
var gRootParent      = null;
var gRootSibling     = null;
var gMouseOffset     = null; 
var gDropTargets     = [];
var gDragingDisabled = false;
var gModuleList 	 = [];

//----------  initialization ---------------------------------------------------

window.onload = function()
{
    if( typeof gActivateExtension == 'undefined' ) {
        return;
	}
    
    document.onmousemove = mouseMove;
    document.onmousedown = mouseDown;
    document.onmouseup   = mouseUp;

    gHistoryDiv = $( 'History' );
        
    debug( "Initialize..." );
            
    var userPrefs = []; 
        
    gPrefs = decodeURI( gPrefs );
    
    debug( "Preferences (clean): " + gPrefs );
    
    try
    {
        userPrefs = gPrefs.parseJSON();
    }
    catch(error)
    {
		debug( "Error parsing JSON");
        debug( error );
    }
    
    for( var c = 0; c < gNumOfColumns; c++ )
    {
        var container = userPrefs[c];
        
        if( container === undefined ) {
            continue;
		}
        
        for( var i = 0; i < container.length; i++)
        {
            moveWidget( "DragContainer", "box", container[i], c );
        }
    }
    
    gPreviousJSON = gPrefs;
    
    var containerArray = [];
    
    for( var x = 1; x <= gNumOfColumns; x++ )
    {
        containerArray.push( $( 'DragContainer' + x ) );
    }
    containerArray.push( $( 'TempContainer' ) );
        
	CreateDropContainer( containerArray );
	
	debug( "Initialization of module widgets!" );
	
    for( var moduleId in gModuleList )
    {
		if( !isNaN( moduleId ) )
		{
	      	LoadModule( moduleId );
		}
    }
    
    debug( "Initialization finished!\n\n" );
};


// -----------------------------------------------------------------------------

/*  
 * 
 */ 
function CreateDropContainer( containerElements )
{
    gDragHelper = $( 'DragHelper' );     
    
	for( var i=0; i < containerElements.length; i++ )
    {
		var container = containerElements[i];
		
		gDropTargets.push( container );
		
		container.setAttribute( 'ezdragdrop:isDropTarget', true );

		debug( "Created Container " + i + ": " + container.id );

		for( var j=0; j < container.childNodes.length; j++ )
        {
			/* skip #text nodes (Firefox) */
			if( container.childNodes[j].nodeName == '#text' )
			{
                continue;
			}
			
			container.childNodes[j].setAttribute( 'ezdragdrop:isDragableObject', true );
			
			var DragObjChildren = container.childNodes[j].getElementsByTagName( 'div' );
			
            for( var k = 0; k < DragObjChildren.length; k++ )
            {
                if( DragObjChildren[k].nodeName == '#text' )
				{
                    continue;
                }
				   
                if( DragObjChildren[k].className != 'widget-dragbar-handler' )
				{
                    continue;
                }
				
                DragObjChildren[k].setAttribute( 'ezdragdrop:isDragableObjectHandler', true );
            }
		}
	}
}

/*
 *
 */
function mouseUp(event)
{
	if( gCurrentTarget )
    {
		objectNotification( gCurrentTarget, 'Mouse Up Fired' );

        hide( gDragHelper );
		
		/* Move Target to previous Position */
		if( isHidden( gCurrentTarget ) )
        {
			if( gRootSibling )
			{
                gRootParent.insertBefore( gCurrentTarget, gRootSibling );
            }
			else
			{
                gRootParent.appendChild( gCurrentTarget );
            }
		}
           
        updateBoxSettingsOnHost();

        show( gCurrentTarget );
	}

	gCurrentTarget = null;
	gIsMouseDown = false;
}

/*
 *
 */
function mouseDown( event )
{
    if( gDragingDisabled )
	{
		return;
	}
    
	event      = event || window.event;
	var target = event.target || event.srcElement;

	gIsMouseDown = true;

	if( gLastTarget )
	{
		objectNotification( gLastTarget, 'Mouse Down' );
	}
	
	if( target.onmousedown || isDragableObject( target ) )
	{
		return false;
	}
    	
	return true;
}

/*
 *
 */ 
function mouseMove( event )
{
    event = event || window.event;
	
	var target  = event.target || event.srcElement;

	gMousePos = getMouseScreenPosition( event );
	
    /* mouse moved over a draggable obj  */
    if( isDragableObjectHandler( target ) )
    {	
        var parent = target.parentNode;

        /* if the user is just starting to drag the element */
        if( mouseButtonClicked() )
        {
            objectNotification( target, 'Start Dragging' );
        
            gCurrentTarget = parent;
            gRootParent    = gCurrentTarget.parentNode;
            gRootSibling   = gCurrentTarget.nextSibling;
        
            /* remember mouse x and y offset for the element */
            gMouseOffset = getMouseOffset( parent, event, gMousePos );

            prepareDragHelper();

            with( gCurrentTarget )
            {
                gCurrentTarget.setAttribute( 'ezdragdrop:startWidth',
                                             parseInt( gCurrentTarget.offsetWidth ) );
                                             
                gCurrentTarget.setAttribute( 'ezdragdrop:startHeight',
                                             parseInt( gCurrentTarget.offsetHeight ) );
                
                gCurrentTarget.style.display  = 'none';
            }
            
            cacheObjectPositions();
            
        }           
    }
        
    /* user is dragging */
    if( gCurrentTarget )
        draggingRoutine();
    
	gLastTarget = target;	
	gPreviousMouseState = gIsMouseDown;

	if( gCurrentTarget )
	{
        return false;
    }
}


/*
 *
 */
function draggingRoutine()
{
    /* move  helper div to mouse position (adjusted by gMouseOffset) */
    var x = gMousePos.x - gMouseOffset.x;
    var y = gMousePos.y - gMouseOffset.y;

	var ieOffset = getIEScrollOffset();

	var xPos = ieOffset.x + x + ( getCachedObjectPosition( gCurrentTarget, 'width' ) / 2 );
	var yPos = ieOffset.y + y;

	moveObjectToPosition( gDragHelper, x, y );
			
    gActiveContainer = getActiveContainer( xPos, yPos );

    /* target object is in a container */
    if( gActiveContainer )
    {
        if( gActiveContainer != gCurrentTarget.parentNode )
        {
            objectNotification( gCurrentTarget, 'Moved into ' + gActiveContainer.id );
        }

        moveObjectInDOM( xPos, yPos );

		setTimeout( setContainerSizesTimeout, 10 );
				
        /* make drag item visible */
		if( isHidden( gCurrentTarget ) )
        {
			objectNotification(gCurrentTarget, 'Made Visible');
			makeInsivible( gCurrentTarget );
		}
    }
    else /* not inside a container */
    {
        /* drag item is not in a container */
        if( !isHidden( gCurrentTarget ) )
        {
			objectNotification( gCurrentTarget, 'Hidden' );
			hide( gCurrentTarget );
        }
    }
}

/*
 *
 */
function setContainerSizesTimeout( )
{
    if( gActiveContainer == undefined )
        return;
        
    var containerPos = getObjectPosition( gActiveContainer );
				            
    with( gActiveContainer )
    {
        setAttribute( 'ezdragdrop:startWidth',  parseInt( offsetWidth ) );
        setAttribute( 'ezdragdrop:startHeight', parseInt( offsetHeight ) );
        setAttribute( 'ezdragdrop:startLeft',   containerPos.x );
        setAttribute( 'ezdragdrop:startTop',    containerPos.y );
    }
}

/*
 *
 */
function prepareDragHelper()
{
    for( var i=0; i < gDragHelper.childNodes.length; i++ )
    {
        gDragHelper.removeChild( gDragHelper.childNodes[i] );
    }

    gDragHelper.appendChild( gCurrentTarget.cloneNode(true) );
    
    show( gDragHelper );        
}

/*
 *
 */
function moveObjectInDOM( xPos, yPos )
{
    /* beforeNode will hold the first node AFTER where the div belongs */
    var beforeNode = null;

	for( var i = gActiveContainer.childNodes.length - 1; i >= 0; i-- )
    {
		if( gActiveContainer.childNodes[i].nodeName == '#text' )
            continue;

        var startBottom =  getCachedObjectPosition( gActiveContainer.childNodes[i], 'bottom' ); 
        var startRight  =  getCachedObjectPosition( gActiveContainer.childNodes[i], 'right' );

		/* if the current item is "After" the item being dragged */
		if( gCurrentTarget != gActiveContainer.childNodes[i] )
		{
	        if( ( startRight  > xPos ) && ( startBottom > yPos ) )
            {
                beforeNode = gActiveContainer.childNodes[i];
            }
        }
	}
    
	if( beforeNode )
    {
        /* the item being dragged belongs before another item */
		if( beforeNode != gCurrentTarget.nextSibling )
        {
			objectNotification( gCurrentTarget, 'Inserted Before ' + beforeNode.id );
			gActiveContainer.insertBefore( gCurrentTarget, beforeNode );
		}
	}
    else 
    {
        /* the item being dragged belongs at the end of the current container */
		if( ( gCurrentTarget.nextSibling ) || ( gCurrentTarget.parentNode != gActiveContainer ) )
        {
			objectNotification( gCurrentTarget, 'Inserted at end of ' + gActiveContainer.id );
			gActiveContainer.appendChild( gCurrentTarget );
		}
	}
}

/*
 *
 */
function getActiveContainer( xPos, yPos )
{
    var activeContainer = null;

	for( var i = 0; i < gDropTargets.length; i++ )
    {
        var startLeft   = getCachedObjectPosition( gDropTargets[i], 'left' ); 
        var startTop    = getCachedObjectPosition( gDropTargets[i], 'top' ); 
        var startRight  = getCachedObjectPosition( gDropTargets[i], 'right' ); 
        var startBottom = getCachedObjectPosition( gDropTargets[i], 'bottom' );
                        
        if( ( startLeft   < xPos ) &&
			( startTop    < yPos + gDropRegionOffsetTop ) &&
			( startRight  > xPos ) && 
			( startBottom > yPos - gDropRegionOffsetBottom ) )
        {

			activeContainer = gDropTargets[i];
            break;
		}
    }
    return activeContainer;
}


/*
 *
 */
function getCachedObjectPosition( object, name )
{
    if( object == undefined || name == '')
        return;
    
    with( object )
    {    
        switch( name )
        {
            case 'left':
                return parseInt( getAttribute( 'ezdragdrop:startLeft' ) );
            break;
        
            case 'top':
                return parseInt( getAttribute( 'ezdragdrop:startTop' ) );
            break;
        
            case 'right':
                return parseInt( getAttribute( 'ezdragdrop:startLeft' ) )
                     + parseInt( getAttribute( 'ezdragdrop:startWidth' ) );
            break;
       
            case 'bottom':
                return parseInt( getAttribute( 'ezdragdrop:startTop' ) )
                     + parseInt( getAttribute( 'ezdragdrop:startHeight' ) );            
            break;
        
            case 'width':
                return parseInt( getAttribute( 'ezdragdrop:startWidth' ) );            
            break;       
        
            case 'height':
                return parseInt( getAttribute( 'ezdragdrop:startHeight' ) );            
            break;
        
            default:
                objectNotification( this, name + " not found!" );
                return;         
            break;
        }
    } 
}


/*
 *
 */
function cacheObjectPositions()
{
    for( var i=0; i < gDropTargets.length; i++ )
    {
        with( gDropTargets[i] )
        {
            var Position = getObjectPosition( gDropTargets[i] );
                    
            setAttribute( 'ezdragdrop:startWidth',  parseInt( offsetWidth ) );
            setAttribute( 'ezdragdrop:startHeight', parseInt( offsetHeight ) );
            setAttribute( 'ezdragdrop:startLeft',   Position.x );
            setAttribute( 'ezdragdrop:startTop',    Position.y );
        }

        for( var j = 0; j < gDropTargets[i].childNodes.length; j++ )
        {
            with( gDropTargets[i].childNodes[j] )
            {
                if( nodeName == '#text' )
                    continue;
                                    
                if( gDropTargets[i].childNodes[j] == gCurrentTarget )
                    continue;

                var Position = getObjectPosition( gDropTargets[i].childNodes[j] );

				setAttribute( 'ezdragdrop:startWidth',  parseInt(offsetWidth) );
				setAttribute( 'ezdragdrop:startHeight', parseInt(offsetHeight) );
				setAttribute( 'ezdragdrop:startLeft',   Position.x );
				setAttribute( 'ezdragdrop:startTop',    Position.y );
            }
        }
    }
}
