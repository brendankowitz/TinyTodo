(function () {
    if (typeof Spine === "undefined" || Spine === null) {
        Spine = require('spine');
    }
    Spine.Model.Local = {
        extended: function () {
            this.change(this.saveLocal);
            return this.fetch(this.loadLocal);
        },
        saveLocal: function () {
            var result;
            result = JSON.stringify(this);
            //return localStorage[this.className] = result;
            window.localStorage.setItem(this.className, result);
            //$.jStorage.set(this.className, result);
            return result;
        },
        loadLocal: function () {
            var result;
            //result = localStorage[this.className];
            //result = $.jStorage.set(this.className);
            result = window.localStorage.getItem(this.className);
            return this.refresh(result || [], {
                clear: true
            });
        }
    };
    if (typeof module !== "undefined" && module !== null) {
        module.exports = Spine.Model.Local;
    }
}).call(this);
