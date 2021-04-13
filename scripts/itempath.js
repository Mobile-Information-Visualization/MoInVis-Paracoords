/*
*
* Descr.: Contains data and representation of an item.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.Count = MoInVis.Paracoords.Count || 0;

MoInVis.Paracoords.itemPath = function ( pathParent, id, itemName, paracoorder ) {
    // Private variables.
    var self = this,
        _pathParentGroup = pathParent,
        _pathGroup,
        _pathElement,
        _paracoorder = paracoorder,
        _id,
        _chosenYear,
        _pathWidth = 2,
        _points = [],
        _emphasis,
        _emphasizedAlpha = 1,
        _unemphasizedAlpha = 0.25,
        _colour = '#FFFFFF';

    this.itemName = itemName;
    this.itemText = '';
    this.data = null;

    _id = id + '_PathGroup_' + this.itemName;

    // Public methods
    this.init = function ( data, chosenYear, colour ) {
        this.itemText = data.text;
        this.data = data.data;
        _chosenYear = chosenYear;
        _colour = colour;
        _emphasis = true;
    };

    this.visible = true;

    this.setVisibility = function ( visible ) {
        this.visible = visible;
        // [TODO]: Make _pathGroup visible or invisible, and change the axes' range if required.
        if ( visible ) {
            _pathGroup.attr( 'display', 'inherit' );
        } else {
            _pathGroup.attr( 'display', 'none' );
        }
    };

    this.draw = function () {
        _pathGroup = _pathParentGroup
            .append( 'g' )
            .attr( 'id', _id );

        _pathElement = _pathGroup
            .append( 'path' )
            .attr( 'id', _id + '_Path' )
            .attr( "stroke-width", _pathWidth )
            .attr( "stroke", _colour )
            .attr( "fill", "none" );
    };

    this.recalculate = function ( dontAnimate ) {
        let pointsInfo = _paracoorder.getPathPointsInfo( this.itemName );
        _points = pointsInfo.points;
        _emphasis = pointsInfo.emphasis;
        _pathElement.attr( 'opacity', _emphasis ? _emphasizedAlpha : _unemphasizedAlpha );
        if ( dontAnimate === true ) {
            _pathElement
                .attr( 'd', d3.line()( _points ) );
        } else {
            _pathElement
                .transition()
                .duration( MoInVis.Paracoords.TransitionSpeed )
                .ease( d3.easeCubicOut )
                .attr( 'd', d3.line()( _points ) );
        }
    };

    // Emphasizes or de-emphasizes the path.
    this.setEmphasis = function ( emphasis ) {
        if ( emphasis ) {
            _pathElement.attr( 'opacity', _emphasizedAlpha );
            _emphasis = emphasis;
        } else {
            _pathElement.attr( 'opacity', _unemphasizedAlpha );
            _emphasis = emphasis;
        }
    };

    this.getEmphasis = function () {
        return _emphasis;
    };

    this.getCurrentAlpha = function () {
        if ( _emphasis ) {
            return _emphasizedAlpha;
        }
        else {
            return _unemphasizedAlpha;
        }
    };

    this.getColour = this.getColor = function () {
        return _colour;
    };

    this.setColour = this.setColor = function ( colour ) {
        _colour = colour;
        _pathElement.attr( "stroke", _colour );
    };

    this.getId = function () {
        return _id;
    };

};
