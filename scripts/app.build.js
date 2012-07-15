({
    baseUrl: ".",
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
        'signalr/taskHub': 'taskHubProxy'
    },
    shim: {
        'jquery/mobile': ['jquery'],
        'spine': ['jquery'],
        'spine/manager': ['spine'],
        'spine/route': ['spine'],
        'spine/local': ['spine'],
        'spine/ajax': ['spine'],
        "jquery/extensions": ["jquery", "hogan"],
        "signalr": ["jquery"],
        "signalr/taskHub": ["signalr"]
    },
    name: "main",
    out: "main-built.js"
})