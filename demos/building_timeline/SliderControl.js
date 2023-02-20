L.Control.SliderControl = L.Control.extend({
    options: {
        position: 'topright',
        layers: null,
        timeAttribute: 'time',
        isEpoch: false,     // whether the time attribute is seconds elapsed from epoch
        startTimeIdx: 0,    // where to start looking for a timestring
        timeStrLength: 4,  // the size of  yyyy-mm-dd hh:mm:ss - if millis are present this will be larger
        maxValue: -1,
        minValue: 0,
        showAllOnStart: true,
        markers: null,
        range: false,
        follow: false,
        sameDate: false,
        alwaysShowDate : false,
        rezoom: null
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layer = this.options.layer;

    },

    extractTimestamp: function(time, options) {
        if (options.isEpoch) {
            time = (new Date(parseInt(time))).toString(); // this is local time
        }
        return time.substr(options.startTimeIdx, options.startTimeIdx + options.timeStrLength);
    },
    
    extractTT: function(time, options) {
        if (options.isEpoch) {
            time = (new Date(parseInt(time))).toString(); // this is local time
        }
        return time.substr(options.startTimeIdx, options.startTimeIdx + options.timeStrLength);
    },

    setPosition: function (position) {
        var map = this._map;

        if (map) {
            map.removeControl(this);
        }

        this.options.position = position;

        if (map) {
            map.addControl(this);
        }
        this.startSlider();
        return this;
    },
    

    onAdd: function (map) {
        this.options.map = map;

        // Create a control sliderContainer with a jquery ui slider
        var sliderContainer = L.DomUtil.create('div', 'slider', this._container);
      
        $(sliderContainer).append('<div id= "slider" style=" background: white; box-shadow: 0 1px 7px rgba(0, 0, 0, 0.65); -webkit-border-radius: 4px; border-radius: 4px; text-align: center; padding: 8px 5px 5px 5px; position: relative;"</div><div id="slider-start" style="display: inline-block; margin: 0 5px 0 5px;"></div><div id="leaflet-slider" style="width:280px; inline-block; margin: 15px;display: inline-block; margin: 0 5px 0 5px;"></div><div id="slider-end" style="display: inline-block; margin: 0 5px 0 5px;"></div>');
    

        $(sliderContainer).mousedown(function () {
            map.dragging.disable();
        });
        $(document).mouseup(function () {
            map.dragging.enable();
            //Hide the slider timestamp if not range and option alwaysShowDate is set on false
            if (options.range || !options.alwaysShowDate) {
                $('#slider-timestamp').html('');
                $('#slider-timea').html('');
            }
        });

        var options = this.options;
        this.options.markers = [];

        
        

        //If a layer has been provided: calculate the min and max values for the slider
        if (this._layer) {
            // Add popup to the layer markers
            var popup = L.popup();
            var index_temp = 0;
            this._layer.eachLayer(function (layer) {
                options.markers[index_temp] = layer;
                if(layer.feature.properties['num']>25) {
                    var iccn = L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
                        iconSize: [35, 58],
                        iconAnchor: [17, 58],
                        popupAnchor: [1, -47],
                        shadowSize: [58, 58]
                        });

                }
                else if(layer.feature.properties['num']<=25 && layer.feature.properties['num']>10){
                    var iccn = L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                        shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                        });

                }
                else{
                    var iccn = L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
                        shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
                        iconSize: [15, 24],
                        iconAnchor: [8, 24],
                        popupAnchor: [1, -21],
                        shadowSize: [24, 24]
                        });
                }
                popup=layer.feature.properties['popup']



                ++index_temp;
                layer.bindPopup(popup);
                layer.setIcon(iccn);
            });
            options.maxValue = index_temp - 1;
            this.options = options;
        } else {
            console.log("Error: You have to specify a layer via new SliderControl({layer: your_layer});");
        }


        return sliderContainer;
    },


    updateCurrentDiv: function (startIdx, endIdx) {
        this.$currentStartDiv.html(this.options.markers[startIdx].feature.properties[this.options.timeAttribute]);
        this.$currentEndDiv.html(this.options.markers[endIdx].feature.properties[this.options.timeAttribute]);
    },


    onRemove: function (map) {
        //Delete all markers which where added via the slider and remove the slider div
        for (i = this.options.minValue; i <= this.options.maxValue; i++) {
            map.removeLayer(this.options.markers[i]);
        }
        $('#leaflet-slider').remove();

        // unbind listeners to prevent memory leaks
        $(document).off("mouseup");
        $(".slider").off("mousedown");
    },
    

    startSlider: function () {
        self=this;
        _options = this.options;
        _extractTimestamp = this.extractTimestamp
        var index_start = _options.minValue;
        var index_end = _options.maxValue;
        if(_options.showAllOnStart){
            index_start = _options.maxValue;
            if(_options.range) _options.values = [_options.minValue,_options.maxValue];
            else _options.value = _options.maxValue;
        }
        $("#leaflet-slider").slider({
            range: _options.range,
            value: _options.value,
            values: _options.values,
            min: _options.minValue,
            max: _options.maxValue,
            sameDate: _options.sameDate,
            step: 1,
            slide: function (e, ui) {
                var map = _options.map;
                var fg = L.featureGroup();
                if(!!_options.markers[ui.value]) {
                    // If there is no time property, this line has to be removed (or exchanged with a different property)
                    if(_options.markers[ui.value].feature !== undefined) {
                        if(_options.markers[ui.value].feature.properties[_options.timeAttribute]){
                            if(_options.markers[ui.value]) {
                                $('#slider-timestamp').html(_extractTimestamp(_options.markers[ui.value].feature.properties[_options.timeAttribute], _options));
                                $('#slider-timea').html(_extractTimestamp(_options.markers[index_end].feature.properties[_options.timeAttribute], _options));
                                $('#slider-start').html(_extractTimestamp(_options.markers[ui.values[0]].feature.properties[_options.timeAttribute], _options));
                                $('#slider-end').html(_extractTimestamp(_options.markers[ui.values[1]].feature.properties[_options.timeAttribute], _options));
                                $('#slider-min').html(_extractTimestamp(_options.markers[_options.minValue].feature.properties[_options.timeAttribute], _options));
                                $('#slider-max').html(_extractTimestamp(_options.markers[_options.maxValue].feature.properties[_options.timeAttribute], _options));


                            
                            }
                        }else {
                            console.error("Time property "+ _options.timeAttribute +" not found in data");
                        }
                    }else {
                        // set by leaflet Vector Layers
                        if(_options.markers [ui.value].options[_options.timeAttribute]){
                            if(_options.markers[ui.value]) {
                                $('#slider-timestamp').html(_extractTimestamp(_options.markers[ui.value].options[_options.timeAttribute], _options));
                                $('#slider-timea').html(_extractTimestamp(_options.markers[index_end].feature.properties[_options.timeAttribute], _options));
                                $('#slider-start').html(_extractTimestamp(_options.markers[ui.values[0]].feature.properties[_options.timeAttribute], _options));
                                $('#slider-end').html(_extractTimestamp(_options.markers[ui.values[1]].feature.properties[_options.timeAttribute], _options));
                  
                                $('#slider-min').html(_extractTimestamp(_options.markers[_options.minValue].feature.properties[_options.timeAttribute], _options));
                                $('#slider-max').html(_extractTimestamp(_options.markers[_options.maxValue].feature.properties[_options.timeAttribute], _options));
                            }

                                
                        }else {
                            console.error("Time property "+ _options.timeAttribute +" not found in data");
                        }
                    }

                    var i;
                    // clear markers
                    for (i = _options.minValue; i <= _options.maxValue; i++) {
                        if(_options.markers[i]) map.removeLayer(_options.markers[i]);
                    }
                    if(_options.range){
                        // jquery ui using range
                        for (i = ui.values[0]; i <= ui.values[1]; i++){
                           if(_options.markers[i]) {
                               map.addLayer(_options.markers[i]);
                               fg.addLayer(_options.markers[i]);
                           }
                           
                        }
                     

                    }else if(_options.follow){
                        for (i = ui.value - _options.follow + 1; i <= ui.value ; i++) {
                            if(_options.markers[i]) {
                                map.addLayer(_options.markers[i]);
                                fg.addLayer(_options.markers[i]);
                            }
                        }
                    }
                   
                    else{
                        for (i = _options.minValue; i <= ui.value ; i++) {
                            if(_options.markers[i]) {
                                map.addLayer(_options.markers[i]);
                                fg.addLayer(_options.markers[i]);
                            }
                        }
                    }
                };
                if(_options.rezoom) {
                    map.fitBounds(fg.getBounds(), {
                        maxZoom: _options.rezoom
                    });
                }
            }
        });
        
    
        if (!_options.range && _options.alwaysShowDate) {
            $('#slider-timestamp').html(_extractTimeStamp(_options.markers[index_start].feature.properties[_options.timeAttribute], _options));
            $('#slider-timea').html(_extractTimeStamp(_options.markers[ui.values[0]].feature.properties[_options.timeAttribute], _options));
            $('#slider-start').html(_extractTimestamp(_options.markers[ui.values[0]].feature.properties[_options.timeAttribute], _options));
            $('#slider-end').html(_extractTimestamp(_options.markers[ui.values[1]].feature.properties[_options.timeAttribute], _options));

        }
        for (i = _options.minValue; i <= index_start; i++) {
            _options.map.addLayer(_options.markers[i]);
        }
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
}



;
