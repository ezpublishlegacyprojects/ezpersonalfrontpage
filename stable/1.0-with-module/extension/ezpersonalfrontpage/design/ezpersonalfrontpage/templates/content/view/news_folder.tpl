<div class="news-folder">
    <div class="short-description">
        {attribute_view_gui attribute=$object.data_map.short_description}
    </div>
    <ul>
    {foreach $object.main_node.children as $child}
        <li>
            <h3>{$child.name|wash()}</h3>            
            <div class="intro">
                {attribute_view_gui attribute=$child.data_map.intro}
            </div>
            <a href={$child.url|ezurl()}>
                &raquo; {'read more'|i18n('design/ezpersonalfrontpage/news_folder')}
            </a>
            <br style="clear:both" />
        </li>
    {/foreach}
    </ul>
</div>
