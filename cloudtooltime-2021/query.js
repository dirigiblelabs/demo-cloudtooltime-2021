var query = require("db/v4/query");
var response = require("http/v4/response");

var sql = "SELECT * FROM CUSTOMERS";
var resultset = query.execute(sql, []);

response.setContentType("application/json");
response.println(JSON.stringify(resultset, null, 2));

response.flush();
response.close();