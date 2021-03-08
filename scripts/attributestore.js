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

    console.log( axes ); //Jimmy: Debug

    var self = this,
        _parentDiv = parentDiv,
        _axes = axes,
        _vueData,
        _vueMethods,
        _vueComputed,
        _vueComponents,
        _vueApp,
        _getAxes = function () { return _axes; },
        _sortable,
        _getSortable = function(){ return _sortable},
        // position the focus panel based on the main tab visualisation
        _focusPanelStartPosition = {x:0, y:0},
        _getFocusPanelStartPosition = function(){ return _focusPanelStartPosition},


        _init = function () {
            _vueData = {
                tabName: 'I am the Attribute Store!',
                axesArray: _axes,
                maxAxesInFocus: 6,
                minAxesInFocus: 2,
                numberAxesInFocus: 5,
                listWidth: document.querySelector('label.attribute').offsetWidth,
                boxHeight: document.querySelector('label.attribute').offsetHeight,
            };
            _vueMethods = {
                decreaseNumber: _decreaseNumber,
                increaseNumber: _increaseNumber,

            };

            _vueComputed = {

                isMinusButtonDisabled: _isMinusButtonDisabled,
                isPlusButtonDisabled: _isPlusButtonDisabled,
                computeListWidth: _listWidth,

            };

            //_vueComponents ={

            //    'component-a': ComponentA



            //};


            _vueApp = self.initVue( _vueData, _vueMethods, _vueComputed );

            _sortable = Sortable.create( simpleList, {
                handle: '.my-handle',
                dataIdAttr: 'id',
                direction: 'vertical',
                forceFallback: false,
                
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

                    var order = _sortable.toArray();

                    console.log('new order: ' +  order )
                    //a.shift();
                    console.log( "dragged element's old index: " + evt.oldIndex );

                    console.log( "dragged element's new index: " + evt.newIndex );

                    _axes.sort( function (a, b) {
                        var A = a.attribute, B = b.attribute;
                        
                        if (order.indexOf(A) > order.indexOf(B)) {
                          return 1;
                        } else {
                          return -1;
                        }
                        
                      });
                }
            } );

            
            interact('.draggable').draggable({
                startAxis: 'y',
                lockAxis: 'y',
                inertia: true,

                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent'
                    })
                ],
                // enable autoScroll
                

                autoScroll: {
                    container: document.querySelector('main.axisStore'),
                    margin: 100,
                    distance: 5,
                    interval: 10,
                    speed: 600,
                  },

                
               
                listeners: {
                    start (event) {
                        console.log(event.type, event.target)
                    },
                    move (event) {
                        // position.x += event.dx
                        _focusPanelStartPosition.y += event.dy
              
                        event.target.style.transform =
                        `translate(${ _focusPanelStartPosition.x}px, ${ _focusPanelStartPosition.y}px)`

                       

                    
                    },
                    
                }
            });
            
            

        },


        //methods
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

        _listWidth = function () {

            // this.listWidth = this.numberAxesInFocus * document.querySelector('.attList').offsetWidth;
            // return this.listWidth;
            
        };

    //const ComponentA = {

    //    props:{

    //        data:{
    //            type: Array
    //        }

    //    },

    //    /* ... */
    //    template: 
    //    /*html*/ 
    //    `<script>



    //    //var a = data;

    //    Sortable.create(simpleList, { handle: ".my-handle",
    //    onEnd: function (/**Event*/evt) {
    //        var itemEl = evt.item;  
    //        evt.to;    
    //        evt.from;  
    //        evt.oldIndex; 
    //        evt.newIndex;  
    //        evt.oldDraggableIndex; 
    //        evt.newDraggableIndex; 
    //        evt.clone 
    //        evt.pullMode; 


    //        console.log(a)
    //        //a.shift();
    //        console.log("dragged element's old index: " + evt.oldIndex);

    //        console.log("dragged element's new index: " + evt.newIndex);
    //    }



    //    });


    //    </script>`,
    //    data(){
    //        return {

    //        }
    //    },
    //}



    _init();
    MoInVis.Paracoords.attributeStore.getAxes = _getAxes;
    MoInVis.Paracoords.attributeStore.getSortable = _getSortable;
    MoInVis.Paracoords.attributeStore._getFocusPanelStartPosition = _getFocusPanelStartPosition;
};

MoInVis.Paracoords.attributeStore.baseCtor = MoInVis.Paracoords.tab;





