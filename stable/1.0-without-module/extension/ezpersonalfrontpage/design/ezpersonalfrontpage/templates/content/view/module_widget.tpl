<div class="module-widget">
<div class="module-content"
     name="module-content"
     id="module_content_{$object.id}"
     ezpersonalfrontpage:url="{$object.data_map.module_url.value}"
     ezpersonalfrontpage:module_id="{$object.id}">

</div>

<script type="text/javascript">
addModuleWidget( {$object.id}, "{$object.data_map.module_url.value|wash}" );
</script>

</div>

<div id="loading_widget_{$object.id}" style="display:none">
    <img class="loading" src={"loading.gif"|ezimage()} alt="{"Loading ..."|i18n}" />
</div>
