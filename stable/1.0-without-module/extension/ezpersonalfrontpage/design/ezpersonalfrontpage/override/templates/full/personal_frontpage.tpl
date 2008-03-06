{set-block scope=root variable=cache_ttl}0{/set-block}
<div class="class-personal-frontpage">
<div class="overflow-fix">

{def $prefs = ezpreference( concat( "personalfrontpage_widgetlist_", $node.node_id ) ) }
{if $prefs|not}
    {set $prefs = $node.object.data_map.default_arrangement.value}
{/if}

{def $current_user = fetch( 'user', 'current_user' )}

{def $user_template    = ezini( "WidgetTemplateSettings",   "UseUserTemplate",               "personalfrontpage.ini" )}
{def $show_attributes  = ezini( "WidgetTemplateSettings",   "ShowAttributeFromContentClass", "personalfrontpage.ini" )}
{def $show_as_list     = ezini( "WidgetSettings",           "ShowAsList",                    "personalfrontpage.ini" )}
{def $disabled_widgets = ezini( "WidgetSettings",           "DisabledContentClasses",        "personalfrontpage.ini" )}
{def $box_overflow     = ezini( "WidgetSettings",           "BoxCSSOverflow",                "personalfrontpage.ini" )}
{def $widget_desc_attr = ezini( "WidgetOverview",           "WidgetDescriptionAttribute",    "personalfrontpage.ini" )}
{def $debug            = ezini( "PersonalFrontpage",        "JSDebug",                       "personalfrontpage.ini" )}
{def $container_name   = ezini( "PersonalFrontpage",        "ContainerName",                 "personalfrontpage.ini" )}

{if $container_name|not}{set $container_name = "DragContainer"}{/if}

{if $debug|eq( "enabled" )}
  {def $debug_enabled = "true"}
{else}
  {def $debug_enabled = "false"}
{/if}

{def $object         = false()}
{def $id             = false()}
{def $class          = false()}
{def $view_found     = false()}
{def $num_of_columns = $node.object.data_map.num_of_columns.value}
{def $minimization   = $node.object.data_map.allow_minimization.value}
{def $list_name      = $node.object.data_map.title.value}

{cache-block keys=array( $node.node_id, $current_user.contentobject_id )}

{**** IE conditional comments; for bug fixes for different IE versions *****}
<!--[if lt IE 7]>
<style type="text/css">
    @import url(/extension/ezpersonalfrontpage/design/ezpersonalfrontpage/stylesheets/browsers/ie6.css);
</style>
<![endif]-->
<!--[if IE 7]>
<style type="text/css">
    @import url(/extension/ezpersonalfrontpage/design/ezpersonalfrontpage/stylesheets/browsers/ie7.css);
</style>
<![endif]-->
{**** /IE conditional comments *****}

<div id="selectColumnPopup" style="display:none">
    <div class="border-left">
    <div class="border-right">
    <div class="border-content">
        <span>{"Insert into column:"|i18n('design/ezpersonalfrontpage/full')}</span>
        <a class="close-button" href="javascript:closeAddWidgetMenu();"></a>
        <ul class="sub-menu-list">
            {for 1 to $num_of_columns as $column_counter}
            <li>
                <a href="javascript:addWidget({$column_counter})"
                   id="add-widget-button-{$column_counter}">#{$column_counter}</a>
            </li>
            {/for}
        </ul>
    </div>
    </div>
    </div>
</div>

<div class="available-widgets border-box" id="available-widgets-list" style="display:none">

    {** BOX **}
    <div class="border-tl"><div class="border-tr"><div class="border-tc"></div></div></div>
    <div class="border-ml">
    {** /BOX **}

    <div class="content">
    <h2>{"Add widget:"|i18n('design/ezpersonalfrontpage/full')}</h2>
    <a class="close-button" href="javascript:closeAvailableWidgets();"></a>
    <br style="clear:both" />

    <ul>
    {foreach $node.object.data_map.widget_list.content.relation_list as $relation}
        {set $object = fetch( 'content', 'object', hash( 'object_id', $relation.contentobject_id ) )}
        {set $class  = $relation.contentclass_identifier}

        {if or( $disabled_widgets|contains( $class ), $object.main_node.is_hidden )}
            {continue}
        {/if}

        <li>
        <div class="widget-item">
            <a href="javascript:toggleAddWidgetMenu({$object.id})">{$object.name|wash()}</a>
            {if eq( $debug_enabled, "true" )}
                <div class="widget-class">{$class|wash()}</div>
            {/if}
            <div class="widget-description">
                {foreach $object.contentobject_attributes as $attribute}
                    {if $widget_desc_attr|contains( $attribute.contentclass_attribute_identifier)}
                        {attribute_view_gui attribute=$attribute}
                        {break}
                    {/if}
                {/foreach}
            </div>
        </div>
        </li>
    {/foreach}
    </ul>

    </div>
    {** BOX **}
    </div>
    <div class="border-bl"><div class="border-br"><div class="border-bc"></div></div></div>
    {** /BOX **}
