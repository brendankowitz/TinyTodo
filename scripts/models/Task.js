
define("models/Task", ["jquery", 'spine', 'spine/local', 'spine/ajax'], function ($) {

    var Task = Spine.Model.sub();

    Task.configure("Todo", "id", "title", "description", "due", "assignee", "isComplete", "assignees");
    Task.extend(Spine.Model.Local);
    //Task.extend(Spine.Model.Ajax);

    Task.extend({
        active: function () {
            var records = this.all();
            var matching = [];
            for (var i = 0; i < records.length; i++) {
                var rec = records[i];
                if (!rec.isComplete)
                    matching.push(rec);
            }
            return matching;
        },
        complete: function () {
            var records = this.all();
            var matching = [];
            for (var i = 0; i < records.length; i++) {
                var rec = records[i];
                if (!!rec.isComplete)
                    matching.push(rec);
            }
            return matching;
        }
    });

    return Task;
});