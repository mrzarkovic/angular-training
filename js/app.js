/**
 * Created by milos_000 on 25-Feb-16.
 */

(function(){
    var app = angular.module('training', []);

    app.controller('GameController', function(){
        this.players = [
            {
                id: "6b",
                name: "aa",
                totalScore: 0,
            },
            {
                id: "2c",
                name: "bb",
                totalScore: 0,
            },
            {
                id: "6g",
                name: "cc",
                totalScore: 0,
            }
        ];
        this.games = [];
        this.uniqueId = 0;
        this.gameNo = 0;
        this.totalPlayers = 0;
        this.scores = [];

        /**
         * Save the round results
         */
        this.saveRound = function(){
            // Check results for all the players
            var _this = this;
            angular.forEach(this.players, function(player, key) {
                // Set default score value
                if (typeof _this.scores[key] === 'undefined') {
                    _this.scores[key] = {
                        'value': 0
                    };
                }
                var playerScore = _this.scores[key];
                // Normalize score value
                if (playerScore.value == "") playerScore.value = 0;
                playerScore.value = parseInt(playerScore.value);
                // Set score player id
                playerScore.playerId = player.id;
                // Increment player total score
                player.totalScore = player.totalScore + playerScore.value;
            });

            // Add new game to games array
            this.games.push(this.scores);
            // Clear game scores
            this.scores = [];
            // Increment number of games
            this.gameNo++;
            console.log(this.games);
        };

        /**
         * Add new player
         */
        this.addPlayer = function(){
            this.player.id = this.uniqueId++;
            this.player.totalScore = 0;
            this.players.push(this.player);
            this.player = {};
            this.totalPlayers++;
        };

        /**
         * Delete a player
         * @param id
         */
        this.removePlayer = function(id){
            var _this = this;
            angular.forEach(this.players, function(player, key) {
                if (player.id == id) _this.players.splice(key, 1);
            });
            // Remove player scores
            angular.forEach(this.games, function(round, keyG) {
                angular.forEach(round, function(score, keyR) {
                    if (score.playerId == id) {
                        _this.games[keyG].splice(keyR, 1);
                    }
                });
            });
        };
    });
})();