
define("SettingsController", ['jquery', 'models/Task', 'spine', 'hogan', 'text!Views/Settings.htm'],
    function($, Task) {
        var detailController =  Spine.Controller.create({
            elements: { },
            events: {
                "click .back-button": "cancelSettings"},

            init: function(){
                this.render();
                this.routes({
                    "task-details": function () {
                        this.el.activate();
                    }
                });
            },
            
            navigateHome: function() {
                App.navigate("task-list-page", { reverse: true });
            },

            cancelSettings: function (e) {
                e.preventDefault();
                this.navigateHome();
            },
            
            render: function() {
                var view = require("text!Views/Settings.htm");
                this.el.render(view);
                this.refreshElements();
            }

        });

        return detailController;
});
