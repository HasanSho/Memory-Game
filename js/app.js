/////////////////----------Code by: Mhammd Hasan Shofan 2019--------//////////////
////////////////-----------Memory game for learning purposes--////////////

//------------------Variables-------------------//

// icons classes func, 8 repeated (16 element), order not important (it will be shuffled later).
var icons=["fa fa-automobile", "fa fa-automobile", "fa fa-balance-scale", "fa fa-balance-scale",
    "fa fa-bug", "fa fa-bug", "fa fa-cutlery", "fa fa-cutlery", "fa fa-fighter-jet", "fa fa-fighter-jet",
    "fa fa-flask", "fa fa-flask","fa fa-frown-o", "fa fa-frown-o", "fa fa-paw", "fa fa-paw",
];


//Rating
var starsTag=document.querySelector('.stars')
var stars=document.querySelector('.stars').childNodes

//Moves
var moves=0;
var movesNow=document.querySelector(".moves");

var checkedIcons=[];
var matchedCards=0;

// winning modal
var info=document.querySelector('.Info');
var timeBox=document.querySelector('.time_box');
var movesBox=document.querySelector('.moves_box');
var ratingBox=document.querySelector('.rating_box');
var resBtn=document.querySelector('.restart_btn'); //for restart Modal button 
var restart=document.querySelector(".restart"); //for restart  nav button 
var restartChIco=document.querySelector(".changeIcons"); //for restart & change icons button

// timer
//seconds should be -1 because once the timer function invokes, the seconds increase 1 immediatelly in no time.
var sec=-1;
var min=0;
var hours=0;
var timerStatus=0; //working (1) / not working (0)

var speed=1000
var secFinal=''
var minFinal=''
var hoursFinal=''
var timer=document.querySelector(".timer")

//---------------Shuffle function, I made it!!--------------//

var tempArray=[]
function shuffle(array) {
	//looping icons array 16 of length
	for(i=0;i<16;i++){
		rand=Math.round((array.length-1)*Math.random()) 
		//if element is null in shuffled array (not set yet), set it to first/second.. element of icons-array
		if(tempArray[rand]==null){tempArray[rand]=array[i]}
		//if not null (assigned before) then i-- to try another random number (working as while loop)
		else{i--}
	}
	return tempArray; 
}


//-----------------Board Creation-----------------//

var Board=document.querySelector('#Board');

function boardCreation() {

    // clear old board if exists
    Board.innerHTML="";
    // create ul and add style to it
    var ul=document.createElement('ul');
		ul.classList.add('deck');
    // shuffle the icons and get a shuffled array
	tempArray=[] //empty tempArray
	shuffle(icons);
	// creating li items and adding icons style, and append them to ul
    for (var i=0; i < tempArray.length; i++) {
        var li=document.createElement('li');
		li.setAttribute('class','card '+tempArray[i]);	
        ul.appendChild(li);
    }
	//append everything to board
    Board.append(ul);

}


boardCreation();



//-----------------card click Function-----------------//

// this func will invoke when clicking the cards

function cardsFunc(e) {
	restarted=false
    var clickedCard=e.target;

    if (
	clickedCard.tagName==='LI'
	&& !clickedCard.classList.contains("show","open","matched")
	&& checkedIcons.length<2){
			
			clickedCard.classList.add("open","show");
			checkedIcons.push(clickedCard);

	        if (timerStatus === 0) { // if timer stopped, run it.
				timerStatus=1;
				speed=1000;
				timerFunc()
			}

		
			if(checkedIcons.length===2){ // 2 means two cards ready for check identity
				// same classlists ===> same icons ===> matched
				if (checkedIcons[0].classList.value === checkedIcons[1].classList.value) {matched()}
				else {setTimeout(notMatched,600)}
				movesFunc() // counting the clicks
				win(); //check end of game status
			}
    }

}
Board.addEventListener('click', cardsFunc);


//-------------------matching--------------//


