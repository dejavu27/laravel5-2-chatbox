@extends('layouts.app')

@section('content')
    @if (Auth::guest())
        <div class="containter-fluid" style="margin-bottom: 30px;">
            <div class="col-md-4 col-md-offset-4">
                <img src="{{ URL::to('/assets/img/rad.png') }}" width="100%" height="auto" style="opacity: 0.6">
            </div>
        </div>
        <div class="containter-fluid">
            <div class="col-md-4 col-md-offset-4">
                <div class="panel panel-default" style="margin-bottom: 0px">
                    <div class="panel-heading" style="text-align: center">JOIN US AND LOGIN WITH</div>
                </div>
            </div>
        </div>
        <div class="containter-fluid">
            <div class="col-md-4 col-md-offset-4">
                <a href="{{ URL::to('/auth/facebook') }}" class="btn btn-primary btn-block btn-lg" style="margin-bottom: 0px"><i class="fa fa-facebook-official" aria-hidden="true"></i> FACEBOOK</a>
                <a href="{{ URL::to('/auth/twitter') }}" class="btn btn-success btn-block btn-lg" style="margin-top: 0px"><i class="fa fa-twitter" aria-hidden="true"></i> TWITTER</a>
            </div>
        </div>
    @else
    <div class="container">
        <div class="panel panel-default" style="border:0px;">
            <div class="panel-body" style="background: url({{ URL::to('/assets/img/cover.jpg') }}) top center no-repeat;background-size: cover;border-color: transparent;padding: 0px;position: relative;min-height: 200px">
                <img src="{{ Auth::user()->avatar }}" class="col-md-2 col-xs-11 pull-left" width="100%" height="250px" style="margin: 5px;padding: 5px;position: relative;z-index: 2;background: #eee;">
                <div class="container-fluid" style="background:#eee; width: 100%;height: 50px;position:absolute;bottom: 0;z-index: 0">
                    <div class="col-md-2">&nbsp;</div>
                    <div class="col-md-10">
                        <span style="font-weight: bolder;font-size: 30px">{{ Auth::user()->name }}</span> 
                    </div>
                </div>
            </div>
        </div>
            <!-- Tab panes -->
            <div class="tab-content">
                <div role="tabpanel" class="tab-pane  fade in active" id="chatbox">
                    <div class="col-md-4" style="padding-left: 0px">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                Top Users
                            </div>
                            <div class="panel-body">
                                Top po ang andito..
                            </div>
                        </div>
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                Online Users
                            </div>
                            <div class="panel-body">
                                Online po ang andito..
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8" style="padding-left: 0px">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                Chatbox <i class="fa fa-users" aria-hidden="true"></i>
                            </div>
                            <div class="panel-body" style="padding:3px;position: relative;z-index: 0;min-height: 250px">
                                <div class="col-lg-12" style="padding:0px">
                                    <form class="sendchat">
                                        <input type="hidden" name="name" value="{{ Auth::user()->name }}">
                                        <input type="hidden" name="social_id" value="{{ Auth::user()->social_id }}">
                                        <input type="hidden" name="email" value="{{ Auth::user()->email }}">
                                        <input type="hidden" name="social_type" value="{{ Auth::user()->social_type }}">
                                        <input type="hidden" name="points" value="{{ Auth::user()->points }}">
                                        <input type="hidden" name="acctype" value="{{ Auth::user()->acctype }}">
                                        <input type="hidden" name="avatar" value="{{ Auth::user()->avatar }}">
                                        <input type="hidden" name="replto">
                                        <div class="input-group">
                                            <span class="input-group-btn">
                                                <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="refresh" type="button" style="margin: 0px;cursor: pointer;"><i class="fa fa-refresh" aria-hidden="true"></i> Refresh</a></li>
                                                        <li ><a type="button" onclick="inew.addAnnc('{{ Auth::user()->name }}')" style="margin: 0px;cursor: pointer;"><i class="fa fa-bullhorn" aria-hidden="true"></i> Announce</a></li>
                                                    </ul>
                                                </div>
                                            </span>
                                            <input type="text" required autocomplete="off" class="form-control" name="msg" placeholder="Send a message....">
                                            <span class="input-group-btn addreplyer">
                                                <button class="btn btn-default" type="submit" data-toggle="tooltip" data-placement="top" title="Send chat"><i class="fa fa-comment" aria-hidden="true"></i></button>
                                                <button class="btn btn-default" type="button" data-toggle="tooltip" data-placement="top" title="Emoticons"><i class="fa fa-smile-o" aria-hidden="true"></i></button>
                                            </span>
                                        </div>
                                    </form>
                                    <div class="chat-msgbox" style="width: 100%;min-height:550px;max-height: 550px;overflow: auto;overflow-x:hidden;position: relative;z-index: 0;">
                                        <div class="chatloadhere" style="padding: 0px;margin: 0px"></div>
                                        <div class="alert alert-warning load-more" style="display:none;cursor: pointer;text-align: center" onclick="inew.getMoreMsg(inew.index.firstid)">LOAD MORE MESSAGE</div>
                                    </div>
                                </div>
                                <div class="loader" style="width: 100%;height: 100%;background: #eee;position: absolute;top: 0;left: 0;right: 0;bottom: 0;z-index: 20;text-align: center"><center><img src="{{ URL::to('/assets/img/loading.gif') }}"></center></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div role="tabpanel" class="tab-pane fade" id="settings">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Chatbox
                        </div>
                        <div class="panel-body">
                            Chatbox po ang andito..
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endif
@endsection