var MainView = function (idContainer) {
    this.$container = $(idContainer);
    this.tabNavigator = document.getElementById('navigator_tab');
    this.currentPage = '';
    this.init();
};


MainView.prototype = {

    init: function () {
        this.createChildren();
        this.setupHandlers();
        this.setupOnClick();
    },
    
    createChildren: function () {
        this.$tab_favorite = this.$container.find('#tap_favorites');
        this.$tab_stops = this.$container.find('#tap_stops');
        this.$tab_nearbyStops = this.$container.find('#tap_nearbystops');

    },
    
    setupHandlers: function () {
        this.tab_favoriteHandler = this.onGotoFavorite.bind(this);
        this.tab_stopsHandler = this.onGotoStops.bind(this);
        this.tab_nearbyStopsHandler = this.onGotoNearbyStops.bind(this);
    },
    
    setupOnClick: function () {
        this.$tab_favorite.click(this.tab_favoriteHandler);
        this.$tab_stops.click(this.tab_stopsHandler);
        this.$tab_nearbyStops.click(this.tab_nearbyStopsHandler);
    },
    
    onGotoFavorite: function () {
        if (this.currentPage != 'tap_favorites') {
            this.tabNavigator.replacePage('favorites.html', {
                animation: 'fade'
            });
            this.currentPage = 'tap_favorites';
        }
    },
    
    onGotoStops: function () {
        if (this.currentPage != 'tap_stops') {
            this.tabNavigator.replacePage('stops.html', {
                animation: 'fade'
            });
            this.currentPage = 'tap_stops';
        }
    },
    
    onGotoNearbyStops: function () {
        if (this.currentPage != 'maps') {
            this.tabNavigator.replacePage('maps.html', {
                animation: 'fade'
            }).then(function () {
                // callback when finalize load page
            });
            this.currentPage = 'maps';
        }
    }
}
