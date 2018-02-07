;(function($, window, undefined) {
    
    // constructor function for object(class)
    $.MagnifyZoom = function(options, selectedElement) {
        
        // store the passed in element in a property named $imageContainer
        this.$imageContainer = $(selectedElement);
        
        //call method _init and passed-in options
        this._init(options);
        
    };
    
    //Assign defaults property with object literals
    $.MagnifyZoom.defaults = {
        width: 300,
        height: 300,
        cornerRounding: '50%'
        
    };
    
    //object's method definitions via the prototype property
    $.MagnifyZoom.prototype = {
        
        _init: function(options) {
            
            //Create an image object named imageObject
            imageObject = new Image();
            
            //reference the img.small element and assign to imageObject src attribute
            imageObject.src = $('.small').attr('src');
            
            //create properties for new imageObject
            this.options = $.extend($.MagnifyZoom.defaults, options);
            this.nativeWidth = imageObject.width;
            this.nativeHeight = imageObject.height;
            this.$glass = $('.large');
            this.$smallImage = $('.small');
            
            //Call objects _getLocation() methods
            this._getLocation();
            
        },
        
            
        _getLocation: function() {
            
            //Store this in variable named self
            self = this;
            
            //Set up a mouse movement event handler
            this.$imageContainer.mousemove(function(e) {
                
                //Wrap the object the mousemove occured on
                $target = $(this);
                
                //Get coordinates of element relative to the edges of the webpage (document)
                magnifyOffset = $target.offset();
                
                //Subtract the left and top offset values to get our mouse location
                self.mouseX = e.pageX - magnifyOffset.left;
                self.mouseY = e.pageY - magnifyOffset.top;
            
                //Call _zoom() method passing $target
                self._zoom($target);
                
            });
            
        },
            
        _zoom: function($target) {
            
            //If the mouse is over the div '.magnify'
            if (this.mouseX >= 0 && this.mouseY >= 0 && this.mouseX <= $target.width() && this.mouseY <= $target.height()) {
                
                //fade in glass
                this.$glass.stop().fadeIn(500);
                
            } else {
                
                //fade out glass
                this.$glass.stop().fadeOut(500);
            }
            
            //If the glass is visible
            if (this.$glass.is(':visible')) {
                
                //Use jQuery method to determin width and height of magnifying glass object
                glassWidth = this.$glass.width();
                glassHeight = this.$glass.height();
                
                //Determine x and y positions for the background image
                rx = Math.round(this.mouseX / this.$smallImage.width() * this.nativeWidth - glassWidth/2) * -1;
                ry = Math.round(this.mouseY / this.$smallImage.height() * this.nativeHeight - glassHeight/2) * -1;
                
                //Determine the left and top positioning values for magnifying glass
                posX = this.mouseX - glassWidth/2;
                posY = this.mouseY - glassHeight/2;
                
                //Use jQuery css method to apply values
                this.$glass.css({
                    
                    width: this.options.width,
                    height: this.options.height,
                    borderRadius: this.options.cornerRounding,
                    left: posX,
                    top: posY,
                    backgroundPosition: rx + "px " + ry + "px"
                       
                });
                
            }
        }
    };
    
    // method definition - defines function and related object
    $.fn.magnifyZoom = function(options) {
        
        if (typeof options === 'string') {
            
            // not as common, leave off code for now...
            
        } else {  // options !== 'string', usually meaning it is an object
            
            // here, this refers the jQuery object that was used
            // to call this plugin method $('.magnify')
            this.each(function() {
                
                //now this refers to div#quoteRotator because each()'s
                //function changed the context of this to refer to the
                //matched element being looped over right now in each()
                var instance = $.data(this, 'magnifyZoom');
                
                if (instance) {
                    
                    instance._init();
                    
                } else {
                    
                   instance = $.data(this, 'magnifyZoom', new $.MagnifyZoom(options, this)); 
                    
                }
                
            });
            
        }
        
        return this; //Make our plugin magnifyZoom method chainable
           
     }
    
})(jQuery, window);

//this.mouseX >= 0 && this.mouseX <= $target.width && this.mouseY >= 0 && this.mouseY <= $target.height