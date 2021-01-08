var HammerTrial = HammerTrial || {};

HammerTrial.main = function () {

    // Create parent SVG
    var _svgParent = document.createElementNS( "http://www.w3.org/2000/svg", "svg" ),
        _parentGroup, _eventCatcher, _hammerMan,
        _text,
        _velocity = 1.5,
        _height, _width,
        _id = 'HammerTrials',
        _setText = function ( text, event ) {
            console.log( text );
            if ( event ) {
                console.log( 'Velocity: ' + event.velocity );
            }
            _text.text( text );
        };
    _svgParent.setAttributeNS( null, 'width', '100%' );
    _svgParent.setAttributeNS( null, 'height', '100%' );
    _svgParent.setAttributeNS( null, 'id', _id + _id + '_SVG' );
    _svgParent.style.touchAction = 'none';

    var defs = document.createElementNS( 'http://www.w3.org/2000/svg', 'defs' );
    defs.setAttributeNS( null, 'id', _id + '_Defs' );
    _svgParent.appendChild( defs );

    _height = window.innerHeight - 20;
    _width = window.innerWidth;

    var mainDiv = document.getElementById( 'mainDiv' );
    mainDiv.style.height = _height + 'px';
    mainDiv.appendChild( _svgParent );

    _parentGroup = d3.select( _svgParent )
        .append( 'g' )
        .attr( 'id', _id + '_ParentGrp' );

    _eventCatcher = _parentGroup
        .append( 'rect' )
        .attr( 'id', _id + '_EventCatcher' )
        .attr( 'x', 0 )
        .attr( 'y', 0 )
        .attr( 'height', _height )
        .attr( 'width', _width )
        .attr( 'stroke', 'red' )
        .attr( 'stroke-width', '1' )
        //.attr( 'opacity', 0 )
        .attr( 'fill', 'black' );
    _text = _parentGroup
        .append( 'text' )
        .attr( 'class', 'attrNameText' )
        .attr( 'transform', 'translate(' + ( _width / 2 ) + ',' + ( _height / 2 ) + ')' )
        .attr( 'text-anchor', "middle" )
        .text( 'EventCatcher' );



    //new Hammer( _eventCatcher.node() )
    //    .on( "pan", function ( event ) {
    //        event.preventDefault();
    //        _setText( 'swipeup' );
    //        _swipeUp();
    //        alert( 'Swipe' );
    //    } )
    //    .on( "swipedown", function ( event ) {
    //        _setText( 'swipedown' );
    //        _swipeDown();
    //        alert( 'Swipe down' );
    //    } )
    //    .on( "tap", function ( event ) {
    //        _setText( 'tap' );
    //        _swipeDown();
    //        alert( 'tap' );
    //    } );

    //_hammerMan = new Hammer.Manager( _paracoordHolder.node() );

    //// Recognizer for Pan event. Parameters: Event name, number of pointers, direction to be recognized, Amount of pan required before event is fired.
    //_hammerMan.add( new Hammer.Swipe( { event: 'swipeleft', pointers: 1} ) );
    //_hammerMan.on( 'swipeleft', function ( event ) {
    //    event.preventDefault();
    //    _setText( 'swipeup' );
    //    _swipeUp();
    //    alert( 'swipeup' );
    //} );

    _hammerMan = new Hammer.Manager( _parentGroup.node() );

    _hammerMan.add( new Hammer.Swipe( { event: 'swipeup', pointers: 1, direction: Hammer.DIRECTION_UP, velocity: _velocity } ) );
    _hammerMan.add( new Hammer.Swipe( { event: 'swipeleft', pointers: 1, direction: Hammer.DIRECTION_LEFT, velocity: _velocity } ) );
    _hammerMan.add( new Hammer.Swipe( { event: 'swipedown', pointers: 1, direction: Hammer.DIRECTION_DOWN, velocity: _velocity } ) );
    _hammerMan.add( new Hammer.Swipe( { event: 'swiperight', pointers: 1, direction: Hammer.DIRECTION_RIGHT, velocity: _velocity } ) );
    _hammerMan
        .on( 'swipeup', function ( event ) {
            _setText( 'swipeup', event );
        event.preventDefault();
        } )
        .on( 'swipeleft', function ( event ) {
            _setText( 'swipeleft', event );
            event.preventDefault();
        } )
        .on( 'swipedown', function ( event ) {
            _setText( 'swipedown', event );
            event.preventDefault();
        } )
        .on( 'swiperight', function ( event ) {
            _setText( 'swiperight', event );
            event.preventDefault();
        } );
    //    .on( 'pan', function ( event ) {
    //    _setText( 'pan' );
    //    event.preventDefault();
    //} );


    //_hammerMan.on( 'panstart', function ( event ) {
    //    _setText( 'panstart' );
    //    event.preventDefault();
    //} ).on( 'pan', function ( event ) {
    //    _setText( 'pan' );
    //    event.preventDefault();
    //} ).on( 'panend', function ( event ) {
    //    var veloX = Math.abs( event.overallVelocityX ), veloY = Math.abs( event.overallVelocityY ), distance;
    //    _setText( 'panend' );
    //    //alert( 'panend' );
    //    //alert( 'panend' );
    //    if ( veloY > veloX ) {
    //        distance = Math.abs( event.deltaY );
    //        if ( veloY > 0.4 && distance > 10 ) {
    //            if ( event.deltaY > 0 ) {
    //                _setText( '_swipeDown' );
    //            } else {
    //                _setText( '_swipeUp' );
    //            }
    //            console.log( 'veloY: ', veloY );
    //        }
    //    } else {

    //    }
    //} );
}();
