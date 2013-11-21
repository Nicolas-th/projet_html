var Transition = function(){
	var _this = this;
	_this.params = {};
	var defaults = {
		conteneur : '#conteneur',
		pages : [],
		animation : {
			style : {
				opacity : {
					min : 0,
					max : 1
				}
			},
			duration : 1000,
			easing : 'swing',
			complete : function(){}
		},
		opened : null
	}

	_this.init = function(params){
		_this.params = $.extend(defaults, params);

		for(var key=0; key<_this.params.pages.length; key++){
			var page = _this.params.pages[key];
			(function(page) {
				$(_this.params.conteneur).on('click',page.links.open,function(evt){
					evt.preventDefault();
					_this.open(page);
				});

				$(_this.params.conteneur).on('click',page.links.close,function(evt){
					evt.preventDefault();
					_this.close(page);
				});
			})(page);
		}
	};

	_this.open = function(page){
		var href = $(page.links.open).attr('href');
		$.ajax({
			url : href,
			success : function(data){
	      		$(page.element).html(data);
	      		if(href!=window.location){
			    	window.history.pushState({path:href},'',href);
			    }
			    if(_this.params.opened!=null){
			    	_this.close(_this.params.opened);
			    }
			    _this.params.opened = page;
			    $(page.element).animate(
			    	{
			    		left : 0, 
			    		opacity : _this.params.animation.style.opacity.max
			    	},
			    	{
			   			duration : _this.params.animation.duration,
			   			easing : _this.params.animation.easing,
			   			complete : _this.params.animation.complete
			   		}
			    );;
	   		}
		});
	};

	_this.close = function(page){
		$(page.element).html('');
		$(page.element).animate(
	    	{
	    		left : document.body.offsetWidth, 
	    		opacity : _this.params.animation.style.opacity.min
	    	},
	    	{
	   			duration : _this.params.animation.duration,
	   			easing : _this.params.animation.easing,
	   			complete : _this.params.animation.complete
	   		}
	    );
	    window.history.back();
	    _this.params.opened = null;
	};
}

$(function(){
	var transition = new Transition();
	transition.init({
		conteneur : 'body',
		pages : [
			{
				element : '#page_1',
				links : {
					open : '.open_page_1',
					close : '.ajax_nav'
				}
			},
			{
				element : '#page_2',
				links : {
					open : '.open_page_2',
					close : '.ajax_nav'
				}
			}
		]
	});
});