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

    const items = Object.keys(entries);
    var totalEntries = items.length;
    console.log("Total length of Entries: " + totalEntries);
    console.log("items is type of: " + typeof"items");
  console.log(items);

    var self = this,
        _parentDiv = parentDiv,
        _entries = entries,
        _vueData,
        _vueApp,


        _init = function () {
            // _parentDiv.style.overflow = 'scroll';
            _vueData = {
                tabName: 'Entry Store!',
                totalEntries: totalEntries,
                entries: entries
            };
            _vueApp = self.initVue( _vueData );
        };
    _init();
};


MoInVis.Paracoords.entryStore.baseCtor = MoInVis.Paracoords.tab;
