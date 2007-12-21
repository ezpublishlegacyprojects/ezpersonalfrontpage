{****** SEARCH RESULT ******}
{if $show_search_result|eq( true ) }

<form id="WheaterModuleSelectLocal">
    {foreach $search_result as $id => $content}
        <input type="radio"
               id="{$id}"
               name="WheaterModuleSelectLocal"
               value="{$content|wash()}"
               onClick="javascript:wheaterWidgetSelectLocal();" />
               {$content|wash()}
        <br />
    {/foreach}
</form>   

{****** WIDGET TEMPLATE ******}
{else}

<div id="wheater-widget">

    <div class="widget-settings" id="wheater_widget_settings" style="display:none">
        <fieldset>
            <legend>{"City:"|i18n('design/ezpersonalfrontpage/wheater')}</legend>
            <input type="text" id="wheater_widget_local" />
            <input type="button" value="{"search"|i18n('design/ezpersonalfrontpage/wheater')}"
                   onClick="javascript:wheaterWidgetSearchLocal()" />
            <input type="button" value="{"cancel"|i18n('design/ezpersonalfrontpage/wheater')}"
                   onClick="javascript:toggleWheaterSettings( true )" />
            <div id="wheater_widget_search_result"></div>
        </fieldset>
    </div>

    <a  href="#"
        id="wheater-widget-outside-button"
        class="widget-settings-button"
        onClick="javascript:toggleWheaterSettings( false );">
        {"settings"|i18n('design/ezpersonalfrontpage/wheater')}
    </a>

    <div class="wheater-widget-content" id="wheater-widget-content" >
        {if $local_found|eq( "true" )}
            <h3>{$city|wash()}</h3>
            <img class="icon" src={concat( "wheatersdk/32x32/", $icon, ".png" )|ezimage()}>
            <div class="temperature">{$temp|wash()}&deg; C</div>
            <div class="weather">{$weather|wash()}</div>
            
            <table>
                <tr>
                    <td>{"Local time"|i18n('design/ezpersonalfrontpage/wheater')}</td>
                    <td>{$time|wash()}</td>
                </tr>
                <tr>
                    <td>{"UV"|i18n}</td>
                    <td>{$uv|wash()}</td>
                </tr>
                <tr>
                    <td>{"Air pressure"|i18n('design/ezpersonalfrontpage/wheater')}</td>
                    <td>{$airpressure|wash()} {"bar"|i18n('design/ezpersonalfrontpage/wheater')}</td>
                </tr>
                <tr>
                    <td>{"Wind"|i18n}</td>
                    <td>{$wind|wash()} {"km/h"|i18n('design/ezpersonalfrontpage/wheater')}</td>
                </tr>                
            </table>
        {else}
            <h3>{"Please select your city!"|i18n('design/ezpersonalfrontpage/wheater')}</h3>
        {/if}

        <div class="info">
            {"Weather data provided by"|i18n('design/ezpersonalfrontpage/wheater')} 
            <a href="http://www.weather.com/?prod=xoap&par={$partnerKey|wash()}">
            weather.com </a> &copy;
        </div>
    </div>
<div>

{/if}
