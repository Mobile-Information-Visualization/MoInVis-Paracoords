/*
*
* Descr.: Handles data and UI functionality for the attribute store tab.
*         Inherits MoInVis.Paracoords.tab
*
* <Description>
*/
var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.attributeStore = function ( moin, parentDiv, axes, focusContextSettings ) {
    this.moin = moin;
    MoInVis.Paracoords.attributeStore.baseCtor.call( this, parentDiv );

    var self = this,
        _parentDiv = parentDiv,
        _hammerMan,
        _axes = axes,
        _focusContextSettings = focusContextSettings,
        _vueData,
        _vueMethods,
        _vueComputed,
        _vueComponents,
        _vueApp,
        _sortable,
        _undoManager,
        // position the focus panel based on the main tab visualisation
        _focusPanelStartPosition = {
            x: 0,
            y: 0
        },
        _getFocusPanelStartPosition = function () {
            return _focusPanelStartPosition;
        },

        _init = function () {
            var vueStuff,
                vueData = {
                    axesArray: _axes,
                    focusContextSettings: _focusContextSettings,
                    boxWidth: _boxWidth(),
                    boxHeight: _boxHeight(),
                    notSortableIndexFrom: _axes.length,
                    undoButtonEnabled: false
                };

            _undoManager = new MoInVis.Paracoords.actionManager( self );

            _vueMethods = {
                decreaseNumber: _decreaseNumber,
                increaseNumber: _increaseNumber,
                check: _check,
                undo: _undoAction
            };

            _vueComputed = {
                isMinusButtonDisabled: _isMinusButtonDisabled,
                isPlusButtonDisabled: _isPlusButtonDisabled,
                computeListWidth: _boxWidth,
                getNumberAxesInFocus: _getNumberAxesInFocus
            };

            vueStuff = self.initVue( vueData, _vueMethods, _vueComputed );
            _vueApp = vueStuff.mainApp;
            _vueData = vueStuff.dataProxy;

            //drag and sort axes 
            _sortable = Sortable.create( simpleList, {
                handle: '.my-handle',
                dataIdAttr: 'id',
                direction: 'vertical',

                filter: ".disable",

                scroll: true, // Enable the plugin. Can be HTMLElement.
                // scrollFn: function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) {  }, // if you have custom scrollbar scrollFn may be used for autoscrolling
                scrollSensitivity: 100, // px, how near the mouse must be to an edge to start scrolling.
                scrollSpeed: 10, // px, speed of the scrolling
                // bubbleScroll: true,// apply autoscroll to all parent elements, allowing for easier movement
                forceFallback: false,

                delay: 50,
                touchStartThreshold: 30,

                onMove: function ( evt, originalEvent ) {
                    // Example: https://jsbin.com/nawahef/edit?js,output
                    //evt.dragged; // dragged HTMLElement
                    //evt.draggedRect; // DOMRect {left, top, right, bottom}
                    //evt.related; // HTMLElement on which have guided
                    //evt.relatedRect; // DOMRect
                    //evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
                    //originalEvent.clientY; // mouse position
                    // return false; — for cancel
                    // return -1; — insert before target
                    // return 1; — insert after target
                    // return true; — keep default insertion point based on the direction
                    // return void; — keep default insertion point based on the direction
                    return evt.related.className.indexOf( 'unchecked' ) === -1;
                },
                onEnd: function ( evt ) {
                    if ( evt.newIndex !== evt.oldIndex ) {
                        let order = _sortable.toArray();

                        _addAction( _undoReorder, undefined, [_axes.map( axis => axis.attribute )] );

                        order.forEach( ( name, index ) => {
                            _vueData.axesArray.splice( index, 0, _vueData.axesArray.splice( _vueData.axesArray.findIndex( axis => axis.attribute === name ), 1 )[0] );
                        } );

                        //call to redraw  
                        self.moin.paraCoorderRedrawReq = true;
                    }
                }
            } );

            //draggable focus panel
            interact( '.draggable' ).draggable( {
                startAxis: 'y',
                // lockAxis: 'y',
                // inertia: true,
                hold: 1,
                // allowFrom: '.focusPanel',
                modifiers: [
                    interact.modifiers.snap( {
                        targets: [
                            interact.snappers.grid( { x: _boxWidth().long, y: _snapHeight() } )
                        ],
                        relativePoints: [{ x: 0, y: 0 }],
                        offset: 'parent',
                    } ),
                    interact.modifiers.restrictRect( {
                        restriction: 'parent',
                        endOnly: true,
                        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                    } ),
                ],
                // enable autoScroll
                autoScroll: {
                    container: document.querySelector( 'main.axisStore' ),
                    margin: 10,
                    distance: 50,
                    interval: 10,
                    speed: 600
                },
                listeners: {
                    start( event ) {
                        d3.select( '.focusPanelBar' )
                            .transition()
                            .duration( 200 )
                            .style( 'width', _boxWidth().long + 'px' );
                    },
                    move( event ) {
                        // position.x += event.dx
                        _focusPanelStartPosition.y += event.dy;

                        event.target.style.transform =
                            `translate(${_focusPanelStartPosition.x}px, ${_focusPanelStartPosition.y}px)`;
                    },
                    end( event ) {
                        var newFI;
                        d3.select( '.focusPanelBar' )
                            .transition()
                            .duration( 200 )
                            .style( 'width', _boxWidth().short / 8 + 'px' );
                        newFI = Math.round( _focusPanelStartPosition.y / _snapHeight() );
                        if ( newFI < 0 ) {
                            newFI = 0;
                        }
                        if ( newFI + _vueData.focusContextSettings.axesInFocus > _vueData.notSortableIndexFrom ) {
                            newFI = _vueData.notSortableIndexFrom - _vueData.focusContextSettings.axesInFocus;
                            _setFocusIndex( newFI );
                            _adjustFocusPanel();
                        } else {
                            _setFocusIndex( newFI );
                        }
                        //call to redraw  
                        self.moin.paraCoorderRedrawReq = true;
                    }
                }
            } );

            self.addSwipeHelper( d3.select( '#simpleList' ).node() );
        },

        //class function
        _boxWidth = function () {
            let attrTextBox = document.querySelector( 'label.attribute' ),
                attrHandleBox = document.querySelector( 'label.my-handle' ),
                style = getComputedStyle( document.querySelector( 'li.attrList' ) ),
                marginLeft = parseInt( style.marginRight ) || 0,
                paddingLeft = parseInt( style.paddingRight ) || 0;
            return { short: paddingLeft + attrHandleBox.clientWidth, long: attrTextBox.clientWidth + attrHandleBox.clientWidth };
        },

        _boxHeight = function () {
            let box = document.querySelector( 'li.attrList' );
            return box.clientHeight;
        },

        _snapHeight = function () {
            let box = document.querySelector( 'li.attrList' );
            return box.clientHeight;
        },

        //vue methods
        _decreaseNumber = function () {
            // 'this' refer to the proxy of the sent data created by vue.
            if ( this.focusContextSettings.axesInFocus <= this.focusContextSettings.maxAxesInFocus && this.focusContextSettings.axesInFocus > this.focusContextSettings.minAxesInFocus ) {
                _setNumberAxesInFocus( this.focusContextSettings.axesInFocus - 1 );
                self.moin.paraCoorderRedrawReq = true;
            }
        },

        _increaseNumber = function () {
            // 'this' refer to the proxy of the sent data created by vue.
            if ( this.focusContextSettings.axesInFocus >= this.focusContextSettings.minAxesInFocus &&
                this.focusContextSettings.axesInFocus < this.focusContextSettings.maxAxesInFocus && this.focusContextSettings.axesInFocus < this.notSortableIndexFrom ) {
                _setNumberAxesInFocus( this.focusContextSettings.axesInFocus + 1 );
                self.moin.paraCoorderRedrawReq = true;
            }
        },

        //move the list to bottom
        _check = function ( e, axis, index ) {
            var axisIndex;
            _startActionBunch();
            if ( axis.visible ) { //when false -> true
                if ( index >= this.notSortableIndexFrom ) { //checked item within unckecked items
                    //remove the axis from array
                    axisIndex = this.axesArray.indexOf( axis );
                    this.axesArray.splice( axisIndex, 1 );

                    //then add that axis to the bottom of array
                    this.axesArray.splice( this.notSortableIndexFrom, 0, axis );

                    this.notSortableIndexFrom++;
                    axis.setVisibility( axis.visible );
                    _addAction( _undoVisibility, this, [axis, !axis.visible, axisIndex] );

                    self.moin.paraCoorderRedrawReq = true;
                }
            } else { //when true -> false
                if ( this.notSortableIndexFrom === this.focusContextSettings.minAxesInFocus ) { //can't uncheck item when reach minAxesInFocus
                    axis.setVisibility( !axis.visible );
                } else {
                    //remove the axis from array
                    axisIndex = this.axesArray.indexOf( axis );
                    this.axesArray.splice( axisIndex, 1 );

                    //then add that axis to the bottom of array
                    this.axesArray.push( axis );

                    this.notSortableIndexFrom--;
                    axis.setVisibility( axis.visible );
                    _addAction( _undoVisibility, this, [axis, !axis.visible, axisIndex] );

                    if ( this.focusContextSettings.axesInFocus > this.notSortableIndexFrom ) {
                        _setNumberAxesInFocus( this.notSortableIndexFrom );
                    }

                    if ( this.focusContextSettings.focusIndex + this.focusContextSettings.axesInFocus > this.notSortableIndexFrom ) {
                        _setFocusIndex( this.notSortableIndexFrom - this.focusContextSettings.axesInFocus );
                        _adjustFocusPanel();
                    }

                    self.moin.paraCoorderRedrawReq = true;
                }
            }
            _addActionBunch();
        },

        _addAction = function ( functionToCall, context, params ) {
            _undoManager.addAction( functionToCall, context, params );
            _vueData.undoButtonEnabled = _undoManager.hasActions();
        },

        _startActionBunch = function () {
            _undoManager.startActionBunch();
        },

        _addActionBunch = function () {
            _undoManager.addActionBunch();
            _vueData.undoButtonEnabled = _undoManager.hasActions();
        },

        _undoAction = function () {
            _undoManager.undo();
            _vueData.undoButtonEnabled = _undoManager.hasActions();
        },

        _undoVisibility = function ( axis, visibility, prevAxisIndex ) {
            var axisIndex;
            axis.visible = visibility; // To change the vue view.
            axis.setVisibility( axis.visible );
            //remove the axis from array
            axisIndex = this.axesArray.indexOf( axis );
            this.axesArray.splice( axisIndex, 1 );
            //then add that axis to its previous position in array
            this.axesArray.splice( prevAxisIndex, 0, axis );
            if ( visibility ) {
                this.notSortableIndexFrom++;
            } else {
                this.notSortableIndexFrom--;
            }
        },

        _undoReorder = function ( oldOrder ) {
            oldOrder.forEach( ( name, index ) => {
                _vueData.axesArray.splice( index, 0, _vueData.axesArray.splice( _vueData.axesArray.findIndex( axis => axis.attribute === name ), 1 )[0] );
            } );
            //_vueData.axesArray.sort( function ( firstEl, secondEl ) {
            //    let first = firstEl.attribute, second = secondEl.attribute;
            //    if ( oldOrder.indexOf( first ) > oldOrder.indexOf( second ) ) {
            //        return 1;
            //    } else {
            //        return -1;
            //    }
            //} );
        },

        _setNumberAxesInFocus = function ( numberAxesInFocus ) {
            _addAction( _undoNumberAxesInFocus, undefined, [_vueData.focusContextSettings.axesInFocus] );
            _vueData.focusContextSettings.axesInFocus = numberAxesInFocus;
        },

        _undoNumberAxesInFocus = function ( prevNumAxesInFocus ) {
            _vueData.focusContextSettings.axesInFocus = prevNumAxesInFocus;
        },

        _setFocusIndex = function ( focusIndex ) {
            _addAction( _undoFocusIndex, undefined, [_vueData.focusContextSettings.focusIndex] );
            _vueData.focusContextSettings.focusIndex = focusIndex;

        },

        _undoFocusIndex = function ( prevFocusIndex ) {
            _vueData.focusContextSettings.focusIndex = prevFocusIndex;
            _adjustFocusPanel();
        },

        //computed component
        _isMinusButtonDisabled = function () {
            if ( this.focusContextSettings.axesInFocus === this.focusContextSettings.minAxesInFocus ) {
                return false;
            } else {
                return true;
            }
        },

        _isPlusButtonDisabled = function () {
            if ( this.focusContextSettings.axesInFocus === this.focusContextSettings.maxAxesInFocus || this.focusContextSettings.axesInFocus === this.notSortableIndexFrom ) {
                return false;
            } else {
                return true;
            }
        },

        _adjustFocusPanel = function () {
            _focusPanelStartPosition.y = _focusContextSettings.focusIndex * _snapHeight();
            d3.select( '.focusPanel.draggable' )
                .transition()
                .style( 'transform', `translate(${_focusPanelStartPosition.x}px, ${_focusPanelStartPosition.y}px)` );
        },

        _getNumberAxesInFocus = function () {
            return this.focusContextSettings.axesInFocus;
        };

    _init();

    // Called whenever this tab comes into focus.
    this.onTabFocus = function () {
        // Forcing view update for _focusContextSettings.axesInFocus.
        var temp = _focusContextSettings.axesInFocus;
        _vueData.focusContextSettings.axesInFocus = 0;
        _vueData.focusContextSettings.axesInFocus = temp;

        // Set the notSortableIndexFrom property.
        for ( temp = 0; temp < _vueData.axesArray.length; temp++ ) {
            if ( _vueData.axesArray[temp].visible === false ) {
                break;
            }
        }
        _vueData.notSortableIndexFrom = temp;

        _adjustFocusPanel();

        // Forcing view update for axesArray ordering.
        _vueData.axesArray.splice( 0, 0, _vueData.axesArray.splice( 0, 1 )[0] );

        _undoManager.cleanSlate();
        _vueData.undoButtonEnabled = _undoManager.hasActions();
    };
};

MoInVis.Paracoords.attributeStore.baseCtor = MoInVis.Paracoords.tab;