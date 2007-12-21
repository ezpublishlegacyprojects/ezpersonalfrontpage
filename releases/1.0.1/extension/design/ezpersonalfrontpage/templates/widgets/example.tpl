<div id="example_widget">

<div class="widget-settings" id="example_widget_settings" style="display:none">
    <fieldset>
        <legend>{"Settings:"|i18n}</legend>
        <input type="button" value="{"reload"|i18n}"
               onClick="javascript:LoadModule( $( 'example_widget' ).parentNode.getAttribute( 'ezpersonalfrontpage:module_id' ) )" />            
    </fieldset>
</div>

<a href="#" class="widget-settings-button"
   onClick="javascript:toggleById( 'example_widget_settings' );">
{"settings"|i18n}</a>

<h3>Hello from example module</h3>
<strong>Your user id is: {$user|wash()}</strong>

<p>
{$param1|wash()}
</p>

<p>
Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor
incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute
iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui
officia deserunt mollit anim id est laborum.
</p>

</div>

