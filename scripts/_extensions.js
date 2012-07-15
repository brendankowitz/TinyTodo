(function ($) {
    $.fn.extend({
        current: function () {
            ///<summary>Reruns the selector and returns a current result set</summary>
            return $(this.selector);
        },

        render: function (html) {
            ///<summary>Updates the html of this page and causes JQM to run page creation events</summary>
            var el = $(this);
            el.html(html);
            if (el.is(".ui-page") == false) {
                el.page();
            } else {
                el.trigger('pagecreate');
            }
            return el;
        },

        actionUrl: function () {
            ///<summary>Extracts the action url from a form</summary>
            return this.attr("action");
        },

        activate: function () {
            ///<summary>If the current element is not the active page, forces a navigation to itself</summary>
            var el = $(this);
            if (el.is(".ui-page-active") == false) {
                App.navigate(el.data("url"));
            }
            el.removeAttr("data-page-state");
        },

        clearWhenInactive: function () {
            ///<summary>Clears the child elements if this page is not in active view</summary>
            var el = $(this);
            if (el.is(".ui-page-active") == false && el.attr("data-page-state") != "suspend") {
                el.html("");
            }
        },

        isViewportAtBottom: function () {
            var container = $(this);
            var viewTop = $(window).scrollTop();
            var viewBottom = (viewTop + $(window).height());

            var containerBottom = Math.floor(
                    container.offset().top +
                    container.height()
                    );

            var scrollBuffer = 150;

            if ((containerBottom - scrollBuffer) <= viewBottom) {
                return true;

            } else {
                return false;
            }
        }
    });
} (jQuery));


