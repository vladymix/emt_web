 class Stop {
     constructor() {
         this.node = "";
         this.posxnode = 0;
         this.posynode = 0;
         this.name = "";
         this.lines = "";
         this.postaladress = "";
         this.nickname = ""
     }
     
     
     static fromNearby(json){
         var stop = new Stop();
         stop.name = json.name;
         stop.postaladress = json.postalAddress;
         stop.node = json.stop;
         stop.posxnode = json.longitude;
         stop.posynode = json.latitude;
         
         var lines = json.line;

         var contentLines = "";
         if (Array.isArray(lines)) {
             for (var i = 0; i < lines.length; i++) {
                 var line = lines[i];
                 if (line.direction = "B") {
                     contentLines += line.line + " → " + line.headerB + "</br>";
                 } else {
                     contentLines += line.line + " → " + line.headerA + "</br>";
                 }
             }
         } else {
             if (lines.direction = "B") {
                 contentLines += lines.line + " → " + lines.headerB + "</br>";
             } else {
                 contentLines += lines.line + " → " + lines.headerA + "</br>";
             }
         }
         stop.lines = contentLines;
         
         return stop;
     }

     static fromApiResult(json) {
         var stop = new Stop();
         var st = json;
         var lines = st.dataLine;
         
         stop.node = st.stop;
         stop.name = st.name;
         stop.postaladress = st.postalAddress;
         stop.posxnode = st.longitude;
         stop.posynode = st.latitude;
        

         var contentLines = "";
         if (Array.isArray(lines)) {
             for (var i = 0; i < lines.length; i++) {
                 var line = lines[i];
                 if (line.direction = "B") {
                     contentLines += line.label + " → " + line.headerB + "\n";
                 } else {
                     contentLines += line.label + " → " + line.headerA + "\n";
                 }
             }
         } else {
             if (lines.direction = "B") {
                 contentLines += lines.label + " → " + lines.headerB + "\n";
             } else {
                 contentLines += lines.label + " → " + lines.headerA + "\n";
             }
         }
         stop.lines = contentLines;
         return stop;
     }

     static fromXml(item) {
         var stop = new Stop();
         stop.node = item.childNodes[1].innerHTML;
         stop.posxnode = item.childNodes[3].innerHTML;
         stop.posynode = item.childNodes[5].innerHTML;
         stop.name = item.childNodes[7].innerHTML;
         stop.lines = item.childNodes[9].innerHTML;
         stop.postaladress = "";
         stop.nickname = "";
         return stop;
     }

     static fromBdd(item) {
         if (item != null) {
             var stop = new Stop();
             stop.node = item.node;
             stop.name = item.name;
             stop.lines = item.lines;
             stop.postaladress = item.postaladress;
             stop.posxnode = item.posxnode;
             stop.posynode = item.posynode;
             stop.nickname = item.nickname;
             return stop;
         } else {
             return null;
         }
     }
 }

 class Arrived {

     constructor() {
         this.busDistance = null;
         this.busId = null;
         this.busPositionType = null;
         this.busTimeLeft = null;
         this.destination = null;
         this.isHead = null;
         this.latitude = null;
         this.lineId = null;
         this.longitude = null;
         this.stopId = null;
         this.labelArrived = "";
     }

     static fromApiResult(json) {
         var arrived = new Arrived();
         arrived.busDistance = json.DistanceBus;
         arrived.busId = json.stop;
         arrived.busPositionType = json.positionTypeBus;
         arrived.busTimeLeft = json.estimateArrive;
         arrived.destination = json.destination;
         arrived.isHead = json.isHead;
        
         arrived.lineId = json.line;
         arrived.stopId = json.stop;
         
         arrived.labelArrived = "";
         if (arrived.busTimeLeft == 999999) {
             arrived.labelArrived = "Tiempo de llegada > 20 minutos";
         } else if (arrived.busTimeLeft == 0) {
             arrived.labelArrived = "En las inmediaciones";
         } else {
             arrived.labelArrived = "Tiempo de llegada " + Math.round(arrived.busTimeLeft / 60) + " minutos";
         }
         return arrived;
     }
 }
