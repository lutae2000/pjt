
//document.addEventListener('DOMContentLoaded', loaded, false);

$(function(){

    var s_cnt = $("select").size();	
	
	for(var i=0; i < s_cnt; i++){					

		var labelText =  $("select:eq("+i+") option:selected").text();
		$("select:eq("+i+")").prev("label").text( labelText);
	}

	$("select").change(function(){			
		var index = $("select").index(this);
		$("select:eq("+index+")").prev("label").text( $("select:eq("+index+") option:selected").text());			
	});

}); 


//select box
function fn_select(name){        
    var select = $("select#"+name);	    
	var select_name = select.children("option:selected").text();   
	$("select#"+name).siblings("#selectLabel_"+name).text(select_name);	
}

//go back page
function fn_goBack(){
    history.back(-2);
}


//wrap height
/*
 $(document).ready(function(){    
    var wrapHeight = $(window).height() - $(".header").height();	
    if($(window).height() > $("body").height()){
        $(".wrap").css("height", wrapHeight - $("#bottom").height());
    }
});


$( window ).resize(function() {
    var wrapHeight = $(window).height() - $(".header").height();	
    if($(window).height() > $("body").height()){
        $(".wrap").css("height", wrapHeight - $("#bottom").height());
    }
});
*/



function fn_show_layer(id){ 
    $('#mask').fadeTo("slow",0.5); 

    $('#'+id).fadeIn(500);      
    $("#"+id).show();
    $('body').bind('touchmove', function(e){e.preventDefault()});

}

function fn_close_layer(){
    $('.layer').fadeOut(500);  
    $('#mask').fadeOut(500);    
    $('body').unbind('touchmove');
} 

function fn_close_select_layer(id){
    $('#'+id).fadeOut(500);  
} 

