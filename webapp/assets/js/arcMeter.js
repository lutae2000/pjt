// Daniel Leber 2016
// .. enjoy :)

var arcMeter = function( selector, p, ops ){
	
	var svgMaker = function( selector ){
		this.createShape = function( shape ){
			this.shape = document.createElementNS("http://www.w3.org/2000/svg", shape);
			return this;
		}
	
		this.setSelector = function( selector ){
			this.selector = selector; // must be svg container (not svg). 
			return this;
		}
	
		this.setShapeAttrs = function( ar ){
			this.setAttrs( this.shape, ar );
			return this;
		}
	
		this.setAttrs = function( e, ar ){
			var self = this;
			$.each( ar, function( n, v ){
				e.setAttribute( n, v );
			});
			return this;
		}
	
		this.clearShape = function(){
			this.shape = null;
			return this;
		}

		this.makeShape = function(){
			$( this.selector + ' svg' ).append( this.shape );
			return this;
		}

		this.addTxt = function( percent, txtOps ){

			var styles = {  
					position: 'absolute',
					top: $( this.selector ).find( 'circle' ).attr( 'cy' ) + "px",
					left:$( this.selector ).find( 'circle' ).attr( 'cx' ) + "px",
					textAlign: 'center',
					margin: 'auto',
					left: '0px',
					right: '0px',
					top: '0px',
					bottom: '0px',
					fontSize: '26pt',
					height: '40px' // may need overwriting depending on font size
				}; // default
		
			var e = document.createElement( 'div' );
		
			$.each( styles, function( n, v ){
				e.style[ n ] = v;
			});

			if( 'class' in txtOps )
				e.setAttribute( 'class', txtOps.class );
		
			var text = txtOps.txt || formatPercent( percent );
			e.innerHTML = text;

			$( this.selector ).append( e );
			return this;
		}
	
		function makeSvg( self, ops ){
			self.svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
			self.setAttrs( self.svg, ops );
			$( self.selector ).html( self.svg );
		}
		
		function formatPercent( p ){
			return (p * 100).toFixed(1) + '%';
		}
		
		this.setSelector( selector );
		makeSvg( this,  ops.style.svg );
	};

	function makeArc( selector, percent, ops ){
	
		var svg = new svgMaker( selector );	

		var svgAttr = ops.style.svg,
			cAttr = calcCAttr( svgAttr );
	
		var bottomAttr = mergeObj( cAttr, ops.style.bottomC ), // bottom circle attributes
			topAttr = mergeObj( cAttr, ops.style.topC );  // top circle attributes

		// Offset topcircle to display the given p (percentage)
		topAttr.style =	calcStrokeOffset( p, cAttr.r );

		// Construct & output the bottom circle
		svg
			.createShape( 'circle' )
			.setShapeAttrs( bottomAttr ) 
			.makeShape();
		
		// Construct & output the top circle
		svg
			.clearShape()
			.createShape( 'circle' )
			.setShapeAttrs( topAttr )
			.makeShape()
			.addTxt( percent, ops.txt || {} );	


		// Run callback
		if( 'callback' in ops ) ops.callback( selector, percent, ops );

		function calcCAttr( svgAttr ){
			// Circle Attributes

			var svgW = parseFloat( svgAttr.width ) - 2 * parseFloat( svgAttr.padding ),
				svgH = parseFloat( svgAttr.height ) - 2 * parseFloat( svgAttr.padding );
			
			var cx = svgW / 2 + parseFloat( svgAttr.padding ),
				cy = svgH / 2 + parseFloat( svgAttr.padding ),
				r = Math.min( svgW, svgH ) / 2;
			
			var cAttr = {
				cx			: cx,
				cy			: cy,
				r			: r,
				fill 		: 'none',
				transform 	: 'rotate(-90, '+ cx +', '+ cy +')'
			};

			return cAttr;
		}
		
		function mergeObj( o1, o2 ){
			// merge 2 objects into a new object.
			var o3 = {}, k;
		
			for( k in o1 )	
				o3[ k ] = o1[ k ];
		
			for( k in o2 )
				o3[ k ] = o2[ k ];

			return o3;	
		}

		function calcStrokeOffset( p, r ){
			var circ = 2 * Math.PI * r,
				offest = circ * ( 1 - p );
			return 'stroke-dasharray: '+circ+'; stroke-dashoffset: '+offest;
		}

	}
	
	makeArc( selector, p, ops );

};