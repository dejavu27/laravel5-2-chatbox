@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    You are logged in!{{ $testid }}<br>
                    <img src="{{ Auth::user()->avatar }}" width="200" height="200px"><br>
                    {{ Auth::user()->email }}<br>
                    {{ Auth::user()->name }}<br>
                    {{ Auth::user()->gender }}<br>
                    {{ Auth::user()->social_type }}<br>
                    {{ Auth::user()->social_id }}<br><br>
                    <?php 
                        date_default_timezone_get('Asia/Manila');
                        $d = new dateTime(Auth::user()->updated_at);
                        echo date('m-d-Y h:i a',$d->getTimeStamp());
                    ?><br><br><br>
                    {{ Auth::user() }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
