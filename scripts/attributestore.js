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
    
    console.log(axes); //Jimmy: Debug
    
    var self = this,
        _parentDiv = parentDiv,
        _axes = axes,
        _vueData,
        _vueMethods,
        _vueComputed,
        _vueApp,
        _getAxes = function(){return _axes;},
       

        _init = function () {
            _vueData = {
                tabName: 'I am the Attribute Store!',
                axesArray: _axes,
                maxAxesInFocus: 6,
                minAxesInFocus: 2,
                numberAxesInFocus:5,            
            };
            _vueMethods = {
                decreaseNumber: _decreaseNumber,
                increaseNumber: _increaseNumber,
                
            };

            _vueComputed ={

                isMinusButtonDisabled: _isMinusButtonDisabled,
                isPlusButtonDisabled: _isPlusButtonDisabled

            };

            _vueComponents ={

                'component-a': ComponentA

                

            };

            
            _vueApp = self.initVue( _vueData, _vueMethods, _vueComputed, _vueComponents );
           
        };

        const ComponentA = {
            
            props:{

                data:{
                    type: Array
                }

            },
           
            /* ... */
            template: 
            /*html*/ 
            `<script>
            

        
            //var a = data;

            Sortable.create(simpleList, { handle: ".my-handle",
            onEnd: function (/**Event*/evt) {
                var itemEl = evt.item;  
                evt.to;    
                evt.from;  
                evt.oldIndex; 
                evt.newIndex;  
                evt.oldDraggableIndex; 
                evt.newDraggableIndex; 
                evt.clone 
                evt.pullMode; 

                
                console.log(a)
                //a.shift();
                console.log("dragged element's old index: " + evt.oldIndex);

                console.log("dragged element's new index: " + evt.newIndex);
            }
        
        
        
            });
            

            </script>`,
            data(){
                return {

                }
            },
        }

        //methods
        _decreaseNumber = function () {
                // 'this' refer to the proxy of the sent data created by vue.
                if (this.numberAxesInFocus <= this.maxAxesInFocus && this.numberAxesInFocus > this.minAxesInFocus){

                    this.numberAxesInFocus -= 1;
                    console.log("current number of axes in focus view: " + this.numberAxesInFocus);
                }
                            
        };

        _increaseNumber = function () {
            // 'this' refer to the proxy of the sent data created by vue.
            if (this.numberAxesInFocus >= this.minAxesInFocus && this.numberAxesInFocus < this.maxAxesInFocus){

                this.numberAxesInFocus += 1;
                console.log("current number of axes in focus view: " + this.numberAxesInFocus);
            }
                        
        };
        //computed component
        _isMinusButtonDisabled = function () {

            if(this.numberAxesInFocus == this.minAxesInFocus){
                return false;
            }
            else{
                return true;
            }
            
            
        }

        _isPlusButtonDisabled = function () {
            
            if(this.numberAxesInFocus == this.maxAxesInFocus){
                return false;
            }
            else{
                return true;
            }
        }



    _init();
    MoInVis.Paracoords.attributeStore.getAxes = _getAxes;
};

MoInVis.Paracoords.attributeStore.baseCtor = MoInVis.Paracoords.tab;



  

