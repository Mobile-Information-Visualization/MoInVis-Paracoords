var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
/*
*
* Descr.: Handles data and UI functionality for the entry store tab.
*         Inherits MoInVis.Paracoords.tab
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.entryStore = function ( moin, parentDiv, entries ) {
    this.moin = moin;
    MoInVis.Paracoords.entryStore.baseCtor.call( this, parentDiv );

    var self = this,
        _parentDiv = parentDiv,
        _entries = entries,
        _totalEntries = Object.keys( _entries ).length,
        _areShown = true,
        _vueData,
        _vueMethods,
        _vueApp,

        _init = function () {
            var vueStuff,
                vueData = {
                    tabName: 'Entry Store!',
                    entries: _entries,
                    totalEntries: _totalEntries,
                    areShown: _areShown,
                    flag: self.moin.paraCoorderRedrawReq,
                };
            _vueMethods = {
                changed: _changed,
                toggleVisibility: _toggleVisibility,
                getEntryColor: _getEntryColor
            };
            vueStuff = self.initVue( vueData, _vueMethods );
            _vueApp = vueStuff.mainApp;
            _vueData = vueStuff.dataProxy;

            self.addSwipeHelper( d3.select( '#entryListParent' ).node() );
        },

        _changed = function ( entry ) {
            entry.setVisibility( entry.visible );
            self.moin.paraCoorderRedrawReq = true;
            console.log(entry.itemText + " is now " + entry.visible);
        },

        _getEntryColor = function ( entry ) {
            return entry.getColor();
        };

        _toggleVisibility = function ( ) {
          if ( _areShown ){
            console.log("Set all visible");
            _areShown = false;
          } else {
            console.log("Set all invisible");
            _areShown = true;
          }
          _setVisible( _areShown );
        };

        _setVisible = function ( areShown ) {
          console.log("Set all visible");

        for (var key of Object.keys(_vueData.entries)) {
            _vueData.entries[key].setVisibility( areShown );
            console.log(_vueData.entries[key] + " is now " +_vueData.entries[key].visible);
        }

        self.moin.paraCoorderRedrawReq = true;
        };

        _setAllInvisible = function ( ) {
          console.log("Hide all");

          for (var key of Object.keys(_vueData.entries)) {
            _vueData.entries[key].setVisibility(false);
            console.log(_vueData.entries[key] + " is now " +_vueData.entries[key].visible);
          }

          self.moin.paraCoorderRedrawReq = true;
          };

    _init();
};

MoInVis.Paracoords.entryStore.baseCtor = MoInVis.Paracoords.tab;
