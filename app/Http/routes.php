<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::auth();
Route::get('/', function () {
    return view('welcome');
});
Route::get('/admin','adminController@admin');

Route::get('/profile/{id}', 'HomeController@index');
Route::get('/profile', 'HomeController@index');

//facebook
Route::get('auth/facebook', 'Auth\AuthController@fbRedirectToProvider');
Route::get('auth/facebook/callback', 'Auth\AuthController@fbHandleProviderCallback');

//twitter
Route::get('auth/twitter', 'Auth\AuthControllerTwitter@twRedirectToProvider');
Route::get('auth/twitter/callback', 'Auth\AuthControllerTwitter@twHandleProviderCallback');

//chatbox
Route::get('sendchat',function(){
	return "this is not accessible";
});
Route::post('sendchat/now','chatController@sendmsg');
Route::post('getchats','chatController@getMsg');
Route::post('getmorechats','chatController@getMoreMsg');
Route::post('report','chatController@report');
Route::post('announcement','chatController@announcement');
//Personal Messages
Route::get('/messages/','messagesController@fetchConv');
Route::get('/messages/{social_id}','messagesController@fetchConv');

//tester
Route::get('testing',function(){
	return view('testing');
});