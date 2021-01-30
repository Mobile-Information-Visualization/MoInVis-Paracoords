var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.parentSvg = 'ParaCoordContainerSVG';
MoInVis.Paracoords.IdStore.defs = 'MoInVisParaCoordDefs';

MoInVis.Paracoords.attributeStore = function ( moin, parentDiv, axes ) {

    var self = this,
        _parentDiv = parentDiv,
        _moin = moin,
        _axes = axes,
        _tabHandle,
        _hammerMan,
        _hammerSettings = MoInVis.Paracoords.HammerSettings,

        // Method for dubugging purposes.
        _setText = function ( text, event ) {
            console.log( text );
            if ( event ) {
                console.log( 'Velocity: ' + event.velocity );
            }
        },

        _swipeRight = function () {
            _moin.tabManager.swipeRight();
        },

        _swipeLeft = function () {
            _moin.tabManager.swipeLeft();
        },

        _init = function () {
            _initHammer();
            _initVue();
        },

        _initHammer = function () {
            _hammerMan = new Hammer.Manager( _parentDiv.node() );
            //_hammerMan.add( new Hammer.Swipe( {
            //    event: 'swipeup', pointers: 1, direction: Hammer.DIRECTION_UP, velocity: _hammerSettings.swipeVelocity
            //} ) );
            //_hammerMan.add( new Hammer.Swipe( {
            //    event: 'swipedown', pointers: 1, direction: Hammer.DIRECTION_DOWN, velocity: _hammerSettings.swipeVelocity
            //} ) );
            _hammerMan.add( new Hammer.Swipe( {
                event: 'swipeleft', pointers: 1, direction: Hammer.DIRECTION_LEFT, velocity: _hammerSettings.swipeVelocity
            } ) );
            _hammerMan.add( new Hammer.Swipe( {
                event: 'swiperight', pointers: 1, direction: Hammer.DIRECTION_RIGHT, velocity: _hammerSettings.swipeVelocity
            } ) );
        },

        // Instantiate the Vue app here.
        _initVue = function () {
            var mainApp =
                Vue.createApp( {
                    data: function () {
                        return {
                            tabName: 'I am the Attribute Store!'
                        };
                    }
                } );
            mainApp.mount( _parentDiv.node() );
        };

    this.switchOnEvents = function () {
        _hammerMan
            //.on( 'swipeup', function ( event ) {
            //    _setText( 'swipeup', event );
            //    event.preventDefault();
            //    _swipeUp();
            //} )
            //.on( 'swipedown', function ( event ) {
            //    _setText( 'swipedown', event );
            //    event.preventDefault();
            //    _swipeDown();
            //} )
            .on( 'swipeleft', function ( event ) {
                _setText( 'swipeleft', event );
                event.preventDefault();
                _swipeLeft();
            } )
            .on( 'swiperight', function ( event ) {
                _setText( 'swiperight', event );
                event.preventDefault();
                _swipeRight();

            } );
    };

    this.switchOffEvents = function () {
        _hammerMan
            .off( 'swipeup' )
            .off( 'swipeleft' )
            .off( 'swiperight' )
            .off( 'swipedown' );
    };

    this.getTabHandle = function () {
        if ( _tabHandle === undefined ) {
            _tabHandle = {
                parentTab: _parentDiv,
                switchOnEvents: this.switchOnEvents.bind( this ),
                switchOffEvents: this.switchOffEvents.bind( this )
            };
        }
        return _tabHandle;
    };

    _init();
};
