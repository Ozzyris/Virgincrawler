var crawler = require("crawler"),
	CronJobManager = require('cron-job-manager'),
	push = require( 'pushsafer-notifications' );;

// GOLBALES
var cron_manager = new CronJobManager();

launch_cron();
function launch_cron(){
	cron_manager.add('my_cron_id', '* * * * *', () => { launch_crawler() }, { start:true, timeZone:"Europe/Paris", start:true });
}


function launch_crawler() {
	var p = new push( {
    	k: '0DJyv3heSd0TuPeCiC8N',
    	debug: true
	}),
	notification_content = {
    	t: "Time to win some money",           // Title (optional)
    	m: '',								   // Message (required)
    	s: '10',                               // Sound (value 0-28) (optional)
    	v: '2',                                // Vibration (empty or value 1-3) (optional)
    	i: '98',                               // Icon (value 1-98) (optional)
    	c: '#FF0000',                          // Icon color hexadecimal color code (optional)
    	d: 'a',								   // Device or Device Group id (optional)
    	u: '',        						   // an URL (optional)
    	ut: '',                   			   // URLs title (optional)
    	l: '',                                 // Time to Live (optional)
    	pr: '2',                               // Priority (optional: -2, -1, 0, 1, 2)
    	re: '60',                              // Retry (optional: 60-10800 seconds)
    	ex: '60',                              // Expire (optional: 60-10800 seconds)
    	cr: '20',                              // Confirm (optional: 60-10800 seconds)
    	a: '1',                                // Answer
    	p: '',                                 // Image converted to > Data URL with Base64-encoded string (optional)
    	p2: '',                                // Image 2 converted to > Data URL with Base64-encoded string (optional)
    	p3: ''                                 // Image 3 converted to > Data URL with Base64-encoded string (optional)
	};

	var c = new crawler({
    	maxConnections : 10,
    	// This will be called for each crawled page
   		callback : function (error, res, done) {
        	if(error){
        	    console.log(error);
        	}else{
				let html_body = res.body,
					ul_anchor = html_body.indexOf("class=\"list _backed _nom\""),
					first_song = html_body.slice(ul_anchor, (ul_anchor + 465)),
					first_artist_anchor = first_song.indexOf("<span class=\"artist\">"),
					first_artist_last_anchor = first_song.indexOf("</span><span class=\"title\">"),
					first_artist = first_song.slice((first_artist_anchor+21), first_artist_last_anchor),
					first_title_anchor = first_artist_last_anchor + 27,
					first_title_last_anchor = first_song.indexOf("</span></div></li><li class=\"row \"><div class=\"time\">"),
					first_title = first_song.slice(first_title_anchor, first_title_last_anchor);

				// console.log(first_song);
				console.log('Last title: ' + first_title + ' | artist: ' + first_artist);

				let second_song = html_body.slice((ul_anchor+ 465), (ul_anchor + (465*2))),
					second_artist_anchor = second_song.indexOf("<span class=\"artist\">"),
					second_artist_last_anchor = second_song.indexOf("</span><span class=\"title\">"),
					second_artist = second_song.slice((second_artist_anchor+21), second_artist_last_anchor),
					second_title_anchor = second_artist_last_anchor + 27,
					second_title_last_anchor = second_song.indexOf("</span></div></li><li class=\"row \"><div class=\"time\">"),
					second_title = second_song.slice(second_title_anchor, second_title_last_anchor);

				// console.log(second_song);
				console.log('Previous title: ' + second_title + ' | artist: ' + second_artist);

				if( second_title == 'Silk Sonic (Bruno Mars et Anderson Paak)' || second_artist == 'Leave the door open'){
					console.log('bruno mars');
				}

				if( first_title == 'Hoshi' || first_artist == 'Et meme apres je t\'aimerai'){
					console.log('hoshi');
				}

				if( second_artist == 'The kid laroi' || second_title == 'Without you'){
					notification_content.m = 'Last title: ' + first_title + ' | artist: ' + first_artist;
					notification_content.m += 'Previous title: ' + second_title + ' | artist: ' + second_artist;
					p.send( notification_content, function( err, result ) {
    					// console.log( 'ERROR:', err );
    					console.log( 'RESULT', result );
    					// process.exit(0);
					});
				}

				if( (first_title == 'Hoshi' || first_artist == 'Et meme apres je t\'aimerai') && (second_title == 'Silk Sonic (Bruno Mars et Anderson Paak)' || second_artist == 'Leave the door open')){
					notification_content.m = 'Last title: ' + first_title + ' | artist: ' + first_artist;
					notification_content.m += 'Previous title: ' + second_title + ' | artist: ' + second_artist;
					p.send( notification_content, function( err, result ) {
    					// console.log( 'ERROR:', err );
    					console.log( 'RESULT', result );
    					// process.exit(0);
					});
				}
        	}
        	done();
    	}
	});
	c.queue('https://www.virginradio.fr/cetait-quoi-ce-titre/');
}

module.exports={
	'launch_crawler': launch_crawler,
}