</div>

<a href="javascript:showAvailableWidgets()" id="addNewWidgetButton">{"Add new widget"|i18n('design/ezpersonalfrontpage/full')}</a>

<div id="TempContainer" style="display:none">
{foreach $node.object.data_map.widget_list.content.relation_list as $relation}
    {set $object = fetch( 'content', 'object', hash( 'object_id', $relation.contentobject_id ) )}
    {set $id     = $relation.contentclass_identifier}

    {if or( $disabled_widgets|contains( $id ), $object.main_node.is_hidden )}
        {continue}
    {/if}

    <div id="box_{$object.id}" class="widget-box" ezdragdrop:boxId="{$object.id}">

        <div class="widget-dragbar-handler" name="dragbar" id="dragbar_{$object.id}"></div>

        <div class="widget-dragbar">
            <div class="title">{$object.name|wash()}</div>
            <div class="widget-menu">
                {if $minimization}
                    <a href="#" class="maxmin-button" onclick="javascript:toggleWidget({$object.id})" id="maxmin_{$object.id}"></a>
                {/if}
                <a href="#" class="close-button" onclick="javascript:closeWidget({$object.id})"></a>
            </div>
        </div>
        <div class="widget-content" id="content_box_{$object.id}"
            {if eq( $box_overflow, 'true' ) } style="overflow:auto;" {/if} >

            {set $view_found = false()}

            {**** show as list ****}
            {if $show_as_list|contains( $id )}
                {content_view_gui view="list" content_object=$object}
                {set $view_found = true()}
            {/if}

            {**** user template ****}
            {if eq( $view_found, false() )}
                {foreach $user_template as $template}
                    {set $template = $template|explode( ';' )}
                    {if eq( $template.0, $id)}
                        {if $template.1}
                           {content_view_gui view=$template.1 content_object=$object}
                        {else}
                           {content_view_gui view=$id content_object=$object}
                        {/if}
                        {set $view_found = true()}
                        {break}
                    {/if}
                {/foreach}
            {/if}

            {**** show attribute ****}
            {if eq( $view_found, false() )}
                {foreach $show_attributes as $searched_attribute}
                    {set $searched_attribute = $searched_attribute|explode( ';' )}
                    {foreach $object.contentobject_attributes as $attribute}
                        {if $searched_attribute|contains( $attribute.contentclass_attribute_identifier)}
                            <div class="attribute">
                                {attribute_view_gui attribute=$attribute}
                            </div>
                            {set $view_found = true()}
                            {break}
                        {/if}
                    {/foreach}
                    {if eq( $view_found, true() )}
                        {break}
                    {/if}
                {/foreach}
            {/if}

            {**** default template ****}
            {if eq( $view_found, false() )}
                {content_view_gui view="default" content_object=$object}
            {/if}

            {if $debug_enabled|eq( "true" )}
                <hr />
                <span>[typ={$id}][id={$object.id}]</span>
            {/if}
        </div>
    </div>
{/foreach}
</div>

{for 1 to $num_of_columns as $column_counter}
    <div class="DragContainer" id="DragContainer{$column_counter}"></div>
{/for}

<br style="clear:both" />

{if $debug_enabled|eq( "true" )}
<fieldset>
    <legend>{"Debug"|i18n('design/ezpersonalfrontpage/full')}</legend>
    <div class="history" id="History"></div>
</fieldset> 
{/if}

<div id="DragHelper" style="position:absolute; display:none;"></div>

{/cache-block}

{cache-block keys=array( $node.node_id, $prefs, $current_user.contentobject_id )}

<script type="text/javascript">
var gPrefs               = '{$prefs}';
var gNumOfColumns        = {$num_of_columns};
var gContainerName       = '{$container_name}';
var gPreferencesHostUrl  = '{"/user/preferences/set/"|ezurl(no,"full")}';
var gHostUrl             = '{"/"|ezurl(no, "full")}';
var gUserID              = '{$current_user.contentobject_id}';
var gPreferenceParameter = 'personalfrontpage_widgetlist_{$node.node_id}';
var gActivateExtension   = true;
var gDebugEnabled        = {$debug_enabled};
</script>

<noscript>
<div id="warning-nojs">
{"You have to enable JavaScript in your web browser."|i18n('design/ezpersonalfrontpage/full')}
</div>
</noscript>

{/cache-block}
</div>
</div>
