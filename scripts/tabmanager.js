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
        _overlayTabs = [],
        _overlayTabActive = false,
        _overlayTab = null,
        _tabIndicators = [],
        _tabIndicatorDiv,
        _tabIndicatorSize = 40,
        _inactiveTabIndicatorOpacity = 0.25,
        _afterTransition = function () {
            _tabIndicatorDiv.style( 'display', 'none' );
        },
        _afterOverlayDeactivation = function () {
            _overlayTab.parentTab.style( 'display', 'none' );
            _overlayTab = null;
        },

        _setTabStyle = function ( tab ) {
            tab
                .style( 'height', _moin.height + 'px' )
                .style( 'width', _moin.width + 'px' )
                .style( 'position', 'fixed' );
        },

        _init = function () {
            var i, length = _tabHandlers.length, tab;

            // Creates the tab indicators
            _tabIndicatorDiv = d3.select( '#mainDiv' )
                .append( 'div' )
                .attr( 'id', moin.id + '_TabIndicatorParent' )
                .style( 'width', _moin.width + 'px' )
                .style( 'position', 'fixed' )
                .style( 'left', ( _moin.width / 2 - length * _tabIndicatorSize ) + 'px' )
                .style( 'top', '3%' )
                .style( 'opacity', 0 );
            _tabIndicatorDiv
                .transition()
                .duration( 2500 )
                .style( 'opacity', 1 )
                .style( 'top', '0%' )
                .on( 'end', _afterTransition );

            for ( i = 0; i < length; i++ ) {
                // Set tab styling to handle absolute positioning.
                tab = _tabHandlers[i].parentTab;

                _setTabStyle( tab );

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

    this.addOverlayTab = function ( tabHandler ) {
        tabHandler.setId( _overlayTabs.length );
        _overlayTabs.push( tabHandler );
        _setTabStyle( tabHandler.parentTab );
        tabHandler.parentTab.style( 'top', 1 * _moin.height + 'px' );
    };

    this.activateOverlayTab = function ( tabId ) {
        _overlayTab = _overlayTabs[tabId];
        // Switch off events for current tab
        _tabHandlers[_currentTabIndex].switchOffEvents();
        _overlayTab.parentTab
            .style( 'display', 'inherit' )
            .style( 'top', 1 * _moin.height + 'px' )
            .transition()
            .duration( MoInVis.Paracoords.OverlayTransitionSpeed )
            .ease( d3.easeCubicOut )
            .style( 'top', '3vw' );
        _overlayTabActive = true;
    };

    this.deactivateOverlayTab = function () {
        if ( _overlayTab ) {
            _overlayTab.parentTab
                .transition()
                .duration( MoInVis.Paracoords.OverlayTransitionSpeed )
                .style( 'top', 1 * _moin.height + 'px' )
                .on( 'end', _afterOverlayDeactivation );
            _overlayTabActive = false;
            _tabHandlers[_currentTabIndex].switchOnEvents();
        }
    };

    this.resize = function () {
        var i, length = _tabHandlers.length, tab;

        // Creates the tab indicators
        _tabIndicatorDiv
            .style( 'width', _moin.width + 'px' )
            .style( 'left', ( _moin.width / 2 - length * _tabIndicatorSize ) + 'px' );

        for ( i = 0; i < length; i++ ) {
            // Set tab styling to handle absolute positioning.
            tab = _tabHandlers[i].parentTab;
            _setTabStyle( tab );
            // Position tabs.
            if ( i < _currentTabIndex ) {
                tab.style( 'left', - 1.5 * _moin.width + 'px' );
            } else if ( i > _currentTabIndex ) {
                tab.style( 'left', 1.5 * _moin.width + 'px' );
            }
        }
        length = _overlayTabs.length;
        for ( i = 0; i < length; i++ ) {
            // Set tab styling to handle absolute positioning.
            tab = _overlayTabs[i].parentTab;
            _setTabStyle( tab );
            if ( _overlayTabActive === false || _overlayTab !== _overlayTabs[i] ) {
                tab.style( 'top', 1 * _moin.height + 'px' );
            }
        }
    };

    this.swipeUp = function () {

    };

    this.swipeDown = function () {

    };

    this.swipeLeft = function () {
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
        if ( _currentTabIndex > _tabHandlers.length - 1 ) {
            _currentTabIndex = 0;
        }
        _tabHandlers[_currentTabIndex].parentTab
            .style( 'left', 1.5 * _moin.width + 'px' )
            .transition()
            .duration( MoInVis.Paracoords.TransitionSpeed )
            .style( 'left', '0px' )
            .on( 'end', _afterTransition );
        // Switch on events for new tab
        _tabHandlers[_currentTabIndex].switchOnEvents();
        _tabHandlers[_currentTabIndex].onTabInFocus();

        // Activate the current tab indicator
        _tabIndicators[_currentTabIndex].style( 'opacity', 1 );
    };

    this.swipeRight = function () {
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
        if ( _currentTabIndex < 0 ) {
            _currentTabIndex = _tabHandlers.length - 1;
        }
        _tabHandlers[_currentTabIndex].parentTab
            .style( 'left', -1.5 * _moin.width + 'px' )
            .transition()
            .duration( MoInVis.Paracoords.TransitionSpeed )
            .style( 'left', '0px' )
            .on( 'end', _afterTransition );
        // Switch on events for new tab
        _tabHandlers[_currentTabIndex].switchOnEvents();
        _tabHandlers[_currentTabIndex].onTabInFocus();

        // Activate the current tab indicator
        _tabIndicators[_currentTabIndex].style( 'opacity', 1 );
    };


    // Error handling for _currentTabIndex
    if ( _currentTabIndex >= _tabHandlers.length ) {
        _currentTabIndex = _tabHandlers.length - 1;
    }

    _init();
    _tabHandlers[_currentTabIndex].switchOnEvents();
};