// matched!! 
function matched() {
    checkedIcons[0].classList.add("matched");
    checkedIcons[1].classList.add("matched");
    matchedCards++;
    checkedIcons=[];
}
// NOT matched!!
function notMatched() {
    checkedIcons[0].classList.remove("open","show");
    checkedIcons[1].classList.remove("open","show");
    checkedIcons=[];
}



//---------------moves && rating---------------//

function movesFunc() {
	moves++;
	(moves === 1)?	movesNow.textContent='1  Move'
	: movesNow.textContent=moves+' Moves';
	
	// Rating
																	//{case1 note='excellent' moves<13}
	 (moves === 13)?(stars[5].style.color='#cacaca' , note='Good!')	//case2 (2 stars) 
	:(moves === 16)?(stars[3].style.color='#cacaca' , note='Bad!!')		//case3 (1 star)
	:(moves === 19)?(stars[1].style.color='#cacaca' , note='awful!!!')		//case4 (no stars)
	:false;
}



//-----------------Timer----------------//


function timerFunc() {
	/* if moves=0 (first click on cards) || matchedCards<8 (game not finished)
	&& restarted=false (user didn't click restart button)
	[NOW timer is allowed to run]
	Note: if we just add speed=999999 to restart button, this will stop the timer
	but it will run for an additional extra second, before setting (speed=999999) speed value was 1000 
	and setTimeout added to memory a command that runs timer function first, then it will check the speed value
	so.. we had to prevent timer from working immediatelly by adding this condition (restarted==false)
	*/
	if((moves==0 || matchedCards<8)&& restarted==false){

		sec++;	
		if(sec==60){sec=0;min++}
		if(min==60){min=0;hours++}

		// just adding zeros for styling purposes
		if(sec>9 && sec<60){secFinal=sec}
		else{secFinal='0'+sec}
		if(min>9 && min<60){minFinal=min+' : '}
		else{minFinal='0'+min+' : '}
		if(hours>9){hoursFinal=hours+' : '}
		else{hoursFinal=' 0'+hours+' : '}

		timer.textContent=hoursFinal+minFinal+secFinal


		
	}

setTimeout("timerFunc()",speed)


}


//-------------Winning Modal----------------//


var note='Excellent!' // extra note depending on rate (default:Excellent)

function win() {
    if (matchedCards == 8) {
		restarted=true;
		speed=999999;
		info.style.display='block';
		timeBox.textContent=timer.innerText;
        ratingBox.innerHTML=starsTag.outerHTML+note;
        movesBox.textContent=moves;
    }
}





//-------------------Restart------------------//


restarted=false
function restartFunc(ev) {
	
	restarted=true; // to stp counter immediately if restart button pressed
	info.style.display='none';
	
	//reset timer
	timerStatus=0;
	speed=999999;
	timer.textContent= '00 : 00 : 00'
	sec=-1;    min=0;    hours=0;
	
	//reset stars
	stars[5].style.color="#2196F3"
	stars[3].style.color="#2196F3"
	stars[1].style.color="#2196F3"
	note='Excellent!'
	
	//reset moves
    moves=0;
	movesNow.textContent='0 Moves';
	
	matchedCards=0;
    checkedIcons=[];
	

	// finally creating new board
    boardCreation();


}

restart.addEventListener("click", restartFunc);
resBtn.addEventListener("click", restartFunc)
restartChIco.addEventListener("click", restartFunc)

////////////////////////////////////////////////////


	
	
	//ADDITIONAL FEATURE//
//------------for changing the original basic icons if user gets bored of them-------------//

