var rs = require("http/v4/rs");
var dao = require("db/v4/dao");
var pdfDocuments = require("documents/v4/pdf");


var customers = dao.create({
    table: "CUSTOMERS",
    properties: [{
        name: "id",
        column: "ID",
        type: "INTEGER",
        id: true
    }, {
        name: "firstName",
        column: "FIRST_NAME",
        type: "VARCHAR",
        required: true
    }, {
        name: "lastName",
        column: "LAST_NAME",
        type: "VARCHAR",
        required: true
    }, {
        name: "age",
        column: "AGE",
        type: "INTEGER",
        required: false
    }]
});

rs.service()
    .resource("")
      .get(function(ctx, request, response) {
          let data = customers.list();
          response.setContentType("application/json");
          response.println(JSON.stringify(data));
       })
      .post(function(ctx, request, response) {
          let entity = request.getJSON();
          let id = customers.insert(entity);
          response.println(`Entity with id = [${id}] created`);
      })
    .resource("{id}")
      .delete(function(ctx, request, response) {
          let id = ctx.pathParameters.id;
          customers.remove(id);
          response.println(`Entity with id = [${id}] removed`);
      })
    .resource("print")
      .get(function(ctx, request, response) {
          var data = {
            title: "Cloud Tool Time 2021",
            description: "Getting Started with Eclipse Dirigible",
            columns: [{
                name: "Id",
                key: "id"
            }, {
                name: "First Name",
                key: "firstName",
            }, {
                name: "Last Name",
                key: "lastName"
            }, {
                name: "Age",
                key: "age"
            }],
            rows: []
        };
        data.rows = customers.list();
        var pdf = pdfDocuments.generateTable(data);

        response.setContentType("application/pdf");
        response.setHeader('Content-Disposition', 'filename="data.pdf"');
        response.write(pdf);
        response.flush();
        response.close();
      })
  .execute();