//
// eZ Personal Frontpage
// General functionallity
//
// Created on: <25.05.2007 10:41:49 tw>
//
// Copyright (C) 1999-2007 eZ systems as. All rights reserved.
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
    id = parseInt( selectColumnPopup.getAttribute( "SelectedWidget" ) );
    if( id !== 0 )
    {
        moveWidget( "DragContainer", "box", id, pos - 1 );
        close( selectColumnPopup );
        selectColumnPopup.setAttribute( "SelectedWidget", 0 );
        updateBoxSettingsOnHost();        
    }
}

function closeAddWidgetMenu()
{
    toggleById( 'selectColumnPopup' );
}

function showAvaibleWidgets()
{
    gDragingDisabled = true;

    moveElementToMousePosWithOffset( $( 'avaible-widgets-list' ), 10, 5 );
    
    /* Close selectColumnPopup if opened */
    if( !toggleById( 'avaible-widgets-list' ) )
    {
        gDragingDisabled = false;
        close( $( "selectColumnPopup" ) );
    }
}

function closeAvaibleWidgets()
{
    gDragingDisabled = false;

    toggleById( 'avaible-widgets-list' );
    
    close( $( "selectColumnPopup" ) );
}


// -----------------------------------------------------------------------------
