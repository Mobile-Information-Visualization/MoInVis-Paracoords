/*
*
* Descr.: Data Handlers extracts and prepares data for easy use and handling.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.Data = MoInVis.Paracoords.Data || {};

// Self calling function to initialize and provide functions to handle the data.
MoInVis.Paracoords.dataHandler = ( function () {
    var self = this,

        // Extracts data from the JSON objects and stores the property names in MoInVis.Paracoords.Data.wasteAttributes.
        _extractData = function ( data, propertyName, propertyText ) {
            var i,
                length,
                object,
                key,
                newObject,
                year,
                validItems = MoInVis.Paracoords.Data.itemsForWaste,
                itemValid,
                regionText,
                regionId;

            length = data.length;
            // [TODO]: Remove spaces from propertyName for ids.
            MoInVis.Paracoords.Data.wasteAttributes.push( { prop: propertyName, text: propertyText } );
            for ( i = 0; i < length; i++ ) {
                object = data[i];
                regionText = object.GEO;
                if ( regionText === '' ) {
                    // Ignore data objects belonging to no country.
                    continue;
                }
                itemValid = false;
                // Create the objects by name
                regionId = regionText.replace( /\s+/g, '_sp_' ).replace( /\(/g, '_ob_' ).replace( /\)/g, '_cb_' ).replace( /\\/g, '_bs_' ).replace( /\'/g, '_sq_' ).replace( /\"/g, '_dq_' );
                if ( MoInVis.Paracoords.Data.wasteByCountries[regionId] === undefined ) {
                    MoInVis.Paracoords.Data.wasteByCountries[regionId] = newObject = {
                        data: {},
                        text: regionText
                    };
                } else {
                    newObject = MoInVis.Paracoords.Data.wasteByCountries[regionId];
                }
                for ( key in object ) {
                    if ( key !== 'GEO' && key !== '' ) { // Only focus on valid values.
                        if ( newObject.data[key] === undefined ) {
                            newObject.data[key] = {};
                        }

                        newObject.data[key][propertyName] = object[key];
                        if ( object[key] !== null ) {
                            // An item is valid only if it has valid values( not null )
                            itemValid = true;
                        }
                        year = Number( key );
                        // Store all year attributes found for objects.
                        if ( MoInVis.Paracoords.Data.yearsForWaste.indexOf( year ) === -1 ) {
                            MoInVis.Paracoords.Data.yearsForWaste.push( year );
                        }
                    }
                }
                if ( itemValid && validItems.indexOf( regionId ) === -1 ) { // If item has at least one valid entry.
                    validItems.push( regionId ); // All valid items are stored in this array.
                }
            }
        },

        // Initializes the data.
        _initData = function () {
            MoInVis.Paracoords.Data.wasteByCountries = {};
            MoInVis.Paracoords.Data.itemsForWaste = [];
            MoInVis.Paracoords.Data.yearsForWaste = [];
            MoInVis.Paracoords.Data.wasteAttributes = [];

            // Extract data from the JSON files.
            _extractData( MoInVis.Paracoords.Data.totalWaste, 'totalWaste', 'Total Waste' );
            _extractData( MoInVis.Paracoords.Data.primaryWaste, 'primaryWaste', 'Primary Waste' );
            _extractData( MoInVis.Paracoords.Data.secondaryWaste, 'secondaryWaste', 'Secondary Waste' );
            _extractData( MoInVis.Paracoords.Data.rubberWaste, 'rubberWaste', 'Rubber Waste' );
            _extractData( MoInVis.Paracoords.Data.glassWaste, 'glassWaste', 'Glass Waste' );
            _extractData( MoInVis.Paracoords.Data.healthCareBioWaste, 'healthCareBioWaste', 'HC/Bio Waste' );
            _extractData( MoInVis.Paracoords.Data.plasticWaste, 'plasticWaste', 'Plastic Waste' );
            _extractData( MoInVis.Paracoords.Data.chemWaste, 'chemWaste', 'Chemical Waste' );
            _extractData( MoInVis.Paracoords.Data.paperCardboardWaste, 'paperCardboardWaste', 'Paper & Cardboard Waste' );
            _extractData( MoInVis.Paracoords.Data.textileWaste, 'textileWaste', 'Textile Waste' );
            _extractData( MoInVis.Paracoords.Data.discardedVehicles, 'discardedVehicles', 'Discarded Vehicles' );
            _extractData( MoInVis.Paracoords.Data.animalAndMixedFoodWaste, 'animalAndMixedFoodWaste', 'Animal & Mixed Food Waste' );
            _extractData( MoInVis.Paracoords.Data.animalFaecesUrineAndManure, 'animalFaecesUrineAndManure', 'Animal Faeces, Urine & Manure' );
            _extractData( MoInVis.Paracoords.Data.vegetalWaste, 'vegetalWaste', 'Vegetal Waste' );
            _extractData( MoInVis.Paracoords.Data.householdAndSimilarWaste, 'householdAndSimilarWaste', 'Household & Similar Waste' );
            _extractData( MoInVis.Paracoords.Data.metalWasteFerrousAndNon, 'metalWasteFerrousAndNon', 'Metal Waste (Ferrous & Non)' );
            _extractData( MoInVis.Paracoords.Data.woodWaste, 'woodWaste', 'Wood Waste' );

            // [TODO]: Source more data, or the right data.

            MoInVis.Paracoords.Data.yearsForWaste.sort();
        };

    _initData();
    // Accessible object stored as MoInVis.Paracoords.dataHandler
    return {
        // Return functions to the outside to access in case of later data handling scenarios.
    };
} )();