var dataParser = function () {
    var dataParser = {};
    dataParser.parse = function (file) {
        Papa.parse(file, {
            header: true,
            complete: function (results) {
                console.log(results);
                this.downloadJSON(results.data, file.name);
            }.bind(this),
            dynamicTyping: function ( headerName ) {
                // Use this array to enter header names that contain numerical data nad must be parsed as numbers in JSON, not as string.
                var numericalHeaders = ['2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'];
                return numericalHeaders.indexOf(headerName) >= 0;
            },
            transform: function ( value, headerName ) {
                if ( this.dynamicTypingFunction( headerName ) ) {
                    value = value.split( ',' ).join( '' );
                }
                if ( value === ':' ) {
                    value = '';
                }
                return value;
            }
        });
    }
    dataParser.downloadJSON = function (data, fileName) {
        // Source - https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser

        var downloadElement = document.createElement('a');
        downloadElement.setAttribute( "href", "data:text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( data ) ) );
        if ( fileName.indexOf( '.csv' ) > -1 ) {
            downloadElement.setAttribute( "download", fileName.split( '.csv' )[0] + ".json" );
        } else if ( fileName.indexOf( '.xlsx' ) > -1 ) {
            downloadElement.setAttribute( "download", fileName.split( '.xlsx' )[0] + ".json" );
        } else {
            downloadElement.setAttribute( "download", fileName.split( '.' )[0] + ".json" );
        }
        document.body.appendChild(downloadElement); // required for firefox
        downloadElement.click();
        downloadElement.remove();
    }
    return dataParser;
}();