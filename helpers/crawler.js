var crawler = require("crawler"),
	CronJobManager = require('cron-job-manager'),
	push = require( 'pushsafer-notifications' ),
	moment = require('moment');

// GOLBALES
var cron_manager = new CronJobManager();

launch_cron();
function launch_cron(){
	cron_manager.add('my_cron_id', '* * * * *', () => { launch_crawler() }, { start:true, timeZone:"Europe/Paris"});
}


function launch_crawler() {
	var p = new push( {
    	k: 'x69TslUVLawkr9uRldIT',
    	debug: true
	}),
	notification_content = {
    	t: "",           // Title (optional)
    	m: '',								   // Message (required)
    	s: '10',                               // Sound (value 0-28) (optional)
    	v: '2',                                // Vibration (empty or value 1-3) (optional)
    	i: '55',                               // Icon (value 1-98) (optional)
    	c: '',                          // Icon color hexadecimal color code (optional)
    	d: 'a',								   // Device or Device Group id (optional)
    	// u: '',        						   // an URL (optional)
    	// ut: '',                   			   // URLs title (optional)
    	// l: '',                                 // Time to Live (optional)
    	pr: '2',                               // Priority (optional: -2, -1, 0, 1, 2)
    	// re: '0',                               // Retry (optional: 60-10800 seconds)
    	// ex: '0',                               // Expire (optional: 60-10800 seconds)
    	// cr: '20',                              // Confirm (optional: 60-10800 seconds)
    	a: '1',                                // Answer
    	// p: '',                                 // Image converted to > Data URL with Base64-encoded string (optional)
    	// p2: '',                                // Image 2 converted to > Data URL with Base64-encoded string (optional)
    	// p3: ''                                 // Image 3 converted to > Data URL with Base64-encoded string (optional)
	},
	delay_new_notif = false;
	delay_new_notif_2 = false;

	var c = new crawler({
    	maxConnections : 10,
    	// This will be called for each crawled page
   		callback : function (error, res, done) {
        	if(error){
        	    console.log('error:' + error);
        	}else{
				let html_body = res.body,
					ul_anchor = html_body.indexOf("class=\"list _backed _nom\""),
					first_song = html_body.slice(ul_anchor, (ul_anchor + 550)),
					first_artist_anchor = first_song.indexOf("<span class=\"artist\">"),
					first_artist_last_anchor = first_song.indexOf("</span><span class=\"title\">"),
					first_artist = first_song.slice((first_artist_anchor+21), first_artist_last_anchor),
					first_title_anchor = first_artist_last_anchor + 27,
					first_title_last_anchor = first_song.indexOf("</span></div></li><li class=\"row \"><div class=\"time\">"),
					first_title = first_song.slice(first_title_anchor, first_title_last_anchor),
					first_time_anchor = first_song.indexOf("<div class=\"time\">"),
					first_time_last_anchor = first_song.indexOf("</div><div class=\"inner _l\"><span class=\"disp cover\">"),
					first_time = first_song.slice((first_time_anchor+18), first_time_last_anchor);

				// console.log(first_song);
				console.log('*******************************************************');
				console.log(first_time + ' | title: ' + first_title + ' | artist: ' + first_artist);

				let second_song = html_body.slice((ul_anchor+ 550), (ul_anchor + (550*2))),
					second_artist_anchor = second_song.indexOf("<span class=\"artist\">"),
					second_artist_last_anchor = second_song.indexOf("</span><span class=\"title\">"),
					second_artist = second_song.slice((second_artist_anchor+21), second_artist_last_anchor),
					second_title_anchor = second_artist_last_anchor + 27,
					second_title_last_anchor = second_song.indexOf("</span></div></li><li class=\"row \"><div class=\"time\">"),
					second_title = second_song.slice(second_title_anchor, second_title_last_anchor),
					second_time_anchor = second_song.indexOf("<div class=\"time\">"),
					second_time_last_anchor = second_song.indexOf("</div><div class=\"inner _l\"><span class=\"disp cover\">"),
					second_time = second_song.slice((second_time_anchor+18), second_time_last_anchor);

				// console.log(second_song);
				console.log(second_time + ' | title: ' + second_title + ' | artist: ' + second_artist);

				if( first_title == 'Leave the door open' || first_artist == 'Silk Sonic (Bruno Mars et Anderson Paak)'){
					console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
					console.log('bruno mars');
					console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
				}

				if( first_title == 'Et meme apres je t\'aimerai' || first_artist == 'Hoshi'){
					console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
					console.log('hoshi');
					console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
				}

				// if( first_title == 'Leave the door open' || first_artist == 'Silk Sonic (Bruno Mars et Anderson Paak)'){
				// 	console.log(delay_new_notif_2);
				// 	if( delay_new_notif_2 == false ){
				// 		notification_content.t = "Le premier titre de la list est sortie!"
				// 		notification_content.m = "A: " + first_time + " | title: " + first_title + " | artist: " + first_artist
				// 		p.send( notification_content, function( err, result ) {
				// 			console.log('First Notification sent');
				// 			delay_new_notif_2 = true;
				// 			console.log('available notification' + ' ' + result)
				// 		});
				// 	}
				// }

				if( (first_title == 'Et meme apres je t\'aimerai' || first_artist == 'Hoshi') && (second_title == 'Leave the door open' || second_artist == 'Silk Sonic (Bruno Mars et Anderson Paak)')){
					console.log(delay_new_notif);
					if( delay_new_notif == false ){
						notification_content.t = "Les deux premier titres de la list sont sortie!"
						notification_content.m = first_time + " | title: " + first_title + " | artist: " + first_artist + ' | ' + second_time + ' | title: ' + second_title + ' | artist: ' + second_artist;
						p.send( notification_content, function( err, result ) {
    						console.log('Second Notification sent');
							delay_new_notif = true;
							console.log('available notification' + result.available)
						});

						// let new_cron_date = convert_date_to_cron( moment().add(5, 'm') );
						// console.log( new_cron_date );
						// cron_manager.add('delay_new_notif_cron', new_cron_date, () => { console.log('can send a new notif'); delay_new_notif = false }, { start:true, timeZone:"Europe/Paris" });
					}
				}
        	}
        	done();
    	}
	});
	c.queue('https://www.virginradio.fr/cetait-quoi-ce-titre/');
}



// CRON
function convert_date_to_cron( date ){
	return moment(date).minute() + ' ' + moment(date).hour() + ' ' + moment(date).date() + ' ' + moment(date).month() + ' *';
}

module.exports={
	'launch_crawler': launch_crawler,
}