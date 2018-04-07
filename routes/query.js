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
            ')' +
        'ORDER BY `GS` DESC;' +
        'SELECT AVG(`A`) as `A` FROM `assists` WHERE `Club`=? AND `POS`=?';

    var pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: 'root',
        password: pass.MYSQL_PW,
        database: pass.MYSQL_DB,
        multipleStatements: true,
        queueLimit: 0
    });

    pool.query(q, [club, pos, club, pos, club, pos], function(err, results, fields) {
        if(err) throw err;

        console.log(results[0][0]);
        console.log(results[1][0]);
        
        res.send({
            'club': club,
            'pos': pos,
            'max_assists': results[0][0].A,
            'player': results[0][0].Player,
            'avg_assists': results[1][0].A
        });
    });
}