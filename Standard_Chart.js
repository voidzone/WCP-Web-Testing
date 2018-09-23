jQuery(function($){
/*
This formats all the JSON data from shadow priest sims into charts.
*/

const default_background_color = "#343a40";
const default_font_color = "#f8f9fa";
const default_axis_color = "#828282";

const light_color = "#eeeeee";
const medium_color = "#999999";
const dark_color = "#343a40";
		
$(function () { 
    /*
<div class="tab">
<button class="tablinks" onclick="openCity(event, 'London')">London</button>
<button class="tablinks" onclick="openCity(event, 'Paris')">Paris</button>
<button class="tablinks" onclick="openCity(event, 'Tokyo')">Tokyo</button>
</div>

<!-- Tab content -->
<div id="London" class="tabcontent">
<h3>London</h3>
<p>London is the capital city of England.</p>
</div>

<div id="Paris" class="tabcontent">
<h3>Paris</h3>
<p>Paris is the capital of France.</p> 
</div>

<div id="Tokyo" class="tabcontent">
<h3>Tokyo</h3>
<p>Tokyo is the capital of Japan.</p>
</div>
    */

    //Create all the HTML for the elements for the charts.
    var chartDiv = document.createElement("div");
    chartDiv.setAttribute("id", "chart-div");
    chartDiv.setAttribute("class","tab");
    var DABtn = document.createElement("BUTTON");
    DABtn.setAttribute("id", "defaultOpen");
    var DAText = document.createTextNode("Dark Ascension");
    DABtn.appendChild(DAText);
    document.body.appendChild(chartDiv);
    chartDiv.appendChild(DABtn)

    //DA div's
    var DATrinket = document.createElement("div");
    DATrinket.setAttribute("id", "DA-Trinket-div");
    DATrinket.setAttribute("class", "tabcontent");



    document.getElementById("defaultOpen").click();

    
/*
    var btn = document.createElement("BUTTON");
    var t = document.createTextNode("CLICK ME");
    btn.appendChild(t);
    document.body.appendChild(btn);

*/
    var options = {
        chart: {
            renderTo: 'container',
            type: 'bar',
            backgroundColor: default_background_color
            },
        title: {
            style: {
                color: default_font_color,
                fontWeight: 'bold'
                },
            text: "Trinket Chart - Dark Ascension"
            },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    align: 'right',
                    enabled: false,
                    pointFormat: "Value: {point.y:,.0f} mm"
                },
                enableMouseTracking: true,
                pointWidth: 15,
                spacing: 20
            }
        },
        xAxis: {
            labels: {
                style: {
                    color: default_font_color,
                    fontWeight: 'bold',
                    fontSize: 14
                }
            }
        },
        yAxis: {
            labels: {
                style: {
                    color: default_font_color
                }
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: default_font_color,
                    fontSize: 14
                }
            },
            gridLineColor: '#616c77',
            title: {
                text: 'Damage Per Second',
                color: default_font_color
            }
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<span style="font-size: 14px"><b>{point.key}</b></span><br/>',
            pointFormat: '<span style=color: "{point.color}"><b>{series.name}</b></span>: <b>{point.y}</b><br/>',
            padding: 5,
            //shared: true
            
            /*
            formatter: function() {
                var s = '<div style="margin: -4px -6px -11px -7px; padding: 3px 3px 6px 3px; background-color:';
                s += dark_color;
                s += '"><div style=\"margin-left: 9px; margin-right: 9px; margin-bottom: 6px; font-weight: 700;\">' + this.x + '</div>'
                var cumulativeAmount = 0;
                for (var i = this.points.length -1; i >= 0; i--) {
                    cumulativeAmount += this.points[i].y;
                    if(this.points[i].y != 0) {
                        s += '<div><span style=\"margin-left: 9px; border-left: 9px solid ' +
                            this.points[i].series.color + ';' +
                            ' padding-left: 4px;' +
                            '\">' +
                            this.points[i].series.name +
                            '</span>:&nbsp;&nbsp;' +
                            Intl.NumberFormat().format(cumulative_amount);
                            s+='dps';
                    }
                }
                s+= '</div>';
                return s;
                */
            },
        legend: {
            layout: 'vertical',
            align: 'right',
            borderColor: medium_color,
            borderWidth: 1,
            floating: false,
            itemMarginBottom: 3,
            itemMaginTop: 0,
            reversed: true,
            shadow: false,
            verticalAlign: 'middle',
            x: 0,
            y: 0,
            title: {
                text: "Click to hide/show series.",
                style:
                    {
                    color:light_color,
                    fontWeight:'bold',
                },
            },
        itemStyle: {
            color: default_font_color,
            fontWeight: 'bold',
            },
        }
    }
    
    
