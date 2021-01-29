var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.handler = MoInVis.Paracoords.handler || {};

MoInVis.Paracoords.handler.main = function () {
    // CRITICAL: Restrict browser from handling scrolling for overflow.
    document.body.style.overflow = 'hidden';
    // CRITICAL: Restrict browser from handling touch gestures for things like browser refresh, next tab, previous tab.
    document.body.style.touchAction = 'none';

    var height = window.innerHeight - 20,
        width = window.innerWidth - 20;

    MoInVis.Paracoords.handler.moin = new MoInVis.Paracoords.moin( width, height );
}();
