<div>
    {node_view_gui content_node=$object view="standard"}
        	    
    <table class="cols">
    {foreach $object.contentobject_attributes as $attribute}
    <tr>
        <th>{$attribute.contentclass_attribute_name|wash()}</th>
        <td>{attribute_view_gui attribute=$attribute}</td>
    </tr>
    {/foreach}
    </table>
</div>
