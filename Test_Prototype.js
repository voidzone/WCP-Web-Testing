var WCP_Chart = function WCP_Chart(id, options) {
    this.chartId = id;
    this.options = options;
   
    this.chartOptions = {
        chart: {
            renderTo: this.chartId,
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
    };
};
 
WCP_Chart.prototype.init = function() {
    // Setup your dummy charts, tabs, initiate the inial chart
    this.chart = Highcharts.chart(this.chartId, this.chartOptions); // Empty chart.
    if (this.options.charts[0].type == 'trinket'){
        this.updateTrinketChart(Object.keys(this.options.charts)[0]); // Setup the initial chart
    } else if (this.options.charts[0].type == 'azerite-trat') {
        this.updateTraitChart(Object.keys(this.options.charts)[0]); // Setup the initial chart
    }
    else {
        console.log(this.options.carts[0].type,'is an invalid type');
        return;
    }
};

 
WCP_Chart.prototype.updateTrinketChart = function(simType) {
    JQuery.getJSON(this.options.charts[simType], function(data) {
        //console.log(data); 
        var sortedItems = [];
        var dpsSortedData = data["sorted_data_keys"];
        this.chart.update({
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
                //this.chart.yAxis[0].update({categories: dpsSortedData});
               
                this.chart.addSeries({
                    color: ilevel_color_table[currIlevel],
                    data: itemLevelDpsValues,
                    name: currIlevel,
                    showInLegend: true
                }, false);
            }
        document.getElementById(simType).style.height = 200 + dpsSortedData.length * 30 + "px";
        this.chart.setSize(document.getElementById(simType).style.width, document.getElementById(simType).style.height);
        //this.chart.renderTo(simType);
        this.chart.redraw();
    }).fail(function(){
        console.log("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
    })
};

WCP_Chart.prototype.updateTraitChart = function(simType) {
    JQuery.getJSON("https://rawgit.com/WarcraftPriests/bfa-shadow-priest/master/json_Charts/traits_"+ this.chart.src + ".json", function(data) {
        let sortedItems = [];
        let dpsSortedData = data["sorted_data_keys"];
        standard_chart.update({
            xAxis: {
                categories: dpsSortedData,
            }
        });
        for (let stackCount of [3,2,1])
            {
                let maxItemLevel = data["simulated_steps"][0].split("_")[1];
                let stackName = stackCount + "_" + maxItemLevel;
                let itemLevelDpsValues = [];
                for(sortedData of dpsSortedData)
                    {
                        sortedData = sortedData.trim();
                        
                        let dps = data["data"][sortedData][stackName];
                        let baselineDPS = data["data"]["Base"]["1_"+maxItemLevel];
                        
                        //Check to make sure DPS isn't 0
                        if(dps > 0) 
                            {
                            
                            if(stackCount == 1) 
                                {
                                    //If lowest ilvl is looked at, subtract base DPS
                                    itemLevelDpsValues.push(dps - baselineDPS);
                                }
                            else 
                            {
                                itemLevelDpsValues.push(dps - data["data"][sortedData][stackCount - 1 + "_" + maxItemLevel]);
                            }
                        }
                        else 
                            {
                            if (stackName in data["data"][sortedData]) 
                                {
                            itemLevelDpsValues.push(dps);
                                } 
                            else 
                                {
                            itemLevelDpsValues.push(0);
                                }
                            }
                        
                    }
                let newStackName = stackName.split("_")[0];
                //standard_chart.yAxis[0].update({categories: dpsSortedData});
                this.chart.addSeries({
                    color: ilevel_color_table[stackName],
                    data: itemLevelDpsValues,
                    name: newStackName,
                    showInLegend: true
                }, false);
            }
            document.getElementById(simType).style.height = 200 + dpsSortedData.length * 30 + "px";
            this.chart.setSize(document.getElementById(simType).style.width, document.getElementById(simType).style.height);
            this.chart.redraw();
        }).fail(function(){
            console.log("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
        })
    };

var wcp_chart_1 = new WCP_Chart('chart_div', {
    charts : {
    'DATrinketsC' : { type: 'trinket', src: 'json_url' },
    'DATrinketsST' : { type: 'trinket', src: 'json_url'},
    'DATrinketsD'  : { type: 'trinket', src: 'json_url'},
    }
    });