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
        _vueData,
        _vueMethods,
        _vueApp,

        _init = function () {
            var vueStuff,
                vueData = {
                    tabName: 'Entry Store!',
                    entries: _entries,
                    totalEntries: _totalEntries,
                    flag: self.moin.paraCoorderRedrawReq,
                };
            _vueMethods = {
                changed: _changed,
                setAllVisible: _setAllVisible,
                setAllInvisible: _setAllInvisible,
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

        _setAllVisible = function ( ) {
          console.log("Set all visible");

        for (var key of Object.keys(_vueData.entries)) {
            _vueData.entries[key].setVisibility(true);
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
