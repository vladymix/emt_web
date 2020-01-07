var UrlBasic = "https://openapi.emtmadrid.es/v1";
var UrlGetinfoStop = "geo/GetStopsFromStop.php";
var UrlGetArriveStop = "geo/GetArriveStop.php";
var UrlGetStopsFromXY ="/geo/GetStopsFromXY.php"
var pd;
const idClient =  "vlady-mix@hotmail.com";
const passKey = "F@bricio18";
var accessTocken = "";
class HashMap {
    constructor() {
        this.values = Array();
    }
    set(key, value) {
        this.values.push(new Hash(key, value));
    }
    getValue(key) {
        return this.values[key];
    }
    getValues() {
        return this.values;
    }
}

class Hash {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    getValue() {
        return this.value;
    }
    getKey() {
        return this.key;
    }
}

class ApiClient {
    constructor(type, url, listener) {
        this.type = type;
        this.url = url;
        this.listener = listener;
        this.headers = {};
        this.content = "";
    }

    setcontentType(contentType) {
        this.contentType = contentType;
    }

    setContent_xwwwformurlencoded(map) {
        var isFirst = true;
        this.content = "";
        for (var i = 0; i < map.getValues().length; i++) {
            var key = map.getValues()[i].getKey();
            var value = map.getValues()[i].getValue();
            if (!isFirst) {
                this.content += "&" + key + "=" + value;
            } else {
                this.content = key + "=" + value;
                isFirst = false;
            }
        }
    }
    
    setContent(con){
        this.content = con;
    }
    
    setHeader(header){
        this.headers = header;
    }

    execute(error) {
        $.ajax({
            type: this.type,
            url: this.url,
            headers: this.headers,
            contentType: this.contentType,
            async: true,
            data: this.content,
            error: error,
            success: this.listener
        })
    }
}

class OpenDataService {
    constructor(listener) {
        this.listener = listener;
    }

    getInfoStop(idStop) {
        pd = new ProgressDialog({
            title: "EMT Horarios",
            message: "Obteniendo información",
            cancelable: true
        });
        pd.show();

        var client = new ApiClient("GET", UrlBasic+ "/transport/busemtmad/stops/arroundstop/" + idStop + "/0/", this.listener);
        
        client.setcontentType("application/json");
        client.setHeader({"accessToken":AppController.accessToken})
        client.execute(error);
    }
    
    getTocken(continueWith){
       pd = new ProgressDialog({
            title: "EMT Horarios",
            message: "Obteniendo token",
            cancelable: true
        });
        pd.show();
        
        var resultToken = function (result) {
                                        ProgressDialog.dismiss();
                                        AppController.accessToken = result.data[0].accessToken;
                                        continueWith.call();
                                        };
        
        var client = new ApiClient("GET",  UrlBasic+ "/mobilitylabs/user/login/",  resultToken);
        
        client.setcontentType("application/json");
        client.setHeader({ "email": "vlady-mix@hotmail.com", "password": "F@bricio18"});
        client.execute(error);
    }
    
     getNearbyStops(lat, lng) {
        pd = new ProgressDialog({
            title: "EMT Horarios",
            message: "Obteniendo información",
            cancelable: true
        });
        pd.show();
         
        var map = new HashMap();
        map.set("idClient", idClient);
        map.set("passKey", passKey);
        map.set("Radius", 300);
        map.set("latitude", lat);
        map.set("longitude", lng);
        map.set("cultureInfo", "ES");
       
        var client = new ApiClient("POST", UrlBasic + UrlGetStopsFromXY, this.listener);
        client.setcontentType("application/x-www-form-urlencoded");
        client.setContent_xwwwformurlencoded(map);
        client.execute(error);
    }
    
    getArrivedTimes(idStop){
        
        pd = new ProgressDialog({
            title: "EMT Horarios",
            message: "Obteniendo información",
            cancelable: true
        });

        var client = new ApiClient("POST", UrlBasic + "/transport/busemtmad/stops/" + idStop + "/arrives/", this.listener);
        
        client.setcontentType("application/json");
        client.setHeader({"accessToken":AppController.accessToken})
        client.setContent('{"cultureInfo":"ES", "Text_EstimationsRequired_YN":"Y" }');
        client.execute(error);
        
    }
}

function error(xhr, ajaxOptions, thrownError) {
    ProgressDialog.dismiss();
    new AlertDialog("Error","Se ha producido un error, por favor intentelo más tarde"+thrownError).show();
}
