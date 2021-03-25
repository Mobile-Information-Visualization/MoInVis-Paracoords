/*
*
* Descr.: Utility functions.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};


MoInVis.Paracoords.util = ( function () {
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
        }
    };
} )();
