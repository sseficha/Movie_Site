$(document).ready(function(){
	var back = $("#back").attr("src");
	$("body").css("background-image","url("+back+")");
});


$(".btn").on("click",function(){
	$.ajax({
   url: '/add_history',   
   method: "POST",
   data: $('#hiddenform').serialize(),                 
   // complete: function () {                        
   //    window.location="/home";
   //  }
	});
});

$(".small").on("mouseenter",function() {
    $(this).toggleClass("entered");
});

$(".small").on("mouseout",function() {
    $(this).toggleClass("entered");
});

$(".small2").on("click",function(){
	var id=$("#id2").val();
	window.location.replace("/search/"+id);
});

$(".small3").on("click",function(){
	var id=$("#id3").val();
	window.location.replace("/search/"+id);
});

$(".small4").on("click",function(){
	var id=$("#id4").val();
	window.location.replace("/search/"+id);
});

$(".small1").on("click",function(){
	var id=$("#id1").val();
	window.location.replace("/search/"+id);
});