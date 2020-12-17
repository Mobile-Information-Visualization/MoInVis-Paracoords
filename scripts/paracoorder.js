var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.paraCoordGroup = 'MoInVis_ParaCoords';
MoInVis.Paracoords.IdStore.paracoordClipper = 'ParaCoordClipper';
MoInVis.Paracoords.Count = MoInVis.Paracoords.Count || 0;

MoInVis.Paracoords.paracoorder = function ( width, height, svgParent ) {
    // Private variables.
    var self = this,
        _svgParent = svgParent,
        _chosenYear = 2018, // Since we are concentrating on the year 2018. The data structure allows for storage of more than a year.
        _id = MoInVis.Paracoords.IdStore.paraCoordGroup + '_' + ( MoInVis.Paracoords.Count++ ),
        _xPos = 0,
        _yPos = 0,
        _parentGroup,
        _paracoordHolder,
        _height = height,
        _width = width,
        _getYPositionOfAttribute,
        _attrScales = new Map(),
        _margins = { left: 20, right: 20, top: 10, bottom: 10 }, // Margins for our content, including texts.
        _positionProps = { // Positions for our content, including texts.
            top: _margins.top,
            left: _margins.left,
            width: _width - _margins.left - _margins.right,
            height: _height - _margins.top - _margins.bottom
        },
        _innerMargins = { left: 50, right: 50, top: 20, bottom: 20 }, // Margins for the visualization.
        _innerPositionProps = { // Positions for our visualizations.
            top: _positionProps.top + _innerMargins.top,
            left: _positionProps.left + _innerMargins.left,
            width: _positionProps.width - _innerMargins.left - _innerMargins.right,
            height: _positionProps.height - _innerMargins.top - _innerMargins.bottom
        },
        _clipRect,

        // Private methods.
        _initializeClipping = function () {
            _clipRect = _parentGroup
                .append( 'clipPath' )
                .attr( 'id', MoInVis.Paracoords.IdStore.paracoordClipper )
                .append( 'rect' );
            _clipRect
                .attr( 'x', _positionProps.left )
                .attr( 'y', _positionProps.top )
                .attr( 'height', _positionProps.height )
                .attr( 'width', _positionProps.width );
        };

    // Public methods
    this.init = function ( x, y ) {
        _xPos = x;
        _yPos = y;
        _parentGroup = _svgParent
            .append( 'g' )
            .attr( 'id', _id + '_ParentGrp' )
            .attr( 'transform', 'translate(' + _xPos + ',' + _yPos + ')' );
        _initializeClipping();

        _paracoordHolder = _parentGroup
            .append( 'g' )
            .attr( 'id', _id + '_ParaCoorHolder' )
            .attr( 'clip-path', 'url(#' + MoInVis.Paracoords.IdStore.paracoordClipper + ')' );
    };

    this.draw = function () {
        var
            attributes = MoInVis.Paracoords.Data.wasteAttributes,
            items = MoInVis.Paracoords.Data.itemsForWaste,
            orderedItems,
            extent;

        // Sort teams alphabetically.
        orderedItems = items.slice()
            .sort( ( itemA, itemB ) => {
                if ( itemA < itemB ) {
                    return -1;
                } else if ( itemA > itemB ) {
                    return 1;
                } else {
                    return 0;
                }
            } );

        // Get the y position of the axes 
        // [TODO]: Must change this to be dynamic with the ratio of focus and context.
        // [TODO]: Must give more spacing between axes in general, and especially between those in the focus area.
        _getYPositionOfAttribute = d3.scalePoint( attributes.map( attr => attr.prop ), [_innerPositionProps.top, _innerPositionProps.top + _innerPositionProps.height] );

        // Set the scales for the axes.
        attributes.forEach( function ( attr ) {
            extent = d3.extent( orderedItems.map( region => MoInVis.Paracoords.Data.wasteByCountries[region][_chosenYear][attr.prop] ) );
            //attributeDomain = d3.range( extent[0], extent[1] + 1 );
            _attrScales.set(
                attr.prop,
                d3.scaleLinear()
                    .range( [_innerPositionProps.left, _innerPositionProps.left + _innerPositionProps.width])
                    .domain( extent )
            );
        } );
        this.drawAttributeAxes();

        // [TODO]:  Draw the paths for each region.
    };

    this.drawAttributeAxes = function () {
        var attributes = MoInVis.Paracoords.Data.wasteAttributes;

        _paracoordHolder
            .selectAll( "g" )
            .data( attributes )
            .join( "g" )
            .attr( 'id', attr => 'Year_' + _chosenYear + '_' + attr.prop )
            .attr( "transform", attr => `translate(0,${_getYPositionOfAttribute( attr.prop )})` )
            .each( function ( attr ) {
                // Drawing axes.
                // [TODO]: Draw labels for min and max values.
                // [TODO]: Space the labels in between to fit the remaining width.
                // [TODO]: Style the axis -> Set the fonts of the axis labels with class and css.
                // [TODO]: Style the axis -> Set colour of ticks and lines.
                // [TODO]: Style the axis -> Set colour of the labels.
                // [TODO]: Style the axis -> Set colour and background for the attribute text label.

                        d3.select( this ).call( d3.axisBottom( _attrScales.get( attr.prop ) ) );

                var textGroup = d3.select( this )
                    .append( "g" )
                    .attr( 'id', 'Year_' + _chosenYear + '_' + attr.prop + '_TextGroup' );

                    textGroup.append( "text" )
                        .attr( 'class', 'attrNameText')
                        .attr( "transform", 'translate(' + _innerPositionProps.left + ',' + ( - 10) + ')' )
                        .attr( "text-anchor", "start" )
                        .text( attr.text );
            } );
    };
};