(function($, $$, require) {
    $$.App = function() {
        var loadCount = 0;
        var navigationQueue = [];
        var isNavigating = 0;
        var supportTransitions = true;
        var pageNode = Hogan.compile('<div id="{{id}}-page" data-url="{{url}}" data-role="page" data-theme="c"></div>');

        $(function() {
            $(document).bind("pagechange", function() {
                isNavigating--;
                if (navigationQueue.length > 0) {
                    var next = navigationQueue.pop();
                    App.navigate(next.url, next.args);
                }
                $("a").removeClass("ui-btn-down-a");
            });
        });

        return {
            turnOffjQueryMobileFeatures: function() {
                ///<summary>Turns of the annoying parts of jquery mobile, basically everything</summary>
                $.mobile.ajaxEnabled = false;
                $.mobile.linkBindingEnabled = false;
                $.mobile.hashListeningEnabled = false;
                $.mobile.pushStateEnabled = false;
                $.mobile.allowCrossDomainPages = true;
                $.support.cors = true;
                    
                if(! (navigator.userAgent.match(/iPhone/i)
                    || navigator.userAgent.match(/iPad/i)
                    || navigator.userAgent.match(/iPod/i) 
                    || navigator.userAgent.match(/Chrome/i)
                    || navigator.userAgent.match(/Android/i)
                   /* || (!navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Safari/i))*/
                )){
                    supportTransitions = false;
                }
            },

            enableHrefNavigation: function() {
                ///<summary>Re-implements Href navigation by navigating to the #url</summary>
                $("body").on("click", "a", function(e) {
                    var el = $(this);
                    var href = el.attr("href");
                    if (!!href && href.indexOf("#") == 0 && href.length > 1) {
                        e.preventDefault();
                        var reverse = false;
                        var direction = el.data("direction");
                        if (!!direction && direction.toLowerCase() == "reverse") {
                            reverse = true;
                        }
                        el.addClass("ui-btn-down-a");
                        App.navigate(href.substring(1), { reverse: reverse });
                    }
                });
            },

            log: function() {
                ///<summary>Logs to the console</summary>
                try {
                    console.log.apply(console, arguments);
                } catch(e) {
                    try {
                        opera.postError.apply(opera, arguments);
                    } catch(e) {  /* browser doesn't support logging */ }
                }
            },

            findPageByUrlOrId: function(url) {
                ///<summary>Finds an element by Id or data-url</summary>
                return $(":jqmData(url=" + url + "), #" + url);
            },

            navigate: function(url) {
                ///<summary>Uses JQM to change the current page</summary>

                var reverse = false;
                var transition = supportTransitions ? "turn" : "none";
                var role = "page";
                var silent = false;
                if (arguments.length == 2) {
                    var options = arguments[1];
                    if (!!options.reverse) {
                        reverse = options.reverse;
                    }
                    if (!!options.transition && supportTransitions) {
                        transition = options.transition;
                    }
                    if (!!options.role) {
                        role = options.role;
                    }
                    if (!!options.silent) {
                        silent = options.silent;
                    }
                }
                var page = App.findPageByUrlOrId(url);
                page.removeAttr("data-page-state");
                if (page.data("role") === "dialog") {
                    transition = "slidedown";
                }
                if (!!$.mobile.activePage) {
                    if (page.attr("id") === $.mobile.activePage.attr("id")) {
                        return page; //no need to change navigation
                    }
                }
                if (isNavigating > 0) {
                    var qurl = url;
                    var qargs = arguments;
                    navigationQueue.push({ url: qurl, args: qargs });
                    return page;
                }
                isNavigating++;
                try {
                    $.mobile.changePage(page, { transition: transition, reverse: reverse, role: role, changeHash: false });
                } catch(e) {
                    App.log(e);
                }
                if (silent == false) {
                    Spine.Route.navigate(page.data("url"));
                }
                $.mobile.activePage = page;
                return page;
            },

            markAsSuspended: function(pageId) {
                ///<summary>Marks a page as being "suspended" in the background, ie when a messagebox is displayed</summary>
                App.findPageByUrlOrId(pageId).attr("data-page-state", "suspend");
            },

            _useLocalCache: function (args, position) {
                try {
                    var arg = args[position];
                    if (arg.localCache === true) {
                        return true;
                    }
                }catch (e) {}
                return false;
            },

            queuePost: function(url, data) {
                ///<summary>Wraps an ajax post and adds it to the ajax queue</summary>
                ///<returns>Returns a Deferred object</returns>
                var urlClosure = url;
                var dataClosure = JSON.stringify(data);
                var queued = jQuery.Deferred();
                var requestDelegate = function() {
                    return $.ajax({
                        url: urlClosure,
                        dataType: 'json',
                        type: "POST",
                        data: dataClosure,
                        accept: 'application/json',
                        contentType: 'application/json'
                    }).success(function(responseData) {
                        queued.resolve(responseData);
                    }).error(function(xhr, statusText) {
                        queued.reject(xhr);
                        if (xhr.status == 401) {
                            Spine.Route.navigate("login", { reverse: true });
                        }
                    });
                };
                Spine.Ajax.queue(requestDelegate); //sends the request
                return queued.promise();
            },

            queueGet: function(url) {
                ///<summary>Wraps an ajax post and adds it to the ajax queue</summary>
                ///<returns>Returns a Deferred object</returns>
                var urlClosure = url;
                var queued = jQuery.Deferred();
                var requestDelegate = function() {
                    return $.ajax({
                        url: urlClosure,
                        dataType: 'json',
                        type: "GET",
                        accept: 'application/json'
                    }).success(function(responseData) { queued.resolve(responseData); })
                        .error(function(xhr, statusText) {
                            queued.reject(xhr);
                            if (xhr.status == 401) {
                                Spine.Route.navigate("login", { reverse: true });
                            }
                        });
                };
                Spine.Ajax.queue(requestDelegate); //sends the request
                return queued.promise();
            },

            showDialog: function(message) {
                ///<summary>Displays a messagebox with the specified message</summary>
                $.mobile.hidePageLoadingMsg();
                //extracted from jquerymobile
                $("<div class='ui-loader-site ui-loader-site ui-overlay-shadow ui-body-message-site ui-corner-all loader-text-site'>" + message + "</div>")
                    .css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
                    .appendTo($.mobile.pageContainer)
                    .delay(1500)
                    .fadeOut(400, function() {
                        $(this).remove();
                    });
            },

            endLoading: function() {
                ///<summary>Decrements the load count, when zero the loading box is hidden</summary>
                loadCount--;
                if (loadCount <= 0) {
                    loadCount = 0;
                    $.mobile.hidePageLoadingMsg();
                }
            },
            beginLoading: function() {
                ///<summary>Increments the load count</summary>
                if (arguments.length === 0 || !(arguments.length === 1 && arguments[0] == false))
                    loadCount++;
                $.mobile.showPageLoadingMsg();
            },
                
            loadController: function(name, element) {
                ///<summary>Loads a controller from RequireJS and passes in the specified element</summary>
                var controllerClass = require(name);
                return new controllerClass({ el: $(element) });
            },

            registerController: function(name, url) {
                ///<summary>Loads a controller from RequireJS as well as creating the DOM element if it doesn't exist</summary>
                var urlId = url;
                if(url.indexOf("/") == 0) {
                    urlId = url.substring(1);
                }
                var pageId = "#" + urlId + "-page";
                var element = $(pageId);
                if (element.length === 0) {
                    var output = pageNode.render({ id: urlId, url: url });
                    element = $(output);
                    $("body").append(element);
                    element.page();
                }
                var controller;
                if (element.data("controller") == null) {
                    var controllerClass = require(name);
                    controller = new controllerClass({ el: $(pageId) });
                    element.data("controller", controller);
                } else {
                    controller = element.data("controller");
                }
                return controller;
            }
        };
    }();
    $$.App.fn = $$.App.prototype;

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            App.beginLoading();
            return true;
        },
        complete: function(req, status) {
            App.endLoading();
            return true;
        },
        error: function(x, e) {
            App.endLoading();
            if (x.status == 0) {
                App.showDialog('You are offline!\n Please Check Your Network.');
                Spine.Route.navigate("offline");
            } else if (x.status == 401) {
                App.showDialog('Please login');
            } else if (x.status == 403) {
                App.showDialog('Unauthorised');
                var message = JSON.parse(x.responseText);
                App.navigate("messagebox", { transition: 'slidedown', silent: true })
                    .trigger({ type: 'invoke', title: message.Message,
                        callingPage: $(".ui-page-active").attr("id"),
                        hideCancel: true,
                        closeOnSuccess: false,
                        callback: function () {
                            App.navigate("menu", { direction: 'reverse' });
                        }
                    });
            } else if (x.status == 404) {
                App.showDialog('An error has occurred'); //'Requested URL not found.');
            } else if (x.status == 409) {
                App.showDialog(x.responseText);
            } else if (x.status == 500) {
                App.showDialog('An error has occurred'); //'Internel Server Error.');
            } else if (e == 'parsererror') {
                App.showDialog('An error has occurred'); //'Error.\nParsing JSON Request failed.');
            } else if (e == 'timeout') {
                App.showDialog('Request Time out.');
            } else {
                App.showDialog('An error has occurred');
            }
        },
        timeout: 20000
    });
    
}(jQuery, window, require));