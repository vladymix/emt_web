var NearbyStopsView = function (idContainer) {
    this.$container = $(idContainer);
    this.listStopsXml=null;
    this.init();
    this.map_icon_location = new google.maps.MarkerImage(
      "http://emt.vladymix.es/data/ic_location.png",
      new google.maps.Size(32, 32),
      new google.maps.Point(0, 0));
    
};

NearbyStopsView.prototype = {
    init:  function(){
        this.createChildren();
        this.initMap();
        this.setupHandlers();
        this.initListeners();
        this.markers = [];
    }, 
    
    createChildren : function(){
        this.$map= document.getElementById('map');
    },
    
    initMap :function(){
        this.map = new google.maps.Map(this.$map, {
                    center: {
                        lat: 40.416775,
                        lng: -3.70379
                            },
                    zoom: 11,
                    disableDefaultUI: true
                });
    },
    
    setupHandlers:function(){
        this.onLongPressedHandler = this.onLongPressed.bind(this);
        this.onSearcStopHandle = this.onSearchStop.bind(this);
        this.onResulHandler = this.onResult.bind(this);
        AppController.onSearcStop = this.itemSelected.bind(this);
    },
    
    itemSelected: function (node) {
        var info = new OpenDataService(AppController.onOpenDataResult);
        info.getInfoStop(node);
    },
    
    initListeners : function(){
        this.map.addListener('click', this.onLongPressedHandler);
    },
    
    msnWelcome:function(){
    //getLocation();
     new AlertDialog("Atención", "Esta función se encuentra en desarrollo matenga presionado para buscar paradas cercanas").show();
     },
    
    setMiPosition:function (latLng){
        this.clearMarkers();
        
        var marker = new google.maps.Marker({position: latLng, map: this.map, icon: this.map_icon_location});
        marker.position = latLng;
        var info = 'latitude: '+ latLng.lat() + '</br>longitude: '+latLng.lng();
        var infowindow = new google.maps.InfoWindow({content: '<div>My location </br>'+info+'</div>'});
        google.maps.event.addListener(marker, 'click', function () {infowindow.open(this.map, marker);});
        
      var cityCircle = new google.maps.Circle({
            strokeColor: '#949292',
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: '#949292',
            fillOpacity: 0.35,
            map: this.map,
            center: latLng,
            radius: 300
          });
        
        this.markers.push(cityCircle);
        
       
    },
    
    createMarket:function(latLng, stop){
      var marker = new google.maps.Marker({position: latLng, map: this.map});
      var infowindow = new google.maps.InfoWindow({content: this.getTemplateInfo(stop)});
        
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
        
      return marker;
    },
   
    onDrawResults:function(array){
        // array stops
        for(var i =0; i< array.length;i++){
            var stop = array[i];
            var lat = stop.posynode;
            var lng= stop.posxnode;
           this.markers.push(this.createMarket(new google.maps.LatLng(lat, lng), stop));
        }
    },
    
    onLongPressed: function(e){
     // var marker = new google.maps.Marker({position: latLng, map: this.map});
        var latLng = e.latLng;
        this.setMiPosition(latLng);
        this.map.panTo(latLng);// center map
        this.onSearchNearbyStops(latLng);
    },
    
    onResult:function(jsonData){
        ProgressDialog.dismiss();
        
        var list = Array();
         if (Array.isArray(jsonData.stop)) {
             for (var i = 0; i < jsonData.stop.length; i++) {
               list.push(Stop.fromNearby(jsonData.stop[i]))
             }
         } else {
              list.push(Stop.fromNearby(jsonData.stop))
         }
        this.onDrawResults(list);
    },
     
    onSearchStop:function(node){
     var info = new OpenDataService(AppController.onOpenDataResult);
     info.getInfoStop(node);
    },
    
    onSearchNearbyStops:function(latLng){
     var info = new OpenDataService(this.onResulHandler);
     info.getNearbyStops(latLng.lat(), latLng.lng());  
    },
    
    clearMarkers:function(){
        this.remove(null);
        this.markers =[];
    },
    
    remove:function(map){
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(map);
        }
    },
    
    getTemplateInfo:function(stop){
        var htmlinfo = `<div id='node' onclick="AppController.onSearcStop(${stop.node})">
                             <span style="font-weight: bold;">Parada: ${stop.node}</span></br>
                             Lineas: </br>${stop.lines}
                        </div>`;
        
        return htmlinfo;
    }
    
    
}// end prototype