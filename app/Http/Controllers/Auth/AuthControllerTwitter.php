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
class AuthControllerTwitter extends Controller
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
    
    //twitter

    /**
     * Redirect the user to the Twitter authentication page.
     *
     * @return Response
     */
    public function twRedirectToProvider()
    {
        return Socialite::driver('twitter')->redirect();
    }

    /**
     * Obtain the user information from Twitter.
     *
     * @return Response
     */
    public function twHandleProviderCallback()
    {
        try {
            $user = Socialite::driver('twitter')->user();
        } catch (Exception $e) {
            return redirect('auth/twitter');
        }

        $authUser = $this->twFindOrCreateUser($user);

        Auth::login($authUser, true);

        return redirect('/');
    }

    /**
     * Return user if exists; create and return if doesn't
     *
     * @param $twitterUser
     * @return User
     */
    private function twFindOrCreateUser($twitterUser)
    {
        $authUser = User::where('social_id', $twitterUser->id)->first();

        if ($authUser){
            DB::table('users')->where('social_id',$twitterUser->id)->update(array(
                'ses_id' => md5(microtime()),
                'active' => 1,
                'sign_time' => date('Y-m-d H:i:s'),
                'last_request_time' => time(),
                'ip_address' => $_SERVER['REMOTE_ADDR']
            ));
            return $authUser;
        }

        return User::create([
            'name' => $twitterUser->name,
            'email' => $twitterUser->nickname,
            'social_id' => $twitterUser->id,
            'gender' => 'male',
            'avatar' => $twitterUser->avatar_original,
            'ses_id' => md5(microtime()),
            'social_type' => 'TWITTER',
            'active' => 1,
            'sign_time' => date('Y-m-d H:i:s'),
            'last_request_time' => time(),
            'ip_address' => $_SERVER['REMOTE_ADDR']
        ]);
    }
}