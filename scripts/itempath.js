var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.Count = MoInVis.Paracoords.Count || 0;
MoInVis.Paracoords.TransitionSpeed = 1500;
MoInVis.Paracoords.DeleteTransitionSpeed = 500;

MoInVis.Paracoords.itemPath = function ( pathParent, id, itemName, paracoorder ) {
    // Private variables.
    var self = this,
        _pathParentGroup = pathParent,
        _pathGroup,
        _pathElement,
        _paracoorder = paracoorder,
        _id,
        _transitionSpeed = MoInVis.Paracoords.TransitionSpeed,
        _chosenYear, _data, _itemName,
        _pathWidth = 2,
        _points = [],
        _colour = '#FFFFFF';

    this.itemName = itemName;

    _id = id + '_PathGroup_' + this.itemName;

    // Public methods
    this.init = function ( data, chosenYear, colour ) {
        _data = data;
        _chosenYear = chosenYear;
        _colour = colour;

        //.attr( "d", driver => d3.line()( points ) );
    };

    this.visible = true;

    this.setVisibility = function ( visible ) {
        this.visible = visible;
        // [TODO]: Make _axisGroup visible or invisible.
    };

    this.draw = function () {
        _pathParentGroup
            .append( 'g' )
            .attr( 'id', _id );

        _pathElement = _pathParentGroup
            .append( 'path' )
            .attr( 'id', _id + '_Path' )
            .attr( "stroke-width", _pathWidth )
            .attr( "stroke", _colour )
            .attr( "fill", "none" );
    };

    this.recalculate = function () {
        _points = _paracoorder.getPathPoints( this.itemName );
        _pathElement
            .transition()
            .duration( _transitionSpeed )
            .attr( "d", d3.line()( _points ) );
    };

    this.transitionY = function () {
        //this.yPos = newY;
        //_axisGroup
        //    .transition()
        //    .duration( _transitionSpeed)
        //    .attr( 'transform', 'translate(0,' + this.yPos + ')' );
    };

    this.setY = function () {
        //this.yPos = newY;
        //_axisGroup
        //    .attr( 'transform', 'translate(0,' + this.yPos + ')' );
    };
};
