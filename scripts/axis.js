/*
*
* Descr.: Contains data and representation of an axis/attribute.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.AxisClass = 'ParaCoord_Axis_Class';

MoInVis.Paracoords.axis = function ( axisParent, id, attributeProps, attrScale, paracoorder ) {
    // Private variables.
    var self = this,
        _axisParentGroup = axisParent,
        _axisGroup,
        _axisInnerGroup,
        _textGroup,
        _textInnerGroup,
        _textGroupCenter,
        _textRect,
        _axis,
        _paracoorder = paracoorder,
        _id,
        _class = MoInVis.Paracoords.IdStore.AxisClass,
        _attrScale = attrScale,
        _brushManager,
        _interactionManager,
        _wigglingIntervalId,
        _isDragged = false,
        _formatter = MoInVis.Paracoords.util.format;

    this.unit = MoInVis.Paracoords.Unit;
    this.attribute = attributeProps.prop;
    this.attributeLabel = attributeProps.text;
    this.attributeLabelWithUnit = attributeProps.text + ' (' + this.unit + ')';

    _id = id + '_Axis_' + this.attribute;

    // Public methods
    this.init = function () {
    };


    this.visible = true;
    this.indexInVisibilityArray = 0;
    this.indexInGlobalArray = 0;

    this.setVisibility = function ( visible ) {
        this.visible = visible;
        _axisGroup.style( 'display', visible ? 'inherit' : 'none' );
    };

    this.setAxisRange = function ( newRange ) {
        var valueRanges = _brushManager.getBrushValueRanges();
        _attrScale.domain( newRange );
        _axisInnerGroup.call( _axis );
        _brushManager.setBrushValueRanges( valueRanges );
    };

    this.setAxisPxRange = function ( newRange ) {
        var valueRanges = _brushManager.getBrushValueRanges();
        _attrScale.range( newRange );
        _axisInnerGroup.call( _axis );
        _brushManager.setBrushValueRanges( valueRanges );
    };

    this.getXY = function ( value ) {
        return [_attrScale( value ), this.yPos];
    };

    this.checkPathBrushed = function ( xPos ) {
        return _brushManager.checkPathBrushed( xPos );
    };

    this.getBrushConfigurations = function () {
        var brushes = _brushManager.getBrushes();
        brushes.forEach( ( brush, index ) => {
            // brush.axisName = this.attributeLabel + ' Brush ' + ( index + 1 ); // Uncomment when multiple brushes for single axis are enabled.
            brush.axisName = this.attributeLabelWithUnit;
            brush.axisId = _id;
            brush.axisRange = _attrScale.domain();
            // [TODO]: Apply appropriate formatter.
            brush.range = [Math.floor( _attrScale.invert( brush.range[0] ) ), Math.floor( _attrScale.invert( brush.range[1] ) )];
            brush.rangeText = brush.range.map( val => _formatter( val ) );
        } );
        return brushes;
    };

    this.enableDisableBrush = function ( brushId, active ) {
        _brushManager.enableDisableBrush( brushId, active );
    };

    this.setBrushValueRange = function ( brushId, valueRange ) {
        _brushManager.setBrushValueRange( brushId, valueRange );
    };

    this.hideBrushHandles = function () {
        _brushManager.hideAllBrushHandles();
    };

    this.draw = function ( xPos, yPos ) {
        this.xPos = xPos;
        this.yPos = yPos;
        _axisGroup = _axisParentGroup
            .append( 'g' )
            .attr( 'id', _id )
            .attr( 'class', _class )
            .attr( 'transform', 'translate(0,' + this.yPos + ')' );
        _axisInnerGroup = _axisGroup
            .append( 'g' )
            .attr( 'id', _id + '_InnerGroup' )
            .attr( 'class', _class + '_InnerGroup' );

        // Drawing axes.
        // [TODO]: Draw labels for min and max values.
        // [TODO]: Space the labels in between to fit the remaining width.
        // [TODO]: Style the axis -> Set the fonts of the axis labels with class and css.
        // [TODO]: Style the axis -> Set colour of ticks and lines.
        // [TODO]: Style the axis -> Set colour of the labels.
        // [TODO]: Style the axis -> Set colour and background for the attribute text label.

        _axisInnerGroup.call(
            _axis = d3.axisBottom( _attrScale )
                .ticks( 4, '~s' )
                .tickSize( 15 )
        );

        // Tick styling.
        _axisInnerGroup
            .selectAll( 'g.tick' )
            .select( 'text' )
            .attr( 'y', 22 );
        _axisInnerGroup
            .selectAll( 'g.tick' )
            .select( 'line' )
            .attr( 'y2', 10 );

        // [TODO]: Number of ticks must depend on font size, available width, and text lengths.

        // label computation
        const padding = { vertical: 11, horizontal: 22 }; // space between text and its box
        const margin = { vertical: 42, horizontal: 0 }; // space between box and its axis

        _textGroup = _axisInnerGroup
            .append( 'g' )
            .attr( 'id', _id + '_TextGroup' )
            .attr( 'transform', 'translate(' + ( this.xPos + margin.horizontal ) + ',' + ( - margin.vertical ) + ')' );

        _textInnerGroup = _textGroup
            .append( 'g' )
            .attr( 'id', _id + '_TextInnerGroup' )
            .on( 'pointerdown', function () {
                _textRect.attr( 'opacity', 0.75 );
            } )
            .on( 'pointerup', function () {
                _textRect.attr( 'opacity', 1 );
            } );

        // label box
        _textRect = _textInnerGroup.append( 'rect' )
            .attr( 'class', 'attrNameTextBox' )
            .attr( 'id', _id + '_LabelTextBox' )
            .attr( 'x', 0 )
            .attr( 'y', 0 );

        // label text
        _textInnerGroup.append( 'text' )
            .attr( 'class', 'attrNameText' )
            .attr( 'id', _id + '_LabelText' )
            //.attr( 'transform', 'translate(' + ( this.xPos + margins.horizontal ) + ',' + ( - 0 - margins.vertical ) + ')' )
            .attr( 'x', padding.horizontal )
            .attr( 'y', ( 0 ) )
            .attr( 'text-anchor', 'start' )
            .text( this.attributeLabel );

        // adjust box size to text size
        const measuredSize = _textInnerGroup.select( 'text' )
            .node()
            .getBBox();
        _textRect
            .attr( 'width', measuredSize.width + ( 2 * padding.horizontal ) )
            .attr( 'height', measuredSize.height + ( 2 * padding.vertical ) )
            .attr( 'y', ( measuredSize.y - padding.vertical ) )
            .attr( 'ry', ( measuredSize.height / 1.7 ) );
        _textGroupCenter = ( measuredSize.width + ( 2 * padding.horizontal ) ) / 2;

        this.height = _axisGroup.node().getBBox().height;

        _interactionManager = new MoInVis.Paracoords.axisInteractionManager(
            this,
            _axisGroup,
            _axisInnerGroup,
            _id,
            _attrScale,
            _paracoorder );
        _brushManager = new MoInVis.Paracoords.brushManager(
            _id,
            _attrScale,
            _paracoorder );
        _interactionManager.init( _brushManager );
    };

    this.transitionY = function ( newY ) {
        this.yPos = newY;
        _axisGroup
            .transition()
            .duration( MoInVis.Paracoords.TransitionSpeed )
            .ease( d3.easeCubicOut )
            .attr( 'transform', 'translate(0,' + this.yPos + ')' );
    };

    this.setY = function ( newY ) {
        this.yPos = newY;
        _axisGroup
            .attr( 'transform', 'translate(0,' + newY + ')' );
    };

    this.setX = function ( newX ) {
        this.xPos = newX;
        _axisGroup
            .transition()
            .duration( MoInVis.Paracoords.TransitionSpeed )
            .ease( d3.easeCubicOut )
            .attr( 'transform', 'translate(' + newX + ',' + this.yPos + ')' );
    };

    this.setXY = function ( newX, newY ) {
        this.yPos = newY;
        this.xPos = newX;
        _axisGroup
            .attr( 'transform', 'translate(' + newX + ',' + newY + ')' );
    };

    this.startWiggling = function () {
        let seed = Math.random();
        const amplitude = 0.4 + 0.7,
            speed = 0.02;

        _wigglingIntervalId = setInterval( function () {
            let y = Math.sin( 10 * seed ) * amplitude;
            _textInnerGroup
                .attr( 'transform', 'rotate(' + y + ',' + _textGroupCenter + ',0)' );
            seed = seed + speed;
        }, 10 );
    };

    this.stopWiggling = function () {
        clearInterval( _wigglingIntervalId );
        _textInnerGroup
            .transition()
            .duration( MoInVis.Paracoords.FastTransitionSpeed )
            .ease( d3.easeExpOut )
            .attr( 'transform', 'rotate(0,0,0)' );
    };

    this.getInteractionManager = function () {
        return _interactionManager;
    };

    this.setDragStatus = function ( isDragged ) {
        _isDragged = isDragged;
    };

    this.getDragStatus = function () {
        return _isDragged;
    };

    this.getId = function () {
        return _id;
    };

    this.getAttrScale = function () {
        return _attrScale;
    };

    this.getHeight = function () {
        return _axisGroup.node().getBBox().height;
    };
};
