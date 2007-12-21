{def $user_list_template = ezini( "WidgetTemplateSettings", "UseUserTemplateAsList", "personalfrontpage.ini" )}

<ul>
{foreach $user_list_template as $key => $template}
    {if $object.class_identifier|eq( $key )}
        {foreach $object.main_node.children as $child}
            {content_view_gui view=$template content_object=$child}
        {/foreach}
        {break}
    {else}
        {foreach $object.main_node.children as $child}
            <li><a href={$child.url|ezurl()}>{$child.name|wash()}</a></li>
        {/foreach}
    {/if}
{/foreach}
</ul>
