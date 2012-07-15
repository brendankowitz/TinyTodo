
require.config({
    paths: {
        'spine': 'spine/spine',
        'spine/route': 'spine/route',
        'spine/manager': 'spine/manager',
        'spine/local': 'spine/local',
        'spine/ajax': 'spine/ajax',
        'jquery': 'jquery-1.7.2',
        'jquery/mobile': 'jquery.mobile-1.1.0',
        'hogan': 'hogan-2.0.0',
        'signalr': 'jquery.signalR-0.5.2.min',
        'jquery/extensions': '_extensions',
        'TaskController': 'controllers/TaskController',
        'DetailController': 'controllers/DetailController',
        'SettingsController': 'controllers/SettingsController',
        'signalr/taskHub': 'taskHubProxy',
        'jquery/storage': 'jstorage',
        'phonegap/loader': 'phonegap-loader'
    },
    shim: {
        'jquery/mobile': ['jquery'],
        'spine': ['jquery'],
        'spine/manager': ['spine'],
        'spine/route': ['spine'],
        'spine/local': ['spine', 'jquery/storage'],
        'spine/ajax': ['spine'],
        "jquery/extensions": ["jquery", "hogan"],
        "signalr": ["jquery"],
        "signalr/taskHub": ["signalr"]
    }
});

require(['jquery',
    'models/Task',
    'models/Settings',
//'phonegap/loader',
    'TaskController',
    'DetailController',
    'SettingsController',
    'jquery/mobile',
    'jquery/extensions',
    'signalr',
    'signalr/taskHub',
    'spine/manager',
    'spine/route'],
    function ($, Task, Settings) {
        $(function () {
            window.TaskApplication = function () {
                return {
                    setupHub: function () {
                        try {
                            var tasks = $.connection.taskHub;
                            $.connection.hub.start(function () {
                                tasks.name = 'hola';
                                tasks.login("defaultUser");
                            });
                            tasks.refresh = function (e) {
                                App.log('Changes detected, need to refresh: ' + e);
                                Task.fetch();
                            };
                        } catch (e) {
                            App.log(e);
                        }
                    }
                };
            } ();


            var onDeviceReady = function () {

                App.turnOffjQueryMobileFeatures();
                App.enableHrefNavigation();

                Settings.configure();

                App.registerController("TaskController", "task-list");
                App.registerController("DetailController", "task-details");
                App.registerController("SettingsController", "settings");

                Spine.Route.add("", function () {
                    App.log("Route for /");
                    App.navigate("task-list-page");
                    //setTimeout(function () {
                    //                        Task.fetch();
                    //}, 2000);
                });
                Spine.Route.add("offline", function () {
                    App.navigate("offline-page");
                });
                Spine.Route.add("about", function () {
                    App.navigate("about-page");
                });

                $(document).bind("mobileinit", function () {
                    Spine.Route.setup();
                });

                var isWindowsPhone = navigator.userAgent.indexOf("MSIE") != -1;
                if (isWindowsPhone) { //http://www.scottlogic.co.uk/blog/colin/2012/04/introducing-the-jquery-mobile-metro-theme/
                    $('body').addClass('metro');
                }
                var isAndriod = navigator.userAgent.toLowerCase().indexOf("android") != -1;
                if (isAndriod) {
                    $('body').addClass('android');
                }

                if ($("html").is(".ui-mobile") === false) {
                    location.reload(true); //? sometimes jquery mobile doesn't finish initializing...
                }

                Task.fetch();
            };

            //TaskApplication.setupHub();

            document.addEventListener("deviceready", onDeviceReady, false);            
        });
    });