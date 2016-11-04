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
use Session;
class adminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

	protected function admin(){
		if(Auth::user()->isAdmin != 0){
			return view('admin/welcome');
		}
		else{
			Session::flash('error','Sorry you dont have permission to access that page.');
			Session::flash('alert-class','alert-danger');
			return redirect('/');
		}
	}
}