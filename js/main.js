/**
 * advanced:
 * make this work offline
 * https://developer.mozilla.org/en-US/docs/HTML/Using_the_application_cache
 * note: you must edit the manifest to update files
 *
 */



var posts = [];

/**
 * form action
 *
 */

$('#draft button').click( function(event){

    // stop form from trying to send & refresh page
    event.preventDefault();

    // create post from form
    var post = {};
    post.title = $('#title').val();
    post.content = $('#content').val();

    // add post to posts
    posts.push(post);

    console.log('post: ',post);
    console.log('posts: ',posts);

    displayPost(post);
    storePosts(posts);

});


/**
 * display posts
 *
 */

function displayPost(post){
    
    var html = '<article><h2>'+ post.title +'</h2><p>'+ post.content +'</p></article>';
    $('#feed').prepend(html);
    
}


/**
 * store posts
 *
 * note: localStorage only stores STRINGS
 *          arrays/objects must be STRINGIFIED
 *          numbers are fine but will be returned as a strong
 *
 */

function storePosts(posts){

    console.log('array: ' + posts);

    // make the array a string
    posts = JSON.stringify(posts);
    console.log('json: ' + posts);

    // store the string
    localStorage.posts = posts;

}


/**
 * localStorage = STRINGS only!!
 *
 * note: localStorage only stores STRINGS
 *  - arrays/objects must be STRINGIFIED before storage, PARSED after retrieval. 
 *  - numbers also: 
 *       var num = localStorage.mynumber;   // '10.123' 
 *           num = parseFloat(num);         // 10.123 
 *           num = parseInt(num);           // 10
 *
 */


/**
 * load posts
 *
 * note: localStorage only stores STRINGS
 *          arrays/objects must be PARSED
 *          numbers also: var num = parseInt(); 
 *
 */

function loadPosts(){

    // check for posts in storage
    if (localStorage.posts) { 

        posts = localStorage.posts;

        // turn string into an array
        posts = JSON.parse(posts);

        // loop thru items in the array
        for( i=0, count=posts.length; i<count; i++ ){

            var post = posts[i]
            console.log( post );
            displayPost(post);
        }
    } else { // nothing in storage?
    
        posts = []; 
    
    }

}

// load posts on page load
loadPosts();


/**
 * advanced
 * alternative way to organize your code
 * not currently in use
 */

var app = {
    load : function(){
        if (localStorage.posts) { 
            posts = localStorage.posts;
            posts = JSON.parse(posts);
            for( i=0, count=posts.length; i<count; i++ ){
                var post = posts[i]
                displayPost(post);
            }
        }        
    },
    store : function(posts){
        posts = JSON.stringify(posts);
        localStorage.posts = posts;
    }
}

// app.load();
// app.store(posts);


//cartodb

/**
 * defaults for testing
 */ 

var name = 'xyz',
    description = 'going with it...',
    notice = 'note posted to carto';


var cat = $('form#serious').find('input.cat').val();

/**
 * page nav
 */ 

$('header nav').on('click', 'a', function(event){
    event.preventDefault(event);

    $('header nav a').removeClass('active');    
    $(this).toggleClass('active');
    
    var page = $(this).text();
    $('.page').fadeOut();
    $('#' + page).fadeIn();

})


/**
 * feedback to user
 */ 
function feedback(msg){
    console.log('msg: ',msg);
    $('.notice').text(msg).fadeIn().delay(2000).fadeOut('slow');
}

$('.notice').delay(2000).fadeOut(); // initial loading message


/**
 * user actions
 */ 

$('.addRandom').click( function(event){
    event.preventDefault(event);
   addnote( random.location(), name, description, notice ); 
});

$('.addLocation').click( function(){
    console.log('addLocation');
    event.preventDefault();
    getLocation();
});



/**
 * mobile position
 */ 

function getLocation (){
    console.log('getLocation()');

    // on success
    var newPosition = function(p){ 
        console.log('newPosition()');
        
        position = p; 
        console.log(position);
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var newlocation = lng + ' ' + lat; // the var name location screwed everything up
        addnote(newlocation,name,description,notice); 
    }

    // on error
    var positionError = function(error){ 
        feedback(error); 
    }

    // get location from the browser
    navigator.geolocation.getCurrentPosition(newPosition,positionError);	
    
}




/**
 * vars for cartoDB
 *
 */
var cartodb_accountname = 'haijing';
var cartodb_key = "&api_key=bdcbbd6ff401d9938a3bf014a4c781d8bc0c2fc8"; 
var table_name = 'my_mood_site';


/**
 * prepare note for carto
 *
 * example query:
 * q=INSERT INTO test (name,description,the_geom)VALUES( 'tester', 'doing test', ST_GeomFromText('POINT(-71.2 42.5)', 4326) ) 
 *
 */


// location = '-73.99086 40.735031'

function addnote(location,name,description,msg){
    console.log('addnote()',location);

    var description = escape(description);
    var sqlInsert ="q=INSERT INTO "+ table_name +"(name,description,the_geom) VALUES('"+ name +"', '"+ description +"', ST_GeomFromText('POINT(" + location + ")', 4326) )";

    update_carto(sqlInsert,msg);
}



