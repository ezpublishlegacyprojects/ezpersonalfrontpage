//
// eZ Personal Frontpage
// General functionallity
//
// Created on: <25.05.2007 10:41:49 tw>
//
// Copyright (C) 1999-2007 eZ Systems as. All rights reserved.
//

// -----------------------------------------------------------------------------
function toggleWidget( id ) 
{
    if( toggle( $( "content_box_" + id ) ) )
    {
        $( "maxmin_" + id ).style.backgroundPosition = 'left bottom';
    }
    else
    {
        $( "maxmin_" + id ).style.backgroundPosition = 'left top';
    }
}

function closeWidget( id ) 
{
    debug( "Closing: " + id );

    var box    = $( "box_" + id );
    var widget = box.parentNode.removeChild( box );

    $( "TempContainer" ).appendChild( widget );

    updateBoxSettingsOnHost();
}

function toggleAddWidgetMenu( id )
{
    var selectColumnPopup = $( "selectColumnPopup" );

    show( selectColumnPopup );
    moveElementToMousePosWithOffset( selectColumnPopup, 10, -10 );
    selectColumnPopup.setAttribute( "SelectedWidget", id );
}

function addWidget( pos )
{
    var selectColumnPopup = $( "selectColumnPopup" );
    id = parseInt( selectColumnPopup.getAttribute( "SelectedWidget" ) ).NaN0();
    if( id !== 0 )
    {
        moveWidget( gContainerName, "box", id, pos - 1 );
        close( selectColumnPopup );
        selectColumnPopup.setAttribute( "SelectedWidget", 0 );
        updateBoxSettingsOnHost();        
    }
}

function closeAddWidgetMenu()
{
    toggleById( 'selectColumnPopup' );
}

function showAvailableWidgets()
{
    gDragingDisabled = true;

    moveElementToMousePosWithOffset( $( 'available-widgets-list' ), 10, 5 );

    /* Close selectColumnPopup if opened */
    if( !toggleById( 'available-widgets-list' ) )
    {
        gDragingDisabled = false;
        close( $( "selectColumnPopup" ) );
    }
}

function closeAvailableWidgets()
{
    gDragingDisabled = false;

    toggleById( 'available-widgets-list' );
    
    close( $( "selectColumnPopup" ) );
}


// -----------------------------------------------------------------------------
