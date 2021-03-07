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
        _axis,
        _paracoorder = paracoorder,
        _id,
        _class = MoInVis.Paracoords.IdStore.AxisClass,
        _attrScale = attrScale,
        _brushManager,
        _interationManager,
        _wigglingIntervalId,
        _isDragged = false;

    this.attribute = attributeProps.prop;
    this.attributeLabel = attributeProps.text;

    _id = id + '_Axis_' + this.attribute;

    // Public methods
    this.init = function () {
    };

    this.visible = true;
    this.indexInVisibilityArray = 0;

    this.setVisibility = function ( visible ) {
        this.visible = visible;
        // [TODO]: Make _axisGroup visible or invisible.
    };

    this.getXY = function ( value ) {
        return [_attrScale( value ), this.yPos];
    };

    this.checkPathBrushed = function ( xPos ) {
        return _brushManager.checkPathBrushed( xPos );
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
                .ticks( 3 )
        );

        _axisInnerGroup.selectAll( 'line' )
            .attr( 'y2', 8 );

        _axisInnerGroup.selectAll( 'text' )
            .attr( 'y', 12 );


        // [TODO]: Number of ticks must depend on font size, available width, and text lengths.

        // label computation
        const padding = { vertical: 10, horizontal: 20 }; // space between text and its box
        const margin = { vertical: 40, horizontal: 0 }; // space between box and its axis

        _textGroup = _axisInnerGroup
            .append( 'g' )
            .attr( 'id', _id + '_TextGroup' )
            .attr( 'transform', 'translate(' + ( this.xPos + margin.horizontal ) + ',' + ( - margin.vertical ) + ')' );

        // label box
        _textGroup.append( 'rect' )
            .attr( 'class', 'attrNameTextBox' )
            .attr( 'id', _id + '_LabelTextBox' )
            .attr( 'x', 0 )
            .attr( 'y', 0 )
            .attr( 'text-anchor', 'start' );

        // label text
        _textGroup.append( 'text' )
            .attr( 'class', 'attrNameText' )
            .attr( 'id', _id + '_LabelText' )
            //.attr( 'transform', 'translate(' + ( this.xPos + margins.horizontal ) + ',' + ( - 0 - margins.vertical ) + ')' )
            .attr( 'x', padding.horizontal )
            .attr( 'y', ( 0 ) )
            .attr( 'text-anchor', 'start' )
            .text( this.attributeLabel );

        // adjust box size to text size
        const measuredSize = _textGroup.select( 'text' )
            .node()
            .getBBox();
        _textGroup.select( 'rect' )
            .attr( 'width', measuredSize.width + ( 2 * padding.horizontal ) )
            .attr( 'height', measuredSize.height + ( 2 * padding.vertical ) )
            .attr( 'y', ( measuredSize.y - padding.vertical ) )
            .attr( 'ry', ( measuredSize.height / 1.7 ) );

        this.height = _axisInnerGroup.node().getBBox().height;

        _interationManager = new MoInVis.Paracoords.axisInteractionManager(
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
        _interationManager.init( _brushManager );
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
            .attr( 'transform', 'translate(0,' + this.yPos + ')' );
    };

    this.startWiggling = function ( rotationCenterX ) {
        let seed = Math.random();
        const amplitude = 0.4,
            speed = 0.028;

        _wigglingIntervalId = setInterval(function () {
            let y = Math.sin( 10 * seed ) * amplitude;
            _axisInnerGroup
                .attr( 'transform', 'rotate(' + y + ',' + rotationCenterX + ',0)' );
            seed = seed + speed;
        }, 10 );
    };

    this.stopWiggling = function () {
        clearInterval( _wigglingIntervalId );
        _axisInnerGroup
            .transition()
            .duration( MoInVis.Paracoords.FastTransitionSpeed )
            .ease( d3.easeExpOut )
            .attr( 'transform', 'rotate(0,0,0)' );
    };

    this.getInteractionManager = function () {
        return _interationManager;
    };

    this.setDragStatus = function ( isDragged ) {
        _isDragged = isDragged;
    };

    this.isDragged = function () {
        return _isDragged;
    };

};
