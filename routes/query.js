const mysql = require('mysql');
const pass = require('./pass');
var Memcached = require('memcached');

var memcached = new Memcached('127.0.0.1:11211', {retries: 10, retry: 10000, poolSize: 50});

exports.get = function(req, res) {
    var club = req.query.club;
    var pos = req.query.pos;

    memcached.get(club+pos, function (err, data) {
        if(data != null) {
            res.send(data);
            return;
        }
        else {
            reachDB(club, pos, res);
        }
    });
}

function reachDB(club, pos, res) {
    var q = 'SELECT *' +
        'FROM `assists`' +
        'WHERE `Club`=? AND `POS`=?' +
            'AND A=(' +
                'SELECT MAX(`A`)' +
                'FROM `assists`' +
                'WHERE `Club`=?' +
                'AND `POS`=?' +
            ')' +
        'ORDER BY `GS` DESC;' +
        'SELECT AVG(`A`) as `A` FROM `assists` WHERE `Club`=? AND `POS`=?';

    var pool = mysql.createPool({
        connectionLimit: 1500,
        host: 'localhost',
        user: 'root',
        password: pass.MYSQL_PW,
        database: pass.MYSQL_DB,
        multipleStatements: true,
        queueLimit: 0
    });

    pool.query(q, [club, pos, club, pos, club, pos], function(err, results, fields) {
        if(err) throw err;

        var player = results[0][0].Player;
        var max_assists = results[0][0].A;
        var avg_assists = results[1][0].A;
        if(player == 'Gonzalo VerÃ³n') {
            player = 'Gonzalo Verón';
        }
        if(player == 'NicolÃ¡s Lodeiro') {
            player = 'Nicolás Lodeiro';
        }
        
        result = {
            'club': club,
            'pos': pos,
            'max_assists': max_assists,
            'player': player,
            'avg_assists': avg_assists
        };

        memcached.add(club+pos, result, 1000, function (err) { 
            if(err) throw err;
        });

        res.charset = 'utf-8';
        res.send(result);
    });
}