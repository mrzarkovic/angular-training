/**
 * Created by Milos on 25-Feb-16.
 */
(function() {
    var app = angular.module('mrau', ['ngCordova']);

    app.controller('MrauController', function($cordovaDialogs){
        var _this = this;

        this.confirmResetTable = function() {
            $cordovaDialogs.confirm('Obriši rezultate?', 'Mrau', ['Da','Ne, ne'])
                .then(function(buttonIndex) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                    var btnIndex = buttonIndex;
                    if (btnIndex == 1) {
                        _this.reset();
                    }
                });
        }
        this.confirmDeletePlayer = function(id) {
            $cordovaDialogs.confirm("Obriši igrača?", "Mrau", ['Da', 'Ne, ne'])
                .then(function(buttonIndex) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                    var btnIndex = buttonIndex;
                    if (btnIndex == 1) {
                        _this.removePlayer(id);
                    }
                });
        }
        this.totalPlayers = 0;
        this.totalGames = 0;
        this.players = [];
        this.games = [];
        this.currentPlayer = 0;
        this.shouldAnnulScore = false;
        this.removePlayer = function(id){
            for (i = 0; i < this.players.length; i++) {
                if (this.players[i].id == id) {
                    //console.log("izbaci:" + this.players[i].name + "\n");
                    this.players.splice(i, 1);
                }
            }
            //console.log(this.players);
            //this.players[id] = {};
            var _this = this;
            angular.forEach(this.games, function(value, key) {
                //_this.games[key][id] = "";
                var gameScores = _this.games[key];
                console.log(gameScores);
                for (i=0; i < gameScores.length; i++) {
                    if (gameScores[i].id == id) {
                        //console.log("izbaci:" + gameScores[i].score + "\n");
                        gameScores.splice(i, 1);
                    }
                }
                //_this.games[key].splice(key, 1);
            });
            //console.log(this.games);
            this.totalPlayers--;
        };
        this.reset = function(){
            this.games = [];
            this.totalGames = 0;
            var _this = this;
            angular.forEach(this.players, function(value, key) {
                if (_this.players[value.id]) {
                    _this.players[value.id].totalScore = 0;
                }
            });
        };
    });

    app.controller('PlayerController', function(){
        this.player = {
            //id: 0,
            //name: "",
            //totalScore: 0,
            //previewScore: 0,
        };
        this.addPlayer = function(mrau){
            this.player.id = mrau.totalPlayers;
            this.player.totalScore = 0;
            this.player.previewScore = 0;
            //mrau.players[this.player.id] = this.player;
            mrau.players.push(this.player);
            mrau.totalPlayers++;
            // Clear form data
            this.player = {};
        };
    });

    app.controller('GameController', function(){
        this.scores = [
            //'id': {
            //  score: 0;
            // }
        ];
        this.inputActive = [];
        this.changeResultPreview = function(mrau, index){
            this.inputActive[index] = true;
            var player = mrau.players[index];
            var score = (this.scores[index].score) ? this.scores[index].score : 0;
            player.previewScore = player.totalScore + score;
            if (mrau.shouldAnnulScore && this.annulScore(player.previewScore)) {
                player.previewScore = 0;
            }
        };
        this.annulScore = function(score) {
            var number = ('' + score);
            if (number.length == 1) return false;
            var firstDigit = number.charAt(0);
            for (i = 0; i < number.length; i++) {
                if (firstDigit != number[i]) return false;
            }
            return true;
        };
        this.saveGame = function(mrau){
            //console.log(this.scores);
            mrau.totalGames++;
            mrau.currentPlayer = mrau.totalGames % mrau.totalPlayers;

            var _this = this;

            // Update players results
            angular.forEach(mrau.players, function(value, key) {
                var player = value;
                if(typeof _this.scores[key] === 'undefined') {
                    _this.scores[key] = {
                        'score': 0,
                    };
                }
                _this.scores[key].id = player.id;
                if (mrau.shouldAnnulScore && _this.annulScore(player.totalScore + _this.scores[key].score)) {
                    player.totalScore = 0;
                } else {
                    player.totalScore += _this.scores[key].score;
                }
                player.previewScore = 0;
                _this.inputActive[key] = false;
            });
            mrau.games.push(_this.scores);
            // Clear form data
            this.scores = [];
        };
    });
})();
