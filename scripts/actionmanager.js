/*
*
* Descr.: Action Manager. Manages the actions to be done at a later point in time.
*
* <Description>
*/
var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};

MoInVis.Paracoords.actionManager = function ( item ) {
    // Private variables.
    var self = this,
        _item = item,
        _actions = [],
        _actionBunch = [],
        _bunchingActions = false;

    this.addAction = function ( functionToCall, context, params ) {
        if ( _bunchingActions ) {
            _actionBunch.push( new MoInVis.Paracoords.action( functionToCall, context, params ) );
        } else {
            _actions.push( new MoInVis.Paracoords.action( functionToCall, context, params ) );
        }
    };

    this.addActionBunch = function () {
        if ( _actionBunch.length > 0 ) {
            if ( _actionBunch.length === 1 ) {
                _actions.push( _actionBunch[0] );
            } else {
                _actions.push( _actionBunch );
            }
            _actionBunch = [];
        }
        _bunchingActions = false;
    };

    this.startActionBunch = function () {
        _bunchingActions = true;
    };

    this.undo = function () {
        var action;
        if ( _actions.length > 0 ) {
            action = _actions.pop();
            if ( Array.isArray( action ) ) {
                while ( action.length > 0 ) {
                    action.pop().execute();
                }
            } else {
                action.execute();
            }
        }
    };

    this.do = function () {
        // Function for posterity.
    };

    this.hasActions = function () {
        return _actions.length > 0;
    };

    this.cleanSlate = function () {
        _actions.forEach( action => {
            if ( Array.isArray( action ) ) {
                action.forEach( act => act.destroy() );
            } else {
                action.destroy()
            }
        } );
        _actions = [];
    };
};

MoInVis.Paracoords.action = function ( functionToCall, context, params ) {
    var _functionToCall = functionToCall,
        _context = context,
        _params = params; // Array of parameters.

    this.destroy = function () {
        _functionToCall = null;
        _context = null;
        _params = null;
    };

    this.execute = function ( context, params ) {
        _functionToCall.apply( context || _context, params || _params );
        this.destroy();
    };
};