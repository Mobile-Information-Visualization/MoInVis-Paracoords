/*
*
* Descr.: Tab Manager. Manages positions of tabs and transitions between tabs.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.tabManager = function ( moin, tabHandlers, startTabIndex ) {
    // Private variables.
    var self = this,
        _moin = moin,
        _currentTabIndex = startTabIndex,
        _tabHandlers = tabHandlers,

        _init = function () {
            var i, length = _tabHandlers.length, tab;
            for ( i = 0; i < length; i++ ) {
                // Set tab styling to handle absolute positioning.
                tab = _tabHandlers[i].parentTab
                    .style( 'height', _moin.height + 'px' )
                    .style( 'width', _moin.width + 'px' )
                    .style( 'position', 'fixed' );
                // Position tabs.
                if ( i < _currentTabIndex ) {
                    tab.style( 'left', - 1.5 * _moin.width + 'px' );
                } else if ( i > _currentTabIndex ) {
                    tab.style( 'left', 1.5 * _moin.width + 'px' );
                }
            }
        };

    this.swipeUp = function () {

    };

    this.swipeDown = function () {

    };

    this.swipeLeft = function () {
        if ( _currentTabIndex < _tabHandlers.length - 1 ) {
            // Switch off events for old tab
            _tabHandlers[_currentTabIndex].switchOffEvents();
            _tabHandlers[_currentTabIndex].parentTab
                .transition()
                .duration( MoInVis.Paracoords.TransitionSpeed )
                .style( 'left', -1.5 * _moin.width + 'px' );
            _currentTabIndex++;
            _tabHandlers[_currentTabIndex].parentTab
                .style( 'left', 1.5 * _moin.width + 'px' )
                .transition()
                .duration( MoInVis.Paracoords.TransitionSpeed )
                .style( 'left', '0px' );
            // Switch on events for new tab
            _tabHandlers[_currentTabIndex].switchOnEvents();

        }
    };

    this.swipeRight = function () {
        if ( _currentTabIndex > 0 ) {
            // Switch off events for old tab
            _tabHandlers[_currentTabIndex].switchOffEvents();
            _tabHandlers[_currentTabIndex].parentTab
                .transition()
                .duration( MoInVis.Paracoords.TransitionSpeed )
                .style( 'left', 1.5 * _moin.width + 'px' );
            _currentTabIndex--;
            _tabHandlers[_currentTabIndex].parentTab
                .style( 'left', -1.5 * _moin.width + 'px' )
                .transition()
                .duration( MoInVis.Paracoords.TransitionSpeed )
                /* Jimmy: Why set left to 0 px */
                .style( 'left', '0px' );
            // Switch on events for new tab
            _tabHandlers[_currentTabIndex].switchOnEvents();
        }
    };


    // Error handling for _currentTabIndex
    if ( _currentTabIndex >= _tabHandlers.length ) {
        _currentTabIndex = _tabHandlers.length - 1;
    }

    _init();
    _tabHandlers[_currentTabIndex].switchOnEvents();
};
