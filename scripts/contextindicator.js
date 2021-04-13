var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.contextIndicator = function ( parent, x, y, height, width, id, isTop, cbFunction ) {
    var _height = height,
        _width = width,
        _isTop = isTop,
        _arrowSize = height / 3,
        _arrowCount = 1,
        _arrowGap = 10,
        _arrowX = _width / 2 + _arrowGap / 2,
        // _arrowX = _width / 2 - ( _arrowSize * _arrowCount + _arrowGap * ( _arrowCount - 1 ) ) / 2,
        _arrowY = _isTop ? 0.5 * _height : 0.5 * _height - _arrowSize,
        _xPos = x,
        _yPos = y,
        _id = id,
        _parent = parent,
        _ciSVG,
        _clickableGroup,
        _buttonElementsGroup,
        _conTEXTEl,
        _context = '00',
        _eventCatcher,
        _bgRect,
        _CIRect,
        _CIRectMargin,
        _hammer,
        _transitionSpeed = MoInVis.Paracoords.TransitionSpeed,
        _callback = cbFunction,

        // Hide the context indicator after moving it out if the view.
        _hide = function () {
            _ciSVG.style( 'display', 'none' );
        },

        _init = function () {
            var bBox,
                textBBox;

            // Create group for context indicator and append to parent svg
            _ciSVG = _parent
                .append( 'g' )
                .attr( 'id', _id )
                .attr( 'transform', 'translate(' + _xPos + ',' + _yPos + ')' );

            // Draw the context indicator.
            // Rect handles the gradient
            _bgRect = _ciSVG
                .append( 'rect' )
                .attr( 'id', _id + '_Rect' )
                .attr( 'x', 0 )
                .attr( 'y', 0 )
                .attr( 'width', _width )
                .attr( 'height', _height )
                .attr( 'stroke', 'none' )
                .attr( 'fill', 'url(#' + ( _isTop ? MoInVis.Paracoords.IdStore.TopCIGradNormal : MoInVis.Paracoords.IdStore.BottomCIGradNormal ) + ')' );

            _clickableGroup = _ciSVG
                .append( 'g' )
                .attr( 'id', _id + '_ClickableGroup' )
                .attr( 'cursor', 'pointer' )
                .on( 'pointerdown', function () {
                    _bgRect
                        .attr( 'fill', 'url(#' + ( _isTop ? MoInVis.Paracoords.IdStore.TopCIGradPressed : MoInVis.Paracoords.IdStore.BottomCIGradPressed ) + ')' );
                    _CIRect.attr( 'opacity', 0.75 );
                } )
                .on( 'pointerup', function () {
                    _bgRect
                        .attr( 'fill', 'url(#' + ( _isTop ? MoInVis.Paracoords.IdStore.TopCIGradNormal : MoInVis.Paracoords.IdStore.BottomCIGradNormal ) + ')' );
                    _CIRect.attr( 'opacity', 1 );
                } );

            // Draw event catcher
            _eventCatcher = _clickableGroup
                .append( 'rect' )
                .attr( 'id', _id + '_EventCatcher' )
                .attr( 'fill', 'black' )
                .attr( 'opacity', 0 );

            // Draw background rect of button.
            _CIRect = _clickableGroup
                .append( 'rect' )
                .attr( 'id', _id + '_Rect' )
                .attr( 'class', 'contextIndicatorBox' )
                .attr( 'stroke', 'none' );

            _buttonElementsGroup = _clickableGroup
                .append( 'g' )
                .attr( 'id', _id + '_BtnElementsGroup' );

            // Draw arrow.
            _buttonElementsGroup
                .append( 'path' )
                .attr( 'stroke', 'white' )
                .attr( 'stroke-width', 2 )
                .attr( 'stroke-opacity', 0.7 )
                .attr( 'fill', 'white' )
                .attr( 'd', d3.line()( _createPath() ) );

            // Draw text
            _conTEXTEl = _buttonElementsGroup
                .append( 'text' )
                .attr( 'class', 'CIText' )
                .attr( 'id', _id + '_ConTEXT' )
                .attr( 'transform', 'translate(0,0)' )
                .attr( 'text-anchor', 'end' )
                .text( _context );

            textBBox = _conTEXTEl.node().getBBox();
            _conTEXTEl
                .attr( 'transform', 'translate(' + ( _arrowX - _arrowGap ) + ',' + ( _arrowY + _arrowSize / 2 + 0.35 * textBBox.height ) + ')' );

            bBox = _buttonElementsGroup.node().getBBox();
            _CIRectMargin = { vertical: 11, horizontal: 22 }; // space between box and its label

            _CIRect
                .attr( 'x', bBox.x - _CIRectMargin.horizontal )
                .attr( 'y', bBox.y - _CIRectMargin.vertical )
                .attr( 'width', bBox.width + 2 * _CIRectMargin.horizontal )
                .attr( 'height', bBox.height + 2 * _CIRectMargin.vertical )
                .attr( 'rx', bBox.width / 3 );

            _eventCatcher
                .attr( 'x', bBox.x - _CIRectMargin.horizontal - bBox.width / 2 )
                .attr( 'y', bBox.y - _CIRectMargin.vertical - bBox.height / 2 )
                .attr( 'width', 2 * ( bBox.width + _CIRectMargin.horizontal ) )
                .attr( 'height', 2 * ( bBox.height + _CIRectMargin.vertical ) );


            // Initialize hammer events.
            _hammer = new Hammer( _clickableGroup.node() );
            _hammer.get( 'doubletap' ).set( { posThreshold: 50, interval: 500 } );
            _hammer.on( 'tap', _onTap );
            _hammer.on( 'doubletap', _onDoubleTap );
        },

        // Creates path for the arrows.
        _createPath = function () {
            var path = [];
            if ( _isTop ) {
                path.push( [_arrowX, _arrowSize + _arrowY] );
                path.push( [_arrowX + _arrowSize * 0.5, _arrowY] );
                path.push( [_arrowX + _arrowSize, _arrowSize + _arrowY] );
            } else {
                path.push( [_arrowX, _arrowY] );
                path.push( [_arrowX + _arrowSize * 0.5, _arrowSize + _arrowY] );
                path.push( [_arrowX + _arrowSize, _arrowY] );
            }
            return path;
        },
        //_createPath = function ( arrowNumber ) {
        //    var path = [], arrowX = _arrowX + arrowNumber * ( _arrowSize + _arrowGap );
        //    if ( _isTop ) {
        //        path.push( [arrowX, _arrowSize + _arrowY] );
        //        path.push( [arrowX + _arrowSize * 0.5, _arrowY] );
        //        path.push( [arrowX + _arrowSize, _arrowSize + _arrowY] );
        //    } else {
        //        path.push( [arrowX, _arrowY] );
        //        path.push( [arrowX + _arrowSize * 0.5, _arrowSize + _arrowY] );
        //        path.push( [arrowX + _arrowSize, _arrowY] );
        //    }
        //    return path;
        //},

        // Handles the tap event.
        _onTap = function ( event ) {
            event.preventDefault();
            _callback();
        },

        // Handles the double tap event.
        _onDoubleTap = function ( event ) {
            event.preventDefault();
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

    this.setContextText = function ( text ) {
        text = text.toString();
        _conTEXTEl
            .text( text );
        if ( text.length !== _context.length ) {
            bBox = _buttonElementsGroup.node().getBBox();
            // Please don't use .transition() here,
            // cause it leads to problems in Safari browser on macOS and iOS!
            // (Seems to be a bug of Safari.)
            _CIRect
                .attr( 'x', bBox.x - _CIRectMargin.horizontal )
                .attr( 'width', bBox.width + 2 * _CIRectMargin.horizontal );
            _eventCatcher
                .attr( 'x', bBox.x - _CIRectMargin.horizontal - bBox.width / 2 )
                .attr( 'y', bBox.y - _CIRectMargin.vertical - bBox.height / 2 )
                .attr( 'width', 2 * ( bBox.width + _CIRectMargin.horizontal ) )
                .attr( 'height', 2 * ( bBox.height + _CIRectMargin.vertical ) );
        }
        _context = text;
    };

    this.reposition = function ( x, y ) {
        _xPos = x;
        _yPos = y;
        if ( this.visible ) {
            _ciSVG.attr( 'transform', 'translate(' + _xPos + ',' + _yPos + ')' );
        }
    };

    _init();
};
