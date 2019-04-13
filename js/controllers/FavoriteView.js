var FavoriteView = function (idContainer) {
    this.$container = $(idContainer);
    this.init();
};

FavoriteView.onItemClick = null;

FavoriteView.prototype = {
    
    init: function () {
        this.createChildren();
        this.setupHandlers();
    },

    createChildren: function () {
        this.$listView = this.$container.find('#list_favorites');
    },

    setupHandlers: function () {
        FavoriteView.onItemClick = this.onItemSelected.bind(this);
    },

    onItemSelected: function (idStop) {
        var info = new OpenDataService(AppController.onOpenDataResult);
        info.getInfoStop(idStop);
    },

    loadFavorites: function () {
        this.resultHandler = this.resultFavorites.bind(this);
        AppController.WebSql.loadStops(this.resultHandler);
    },

    resultFavorites: function (stops) {
        this.$listView.html('');
        var html = "";
        for (var i = 0; i < stops.length; i++) {
            html += this.templateFavorite(stops[i]);
        }
        if (html.length > 0) {
            this.$listView.append(html);
        } else {
            this.$listView.append(this.templateEmpty());
        }

    },

    templateEmpty: function () {
        return '<div class="empty-list">' +
            '<i class="tabbar__icon empty-icon ion-ios-heart-outline"></i>' +
            '<p>Añada aqui sus paradas favoritas</p>' +
            '</div>';
    },

    templateFavorite: function (stop) {
        var itemhtml = '<li class="list-item list-item--tappable" onclick="FavoriteView.onItemClick(' + stop.node + ')"  >' +
            '<div class="list-item__left">' +
            '<i class="tabbar__icon ion-android-bus color_accent"></i>' +
            '</div>' +
            '<div class="list-item__center">' +
            '<div class="list-item__title color_accent">' +
            '<div style="float:left;">' +
            stop.node +
            ' </div>' +
            '<div class="ons-favorite-label" style="float:left;">' +
            stop.nickname +
            ' </div>' +
            '</div>' +
            '<div class="list-item__subtitle sub-title">Ubicacion</div>' +
            '<div class="list-item__subtitle">' + stop.postaladress + '</div>' +
            '</div>' +
            '</li>';
        return itemhtml;
    }
}
