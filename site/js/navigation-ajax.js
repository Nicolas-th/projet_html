var Transition = function(){
	var _this = this;
	_this.params = {};
	var defaults = {
		conteneur : '#conteneur',
		overlay : '.md-overlay',
		pages : [],
		opened : null,
		styles : {
			classShow : 'md-show',
			classContent : 'md-content',
			classContent : 'md-content',
			classPage : 'md-modal md-effect-1'
		}
	}

	_this.init = function(params){
		_this.params = $.extend(true, {}, defaults, params);

		_this.params.historyAPI = ((window.history.pushState && window.history.back)?true:false);

		_this.params.url = window.location;

		for(var key=0; key<_this.params.pages.length; key++){
			var page = _this.params.pages[key];

			$(page.element).addClass(_this.params.styles.classPage);

			(function(page) {
				$(_this.params.conteneur).on('click',page.links.open,function(evt){
					evt.preventDefault();
					_this.open(page,$(this).attr('href'));
				});

				$(_this.params.conteneur).on('click',page.links.close,function(evt){
					evt.preventDefault();
					_this.close(page);
				});
			})(page);
		}

		// Fermeture de la navigation Ajax
		$(_this.params.overlay).on('click',function(){
			if(_this.params.opened!=null){
				_this.close(_this.params.opened);
			}
		});

		// On détécte le retour en arrière
		$(window).on('popstate', function() {
			if(window.location==_this.params.url){
				if(_this.params.opened!=null){
					_this.close(_this.params.opened,false);
				}
			}
		});
	};

	_this.open = function(page,href){
		$.ajax({
			url : href,
			success : function(data){

				var titles = data.match("<title>(.*?)</title>"); 
				if(titles.length>=2){
                	var title = titles[1];
                }
                document.title = titles[1];

	      		$(page.element).html($('<div></div>').addClass(_this.params.styles.classContent).html(data));
	      		if(href!=window.location){
	      			if(_this.params.historyAPI){
			    		window.history.pushState({path:href},title,href);
			    	}
			    }
			    if(_this.params.opened!=null){
			    	_this.close(_this.params.opened);
			    }
			    _this.params.opened = page;

			    window.setTimeout(function(){ 
			    	$(page.element).addClass(_this.params.styles.classShow);
			    },200); // Délai d'attente avant la transition pour que le css soit appliqué
	   		}
		});
	};

	_this.close = function(page,backHistory){
		$(page.element).html('');
		$(page.element).removeClass(_this.params.styles.classShow);
		if(_this.params.historyAPI && backHistory!==false){
	    	window.history.back();
	    }
	    _this.params.opened = null;
	};
};