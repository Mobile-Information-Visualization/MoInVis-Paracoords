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

    const items = Object.keys( entries );
    var totalEntries = items.length;

    var self = this,
        _parentDiv = parentDiv,
        _entries = entries,
        _vueData,
        _vueMethods,
        _vueApp,

        _init = function () {
            var vueStuff,
                vueData = {
                    tabName: 'Entry Store!',
                    totalEntries: totalEntries,
                    entries: entries,
                    flag: self.moin.paraCoorderRedrawReq,
                };
            _vueMethods = {
                changed: _changed,
                getEntryColor: _getEntryColor
            };
            vueStuff = self.initVue( vueData, _vueMethods );
            _vueApp = vueStuff.mainApp;
            _vueData = vueStuff.dataProxy;
        },

        _changed = function ( entry ) {
            entry.setVisibility( entry.visible );
            self.moin.paraCoorderRedrawReq = true;
        },

        _getEntryColor = function ( entry ) {
            return entry.getColor();
        };

    _init();
};

MoInVis.Paracoords.entryStore.baseCtor = MoInVis.Paracoords.tab;
