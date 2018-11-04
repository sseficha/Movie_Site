
$(".sbar").val("");

$("#logout").on("click",function(){
	$.ajax({
		type: "GET",
		url: "/logout",
		complete: function(){
			window.location="/login";	
		}
	});
});

$("input").on("keypress",function(e){
	if(e.which == 13)
	{
		$(".card").addClass("animated bounceOutDown fast");
		var query=$(this).val();
		$.ajax({
		type: "GET",
		url: "/home/"+query,
	    success: function(data){
	    	$(".card-deck").empty();
		   	$(".tab").text("RESULTS");


	    	if(data.length == 0){
	    		var warning = '<h1>Sorry I could not find this :(</h1>';
	     		$(".card-deck").append(warning);
		     	$("h1").addClass("animated bounceInDown fast");



	    	}
	    	else
		    {	
		     	for(var i=0;i<data.length;i++)
		     	{
		     		var large = '<div class="card" id='+data[i].id+'><img class="card-img-top" src='+data[i].image_ref+' alt="Card image cap"><div class="card-body"><h5 class="card-title">'+data[i].title+'</h5><h6 class="card-subtitle">Downloads: '+data[i].downloads+'</h6></div></div>';

		     		$(".card-deck").append(large);
		     		$(".card").addClass("animated bounceInDown fast");
		     	}	
	  		}

		}
		});
	}

});	

$(document).on("click",".card-img-top",function(){
	var id=$(this).parent().attr("id");
    window.location="/search/"+id;

});

$(document).on("mouseenter",".card-img-top",function(){
	$(this).css("opacity",0.7);
});

$(document).on("mouseout",".card-img-top",function(){
	$(this).css("opacity",1);
});


// $(".card").each(function(){
// 	if($(this).children(".card-img-top").attr("src")=="empty")
// 	{
// 		$(this).css("visibility", "hidden");
// 	}
// });
