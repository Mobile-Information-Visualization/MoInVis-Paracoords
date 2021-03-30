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
        _vueData,
        _vueMethods,
        _vueApp,
        _barChartData = [],
        _emphasisedFirst = false,
        _nameShown = true,
        _paths,
        _attribute,
        _attributeLabel,

        _styleSortingButton = function () {
            if ( _emphasisedFirst ) {
                d3.select( '#buttonRight_firstBar' )
                    .attr( 'fill', '#7dcdc4' )
                    .attr( 'y', '104' )
                    .attr( 'width', '256' );
                d3.select( '#buttonRight_secondBar' )
                    .attr( 'fill', '#7dcdc4' )
                    .attr( 'y', '208' )
                    .attr( 'width', '192' );
                d3.select( '#buttonRight_thirdBar' )
                    .attr( 'fill', 'white' )
                    .attr( 'y', '312' )
                    .attr( 'width', '320' );
                d3.select( '#buttonRight_fourthBar' )
                    .attr( 'fill', 'white' )
                    .attr( 'y', '416' )
                    .attr( 'width', '130' );
            }
            else {
                d3.select( '#buttonRight_firstBar' )
                    .attr( 'fill', 'white' )
                    .attr( 'y', '104' )
                    .attr( 'width', '320' );
                d3.select( '#buttonRight_secondBar' )
                    .attr( 'fill', '#7dcdc4' )
                    .attr( 'y', '208' )
                    .attr( 'width', '256' );
                d3.select( '#buttonRight_thirdBar' )
                    .attr( 'fill', '#7dcdc4' )
                    .attr( 'y', '312' )
                    .attr( 'width', '192' );
                d3.select( '#buttonRight_fourthBar' )
                    .attr( 'fill', 'white' )
                    .attr( 'y', '416' )
                    .attr( 'width', '130' );
            }
        },

        _sortDataSet = function () {
            if ( _emphasisedFirst ) {
                _barChartData.sort( ( a, b ) => d3.ascending( a.emphasised, b.emphasised )
                    || d3.ascending( a.score, b.score ) );
            }
            else {
                _barChartData.sort( ( a, b ) => d3.ascending( a.score, b.score ) );
            }
        },

        _showBarLabels = function () {
            if ( _nameShown ) {
                d3.select( '#axisDetailView_BarLabel_Name' )
                    .attr( 'display', 'block' );
                d3.select( '#axisDetailView_BarLabel_Value' )
                    .attr( 'display', 'none' );
            }
            else {
                d3.select( '#axisDetailView_BarLabel_Name' )
                    .attr( 'display', 'none' );
                d3.select( '#axisDetailView_BarLabel_Value' )
                    .attr( 'display', 'block' );
            }
        },

        _numberWithCommas = function ( x ) {
            return x.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' );
        },

        _formatTick = function ( data ) {
            // const s = ( data / 1e6 ).toFixed( 0 );
            if ( data > 0 ) {
                return d3.format( '~s' )( data );
            }
            else {
                return '0';
            }
            // return `${s}`;
        },

        _getWidthOfElementById = function ( idString ) {
            let element = document.getElementById( idString );
            let offsetWidth = element.offsetWidth;

            let cs = getComputedStyle( element );
            let paddingX = parseFloat( cs.paddingLeft ) + parseFloat( cs.paddingRight );
            let borderX = parseFloat( cs.borderLeftWidth ) + parseFloat( cs.borderRightWidth );

            return ( offsetWidth - paddingX - borderX );
        },

        _updateBarChart = function () {

            // Get boundaries of dataset.
            const min_value = d3.min( _barChartData, d => d.score );
            const max_value = d3.max( _barChartData, d => d.score );

            // Get width.
            const scrollbarWidth = 15;
            const width = _getWidthOfElementById( 'axisDetailView' ) - scrollbarWidth;

            // Get height.
            const barHeight = 75;
            const height = _barChartData.length * barHeight;

            // Remove old svg content.
            let ele = document.getElementById( 'axisDetailView' );
            while ( ele.firstChild ) {
                ele.removeChild( ele.firstChild );
            }

            // Create new svg.
            const svg = d3.select( '#axisDetailView' )
                .append( 'svg' )
                .attr( 'id', 'axisDetailView_SVG' )
                .attr( 'width', width )
                .attr( 'height', height )
                .attr( 'viewBox', [0, 0, width, height] );

            // Axis scales.
            const y = d3.scaleBand()
                .domain( d3.range( _barChartData.length ) )
                .range( [height, 0] )
                .paddingInner( 0.15 );
            const x = d3.scaleLinear()
                .domain( [Math.max( min_value - min_value * 3, 0 ), max_value + max_value / 10] )
                .range( [0, width] );

            // Create horizontal bars.
            svg.append( 'g' )
                .selectAll( 'rect' )
                .data( _barChartData )
                .join( 'rect' )
                .attr( 'x', 0 )
                .attr( 'y', ( d, i ) => y( i ) )
                .attr( 'height', y.bandwidth() )
                .attr( 'width', d => x( min_value ) + x( d.score ) )
                .attr( 'fill', d => d.color )
                .attr( 'opacity', d => d.opacity );

            // Create bar labels.
            svg.append( 'g' )
                .attr( 'id', 'axisDetailView_BarLabel_Name' )
                .selectAll( 'text' )
                .data( _barChartData )
                .enter()
                .append( 'text' )
                .text( d => d.name )
                .attr( 'x', 20 )
                .attr( 'y', ( d, i ) => y( i ) + barHeight * 0.6 )
                .attr( 'text-anchor', 'left' )
                .attr( 'opacity', d => d.opacity );
            svg.append( 'g' )
                .attr( 'id', 'axisDetailView_BarLabel_Value' )
                .selectAll( 'text' )
                .data( _barChartData )
                .enter()
                .append( 'text' )
                .text( d => _numberWithCommas( d.score ) )
                .attr( 'x', 20 )
                .attr( 'y', ( d, i ) => y( i ) + barHeight * 0.6 )
                .attr( 'text-anchor', 'left' )
                .attr( 'opacity', d => d.opacity );

            // Pass texts to header.
            document.getElementById( 'attributeName' ).innerText = _attributeLabel;
            document.getElementById( 'attributeUnit' ).innerText = '(in ' + MoInVis.Paracoords.Unit + ')';

            // Remove old content of header axis.
            let elem = document.getElementById( 'xAxisView' );
            while ( elem.firstChild ) {
                elem.removeChild( elem.firstChild );
            }

            // Create new header axis.
            const xAxisSVG = d3.select( '#xAxisView' )
                .append( 'svg' )
                .attr( 'id', 'xAxis' );
            xAxisSVG.append( 'g' )
                .attr( 'transform', 'translate(' + 0 + ',' + 50 + ')' )
                .attr( 'id', 'xAxisGroup' )
                .call( d3.axisTop( x )
                    // .tickValues( x.ticks( 2, '~s' ).concat( x.domain() ) )
                    // .ticks( 4, '~s' )
                    .ticks( 4 )
                    .tickSize( 15 )
                    .tickFormat( _formatTick )
                );

            // Tick styling.
            d3.select( '#xAxisGroup' )
                .selectAll( 'g.tick' )
                .select( 'text' )
                .attr( 'y', -22 );
            d3.select( '#xAxisGroup' )
                .selectAll( 'g.tick' )
                .select( 'line' )
                .attr( 'y2', -10 );

            // Compute correct height of scrollable div.
            document.getElementById( 'axisDetailView' ).style.height =
                ( document.getElementById( 'axisDetailViewOverlay' ).getBoundingClientRect().height -
                    document.getElementById( 'axisDetailViewHeader' ).getBoundingClientRect().height ) + 'px';

            // Show bar chart from top.
            document.getElementById( 'axisDetailView' ).scrollTop = 0;

            _showBarLabels();
        },

        _init = function () {
            var vueStuff,
                vueData = {
                    tabName: 'Axis Detail View',
                    closeButtonText: 'Close',
                    pointerDownX: false,
                    pointerDownSort: false
                };
            _vueMethods = {
                closeView: function ( event ) {
                    self.deactivateTab();
                },
                changeBarLabels: function ( event ) {
                    self.changeBarLabels();
                },
                changeSorting: function ( event ) {
                    self.changeSorting();
                },
            };

            vueStuff = self.initVue( vueData, _vueMethods );
            _vueApp = vueStuff.mainApp;
            _vueData = vueStuff.dataProxy;
        };

    this.changeBarLabels = function () {
        _nameShown = !_nameShown;
        _showBarLabels();
    };

    this.changeSorting = function () {
        _emphasisedFirst = !_emphasisedFirst;
        _sortDataSet();
        _updateBarChart();
        _styleSortingButton();
    };

    this.setUpData = function ( attribute, attributeLabel, paths ) {

        _attribute = attribute;
        _attributeLabel = attributeLabel;
        _paths = paths;

        const chosenYear = '2018';
        let sortButtonNecessity = false;

        // Empty old data set.
        _barChartData = [];

        // Update bar chart data set.
        for ( path in paths ) {
            const item = paths[path];
            if ( item.visible ) {

                const country = item.itemName;
                const countryLabel = item.itemText;
                const color = item.getColor();
                const emphasis = item.getEmphasis();
                const alpha = item.getCurrentAlpha();

                data = MoInVis.Paracoords.Data.wasteByCountries[country].data[chosenYear];
                const value = data[attribute];

                if ( value !== null && value !== '' ) {
                    _barChartData.push( {
                        name: countryLabel,
                        score: value,
                        color: color,
                        opacity: alpha,
                        emphasised: emphasis
                    } );
                    // If at least one entry is emphasised, sort button is necessary.
                    if ( !emphasis ) {
                        sortButtonNecessity = true;
                    }
                }
            }
        }

        _sortDataSet();
        _updateBarChart();
        _styleSortingButton();

        // Show sort button or not.
        if ( sortButtonNecessity ) {
            d3.select( '#axisDetailView_ButtonRight' )
                .style( 'visibility', 'visible' )
                .style( 'pointer-events', 'all' );
        }
        else {
            d3.select( '#axisDetailView_ButtonRight' )
                .style( 'visibility', 'hidden' )
                .style( 'pointer-events', 'none' );
        }
    };

    _init();
};


MoInVis.Paracoords.axisDetailView.baseCtor = MoInVis.Paracoords.overlayTab;