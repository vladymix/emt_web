var WebSql = (function () {

  var namedatabase = 'EmtDataBase';
  var instance = null;
  var version = '1.0';

  /*
    this.node = "";
    this.posxnode = 0;
    this.posynode = 0;
    this.name = "";
    this.lines = "";
    this.postaladress = "";
  */
  var query_table_favorites = 'CREATE TABLE IF NOT EXISTS FAVORITE_STOP (node unique, posxnode,posynode,name,lines,postaladress, nickname)'
  var query_insert_favorites = 'INSERT INTO FAVORITE_STOP (node,posxnode,posynode,name,lines,postaladress,nickname)' +
    ' VALUES (?, ?, ?, ?, ?, ?, ?)';

  function WebSql() {
    this.initialized = false;
    this._db = null;
  }

  function getDinamicStop(stop) {
    return [stop.node, stop.posxnode, stop.posynode, stop.name, stop.lines, stop.postaladress, stop.nickname]
  }

  // public interface
  WebSql.prototype = {

    openDataBaseConection: function () {
      if (!this._db) {
        this._db = openDatabase(namedatabase, '1.0', 'Test DB', 2 * 1024 * 1024);
        this.initialized = true;
        console.log("openDataBase");
      }
    },

    insertStop: function (stop) {
      this.openDataBaseConection();
      this._db.transaction(function (tx) {
        tx.executeSql(query_table_favorites);
        tx.executeSql(query_insert_favorites, getDinamicStop(stop));
      }, errorCB, function () {
        new AlertDialog("Emt Horarios", "Parada guardada correctamente").show();
      });
    },

    loadStops: function (callback) {
      this.openDataBaseConection();
      this._db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM FAVORITE_STOP ORDER BY node ASC', [], function (tx, results) {
          callback(getStopsFromBddResult(results.rows));
        }, null);
      });

    },

    existStop: function (stopId, callback) {
      this.openDataBaseConection();
      this._db.transaction(function (tx) {
        tx.executeSql('SELECT node FROM FAVORITE_STOP where node =?', [stopId], function (tx, results) {
          callback(results.rows.length > 0);
        }, null);
      });

    },

    selectStop: function (stopid, callback) {
      this.openDataBaseConection();
      this._db.transaction(function (tx) {
        tx.executeSql('SELECT node FROM FAVORITE_STOP where node =?', [stopId], function (tx, results) {
          callback(Stop.fromBdd(results.rows.item(0)));
        }, null);
      });
    },

    removeStop: function (stopid, callback) {
      this.openDataBaseConection();
      this._db.transaction(function (tx) {
        tx.executeSql('DELETE FROM FAVORITE_STOP WHERE node =?', [stopid], function (tx, results) {
          console.log("Delete rows " + results.rowsAffected)
          //callback(Stop.fromBdd(results.rowsAffected>0));
        }, null);
      });
    }
  };


  return {
    adapter: function () {
      if (!instance) {
        instance = new WebSql();
        instance.constructor = null;
      }
      return instance;
    }
  };
})();

function errorCB(tx, err) {
  console.error(tx);
}

function getStopsFromBddResult(rows) {
  var stops = new Array();
  if (rows.length > 0) {
    for (var i = 0; i < rows.length; i++) {
      stops.push(Stop.fromBdd(rows.item(i)))
    }
  }
  return stops;

}
