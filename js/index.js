/**
 * Created by Milos on 25-Feb-16.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('DOMContentLoaded', this.onDomLoaded, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        $('#navbar').on('show.bs.collapse', function () {
            window.scrollTo(0, 0);
            $('.navbar').removeClass("navbar-fixed-top");
            $('.content').removeClass("navbar-padding-top");
        });
        $('#navbar').on('hidden.bs.collapse', function () {
            $('.navbar').addClass("navbar-fixed-top");
            $('.content').addClass("navbar-padding-top");
        });
        var domElement = document.getElementById("app");
        angular.bootstrap(domElement, ['mrau']);
        //app.receivedEvent('deviceready');
    },
    onDomLoaded: function() {
        console.log("web");
        $('#navbar').on('show.bs.collapse', function () {
            window.scrollTo(0, 0);
            $('.navbar').removeClass("navbar-fixed-top");
            $('.navbar').addClass("navbar-static-top");
            $('.content').removeClass("navbar-padding-top");
        });
        $('#navbar').on('hidden.bs.collapse', function () {
            $('.navbar').removeClass("navbar-static-top");
            $('.navbar').addClass("navbar-fixed-top");
            $('.content').addClass("navbar-padding-top");
        });
        var domElement = document.getElementById("app");
        angular.bootstrap(domElement, ['mrau']);
        //app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //FastClick.attach(document.body);
        console.log('Received Event: ' + id);
    }
};

app.initialize();