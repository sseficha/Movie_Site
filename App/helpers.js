



module.exports = {




					
getMoviesHistory:function(user)
{
	var temp=user.moviesHistory;
	var temp= JSON.stringify(temp);	//na  pairnei olo to table!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	return JSON.parse(temp);
	

	// for(var i=0; i<temp.length; i++)
	// {
	// 	temp2=user.populate(temp[i]);
	// 	console.log(temp2);
	// }
}


,format_data:function(data)
{
	var formated_data= new Array();
	for(var i=0;i<data.data.movie_count;i++)
	{
		formated_data.push(
		{
			 id: data.data.movies[i].id,
			 title: data.data.movies[i].title_english,
			 year: data.data.movies[i].year,
			 rating: data.data.movies[i].rating,
			 genres: data.data.movies[i].genres,
			 description: data.data.movies[i].description_full,
			 image_ref: data.data.movies[i].large_cover_image,
			 background: data.data.movies[i].background_image,
			 torrent_size: data.data.movies[i].torrents[0].size,
			 torrent_url: data.data.movies[i].torrents[0].url,
			 downloads:0
		});
	}
	return formated_data;
}

,format_data_one:function(data)
{
	var formated_data={
			id: data.data.movie.id,
			 title: data.data.movie.title_english,
			 year: data.data.movie.year,
			 rating: data.data.movie.rating,
			 genres: data.data.movie.genres,
			 description: data.data.movie.description_full,
			 image_ref: data.data.movie.large_cover_image,
			 background: data.data.movie.background_image,
			 torrent_size: data.data.movie.torrents[0].size,
			 torrent_url: data.data.movie.torrents[0].url,
			 downloads:0	

	}
	return formated_data;

}


,format_data_sug:function(data)
{
	var formated_data= new Array();
	for(var i=0;i<data.data.movie_count;i++)
	{
		formated_data.push({

			id: data.data.movies[i].id,
			image_ref: data.data.movies[i].medium_cover_image

		});
	}
	return formated_data;	
}



}