//  array of all icons (852 of length).
var allIcons=['500px','amazon','adn','android','angellist','apple','bandcamp','behance','behance-square','bitbucket','bitbucket-square','bitcoin','black-tie','bluetooth','bluetooth-b','btc','buysellads','cc-amex','cc-diners-club','cc-mastercard','cc-paypal','cc-stripe','cc-visa','chrome','codepen','codiepie','connectdevelop','contao','css3','dashcube','delicious','deviantart','digg','dribbble','dropbox','drupal','edge','eercast','empire','envira','etsy','expeditedssl','fa','facebook','facebook-f','facebook-official','facebook-square','firefox','first-order','flickr','fonticons','font-awesome','fort-awesome','forumbee','foursquare','free-code-camp','ge','get-pocket','gg','gg-circle','git','git-square','github','github-alt','github-square','gitlab','gittip','glide','glide-g','google','google-plus','google-plus-circle','google-plus-official','google-plus-square','google-wallet','gratipay','grav','hacker-news','houzz','html5','imdb','instagram','internet-explorer','ioxhost','joomla','jsfiddle','lastfm','lastfm-square','leanpub','linkedin','linkedin-square','linode','linux','maxcdn','meanpath','medium','meetup','mixcloud','modx','odnoklassniki','odnoklassniki-square','opencart','openid','opera','optin-monster','pagelines','paypal','pied-piper','pied-piper-alt','pinterest','pinterest-p','pinterest-square','product-hunt','qq','quora','ra','ravelry','rebel','reddit','reddit-alien','reddit-square','renren','safari','scribd','sellsy','share-alt','share-alt-square','shirtsinbulk','snapchat','snapchat-square','simplybuilt','skyatlas','skype','slack','slideshare','soundcloud','spotify','stack-exchange','stack-overflow','steam','steam-square','stumbleupon','stumbleupon-circle','superpowers','telegram','tencent-weibo','themeisle','trello','tripadvisor','tumblr','tumblr-square','twitch','twitter','twitter-square','usb','viacoin','viadeo','viadeo-square','vimeo','vimeo-square','vine','vk','wechat','weibo','weixin','whatsapp','wikipedia-w','windows','wordpress','wpbeginner','wpexplorer','wpforms','xing','xing-square','y-combinator','yahoo','yelp','yc','yoast','youtube','youtube-play','youtube-square','area-chart','bar-chart','line-chart','pie-chart','bitcoin','btc','cny','dollar','eur','euro','gbp','ils','inr','jpy','krw','money','rmb','rouble','rub','ruble','rupee','shekel','sheqel','try','turkish-lira','usd','won','yen','angle-double-down','angle-double-left','angle-double-right','angle-double-up','angle-down','angle-left','angle-right','angle-up','arrow-circle-down','arrow-circle-left','arrow-circle-right','arrow-circle-up','arrow-circle-o-down','arrow-circle-o-left','arrow-circle-o-right','arrow-circle-o-up','arrow-down','arrow-left','arrow-right','arrow-up','arrows','arrows-alt','arrows-h','arrows-v','caret-down','caret-left','caret-right','caret-up','caret-square-o-down','caret-square-o-left','caret-square-o-right','caret-square-o-up','chevron-circle-down','chevron-circle-left','chevron-circle-right','chevron-circle-up','chevron-down','chevron-left','chevron-right','chevron-up','hand-o-down','hand-o-left','hand-o-right','hand-o-up','long-arrow-down','long-arrow-left','long-arrow-right','long-arrow-up','toggle-down','toggle-left','toggle-right','toggle-up','file','file-archive-o','file-audio-o','file-code-o','file-excel-o','file-image-o','file-movie-o','file-o','file-pdf-o','file-photo-o','file-picture-o','file-powerpoint-o','file-text','file-text-o','file-video-o','file-word-o','file-zip-o','check-square','check-square-o','circle','circle-o','dot-circle-o','minus-square','minus-square-o','plus-square','plus-square-o','square','square-o','genderless','intersex','mars','mars-double','mars-stroke','mars-stroke-h','mars-stroke-v','mercury','neuter','transgender','transgender-alt','venus','venus-double','venus-mars','hand-grab-o','hand-lizard-o','hand-o-down','hand-o-left','hand-o-right','hand-o-up','hand-paper-o','hand-peace-o','hand-pointer-o','rocket','hand-scissors-o','hand-spock-o','hand-stop-o','thumbs-down','thumbs-o-down','thumbs-o-up','thumbs-up','ambulance','h-square','heart','heart-o','heartbeat','hospital-o','medkit','plus-square','stethoscope','user-md','wheelchair','cc-amex','cc-diners-club','cc-discover','cc-jcb','cc-mastercard','cc-paypal','cc-stripe','cc-visa','credit-card','google-wallet','paypal','circle-o-notch','cog','gear','refresh','spinner','align-center','align-justify','align-left','align-right','bold','chain','chain-broken','clipboard','columns','copy','cut','dedent','eraser','file','file-o','file-text','file-text-o','files-o','floppy-o','font','header','indent','italic','link','list','list-alt','list-ol','list-ul','outdent','paperclip','paragraph','paste','repeat','rotate-left','rotate-right','save','scissors','strikethrough','subscript','superscript','table','text-height','text-width','th','th-large','th-list','underline','undo','unlink','ambulance','automobile','bicycle','bus','cab','car','fighter-jet','motorcycle','plane','rocket','ship','space-shuttle','subway','taxi','train','truck','wheelchair','address-book','address-book-o','address-card','address-card-o','adjust','american-sign-language-interpreting','anchor','archive','area-chart','arrows','arrows-h','arrows-v','asl-interpreting','assistive-listening-systems','asterisk','at','automobile','audio-description','balance-scale','ban','bank','bar-chart','bar-chart-o','barcode','bars','bath','bathtub','battery-0','battery-1','battery-2','battery-3','battery-4','battery-empty','battery-full','battery-half','battery-quarter','battery-three-quarters','bed','beer','bell','bell-o','bell-slash','bell-slash-o','bicycle','binoculars','birthday-cake','blind','bolt','bomb','book','bookmark','bookmark-o','braille','briefcase','bug','building','building-o','bullhorn','bullseye','bus','cab','calculator','calendar','calendar-o','calendar-check-o','calendar-minus-o','calendar-plus-o','calendar-times-o','camera','camera-retro','car','caret-square-o-down','caret-square-o-left','caret-square-o-right','caret-square-o-up','cart-arrow-down','cart-plus','cc','certificate','check','check-circle','check-circle-o','check-square','check-square-o','child','circle','circle-o','circle-o-notch','circle-thin','clock-o','clone','close','cloud','cloud-download','cloud-upload','code','code-fork','coffee','cog','cogs','comment','comment-o','comments','comments-o','commenting','commenting-o','compass','copyright','credit-card','credit-card-alt','creative-commons','crop','crosshairs','cube','cubes','cutlery','dashboard','database','deaf','deafness','desktop','diamond','dot-circle-o','download','drivers-license','drivers-license-o','edit','ellipsis-h','ellipsis-v','envelope','envelope-o','envelope-open','envelope-open-o','envelope-square','eraser','exchange','exclamation','exclamation-circle','exclamation-triangle','external-link','external-link-square','eye','eye-slash','eyedropper','fax','female','fighter-jet','file-archive-o','file-audio-o','file-code-o','file-excel-o','file-image-o','file-movie-o','file-pdf-o','file-photo-o','file-picture-o','file-powerpoint-o','file-sound-o','file-video-o','file-word-o','file-zip-o','film','filter','fire','fire-extinguisher','flag','flag-checkered','flag-o','flash','flask','folder','folder-o','folder-open','folder-open-o','frown-o','futbol-o','gamepad','gavel','gear','gears','genderless','gift','glass','globe','graduation-cap','group','hard-of-hearing','hdd-o','handshake-o','hashtag','headphones','heart','heart-o','heartbeat','history','home','hotel','hourglass','hourglass-1','hourglass-2','hourglass-3','hourglass-end','hourglass-half','hourglass-o','hourglass-start','i-cursor','id-badge','id-card','id-card-o','image','inbox','industry','info','info-circle','institution','key','keyboard-o','language','laptop','leaf','legal','lemon-o','level-down','level-up','life-bouy','life-buoy','life-ring','life-saver','lightbulb-o','line-chart','location-arrow','lock','low-vision','magic','magnet','mail-forward','mail-reply','mail-reply-all','male','map','map-o','map-pin','map-signs','map-marker','meh-o','microchip','microphone','microphone-slash','minus','minus-circle','minus-square','minus-square-o','mobile','mobile-phone','money','moon-o','mortar-board','motorcycle','mouse-pointer','music','navicon','newspaper-o','object-group','object-ungroup','paint-brush','paper-plane','paper-plane-o','paw','pencil','pencil-square','pencil-square-o','percent','phone','phone-square','photo','picture-o','pie-chart','plane','plug','plus','plus-circle','plus-square','plus-square-o','podcast','power-off','print','puzzle-piece','qrcode','question','question-circle','question-circle-o','quote-left','quote-right','random','recycle','refresh','registered','remove','reorder','reply','reply-all','retweet','road','rocket','rss','rss-square','s15','search','search-minus','search-plus','send','send-o','server','share','share-alt','share-alt-square','share-square','share-square-o','shield','ship','shopping-bag','shopping-basket','shopping-cart','shower','sign-in','sign-out','sign-language','signal','signing','sitemap','sliders','smile-o','snowflake-o','soccer-ball-o','sort','sort-alpha-asc','sort-alpha-desc','sort-amount-asc','sort-amount-desc','sort-asc','sort-desc','sort-down','sort-numeric-asc','sort-numeric-desc','sort-up','space-shuttle','spinner','spoon','square','square-o','star','star-half','star-half-empty','star-half-full','star-half-o','star-o','sticky-note','sticky-note-o','street-view','suitcase','sun-o','support','tablet','tachometer','tag','tags','tasks','taxi','television','terminal','thermometer','thermometer-0','thermometer-1','thermometer-2','thermometer-3','thermometer-4','thermometer-empty','thermometer-full','thermometer-half','thermometer-quarter','thermometer-three-quarters','thumb-tack','thumbs-down','thumbs-o-up','thumbs-up','ticket','times','times-circle','times-circle-o','times-rectangle','times-rectangle-o','tint','toggle-down','toggle-left','toggle-right','toggle-up','toggle-off','toggle-on','trademark','trash','trash-o','tree','trophy','truck','tty','tv','umbrella','universal-access','university','unlock','unlock-alt','unsorted','upload','user','user-circle','user-circle-o','user-o','user-plus','user-secret','user-times','users','vcard','vcard-o','video-camera','volume-control-phone','volume-down','volume-off','volume-up','warning','wheelchair','wheelchair-alt','window-close','window-close-o','window-maximize','window-minimize','window-restore','wifi','wrench']

function changeIcons() {
	//deleting all old elements
	icons=[]
	for(i=0;i<8;i++){
		// getting random number (between 0 and allIcons.length-1)
		rand=Math.round((allIcons.length-1)*Math.random())

		if(allIcons[rand]!=''){ // if this index wasn't empty (not taken before)
			icons[i]=allIcons[rand]; // assign this element to icons[i] 
			allIcons[rand]=''; // empty this element (to avoid repeating same icons)
		}
		else{i--} // if this index is empty ==> i-- to try another random number
	}
	//rename icons for styling purposes, and duplicating the array to become 16 elements
	for(i=0;i<8;i++){
		icons[i]="fa fa-"+icons[i];
		icons.push(icons[i]);
	}
	
	restartFunc()

}

//Event L for brevious func
const changeIco=document.querySelector("#changeIco");
changeIco.addEventListener('click',function(){changeIcons(icons)})
const change=document.querySelector(".changeIcons");
change.addEventListener('click',function(){changeIcons(icons)})

	
	
	
	
