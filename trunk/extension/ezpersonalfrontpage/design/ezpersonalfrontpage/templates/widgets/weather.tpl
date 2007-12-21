{****** SEARCH RESULT ******}
{if $show_search_result|eq( true ) }

<form id="WeatherModuleSelectLocal">
    {foreach $search_result as $id => $content}
        <input type="radio"
               id="{$id}"
               name="WeatherModuleSelectLocal"
               value="{$content|wash()}"
               onClick="javascript:weatherWidgetSelectLocal();" />
               {$content|wash()}
        <br />
    {/foreach}
</form>   

{****** WIDGET TEMPLATE ******}
{else}

<div id="weather-widget">

    <div class="widget-settings" id="weather_widget_settings" style="display:none">
        <fieldset>
            <legend>{"City:"|i18n('design/ezpersonalfrontpage/weather')}</legend>
            <input type="text" id="weather_widget_local" />
            <input type="button" value="{"search"|i18n('design/ezpersonalfrontpage/weather')}"
                   onClick="javascript:weatherWidgetSearchLocal()" />
            <input type="button" value="{"cancel"|i18n('design/ezpersonalfrontpage/weather')}"
                   onClick="javascript:toggleWeatherSettings( true )" />
            <div id="weather_widget_search_result"></div>
        </fieldset>
    </div>

    <a  href="#"
        id="weather-widget-outside-button"
        class="widget-settings-button"
        onClick="javascript:toggleWeatherSettings( false );">
        {"settings"|i18n('design/ezpersonalfrontpage/weather')}
    </a>

    <div class="weather-widget-content" id="weather-widget-content" >
        {if $local_found|eq( "true" )}
            <h3>{$city|wash()}</h3>
            <img class="icon" src={concat( "weathersdk/32x32/", $icon, ".png" )|ezimage()}>
            <div class="temperature">{$temp|wash()}&deg; C</div>
            <div class="weather">{$weather|wash()}</div>
            
            <table>
                <tr>
                    <td>{"Local time"|i18n('design/ezpersonalfrontpage/weather')}</td>
                    <td>{$time|wash()}</td>
                </tr>
                <tr>
                    <td>{"UV"|i18n}</td>
                    <td>{$uv|wash()}</td>
                </tr>
                <tr>
                    <td>{"Air pressure"|i18n('design/ezpersonalfrontpage/weather')}</td>
                    <td>{$airpressure|wash()} {"bar"|i18n('design/ezpersonalfrontpage/weather')}</td>
                </tr>
                <tr>
                    <td>{"Wind"|i18n}</td>
                    <td>{$wind|wash()} {"km/h"|i18n('design/ezpersonalfrontpage/weather')}</td>
                </tr>                
            </table>
        {else}
            <h3>{"Please select your city!"|i18n('design/ezpersonalfrontpage/weather')}</h3>
        {/if}

        <div class="info">
            {"Weather data provided by"|i18n('design/ezpersonalfrontpage/weather')} 
            <a href="http://www.weather.com/?prod=xoap&par={$partnerKey|wash()}">
            weather.com </a> &copy;
        </div>
    </div>
<div>

{/if}
