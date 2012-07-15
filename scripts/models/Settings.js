
define("models/Settings", ["jquery", 'spine', 'spine/local', 'spine/ajax'], function ($) {

    var model = Spine.Model.sub();

    model.configure("Setting", "serverUrl");
    //model.extend(Spine.Model.Local);
    model.extend(Spine.Model.Ajax);

    model.extend({
        configure: function () {
            var m = model.first();
            if (m == null) {
                m = new model();
                m.serverUrl = "";
            }
            Spine.Model.host = m.serverUrl + "/api";
            $.connection.hub.url = m.serverUrl + "/signalr";
        } 
    });

    return model;
});