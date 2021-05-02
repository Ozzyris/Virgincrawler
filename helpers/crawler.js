var crawler = require("crawler"),
	CronJobManager = require('cron-job-manager'),
	push = require( 'pushsafer-notifications' ),
	moment = require('moment');

// GOLBALES
const cron_manager = new CronJobManager(),
	  songs = [],
	  config = require('../config'),
	  accountSid = config.twilio.account_sid,
	  authToken = config.twilio.auth_token,
	  client = require('twilio')(accountSid, authToken);


function init_virgin_crawler() {
	let song_list;

	crawl_website( 'https://www.virginradio.fr/cetait-quoi-ce-titre/' )
		.then( html => {
			let ul_first_anchor = html.indexOf("<ul class=\"list _backed _nom\">"),
				ul_last_anchor = html.indexOf("</span></a></li></ul></div><div class=\"right\">") + 21,
				ul_list = html.slice(ul_first_anchor, ul_last_anchor);
			
			song_list = ul_list.split('<li class="row ">');
			song_list.shift();


			return get_song_details( song_list[0] );
		})
		.then( song_details => {
			songs.push( song_details );
			return get_song_details( song_list[1] );
		})
		.then( song_details => {
			songs.push( song_details );
			return get_song_details( song_list[2] );
		})
		.then( song_details => {
			songs.push( song_details );
			return get_song_details( song_list[3] );
		})
		.then( song_details => {
			songs.push( song_details );
			return get_song_details( song_list[4] );
		})
		.then( song_details => {
			songs.push( song_details );

			console.log('*******************************************************');
			for (var i = 0; i <= (songs.length-1); i++) {
				console.log(songs[i].time + ' | title: ' + songs[i].title + ' | artist: ' + songs[i].artist);
			}

			cron_manager.add('my_cron_id', '* * * * *', () => { launch_virgin_crawler() }, { start:true, timeZone:"Europe/Paris"});
		})
		.catch( error => {
			console.log(error);
		})


}


function launch_virgin_crawler(){
	let song_list;

	crawl_website( 'https://www.virginradio.fr/cetait-quoi-ce-titre/' )
			.then( html => {
				let ul_first_anchor = html.indexOf("<ul class=\"list _backed _nom\">"),
				ul_last_anchor = html.indexOf("</span></a></li></ul></div><div class=\"right\">") + 21,
				ul_list = html.slice(ul_first_anchor, ul_last_anchor);
			
				song_list = ul_list.split('<li class="row ">');
				song_list.shift();

				return get_song_details( song_list[0] );
			})
			.then( song_details => {

				if( songs[0].title != song_details.title ){
					songs = [];
					return get_song_details( song_list[0] );
				}else{
					console.log('*******************************************************');
					console.log('Updated at ' + moment().format('LT'))
					throw('');
				}
			})
			.then( song_details => {
				songs.push( song_details );
				return get_song_details( song_list[1] );
			})
			.then( song_details => {
				songs.push( song_details );
				return get_song_details( song_list[2] );
			})
			.then( song_details => {
				songs.push( song_details );
				return get_song_details( song_list[3] );
			})
			.then( song_details => {
				songs.push( song_details );
				return get_song_details( song_list[4] );
			})
			.then( song_details => {
				songs.push( song_details );

				console.log('*******************************************************');
				for (var i = 0; i <= (songs.length-1); i++) {
					console.log(songs[i].time + ' | title: ' + songs[i].title + ' | artist: ' + songs[i].artist);
				}

				return check_song();

			})
			.then( winning_status => {
				console.log(winning_status);

				switch(winning_status) {
					case 'step 1':
						return send_twilio_sms( 'Burno Mars have been played', ['+33669999682', '+33769979186'] );
						break;
					case 'step 2':
						return send_twilio_sms( 'Burno Mars and Hoshi have been played', ['+33669999682', '+33769979186'] );
						break;
					case 'step 3':
						return send_twilio_sms( '🎆 🎆 Its Winning Time 🎆 🎆', ['+33669999682', '+33769979186'] );
						break;
					default:
						throw('');
				}
			})
			.then( is_sms_sent => {
				console.log( is_sms_sent );
			})
			.catch( error => {
				console.log(error);
			})
}



function get_song_details( song_html ){
	return new Promise((resolve, reject)=>{
		let artist_first_anchor = song_html.indexOf("<span class=\"artist\">"),
			artist_last_anchor = song_html.indexOf("</span><span class=\"title\">"),
			title_first_anchor = song_html.indexOf("<span class=\"title\">"),
			title_last_anchor = song_html.indexOf("</span></div></li>"),
			time_first_anchor = song_html.indexOf("<div class=\"time\">"),
			time_last_anchor = song_html.indexOf("</div><div class=\"inner _l\"><span class=\"disp cover\">");

		let song_details = {
			'artist': song_html.slice((artist_first_anchor+21), artist_last_anchor),
			'title': song_html.slice((title_first_anchor+20), title_last_anchor),
			'time': song_html.slice((time_first_anchor+18), time_last_anchor)
		}

		resolve( song_details );
	});
}

function crawl_website( website ){
	return new Promise((resolve, reject)=>{
		var crawler_one = new crawler({
    		maxConnections : 10,
   			callback : function (error, res, done) {
        		if(error){
        			reject( error );
        	    	console.log('error:' + error);
        		}else{
        			resolve( res.body );
        		}
        		done();
        	}
		});
		crawler_one.queue(website);
	});
}

function check_song(){
	return new Promise((resolve, reject)=>{
		let winning_status = 'none';
		for (var i = 0; i <= (songs.length-1); i++) {
			if(songs[i].title == 'Leave the door open' && songs[i].artist == 'Silk Sonic (Bruno Mars et Anderson Paak)'){
				console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
				console.log('Bruno mars');
				console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
			}
			if(songs[i].title == 'Et meme apres je t\'aimerai' && songs[i].artist == 'Hoshi'){
				console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
				console.log('Hoshi');
				console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
			}
			if(songs[i].title == 'Love is back' && songs[i].artist == 'Celeste'){
				console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
				console.log('Celeste');
				console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
			}

			if(songs[i].title == 'Leave the door open' && songs[i].artist == 'Silk Sonic (Bruno Mars et Anderson Paak)'){
				winning_status = 'step 1';

				if(songs[i+1].title == 'Et meme apres je t\'aimerai' && songs[i+1].artist == 'Hoshi'){
					winning_status = 'step 2';

					if(songs[i+2].title == 'Et meme apres je t\'aimerai' && songs[i+2].artist == 'Hoshi'){
						winning_status = 'step 3';
					}
				}
			}
		}
		resolve( winning_status );
	})
}

function send_twilio_sms( text, client_number ){
	return new Promise((resolve, reject)=>{
		let results = [];
		for (var i = client_number.length - 1; i >= 0; i--) {
			client.messages
  				.create({
    				body: text,
     				from: config.twilio.phone_number,
     				to: client_number[i]
   				})
	  		.then(message => {
	  			results.push( message );
	  		});
		}
		resolve(results);
	});
}

module.exports={
	'init_virgin_crawler': init_virgin_crawler,
}