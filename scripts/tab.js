/*
*
* Descr.: Base class for tabs. 
*         Event handling, provides an interface for tabmanager.
* 
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.tab = function ( parentDiv ) {

    var self = this,
        _tabHandle,
        _hammerMan,
        _hammerHelper,
        _hammerSettings = MoInVis.Paracoords.HammerSettings,
        _activeEvents = [],
        _addedEvents = {},

        // Method for dubugging purposes.
        _setText = function ( text, event ) {
            console.log( text );

            if ( event ) {
                console.log( 'Velocity: ' + event.velocity );
            }
        },

        _init = function () {
            _initHammer();
        },

        _initHammer = function () {
            _hammerMan = new Hammer.Manager( _tabHandle.parentTab.node() );
            _hammerMan.add( new Hammer.Swipe( {
                event: 'swipeleft', pointers: 1, direction: Hammer.DIRECTION_LEFT, velocity: _hammerSettings.swipeVelocity
            } ) );
            _hammerMan.add( new Hammer.Swipe( {
                event: 'swiperight', pointers: 1, direction: Hammer.DIRECTION_RIGHT, velocity: _hammerSettings.swipeVelocity
            } ) );

            self.activateEvent( 'swipeleft' );
            self.activateEvent( 'swiperight' );
        };

    // Instantiate the Vue app here.

    this.initVue = function ( vueData, vueMethods, vueComputed, vueComponents ) {
        var mainApp =
            Vue.createApp( {

                data: function () {
                    return vueData;
                },
                methods: vueMethods || {},
                computed: vueComputed || {}
            } );

        if ( vueComponents ) {
            for ( componentName in vueComponents ) {
                mainApp.component( componentName, vueComponents[componentName] );
            }
        }
        dataProxy = mainApp.mount( _tabHandle.parentTab.node() );
        return { mainApp, dataProxy };
    };

    this.addSwipeHelper = function ( helperEl ) {
        _hammerHelper = new Hammer.Manager( helperEl );
        _hammerHelper.add( new Hammer.Swipe( {
            event: 'swipeleft', pointers: 1, direction: Hammer.DIRECTION_LEFT, velocity: _hammerSettings.swipeVelocity
        } ) );
        _hammerHelper.add( new Hammer.Swipe( {
            event: 'swiperight', pointers: 1, direction: Hammer.DIRECTION_RIGHT, velocity: _hammerSettings.swipeVelocity
        } ) );
    };

    this.swipeRight = function () {
        this.moin.tabManager.swipeRight();
    };

    this.swipeLeft = function () {
        this.moin.tabManager.swipeLeft();
    };

    this.activateEvent = function ( eventName ) {
        if ( _activeEvents.indexOf( eventName ) === -1 ) {
            _activeEvents.push( eventName );
        }
    };

    this.switchOnSwipeLeftEvent = function () {
        _hammerMan
            .on( 'swipeleft', function ( event ) {
                event.preventDefault();
                if ( self.isEventHandlingInProgress() === false ) {
                    // _setText( 'swipeleft', event );
                    self.swipeLeft();
                }
            } );

    };

    this.switchOnSwipeRightEvent = function () {
        _hammerMan
            .on( 'swiperight', function ( event ) {
                event.preventDefault();
                if ( self.isEventHandlingInProgress() === false ) {
                    // _setText( 'swiperight', event );
                    self.swipeRight();
                }
            } );
    };

    this.addEventType = function ( eventType, eventProps ) {
        _hammerMan.add( new Hammer[eventType]( eventProps ) );
    };

    this.addEvent = function ( event, cb ) {
        _addedEvents[event] = cb;
        this.activateEvent( event );
    };

    this.stopEvent = function () {
        _hammerMan.stop( true );
    };

    this.switchOnEvents = function ( onlySwipeEvents = false ) {
        let evt;
        if ( _activeEvents.indexOf( 'swipeleft' ) > -1 ) {
            this.switchOnSwipeLeftEvent();
        }
        if ( _activeEvents.indexOf( 'swiperight' ) > -1 ) {
            this.switchOnSwipeRightEvent();
        }
        if ( !onlySwipeEvents ) {
            for ( evt in _addedEvents ) {
                if ( _activeEvents.indexOf( evt ) > -1 ) {
                    _hammerMan.on( evt, _addedEvents[evt] );
                }
            }
        }
    };

    this.switchOffEvents = function ( onlySwipeEvents = false ) {
        _hammerMan
            .off( 'swipeleft' )
            .off( 'swiperight' );
        if ( !onlySwipeEvents ) {
            for ( evt in _addedEvents ) {
                _hammerMan.off( evt );
            }
        }
    };

    // Override in tab child class to use. returns false by default.
    this.isEventHandlingInProgress = function () {
        return false;
    };

    this.getTabHandle = function () {
        return _tabHandle;
    };

    // Called whenever this tab comes into focus.
    this.onTabInFocus = function () {
        if ( this.onTabFocus ) {
            this.onTabFocus();
        }
    };

    _tabHandle = {
        parentTab: parentDiv,
        switchOnEvents: this.switchOnEvents.bind( this ),
        switchOffEvents: this.switchOffEvents.bind( this ),
        onTabInFocus: this.onTabInFocus.bind( this )
    };

    _init();
};
