@extends('layouts.app')

@section('content')
<div class="container-fluid">
	<div class="col-md-3" style="padding-left:0px">
		<div class="panel panel-default">
			<div class="panel-heading">
				Messages
			</div>
			<div class="panel-body" style="padding: 3px">
				<?php
					$pm = DB::table('pm_conversation')->where('social_from','=',Auth::user()->social_id)->get();
				?>
				@if($pm)
					@foreach($pm as $k)
					<?php
						$x = DB::table('users')->where('social_id','=',$k->social_to)->first();
					?>
					<div class="media" style="border: 1px solid #eee;cursor: pointer;">
					  <div class="pull-left">
					    <a>
					      <img class="media-object" src="{{ $x->avatar }}" alt="..." width="60px">
					    </a>
					  </div>
					  <div class="media-body">
					    <h4 class="media-heading">{{ $x->name }}</h4>
					  </div>
					</div>
					@endforeach
				@else
					<center>No Message yet.</center>
				@endif
			</div>
		</div>
	</div>
	<div class="col-md-9" style="padding:0px">
		<div class="panel panel-default">
			<div class="panel-heading">
				Messages Body
			</div>
			<div class="panel-body">
				{{ $this }}
			</div>
		</div>
	</div>
</div>
@endsection