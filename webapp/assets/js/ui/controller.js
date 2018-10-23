(function(window, undefined) {

'use strict';

var debug = window.debug;

var 
Class = UI.Class,

API = (function() {
    return {
        serverName: "GATEWAY_SERVER",
        address: function() {
        	var self = this;
        	var address = "";

		    try {
			    var appInfo = M.info.app();
				var manifest = appInfo.manifest;
			    address = manifest.network.http[self.serverName]["address"];
			} catch(e) {

			}

			return address;
        }
    };
})(),

Debug = function() {
	
	var _microtime = function( get_as_float ) {
		var now = new Date().getTime() / 1000;
		var s = parseInt(now, 10); 
		return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000);
	};

	Debug.enabled = false;
	Debug.currentTime = _microtime(true);
	
	var _methods = ["log", "info", "warn", "error"];
	var _methodsPatch = function( handler, context ) {
		if (typeof handler != "function") {
			return;
		}
		
		for( var i in _methods ) {
			var method = _methods[i];
			handler.call( context, method );
		}
	};
	
	// IE bug Fixed
	if ( Function.prototype.bind && window.console != undefined && typeof window.console.log == "object" ) {
		_methodsPatch( function( method ) {
			if ( window.console[method] == undefined ) {
				window.console[method] = this.bind( window.console[method], window.console );
			}
		}, Function.prototype.call );
		
		return window.console;
	}
	
	_methods.push( "resetTime", "elapsedTime", "captureTrace", "message" );
	
	var _constructor = {
		filter:[],
		
		_execute: function( method, args ) {
			if ( method != "message" && method != "error" && ! Debug.enabled ) {
				return;
			}
			
			// force message
			if ( method == "message" ) {
				method = "log";
			}
			
			var params = Array.prototype.slice.call( args, 0 );
			
			if ( Function.prototype.bind && window.console != undefined ) {
			
				switch ( method ) {
					case "resetTime":
						Debug.currentTime = _microtime(true);
					break;
					
					case "captureTrace":
						var stack = "";
				
						try {
							var trace = {};
							
							if ( typeof Error.captureStackTrace == "function" ) {
								Error.captureStackTrace(trace, this ); // for Crome
							}
							else {
								var error = new Error();
								trace.stack = error.stack; // Firefox
							}
							
							var stack = trace.stack.split(/\n/);
							stack.shift();
							stack.shift();
							stack.shift();
							stack.shift();
							
							stack = stack[0];
						}
						catch(e) {
							debug.log( e );
							stack = "";
						}
						
						window.debug.log( stack );
					break;
	
					case "elapsedTime":
						params.push( method );
						params.push( (_microtime(true) - Debug.currentTime).toFixed(3) );
			
						var func = Function.prototype.bind.call( window.console["log"], window.console );
						func.apply( window.console, params );
					break;
	
					default:
						if ( _constructor.filter && _constructor.filter.length > 0 ) {
							if ( ! in_array( _constructor.filter, params[0] ) ) {
								break;
							}
						}
						
						var func = Function.prototype.bind.call( window.console[method], window.console );
						func.apply( window.console, params );
					break;
				}
			}
		}
	};
	
	_methodsPatch( function( method ) {
		if ( typeof _constructor["_execute"] == "function" ) {
			_constructor[method] = function( message ){ 
				_constructor._execute( method, arguments ); 
			};
		}
		
	}, _constructor );
	
	return _constructor;
},

DataModel = Class.DataModel,
DatabaseConfig = Class.DatabaseConfig,
UserInfo = Class.UserInfo,
ProfileInfo = Class.ProfileInfo,
DeviceInfo = Class.DeviceInfo,
FitConfig = Class.FitConfig,
ViewController = Class.ViewController,

SessionController = Class({
	name: "SessionController",
	parent: "IObject",
	constructor: function() {

		var /* constant */
		_VALID_SESSION_TIME = 1000*60*30;

		var 
		self,
		_timeout = null, 
		_activeTimer = false, 
		_useSession = false;

		return {
			userInfo: function() {
				return UserInfo.sharedInfo();
			},

			init: function() {
				self = this;
				
				return self;
			},

			activedSession: function() {
				return _useSession;
			},

			startSession: function() {
				//debug.log( "startSession");

				_useSession = true;

				if ( ! self.userInfo().isLogin() ) {
					self.closeSession();
				}
				else if ( ! self.checkSession() ) {
					self.authSession();
				}
				else {
					self.startTimer();
				}
			},

			closeSession: function() {
				//debug.log( "closeSession");

				self.stopTimer();

				self.userInfo().truncate();
                _useSession = false;
			},

			startTimer: function() {
				//debug.log( "startTimer");

				if ( _activeTimer == true ) {
					self.scheduleTimeout();

					return;
				}

				_activeTimer = true;

				self.scheduleTimeout();
			},

			stopTimer: function() {
				//debug.log( "stopTimer");

				_activeTimer = false;

				if ( _timeout ) {
					clearTimeout( _timeout );
					_timeout = null;
				}
			},

			scheduleTimeout: function() {
				//debug.log( "scheduleTimeout");

				if ( _timeout ) {
					clearTimeout( _timeout );
                    
					_timeout = null;
				}

				_timeout = setTimeout( function() {
					
                    if ( _activeTimer == true ) {
						
                        if ( ! self.userInfo().isLogin() ) {
							self.closeSession();
							return;
						}
						else if ( ! self.checkSession() ) {
							self.authSession();
							return;
						}

						self.scheduleTimeout();
					}
					else {
						self.stopTimer();
					}
				}, 30000);
			},

			checkSession: function() {
				//debug.log( "checkSession");

				if ( ! self.userInfo().isLogin() ) {
					debug.log( "user auth is invalid");
					return false;
				}

				var elapsedTime = self.userInfo().elapsedTime();

				if ( elapsedTime > _VALID_SESSION_TIME ) {
					debug.log( "session is invalid")
					return false;			
				}

				return true;
			},

			authSession: function() {
				debug.log( "_useSession", _useSession );
				
                if ( _useSession == true ) {
                    MainController.sharedInstance().execute("user.auth", self.userInfo().data());
                }
                else {
                    self.stopTimer();
                }
			},
		};
	}
}),

Command = function( command, handler, delegate ) {
	var 
	_command = command,
	_handler = handler,
	_delegate = delegate,
	_args = [],
	_completed = false,
	_context = window;

	return {
		command: function() {
			return _command;
		},
		
		execute: function() {
			debug.log( _delegate.macroID(), "execute", _command );

			var self = this;
			var args = Array.prototype.slice.call( arguments, 0 );
			var result = _handler.apply(self, args);

			_args = args;

			return result;
		},

		retry: function() {
			debug.log( _delegate.macroID(), "retry execute", _command );

			var self = this;
			var result = _handler.apply(self, _args);

			return result;
		},
		
		isCompleted: function() {
			return _completed
		},

		complete: function() {
			var self = this;

			//debug.log( _delegate.macroID(), "complete", _command );

			setTimeout(function() {
				_completed = true;
				_delegate.complete( self );
			}, 0);
		}
	};
},

Macro = Class({
	name: "Macro",
	parent: "IObject",
	constructor: function( macroID ) {

		var self, _macroID = macroID || UI.Helper.String.guid( "Macro.xxxxxxxx" ), _finishHandler, _commandObjects = {}, _macroQueue = [], _currentMacroData = null, _cancelled = false, _progressing = false;

		return {
			init: function() {
				self = this;

				return self;
			},

			macroID: function() {
				return _macroID;
			},

			get: function( command ) {
				return _commandObjects[command] ? _commandObjects[command] : null;
			},

			register: function( command, handler ) {
				var commandObject = new Command( command, handler, self );
				_commandObjects[command] = commandObject;
			},

			unregister: function( command ) {
				delete _commandObjects[command];
				_commandObjects[command] = null;
			},

			execute: function( command ) {

				var commandObject = _commandObjects[command];

				if ( ! commandObject ) {
					debug.log( "command is not registerd - " + command );
					return;
				}

				var args = Array.prototype.slice.call( arguments, 1 );

				commandObject.execute.apply( commandObject, args );
			},

			complete: function( commandObject ) {

				setTimeout( function() {
					self.next();
				}, 0);
			},

			add: function( command ) {
				
				var commandObject = _commandObjects[command];
				if ( ! commandObject ) {
					debug.log( "command is not registered - " + command );
					return;
				}

				var params = Array.prototype.slice.call( arguments, 1 );
				params.unshift( commandObject );

				self.addCommandObject.apply( self, params );
			},

			delay: function( delay ) {
				
				var commandObject = new Command( "_DELAY_", function( delay ) {
					setTimeout( function() {
						commandObject.complete(commandObject);
					}, delay * 1000);
				}, self );

				self.addCommandObject.apply( self, [commandObject] );
			},

			addCallback: function( callback ) {
				
				var commandObject = new Command( "_CALLBACK_", function() {
					callback.apply(commandObject, arguments);
					commandObject.complete(commandObject);
				}, self );

				self.addCommandObject.apply( self, [commandObject] );
			},

			addCommandObject: function( commandObject ) {
				var params = Array.prototype.slice.call( arguments, 1 );
				var macroData = {
					target: commandObject,
					command: commandObject.command(),
					params: params
				};

				_macroQueue.push( macroData );
			},

			addQueue: function( queues ) {
				for ( var i=0; i<queues.length; i++ ) {
					var queue = queues[i];
					_macroQueue.push( queue );
				}
			},

			start: function() {
				debug.log( _macroID, "start" );

				_cancelled = false;
				_progressing = true;

				setTimeout( function() {
					self.next();
				}, 0);
			},

			next: function() {

				if ( _currentMacroData != null ) {
					if ( _currentMacroData.target ) {
						if ( ! _currentMacroData.target.isCompleted ) {
							console.error(_currentMacroData.target, _currentMacroData.command, "it is not completed" );
						}
					}
				}

				var macroData = _macroQueue.shift();

				//debug.log( _macroID, "next - ", macroData.command );
				
				if ( ! macroData ) {
					self.done();
					return;
				}

				var args = macroData.params;
				args.unshift( macroData.command );

				_currentMacroData = macroData;

				macroData.target.execute.apply( macroData.target, args );
			},

			cancel: function( handler ) {

				debug.log( _macroID, "cancel" );

				_cancelled = true;

				self.done();

				if ( typeof handler === "function" ) {
					handler( );
				}
			},

			done: function() {
				if ( _progressing == false ) {
					return;
				}

				debug.log( _macroID, "done" );

				_progressing = false;
				_macroQueue = [];

				if ( typeof _finishHandler === "function" ) {
					_finishHandler( _cancelled === true ? false : true );
				}
			},

			clear: function() {

				debug.log( _macroID, "clear" );

				_macroQueue = [];
			},

			finishHandler: function( handler ) {
				_finishHandler = handler;
			},

			marcoQueue: function() {
				return _macroQueue;
			},

			isProgressing: function() {
				return ( _macroQueue.length > 0 ) ? true : false;
			},

		};
	}
}),

ExecuteEvent = function( command, params, options, args ) {

	var 
	_command = command || "",
	_params = params || {},
	_options = UI.Helper.Object.extend( {
		showIndicator: true,
		callback: function() {

		},
		retryCount: 1
	}, options || {} );

	return {
		action: _command,
		args: args,
		params: _params,
		options: _options,
		code: 200,
		error: "",
		result: {},
		retryCount: _options.retryCount,
		showIndicator: _options.showIndicator,
		cancelable: false,
		callback: function() {
			if ( typeof _options.callback === "function" ) {
				_options.callback( this );
			}
		}
	};
},

MainController = Class({
	name: "MainController",
	parent: "UIController",
	constructor: function() {
		var self, _macro, _sessionController, _view, _debug = new Debug(), _appeared = false;
		var _isDialogShowing = false;
		return {
			debug: function() {
				return _debug;
			},
            
			userInfo: function() {
				return UserInfo.sharedInfo();
			},
            
			profileInfo: function() {
				return ProfileInfo.sharedInfo();
			},
            
			deviceInfo: function() {
				return DeviceInfo.sharedInfo();
			},

			fitManager: function() {
				return FitManager.defaultManager();
			},
			
            macro: function() {
                return _macro;
            },

			sessionController: function() {
				return _sessionController;
			},

			view: function() {
				return _view;
			},

			init: function() {
				self = this;
                _macro = new Macro();
				_sessionController = new SessionController();
				_view = new ViewController( document.body );

				return self;
			},

			initialize: function() {
				self.dispatchEvent( "ready" );

				return self;
			},

			clearStack: function() {
				var stackList = M.info.stack();
            
                if ( stackList.length >= 2 ) {
                	var hasMainStack = false;

                    for ( var i=stackList.length-2; i>=0; i-- ) {
                        var stackInfo = stackList[i];

                        if ( document.location.href.indexOf("user.login.html") !== -1 ) {
                        	M.page.remove( stackInfo.key );
                        }
                        else {
	                        if ( stackInfo.key.toLowerCase().indexOf("dashboard.main.html") !== -1 ) {
	                        	if ( hasMainStack === true ) {
		                        	M.page.remove( stackInfo.key );
		                        }
		                        else {
		                        	hasMainStack = true;
		                        }
	                        }
	                        else {
	                        	M.page.remove( stackInfo.key );
	                        }
	                    }
                    }
                }
			},

			isReady: function() {
				return this.fitManager().synchronizeManager().isSyncing() === false ? true : false;
			},

			moveToPairingPage: function( event ) {
				var popupController = PopupController.sharedInstance();
				
//				if ( M.navigator.os("android")){
//					if(M.data.global("paired") == "N") {
//						popupController.confirm(
//		                        event.error, 
//		                        ["확인"],
//		                        function( buttonIndex ) {
//		                        	if ( self.isReady() === false ) {
//		            					event.error = "동기화 중에는 연결 페이지로 이동 할 수 없습니다.";
//		            					popupController.confirm(
//		                                    event.error, 
//		                                    ["확인"],
//		                                    function( buttonIndex ) {
//		                                        
//		                                    }
//		                                );
//
//		            					self.dispatchEvent("didFinishExecute", event );
//		            					return;
//		            				}
//
//		            				var nextPage = document.location.href.indexOf("dashboard.main.html") !== -1 ? "dashboard.main.html" : "setting.device.html";
//		            				var nextAction = document.location.href.indexOf("dashboard.main.html") !== -1 ? "CLEAR_TOP" : "NEW_SRC";
//		            				
//		            				//설정창에서 기기 혜제 시 설정창 2번 팝업되는현상 수정.
//		            				if(document.location.href.indexOf("setting.device.html") !== -1){
//		            					nextAction = "CLEAR_TOP";
//		            				}
//		            				
//
//		            				M.page.html("setting.pairing.html", {
//		            					action:"NO_HISTORY", 
//		            					param:{"next-page":nextPage, "next-action":nextAction}
//		            	            });
//
//		            				self.dispatchEvent("didFinishExecute", event );
//		                        	 
//		                        }
//		                    );
//						return;
//					}
//				}else if(M.navigator.os("ios")){
//					if ( ! self.fitManager().isPaired() ) {
//						popupController.alert( "밴드 연결이 되어있지 않습니다." );
//						return;
//			        }
//				}
				
				if ( this.isReady() === false ) {
					event.error = "동기화 중에는 연결 페이지로 이동 할 수 없습니다.";
					popupController.confirm(
                        event.error, 
                        ["확인"],
                        function( buttonIndex ) {
                            
                        }
                    );

					self.dispatchEvent("didFinishExecute", event );
					return;
				}

				var nextPage = "dashboard.main.html";
				var nextAction = document.location.href.indexOf("dashboard.main.html") !== -1 ? "CLEAR_TOP" : "NEW_SRC";
				
				//설정창에서 기기 혜제 시 설정창 2번 팝업되는현상 수정.
				if(document.location.href.indexOf("setting.device.html") !== -1){
					nextAction = "CLEAR_TOP";
				}
				

				M.page.html("setting.pairing.html", {
					action:"NO_HISTORY", 
					param:{"next-page":nextPage, "next-action":nextAction}
	            });

				self.dispatchEvent("didFinishExecute", event );
			},

			unpairingDevice: function( event ) {
				//alert("[ 기기 해제 했습니다.UNPAIR_CLICK = true ");
				var popupController = PopupController.sharedInstance();
				if ( M.navigator.os("android")){
					if(M.data.global("paired") == "N") {
					//	popupController.alert( "밴드 연결이 되어있지 않습니다." );
					//	return;
					/*	popupController.confirm(
		                        event.error, 
		                        ["확인"],
		                        function( buttonIndex ) {
		                        	
//		                        	self.fitManager().unpair(function( result ) {
//
//		            					if ( result.error ) {
//		            						event.error = result.error;
//		            					}
//		            					else {
//		            						_view.updateMenu();
//		            					}
//		            					
//		            					if(M.navigator.os("android")) {
//		            						M.execute("wnRemoveLocalData");
//		            					}
//		            					else {
//		            						WN2Common("wnRemoveLocalData");
//		            					}
//		            					
//		            					// 기기 해제 시, 새 기계 연결 선택을 하게 되면, 자동 로그인으로 처리하지않고, 새로 
//		            					// intro를 진입하는 것으로 가정하기 위해서.
//		            					
//		            					
//		            				
//		            					 
//		            					 self.dispatchEvent("didFinishExecute", event );
//		            				});
		                        	
		                       	 M.page.html("setting.pairing.html", 
							                {
							                    action:"NO_HISTORY", 
							                    param:{"next-page":"setting.device.html", "next-action":"NEW_SRC"}
							                }
							            );
		                       	self.dispatchEvent("didFinishExecute", event );
		                        }
		                        
		                    );
						return;*/
					}
				}

				if ( this.isReady() === false ) {
					/*
					event.error = "동기화 중에는 연결 해제를 실행 할 수 없습니다.";
					popupController.confirm(
                        event.error, 
                        ["확인"],
                        function( buttonIndex ) {
                            
                        }
                    );

					self.dispatchEvent("didFinishExecute", event );
					return;
					*/

					self.fitManager().synchronizeManager().cancel();
				}

				this.fitManager().unpair(function( result ) {

					if ( result.error ) {
						event.error = result.error;
					}
					else {
						_view.updateMenu();
					}
					
					if(M.navigator.os("android")) {
						M.execute("wnRemoveLocalData");
					}
					else {
						WN2Common("wnRemoveLocalData");
					}
					
					// 기기 해제 시, 새 기계 연결 선택을 하게 되면, 자동 로그인으로 처리하지않고, 새로 
					// intro를 진입하는 것으로 가정하기 위해서.
					
					debug.log("hyjeon","[ 기기 해제 했습니다.UNPAIR_CLICK = true ");

					M.data.storage("UNPAIR_CLICK","true");
					M.data.global("paired","N");
					self.dispatchEvent("didFinishExecute", event );
					
				});
				
//				M.execute("wn2PluginFitBluetoothUnpair", {
//					userUnpair: true,
//					callback:M.response.on(function( result ){
//						if ( result.error ) {
//							event.error = result.error;
//						}
//						else {
//							_view.updateMenu();
//						}
//						
//						if(M.navigator.os("android")) {
//							M.execute("wnRemoveLocalData");
//						}
//						else {
//							WN2Common("wnRemoveLocalData");
//						}
//						
//						debug.log("hyjeon","[ 기기 해제 했습니다.UNPAIR_CLICK = true ");
//						M.data.storage("UNPAIR_CLICK","true");
//						M.data.global("paired","N");
//						self.dispatchEvent("didFinishExecute", event );
//						
//					}).toString()
//				});
				
			},
			
//			moveToSettingPage: function( event ) {
//				var popupController = PopupController.sharedInstance();
//				debug.log('###finish dialog moveToSettingPage### isDialogShow? ', _isDialogShowing );
//				if ( this.isReady() === false) {
//					if( _isDialogShowing == false){
//						_isDialogShowing= true;
//						event.error = "동기화 중에는 설정 페이지로 이동 할 수 없습니다.";
//						popupController.confirm(
//	                        event.error, 
//	                        ["확인"],
//	                        function( buttonIndex ) {
//	                        	_isDialogShowing= false;
//	                        	debug.log('###finish dialog moveToSettingPage onClick### isDialogShow? ', _isDialogShowing );
//	                        }
//	                    );
//					}
//
//					self.dispatchEvent("didFinishExecute", event );
//					return;
//				}
//
//				if ( ! self.fitManager().isPaired() ) {
//		            M.page.html("setting.pairing.html", 
//		                {
//		                    action:"NO_HISTORY", 
//		                    param:{"next-page":"setting.device.html", "next-action":"NEW_SRC"}
//		                }
//		            );
//		        }
//		        else {
//		            M.page.html("setting.device.html", {"action":"NEW_SRC"});
//		        }
//
//				self.dispatchEvent("didFinishExecute", event );
//			},
			
			moveToSettingPage: function( event ) {
				var popupController = PopupController.sharedInstance();
				debug.log('###finish dialog moveToSettingPage### isDialogShow? ', _isDialogShowing );
				if ( M.data.global("BLE_LOCK") == "LOCK") {
					if( _isDialogShowing == false){
						_isDialogShowing= true;
						event.error = "동기화 중에는 설정 페이지로 이동 할 수 없습니다.";
						popupController.confirm(
	                        event.error, 
	                        ["확인"],
	                        function( buttonIndex ) {
	                        	_isDialogShowing= false;
	                        	debug.log('###finish dialog moveToSettingPage onClick### isDialogShow? ', _isDialogShowing );
	                        }
	                    );
					}

					self.dispatchEvent("didFinishExecute", event );
					return;
				}
				//ios일때
				if(M.navigator.os("ios")){	
					if ( ! self.fitManager().isPaired() ) {
			            M.page.html("setting.pairing.html", 
			                {
			                    action:"NO_HISTORY", 
			                    param:{"next-page":"setting.device.html", "next-action":"NEW_SRC"}
			                }
			            );
			        }
			        else {
			        	M.page.html("setting.device.html", {"action":"NEW_SRC"});
			        }
				}
				//안드로이드 
				if ( M.navigator.os("android")){
					if(M.data.global("paired") == "N" ) {
						if(_isDialogShowing == false){
							_isDialogShowing = true;
							M.pop.alert({
					        	"title": "알림",
					            "message": "밴드가 연결되어 있지 않습니다.\n연결하시겠습니까?",
					            "buttons": ["닫기", "확인"],
					            "onclick": function( buttonIndex ) {
					                if ( buttonIndex == 1 ) {
					                	if( M.data.storage("UNPAIR_CLICK") === "true"){
					                		self.moveToPairingPage( event )
					                	}else{
//					                		self.fitManager().connect( function( result ) {
//									            if ( result.error ) {
//									            	 alert("밴드에 연결할 수 없습니다.");
//									            }
//									   	 	}, true );
					                		
					                		
////										최후의 경우, searchAndConnect를 시도한다. (2017/01/04)	
					                		//20180705 디바이스 연결 안내 인디케이터 추가
					            			var popupController = PopupController.sharedInstance();
					                		popupController.showIndicator();
					                		popupController.setIndicatorMessage("디바이스 연결중...");
					                		
						                	M.execute("wn2SearchAndConnect", {
						                		callback:M.response.on(function(result){
						                			$(".btn_setting").removeClass("on");
						                			popupController.hideIndicator();
						                			if(M.data.global("syncStart")){ //20180705 동기화 버튼을 통해 연결 요청 시 연결 후 동기화 수행
						                				self.reqDataSyncToServer();
						                			}
						                		}).toString()
						                	});
					                	}
					                }
					                _isDialogShowing = false;
					            }
					        });
						 }
					}else {
						M.page.html("setting.device.html", {"action":"NEW_SRC"});
					}
				}
				
				self.dispatchEvent("didFinishExecute", event );
			},
			
			moveUserMypageSetting: function( event ) {
				console.log('intro moveUserMypageSetting');
				var popupController = PopupController.sharedInstance();

				if ( this.isReady() === false ) {
					event.error = "동기화 중에는 목표 페이지로 이동 할 수 없습니다.";
					popupController.confirm(
                        event.error, 
                        ["확인"],
                        function( buttonIndex ) {
                            
                        }
                    );

					self.dispatchEvent("didFinishExecute", event );
					return;
				}

				if (M.navigator.os("ios")) {
					M.page.html("user.mypage.html", {"action":"NEW_SRC"});
				} 
				else {
					if ( ! self.fitManager().isPaired() ) {
			            M.page.html("setting.pairing.html", 
			                {
			                    action:"NO_HISTORY", 
			                    param:{"next-page":"setting.device.html", "next-action":"NEW_SRC"}
			                }
			            );
			        }
			        else {
			            M.page.html("user.mypage.html", {"action":"NEW_SRC"});
			        }
				}
				
				self.dispatchEvent("didFinishExecute", event );
			},
			
			moveDashboardStepWeekly: function( event ) {
				var popupController = PopupController.sharedInstance();

				if ( this.isReady() === false ) {
					event.error = "동기화 중에는 걸음 페이지로 이동 할 수 없습니다.";
					popupController.confirm(
                        event.error, 
                        ["확인"],
                        function( buttonIndex ) {
                            
                        }
                    );

					self.dispatchEvent("didFinishExecute", event );
					return;
				}
				
//				if (M.navigator.os("ios")) {
					M.page.html("dashboard.step.weekly.html", {"action":"NEW_SRC"});
//				} else {
//					if ( ! self.fitManager().isPaired() ) {
//			            M.page.html("setting.pairing.html", 
//			                {
//			                    action:"NO_HISTORY", 
//			                    param:{"next-page":"setting.device.html", "next-action":"NEW_SRC"}
//			                }
//			            );
//			        }
//			        else {
//			        	M.page.html("dashboard.step.weekly.html", {"action":"NEW_SRC"});
//			        }
//				}
				

				self.dispatchEvent("didFinishExecute", event );
			},
			
			moveDashboardDistanceWeekly: function( event ) {
				var popupController = PopupController.sharedInstance();

				if ( this.isReady() === false ) {
					event.error = "동기화 중에는 이동거리 페이지로 이동 할 수 없습니다.";
					popupController.confirm(
                        event.error, 
                        ["확인"],
                        function( buttonIndex ) {
                            
                        }
                    );

					self.dispatchEvent("didFinishExecute", event );
					return;
				}

//				if (M.navigator.os("ios")) {
					M.page.html("dashboard.distance.weekly.html", {"action":"NEW_SRC"});
//				} else {
//					if ( ! self.fitManager().isPaired() ) {
//			            M.page.html("setting.pairing.html", 
//			                {
//			                    action:"NO_HISTORY", 
//			                    param:{"next-page":"setting.device.html", "next-action":"NEW_SRC"}
//			                }
//			            );
//			        }
//			        else {
//			        	M.page.html("dashboard.distance.weekly.html", {"action":"NEW_SRC"});
//			        }
//				}

				self.dispatchEvent("didFinishExecute", event );
			},
			
			moveDshboardBurnToday: function( event ) {
				var popupController = PopupController.sharedInstance();

				if ( this.isReady() === false ) {
					event.error = "동기화 중에는 칼로리 페이지로 이동 할 수 없습니다.";
					popupController.confirm(
                        event.error, 
                        ["확인"],
                        function( buttonIndex ) {
                            
                        }
                    );

					self.dispatchEvent("didFinishExecute", event );
					return;
				}

//				if (M.navigator.os("ios")) {
					M.page.html("dashboard.burn.today.html", {"action":"NEW_SRC"});
//				} else {
//					if ( ! self.fitManager().isPaired() ) {
//			            M.page.html("setting.pairing.html", 
//			                {
//			                    action:"NO_HISTORY", 
//			                    param:{"next-page":"setting.device.html", "next-action":"NEW_SRC"}
//			                }
//			            );
//			        }
//			        else {
//			        	M.page.html("dashboard.burn.today.html", {"action":"NEW_SRC"});
//			        }
//				}

				self.dispatchEvent("didFinishExecute", event );
			},
			
			moveDashboardBurnWeekly : function (event) {
				var popupController = PopupController.sharedInstance();

				if ( this.isReady() === false ) {
					event.error = "동기화 중에는 칼로리 페이지로 이동 할 수 없습니다.";
					popupController.confirm(
                        event.error, 
                        ["확인"],
                        function( buttonIndex ) {
                            
                        }
                    );

					self.dispatchEvent("didFinishExecute", event );
					return;
				}

				M.page.html("dashboard.burn.weekly.html", {"action":"NEW_SRC"});

				self.dispatchEvent("didFinishExecute", event );
				
				
			},
			
			moveDashboardSleepToday: function( event ) {
				var popupController = PopupController.sharedInstance();

				if ( this.isReady() === false ) {
					event.error = "동기화 중에는 수면시간 페이지로 이동 할 수 없습니다.";
					popupController.confirm(
                        event.error, 
                        ["확인"],
                        function( buttonIndex ) {
                            
                        }
                    );

					self.dispatchEvent("didFinishExecute", event );
					return;
				}
				

				if ( M.navigator.os("ios") ){
					if ( M.data.global("BLE_LOCK") == "LOCK" ) {
						event.error = "동기화 중에는 수면시간 페이지로 이동 할 수 없습니다.";
						popupController.confirm(
	                        event.error, 
	                        ["확인"],
	                        function( buttonIndex ) {
	                            
	                        }
	                    );
	
						self.dispatchEvent("didFinishExecute", event );
						return;
					}
				}
				
//				if (M.navigator.os("ios")) {
//					M.page.html("dashboard.sleep.today.html", {"action":"NEW_SRC"});
//				} else {
//					if ( ! self.fitManager().isPaired() ) {
//			            M.page.html("setting.pairing.html", 
//			                {
//			                    action:"NO_HISTORY", 
//			                    param:{"next-page":"setting.device.html", "next-action":"NEW_SRC"}
//			                }
//			            );
//			        }
//			        else {
			        	M.page.html("dashboard.sleep.today.html", {"action":"NEW_SRC"});
//			        }
//				}

				self.dispatchEvent("didFinishExecute", event );
			},
			
			moveToLoginPage: function( event ) {  
            
				M.page.html("user.login.html", {action:"NO_HISTORY", animation:"SLIDE_RIGHT"});
				//M.page.html("dashboard.step.weekly.html", {action:"NO_HISTORY", animation:"SLIDE_RIGHT"});
            	self.dispatchEvent("didFinishExecute", event );
			},
            
            moveToHome: function( event ) { 
            
                M.page.html("user.main.html", {action:"NEW_SRC", animation:"SLIDE_LEFT"});

            	self.dispatchEvent("didFinishExecute", event );
            },

            moveToBack: function( event ) {
            	M.page.back();
            	self.dispatchEvent("didFinishExecute", event );
            },

            retry: function( event ) {
            	event.options.retryCount = event.retryCount = event.retryCount + 1;
            	
            	setTimeout( function() {
	            	self.execute.call( self, event.action, event.params, event.options );
	            }, 500 );
            },

            reset: function() {
            	_macro.cancel();
            },

            isAppeared: function() {
            	return _appeared;
            },

            didAppear: function() {
			    if ( _sessionController.activedSession() ) {
				    _sessionController.startTimer();
				}

			   	_appeared = true;

				DataModel.needToRestore();
            },

            willDisappear: function() {
			   	_sessionController.stopTimer();
			   	_appeared = false;

				DataModel.needToSave();
			},

            dispatchEvent: function( command,  event ) {
            	if ( event && typeof event.callback === "function" && command === "didFinishExecute" ) {
            		setTimeout( function() {
            			event.callback();
            		}, 0);
            	}

            	self._super( "dispatchEvent", arguments );
            },
            
			execute: function( command, params, options ) {
				var event = new ExecuteEvent( command, params, options, arguments );
                
				switch( command ) {
					case "synch.manual":
						var popupController = PopupController.sharedInstance();
						
						if ( M.data.global("paired") == "N" ) {
							popupController.alert( "밴드 연결이 되어있지 않습니다." );
							return;
						}
						
							
						if (  M.data.global("BLE_LOCK") == "LOCK" ) {
							if( _isDialogShowing == false){
								_isDialogShowing= true;
							event.error = "밴드 동기화 중입니다.동기화는 1~2분 정도 소요 됩니다.잠시만 기다리세요.";
								popupController.confirm(
			                        event.error, 
			                        ["확인"],
			                        function( buttonIndex ) {
			                        	_isDialogShowing= false;
			                        	debug.log('###finish dialog moveToSettingPage onClick### isDialogShow? ', _isDialogShowing );
			                        }
			                    );
							}
							return;
						}else{
							console.log('[ 커런트 값 및 지난 데이터 가져오기 ] ');
							
							if( _isDialogShowing == false){
								_isDialogShowing= true;
								event.error = "밴드 동기화를 진행합니다.동기화는 약 1~2분정도 소요됩니다.";
								popupController.confirm(
			                        event.error, 
			                        ["확인"],
			                        function( buttonIndex ) {
			                        	
			                        	self.fitManager().connect( function( result ) {
								            if ( result.error ) {
								            	
								            }
								            M.fit.current(function( result ) {
								    			console.log('M.fit.current');
								                if ( result.error ) {
								                	console.log(result.error);
								                }
								                else {
								    				console.log('fitManager.info().data');
								    				self.fitManager().info().data({
								                        "current_calorie": result.calorie,
								                        "current_distance": result.distance,
								                        "current_step": result.step
								                    });
								
								                    M.data.storage("CALORIE", result.calorie);
								                    M.data.storage("DISTANCE", result.distance);
								                    M.data.storage("STEP", result.step);
								                    _isDialogShowing= false;
								                    
								                    if( M.navigator.os("ios")) {
								                    	M.execute("exWN2PluginFitBandHistory", fitManager.userInfo().userKey(), fitManager.userInfo().authToken(), DeviceInfo.sharedInfo().sleepStart(), DeviceInfo.sharedInfo().sleepEnd(), self.userInfo().isLogin());
								                    }
								                    
								                    self.fitManager().synchManually(  function() {
								                		
								                	});
								                }
								                
								    		});
								                  
								   	 	}, true );
			                        	
			                        } 
			                    );

	                        	
							}
							
							
							
							
						}
						/////////////////////////////////

						break;
					case "system.exit":

						_view.confirm( 
							"앱을 종료하시겠습니까?", 
							["확인", "취소"],
							function( buttonIndex ) {
								if ( buttonIndex == 0 ) {
									M.sys.exit();
								}
							}
						);
						self.dispatchEvent("didFinishExecute", event );
					break;
					
					
					case "move.setting":
						self.moveToSettingPage( event );
						break;
					case "move.user.mypage.setting": //목표
						self.moveUserMypageSetting( event );
						break;
					case "move.dashboard.step.weekly": //걸음
						self.moveDashboardStepWeekly( event );
						break;	
					case "move.dashboard.distance.weekly": //이동거리
						self.moveDashboardDistanceWeekly( event );
						break;
					case "move.dashboard.burn.today": //칼로리
						self.moveDshboardBurnToday( event );
						break; 
					case "move.dashboard.burn.weekly":
						self.moveDashboardBurnWeekly( event );
						break;
					case "move.dashboard.sleep.today": //수면시간
						self.moveDashboardSleepToday( event );
					break;

					case "move.home":
						self.moveToHome( event );
					break;

					case "move.login":
						self.moveToLoginPage( event );
					break;

					case "page.back":
						self.moveToBack( event );
					break;

					case "device.pairing":
						self.moveToPairingPage( event );
					break;

					case "device.unpairing":
						self.unpairingDevice( event );
					break;
                    
					case "common.barcode":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};
			
						M.net.http.send({
							server: API.serverName,
							path: "/mycenter/getRefreshBarcode",
							data: {
								"status": formData["STATUS"],
								"auth_token": self.userInfo().authToken(),
								"center_seq_no":formData["CENTER_SEQ_NO"],
								"user_key" : self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event);
							},
							success: function(result, setting) { //수동로그인 성공한 부분
//								M.data.storage( "JOIN_DATE" , result. ); //neh
								event.result = result;
								if ( result["status"] != "Y" ) {
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								M.data.global("AUTO_LOGIN", "MANUAL");
								self.dispatchEvent("didSuccessExecute", event);
								
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;
								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
					
					case "common.barcode.user":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};
			
						M.net.http.send({
							server: API.serverName,
							path: "/mycenter/getRefreshBarcodeUser",
							data: {
								"status": formData["STATUS"],
								"auth_token": self.userInfo().authToken(),
								"center_seq_no":formData["CENTER_SEQ_NO"],
								"datetime_created": formData["REG_YMDY"],
								"user_key" : self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event);
							},
							success: function(result, setting) { //수동로그인 성공한 부분
//								M.data.storage( "JOIN_DATE" , result. ); //neh
								event.result = result;
								if ( result["status"] != "Y" ) {
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								M.data.global("AUTO_LOGIN", "MANUAL");
								self.dispatchEvent("didSuccessExecute", event);
								
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;
								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
						
					case "common.board.open":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};
			
						M.net.http.send({
							server: API.serverName,
							path: "/board/open",
							data: {
								"auth_token": self.userInfo().authToken(),
								"user_key" : self.userInfo().userKey(),
                                "board_key": formData["board_key"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event);
							},
							success: function(result, setting) { //수동로그인 성공한 부분
//								M.data.storage( "JOIN_DATE" , result. ); //neh
								event.result = result;
								if ( result["status"] != "Y" ) {
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								M.data.global("AUTO_LOGIN", "MANUAL");
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
					
					case "common.center.open":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};
			
						M.net.http.send({
							server: API.serverName,
							path: "/center/noticeOpen",
							data: {
								"auth_token": self.userInfo().authToken(),
								"user_key" : self.userInfo().userKey(),
                                "notice_seq_no": formData["board_key"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event);
							},
							success: function(result, setting) { //수동로그인 성공한 부분
//								M.data.storage( "JOIN_DATE" , result. ); //neh
								event.result = result;
								if ( result["status"] != "Y" ) {
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								M.data.global("AUTO_LOGIN", "MANUAL");
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
					
                    case "user.signup":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
						var formData = params || {};
						if(formData["user_login_type"] != "kakao"){			
							if($("#agreeYn1").is(":checked") == true){
								formData["agreeYn1"] = "y";
					        } else {
					        	formData["agreeYn1"] = "n";
					        }
							
					        if($("#agreeYn2").is(":checked") == true){
					        	formData["agreeYn2"] = "y";
					        } else {
					        	formData["agreeYn2"] = "n";
					        }
						} else {
							formData["agreeYn1"] = "y";
							formData["agreeYn2"] = "n";
						}

						M.net.http.send({
							server: API.serverName,
							path: "/user/signup",
							data: {
								"user_name": formData["user_name"],
								"user_email": formData["user_email"],
                                "user_password": formData["user_password"],
                                "promotion": (formData["promotion"] === "Y" ? "Y" : "N"),
                                "user_gender" : formData["user_gender"],
                                "telecom_cd" : formData["mobileSelect"],
                                "recouser_eml" : formData["reco_user_email"],
                                "collinf_yn" : formData["agreeYn1"],
                                "recevmarkt_yn" : formData["agreeYn2"],
                                "user_login_type" : formData["user_login_type"],
                                "rebon_yn" : formData["rebon_yn"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								M.tool.log("로그테스트0:"+JSON.stringify(event));
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								M.tool.log("로그테스트1:"+JSON.stringify(event));
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
                                result["user_email"] = formData["user_email"];

								event.result = result;
								
								if ( result["status"] != "Y" ) {
									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								M.tool.log("로그테스트2:"+JSON.stringify(event.result));
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;
								M.tool.log("로그테스트3:"+event.code);
								self.dispatchEvent("didErrorExecute", event);
							}
						});
                       
                    break;
                    
                    case "user.snsSignup":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
						var formData = params || {};
						if(formData["user_login_type"] != "kakao"){			
							if($("#agreeYn1").is(":checked") == true){
								formData["agreeYn1"] = "y";
					        } else {
					        	formData["agreeYn1"] = "n";
					        }
							
					        if($("#agreeYn2").is(":checked") == true){
					        	formData["agreeYn2"] = "y";
					        } else {
					        	formData["agreeYn2"] = "n";
					        }
						} else {
							formData["agreeYn1"] = "y";
							formData["agreeYn2"] = "n";
						}

						M.net.http.send({
							server: API.serverName,
							path: "/user/snsSignup",
							data: {
								"user_name": formData["user_name"],
								"user_email": formData["user_email"],
                                "user_password": formData["user_password"],
                                "promotion": (formData["promotion"] === "Y" ? "Y" : "N"),
                                "user_gender" : formData["user_gender"],
                                "telecom_cd" : formData["mobileSelect"],
                                "recouser_eml" : formData["reco_user_email"],
                                "collinf_yn" : formData["agreeYn1"],
                                "recevmarkt_yn" : formData["agreeYn2"],
                                "user_login_type" : formData["user_login_type"],
                                "rebon_yn" : formData["rebon_yn"],
                                "user_login_type":formData["user_login_type"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								M.tool.log("로그테스트0:"+JSON.stringify(event));
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								M.tool.log("로그테스트1:"+JSON.stringify(event));
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
                                result["user_email"] = formData["user_email"];

								event.result = result;
								
								//이미 회원가입이 되어있는 회원이면 바로 로그인하게 한다
								if ( result["status"] != "Y" ) {
									var
									controller = MainController.sharedInstance();
									
									
									controller.execute("user.login", {        
								         "user_email" : result["user_email"],
								         "user_password" : ""         
								        }); 
									
									//self.dispatchEvent("didErrorExecute", event );
									return;
								}
								
								M.tool.log("로그테스트2:"+JSON.stringify(event.result));
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;
								M.tool.log("로그테스트3:"+event.code);
								self.dispatchEvent("didErrorExecute", event);
							}
						});
                       
                    break;

					case "user.login":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};

						M.net.http.send({
							server: API.serverName,
							path: "/user/login",
							data: {
								"user_email": formData["user_email"],
                                "user_password": formData["user_password"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event);
							},
							success: function(result, setting) { //수동로그인 성공한 부분
//								M.data.storage( "JOIN_DATE" , result. ); //neh
								event.result = result;
								if ( result["status"] != "Y" ) {
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								M.data.global("AUTO_LOGIN", "MANUAL");
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;
								event.user_login_type = formData["user_login_type"]
								event.user_login_type = formData["user_email"]

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;

					case "user.password.once":

						if ( ! M.info.device("network.connected") ) { 
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};

						M.net.http.send({
							server: API.serverName,
							path: "/user/password/once",
							data: {
                                "auth_token": self.userInfo().authToken(),
								"user_key" : self.userInfo().userKey(),
                                "user_email": formData["user_email"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {

								event.result = result;
                                
                                if ( result["status"] != "Y" ) {
                                	event.code = -1;
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
                                
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;

					case "user.reset.password":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};

						M.net.http.send({
							server: API.serverName,
							path: "/user/reset/password",
							data: {
                                "auth_token": self.userInfo().authToken(),
								"user_key" : self.userInfo().userKey(),
								"user_old_password": formData["user_old_password"],
                                "user_password": formData["user_password"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {

								event.result = result;
                                
                                if ( result["status"] != "Y" ) {
                                	event.code = -1;
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
                                
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
                    
					case "user.auth":
					case "user.auth.signup":
					case "user.auth.start":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};

						M.net.http.send({
							server: API.serverName,
							path: "/user/auth",
                            timeout: 5000,
							data: {
                                "user_key" : self.userInfo().userKey(),
                                "user_email": self.userInfo().userEmail(),
                                "auth_token": self.userInfo().authToken()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
//								if ( M.navigator.os("ios") ) {
//					                if(  M.data.storage("FIRST_PAIRING") != "Y" ){ //neh
//										M.page.html("intro.pairing.html");
//					                 }
//				        		}
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;

								if ( result["status"] != "Y" ) {
									event.code = -1;
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								M.data.global("AUTO_LOGIN","AUTO");  //자동로그인 성공하면 AUTO_LOGIN을 AUTO로 설정#
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;

					case "info.terms":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
                       
                    	var formData = params || {};

						M.net.http.send({
							server: API.serverName,
							path: "/info/terms",
							data: {
                                
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;

								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
                    
                    case "apartment.info":
                    //	alert("apartment.info");
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
                       
                    	var formData = params || {};

						M.net.http.send({
							server: API.serverName,
							path: "/common/aptInfo",
							data: {
                                
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;

								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                       
                    break;
                    
                    case "user.profile.edit":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
//	 alert("self.userInfo().authToken():"+self.userInfo().authToken());
						var formData = params || {};
                       
                        var requestData = {
                            "auth_token" : self.userInfo().authToken(),
                            "user_key": self.userInfo().userKey(),
                            "user_name": formData["user_name"],
                            "user_birth": (formData["user_birth"] + "").split(".").join("-"),
                            "user_gender": formData["user_gender"],
                            "user_phone": formData["user_phone"] ? (formData["user_phone"]+'') : "",
                            
                            "body_weight": formData["body_weight"] + "KG",
                            "body_height": formData["body_height"] + "CM",
                            "goal_body_weight": formData["goal_weight"] ? (formData["goal_weight"] + "KG") : "0KG",
                            "goal_fit_step": formData["goal_step"] ? (formData["goal_step"] + "ST") : "10000ST"
                        };
                       
                        if ( formData["descCd"] != undefined && formData["descCd"] != "" ) {
                            requestData["descCd"] = formData["descCd"] + '';
                            requestData["apt_name"] = formData["apt_name"] + '';
                            requestData["dong"] = formData["dong"] + '';
                            requestData["ho"] = formData["ho"] + '';
                        }

						M.net.http.send({
							server: API.serverName,
							path: "/user/profile/edit",
							data: requestData,
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								if ( result["status"] != "Y" ) {
									event.code - -1;
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								
								event.result = requestData;

								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
					
                    case "user.profile.trainEdit":
                    //	alert("user.profile.trainEdit");
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};
                       
                        var requestData = {
                            "auth_token" : self.userInfo().authToken(),
                            "user_key":  self.userInfo().userKey(),
                            "user_name": formData["user_name"],
                            "user_birth": (formData["user_birth"] + "").split(".").join("-"),
                            "user_gender": formData["user_gender"],
                            "user_calory": formData["user_calory"],
                            "user_phone": formData["user_phone"] ? (formData["user_phone"]+'') : "",
                            
                            "body_weight": formData["body_weight"] + "KG",
                            "body_height": formData["body_height"] + "CM",
                            "goal_body_weight": formData["goal_weight"] ? (formData["goal_weight"] + "KG") : "0KG",
                            "goal_fit_step": formData["goal_step"] ? (formData["goal_step"] + "ST") : "10000ST"
                                ,"fitGoalMap" :{
                                	"auth_token" :  self.userInfo().authToken(),
                                    "user_key":  self.userInfo().userKey(),
        							"goal_body_weight": formData["goal_weight"],// + "KG",
                                    "goal_fit_step": formData["goal_step"],// + "ST",
                                    "push_yn": formData["push_yn"]
                            		
                                }	
                        };
                       
                        if ( formData["descCd"] != undefined && formData["descCd"] != "" ) {
                            requestData["descCd"] = formData["descCd"] + '';
                            requestData["apt_name"] = formData["apt_name"] + '';
                            requestData["dong"] = formData["dong"] + '';
                            requestData["ho"] = formData["ho"] + '';
                        }
						M.tool.log("로그테스트 trainEdit:"+JSON.stringify(requestData));
						M.net.http.send({
							server: API.serverName,
							path: "/user/profile/trainEdit",
							data: requestData,
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								if ( result["status"] != "Y" ) {
									event.code - -1;
									event.error = result["status_msg"];

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								
								event.result = requestData;
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
					
					case "user.profile.userInfoEdit":
                      //  	alert("user.profile.userInfoEdit");
    						if ( ! M.info.device("network.connected") ) {
    							event.code = -1;
    							event.error = "network is disconnected";

    							self.dispatchEvent("didErrorExecute", event);
    							return;
                        	}

    						var formData = params || {};
                            var requestData = {
                                "auth_token" : self.userInfo().authToken(),
                                "user_key":  self.userInfo().userKey(),
                                "user_login_type": formData["USER_LOGIN_TYPE"],
                                "user_name": formData["USER_NAME"],
                                "user_gender": formData["USER_GENDER"],
                                "user_phone": formData["USER_PHONE"],
                                "user_email" : formData["USER_EMAIL"],
                                "si_nm" : formData["AREA1"],
                                "gu_nm" : formData["AREA2"],
                                "dong_nm" : formData["AREA3"]
   
                              /*  url : http://192.168.0.48:8083/api/user/profile/userInfoEdit
                                {
							    "head": {
							        "result_code": "200",
							        "result_msg": "Success"
							    },
							    "body": {
								"auth_token" : "y",
								"user_key":  "6",
								"user_name": "홍길동",
								"user_gender": "M",
								"user_phone": "01022223333",
								"user_email" : "tea5580@naver.com",
								"si_nm" : "서울시",
								"gu_nm" : "강서구",
								"dong_nm" : "등촌동"
								}
}

                              */      	
                            };
                           
                       //     alert(JSON.stringify(requestData));
                            M.tool.log("로그테스트 userInfoEdit:"+JSON.stringify(requestData));
    						M.net.http.send({
    							server: API.serverName,
    							path: "/user/profile/userInfoEdit",
    							data: requestData,
                                indicator: {
                                    show: event.showIndicator,
                                    cancelable: event.cancelable
                                },
    							method: "POST",
    							start: function() {
    								self.dispatchEvent("didStartExecute", event );
    							},
    							finish: function() {
    								self.dispatchEvent("didFinishExecute", event );
    							},
    							success: function(result, setting) {
    								if ( result["status"] != "Y" ) {
    									event.code - -1;
    									event.error = result["status_msg"];

    									self.dispatchEvent("didErrorExecute", event );
    									return;
    								}
    								
    								event.result = requestData;
    							//	alert(JSON.stringify(event.result));
    								self.dispatchEvent("didSuccessExecute", event);
    							},
    							error: function(code, message, setting) {
    								event.code = code;
    								event.error = message;

    								self.dispatchEvent("didErrorExecute", event);
    							}
    						});

    					break;
					
                    case "common.getJusoCombo":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};
                        var requestData = {
                        	"status": "N",
                            "user_key":self.userInfo().userKey(),
                            "brtcCd":formData["brtcCd"],
                        	"signguCd":formData["signguCd"]
                        };
                       
						M.net.http.send({
							server: API.serverName,
							path: "/common/getJusoCombo",
							data: requestData,
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
					
                    case "board.mainList":
                    	
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
						var formData = params || {};
						var pathName = "";
						if (formData["ACTION_TYPE"] == "write") {
						//	alert("save");
						//	alert("save:"+formData["BOARD_TYPE"]+"|"+formData["TITLE"]+"|"+formData["CONTENT"]);
							pathName = "/board/reg";	
						} 
						
						if (formData["ACTION_TYPE"] == "mod") {
							//	alert("save");
							//	alert("mod:"+formData["BOARD_TYPE"]+"|"+formData["TITLE"]+"|"+formData["CONTENT"]);
								pathName = "/board/mod";	
						}
						
						if (formData["ACTION_TYPE"] == "del") {
							//	alert("save");
							//	alert("del:"+formData["BOARD_TYPE"]+"|"+formData["TITLE"]+"|"+formData["CONTENT"]);
								pathName = "/board/del";	
						}
						
						if (formData["ACTION_TYPE"] == "search") {
						//	alert("search:"+formData["BOARD_TYPE"]+"|"+formData["TITLE"]+"|"+formData["USER_NAME"]+"|PAGE_BLOCK:"+formData["PAGE_BLOCK"]+"|page:"+formData["PAGE"]);
							pathName = "/board/getList";						
						} 
						
						if (formData["ACTION_TYPE"] == "detail") {
							//	alert("search:"+formData["BOARD_TYPE"]+"|"+formData["TITLE"]+"|"+formData["USER_NAME"]+"|PAGE_BLOCK:"+formData["PAGE_BLOCK"]+"|page:"+formData["PAGE"]);
								pathName = "/board/getInfo";						
							} 
						
						if (formData["ACTION_TYPE"] == "allList") {
							pathName = "/board/getList";
						} 
						
					//	alert("PAGE_BLOCK:"+formData["PAGE_BLOCK"]+"|PAGE:"+formData["PAGE"]);
						
						
						//alert("보드타입:"+formData["BOARD_TYPE"]);
						M.net.http.send({
							server: API.serverName,
							path: pathName,
							data: {
	                            //"family":"",
	                            //"step":"",
	                           // "reg_date":"",
	                            //"up_board_key":"",
	                            //"board_key":"",
	                            //"content":"",
	                            //"user_name":"",
	                           // "mod_date":"",
	                           // "img_path_list":"",
	                            //"title":"",
							//	"search_option":formData["searchOption"],
								"up_board_key":formData["UP_BOARD_KEY"],	//댓글여부
								"board_key":formData["BOARD_KEY"],
								"page_con":formData["PAGE_BLOCK"],	//페이지당 글 갯수
								"page_num":formData["PAGE"],		//현재 페이지
								"family":formData["FAMILY"],				
								"step":formData["STEP"],				
								"content":formData["CONTENT"],			//게시글 내용
								"board_type":formData["BOARD_TYPE"],	//공지사항 & 질문게시판 선택
								"title":formData["TITLE"],				//제목 검색
								"user_name":formData["USER_NAME"],		//담당자 검색
								"reg_date_yyyymmdd":formData["REG_DATE"],		//게시일
							//	"auth_token" : self.userInfo().authToken(),
	                            "user_key": self.userInfo().userKey()
	                        },
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;
							//	alert(event.result);
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;

                    case "center.mainList":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
						var formData = params || {};
						var pathName = "";
						
						if (formData["ACTION_TYPE"] == "search") {
							//alert("search:"+formData["TAB_TYPE"]);
							//alert("search:"+formData["BOARD_TYPE"]+"|"+formData["TITLE"]+"|"+formData["USER_NAME"]+"|PAGE_BLOCK:"+formData["PAGE_BLOCK"]+"|page:"+formData["PAGE"]);
							pathName = "/center/getList";						
						} 
						
						if (formData["ACTION_TYPE"] == "detail") {
								//alert("detail:"+formData["BOARD_TYPE"]+"|"+formData["TITLE"]+"|"+formData["USER_NAME"]+"|PAGE_BLOCK:"+formData["PAGE_BLOCK"]+"|page:"+formData["PAGE"]);
								pathName = "/center/getInfo";						
							}
						
						if (formData["ACTION_TYPE"] == "allList") {
							//alert("allList:");
							pathName = "/center/getList";
						}
						
						//alert("PAGE_BLOCK:"+formData["PAGE_BLOCK"]+"|PAGE:"+formData["PAGE"]);
						//alert(formData["CENTER_NAME"]);
						M.net.http.send({
							server: API.serverName,
							path: pathName,
							data: {
								"center_seq_no":formData["CENTER_SEQ_NO"],
								"page_con":formData["PAGE_BLOCK"],				//페이지당 글 갯수
								"page_num":formData["PAGE"],					//현재 페이지			
								"center_name":formData["CENTER_NAME"],			//센터이름
							//	"center_addr_1":formData["CENTER_ADDR_1"],		//센터주소1
							//	"center_addr_2":formData["CENTER_ADDR_2"],		//센터주소2
							//	"center_tel":formData["CENTER_TEL"],			//센터전화번호
								"brtcCd":formData["BRTC_CODE"],						//시
							    "signguCd":formData["SIGNGU_CODE"],					//구
							    "emdCd":formData["EMD_CODE"],						//동
								"auth_token" : self.userInfo().authToken(),
	                            "user_key": self.userInfo().userKey()
	                        },
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;
								//alert(event.result);
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {

								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;

                    case "center.mainList.center":
                    	
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
						var formData = params || {};
						var pathName = "";
								
						if (formData["ACTION_TYPE"] == "reg") {
							//alert("센터등록 실행:"+formData["CENTER_SEQ_NO"]+",아이디:"+self.userInfo().userKey().replace(/[^0-9]/g,''));
							pathName = "/mycenter/setInfo";
						}
						
						if (formData["ACTION_TYPE"] == "remove") {
							//alert("센터등록 실행:"+formData["CENTER_SEQ_NO"]+",아이디:"+self.userInfo().userKey().replace(/[^0-9]/g,''));
							pathName = "/mycenter/removeInfo";
						}
						
						if (formData["ACTION_TYPE"] == "search") {
							//alert("센터조회 실행:"+formData["CENTER_SEQ_NO"]+",아이디:"+self.userInfo().userKey().replace(/[^0-9]/g,''));
							pathName = "/mycenter/getList";
						}
						
						M.net.http.send({
							server: API.serverName,
							path: pathName,
							data: {
								"center_seq_no":formData["CENTER_SEQ_NO"],
								"page_con":formData["PAGE_BLOCK"],				//페이지당 글 갯수
								"page_num":formData["PAGE"],					//현재 페이지			
								"auth_token" : self.userInfo().authToken(),
	                            "user_key": self.userInfo().userKey().replace(/[^0-9]/g,'')
	                        },
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;
								//alert(event.result);
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {

								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
					
                    	case "center.mainList.AccessType":
                    	
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
						var formData = params || {};
						var pathName = "";
						
						M.net.http.send({
							server: API.serverName,
							path: "/mycenter/setAccessTypeInfo",
							data: {
								"center_seq_no":formData["CENTER_SEQ_NO"],
								"auth_token" : self.userInfo().authToken()
	                        },
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {

								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
					
                    case "center.login":
                    	
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
                    	
						var formData = params || {};
						var pathName = "";
								
						if (formData["ACTION_TYPE"] == "auth") {
							//alert("센터등록 실행:"+formData["CENTER_SEQ_NO"]+",아이디:"+self.userInfo().userKey().replace(/[^0-9]/g,''));
							pathName = "/mycenter/getCheckMember";
						}
						
						M.net.http.send({
							server: API.serverName,
							path: pathName,
							data: {
								"center_seq_no":formData["CENTER_SEQ_NO"],
								"user_name":formData["USER_NAME"],
								"user_phone":formData["USER_PHONE"],
								"card_no":formData["CARD_NO"],								
								"auth_token" : self.userInfo().authToken(),
	                            "user_key": self.userInfo().userKey().replace(/[^0-9]/g,'')
	                        },
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;
								//alert(event.result);
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {

								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;

                    case "board.myCenter":
                    	
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
                    	
						var formData = params || {};
						var pathName = "";
											
						if (formData["ACTION_TYPE"] == "search") {
							//alert("센터조회 실행:"+formData["CENTER_SEQ_NO"]+",아이디:"+self.userInfo().userKey().replace(/[^0-9]/g,''));
							pathName = "/mycenter/getNoticeList";
						}
						
						M.net.http.send({
							server: API.serverName,
							path: pathName,
							data: {
								"page_con":formData["PAGE_BLOCK"],				//페이지당 글 갯수
								"page_num":formData["PAGE"],					//현재 페이지			
								"auth_token" : self.userInfo().authToken(),
	                            "user_key": self.userInfo().userKey().replace(/[^0-9]/g,'')
	                        },
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;
								//alert(event.result);
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {

								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;

					
					

					case "user.profile":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};
						//alert(self.userInfo().userKey().replace(/[^0-9]/g,'')+"|"+self.userInfo().authToken()+"API.serverName:"+API.serverName);
						M.net.http.send({
							server: API.serverName,
							path: "/user/profile",
							data: {
	                            "auth_token" : self.userInfo().authToken(),
	                            "user_key": self.userInfo().userKey().replace(/[^0-9]/g,'')
	                        },
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;
								console.log("event.error:"+event.error);

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;
					
					case "user.profile.user":
						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};
						//alert(self.userInfo().userKey().replace(/[^0-9]/g,'')+"|"+self.userInfo().authToken()+"API.serverName:"+API.serverName);
						M.net.http.send({
							server: API.serverName,
							path: "/user/profile",
							data: {
	                            "auth_token" : self.userInfo().authToken(),
	                            "user_key": self.userInfo().userKey().replace(/[^0-9]/g,'')
	                        },
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;
								
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;
								console.log("event.error:"+event.error);

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;

					case "user.profile.upload":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};

						self.dispatchEvent("didStartExecute", event );
						
						M.net.http.upload({
							url: API.address() + "/common/setUserImage",
							method: "POST",
							timeout: 30000,
							header: {
								"os_type": (M.navigator.os() == "iOS" ? "I" : M.navigator.os() == "Android" ? "I" : "A"),
								"device_uuid": M.info.device("uuid")
							},
							indicator: event.showIndicator,
						    body: [
							    {
									type: "FILE",
									mimetype: "DEFAULT",
									name: "upload",
									content: formData["path"]
							    },
							    {
							    	type: "TEXT",
							    	name: "auth_token",
							    	content: self.userInfo().authToken()
							    },
							    {
							    	type: "TEXT",
							    	name: "user_key",
							    	content: self.userInfo().userKey()
							    }
							],
						    encoding : "UTF-8",
						    progress : function(total, current) {
						    	
						    },
						    finish : function(status, header, body, setting) {
								
								try {
									var data = JSON.parse( body );

									if ( status === 200 ) {

										var resultCode = parseInt(data.head.result_code);

										if ( resultCode == 200 ) {
											var profileURL = data.body.attachFiles.httpurl;

											event.result = {
												"user_profile_url": profileURL
											};

											self.dispatchEvent("didSuccessExecute", event);
										}
										else {
											event.code = (isNaN(resultCode) ) ? -1 : resultCode;
											event.error = data.head.result_msg;

											self.dispatchEvent("didErrorExecute", event);
										}
									}
									else {
										event.code = status;
										event.error = "upload error";

										self.dispatchEvent("didErrorExecute", event);
									}
								}
								catch(e) {
									event.code = -1;
									event.error = e.message;

									self.dispatchEvent("didErrorExecute", event);
								}

								self.dispatchEvent("didFinishExecute", event);
						    }
						});

					break;

					case "user.badge.list":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};
						
						var formData = params || {};

						M.net.http.send({
							server: API.serverName,
							path: "/user/badge/list",
							data: {
	                            "auth_token" : self.userInfo().authToken(),
	                            "user_key": self.userInfo().userKey()
	                        },
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								event.result = result;

								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

					break;

					case "user.logout":

						var requestData = {
							"auth_token" : self.userInfo().authToken(),
	                        "user_key": self.userInfo().userKey()
						};
								
						self.profileInfo().truncate();
						self.deviceInfo().truncate();
						
                        self.fitManager().reset();
                        
                		

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";
							
							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						var formData = params || {};

						M.net.http.send({
							server: API.serverName,
							path: "/user/logout",
							data: requestData,
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								
								if ( M.navigator.os("ios") ) {
									
									M.data.removeStorage("FIRST_PAIRING");
								}

								event.result = result;

								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
							
						});

					break;
                    
                    case "fit.dashboard":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
                    
                        var formData = params || {};
                       
                        M.net.http.send({
							server: API.serverName,
							path: "/fit/dashboard",
							data: {
                                "auth_token" : self.userInfo().authToken(),
                                "user_key": self.userInfo().userKey(),
								"start": formData["start"],
                                "end": formData["end"],
                                "soso": FitConfig.sleepSosoValue(),
                                "bad": FitConfig.sleepBadValue()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								
								console.log('/fit/dashboard result= ', result);
								self.fitManager().updateDashboardWithSampleData( result );

								event.result = self.fitManager().dashboardData();
									
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    
                    break;
                    
                    case "fit.dashboard.summary":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
                    
                        var formData = params || {};
                    	var sleepStart = DeviceInfo.sharedInfo().sleepStart();
		                var sleepEnd = DeviceInfo.sharedInfo().sleepEnd();
		                var goalStep = FitInfo.sharedInfo().goalStep();
                       
                        M.net.http.send({
							server: API.serverName,
							path: "/fit/dashboard/summary",
							data: {
                                "auth_token" : self.userInfo().authToken(),
                                "user_key": self.userInfo().userKey(),
								"sleep_start": sleepStart,
								"sleep_end": sleepEnd,
								"goal_val": goalStep,
								"start": formData["start"],
                                "end": formData["end"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								self.fitManager().updateDashboardWithSampleData( result );
								event.result = self.fitManager().dashboardData();
								
								console.log("fit.summary: "+ event.result);
								
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    
                    break;

                    case "fit.dashboard.rebon":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
                    
                        var formData = params || {};
                       
                        M.net.http.send({
							server: API.serverName,
							path: "/fit/dashboard/rebon",
							data: {
                                "auth_token" : self.userInfo().authToken(),
                                "user_key": self.userInfo().userKey(),
								"count": FitConfig.rebonMaxCount()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								self.fitManager().updateDashboardWithRebonData( result );

								event.result = self.fitManager().dashboardData();
									
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    
                    break;

                    case "fit.sync.samples.load":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

                    	var formData = params || {};

                       
                        M.net.http.send({
							server: API.serverName,
							path: "/fit/sync/samples/load",
							data: {
                                "auth_token" : self.userInfo().authToken(),
                                "user_key": self.userInfo().userKey(),
								"start": formData["date"].split("-").join("") + "00",
                                "end": formData["date"].split("-").join("") + "24"
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								debug.log( "result", result );

								event.result = result;
								
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

                    break;

                    case "fit.sync.samples.send":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

                    	var formData = params || {};
                       
                        M.net.http.send({
							server: API.serverName,
							path: "/fit/sync/samples",
							data: {
                                "auth_token" : self.userInfo().authToken(),
                                "user_key": self.userInfo().userKey(),
								"fit_uuid": self.deviceInfo().pairedBandUuid(),
								"fit_samples": formData["samples"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								debug.log( "result", result );
								
								event.result = result;
									
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

                    break;

                    case "fit.sync.summary.load":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

                    	var formData = params || {};
                    	var sleepStart = DeviceInfo.sharedInfo().sleepStart();
		                var sleepEnd = DeviceInfo.sharedInfo().sleepEnd();
		                var goalStep = FitInfo.sharedInfo().goalStep();
		                
		                debug.log('##GoalStep Confirm: ', goalStep);
                       
                        M.net.http.send({
							server: API.serverName,
							path: "/fit/sync/summary/load",
							data: {
                                "auth_token" : self.userInfo().authToken(),
                                "user_key": self.userInfo().userKey(),
								"sleep_start": sleepStart,
								"sleep_end": sleepEnd,
								"goal_val": goalStep,
								"device": formData["device"],
                                "start": formData["start"],
                                "end": formData["end"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								debug.log( "result", result );

								if ( ! result["items"] || result["datalist"]) {
									if ( $.isArray(result["datalist"]) ) {
										var items = [];
										$(result["datalist"]).each( function( idx, data ) {
											var itemData = {};
											for ( var key in data ) {
												var itemKey = key.toLowerCase();
												var itemValue = data[key];

												itemData[itemKey] = itemValue;
											}
											items.push(itemData);
										});

										result["items"] = items;
									}
								}

								event.result = result;
								
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

                    break;

                    case "fit.sync.summary.send":
                    	
                    	console.log('/fit/sync/summary/send auth_token: authToken: ', self.userInfo().authToken());
                    	console.log('/fit/sync/summary/send auth_token userKey: ', self.userInfo().userKey());

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

                    	var formData = params || {};
                       
                        M.net.http.send({
							server: API.serverName,
							path: "/fit/sync/summary/send",
							data: {
                                "auth_token" : self.userInfo().authToken(),
                                "user_key": self.userInfo().userKey(),
                                "device": formData["device"],
                                "items": formData["items"],
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								debug.log( "result", result );

								event.result = result;
								
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});

                    break;
                    
                    case "fit.goal":

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
                    
                        var formData = params || {};
                       
                        M.net.http.send({
							server: API.serverName,
							path: "/fit/goal",
							data: {
                                "auth_token" : self.userInfo().authToken(),
                                "user_key": self.userInfo().userKey(),
								"goal_body_weight": formData["goal_weight"],// + "KG",
                                "goal_fit_step": formData["goal_step"],// + "ST",
                                "push_yn": formData["push_yn"]
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {

								if ( result["status"] != "Y" ) {
									event.code = -1;
									event.error = result["status_msg"];

									self.fitManager().info().data( formData );

									self.dispatchEvent("didErrorExecute", event );
									return;
								}
								
								event.result = {
									"goal_weight": formData["goal_weight"],
	                                "goal_step": formData["goal_step"]
								};
									
								self.dispatchEvent("didSuccessExecute", event);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    
                    break;
                    
                    case "fit.step.last":
                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						M.net.http.send({
							server: API.serverName,
							path: "/fit/step/last",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								
								if(result["list"].length > 0 ){
									event.result = result["list"][0].sync_ymdt;
								}else{
									event.result = "";
								}
								
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;
								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    	
                    	break;
                    case "fit.step.weekly":   //이번주 걸음

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
						var formData = params || {};
						//	alert("checkDate:"+formData["checkDate"]);
						M.net.http.send({
							server: API.serverName,
							path: "/fit/step/weekly",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
							//	alert("didStartExecute:"+JSON.stringify(event));
								self.dispatchEvent("didStartExecute", event );
				
							},
							finish: function() {
							//	alert("didFinishExecute:"+JSON.stringify(event));
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
							//	alert("result:"+JSON.stringify(result));
								console.log("************************result");
								console.log(result);
								var dateObj = new Date();
								var year = dateObj.getFullYear();
								var month = dateObj.getMonth()+1;
								var month1 = "";
								if( month < 10 ) {
									month1 = "0"+month;
								}else if( month >= 10) {
									month1 = month;
								}
								var day = dateObj.getDate();
								var today = year + "-" + month1+ "-" + (day<10 ? '0'+day : day); //오늘 날짜 가져오기 
								
								console.log(today); 
								var today_1 = new Date();
								var checkEventYn = formData["checkEventYn"];
							//	alert("formData[checkEventYn]:"+formData["checkEventYn"]);
								/*
								if (checkEventYn == "n") {
									today_1 = new Date();
									alert("today_1_off:"+today_1);
								} else {
									today_1 = new Date(formData["checkDate"]);
									alert("today_1_on:"+today_1);
								}
								*/
								//today_1 = new Date();
						
								var week_1 = new Array ('sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat');
								
								console.log( week_1[today_1.getDay()] ); //오늘 요일 가져오기 
								var week = week_1[today_1.getDay()];
								console.log("today_1:"+today_1); //오늘 요일 가져오기 
								console.log("week:"+JSON.stringify(week));
								var 
							    fitManager = self.fitManager();
								var current = fitManager.info().currentStep(); //걸음수 
								console.log(current);
								//alert("current:"+current);
								
								if (  current >  result.data[today].goal && current >  result.data[week].goal  ) {
									//ok
									result.data[today].status = "OK";
									result.data[week].status = "OK";
								}else if (  current <  result.data[today].goal  &&   current <  result.data[week].goal  ) {
									//fail
									result.data[today].status = "failure";
									result.data[week].status = "failure";
								}
								var avg = result.averageData;  
								var tot = result.totalData;
								var dataKey = result.dateKeys.length;
								
								console.log("averageData: " +  avg);
								console.log("totalData: "+ tot);
								console.log("dataKey의 length:    "+ dataKey);
								console.log( result.data[today].value );
								var avg_result = ( avg * dataKey -  result.data[today].value + current ) / dataKey;
								var total_result =  tot - result.data[today].value + current ;
								
								console.log("-------------결과------------")
								console.log(avg_result);
								console.log(total_result);

								//result.userData[ week_1[today_1.getDay()] ].value = current;
								
								result.userData[week] = current;
								result.data[today].value = current;
								
								if ( result.cnt == "0"){
									result.averageData = current;
									result.data.average = current;
								}else {
									result.averageData =  Math.floor(( result.totalData + current ) / result.cnt);  //평균  //neh
									result.data.average = Math.floor(( result.totalData + current ) / result.cnt);  //평균
								}
								
								event.setting = setting;
								
								console.log(event.setting);
								event.result = result;
								self.dispatchEvent("didSuccessExecute", event );
								new WellnessBarGraph(result); 
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;

                    case "fit.step.monthly":   //이번달 걸음

                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						M.net.http.send({
							server: API.serverName,
							path: "/fit/step/monthly",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								console.log(result);
								
								var dateObj = new Date();
								var year = dateObj.getFullYear();
								var month = dateObj.getMonth()+1;
								var month1 = "";
								if( month < 10 ) {
									month1 = "0"+month;
								}else if( month >= 10) {
									month1 = month;
								}
								
								var day = dateObj.getDate();
								var today = year + "-" + month1+ "-" + (day<10 ? '0'+day : day);  //오늘 날짜 가져오기 
								
								console.log(today); 
								
								var today_1 = new Date();
								var week_1 = new Array ('sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat');
								
								console.log( week_1[today_1.getDay()] ); //오늘 요일 가져오기 
								var week = week_1[today_1.getDay()];
								
								
								var 
							    fitManager = self.fitManager();
								var current = fitManager.info().currentStep(); //걸음수 
								
								
								console.log(current);
								console.log("------------------------------------------");
								console.log(result);
								
								//
								var avg = result.averageData;  
								var tot = result.totalData;
								var dataKey = result.dateKeys.length;
								
								console.log("averageData: " +  avg);
								console.log("totalData: "+ tot);
								console.log("dataKey의 length:    "+ dataKey);
								console.log( result.data[today].value );
								var avg_result = ( avg * dataKey -  result.data[today].value + current ) / dataKey;
								var total_result =  tot - result.data[today].value + current ;
								
								console.log("-------------결과---------")
								console.log(avg_result);
								console.log(total_result);

								console.log(week);
								//result.userData[ week_1[today_1.getDay()] ].value = current;
								
								result.userData[today] = current;
								result.data[today].value = current;
								result.averageData =  Math.floor(( result.totalData + current ) / result.cnt);  //평균  //neh
								result.data.average = Math.floor(( result.totalData + current ) / result.cnt);  //평균
								
								
					        	///--------------------------------------------성공했을 경우
								
								
//								var 
//							    controller = MainController.sharedInstance(),
//							    fitManager = FitManager.defaultManager().initialize();
							    //data = fitManager.stepMonthlyData();   
							    var  data = result;
							    
							    
							    var currentDateAry = data.target.split("-");
							    
							    
							    function fn_popText_layer(text,textDay){
							    	var maskHeight = $(document).height();
							    	var maskWidth = $(document).width();
							    	$('#mask').css({'width':maskWidth,'height':maskHeight});
							    	$('#mask').fadeTo("slow",0.7); 
							    	$('#popDay').empty();
							    	$('#popDay').append(textDay);
							    	$('#popText').empty();
							    	$('#popText').append(text);
							    	$('#pop_text').fadeIn(1000);      
							    	$("#pop_text").show();
							    	$('body').bind('touchmove', function(e){e.preventDefault()});
							    	$('html, body').css({'overflow': 'hidden'});
							    }

							    function fn_close_layer(){
							    	$('.layer').fadeOut(1000);  
							    	$('#mask').fadeOut(1000);    
							    	$('body').unbind('touchmove');
							    	//M.page.html("board.mainList.html", {action:"NO_HISTORY",param : {'boardParam':{"BOARD_TYPE":$("#BOARD_TYPE_OG").val(),"PAGE":$("#page").val(),"PAGE_BLOCK":$("#pageBlock").val()}}});

							    }
							    
							    $(".m-calendar").instance("Calendar",{
							        dayNames: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
							        active: true,
							        firstDay: 0
							    }).change(currentDateAry[0], currentDateAry[1])
							    .bind("selected", function(ui, date){        
							        var $selectEl = $(".m-calendar td.m-select");
							        if( $selectEl.hasClass("good") || $selectEl.hasClass("soso") ){
							            var message = 
							                $selectEl.data("goal")+"걸음 목표 중 " +
							                "<br/>"+
							                "<strong>"+$selectEl.data("value")+"</strong>"+"걸음";
							            
							            var messageDay =
							            	"<span>"+$selectEl.attr("data-day")+"</span>"+"일 ";

							            fn_popText_layer(message,messageDay);
							        }
							        ui.cancelSelect();
							    });
							    
							    /*
							    $(".cal_div").instance("Calendar",{
							        dayNames: ["SUN", "MON", "TUE", "WED", "THU", "FRI","SAT" ],
							        active: true,
							        firstDay: 0
							    }).change(currentDateAry[0], currentDateAry[1])
							    .bind("selected", function(ui, date){        
							        var $selectEl = $(".cal_div td.m-select");
							        if( $selectEl.hasClass("ok") || $selectEl.hasClass("failure") ){
							            var message = 
							                $selectEl.attr("data-day")+"일 "+
							                $selectEl.data("goal")+"걸음 목표 중 " +
							                $selectEl.data("value")+"걸음";

							            showToast(message);
							        }
							        ui.cancelSelect();
							    });
							    
							    $(".cal_div table td").click(function() {
							    	
							    	var $selectEl = $(".cal_div table td.m-select");
							    	
							        if( $selectEl.hasClass("good") || $selectEl.hasClass("soso")){
							        	console.log("onClick");
							            var message = 
							                $selectEl.attr("data-day")+"일 "+
							                $selectEl.data("goal")+"걸음 목표 중 " +
							                $selectEl.data("value")+"걸음";

							            fn_popText_layer(message);            
							        }
							    });
							    */
							    
							    var timer;
							    var $toast = $(".toast_popup");
							    function showToast(txt){
							        hideToast();
							        $toast.find(".pop_txtw").html(txt);
							        var wid = $toast.removeClass("dn").width();
							        $toast.css("margin-left", Math.round(wid*.5*-1));
							        timer = setTimeout(function(){
							           hideToast();
							        }, 1800);
							    }

							    function hideToast(){
							        clearTimeout(timer);
							        $toast.addClass("dn");
							    }

							    $(".m-calendar .m-calendar-header").addClass("dn");
							    $(".m-calendar table").addClass("cal_list");
							    var $items = $(".cal_list td");
							    
							    /*
							    $(".cal_div .cal_div-header").addClass("dn");
							    $(".cal_div table").addClass("cal_list_div");
							    $(".cal_div").addClass("cal_list_div");
							    
							    var $items = $(".cal_list_div td");
							    */
							    var goal = data.goalData;

							    var sucCount=0;
							    var failCount=0;
							    var indexLength = 0;
							    var itemData2= new Array;
							    $.each(data.dateKeys, function(index, key){
							    	
							        var itemData = data.data[key];

							        var attrData = {
							            value: String(itemData.value).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'), 
							            goal: String(itemData.goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')
							        };
							        //alert(JSON.stringify(itemData));
							        //if( itemData.status === "OK" ){
							        if(itemData.value >= itemData.goal){
							        //    sucCount++;
							        	if(itemData.value == 0 && itemData.goal == 0){
								        }
							        	else {
							        		$items.filter("[data-day="+(index+1)+"]").addClass("good").data(attrData);
							        	}
							        }
							        else if(itemData.value <= itemData.goal){
							          //  failCount++;
							        	if(itemData.value != 0){ //20180702 데이터 0인경우 아무런 액션 없도록 수정. 
							        		$items.filter("[data-day="+(index+1)+"]").addClass("soso").data(attrData);
							        	}
							        }
							        
							        itemData2[indexLength] = data.data[key];
							        indexLength++;

							    });
							  
							    //console.log("itemData2:"+JSON.stringify(itemData2));
							    for(var iii=0;indexLength>iii;iii++){
							    
							    	if (parseInt(itemData2[iii].value) >= parseInt(itemData2[iii].goal)) {
							    		if (parseInt(itemData2[iii].goal) <= 0 || parseInt(itemData2[iii].goal) == undefined || parseInt(itemData2[iii].goal) == null) {
							    			//failCount++;
							    		} else {
							    			sucCount++;	
							    		}		
							    	} else {
							    		if(parseInt(itemData2[iii].value) != 0){//20180702 데이터 0인경우 아무런 액션 없도록 수정. 
							    			failCount++;
							    		}
							    	}
							    }
							    

							    $("em.average_num").html(String(data.averageData).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
							    $(".txt1.goal em").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
							    //월간 걸음 수 목표달성및 목표 미달 카운트 표시하기
							    $(".suc_ok1 em").html(sucCount);
							    $(".suc_fa1 em").html(failCount);
							    if (M.navigator.os("android")) {
							    $("#average_num").html(String(data.averageData).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
							    $("#goal_num").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
							    }else{
							    $("#average_num").html(String(data.averageData).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')).css("font-size","14px");
							    $("#goal_num").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')).css("font-size","14px");
							    }
							    
							    //월간 걸음 수 목표달성및 목표 미달 카운트 표시하기
							    $("#suc_ok1").html(sucCount);
							    $("#suc_fa1").html(failCount);
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;
                    
                    case "fit.step.all":   //전체 걸음

                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						M.net.http.send({
							server: API.serverName,
							path: "/fit/step/all",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								console.log(result);
								var 
							    fitManager = self.fitManager();
								var current = fitManager.info().currentStep();
								var total_val = 0;
								if(result.item == null){
									total_val = current;
								} else {
									total_val = result.item.SYNC_VAL  + current;
								}
								
					        	 ///성공했을시---------------------------------------
								var stepCumulativelyData = total_val;
								var controller = MainController.sharedInstance(),
								fitManager = FitManager.defaultManager().initialize();

								if(isNaN(stepCumulativelyData)){
									stepCumulativelyData = 0;
								}
							    var userDataVale = stepCumulativelyData;
								var planetList = [{
									name: "달",
									step: 200000,
									className: "pl_moon"
								},{
									name: "금성",
									step: 200000,
									className: "pl_venus"
								},{
									name: "화성",
									step: 200000,
									className: "pl_mars"
								},{
									name: "수성",
									step: 200000,
									className: "pl_mercury"
								},{
									name: "태양",
									step: 200000,
									className: "pl_sun"
								},{
									name: "목성",
									step: 200000,
									className: "pl_jupiter"
								},{
									name: "토성",
									step: 200000,
									className: "pl_saturn"
								},{
									name: "천왕성",
									step: 200000,
									className: "pl_uranus"
								},{
									name: "해왕성",
									step: 200000,
									className: "pl_neptune"
								},{
									name: "명왕성",
									step: 200000,
									className: "pl_pluto"
								},{
									name: "캐플러452b",
									step: 200000,
									className: "pl_kepler"
								}];

								var elStr = "";
								var lastElStr = "";
								var addClassName = "";

								var totalStep =0;
								console.log("stepCumulativelyData", stepCumulativelyData);
								$.each(planetList, function(index, val){
									totalStep+=val.step;
									var data = stepCumulativelyData -= val.step;
									if( data < 0 ){
										// lastData = val.step + stepCumulativelyData;
										lastElStr = '<tr>'+
														'<td class="fzc">+'+(val.step + stepCumulativelyData)/1000+'K</td>'+
													'</tr>';
										
										return false;
									}else {
										addClassName = val.className;
										elStr += '<tr>'+
												'<td>+'+(val.step/1000)+'K</td>'+
											'</tr>'

										if(data==0){
											lastElStr = '<tr>'+
														'<td class="fzc">+'+0+'K</td>'+
													'</tr>';
											return false;
										}
									}
								});

								if(totalStep <= userDataVale ){
									lastElStr ="";
								}

								elStr = lastElStr+elStr;
								$(".planet_off").addClass(addClassName);
								$("tbody").html(elStr);
								$(".suc_txt em").html( fitManager.numberFormat( userDataVale ) );

								
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;

                    
                    case "fit.distance.weekly":   //이번주 이동거리

                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";
							
							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						M.net.http.send({
							server: API.serverName,
							path: "/fit/distance/weekly",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								console.log(result);
								
								//console.log("averageData: " +  result.averageData);
								
								
								var dateObj = new Date();
								var year = dateObj.getFullYear();
								var month = dateObj.getMonth()+1;
								var month1 = "";
								if( month < 10 ) {
									month1 = "0"+month;
								}else if( month >= 10) {
									month1 = month;
								}
								
								var day = dateObj.getDate();
								var today = year + "-" + month1+ "-" +  (day<10 ? '0'+day : day);  //오늘 날짜 가져오기 
								
								console.log(today); 
								
								var today_1 = new Date();
								var week_1 = new Array ('sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat');
								
								console.log( week_1[today_1.getDay()] ); //오늘 요일 가져오기 
								var week = week_1[today_1.getDay()];
								
								
								var 
							    fitManager = self.fitManager();
								var current = fitManager.info().currentDistance(); //거리수 
						//		var current = result.data[week].value;
								
								console.log(current);
								console.log("------------------------------------------");
								console.log(result);
								
								
								if (  current >  result.data[today].goal && current >  result.data[week].goal  ) {
									//ok
									result.data[today].status = "OK";
									result.data[week].status = "OK";
								}else if (  current <  result.data[today].goal  &&   current <  result.data[week].goal  ) {
									//fail
									result.data[today].status = "failure";
									result.data[week].status = "failure";
								}
								
								//
								var avg = result.averageData;  
								var tot = result.totalData;
								var dataKey = result.dateKeys.length;
								
								console.log("averageData: " +  avg);
								console.log("totalData: "+ tot);
								console.log("dataKey의 length:    "+ dataKey);
								console.log( result.data[today].value );
								var avg_result = ( avg * dataKey -  result.data[today].value + current ) / dataKey;
								var total_result =  tot - result.data[today].value + current ;
								
								//$("#distance_avg").html(numberWithCommas(parseInt(avg)) + " m");
								
								console.log("-------------결과------------")
								console.log(avg_result);
								console.log(total_result);

								console.log(week);
								//result.userData[ week_1[today_1.getDay()] ].value = current;
								
								//var goal = data.goalData;
								
								result.userData[week] = Math.floor(current);
								if( result.cnt == "0" ){
									result.averageData = current;
									result.data.average =current;
								}else{
									result.averageData =  Math.floor(( result.totalData + current ) / result.cnt);  //평균  //neh
									result.data.average = Math.floor(( result.totalData + current ) / result.cnt);  //평균
								}
								
								//---------------------성공했을시 
								
									var data = result;
									
									event.result = result;
									self.dispatchEvent("didSuccessExecute", event );
								    
									new WellnessBarGraph(result); 
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;
								event.setting = setting;
								
								console.log(event.setting);
								
								console.log(event.code);
								console.log(event.error);
								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;
                    
                    case "fit.distance.monthly":   //이번달 이동거리
                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						M.net.http.send({
							server: API.serverName,
							path: "/fit/distance/monthly",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								console.log(result);
								
								var dateObj = new Date();
								var year = dateObj.getFullYear();
								var month = dateObj.getMonth()+1;
								var month1 = "";
								if( month < 10 ) {
									month1 = "0"+month;
								}else if( month >= 10) {
									month1 = month;
								}
								
								var day = dateObj.getDate();
								console.log(day);
								
								//var today = year + "-" + month1+ "-" + (day<10 ? '0'+day : day);  //오늘 날짜 가져오기 
								var today = year + month1+ (day<10 ? '0'+day : day);  //오늘 날짜 가져오기 
								
								//월별 이동거리 전체 데이터 가져오기 
								var value_ls = new Array;
								var total_value = 0;
								
								for(var i=1; i <=day; i ++){
									var getDay = year + month1+ (i<10 ? '0'+i : i);
									
									if(result.userData[getDay] != 0){
										if(result.userData[getDay] != null){
											value_ls[i] = result.userData[getDay].value;
											total_value += value_ls[i];
										}
									}
									//console.log(getDay);
									//console.log(value_ls);
									//console.log(total_value);
								};
								
								$("#suc_txt_distance").html(total_value);
								
								console.log(today); 
								
								var today_1 = new Date();
								var week_1 = new Array ('sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat');
								
								
								
								console.log( week_1[today_1.getDay()] ); //오늘 요일 가져오기 
								var week = week_1[today_1.getDay()];
								
								
								var 
							    fitManager = self.fitManager();
								var current = fitManager.info().currentDistance(); //걸음 수 
								//var current = result.userData[today].value;
								
								console.log(current);
								console.log(result.cumulativelyData );
								
								var first = "1W";
								
								//result.userData[first]= result.userData[first] + current;
								result.userData[first]= result.userData[first]; 
								result.totalData = result.totalData + current; 
								result.cumulativelyData = result.cumulativelyData + current;
								console.log("---------"+  result.userData[first]);

								console.log(result.cumulativelyData );
								
								
								
								
								//---------성공했을 시 
								
									var data = result;
								    var elStr = "";
								    
								    var goal = data.goalData;
								    
								    $.each(data.dateGroupKeys, function(index, val){
								    	var indexLength = data.dateGroupKeys.length;
								    	var totalDistance = (data.userData[val] == 0) ? "데이터 없음" : String(Math.abs(data.userData[val])).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')+'m'; //20180703 누적 데이터 0인경우 데이터 수집이 안되었다고 판단 
								    	
								        if(index == indexLength-1){
								            elStr += '<ul>'+
								            			'<li class="on">';
								        }else{
								            elStr += '<ul>'+
					            						'<li class="">';
								        }
								        //alert(Math.abs(data.userData[val]));
								        elStr +='<a href="#">'+
								        	'<span class="icon">'+val+'</span>'+
								                '<span class="meter">'+totalDistance+'</span>'+
								                '</a>'+
								                '</li>'+
								                '</ul>';
								    });

								    //$(".suc_txt_distance em").html(String(data.cumulativelyData).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
								    $(".distance_list").html(elStr);
								    
								    $(".step2").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
								    $(".step_em1").html(" m");
								    
								    //퍼블리싱 작업 
								    //$("#suc_txt_distance").html(String(Math.abs(data.cumulativelyData)).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
								    $(".distance_list").html(elStr);
								    
								    //$(".step2").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
								    //$(".step_em1").html(" m");
								    
								    self.dispatchEvent("didSuccessExecute", event );
								    
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;
                    case "fit.distance.all":   //전체 이동거리

                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						M.net.http.send({
							server: API.serverName,
							path: "/fit/distance/all",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								console.log(result);
								
								var 
							    fitManager = self.fitManager();
								var current = fitManager.info().currentDistance(); //이동거리 
								
								//result.item.SYNC_VAL  =  result.item.SYNC_VAL  + current;
								
								
					        	//---------------성공했을 때
							
								    var distanceCumulativelyData = result.item.SYNC_VAL;
								    
								 
								    var data = (function(userDistance){
								        var mountain = [];
								        var data = {distance: userDistance, mountain: mountain};
								        var mountainInfo = [
								            {"name": "청계산", "height": 24800, "bgClass": "mtbg1", "imgName": "mt1_1.png"},
								            {"name": "북한산", "height": 33440, "bgClass": "mtbg1", "imgName": "mt1_2.png"},
								            {"name": "속리산", "height": 42320, "bgClass": "mtbg2", "imgName": "mt2_1.png"},
								            {"name": "용문산", "height": 46280, "bgClass": "mtbg2", "imgName": "mt2_2.png"},
								            {"name": "무등산", "height": 47480, "bgClass": "mtbg2", "imgName": "mt2_3.png"},
								            {"name": "팔공산", "height": 47680, "bgClass": "mtbg2", "imgName": "mt2_4.png"},
								            {"name": "가야산", "height": 57200, "bgClass": "mtbg2", "imgName": "mt2_5.png"},
								            {"name": "소백산", "height": 57560, "bgClass": "mtbg2", "imgName": "mt2_6.png"},
								            {"name": "오대산", "height": 62520, "bgClass": "mtbg3", "imgName": "mt3_1.png"},
								            {"name": "태백산", "height": 62680, "bgClass": "mtbg3", "imgName": "mt3_2.png"},
								            {"name": "함백산", "height": 62920, "bgClass": "mtbg3", "imgName": "mt3_3.png"},
								            {"name": "계방산", "height": 63080, "bgClass": "mtbg3", "imgName": "mt3_4.png"},
								            {"name": "덕유산", "height": 64560, "bgClass": "mtbg4", "imgName": "mt4_1.png"},
								            {"name": "금강산", "height": 65520, "bgClass": "mtbg4", "imgName": "mt4_2.png"},
								            {"name": "설악산", "height": 68320, "bgClass": "mtbg4", "imgName": "mt4_3.png"},
								            {"name": "묘향산", "height": 76360, "bgClass": "mtbg4", "imgName": "mt4_4.png"},
								            {"name": "지리산", "height": 76600, "bgClass": "mtbg4", "imgName": "mt4_5.png"},
								            {"name": "한라산", "height": 78000, "bgClass": "mtbg4", "imgName": "mt4_6.png"},
								            {"name": "남포태산", "height": 97400, "bgClass": "mtbg5", "imgName": "mt5_1.png"},
								            {"name": "백산", "height": 99040, "bgClass": "mtbg5", "imgName": "mt5_2.png"},
								            {"name": "북수백산", "height": 100880, "bgClass": "mtbg5", "imgName": "mt5_3.png"},
								            {"name": "백두산", "height": 109760, "bgClass": "mtbg5", "imgName": "mt5_4.png"}
								        ]

								        $.each(mountainInfo, function(){
								            userDistance -= this["height"];
								            mountain.push(this);
								            if(userDistance <= 0 ){
								                data["lastDistance"] = this["height"]+userDistance;
								                return false;
								            }
								        });
								        return data;

								    })(distanceCumulativelyData);

								    $(".suc_txt em").html(Wellness.util.comma(distanceCumulativelyData)+"m");
								    $("#suc_txt").html(Wellness.util.comma(distanceCumulativelyData)+"m");
								    
								    var Template = UI.Template;
								    var html = $("#template-mountain-list").html();
								    var template = Template.parse(html);
								    var parsedHTML = template.render( {items: data.mountain} );


								    var totalPage, currentPage;
								    var $container = $(".sl_list");
								    $container.html(parsedHTML);

								    var $element = $(".m-scrollswipe");
								    $element.height($element.height());
								    
								    var $prev = $(".wm_pre");
								    var swipe = $element.instance("ScrollSwipe", {
								        autoResize: true,
								        usePageIndicator: false,
								        useScrollBounce: true,
								        alwaysScrollBounce: true,
								    }).bind("change", function(ui, page){
								        setContent(page);
								    });

								    totalPage = swipe.totalPage();

								    var scroll = $element.instance("ScrollSwipe").scroll();
								    var flag;
								    scroll.bind("scrolling", function(){
								        if($element.width()*(swipe.totalPage()-1)+100 < scroll.scrollInfo().contentOffset.x){
								            if(flag){
								                showPopup();
								            }
								            flag = false;
								        }       
								    });

								    scroll.bind("endDragging", function(){
								        flag = true;
								    });

								    $(".contents").on("click", ".wm_pre", function(){
								        swipe.prev();
								        var page = swipe.page();
								        setContent(page);
								    });

								    $(".contents").on("click", ".wm_next", function(){
								        if(currentPage == totalPage){
								            showPopup();
								        }

								        swipe.next();
								        var page = swipe.page();
								        setContent(page);
								    });
								    
								    function fn_show_layer(id){
								       	var maskHeight = $(document).height();
								   	    var maskWidth = $(document).width(); 
								   	    $('#mask').css({'width':maskWidth,'height':maskHeight});
								   	    $('#mask').fadeTo("slow",0.7); 

								           $('#'+id).fadeIn(1000);      
								   	    $("#"+id).show();
								   	    $('body').bind('touchmove', function(e){e.preventDefault()});
								   	
								   	}

								    function fn_close_layer(){
								    	$('.layer').fadeOut(1000);  
								    	$('#mask').fadeOut(1000);    
								    	$('body').unbind('touchmove');
								    	//M.page.html("board.mainList.html", {action:"NO_HISTORY",param : {'boardParam':{"BOARD_TYPE":$("#BOARD_TYPE_OG").val(),"PAGE":$("#page").val(),"PAGE_BLOCK":$("#pageBlock").val()}}});

								    } 

								    var showPopup=function(){
								        //window.Wellness.showLayerPopup("pop01");
								    	fn_show_layer("pop_notice");
								    }
								    

								    var $items = $(".sl_list li");
								    var setCurrentMountainInfo=function(index){
								        var $item = $items.eq(index-1);
								        var name = data.mountain[index-1].name;
								        var height = Wellness.util.comma($item.attr("data-height"));
								        var distStr;
								        var distStr2;
								        if( index != totalPage ){
								            name += " 도달";  
								            distStr = height + "m ";
								            distStr2 = "/ "+height+"m";
								        }else{
								            var n = Wellness.util.comma(data.lastDistance);
								            distStr = n+ "m "
								            distStr2 = "/ "+height+"m";
								        }
								    var mt_icon = ""
								    	mt_icon +="<img src='../images/img_mountain.png' alt='산아이콘' style='width:20px;margin-right:5px'>";
								        $(".t1").html(mt_icon+name);
								        //$(".t2").html(distStr);
								        $("#mt_t_count").html(distStr)
								        $("#mt_t_goal").html(distStr2)
								    }

								    var setPrevButtonVisible = function(page){
								        if(page == 1 || totalPage == 1){
								            $prev.addClass("dn");
								        }else{
								            $prev.removeClass("dn");
								        }
								    }   

								    var setFlag=function(index){
								        var $item = $items.eq(index-1);
								        var $flag = $item.find(".w_flag");
								        var bottom = 100;
								        if( totalPage == index){
								            var height = $item.attr("data-height");
								            bottom = ( 100 - 0 ) / ( height - 0 ) * ( data.lastDistance - 0 ) + 0;
								        }

								        setTimeout(function(){
								            $flag.css("bottom", bottom+"%");
								        }, 300 );
								        
								    }

								    var setContent=function(page){
								        currentPage = page;
								        setPrevButtonVisible(page);
								        setCurrentMountainInfo(page);
								        setFlag(page);
								    }

								    var imgCount = $(".mtps>img").length;
								    $(".mtps>img").load(function(){
								        imgCount--;
								        if(imgCount==0){
								            setContent(1);    
								        }
								    });
								    
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;
                    
                    
                    case "fit.calory.today":   //오늘 칼로리

                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						M.net.http.send({
							server: API.serverName,
							path: "/fit/calory/today",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								console.log(result);
								var dateObj = new Date();
								var year = dateObj.getFullYear();
								var month = dateObj.getMonth()+1;
								var month1 = "";
								if( month < 10 ) {
									month1 = "0"+month;
								}else if( month >= 10) {
									month1 = month;
								}
								
								var day = dateObj.getDate();
								var today = year + "-" + month1+ "-" +  (day<10 ? '0'+day : day); //오늘 날짜 가져오기 
								
								console.log(today); 
								
								var today_1 = new Date();
								var week_1 = new Array ('sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat');
								
								console.log( week_1[today_1.getDay()] ); //오늘 요일 가져오기 
								var week = week_1[today_1.getDay()];
								
								/*
								var checkEventYn = formData["checkEventYn"];
								if (checkEventYn == "n") {
									today_1 = new Date();
									//alert("today_1_off:"+today_1);
								} else {
									today_1 = new Date(formData["checkDate"]);
									//alert("today_1_on:"+today_1);
								}
								*/
								
								var 
							    fitManager = self.fitManager();
								var current = fitManager.info().currentCalorie(); //현재칼로리  
								
								console.log(current);
								console.log("------------------------------------------");
								console.log(result);
								
								result.item.SYNC_VAL= current;
								
					        	//-------------------------------성공시
//								var controller = MainController.sharedInstance(),
//							    fitManager = FitManager.defaultManager().initialize(),
							    var userCalories = result.item.SYNC_VAL;   
							    
							    $(".w_mt_ck").removeClass("dn");
							    var $targetEl = $(".wwck_img").removeClass("sm");
							    if( userCalories < 400 ){
							        $targetEl.addClass("sm");
							    }else if(userCalories>=400 && userCalories<800){
							        $targetEl.addClass("md");
							    }else{
							        $targetEl.addClass("lg");
							    }

							    setTimeout(function(){
							        $(".img_fire_bg>.img_fire").addClass("ani");
							    }, 700 );
							    
							    
							    $(".suc_txt_ck .num em").html(String(userCalories).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
							   /* (".suc_txt_ck .num").prepend((function(no){
							        var str = no+"";
							        str = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
							        var noAry = str.split("");
							        var elStr = "";
							        $.each(noAry, function(index, value){
							            if(value != ","){
							                elStr += '<span title="'+value+'">'+value+'</span>';    
							            }else{
							                elStr += '<span>'+value+'</span>';    
							            }
							        });
							        return elStr;
							    })( userCalories ));

							    //caloriesBySteps

							    var $items = $(".suc_txt_ck .num span[title]");
							    var time=0;
							    var itemHei = $items.eq(0).height();
							    var textGroupNum = 1;
							    var targetTop = (itemHei*(10*textGroupNum)*-1);
							    for(var i=$items.length-1; i>=0; i--){
							        time++;
							        var $t = $($items.eq(i));
							        var n = parseInt($t.attr("title"));
							        var html = $t.html();
							        for(var j=0; j<(10*textGroupNum); j++){
							            n++;
							            if(n>9){
							                n=0;
							            }
							            html+= "<br>"+n;            
							        }

							        (function(target){
							            setTimeout(function(){
							                slideTxt(target, targetTop);
							            }, (time*170)+300);
							        })($t);
							        
							        $t.html(html);
							    }

							    

							    var slideTxt=function($target, top){
							        $target.animate({top: top}, 1200, "easeInOutElastic");
							    }*/
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;
                    
                    case "fit.calory.weekly":   //이번주  칼로리
                    	
                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						M.net.http.send({
							server: API.serverName,
							path: "/fit/calory/weekly",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator, 
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								
								
								console.log(result);
								
								var dateObj = new Date();
								var year = dateObj.getFullYear();
								var month = dateObj.getMonth()+1;
								var month1 = "";
								if( month < 10 ) {
									month1 = "0"+month;
								}else if( month >= 10) {
									month1 = month;
								}
								
								var day = dateObj.getDate();
								var today = year + "-" + month1+ "-" + (day<10 ? '0'+day : day);  //오늘 날짜 가져오기 
								
								console.log(today); 
								
								var today_1 = new Date();
								var week_1 = new Array ('sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat');
								
								console.log( week_1[today_1.getDay()] ); //오늘 요일 가져오기 
								var week = week_1[today_1.getDay()];
								
								
								var 
							    fitManager = self.fitManager();
								var current = fitManager.info().currentCalorie(); //칼로린 수 
								//var current = result.data[week].value;
								
								console.log(current);
								console.log("------------------------------------------");
								console.log(result);
								
								//
								var avg = result.averageData;  
								var tot = result.totalData;
								var dataKey = result.dateKeys.length;
								
								var avg_result = ( avg * dataKey -  result.data[today].value + current ) / dataKey;
								var total_result =  tot - result.data[today].value + current ;
								
								console.log("-------------결과------------")
								console.log(avg_result);
								console.log(total_result);

								console.log(week);
								//result.userData[ week_1[today_1.getDay()] ].value = current;
								//$("#kcal_avg").html(numberWithCommas(parseInt(avg)) + " kcal");
								
								result.userData[week] = current;
								console.log("골:   "+result.data[today].goal   +  "현재   :" + current);
								console.log("골:   "+result.data[week].goal   +  "현재   :" + current);
									if (  current >  result.data[today].goal && current >  result.data[week].goal  ) {
										//ok
										result.data[today].status = "OK";
										result.data[week].status = "OK";
									}else if (  current <  result.data[today].goal  &&   current <  result.data[week].goal  ) {
										//fail
										result.data[today].status = "failure";
										result.data[week].status = "failure";
									}
									/*
									if( result.cnt == "0" ){
										result.averageData = current;
										result.data.average = current;
									}else {
										result.averageData =  Math.floor(( result.totalData + current ) / result.cnt);  //평균  //neh
										result.data.average = Math.floor(( result.totalData + current ) / result.cnt);  //평균
									}
									*/
					        	//---------------------------------------------성공시
								 var controller = MainController.sharedInstance(),
								 fitManager = FitManager.defaultManager().initialize();
								 var  data = result;
									
								 event.result = result;
									self.dispatchEvent("didSuccessExecute", event );
								    new WellnessBarGraph(data);
								    
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;
                    
                    case "fit.calory.monthly":   //이번달 칼로리

                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

						M.net.http.send({
							server: API.serverName,
							path: "/fit/calory/monthly",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								console.log(result);
								
								//오늘자 칼로리 월별 제대로 표시하기 
								//현재 서버에서 데이터를 가지고오면 nodata라고 뜨고 있음 (포스트맨)
								//다음은 서버개발자가 없을 경우를 가정하여 우회적으로 만드는 로직 
								//console.log(result.goalData);
								//var dateKeys_is = result.dateKeys;
								
								//console.log(userData_is);
								
								/*
								for(var i= 0; i <result.dateKeys.length; i++){
									dateKeys_is = dateKeys_is.replace(/\-/g,'');
									console.log(dateKeys_is[i]);
									var getuserData = result.userData[dateKeys_is[i]];
									console.log(getuserData[i]);
								}
								*/
								var dateObj = new Date();
								var year = dateObj.getFullYear();
								var month = dateObj.getMonth()+1;
								var month1 = "";
								if( month < 10 ) {
									month1 = "0"+month;
								}else if( month >= 10) {
									month1 = month;
								}
								
								var day = dateObj.getDate();
								var today = year + "-" + month1+ "-" + (day<10 ? '0'+day : day);  //오늘 날짜 가져오기 
								
								var today_1 = new Date();
								var week_1 = new Array ('sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat');
								console.log( week_1[today_1.getDay()] ); //오늘 요일 가져오기 
								var week = week_1[today_1.getDay()];
								
								
								var 
							    fitManager = self.fitManager();
								var current = fitManager.info().currentCalorie(); //칼로린 수 
								//var current = result.data[today].value;
								console.log(current);
							
								//result.userData[ week_1[today_1.getDay()] ].value = current;
								if (  current >  result.data[today].goal ) {
									//ok
									result.data[today].status = "OK";
									
								}else if (  current <  result.data[today].goal ) {
									//fail
									result.data[today].status = "failure";
								
								}
								
								
								result.data[today].value = current; 						//현재날짜에 해당하는 값 
								//result.averageData =  Math.floor(( result.totalData + current ) / result.cnt);  //평균
								//result.data.average = Math.floor(( result.totalData + current ) / result.cnt);  //평균	
								result.data.average = result.averageData;  //평균	
								
								
					        	//------------------------------------성공했을 때
								 var controller = MainController.sharedInstance(),
								    fitManager = FitManager.defaultManager().initialize();
								   var data = result;   
								    
								    var $userDataEl = $(".user_value");
								    var currentDateAry = data.target.split("-");
								    var userAverageData = String(data.averageData).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

								    function fn_popText_layer(text,textDay){
								    	var maskHeight = $(document).height();
								    	var maskWidth = $(document).width();
								    	$('#mask').css({'width':maskWidth,'height':maskHeight});
								    	$('#mask').fadeTo("slow",0.7); 
								    	$('#popDay').empty();
								    	$('#popDay').append(textDay);
								    	$('#popText').empty();
								    	$('#popText').append(text);
								    	$('#pop_text').fadeIn(1000);      
								    	$("#pop_text").show();
								    	$('body').bind('touchmove', function(e){e.preventDefault()});
								    	$('html, body').css({'overflow': 'hidden'});
								    }

								    function fn_close_layer(){
								    	$('.layer').fadeOut(1000);  
								    	$('#mask').fadeOut(1000);    
								    	$('body').unbind('touchmove');
								    	//M.page.html("board.mainList.html", {action:"NO_HISTORY",param : {'boardParam':{"BOARD_TYPE":$("#BOARD_TYPE_OG").val(),"PAGE":$("#page").val(),"PAGE_BLOCK":$("#pageBlock").val()}}});

								    }
								    
								    /*
								    $(".cal_div").instance("Calendar",{
								        dayNames: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
								        active: true,
								        firstDay: 0
								    }).change(currentDateAry[0], currentDateAry[1])
								    .bind("selected", function(ui, date){
								        var year = date.getFullYear();
								        var month = date.getMonth()+1;
								        var date = date.getDate();

								        calendar.select(year, month, date);

								        if(month<10){month = "0"+month;}
								        if(date<10){date = "0"+date;}
								        var dateStr = year+"-"+month+"-"+date;
								        
								        var $selectEl = $(".cal_div td.m-select");
								        if( $selectEl.hasClass("ok") || $selectEl.hasClass("failure") ){
								            var message = 
								                $selectEl.attr("data-day")+"일 "+
								                $selectEl.data("goal")+"kcal 목표 중 " +
								                $selectEl.data("value")+"kcal 소모";

								            showToast(message);
								            
								            ui.cancelSelect();
								            //$userDataEl.html($selectEl.attr("data-day")+"일 "+$selectEl.attr("data-userValue"));
								        }else{
								            //showToast("평균 "+userAverageData+"kcal 소모");
								            //$userDataEl.html("평균 "+userAverageData);
								        }
								    });
								    */
								    var goal = data.goalData;
								    
								    $(".m-calendar").instance("Calendar",{
								        dayNames: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
								        active: true,
								        firstDay: 0
								    }).change(currentDateAry[0], currentDateAry[1])
								    .bind("selected", function(ui, date){        
								        var $selectEl = $(".m-calendar td.m-select");
								        if( $selectEl.hasClass("good") || $selectEl.hasClass("soso") ){
								        	
								        	var message = 
								        		$selectEl.data("goal")+"kcal 목표 중 " +
								                "<br/>"+
								                "<strong>"+$selectEl.data("value")+"</strong>"+"kcal 소모";
								            
								            var messageDay =
								            	"<span>"+$selectEl.attr("data-day")+"</span>"+"일 ";

								        	fn_popText_layer(message,messageDay);
								        }
								        ui.cancelSelect();
								    });
								    /*
								    $(".cal_div table td").click(function() {
								    	console.log("onClick");
								    	var $selectEl = $("#click_day");
								        if( $selectEl.hasClass("good") || $selectEl.hasClass("soso")){
								           
								        	var message = 
								                $selectEl.attr("data-day")+"일 "+
								                $selectEl.data("goal")+"kcal 목표 중 " +
								                $selectEl.data("value")+"kcal 소모";

								            fn_popText_layer(message);            
								        }
								    });
								    */

								    var timer;
								    var $toast = $(".toast_popup");
								    function showToast(txt){
								        hideToast();
								        $toast.find(".pop_txtw").html(txt);
								        var wid = $toast.removeClass("dn").width();
								        $toast.css("margin-left", Math.round(wid*.5*-1));
								        timer = setTimeout(function(){
								           hideToast()
								        }, 1800);
								    }

								    function hideToast(){
								        clearTimeout(timer);
								        $toast.addClass("dn");
								    }
								    
								    /*
								    $(".cal_div .cal_div-header").addClass("dn");
								    $(".cal_div table").addClass("cal_list_div");
								    var $items = $(".cal_list_div td");
								    */
								    
								    $(".m-calendar .m-calendar-header").addClass("dn");
								    $(".m-calendar table").addClass("cal_list");
								    var $items = $(".cal_list td");
								    
								    
								    var sucCount=0;
								    var failCount=0;
								    var indexLength = 0;
								    var itemData2= new Array;
								    
								    console.log(goal);
								    
								    $.each(data.dateKeys, function(index, key){
								    	var key_value_ls = String(key).replace(/\-/g,'');
								        var itemData = data.data[key];

								        var attrData = {
								            value: String(itemData.value).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'), 
								            goal: String(itemData.goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')
								        };
								       //console.log("itemData:"+JSON.stringify(itemData));
								        
								        if( itemData.status === "OK" ){
								            sucCount++;
								            $items.filter("[data-day="+(index+1)+"]").addClass("good").data(attrData);
								        }
								        else if(itemData.value != 0){ //20180702 데이터 0인경우 아무런 액션 없도록 수정. 
								            failCount++;
								            $items.filter("[data-day="+(index+1)+"]").addClass("soso").data(attrData);
								        }
								        
								        /*
								        if( result.userData+"."+key_value_ls >= result.goalData ){
								        		
									            sucCount++;
									            $items.filter("[data-day="+(index+1)+"]").addClass("good").data(attrData);
									        }
								        else if(itemData.value == 0 && itemData.goal == 0){}
								        else{
								            failCount++;
								            $items.filter("[data-day="+(index+1)+"]").addClass("soso").data(attrData);
								        }
								        */
								        itemData2[indexLength] = data.data[key];
								        indexLength++;
								    });
								    
								    //console.log("itemData2:"+JSON.stringify(itemData2));
								    /*
								    for(var iii=0;indexLength>iii;iii++){
									    
								    	if (parseInt(itemData2[iii].value) >= parseInt(itemData2[iii].goal)) {
								    		if (parseInt(itemData2[iii].goal) <= 0 || parseInt(itemData2[iii].goal) == undefined || parseInt(itemData2[iii].goal) == null) {
								    			//failCount++;
								    		} else {
								    			sucCount++;	
								    		}		
								    	} else {
								    		failCount++;
								    	}
								    }
								    */
								    $userDataEl.html("평균 "+userAverageData);
								    /*
								    $(".step1").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
								    $(".step_em").html(" kcal");
								    $(".txt1.goal em").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
								    */
								    //월간 칼로리 수치 목표달성및 목표 미달 카운트 표시하기
								    /*
								    $(".suc_ok1 em").html(sucCount);
								    $(".suc_fa1 em").html(failCount);
								    */
								//    $(".step1").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
								    if (M.navigator.os("android")) {
								    	$("#user_value").html(userAverageData);
									    $("#goal").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
								    }else{
								    	$("#user_value").html(userAverageData).css("font-size","14px");
									    $("#goal").html(String(goal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')).css("font-size","14px");
								    }
								    $("#suc_ok1").html(sucCount);
								    $("#suc_fa1").html(failCount);
								    
								    
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;
                    
                    case "fit.sleep.get":   //수면시간 대시보드 

						if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}

		
						M.net.http.send({
							server: API.serverName,
							path: "/fit/sleep/get",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								
								console.log(result);
								
								$("#span_come").text("계산하는 중...");
								event.result = result.retItem;
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
						break;
                    
                    case "fit.profile.get" :
                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
		
						M.net.http.send({
							server: API.serverName,
							path: "/user/getProfile",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								M.tool.log("testlog:"+JSON.stringify(result));
								console.log("프로필 user_key :"   + result.user_key);
								console.log("프로필 body_weight:" + result.body_weight);
								console.log("프로필 goal_val   :" + result.goal_val);
								console.log("프로필 sleep_start :"+ result.sleep_start);
								console.log("프로필 sleep_end   :"+ result.sleep_end);
								
								event.result = result;
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
						
						break;
                    case "fit.sleep.yesterday":   //어제 수면시간
                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}  

						M.net.http.send({
							server: API.serverName,
							path: "/fit/sleep/yesterday",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
					        //	----------------------------------- ----------성공시

								event.result = result;
								//self.dispatchEvent("didFinishExecute", event );
											 
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;
                      
                    case "fit.sleep.weekly":   //이번주 수면시간

                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
						M.net.http.send({
							server: API.serverName,
							path: "/fit/sleep/weekly",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								console.log(result);
					        	//------------------------------------성공했을 시 
								
								var data = result;
								
								//var get_myData = data.userData+
								
								
//					        	
//					            var controller = MainController.sharedInstance(),
//					            fitManager = FitManager.defaultManager().initialize(),
//					            data = fitManager.sleepWeeklyData();
					            
					            var timeAry=[];
					            var goodCount = 0;
					            var sosoCount = 0;
					            var badCount = 0;

					            $.each( data.userData, function(){
					                timeAry.push(this["time"]["good"]);
					                timeAry.push(this["time"]["soso"]);

					                switch(this["status"]){
					                    case "GOOD":
					                        goodCount++;
					                    break;
					                    case "SOSO":
					                        sosoCount++;
					                    break;
					                    case "BAD":
					                        badCount++;
					                    break;
					                };
					            });

					            //총 수면시간 설정
								//$('#sleep_total').append(Math.floor(sleepTime/60));

								//선잠 설정
								//$('#sleep_soso').append(Math.floor(sosoTime/60));
					            
						        //수면 상태 설정
								$('#sleep_state').append(data.status);
								
					            var sortTime = timeAry.concat().sort(function(a, b){return a-b});
					            var maxTime = sortTime.pop();
					           
					            //$(".suc_ok1 em").html(goodCount);
					            //$(".suc_fa1 em").html(badCount);
					            //$(".suc_txt_sl2 em").html(sosoCount);
					            
					            $("#suc_ok1").html(goodCount);
					            $("#suc_fa1").html(badCount);
					            $("#suc_txt_sl2").html(sosoCount);

					            var elementStr = "";
					            
					            $.each( data.weekKeys, function(idx, weekKey){
					                var itemData = data.userData[weekKey];
					                var str = "";

					                if ( itemData ) {

					                    str = '<li>'+
					                            '<div class="icon">'+weekKey+'</div>'+
					                            '<div class="dw_bar">'+
					                                
					                            '</div>'+
					                        '</li>';

					                    var goodTime = itemData["time"]["good"];
					                    var sosoTime = itemData["time"]["soso"];

					                    var goodWid = Math.round(( 100 - 0 ) / ( maxTime - 0 ) * ( goodTime - 0 ) + 0);
					                    var sosoWid = Math.round(( 100 - 0 ) / ( maxTime - 0 ) * ( sosoTime - 0 ) + 0);
					                    
					                    var stateClass = "gs";

					                    if ( itemData["status"] === "-" ) {
					                        return;
					                    }

					                    switch(itemData["status"]){
					                        case "SOSO":
					                            stateClass = "ss";
					                        break;
					                        case "BAD":
					                            stateClass = "bs";
					                        break;
					                    }

					                    
					        str = 		'<li>'+  
						        			'<span class="icon">'+weekKey+'</span>'+		
											'<div class="time_div good">'+
												'<div class="sleep_line">'+
													'<p class="line" style="width:0%" data-wid="'+goodWid+'%"></p>'+					
												'</div>'+
												'<span class="time_txt">'+getTimeStr(goodTime)+'</span>'+
											'</div>'+
											'<div class="time_div bad">'+
												'<div class="sleep_line">'+
													'<p class="line" style="width:'+sosoWid+'%" data-wid="'+sosoWid+'%"></p>'+						
												'</div>'+
												'<span class="time_txt">'+getTimeStr(sosoTime)+'</span>'+
											'</div>'+
										'</li>';   
					                }

					                elementStr = elementStr + str;
					            });
					            
					            $(".sleep_list ul").html(elementStr);

					            var count = 0;
					            $(".sleep_line .line").each(function(index){
					                var $target = $(this);
					                setTimeout(function(){
					                    $target.width($target.attr("data-wid"));
					                }, count );

					                if(index%2){
					                    count += 200;   
					                }else{
					                    count += 100;
					                }       
					            }); 

					            
					            function getTimeStr(time){
					                var hour = Math.floor(time/60);
					                var min = time%60;
					                return (hour)+"시 "+min+"분" ;
					            }
					            

							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
                    break;
//                    
//                    
                    case "fit.sleep.monthly":   //이번달 수면시간
                    	if ( ! M.info.device("network.connected") ) {
							event.code = -1;
							event.error = "network is disconnected";

							self.dispatchEvent("didErrorExecute", event);
							return;
                    	}
                    	
						M.net.http.send({
							server: API.serverName,
							path: "/fit/sleep/monthly",
							data: {
                                "user_key": self.userInfo().userKey()
							},
                            indicator: {
                                show: event.showIndicator,
                                cancelable: event.cancelable
                            },
							method: "POST",
							start: function() {
								self.dispatchEvent("didStartExecute", event );
							},
							finish: function() {
								self.dispatchEvent("didFinishExecute", event );
							},
							success: function(result, setting) {
								
								console.log(result);
					        	 ///성공했을 시 --------------------------------
//								  var controller = MainController.sharedInstance(),
//								    fitManager = FitManager.defaultManager().initialize(),
//								    data = fitManager.sleepMonthlyData();
									var data = result;
								    var currentDateAry = data.target.split("-");
								    /*
								    $(".m-calendar").instance("Calendar",{
								        dayNames: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
								        active: true,
								        firstDay: 1
								    }).change(currentDateAry[0], currentDateAry[1])
								    .bind("selected", function(ui, date){        
								        console.log( ui, date );

								        var $selectEl = $(".m-calendar td.m-select");
								        if( $selectEl.hasClass("ok") || $selectEl.hasClass("failure") || $selectEl.hasClass("bad")){
								            var sleepTime = parseInt($selectEl.attr("data-time-sleep"));
								            var goodTime =  parseInt($selectEl.attr("data-time-good"));
								            var sosoTime = parseInt($selectEl.attr("data-time-soso"));
								            var badCount = parseInt($selectEl.attr("data-time-bad"));
								           

								            var str =  "총수면시간 : "+Math.floor(sleepTime/60)+"시간 "+(sleepTime%60)+"분"+"<br>"
								                        +"숙면 : "+Math.floor(goodTime/60)+"시간 "+(goodTime%60)+"분"+"<br>"
								                        +"선잠 : "+Math.floor(sosoTime/60)+"시간 "+(sosoTime%60)+"분"+"<br>"
								                        +"기상 : "+badCount/2+"회";

								            showToast(str);            
								        }

								        ui.cancelSelect();
								    });
								    */
								    function fn_popText_layer(text,textDay){
								    	var maskHeight = $(document).height();
								    	var maskWidth = $(document).width();
								    	$('#mask').css({'width':maskWidth,'height':maskHeight});
								    	$('#mask').fadeTo("slow",0.7); 
								    	$('#popDay').empty();
								    	$('#popDay').append(textDay);
								    	$('#popText').empty();
								    	$('#popText').append(text);
								    	$('#pop_sleep_info2').fadeIn(1000);      
								    	$("#pop_sleep_info2").show();
								    	$('body').bind('touchmove', function(e){e.preventDefault()});
								    	$('html, body').css({'overflow': 'hidden'});
								    }

								    function fn_close_layer(){
								    	$('.layer').fadeOut(1000);  
								    	$('#mask').fadeOut(1000);    
								    	$('body').unbind('touchmove');
								    	//M.page.html("board.mainList.html", {action:"NO_HISTORY",param : {'boardParam':{"BOARD_TYPE":$("#BOARD_TYPE_OG").val(),"PAGE":$("#page").val(),"PAGE_BLOCK":$("#pageBlock").val()}}});

								    } 
								    
								    $(".cal_div").instance("Calendar",{
								        dayNames: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
								        active: true,
								        firstDay: 0
								    }).change(currentDateAry[0], currentDateAry[1])
								    .bind("selected", function(ui, date){        
								        console.log( ui, date );

								        

								        ui.cancelSelect();
								    });
								    
								    $(".cal_div table td").click(function() {
								    	console.log("onClick");
								    	var $selectEl = $("#click_day");
								        if( $selectEl.hasClass("good") || $selectEl.hasClass("soso") || $selectEl.hasClass("bad")){
								            var sleepTime = parseInt($selectEl.attr("data-time-sleep"));
								            var goodTime =  parseInt($selectEl.attr("data-time-good"));
								            var sosoTime = parseInt($selectEl.attr("data-time-soso"));
								            var badCount = parseInt($selectEl.attr("data-time-bad"));
								           

								            var str =  "총수면시간 : "+"<strong>"+Math.floor(sleepTime/60)+"</strong>"+"시간 "+"<strong>"+(sleepTime%60)+"</strong>"+"분"+"<br>"
								                        +"숙면 : "+Math.floor(goodTime/60)+"시간 "+(goodTime%60)+"분"+"<br>"
								                        +"선잠 : "+Math.floor(sosoTime/60)+"시간 "+(sosoTime%60)+"분"+"<br>"
								                        +"기상 : "+badCount/2+"회";

								            var messageDay =
								            	"<span>"+$selectEl.attr("data-day")+"</span>"+"일 ";
								            
								            fn_popText_layer(str,messageDay);            
								        }
								    });
								    
								    $(".m-calendar").instance("Calendar",{
								        dayNames: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
								        active: true,
								        firstDay: 0
								    }).change(currentDateAry[0], currentDateAry[1])
								    .bind("selected", function(ui, date){        
								        var $selectEl = $(".m-calendar td.m-select");
								        if( $selectEl.hasClass("good") || $selectEl.hasClass("soso") || $selectEl.hasClass("bad")){
								            var sleepTime = parseInt($selectEl.attr("data-time-sleep"));
								            var goodTime =  parseInt($selectEl.attr("data-time-good"));
								            var sosoTime = parseInt($selectEl.attr("data-time-soso"));
								            var badCount = parseInt($selectEl.attr("data-time-bad"));
								           

								            var str =  "총수면시간 : "+"<strong>"+Math.floor(sleepTime/60)+"</strong>"+"시간 "+"<strong>"+(sleepTime%60)+"</strong>"+"분"+"<br>"
					                        +"숙면 : "+Math.floor(goodTime/60)+"시간 "+(goodTime%60)+"분"+"<br>"
					                        +"선잠 : "+Math.floor(sosoTime/60)+"시간 "+(sosoTime%60)+"분"+"<br>"
					                        +"기상 : "+badCount/2+"회";

								            var messageDay =
								            	"<span>"+$selectEl.attr("data-day")+"</span>"+"일 ";
								            
								            fn_popText_layer(str,messageDay);           
								        }
								        ui.cancelSelect();
								    });
								    
								    $(".m-calendar .m-calendar-header").addClass("dn");
								    $(".m-calendar table").addClass("cal_list");
								    var $items = $(".cal_list td");
								    
								    //$(".cal_div .cal_div-header").addClass("dn");
								    //$(".cal_div table").addClass("cal_list_div");
								    //var $items = $(".cal_list_div td");
								    var goal = data.goalData;

								    var sucCount=0;
								    var failCount=0;

								    $.each(data.dateKeys, function(index, val){
								        if( data.todayDateKey != this ){
								            var infoData = data.data[String(this)];
								            var status = data.userData[val];
								            var $target = $items.filter("[data-day="+(index+1)+"]");
								            if ( status == "GOOD" ) {
								                sucCount++;
								                $target.addClass("good");
								            }
								            else if ( status == "SOSO" ) {
								                failCount++;
								                $target.addClass("soso");
								            }
								            else if ( status == "BAD" ){
								                failCount++;
								                $target.addClass("bad");
								            }

								            if( infoData && infoData.time ){
								                $target.attr("data-bad-count", infoData.count);
								                $target.attr("data-time-total", infoData.time.total);
								                $target.attr("data-time-sleep", infoData.time.sleep);
								                $target.attr("data-time-good", infoData.time.good);
								                $target.attr("data-time-soso", infoData.time.soso);
								                $target.attr("data-time-bad", infoData.time.bad);
								            }
								            
								        }
								    });
								    //월간 수면 시간 목표달성 및 목표 미달 카운트 표시하기
								    $(".suc_ok1 em").html(data.good);
								    $(".suc_txt_sl2 em").html(data.soso);
								    $(".suc_fa1 em").html(data.bad);
								    
								    $("#suc_ok1").html(data.good);
								    $("#suc_txt_sl2").html(data.soso);
								    $("#suc_fa1").html(data.bad);

								    var timer;
								    var $toast = $(".toast_popup");
								    function showToast(txt){
								        hideToast();
								        $toast.find(".pop_txtw").html(txt);
								        var wid = $toast.removeClass("dn").width();
								        $toast.css("margin-left", Math.round(wid*.5*-1));
								        timer = setTimeout(function(){
								           hideToast();
								        }, 1800);
								    }

								    function hideToast(){
								        clearTimeout(timer);
								        $toast.addClass("dn");
								    }
					        	
							},
							error: function(code, message, setting) {
								event.code = code;
								event.error = message;

								self.dispatchEvent("didErrorExecute", event);
							}
						});
						
                    break;



					default:
						console.warn("unknown command", event.command, event );

				}

				return self;
			},
            //20180703 서버와 수동 싱크
            reqDataSyncToServer : function( result ){
            	console.log("call reqDataSync " + JSON.stringify(result));
                var popupController = PopupController.sharedInstance();
                
                M.data.removeGlobal("syncStart");
            	//싱크 요청 시
            	if(result == undefined){
            		console.log("reqDataSync if");
            		popupController.showIndicator();
            		popupController.setIndicatorMessage("동기화 진행 중...");
            		self.execute("synch.manual",{},{});
            	}else{ //싱크 완료 시
                	console.log("reqDataSync else");
                	popupController.hideIndicator();
            		if(result != "SYNC_OK"){
            			M.data.global("SyncPercent", result);
            		}else{
            			M.data.removeGlobal("SyncPercent");
            		}
            		self.view().loadSyncBtn();
            		
            		if(M.page.info().filename != "dashboard.main.html"){ //Bang Main화면의 복잡성 및 로딩 문제가 발생하지 않아 제외 처리
            			location.reload(); //20180705 백그라운드에서 돌아올때 화면 일부가 로딩되지 않는 에러 해결을 위해 페이지 새로고침
            		}
            	}
            }
		};
	},
	staticConstructor: function() {
		var _instance;

		return {
			sharedInstance: function() {
				if ( _instance === undefined ) {
					_instance = new MainController();
				}
				return _instance;
			}
		}
	}
});

window.Macro = Macro;
window.MainController = MainController;

})(window);
