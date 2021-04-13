/*
*
* Descr.: Utility functions.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};


MoInVis.Paracoords.util = ( function () {
    var _colours = 10,
        _getNormalColour = index => d3.schemeCategory10[index % _colours],
        _getColourblindSafeColour = index => d3.interpolateRdYlBu( ( index % _colours ) / ( _colours - 1 ) );
    return {
        format: function ( val ) {
            if ( val > 1000000 ) {
                val = ( val / 1000000 ).toFixed( 2 ) + ' mil';
            } else if ( val > 100000 ) {
                val = ( val / 1000 ).toFixed( 2 ) + ' k';
            } else {
                val = val.toFixed( 2 );
            }
            return val;
        },

        deepCopy: function ( obj ) {
            var newObj, prop;
            if ( Array.isArray( obj ) ) {
                newObj = [];
            } else if ( typeof obj === 'object' ) {
                newObj = {};
            } else {
                return obj;
            }
            for ( prop in obj ) {
                if ( obj.hasOwnProperty( prop ) ) {
                    newObj[prop] = this.deepCopy( obj[prop] );
                }
            }
            return newObj;
        },

        getColour: function ( index, colourblindSafe ) {
            var colour;
            if ( colourblindSafe ) {
                colour = _getColourblindSafeColour( index );
            } else {
                colour = _getNormalColour( index );
            }
            return colour;
        }
    };
} )();
