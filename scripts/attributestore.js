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
        _axes = axes,
        _focusContextSettings = focusContextSettings,
        _vueData,
        _vueMethods,
        _vueComputed,
        _vueComponents,
        _vueApp,
        _sortable,
        // position the focus panel based on the main tab visualisation
        _focusPanelStartPosition = {
            x: 0,
            y: 0
        },
        _getFocusPanelStartPosition = function () {
            return _focusPanelStartPosition
        },

        _init = function () {
            var vueStuff,
                vueData = {
                    axesArray: _axes,
                    focusContextSettings: _focusContextSettings,
                    boxWidth: _boxWidth(),
                    boxHeight: _boxHeight(),
                    notSortableIndexFrom: _axes.length
                };
            _vueMethods = {
                decreaseNumber: _decreaseNumber,
                increaseNumber: _increaseNumber,
                check: _check
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
                forceFallback: false,
                scroll: true,
                scrollSensitivity: 200,
                scrollSpeed: 10,
                filter: ".disable",

                scrollFn: function ( offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl ) {

                },

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
                    let order = _sortable.toArray();

                    _axes.sort( function ( firstEl, secondEl ) {
                        let first = firstEl.attribute, second = secondEl.attribute;
                        if ( order.indexOf( first ) > order.indexOf( second ) ) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } );

                    //call to redraw  
                    self.moin.paraCoorderRedrawReq = true;
                }
            } );

            //draggable focus panel
            interact( '.draggable' ).draggable( {
                startAxis: 'y',
                lockAxis: 'y',
                inertia: true,
                // allowFrom: '.drag-handle-focusPanel',
                modifiers: [
                    interact.modifiers.snap( {
                        targets: [
                            interact.snappers.grid( { x: _boxWidth().long, y: _snapHeight() } )
                        ],
                        relativePoints: [{ x: 0, y: 0 }],
                        offset: 'parent',
                    } ),
                    interact.modifiers.restrictRect( {
                        restriction: 'parent'
                    } ),
                ],
                // enable autoScroll
                autoScroll: {
                    container: document.querySelector( 'main.axisStore' ),
                    margin: 50,
                    distance: 0,
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
                        d3.select( '.focusPanelBar' )
                            .transition()
                            .duration( 200 )
                            .style( 'width', _boxWidth().short / 8 + 'px' );
                        _vueData.focusContextSettings.focusIndex = Math.round( _focusPanelStartPosition.y / _snapHeight() );
                        if ( _vueData.focusContextSettings.focusIndex < 0 ) {
                            _vueData.focusContextSettings.focusIndex = 0;
                        }
                        if ( _vueData.focusContextSettings.focusIndex + _vueData.focusContextSettings.axesInFocus > _vueData.notSortableIndexFrom ) {
                            _vueData.focusContextSettings.focusIndex = _vueData.notSortableIndexFrom - _vueData.focusContextSettings.axesInFocus;
                            self.onTabFocus();
                        }
                        //call to redraw  
                        self.moin.paraCoorderRedrawReq = true;
                    }
                }
            } );
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
                this.focusContextSettings.axesInFocus -= 1;
            }
        },

        _increaseNumber = function () {
            // 'this' refer to the proxy of the sent data created by vue.
            if ( this.focusContextSettings.axesInFocus >= this.focusContextSettings.minAxesInFocus &&
                this.focusContextSettings.axesInFocus < this.focusContextSettings.maxAxesInFocus && this.focusContextSettings.axesInFocus < this.notSortableIndexFrom ) {
                this.focusContextSettings.axesInFocus += 1;
            }
        },

        //move the list to bottom
        _check = function ( e, axis, index ) {
            if ( axis.visible ) { //when false -> true
                if ( index >= this.notSortableIndexFrom ) { //checked item within unckecked items
                    //remove the axis from array
                    this.axesArray.splice( this.axesArray.indexOf( axis ), 1 );

                    //then add that axis to the bottom of array
                    this.axesArray.splice( this.notSortableIndexFrom, 0, axis );

                    this.notSortableIndexFrom++;
                    axis.setVisibility( axis.visible );
                    self.moin.paraCoorderRedrawReq = true;
                }
            } else { //when true -> false
                if ( this.notSortableIndexFrom === this.focusContextSettings.minAxesInFocus ) { //can't uncheck item when reach minAxesInFocus
                    axis.setVisibility( !axis.visible );
                } else {
                    //remove the axis from array
                    this.axesArray.splice( this.axesArray.indexOf( axis ), 1 );

                    //then add that axis to the bottom of array
                    this.axesArray.push( axis );

                    this.notSortableIndexFrom--;
                    axis.setVisibility( axis.visible );

                    if ( this.focusContextSettings.axesInFocus > this.notSortableIndexFrom ) {
                        this.focusContextSettings.axesInFocus = this.notSortableIndexFrom;
                    }

                    if ( this.focusContextSettings.focusIndex + this.focusContextSettings.axesInFocus > this.notSortableIndexFrom ) {
                        this.focusContextSettings.focusIndex = this.notSortableIndexFrom - this.focusContextSettings.axesInFocus;
                        self.onTabFocus();
                    }

                    self.moin.paraCoorderRedrawReq = true;
                }
            }
            //[TODO]: call to redraw
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

        _getNumberAxesInFocus = function () {
            return this.focusContextSettings.axesInFocus;
        };

    _init();

    // Called whenever this tab comes into focus.
    this.onTabFocus = function () {
        _focusPanelStartPosition.y = _focusContextSettings.focusIndex * _snapHeight();
        d3.select( '.focusPanel.draggable' )
            .transition()
            .style( 'transform', `translate(${_focusPanelStartPosition.x}px, ${_focusPanelStartPosition.y}px)` );
    };
};

MoInVis.Paracoords.attributeStore.baseCtor = MoInVis.Paracoords.tab;