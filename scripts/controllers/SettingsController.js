
define("SettingsController", ['jquery', 'models/Task', 'spine', 'hogan', 'text!Views/Settings.htm'],
    function($, Task) {
        var detailController =  Spine.Controller.create({
            elements: { "input[name=serverUrl]": "serverUrl" },
            events: {
                "click .settings-save": "saveSettings",
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

            saveSettings: function () {
                //this.item.title = $(this.serverUrl).val();
                //this.item.save();
                
                this.navigateHome();
                return this.item;
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
