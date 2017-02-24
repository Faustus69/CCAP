alert('Hello!');
var aupairs = document.getElementsByClassName("arrival");

for (var i=0; i < aupairs.length; i++)
{
	var newdiv = document.createElement("div");
	var newtext = document.createTextNode("Hello World");
	newdiv.appendChild(newtext);
	aupairs[i].appendChild(newdiv);
}
alert('Done!');

    function initBookmarklet() {
        showHeatmap()
    }

    function hideHeatmap() {
        $("#asdheatmapcontrols").remove();
        $(".asdheatmap").remove();
    }

    function toggleRange() {
        eventRange = $("input[name=range]:checked").val();
        renderHeatmap();
    }

    function toggleShowClickCount() {
        showClickCount = !showClickCount;
        renderHeatmap();
    }

    function toggleShowIDs() {
        showID = !showID;
        renderHeatmap();
    }    

    function showHeatmap() {
        renderHeatmapControls();
        $(".asdheatmap").remove()
        $.getJSON("https://serviceshubproduswlog.blob.core.windows.net/wedcssummary/latest.json", function( response ) {
            data = response;
            $("#heatmapheader").text("Heatmap settings");
            renderHeatmap();
        });
    }

    function renderHeatmapControls() {
        $("#asdheatmapcontrols").remove();
        $("body").append("<div id='asdheatmapcontrols' style='position:fixed; right: 10px; bottom: 10px; z-index: 20000; background-color: #eee; border: 1px solid #666; padding: 10px'></div>")
        $("#asdheatmapcontrols").append("<div id='heatmapheader' style='font-weight:800'>Loading heatmap...</div>")
        $("#asdheatmapcontrols").append("<div><input type='checkbox' checked onclick='toggleShowClickCount()'> Show click count</input></div>")
        $("#asdheatmapcontrols").append("<div><input type='checkbox' checked onclick='toggleShowIDs()'> Show IDs</input></div>")
        $("#asdheatmapcontrols").append("<div><b>Time range:</b></div>")
        $("#asdheatmapcontrols").append("<div><input type='radio' name='range' value='lastdayeventcount' onclick='toggleRange()'> Last day</input></div>")
        $("#asdheatmapcontrols").append("<div><input type='radio' name='range' value='lastweekcount' onclick='toggleRange()'> Last week</input></div>")
        $("#asdheatmapcontrols").append("<div><input type='radio' name='range' value='lastmonthcount' onclick='toggleRange()'> Last month</input></div>")
        $("#asdheatmapcontrols").append("<div><input type='radio' name='range' value='alleventscount' onclick='toggleRange()' checked> All events</input></div>")
        $("#asdheatmapcontrols").append("<div><button onclick='hideHeatmap()' style='margin-top:10px' class='btn btn-primary'>Hide heatmap</button></div>")
    }

    function renderHeatmap() {
        var elementSelector = "";
        var idsInPage = [];
        var maxEventCount = 0;
        var dataWithFilter = getIds(data);
        var idcount = dataWithFilter.length;

        for (var i=0; i<idcount;i++) {
            elementSelector += "#" + dataWithFilter[i].content_id.split(' ').join('').split('"').join('').split('{').join('').split('}').join('').split('$').join('') + (i < ((idcount-1))?",":"");
        }
        for (var i=0; i<$(elementSelector).length;i++) {
            var idInPage = $($(elementSelector)[i]).attr('id');
            if (idsInPage.indexOf(idInPage) < 0) {
                idsInPage.push(idInPage);
                var eventIDCount = getEventCount(dataWithFilter,idInPage);
                maxEventCount = (eventIDCount > maxEventCount)?eventIDCount:maxEventCount;
                $($(elementSelector)[i]).attr("eventcount",eventIDCount);
            }
        }
        $(".asdheatmap").remove()
        $("body").append("<div id='asdheatmap' style='z-index:2147483647; position:absolute; top:0px; left:0px'></div>");
        for (var i=0; i<idsInPage.length;i++) {
        	if (idsInPage[i].indexOf("asdheatmapcontrols") < 0) {
	            var elementPosition = $("#"+idsInPage[i]).offset();
	            var elementLeft = elementPosition.left;
	            var elementTop = elementPosition.top;
	            var elementWidth = $("#"+idsInPage[i]).outerWidth();
	            var elementHeight = $("#"+idsInPage[i]).outerHeight();
	            var eventCount = parseInt($("#"+idsInPage[i]).attr("eventcount"));
	            if (eventCount > 0) {
	                var opacity = (eventCount/maxEventCount)*0.5+0.25;
	                if ($("#"+idsInPage[i]).css("position") != "fixed") {
	                    $("#"+idsInPage[i]).css("position","relative");
	                }
	                var clicks = "<div style='background-color:rgba(255,255,255,.9); vertical-align: top; line-height: 10px; margin: 0px; color:black; position: absolute; height: 20px; top:-5px; left:-5px; border: 2px solid black; font-size: 0.8em; padding: 3px; font-weight: 400; border-radius: 6px; text-align:left'>" + eventCount + " clicks</div>"
	                var idname = "<div style='background-color:rgba(255,255,255,.9); vertical-align: top; line-height: 10px; margin: 0px; color:black; position: absolute; height: 20px; top:12px; left:-5px; border: 2px solid black; font-size: 0.8em; padding: 3px; font-weight: 400; border-radius: 6px; white-space: nowrap; overflow:hidden; text-align:left'>" + idsInPage[i] + "</div>"
	                $("#"+idsInPage[i]).prepend("<div class='asdheatmap' style='position:absolute; background-color: rgba(255,0,0,"+opacity+"); left: 0px; top: 0px; width: calc("+elementWidth+"px - 2px); height: calc("+elementHeight+"px - 2px);'>"+(showClickCount?clicks:"")+(showID?idname:"")+"</div>");
	            }
        	}
        }
    }

    function getEventCount(events, eventID) {
        for (var i=0; i<events.length; i++) {
            if (events[i].content_id === eventID) {
                return events[i][eventRange];
            }
        }
        return 0;
    }

    function getIds(events) {
        var eventList = [];
        for (var i=0; i<events.length; i++) {
            if (events[i][eventRange] > 0) {
                eventList.push(events[i]);
            }
        }
        return eventList;
    }




