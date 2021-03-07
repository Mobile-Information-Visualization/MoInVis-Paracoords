var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.contextIndicator = function ( parent, x, y, height, width, id, isTop, cbFunction ) {
    var _height = height,
        _width = width,
        _isTop = isTop,
        _arrowSize = height / 4,
        _arrowCount = 3,
        _arrowGap = 10,
        _arrowX = _width / 2 - ( _arrowSize * _arrowCount + _arrowGap * ( _arrowCount - 1 ) ) / 2,
        _arrowY = _isTop ? 0.25 * _height : 0.75 * _height - _arrowSize,
        _xPos = x,
        _yPos = y,
        _id = id,
        _parent = parent,
        _ciSVG,
        _rect,
        _hammer,
        _transitionSpeed = MoInVis.Paracoords.TransitionSpeed,
        _callback = cbFunction,

        // Hide the context indicator after moving it out if the view.
        _hide = function () {
            _ciSVG.style( 'display', 'none' );
        },

        _init = function () {
            var i;
            // Create group for context indicator and append to parent svg
            _ciSVG = _parent
                .append( 'g' )
                .attr( 'id', _id )
                .attr( 'transform', 'translate(' + _xPos + ',' + _yPos + ')' )
                .attr( 'cursor', 'pointer' )
                .on( 'pointerdown', function () {
                    _rect
                        .attr( 'fill', 'url(#' + ( _isTop ? MoInVis.Paracoords.IdStore.TopCIGradPressed : MoInVis.Paracoords.IdStore.BottomCIGradPressed ) + ')' );
                } )
                .on( 'pointerup', function () {
                    _rect
                        .attr( 'fill', 'url(#' + ( _isTop ? MoInVis.Paracoords.IdStore.TopCIGradNormal : MoInVis.Paracoords.IdStore.BottomCIGradNormal ) + ')' );
                } );

            // Initialize hammer events.
            _hammer = new Hammer( _ciSVG.node() );
            _hammer.get( 'doubletap' ).set( { posThreshold: 50, interval: 500 } );
            _hammer.on( 'tap', _onTap );
            _hammer.on( 'doubletap', _onDoubleTap );

            // Draw the context indicator.
            // Rect handles the gradient
            _rect = _ciSVG
                .append( 'rect' )
                .attr( 'id', _id + '_Rect' )
                .attr( 'x', 0 )
                .attr( 'y', 0 )
                .attr( 'width', _width )
                .attr( 'height', _height )
                .attr( 'stroke', 'none' )
                .attr( 'fill', 'url(#' + ( _isTop ? MoInVis.Paracoords.IdStore.TopCIGradNormal : MoInVis.Paracoords.IdStore.BottomCIGradNormal ) + ')' );

            // Draw arrows.
            for ( i = 0; i < _arrowCount; i++ ) {
                _ciSVG
                    .append( 'path' )
                    .attr( 'stroke', 'white' )
                    .attr( 'stroke-width', 2 )
                    .attr( 'stroke-opacity', 0.7 )
                    .attr( 'fill', 'none' )
                    .attr( 'd', d3.line()( _createPath( i ) ) );
            }
        },

        // Creates path for the arrows.
        _createPath = function ( arrowNumber ) {
            var path = [], arrowX = _arrowX + arrowNumber * ( _arrowSize + _arrowGap );
            if ( _isTop ) {
                path.push( [arrowX, _arrowSize + _arrowY] );
                path.push( [arrowX + _arrowSize * 0.5, _arrowY] );
                path.push( [arrowX + _arrowSize, _arrowSize + _arrowY] );
            } else {
                path.push( [arrowX, _arrowY] );
                path.push( [arrowX + _arrowSize * 0.5, _arrowSize + _arrowY] );
                path.push( [arrowX + _arrowSize, _arrowY] );
            }
            return path;
        },

        // Handles the tap event.
        _onTap = function () {
            _callback();
        },

        // Handles the double tap event.
        _onDoubleTap = function () {
            _callback( true );
        };

    this.visible = true;

    // Hanldes changes in visibility.
    this.setVisibility = function ( visibility ) {
        if ( this.visible = visibility ) {
            // Move indicators in when true.
            _ciSVG
                .style( 'display', 'inherit' )
                .transition()
                .duration( _transitionSpeed )
                .ease( d3.easeCubicOut )
                .attr( 'transform', 'translate(' + _xPos + ',' + _yPos + ')' );
        } else {
            // Move indicators out and then change display to none.
            if ( _isTop ) {
                _ciSVG
                    .transition()
                    .duration( _transitionSpeed )
                    .ease( d3.easeCubicOut )
                    .attr( 'transform', 'translate(' + _xPos + ',' + ( _yPos - 2 * _height ) + ')' )
                    .on( 'end', _hide );
            } else {
                _ciSVG
                    .transition()
                    .duration( _transitionSpeed )
                    .ease( d3.easeCubicOut )
                    .attr( 'transform', 'translate(' + _xPos + ',' + ( _yPos + 2 * _height ) + ')' )
                    .on( 'end', _hide );
            }
        }
    };

    _init();
};