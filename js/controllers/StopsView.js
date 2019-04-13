var StopsView = function (idContainer) {
    this.$container = $(idContainer);
    this.listStopsXml=null;
    this.init();
};

StopsView.prototype = {

    init: function () {
        this.createChildren();
        this.setupHandlers();
        this.setListeners();
    },

    createChildren: function () {
        this.$textView = this.$container.find('.search-input');
        this.$listView = this.$container.find('#listview_stops');

    },

    setupHandlers: function () {
        this.textChangeHandler = this.onTextChange.bind(this);
        this.loadListHandler = this.drawList.bind(this);
        AppController.onSearcStop = this.itemSelected.bind(this);
    },

    itemSelected: function (node) {
        var info = new OpenDataService(AppController.onOpenDataResult);
        info.getInfoStop(node);
    },

    setListeners: function () {
        //oninput
        this.$textView[0].oninput = this.textChangeHandler;

    },

    onTextChange: function (inputEvent) {
        var value = this.$textView[0].value;
        if (value.length > 0) {
            var list = new Array();
            for (var i = 0; i < this.listStopsXml.length; i++) {
                if (this.listStopsXml[i].node.includes(value)) {
                    list.push(this.listStopsXml[i]);
                }
            }
            this.drawList(list);
        } else {
            this.drawList(this.listStopsXml);
        }
    },

    loadAsyncStops: function () {

        if (AppController.listStopsXml == null) {
            this.readStopsFromXml(this.loadListHandler);
        } else {
            this.listStopsXml= AppController.listStopsXml;
            this.drawList(AppController.listStopsXml);
           
        }

    },

    readStopsFromXml: function (callback) {
        this.progressDialog = new ProgressDialog({
            title: "EMT Horarios",
            message: "Leyendo información",
            cancelable: false
        });

        this.progressDialog.show();


        $.ajax({
            type: "GET",
            url: "data/NodesLines.xml",
            dataType: "xml",
            success: function (xml) {
                console.log(xml);
                AppController.parserXmlStops(xml);
                callback(AppController.listStopsXml);
            }
        });
    },

    getTemplateStop: function (stop) {
        var itemhtml = '<li class="list-item list-item--tappable" onclick="AppController.onSearcStop(' + stop.node + ')"  >' +
            '<div class="list-item__left">' +
            '<i class="tabbar__icon ion-android-bus color_accent"></i>' +
            '</div>' +
            '<div class="list-item__center">' +
            '<div class="list-item__title color_accent">' + stop.node + '</div>' +
            '<div class="list-item__subtitle sub-title">Ubicacion</div>' +
            '<div class="list-item__subtitle">' + stop.name + '</div>' +
            '</div>' +
            '</li>';
        return itemhtml;
    },

    drawList: function (stops) {
        ProgressDialog.dismiss();

        this.$listView.html('');
        if (stops) {
            if (stops.length > 20) {
                limit = 20;
            } else {
                limit = stops.length;
            }

            var html = '';

            for (var j = 0; j < limit; j++) {
                html += this.getTemplateStop(stops[j]);
            }
            this.$listView.append(html);

        }
    }
}
