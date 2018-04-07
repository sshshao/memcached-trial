const mysql = require('mysql');
const pass = require('./pass');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: pass.MYSQL_PW,
    database: pass.MYSQL_DB
});

exports.get = function(req, res) {
    var club = req.query.club;
    var pos = req.query.pos;

    var q = 'SELECT *' +
        'FROM `assists`' +
        'WHERE `Club`=? AND `POS`=?' +
            'AND A=(' +
                'SELECT MAX(`A`)' +
                'FROM `assists`' +
                'WHERE `Club`=?' +
                'AND `POS`=?' +
            ');'
        'SELECT AVG(A) FROM assists WHERE Club=? AND POS=?;';
    
    connection.connect();
    connection.query(q, [club, pos, club, pos, club, pos], function(err, results, fields) {
        console.log(results);
        /*
        res.send({
            'club': club,
            'pos': pos,
            'max_assists': results[0].A,
            'player': result[0].Player,

        });
        */
       res.send({'status': 'OK'});
    });
    connection.end();
}