var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.Count = MoInVis.Paracoords.Count || 0;
MoInVis.Paracoords.TransitionSpeed = 1500;
MoInVis.Paracoords.DeleteTransitionSpeed = 500;

MoInVis.Paracoords.axis = function ( axisParent, id, attributeProps, attrScale, paracoorder ) {
    // Private variables.
    var self = this,
        _axisParentGroup = axisParent,
        _axisGroup,
        _textGroup,
        _paracoorder = paracoorder,
        _id,
        _attrScale = attrScale,
        _transitionSpeed = MoInVis.Paracoords.TransitionSpeed;

    this.attribute = attributeProps.prop;
    this.attributeLabel = attributeProps.text;

    _id = id + '_Axis_' + this.attribute;

    // Public methods
    this.init = function () {
    };

    this.visible = true;

    this.setVisibility = function ( visible ) {
        this.visible = visible;
        // [TODO]: Make _axisGroup visible or invisible.
    };

    this.getXY = function (value) {
        return [_attrScale( value ), this.yPos];
    };

    this.draw = function ( xPos, yPos ) {
        this.xPos = xPos;
        this.yPos = yPos;
        _axisGroup = _axisParentGroup
            .append( 'g' )
            .attr( 'id', _id )
            .attr( 'transform', 'translate(0,' + this.yPos + ')' );

        // Drawing axes.
        // [TODO]: Draw labels for min and max values.
        // [TODO]: Space the labels in between to fit the remaining width.
        // [TODO]: Style the axis -> Set the fonts of the axis labels with class and css.
        // [TODO]: Style the axis -> Set colour of ticks and lines.
        // [TODO]: Style the axis -> Set colour of the labels.
        // [TODO]: Style the axis -> Set colour and background for the attribute text label.

        _axisGroup.call( d3.axisBottom( _attrScale ) );

        _textGroup = _axisGroup
            .append( "g" )
            .attr( 'id', _id + '_TextGroup' );

        _textGroup.append( 'text' )
            .attr( 'class', 'attrNameText' )
            .attr( 'transform', 'translate(' + this.xPos + ',' + ( - 10 ) + ')' )
            .attr( 'text-anchor', "start" )
            .text( this.attributeLabel );

        this.height = _axisGroup.node().getBBox().height;
    };

    this.transitionY = function ( newY ) {
        this.yPos = newY;
        _axisGroup
            .transition()
            .duration( _transitionSpeed)
            .attr( 'transform', 'translate(0,' + this.yPos + ')' );
    };

    this.setY = function ( newY ) {
        this.yPos = newY;
        _axisGroup
            .attr( 'transform', 'translate(0,' + this.yPos + ')' );
    };
};
