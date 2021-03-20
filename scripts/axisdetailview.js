var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
/*
*
* Descr.: Handles data and UI functionality for the axis detail view overlay tab.
*         Inherits MoInVis.Paracoords.overlayTab
*
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.axisDetailView = function ( moin, parentDiv ) {
    this.moin = moin;
    MoInVis.Paracoords.axisDetailView.baseCtor.call( this, parentDiv );

    var self = this,
        _parentDiv = parentDiv,
        _contentDiv,
        _parentSVG,
        _group,
        _vueData,
        _vueMethods,
        _vueApp,
        _barChartData = [],
        _showAllEntries = true,
        _nameShown,

        _init = function () {
            _vueData = {
                tabName: 'Axis Detail View',
                closeButtonText: 'Close'
            };
            _vueMethods = {
                closeView: function ( event ) {
                    self.deactivateTab();
                },
                changeLabels: function ( event ) {
                    self.changeLabels();
                },
            };
            _vueApp = self.initVue( _vueData, _vueMethods );

            _contentDiv = d3.select( '#axisDetailView' );
        };

    this.changeLabels = function () {
        if ( _nameShown ) {
            d3.select( '#axisDetailView_Label_Name')
                .attr( 'display', 'none' );
            d3.select( '#axisDetailView_Label_Value')
                .attr( 'display', 'block' );
        }
        else {
            d3.select( '#axisDetailView_Label_Name')
                .attr( 'display', 'block' );
            d3.select( '#axisDetailView_Label_Value')
                .attr( 'display', 'none' );
        }
        _nameShown = !_nameShown;
    }

    this.updateParameters = function ( axis, paths ) {

        let regions = MoInVis.Paracoords.Data.itemsForWaste;
        const chosenYear = '2018';

        _barChartData = [];

        let min_value = 0;
        let max_value = 0;

        let counter = 0;

        for ( path in paths ) {
            var item = paths[path];
            if ( item.visible ) {
                let country = item.itemName;
                let countryLabel = item.itemText; //country.replaceAll( '_sp_', ' ' ).split( '_' )[0];
                const color = item.getColor();
                data = MoInVis.Paracoords.Data.wasteByCountries[country].data[chosenYear];
                const status = item.getEmphasis();
                const alpha = item.getCurrentAlpha();
                if ( status === true || _showAllEntries === true ) {
                    let value = data[axis.attribute];
                    if ( counter === 0 ) {
                        min_value = value;
                        max_value = value;
                    }
                    if ( value !== null && value !== '' ) {
                        _barChartData.push( { name: countryLabel, score: value, color: color, opacity: alpha } );
                        if ( value > max_value ) {
                            max_value = value;
                        }
                        else if ( value < min_value ) {
                            min_value = value;
                        }
                    }
                    counter++;
                }
            }
        }


        // const data = [
        //     { name: 'Attr1', score: 60 },
        //     { name: 'Attr2', score: 20 },
        //     { name: 'Attr3', score: 30 }
        // ];
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const scrollbarWidth = 15;

        var cs = getComputedStyle( document.getElementById( 'axisDetailView' ) );

        var paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

        var borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);

        const width = document.getElementById( 'axisDetailView' ).offsetWidth - paddingX - borderX - scrollbarWidth;
        // const width = document.getElementById( 'axisDetailView' ).clientWidth;

        const barHeight = 80;
        const height = margin.bottom + _barChartData.length * barHeight;

        // Remove old content.
        let ele = document.getElementById( 'axisDetailView' );
        while ( ele.firstChild ) {
            ele.removeChild( ele.firstChild );
        }

        const svg = d3.select( '#axisDetailView' )
            .append( 'svg' )
            .attr( 'id', 'axisDetailView_SVG' )
            .attr( 'width', width )
            .attr( 'height', height )
            .attr( 'viewBox', [0, 0, width, height] );

        const y = d3.scaleBand()
            .domain( d3.range( _barChartData.length ) )
            .range( [height - margin.bottom, 0] )
            .paddingInner( 0.1 );

        const x = d3.scaleLinear()
            .domain( [min_value - min_value / 10, max_value + max_value / 10 ] )
            .range( [0, width] );

        svg.append( 'g' )
            .selectAll( 'rect' )
            .data( _barChartData.sort( ( a, b ) => d3.ascending( a.score, b.score ) ) )
            .join( 'rect' )
                .attr( 'x', 0 )
                .attr( 'y', ( d, i ) => y( i ) )
                .attr( 'height', y.bandwidth() )
                .attr( 'width', ( d ) => x( min_value ) + x( d.score ) )
                .attr( 'fill', ( a ) => a.color )
                .attr( 'opacity', a => a.opacity );


        // Remove old content.
        let elem = document.getElementById( 'xAxisView' );
        while ( elem.firstChild ) {
            elem.removeChild( elem.firstChild );
        }

        const xAxisSVG = d3.select( '#xAxisView' )
            .append( 'svg' )
            .attr( 'id', 'xAxis' );
        xAxisSVG.append("g")
            .attr("transform", "translate(" + 0 + "," + 50 + ")")
            .attr("id", "xAxisGroup")
            .call( d3.axisTop( x )
                // .tickValues( x.ticks( 2, '~s' ).concat( x.domain() ) )
                    .ticks( 4, '~s' )
                    .tickSize( 20 )
                // .tickFormat( this.formatTick )
            );

        xAxisSVG.attr( 'height', d3.select( '#xAxisGroup' ).node().getBBox().height );
        xAxisSVG.attr( 'height', 50 + 10 );

        document.getElementById( 'axisDetailView' ).style.paddingBottom = '3vw';
        document.getElementById( 'axisDetailView' ).style.height =
            ( document.getElementById( 'axisDetailViewOverlay' ).getBoundingClientRect().height -
            document.getElementById( 'axisDetailViewHeader' ).getBoundingClientRect().height ) + 'px';

        svg.append( 'g' )
            .attr( 'id', 'axisDetailView_Label_Name' )
            .attr("display" , "block")
            .selectAll( 'text' )
            .data( _barChartData )
            .enter()
            .append( 'text' )
            .text( ( d ) => d.name )
            // .text( ( d ) => d.name.split( '_' )[0] )
            .attr( 'x', 20 )
            .attr( 'y', ( d, i ) => y( i ) + barHeight * 0.6 )
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "2em")
            .attr("fill" , "white")
            .attr("text-anchor", "left")
            .attr( 'opacity', a => a.opacity );

        _nameShown = true;

        svg.append( 'g' )
            .attr( 'id', 'axisDetailView_Label_Value' )
            .attr("display" , "none")
            .selectAll( 'text' )
            .data( _barChartData )
            .enter()
            .append( 'text' )
            .text( ( d ) => this.numberWithCommas( d.score ) )
            .attr( 'x', 20 )
            .attr( 'y', ( d, i ) => y( i ) + barHeight * 0.6 )
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "2em")
            .attr("fill" , "white")
            .attr("text-anchor", "left")
            .attr( 'opacity', a => a.opacity );

        document.getElementById( 'attributeName' ).innerText = axis.attributeLabel;

        // Tick styling.
        d3.select( '#xAxisGroup' )
            .selectAll( 'g.tick' )
            .select( 'text' )
            .attr( 'y', -22 );
        d3.select( '#xAxisGroup' )
            .selectAll( 'g.tick' )
            .select( 'line' )
            .attr( 'y2', -10 );

        // Show bar chart from top.
        document.getElementById( 'axisDetailView' ).scrollTop = 0;
    };

    this.numberWithCommas = function ( x ) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    this.formatTick = function ( d ) {
        const s = (d / 1e6).toFixed(0);
        // return this.parentNode.nextSibling ? `\xa0${s}` : `$${s} million`;
        return `${s}`;
    }

    _init();
};


MoInVis.Paracoords.axisDetailView.baseCtor = MoInVis.Paracoords.overlayTab;