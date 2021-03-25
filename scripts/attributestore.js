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

MoInVis.Paracoords.attributeStore = function ( moin, parentDiv, axes ) {

    this.moin = moin;
    MoInVis.Paracoords.attributeStore.baseCtor.call( this, parentDiv );

    var self = this,
        _parentDiv = parentDiv,
        _axes = axes,
        _vueData,
        _vueMethods,
        _vueComputed,
        _vueComponents,
        _vueApp,
        _getAxes = function () {
            return _axes;
        },
        _sortable,
        _getSortable = function () {
            return _sortable
        },
        // position the focus panel based on the main tab visualisation
        _focusPanelStartPosition = {
            x: 0,
            y: 0
        },
        _getFocusPanelStartPosition = function () {
            return _focusPanelStartPosition
        },
        _auto,

        _init = function () {
            var vueStuff,
                vueData = {
                    axesArray: _axes,
                    maxAxesInFocus: 6,
                    minAxesInFocus: 2,
                    numberAxesInFocus: 5,
                    boxWidth: _boxWidth(),
                    boxHeight: _boxHeight(),
                    items: [1, 2, 3, 4],
                    nextNum: 10
                };
            _vueMethods = {

                decreaseNumber: _decreaseNumber,
                increaseNumber: _increaseNumber,
                check: _check,

            };

            _vueComputed = {

                isMinusButtonDisabled: _isMinusButtonDisabled,
                isPlusButtonDisabled: _isPlusButtonDisabled,
                computeListWidth: _boxWidth,

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
                scrollFn: function ( offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl ) {

                },

                delay: 50,
                touchStartThreshold: 30,
                onEnd: function (/**Event*/evt ) {
                    var itemEl = evt.item;
                    evt.to;
                    evt.from;
                    evt.oldIndex;
                    evt.newIndex;
                    evt.oldDraggableIndex;
                    evt.newDraggableIndex;
                    evt.clone
                    evt.pullMode;

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
                        offset: 'parent'

                    } ),
                    interact.modifiers.restrictRect( {
                        restriction: 'parent'
                    } )
                ],
                // enable autoScroll
                autoScroll: {
                    container: document.querySelector( 'main.axisStore' ),
                    margin: 50,
                    distance: 0,
                    interval: 10,
                    speed: 600,

                },

                listeners: {
                    start( event ) {
                        console.log( event.type, event.target )
                        document.querySelector( '.focusPanelBar' ).style.width = _boxWidth().long + 'px';

                    },
                    move( event ) {
                        // position.x += event.dx
                        _focusPanelStartPosition.y += event.dy

                        event.target.style.transform =
                            `translate(${_focusPanelStartPosition.x}px, ${_focusPanelStartPosition.y}px)`

                    },
                    end( event ) {
                        document.querySelector( '.focusPanelBar' ).style.width = _boxWidth().short / 8 + 'px';
                    }
                }
            } );
        },

        //class function
        _boxWidth = function () {

            let attrTextBox = document.querySelector( 'label.attribute' );
            let attrHandleBox = document.querySelector( 'label.my-handle' );

            let style = getComputedStyle( document.querySelector( 'li.attrList' ) );
            let marginLeft = parseInt( style.marginRight ) || 0;
            let paddingLeft = parseInt( style.paddingRight ) || 0;

            return { short: paddingLeft + attrHandleBox.clientWidth, long: attrTextBox.clientWidth + attrHandleBox.clientWidth };

        },

        _boxHeight = function () {

            let box = document.querySelector( 'li.attrList' );
            return box.clientHeight;

        },

        _snapHeight = function () {

            let box = document.querySelector( 'li.attrList' );
            return box.clientHeight;

        }

    //vue methods
    _decreaseNumber = function () {
        // 'this' refer to the proxy of the sent data created by vue.
        if ( this.numberAxesInFocus <= this.maxAxesInFocus && this.numberAxesInFocus > this.minAxesInFocus ) {

            this.numberAxesInFocus -= 1;
            console.log( "current number of axes in focus view: " + this.numberAxesInFocus );
        }

    },

        _increaseNumber = function () {
            // 'this' refer to the proxy of the sent data created by vue.
            if ( this.numberAxesInFocus >= this.minAxesInFocus && this.numberAxesInFocus < this.maxAxesInFocus ) {

                this.numberAxesInFocus += 1;
                console.log( "current number of axes in focus view: " + this.numberAxesInFocus );
            }

        },

        //move the list to bottom
        _check = function ( e, axis, index ) {
            //@change event triggered before the boolean value is changed
            if ( axis.visible ) { //when true -> false
                axis.setVisibility( axis.visible );
                console.log( "checkbox true -> false: " );
            }
            else { //when false -> true
                //remove the axis from array
                this.axesArray.splice( this.axesArray.indexOf( axis ), 1 );
                console.log( this.axesArray )
                //then add that axis to the bottom of array
                this.axesArray.push( axis );
                axis.setVisibility( axis.visible );
                console.log( "checkbox false -> true: " );
            }
            //call to redraw  
            self.moin.paraCoorderRedrawReq = true;
        },

        //computed component
        _isMinusButtonDisabled = function () {

            if ( this.numberAxesInFocus == this.minAxesInFocus ) {
                return false;
            }
            else {
                return true;
            }

        },

        _isPlusButtonDisabled = function () {

            if ( this.numberAxesInFocus == this.maxAxesInFocus ) {
                return false;
            }
            else {
                return true;
            }
        },

        _init();

};

MoInVis.Paracoords.attributeStore.baseCtor = MoInVis.Paracoords.tab;





