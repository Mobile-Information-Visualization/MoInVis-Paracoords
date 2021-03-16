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
                event: 'swipeup', pointers: 1, direction: Hammer.DIRECTION_UP, velocity: _hammerSettings.swipeVelocity
            } ) );
            _hammerMan.add( new Hammer.Swipe( {
                event: 'swipedown', pointers: 1, direction: Hammer.DIRECTION_DOWN, velocity: _hammerSettings.swipeVelocity
            } ) );
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
    this.initVue = function ( vueData, vueMethods ) {
        var mainApp =
            Vue.createApp( {
                data: function () {
                    return vueData;
                },
                methods: vueMethods || {}
            } ),
            dataProxy = mainApp.mount( _tabHandle.parentTab.node() );
        return { mainApp, dataProxy };
    };

    this.swipeRight = function () {
        this.moin.tabManager.swipeRight();
    };

    this.swipeLeft = function () {
        this.moin.tabManager.swipeLeft();
    };

    this.swipeUp = function () {
        // Method to be overridden in derived class.
        console.log( 'Override this method in derived class' );
    };

    this.swipeDown = function () {
        // Method to be overridden in derived class.
        console.log( 'Override this method in derived class' );
    };

    this.activateEvent = function ( eventName ) {
        if ( _activeEvents.indexOf( eventName ) === -1 ) {
            _activeEvents.push( eventName );
        }
    };

    this.switchOnSwipeUpEvent = function () {
        _hammerMan
            .on( 'swipeup', function ( event ) {
                event.preventDefault();
                if ( self.isEventHandlingInProgress() === false ) {
                    _setText( 'swipeup', event );
                    self.swipeUp();
                }
            } );
    };
    this.switchOnSwipeDownEvent = function () {
        _hammerMan
            .on( 'swipedown', function ( event ) {
                event.preventDefault();
                if ( self.isEventHandlingInProgress() === false ) {
                    _setText( 'swipedown', event );
                    self.swipeDown();
                }
            } );
    };
    this.switchOnSwipeLeftEvent = function () {
        _hammerMan
            .on( 'swipeleft', function ( event ) {
                event.preventDefault();
                if ( self.isEventHandlingInProgress() === false ) {
                    _setText( 'swipeleft', event );
                    self.swipeLeft();
                }
            } )
    };
    this.switchOnSwipeRightEvent = function () {
        _hammerMan
            .on( 'swiperight', function ( event ) {
                event.preventDefault();
                if ( self.isEventHandlingInProgress() === false ) {
                    _setText( 'swiperight', event );
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

    this.switchOnEvents = function () {
        let evt;
        if ( _activeEvents.indexOf( 'swipeup' ) > -1 ) {
            this.switchOnSwipeUpEvent();
        }
        if ( _activeEvents.indexOf( 'swipedown' ) > -1 ) {
            this.switchOnSwipeDownEvent();
        }
        if ( _activeEvents.indexOf( 'swipeleft' ) > -1 ) {
            this.switchOnSwipeLeftEvent();
        }
        if ( _activeEvents.indexOf( 'swiperight' ) > -1 ) {
            this.switchOnSwipeRightEvent();
        }
        for ( evt in _addedEvents ) {
            if ( _activeEvents.indexOf( evt ) > -1 ) {
                _hammerMan.on( evt, _addedEvents[evt] );
            }
        }
    };

    this.switchOffEvents = function ( onlySwipeEvents = false ) {
        _hammerMan
            .off( 'swipeup' )
            .off( 'swipeleft' )
            .off( 'swiperight' )
            .off( 'swipedown' );
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
