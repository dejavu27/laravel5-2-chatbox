<?php

namespace App\Http\Controllers\Auth;
use DB;
use App\User;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware($this->guestMiddleware(), ['except' => 'logout']);
    }
    
    public function showRegistrationForm()
    {
        return redirect('/');
    }

    public function register()
    {

    }

 
    /**
     * Redirect the user to the Facebook authentication page.
     *
     * @return Response
     */
    public function fbRedirectToProvider()
    {
        return Socialite::driver('facebook')->redirect();
    }
 
    /**
     * Obtain the user information from Facebook.
     *
     * @return Response
     */
    public function fbHandleProviderCallback()
    {
        try {
            $user = Socialite::driver('facebook')->user();
        } catch (Exception $e) {
            return redirect('auth/facebook');
        }
 
        $authUser = $this->fbFindOrCreateUser($user);
 
        Auth::login($authUser, true);
 
        return redirect('/');
    }
 
    /**
     * Return user if exists; create and return if doesn't
     *
     * @param $facebookUser
     * @return User
     */
    private function fbFindOrCreateUser($facebookUser)
    {
        $authUser = User::where('social_id', $facebookUser->id)->first();
 
        if ($authUser){
            DB::table('users')->where('social_id',$facebookUser->id)->update(array(
                'ses_id' => md5(microtime()),
                'active' => 1,
                'sign_time' => date('Y-m-d H:i:s'),
                'last_request_time' => time(),
                'ip_address' => $_SERVER['REMOTE_ADDR']
            ));
            return $authUser;
        }
 
        return User::create([
            'name' => $facebookUser->name,
            'email' => $facebookUser->email,
            'social_id' => $facebookUser->id,
            'gender' => $facebookUser->user['gender'],
            'avatar' => $facebookUser->avatar,
            'social_type' => 'FACEBOOK'
        ]);
    }
}
