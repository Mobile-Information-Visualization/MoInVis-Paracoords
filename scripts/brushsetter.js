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
        _closeTab = function ( event ) {
            self.deactivateTab();
            this.pointerDownX = false;
        },
        _labelClick = function ( event, item ) {
            if ( event.target.nodeName !== 'BUTTON' && event.target.nodeName !== 'SPAN' && event.target.nodeName !== 'INPUT' && event.target.className.indexOf( 'modal' ) === -1 ) {
                item.inFocus = true;
            }
        },

        _init = function () {
            var vueStuff,
                vueData = {
                    tabName: 'Brush Settings',
                    brushes: [],
                    pointerDownX: false
                },
                vueMethods = { closeTab: _closeTab, labelClick: _labelClick };
            vueStuff = self.initVue( vueData, vueMethods );
            _vueApp = vueStuff.mainApp;
            _vueData = vueStuff.dataProxy;

            _parentDiv.style( 'background', 'rgba( 50, 50, 50, 0.85)' );

            // [TODO]: Send the component as an object vueComponents to initVue so it can be set before mounting. Check if this removes warning logged.
            _vueApp.component( 'modal', {
                data() {
                    return {
                        startValueActive: true,
                        plusButtonTouched: false,
                        minusButtonTouched: false,
                        keyButtonTouched: false,
                        cancelButtonTouched: false,
                        okButtonTouched: false
                    }
                },
                props: ['brushprops'],
                template:
                    `
                    <transition name="modal">
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
                                            {{brushprops.rangeText[0]}}
                                            </label>
                                            -
                                        <label :class="startValueActive?'':'active'" @click="startValueActive = false">
                                            {{brushprops.rangeText[1]}}
                                            </label>
                                    </div>

                                    <div class="modal-body2">
                                        <input type="range" :min="brushprops.axisRange[0]" :max="brushprops.axisRange[1]"
                                            :value="startValueActive?brushprops.range[0]:brushprops.range[1]">
                                        <div>
                                            <label style="left: 8%; position: relative;">min</label>
                                            <label style="left: 80%; position: relative;">max</label>
                                        </div>
                                        <div>
                                            <button :class="'minus-plus-button' + (plusButtonTouched?' active':'')" @pointerdown="plusButtonTouched = true" @pointerup="plusButtonTouched = false" >&plus;</button>
                                            <button :class="'minus-plus-button' + (minusButtonTouched?' active':'')" @pointerdown="minusButtonTouched = true" @pointerup="minusButtonTouched = false" >&minus;</button>
                                        </div>
                                    </div>

                                    <div class="modal-footer">
                                        <slot name="footer">
                                            <button :class="'modal-default-button right' + (okButtonTouched?' active':'')" @pointerdown="okButtonTouched = true" @pointerup="okButtonTouched = false" @click="$emit('close')">
                                                OK
                                            </button>
                                            <button :class="'modal-default-button right' + (cancelButtonTouched?' active':'')" @pointerdown="cancelButtonTouched = true" @pointerup="cancelButtonTouched = false" @click="$emit('close')">
                                                Cancel
                                            </button>
                                            <button :class="'modal-default-button left' + (keyButtonTouched?' active':'')" @pointerdown="keyButtonTouched = true" @pointerup="keyButtonTouched = false"><i class="fa fa-keyboard-o" style="font-size:inherit;color:inherit"></i></button>
                                        </slot>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    `
            } );
        };

    this.onTabActivated = function () {
        // Get brush configurations.
        var brushConfig = this.moin.paracoorder.getBrushConfigurations();
        brushConfig.forEach( ( config, index ) => _vueData.brushes.splice( index, 1, config ) );
        //Vue.set( _vueData.brushes, index, config );
    };

    _init();
};

MoInVis.Paracoords.brushSetter.baseCtor = MoInVis.Paracoords.overlayTab;