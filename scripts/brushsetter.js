var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
/*
*
* Descr.: Handles data and UI functionality for the brush setter overlay tab.
*         Inherits MoInVis.Paracoords.overlayTab
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.brushSetter = function ( moin, parentDiv ) {
    this.moin = moin;
    MoInVis.Paracoords.brushSetter.baseCtor.call( this, parentDiv );

    var self = this,
        _parentDiv = parentDiv,
        _vueData,
        _vueApp,
        _brushesCopy,

        _closeTab = function ( event ) {
            self.deactivateTab();
            this.pointerDownX = false;
        },

        _labelClick = function ( event, item ) {
            if ( event.target.nodeName !== 'BUTTON' && event.target.nodeName !== 'SPAN' && event.target.nodeName !== 'INPUT' && event.target.className.indexOf( 'modal' ) === -1 ) {
                item.inFocus = true;
            }
        },

        _enableDisableBrush = function () {

        },

        _incrementValue = function () {
            var stepVal = Math.floor( ( this.brushprops.axisRange[1] - this.brushprops.axisRange[0] ) / 10 ),
                brushSt = this.brushprops.range[0],
                brushEnd = this.brushprops.range[1],
                temp;
            if ( this.startValueActive ) {
                brushSt += stepVal;
                if ( brushSt > this.brushprops.axisRange[1] ) {
                    brushSt = this.brushprops.axisRange[1];
                } else if ( brushSt > brushEnd ) {
                    temp = brushSt;
                    brushSt = brushEnd;
                    brushEnd = temp;
                    _updateEndVal( this.brushprops, brushEnd );
                    this.startValueActive = false;
                }
                _updateStartVal( this.brushprops, brushSt );
            } else {
                brushEnd += stepVal;
                if ( brushEnd > this.brushprops.axisRange[1] ) {
                    brushEnd = this.brushprops.axisRange[1];
                }
                _updateEndVal( this.brushprops, brushEnd );
            }
        },

        _decrementValue = function () {
            var stepVal = Math.floor( ( this.brushprops.axisRange[1] - this.brushprops.axisRange[0] ) / 10 ),
                brushSt = this.brushprops.range[0],
                brushEnd = this.brushprops.range[1],
                temp;
            if ( this.startValueActive ) {
                brushSt -= stepVal;
                if ( brushSt < this.brushprops.axisRange[0] ) {
                    brushSt = this.brushprops.axisRange[0];
                }
                _updateStartVal( this.brushprops, brushSt );
            } else {
                brushEnd -= stepVal;
                if ( brushEnd < this.brushprops.axisRange[0] ) {
                    brushEnd = this.brushprops.axisRange[0];
                } else if ( brushEnd < brushSt ) {
                    temp = brushEnd;
                    brushEnd = brushSt;
                    brushSt = temp;
                    _updateStartVal( this.brushprops, brushSt );
                    this.startValueActive = true;
                }
                _updateEndVal( this.brushprops, brushEnd );
            }
        },

        // Updates the copy when the changes in the modal dialog are accepted.
        _updateCopy = function ( item ) {
            var brush = _brushesCopy.find( brush => brush.axisName === item.axisName );
            if ( brush ) {
                brush.range[0] = item.range[0];
                brush.range[1] = item.range[1];
                brush.rangeText[0] = item.rangeText[0] = MoInVis.Paracoords.util.format( item.range[0] );
                brush.rangeText[1] = item.rangeText[1] = MoInVis.Paracoords.util.format( item.range[1] );
            }
        },

        // Reverts the values to copy's values when the changes in the modal dialog are cancelled.
        _revertToCopy = function ( item ) {
            var brush = _brushesCopy.find( brush => brush.axisName === item.axisName );
            if ( brush ) {
                item.range[0] = brush.range[0];
                item.range[1] = brush.range[1];
            }
        },

        // Handles slider changes.
        _sliderChange = function ( event ) {
            var newVal = event.target.valueAsNumber,
                brushSt = this.brushprops.range[0],
                brushEnd = this.brushprops.range[1];
            if ( this.startValueActive ) {
                if ( newVal > brushEnd ) {
                    brushSt = brushEnd;
                    brushEnd = newVal;
                    _updateEndVal( this.brushprops, brushEnd );
                    this.startValueActive = false;
                } else {
                    brushSt = newVal;
                }
                _updateStartVal( this.brushprops, brushSt );
            } else {
                if ( newVal < brushSt ) {
                    brushEnd = brushSt;
                    brushSt = newVal;
                    _updateStartVal( this.brushprops, brushSt );
                    this.startValueActive = true;
                } else {
                    brushEnd = newVal;
                }
                _updateEndVal( this.brushprops, brushEnd );
            }
        },

        _onKeyInput = function ( event ) {
            var newVal = Math.floor( event.target.valueAsNumber ),
                brushSt = this.brushprops.range[0],
                brushEnd = this.brushprops.range[1];

            this.enableTypeInput = false;
            if ( this.brushprops.axisRange[0] <= newVal && newVal <= this.brushprops.axisRange[1] ) {
                if ( this.startValueActive ) {
                    if ( newVal !== brushEnd ) {
                        if ( newVal > brushEnd ) {
                            brushSt = brushEnd;
                            brushEnd = newVal;
                            _updateEndVal( this.brushprops, brushEnd );
                            this.startValueActive = false;
                        } else {
                            brushSt = newVal;
                        }
                        _updateStartVal( this.brushprops, brushSt );
                    }
                } else {
                    if ( newVal !== brushSt ) {
                        if ( newVal < brushSt ) {
                            brushEnd = brushSt;
                            brushSt = newVal;
                            _updateStartVal( this.brushprops, brushSt );
                            this.startValueActive = true;
                        } else {
                            brushEnd = newVal;
                        }
                        _updateEndVal( this.brushprops, brushEnd );
                    }
                }
            }
        },

        _updateStartVal = function ( item, val ) {
            item.range[0] = val;
        },

        _updateEndVal = function ( item, val ) {
            item.range[1] = val;
        },

        _cancelModalChanges = function () {
            _revertToCopy( this.brushprops );
            this.$emit( 'close' );
        },

        _applyModalChanges = function () {
            _updateCopy( this.brushprops );
            this.$emit( 'close' );
        },

        _init = function () {
            var vueStuff,
                vueData = {
                    tabName: 'Brush Settings',
                    brushes: [],
                    pointerDownX: false
                },
                vueMethods = {
                    closeTab: _closeTab,
                    labelClick: _labelClick,
                    enableDisableBrush: _enableDisableBrush
                },
                vueComponents = {
                    'modal': {
                        data() {
                            return {
                                startValueActive: true,
                                plusButtonTouched: false,
                                minusButtonTouched: false,
                                keyButtonTouched: false,
                                cancelButtonTouched: false,
                                okButtonTouched: false,
                                enableTypeInput: false
                            }
                        },
                        methods: {
                            incrementValue: _incrementValue,
                            decrementValue: _decrementValue,
                            cancel: _cancelModalChanges,
                            okay: _applyModalChanges,
                            sliderChange: _sliderChange,
                            onKeyInput: _onKeyInput
                        },
                        props: ['brushprops'],
                        template:
                            `
                        <div class="modal-mask">
                            <div class="modal-wrapper">
                                <div class="modal-container">

                                    <div class="modal-header">
                                        <slot name="header">
                                            {{brushprops.axisName}}
                                            </slot>
                                    </div>

                                    <div class="modal-body">
                                        <label :class="startValueActive?'active':''" @click="startValueActive = true">
                                            {{brushprops.range[0]}}
                                            </label>
                                            -
                                        <label :class="startValueActive?'':'active'" @click="startValueActive = false">
                                            {{brushprops.range[1]}}
                                            </label>
                                    </div>

                                    <div class="modal-body2">
                                        <input type="range" :min="brushprops.axisRange[0]" :max="brushprops.axisRange[1]"
                                            :value="startValueActive?brushprops.range[0]:brushprops.range[1]" v-on:input="sliderChange($event)" />
                                        <div>
                                            <label style="left: 8%; position: relative;">min</label>
                                            <label style="left: 80%; position: relative;">max</label>
                                        </div>
                                        <div>
                                            <button :class="'minus-plus-button' + (plusButtonTouched?' active':'')" @pointerdown="plusButtonTouched = true" @pointerup="plusButtonTouched = false" @click="incrementValue" >&plus;</button>
                                            <button :class="'minus-plus-button' + (minusButtonTouched?' active':'')" @pointerdown="minusButtonTouched = true" @pointerup="minusButtonTouched = false" @click="decrementValue" >&minus;</button>
                                        </div>
                                    </div>

                                    <div class="modal-footer">
                                        <slot name="footer">
                                            <button :class="'modal-default-button right' + (okButtonTouched?' active':'')" @pointerdown="okButtonTouched = true" @pointerup="okButtonTouched = false" @click="okay">
                                                OK
                                            </button>
                                            <transition name="brushTextInput">
                                                <input class="modal-default-input" v-if="enableTypeInput" step="1" type="number" :min="brushprops.axisRange[0]" :max="brushprops.axisRange[1]"
                                            :value="startValueActive?brushprops.range[0]:brushprops.range[1]" v-on:change="onKeyInput($event)" v-on:focusout="enableTypeInput = false" />
                                            </transition>
                                            <button :class="'modal-default-button right' + (cancelButtonTouched?' active':'')" @pointerdown="cancelButtonTouched = true" @pointerup="cancelButtonTouched = false" @click="cancel">
                                                Cancel
                                            </button>
                                            <button :class="'modal-default-button left' + (keyButtonTouched?' active':'')" @pointerdown="keyButtonTouched = true" @pointerup="keyButtonTouched = false" @click="enableTypeInput = !enableTypeInput"><i class="fa fa-keyboard-o" style="font-size:inherit;color:inherit"></i></button>
                                        </slot>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                    }
                };

            vueStuff = self.initVue( vueData, vueMethods, vueComponents );
            _vueApp = vueStuff.mainApp;
            _vueData = vueStuff.dataProxy;
            _parentDiv.style( 'background', 'rgba( 50, 50, 50, 0.85)' );
        };

    this.onTabActivated = function () {
        // Get brush configurations.
        var brushConfig = this.moin.paracoorder.getBrushConfigurations();
        brushConfig.forEach( ( config, index ) => _vueData.brushes.splice( index, 1, config ) );
        //Vue.set( _vueData.brushes, index, config );
        _brushesCopy = MoInVis.Paracoords.util.deepCopy( brushConfig ); // Create a copy of the brushes.
    };

    _init();
};

MoInVis.Paracoords.brushSetter.baseCtor = MoInVis.Paracoords.overlayTab;