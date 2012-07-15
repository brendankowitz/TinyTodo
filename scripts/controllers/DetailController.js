
define("DetailController", ['jquery', 'models/Task', 'spine', 'hogan', 'text!Views/TaskDetails.htm'],
    function ($, Task) {
        var detailController = Spine.Controller.create({
            elements: { "#task-title": "taskTitle" },
            events: { "click .task-save": "saveTask",
                "click .task-cancel": "cancelTask",
                "loadTask": "loadTask"
            },

            init: function () {
                this.render();
                this.routes({
                    "task-details": function () {
                        this.el.activate();
                    }
                });
                this.render();
            },

            navigateHome: function () {
                App.navigate("task-list-page", { reverse: true });
            },

            loadTask: function (e) {
                App.log("details for: /task/", e.task.id);
                if (e.task.id === "new") {
                    this.item = new Task();
                }
                else {
                    this.item = e.task;
                }
                $(this.taskTitle).val(this.item.title);
            },

            saveTask: function () {
                this.item.title = $(this.taskTitle).val();
                var type = this.item;
                setTimeout(function () {
                    type.save();
                }, 10);
                this.navigateHome();
                return this.item;
            },

            cancelTask: function (e) {
                e.preventDefault();
                this.navigateHome();
            },

            render: function () {
                var view = require("text!Views/TaskDetails.htm");
                this.el.render(view);
                this.refreshElements();
            }

        });

        return detailController;

    });
