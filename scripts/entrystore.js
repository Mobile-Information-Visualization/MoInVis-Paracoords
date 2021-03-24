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
    // console.log("Total length of Entries: " + totalEntries);
    // console.log("items is type of: " + typeof"items");
    // console.log(items);

    // console.log("Redraw flag: "+ paraCoorderRedrawReq);

    var self = this,
        _parentDiv = parentDiv,
        _entries = entries,
        _vueData,
        _vueMethods,
        _vueApp,

        _init = function () {
            // _parentDiv.style.overflow = 'scroll';
            _vueData = {
                tabName: 'Entry Store!',
                totalEntries: totalEntries,
                entries: entries,
                flag : self.moin.paraCoorderRedrawReq,
            };
            _vueMethods = {
              changed: _changed,
              checkEntry: _checkEntry,
              getEntryColor: _getEntryColor,
            };

            _vueApp = self.initVue( _vueData, _vueMethods);
        };

     _changed = function(entry){
      if (entry.visible) {
          entry.setVisibility(false);
      } else {
        entry.setVisibility(true);
      }
      console.log("Visibility of " + entry.itemText + " is now " + entry.visible);
      if (!self.moin.paraCoorderRedrawReq){
      self.moin.paraCoorderRedrawReq = true;
      console.log("Redraw flag: "+ self.moin.paraCoorderRedrawReq);
      }
    };

    _checkEntry = function(entry){

      if ( typeof entry === "undefined" ){
        console.log ("Undefined entry!" );
        return(" undefined ");
      } else {
        return (entry);
      }
    };

    _getEntryColor = function(entry) {
      // console.log("get color "+ entry.getColor() + " of " + entry.itemText );
      return entry.getColor();
    };

    _init();
};


MoInVis.Paracoords.entryStore.baseCtor = MoInVis.Paracoords.tab;
