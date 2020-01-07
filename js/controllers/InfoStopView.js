var InfoStopView = function (idContainer) {
   this.$container = $(idContainer);
   this.stop = null;
   this.node = null;
   this.isFavorite = false;
   this.init();
};

InfoStopView.prototype = {

   init: function () {
      this.createChildren();
      this.setupHandlers();
      this.setupOnClick();
   },

   createChildren: function () {
      this.$backButton = this.$container.find('#back_button');
      this.$addFavoriteButton = this.$container.find('#add_favorite');
      this.$iconFavorite = this.$addFavoriteButton.find('.zmdi');
      this.$nodeStopLabel = this.$container.find('#tx_nodestop');
      this.$nameStopLabel = this.$container.find('#tx_namestop');
      this.$postalAdressLabel = this.$container.find('#tx_postaladress');
      this.$linesLabel = this.$container.find('#tx_lines');
      this.$listArriveds = this.$container.find('#list_arriveds');

   },

   setupHandlers: function () {

      this.addFavoriteHandler = this.addOrDeleteFavorite.bind(this);
      this.resultExistFavoriteHandler = this.loadLogicBotton.bind(this);

      this.removeFavoriteAction = this.onRemoveFavorite.bind(this);
      this.addFavoriteActionAction = this.onAddFavorite.bind(this);

   },
   
   onGoBack: function () {

      var navigator = document.querySelector('#myNavigator');
      //document.querySelector('#myNavigator').resetToPage('page1.html',{animation: 'fade-ios'});
      navigator.removePage(navigator.childNodes.length - 1);

   },

   onAddFavorite: function (sender) {
      this.stop.nickname = sender;
      AppController.WebSql.insertStop(this.stop);
      this.loadLogicBotton(true);
   },

   onRemoveFavorite: function () {
      AppController.WebSql.removeStop(this.node);
      this.loadLogicBotton(false);
      AppController.favorites.loadFavorites();
   },

   setupOnClick: function () {
      this.$addFavoriteButton.click(this.addFavoriteHandler);
      this.$backButton.click(this.onGoBack);
   },

   setStop: function (stop) {
      this.stop = stop;
      this.cleanView();
      this.loadStopView();
   },

   cleanView: function () {
      this.$nodeStopLabel.html('');
      this.$nameStopLabel.html('');
      this.$postalAdressLabel.html('');
      this.$linesLabel.html('');
      this.$listArriveds.html('');
   },

   loadStopView: function () {

      if (this.stop != null) {
         this.$nodeStopLabel.append("Parada " + this.stop.node);
         this.$nameStopLabel.append(this.stop.name);
         this.$postalAdressLabel.append(this.stop.postaladress);
         this.$linesLabel.append(this.stop.lines);
         this.node = this.stop.node;
         this.loadArrivesService();
         AppController.WebSql.existStop(this.node, this.resultExistFavoriteHandler);
      }
   },

   addOrDeleteFavorite: function (sender, args) {
      if (!this.isFavorite) {
         var dialog = new TextDialog("Añadir a favoritos", "Guardar como:", "Parada favorita");
         dialog.show(this.addFavoriteActionAction);
      } else {
         var sheet = new ActionSheet("Eliminar de favoritos", "Eliminar", "Cancelar");
         sheet.show(this.removeFavoriteAction);
      }
   },

   loadLogicBotton: function (favorite) {
      this.isFavorite = favorite;
      if (favorite) {
         this.$iconFavorite.removeClass('ion-ios-heart-outline');
         this.$iconFavorite.addClass('ion-ios-heart');
      } else {
         this.$iconFavorite.removeClass('ion-ios-heart');
         this.$iconFavorite.addClass('ion-ios-heart-outline');
      }
   },
   
   resultArrivedApiService: function (apiResult) {
      ProgressDialog.dismiss();
      var array = new Array();
      this.$listArriveds.html('');;

      if (apiResult != null) {
          var arrive = apiResult.data[0].Arrive;
          
         if (Array.isArray(arrive)) {
            for (i in arrive) {
               array.push(Arrived.fromApiResult(arrive[i]))
            }
         } else {
            array.push(arrive);
         }
      }

      this.$listArriveds.append(this.getHtmlArrives(array));
   },

   loadArrivesService: function () {
      this.resultHandler = this.resultArrivedApiService.bind(this);
      var open = new OpenDataService(this.resultHandler);
      open.getArrivedTimes(this.node);
   },

   getHtmlArrives: function (arrives) {
      var html = "";
      for (i in arrives) {
         html += this.getTemplateArrived(arrives[i]);
      }
      return html;
   },

   getTemplateArrived: function (arrived) {
      var html = '<li class="list-item">' +
         '<div class="list-item__left color_accent" style="width: 40px;">' +
         //'<label class="color_accent">' +
         arrived.lineId +
         //'</label>' +
         '</div>' +
         '<label class="list-item__center">' +
         arrived.labelArrived +
         '</label>' +
         '</li>';
      return html;
   }
}
