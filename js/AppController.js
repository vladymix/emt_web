var AppController = function () {
    "use strict";
    if (AppController._instance) {
        //this allows the constructor to be called multiple times
        //and refer to the same instance. Another option is to
        //throw an error.
        return AppController._instance;
    }
    // Only firts 
    AppController.loadedLibraryMap  = false;
    AppController.stopSelected = null;
    AppController.listStopsXml = null;
    AppController.WebSql = WebSql.adapter();
    AppController._instance = this;
    //Foo initialization code
};

AppController.onSearcStop;

AppController.getInstance = function () {
    "use strict";
    return AppController._instance || new AppController();
}

AppController.loadFavoriteView = function (viewId) {
    this.favorites = new FavoriteView(viewId);
    this.favorites.loadFavorites();
}

AppController.loadInfoStopView = function (viewId) {
    this.infoStop = new InfoStopView(viewId);
    this.infoStop.setStop(AppController.stopSelected);
}

AppController.loadStopsView = function (viewId) {
    this.stopsView = new StopsView(viewId);
    this.stopsView.loadAsyncStops();
}

AppController.loadMainView = function (viewId) {
    this.mainView = new MainView(viewId);
}

AppController.loadNearbyStops = function (viewId){
    this.nearbyStops = new NearbyStopsView(viewId);
    this.nearbyStops.msnWelcome();
}

AppController.onCreate = function () {
    AppController.getInstance();
    AppController.getInstance = null;
}

AppController.parserXmlStops = function (xml) {
   // var xmlDoc = xml.responseXML;
    var listStops = new Array();
    var nodes = xml.getElementsByTagName("REG");

    for (var i = 0; i < nodes.length; i++) {
        listStops.push(Stop.fromXml(nodes[i]));
    }
    AppController.listStopsXml = listStops;
    AppController.stopsView.listStopsXml = listStops;
}

AppController.onOpenDataResult = function (data) {
    ProgressDialog.dismiss();

    AppController.stopSelected = Stop.fromApiResult(data);

    var navigator = document.querySelector('#myNavigator');
    navigator.pushPage('info_stop.html', {
        animation: 'slide'
    });
}

AppController.initLibraryMaps = function(){
    this.loadedLibraryMap = true;
    console.log("Registered google maps library");
}
