for(var i=0;i<data.length;i++)
{
	var large = '<div class="card" id='+data[i].id+'><img class="card-img-top" src='+data[i].image_ref+' alt="Card image cap"><div class="card-body"><h5 class="card-title">'+data[i].title+'</h5><h6 class="card-subtitle">Downloads: '+data[i].downloads+'</h6></div></div>';
	$(".card-deck").append(large);
	$(".card").addClass("animated bounceInDown fast");
}	