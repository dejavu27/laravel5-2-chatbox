<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests;
use DB;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

class chatController extends Controller
{
    public function sendmsg(Request $request)
    {
	    if($request->ajax()){
	    	$chk = DB::table('chatbox')->where('msg','=',$request->input('msg'))->where('social_id','=',Auth::user()->social_id)->first();
	    	if(empty($request->input('msg')) || ctype_space($request->input('msg'))){
	    		return $this->respondent(0,"Please enter something in chat text box.");
	    	}
	    	DB::table('chatbox')->insert([
	    		'msg' => $request->input('msg'),
	    		'social_id' => Auth::user()->social_id,
	    		'msg_type' => 'normal',
	    		'time' => time()
	    	]);
	    	DB::table('users')->where('social_id','=',Auth::user()->social_id)->increment('points', 2);
	    	$this->updateTimeRequest();
	    	return $this->respondent(1,"Message Sent");
	    }
	    else {
	    	return response()->json(array('text' => 'oops'));
	    }
    }

    public function getMsg(Request $request){
	    if($request->ajax()){
	    	if($request->input('id') == 0 ){
	    		$id = $this->getlastid()-15;
	    	}
	    	else { 
	    		$id = $request->input('id');
	    	}
	    	$all = DB::table('chatbox')->where('msg_id','>',$id)->orderBy('msg_id','ASC')->get();
	    	$bind = array();
	    	foreach($all as $alls){
	    		$x = $this->getuserinfo($alls->social_id);
	    		$makeRow = array(
	    			'msg_id' => $alls->msg_id,
	    			'text' => $alls->msg,
	    			'social_id' => $x->social_id,
	    			'name' => $x->name,
	    			'acctype' => $x->acctype,
	    			'points' => $x->points,
	    			'avatar' => $x->avatar,
	    			'social_type' => $x->social_type,
	    			'email' => $x->email,
	    			'time' => $alls->time,
	    			'msgType' => $alls->msg_type,
	    			'more' => 0
	    		);
	    		$bind[] = $makeRow;
	    	}
	    	$makeArr = array('msg' => $bind);
	    	return response()->json($makeArr);
	    }
	    else{
	    	return response()->json(array('text' => 'oops'));
	    }
    }

    public function getMoreMsg(Request $request){
	    if($request->ajax()){
	    	if($request->input('id') == 0 ){
	    		$id = $this->getlastid()-15;
	    	}
	    	else { 
	    		$id = $request->input('id');
	    	}
	    	$all = DB::table('chatbox')->where('msg_id','<',$id)->orderBy('msg_id','DESC')->take(10)->get();
	    	$bind = array();
	    	foreach($all as $alls){
	    		$x = $this->getuserinfo($alls->social_id);
	    		$makeRow = array(
	    			'msg_id' => $alls->msg_id,
	    			'text' => $alls->msg,
	    			'social_id' => $x->social_id,
	    			'name' => $x->name,
	    			'acctype' => $x->acctype,
	    			'points' => $x->points,
	    			'avatar' => $x->avatar,
	    			'social_type' => $x->social_type,
	    			'email' => $x->email,
	    			'time' => $alls->time,
	    			'msgType' => $alls->msg_type,
	    			'more' => 1
	    		);
	    		$bind[] = $makeRow;
	    	}
	    	$makeArr = array('msg' => $bind);
	    	return response()->json($makeArr);
	    }
	    else{
	    	return response()->json(array('text' => 'oops'));
	    }
    }

    public function report(Request $request){
    	if($request->ajax()){
	    	DB::table('report')->insert([
	    		'reported_by' => Auth::user()->social_id,
	    		'reason_desc' => $request->input('reason'),
	    		'reported_id' => $request->input('reported_id'),
	    		'time' => time()
	    	]);
    		$x = array(
    			'reported_by' => Auth::user()->social_id,
    			'report_desc' => $request->input('reason'),
    			'reported_id' => $request->input('reported_id'),
    			'time' => time()
    		);
    		return $this->respondent(1,'Report submitted');
    	}else{
    		return $this->respondent(0,'Something went wrong');
    	}
    }

    public function announcement(Request $request){
    	if($request->ajax()){
    		DB::table('chatbox')->insert([
	    		'msg' => $request->input('msg'),
	    		'social_id' => Auth::user()->social_id,
	    		'msg_type' => 'announcement',
	    		'time' => time()
    		]);
    		return $this->respondent(1,'Announcement Sent');
    	}else{
    		return $this->respondent(0,'Something went wrong');
    	}
    }

    private function getuserinfo($x){
    	return DB::table('users')->where('social_id','=',$x)->first();
    }

    private function getlastid(){
    	$dbli = DB::table('chatbox')->orderBy('msg_id','DESC')->first();
    	return $dbli->msg_id;
    }

    private function updateTimeRequest(){
    	DB::table('users')->where('social_id','=',Auth::user()->social_id)->update(['last_request_time' => time()]);
    }

    private function respondent($status,$text){
    	$headers = array(
    		'ContentType' => 'application/json',
    		'charset' => 'utf-8',
    	);
    	return response()->json(array(
    		'status' => $status,
    		'text' => $text
    	),200,$headers);
    }
}
