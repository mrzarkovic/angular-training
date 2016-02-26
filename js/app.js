/**
 * Created by milos_000 on 25-Feb-16.
 */

angular.module('mrau', ['ngCordova'])
    .controller('GameController', ['$scope', '$cordovaDialogs', function($scope, $cordovaDialogs){
        $scope.games = [];
        $scope.players = [];
        $scope.uniqueId = 0;
        $scope.totalGames = 0;
        $scope.totalPlayers = 0;
        $scope.currentPlayer = 0;
        $scope.shouldAnnulScore = false;
        $scope.scores = [];
        var _this = $scope;

        /**
         * Reset table dialog
         */
        $scope.confirmResetTable = function() {
            $cordovaDialogs.confirm('Obriši rezultate?', 'Mrau', ['Da','Ne, ne'])
                .then(function(buttonIndex) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                    if (buttonIndex == 1) {
                        _this.resetScore();
                    }
                });
        };

        /**
         * Delete player dialog
         * @param id
         */
        $scope.confirmDeletePlayer = function(id) {
            $cordovaDialogs.confirm("Obriši igrača?", "Mrau", ['Da', 'Ne, ne'])
                .then(function(buttonIndex) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                    if (buttonIndex == 1) {
                        _this.removePlayer(id);
                    }
                });
        };

        /**
         * Reset the score
         */
        $scope.resetScore = function(){
            this.games = [];
            this.totalGames = 0;
            var _this = $scope;
            angular.forEach(this.players, function(value, key) {
                if (_this.players[value.id]) {
                    _this.players[value.id].totalScore = 0;
                }
            });
        };

        $scope.inputActive = [];
        /**
         * Update the result preview
         * @param index Result order
         */
        $scope.changeResultPreview = function(index){
            /**
             * Function disabled for now
             */
            //return true;
            $scope.inputActive[index] = true;
            var player = $scope.players[index];
            var score = ($scope.scores[index].value) ? $scope.scores[index].value : 0;
            score = parseInt(score);
            player.previewScore = player.totalScore + score;
            if ($scope.shouldAnnulScore && $scope.annulScore(player.previewScore)) {
                player.previewScore = 0;
            }
        };

        /**
         * Save the round results
         */
        $scope.saveRound = function(){
            // Check results for all the players
            var _this = $scope;
            angular.forEach($scope.players, function(player, key) {
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
                if (_this.shouldAnnulScore && _this.annulScore(player.totalScore)) {
                    player.totalScore = 0;
                }
                player.previewScore = 0;
                _this.inputActive[key] = false;
            });

            // Add new game to games array
            $scope.games.push($scope.scores);
            // Clear game scores
            $scope.scores = [];
            // Increment number of games
            $scope.totalGames++;
            $scope.currentPlayer = $scope.totalGames % $scope.totalPlayers;
            //console.log($scope.games);
        };

        /**
         * Check if all digits are the same
         * @param score Number
         * @returns {boolean}
         */
        $scope.annulScore = function(score) {
            var number = ('' + score);
            if (number.length == 1) return false;
            var firstDigit = number.charAt(0);
            for (i = 0; i < number.length; i++) {
                if (firstDigit != number[i]) return false;
            }
            return true;
        };

        /**
         * Add new player
         */
        $scope.addPlayer = function(){
            $scope.player.id = $scope.uniqueId++;
            $scope.player.totalScore = 0;
            $scope.player.previewScore = 0;
            $scope.players.push($scope.player);
            $scope.player = {};
            $scope.totalPlayers++;
        };

        /**
         * Delete a player
         * @param id
         */
        $scope.removePlayer = function(id){
            var _this = $scope;
            angular.forEach($scope.players, function(player, key) {
                if (player.id == id) _this.players.splice(key, 1);
            });
            // Remove player scores
            angular.forEach($scope.games, function(round, keyG) {
                angular.forEach(round, function(score, keyR) {
                    if (score.playerId == id) {
                        _this.games[keyG].splice(keyR, 1);
                    }
                });
            });
            $scope.totalPlayers--;
            $scope.currentPlayer = $scope.totalGames % $scope.totalPlayers;
        };
    }]);