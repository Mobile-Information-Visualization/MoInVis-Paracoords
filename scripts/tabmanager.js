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
        _tabIndicators = [],
        _tabIndicatorDiv,
        _tabIndicatorSize = 40,
        _inactiveTabIndicatorOpacity = 0.25,
        _afterTransition = function () {
            _tabIndicatorDiv.style( 'display', 'none' );
        },

        _init = function () {
            var i, length = _tabHandlers.length, tab;

            // Creates the tab indicators
            _tabIndicatorDiv = d3.select( '#mainDiv' )
                .append( 'div' )
                .attr( 'id', moin.id + '_TabIndicatorParent' )
                .style( 'width', _moin.width + 'px' )
                .style( 'position', 'fixed' )
                .style( 'left', (_moin.width / 2 - length * _tabIndicatorSize) + 'px' )
                .style( 'display', 'none' );

            for ( i = 0; i < length; i++ ) {
                // Set tab styling to handle absolute positioning.
                tab = _tabHandlers[i].parentTab
                    .style( 'height', _moin.height + 'px' )
                    .style( 'width', _moin.width + 'px' )
                    .style( 'position', 'fixed' );

                _tabIndicators.push( _tabIndicatorDiv
                    .append( 'div' )
                    .attr( 'id', moin.id + '_TabIndicator_' + i )
                    .style( 'height', _tabIndicatorSize + 'px' )
                    .style( 'width', _tabIndicatorSize + 'px' )
                    .style( 'border-radius', _tabIndicatorSize + 'px' )
                    .style( 'background', '#fcfcfc' )
                    .style( 'float', 'left' )
                    .style( 'opacity', _inactiveTabIndicatorOpacity )
                    .style( 'position', 'relative' )
                    .style( 'margin', ( _tabIndicatorSize / 2 ) + 'px' ) );

                // Position tabs.
                if ( i < _currentTabIndex ) {
                    tab.style( 'left', - 1.5 * _moin.width + 'px' );
                } else if ( i > _currentTabIndex ) {
                    tab.style( 'left', 1.5 * _moin.width + 'px' );
                } else {
                    _tabIndicators[i].style( 'opacity', 1 );
                }
            }
        };

    this.swipeUp = function () {

    };

    this.swipeDown = function () {

    };

    this.swipeLeft = function () {
        if ( _currentTabIndex < _tabHandlers.length - 1 ) {
            // Show the tab indicators
            _tabIndicatorDiv.style( 'display', 'inherit' );
            // Deactivate the current tab indicator
            _tabIndicators[_currentTabIndex].style( 'opacity', _inactiveTabIndicatorOpacity );

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
                .style( 'left', '0px' )
                .on( 'end', _afterTransition );
            // Switch on events for new tab
            _tabHandlers[_currentTabIndex].switchOnEvents();

            // Activate the current tab indicator
            _tabIndicators[_currentTabIndex].style( 'opacity', 1 );
        }
    };

    this.swipeRight = function () {
        if ( _currentTabIndex > 0 ) {
            // Show the tab indicators
            _tabIndicatorDiv.style( 'display', 'inherit' );
            // Deactivate the current tab indicator
            _tabIndicators[_currentTabIndex].style( 'opacity', _inactiveTabIndicatorOpacity );

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
                .style( 'left', '0px' )
                .on( 'end', _afterTransition );
            // Switch on events for new tab
            _tabHandlers[_currentTabIndex].switchOnEvents();

            // Activate the current tab indicator
            _tabIndicators[_currentTabIndex].style( 'opacity', 1 );
        }
    };


    // Error handling for _currentTabIndex
    if ( _currentTabIndex >= _tabHandlers.length ) {
        _currentTabIndex = _tabHandlers.length - 1;
    }

    _init();
    _tabHandlers[_currentTabIndex].switchOnEvents();
};
