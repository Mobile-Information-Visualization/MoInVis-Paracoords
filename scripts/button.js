var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.buttonClass = 'button';
MoInVis.Paracoords.IdStore.buttonHover = 'onHover';
MoInVis.Paracoords.IdStore.buttonPressed = 'onPressed';

MoInVis.Paracoords.button = function ( parent, x, y, size, id, isTop, cbFunction ) {
    var _size = size,
        _xPos = x,
        _yPos = y,
        _id = id,
        _parent = parent,
        _buttonSVG,
        _rect,
        _transitionSpeed = 1500,
        _isTop = isTop,
        _callback = cbFunction,
        _init = function () {

        // Create group for slider and append to main svg
            _buttonSVG = _parent
                .append( 'g' )
                .attr( 'id', _id )
                .attr( 'class', MoInVis.Paracoords.IdStore.buttonClass )
                .attr( 'transform', 'translate(' + _xPos + ',' + _yPos + ')' )
                .attr( 'cursor', 'pointer' )
                .on( 'click', _onClicked );
            _rect = _buttonSVG
                .append( 'rect' )
                .attr( 'x', 0 )
                .attr( 'y', 0 )
                .attr( 'width', _size )
                .attr( 'height', _size )
                .attr( 'rx', _size * 0.25 )
                .attr( 'ry', _size * 0.25 )
                .attr( 'stroke', 'white' )
                .attr( 'fill', 'darkslategrey' )
                .attr( 'stroke-width', 1 );
            _buttonSVG
                .append( 'path' )
                .attr( 'stroke', 'white' )
                .attr( 'stroke-width', 2 )
                .attr( 'fill', 'none' )
                .attr( 'd', d3.line()( _createPath() ) );
        },
        _createPath = function () {
            var path = [];
            if ( _isTop ) {
                path.push( [_size * 0.25, _size * 0.75] );
                path.push( [_size * 0.5, _size * 0.25] );
                path.push( [_size * 0.75, _size * 0.75] );
            } else {
                path.push( [_size * 0.25, _size * 0.25] );
                path.push( [_size * 0.5, _size * 0.75] );
                path.push( [_size * 0.75, _size * 0.25] );
            }
            return path;
        },
        _onClicked = function () {
            _callback();
        };

    this.transitionX = function ( newX ) {
        _xPos = newX;
        _buttonSVG
            .transition()
            .duration( _transitionSpeed )
            .attr( 'transform', 'translate(' + _xPos + ',' + _yPos + ')' );
    };

    _init();
};