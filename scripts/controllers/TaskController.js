define("TaskController", ['jquery', 'models/Task', 'hogan', 'spine'],
    function ($, Task) {

        var taskController = Spine.Controller.create({
            elements:{":jqmData(role='content') ul":"list",
                "#task-list-tmpl":"templateElement"},
            events:{"click .task-list-add": "addTask",
                "change :jqmData(role='content') ul input[type='checkbox']":"completedTask",
                "click :jqmData(role='content') ul button[name='delete']":"deleteTask",
                "click :jqmData(role='content') ul button[name='details']": "viewTask",
                "click .todo-settings": "viewSettings",
                "click :jqmData(filter='active')": "filterActive",
                "click :jqmData(filter='complete')": "filterComplete",
                "click :jqmData(filter='all')": "filterAll",
                "pageshow": "navigatedTo"
            },

            taskFilter: function () { return Task.active(); },
            init: function () {
                this.compiledTmpl = Hogan.compile(this.templateElement.html());
                Task.bind('refresh change', this.proxy(this.render));
                this.routes({
                    "task-list": function () {
                        this.el.activate();
                    }
                });
                
            },

            template: function (data) {
                $.each(data, function (i, type) {
                    type.cssStyles = function () {
                        if (type.isComplete) {
                            return "completedTask";
                        }
                        return "";
                    };
                    type.isChecked = function () {
                        if (type.isComplete) {
                            return 'checked="checked"';
                        }
                        return "";
                    };
                });
                return this.compiledTmpl.render({ items: data });
            },

            render: function () {
                this.list.html(this.template(this.taskFilter()));
                this.list.listview("refresh");
                $("button", this.list).button();
                try {
                    $('[type="checkbox"]', this.list).checkboxradio();
                }catch (e) {
                }
            },
            
            navigatedTo: function () {
                
            },

            addTask: function (e) {
                e.preventDefault();
                App.navigate("task-details-page")
                    .trigger({ type: "loadTask", task: { id: "new" } });
            },

            completedTask: function (event) {
                event.stopPropagation();
                var task = Task.find(event.target.value);
                task.isComplete = !task.isComplete;
                setTimeout(function () { task.save(); }, 10);
            },

            deleteTask: function (event) {
                var task = Task.find(event.target.value);
                task.destroy();
            },

            viewTask: function (event) {
                var task = Task.find(event.target.value);
                App.navigate("task-details-page")
                    .trigger({ type: "loadTask", task: task });
            },
            
            filterActive: function (event) {
                event.preventDefault();
                this.taskFilter = function () { return Task.active(); };
                this.render();
            },
            
            filterComplete: function (event) {
                event.preventDefault();
                this.taskFilter = function () { return Task.complete(); };
                this.render();
            },
            
            filterAll: function (event) {
                event.preventDefault();
                this.taskFilter = function () { return Task.all(); };
                this.render();
            },
            
            viewSettings: function (event) {
                event.preventDefault();
                App.navigate("settings-page");
            },

        });

        return taskController;
    });