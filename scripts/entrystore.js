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
                    colourBlindSafe: self.moin.colourScheme === MoInVis.Paracoords.ColourScheme.ColourblindSafe
                };
            _vueMethods = {
                changed: _changed,
                toggleVisibility: _toggleVisibility,
                getEntryColor: _getEntryColor,
                toggleColourScheme: _toggleColourScheme
            };
            vueStuff = self.initVue( vueData, _vueMethods );
            _vueApp = vueStuff.mainApp;
            _vueData = vueStuff.dataProxy;

            self.addSwipeHelper( d3.select( '#entryListParent' ).node() );
        },

        _changed = function ( entry ) {
            entry.setVisibility( entry.visible );
            self.moin.paraCoorderRedrawReq = true;
        },

        _getEntryColor = function ( entry ) {
            return entry.getColor();
        },

        _toggleColourScheme = function () {
            var entry, getColour = MoInVis.Paracoords.util.getColour, index = 0;
            _vueData.colourBlindSafe = !_vueData.colourBlindSafe;
            if ( _vueData.colourBlindSafe ) {
                self.moin.colourScheme = MoInVis.Paracoords.ColourScheme.ColourblindSafe;
            } else {
                self.moin.colourScheme = MoInVis.Paracoords.ColourScheme.Normal;
            }
            for ( entry in _vueData.entries ) {
                _vueData.entries[entry].setColour( getColour( index, _vueData.colourBlindSafe ) );
                index++;
            }
        },

        _toggleVisibility = function () {
            if ( _areShown ) {
                _areShown = false;
            } else {
                _areShown = true;
            }
            _setVisible( _areShown );
        },

        _setVisible = function ( areShown ) {
            for ( var key of Object.keys( _vueData.entries ) ) {
                _vueData.entries[key].setVisibility( areShown );
            }
            self.moin.paraCoorderRedrawReq = true;
        };

    _init();
};

MoInVis.Paracoords.entryStore.baseCtor = MoInVis.Paracoords.tab;
