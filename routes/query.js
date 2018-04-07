const mysql = require('mysql');
const pass = require('./pass');

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
            ');' +
        'SELECT AVG(`A`) as `A` FROM `assists` WHERE `Club`=? AND `POS`=?';

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: pass.MYSQL_PW,
        database: pass.MYSQL_DB,
        multipleStatements: true
    });

    connection.connect();
    connection.query(q, [club, pos, club, pos, club, pos], function(err, results, fields) {
        console.log(results[0][0]);
        console.log(results[0][1]);
        
        res.send({
            'club': club,
            'pos': pos,
            'max_assists': results[0][0].A,
            'player': result[0][0].Player,
            'avg_assists': result[1][0].A
        });
    });
    connection.end();
}