/**
 * post note to carto
 *

 * CARTO:
 * INSERT INTO test (name,description,the_geom) VALUES( 'funny', 'remember', ST_GeomFromText('POINT(-71.2 42.5)', 4326) )

 * example url:
http://web3.cartodb.com/api/v2/sql?q=
INSERT INTO YOURTABLENAME (name,description,the_geom)VALUES( ST_GeomFromText('POINT(-71.2 42.5)', 4326), 'tester', 'doing test')
&api_key=YOURAPIKEY

http://YOURNAME.cartodb.com/api/v2/sql?q=INSERT INTO YOURTABLENAME (name,description,the_geom)VALUES( ST_GeomFromText('POINT(-71.2 42.5)', 4326), 'tester', 'doing test VIA URL')&api_key=YOURAPIKEY

http://YOURNAME.cartodb.com/api/v2/sql?q=INSERT INTO YOURTABLENAME (name,description,the_geom)VALUES( ST_GeomFromText('POINT(-71.2 42.5)', 4326), 'tester', 'doing test VIA URL')&api_key=YOURAPIKEY

http://web3.cartodb.com/api/v2/sql?q=INSERT INTO test (name,description,the_geom) VALUES('hector', 'going%20with%20it', ST_GeomFromText('POINT(-73.92546075941762 40.6450305936858)', 4326) )&api_key=954a0e60614f834ef20463f40caf4387bcb4b0c2 

http://haijing.cartodb.com/api/v2/sql?q=INSERT INTO test 0(the_geomdescription,description,name)VALUES( ST_GeomFromText('POINT(-71.2 42.5)', 4326), 'tester', 'doing test VIA URL')&api_key=bdcbbd6ff401d9938a3bf014a4c781d8bc0c2fc8

 
 * 
 *
 */

function update_carto(sql,msg){
    
    // var cartodb_accountname = 'web3';
    // var cartodb_key = "&api_key=954a0e60614f834ef20463f40caf4387bcb4b0c2"; 
    // var table_name = 'test';
    
    
    console.log('update carto();');
    var theUrl = url_cartoData + sql + cartodb_key;
    console.log(theUrl);

    $.getJSON(theUrl, function(data){
        console.log(data);
    })
    .success(function(response) { 
        console.log('update_carto success');
        console.log(response);
        
            feedback(msg);
    })
    .error(function() { 
        msg = 'Sorry. There was an error.';
        feedback(msg);
        console.log(msg);
    })
    .complete(function() {  });  
    
}




/******************************* 
 * =query CartoDB
 *
 * used by various calls to get notes
 *
**/

var notes_limit = 100;
var notes_format = 'format=GeoJSON&';

var url_cartoData = 'http://'+cartodb_accountname+'.cartodb.com/api/v2/sql?';
var url_cartoMap = 'https://'+cartodb_accountname+'.cartodb.com/tables/' // + ?_table+'/embed_map?';
    // note!!
    // sql= for embed_map
    // q= for json & geojson



function allNotes(){ 
    var sql_statement = "q=SELECT * FROM "+ table_name +" ORDER BY created_at DESC LIMIT " + notes_limit;
    queryCarto(sql_statement);
}


function queryCarto(sql_statement){ 

    var url_query = url_cartoData + notes_format + sql_statement;

    console.log('url_query');
    console.log(url_query);

    var output = []; // to gather html here
    var templateA = $('.feed li.template'); // template in html
    var query_count; // total returned

    // console.log(url_query);
    $.getJSON(url_query, function(data){
//        console.log(data);
//        console.log(data.features[0].properties.description);

        query_count = data.features.length;

        // write notes
        $.each(data.features, function(key, val) { // geojson


            // console.log(data.features[0].properties.description);
            // console.log(OBJECT.properties.description);
            var note = val.properties;
            console.log(note); // peek inside!!!!!!
            console.log('hi: ' + note); // peek inside!!!!!!
            console.log('hi',note); // peek inside!!!!!!

            var template = templateA.clone();
            template.removeClass('template');

            template.find('strong').html('<i>'+note.description+'</i>')
                
            template.find('em').text(note.name);
            template.find('span').text(note.cartodb_id);
            template.find('img').attr('src',note.img);

            output.push(template); // gather for append below

        }); // END .each()


    }).success(function() { 
        console.log('getJSON success'); 

        // write to page        
        var delay = 0;
        
        if ( query_count > 0 ){
            $('.feed ul').append(output);
        } 
        else {
            console.log('no notes in carto'); 
        }
    }) // END sucess
    .error(function() { 
        console.log('getJSON error'); 
        })
    .complete(function() {  }); // complete, but not necessarily successful
    

}; // END queryCarto()


/**
 * go get 'em!!
 *
 */
 
allNotes()




/**
 * random location
 *
 * here i've created an object to organize all my random number functions.
 * random.location() will return something like: '-73.99086 40.735031'
 *
 * i could have defined all of the them like: function randomLocation() {...}
 *
 *
 */ 
 // example nyc = '-73.99086 40.735031';

var random = {

    maxLat : 40.8,
    minLat : 40.6,
    maxLng : -73.9,
    minLng : -73.99,
    number : function(max,min){
        return Math.random() * (max - min) + min;
    },
    lat : function() {   
       return random.number(random.maxLat,random.minLat);
    },
    lng : function() {   
       return random.number(random.maxLng,random.minLng);
    },
    location : function(){
        return random.lng() + ' ' + random.lat();
        // example nyc = '-73.99086 40.735031';
    }
}



/*
 * load my map
 */

// var myurl = 'http://web3.cartodb.com/viz/e4e25a80-2fbc-11e3-865a-bbb10aec048a/embed_map?title=false&description=false&search=false&shareable=false&cartodb_logo=true&layer_selector=false&legends=false&scrollwheel=false&sublayer_options=1&sql=&sw_lat=40.635403544299116&sw_lon=-74.1635513305664&ne_lat=40.78868343801402&ne_lon=-73.6691665649414'
// $('#home iframe').attr('src',myurl);


