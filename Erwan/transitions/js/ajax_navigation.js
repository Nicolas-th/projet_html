var Transition = function(){
	var _this = this;
	_this.params = {};
	var defaults = {
		conteneur : '#conteneur',
		pages : [],
		opened : null
	}

	_this.init = function(params){
		_this.params = $.extend(defaults, params);

		_this.params.historyAPI = ((window.history.pushState && window.history.back)?true:false);

		for(var key=0; key<_this.params.pages.length; key++){
			var page = _this.params.pages[key];

			$(page.element).addClass('md-modal md-effect-1');

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

		$('.md-overlay').on('click',function(){
			if(_this.params.opened!=null){
				_this.close(_this.params.opened);
			}
		});
	};

	_this.open = function(page){
		var href = $(page.links.open).attr('href');
		$.ajax({
			url : href,
			success : function(data){
	      		$(page.element).html($('<div></div>').addClass('md-content').html(data));
	      		if(href!=window.location){
	      			if(_this.params.historyAPI){
			    		window.history.pushState({path:href},'',href);
			    	}
			    }
			    if(_this.params.opened!=null){
			    	_this.close(_this.params.opened);
			    }
			    _this.params.opened = page;
			    window.setTimeout(function(){ 
			    	$(page.element).addClass('md-show');
			    },200); // Délai d'attente avant la transition pour que le css soit appliqué
	   		}
		});
	};

	_this.close = function(page){
		$(page.element).html('');
		$(page.element).removeClass('md-show');
		if(_this.params.historyAPI){
	    	window.history.back();
	    }
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