const font_size = "1.1rem";

//Commented out for now until I can decide on colors.
const ilevel_color_table = {
/*
"300": "#1abc9c", 
"305": "#000000", 
"310": "#3498db", 
"315": "#9b59b6", 
"320": "#34495e", 
"325": "#f1c40f",
"330": "#e67e22",
"335": "#e74c3c",
"340": "#ecf0f1",
"345": "#95a5a6",
"350": "#16a085",
"355": "#27ae60",
"360": "#2980b9",
"365": "#8e44ad",
"370": "#2c3e50",
"375": "#f39c12",
"380": "#d35400",
"385": "#c0392b",
"390": "#bdc3c7",
"395": "#7f8c8d",
"400": "#2ecc71",
*/
};
standard_chart = Highcharts.chart('container', options); // Empty chart.
function createTrinketChart(jsonFile, simType){
    $.getJSON("https://raw.githubusercontent.com/WarcraftPriests/bfa-shadow-priest/master/json_Charts/trinkets_DA_ST.json", function(data) {
        //console.log(data); // this will show the info it in firebug console
    //$.getJSON("https://rawgit.com/WarcraftPriests/bfa-shadow-priest/master/json_Charts/traits_DA_C.json", function(data) {
        sortedItems = [];
        dpsSortedData = data["sorted_data_keys"];
        standard_chart.update({
            xAxis: {
                categories: dpsSortedData,
            }
        });
        itemLevels = data["simulated_steps"];
        for (currIlevel of itemLevels)
            {
                let maxItemLevel = data["simulated_steps"][0];
                let itemLevelDpsValues = [];
                for(sortedData of dpsSortedData)
                    {
                        var keys = [];
                        for(var k in data["data"][sortedData]) keys.push(k); //Pull all item levels of the trinket.
                        let minItemLevel = keys[0];
                        
                        sortedData = sortedData.trim();
                        
                        let dps = data["data"][sortedData][currIlevel];
                        let baselineDPS = data["data"]["Base"]["300"];
                        
                        //Check to make sure DPS isn't 0
                        if(dps > 0) 
                            {
                            
                            if(currIlevel == minItemLevel) 
                                {
                                    //If lowest ilvl is looked at, subtract base DPS
                                    itemLevelDpsValues.push(dps - baselineDPS);
                                }
                            else 
                            {
                                itemLevelDpsValues.push(dps - data["data"][sortedData][currIlevel - 5]);
                            }
                        }
                        else 
                            {
                            if (currIlevel in data["data"][sortedData]) 
                                {
                                itemLevelDpsValues.push(dps);
                                } 
                            else 
                                {
                                itemLevelDpsValues.push(0);
                                }
                            }
                        
                    }
                //standard_chart.yAxis[0].update({categories: dpsSortedData});
                
                standard_chart.addSeries({
                    color: ilevel_color_table[currIlevel],
                    data: itemLevelDpsValues,
                    name: currIlevel,
                    showInLegend: true
                }, false);
            }
        document.getElementById(simType).style.height = 200 + dpsSortedData.length * 30 + "px";
        standard_chart.setSize(document.getElementById(simType).style.width, document.getElementById(simType).style.height);
        //standard_chart.renderTo(simType);
        standard_chart.redraw();
    }).fail(function(){
        console.log("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
    })
};
createTrinketChart("https://raw.githubusercontent.com/WarcraftPriests/bfa-shadow-priest/master/json_Charts/trinkets_DA_ST.json", "container")

//standard_chart.destroy();
});
});