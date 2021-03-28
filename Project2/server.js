const http = require('http');
//const queryString = require(queryString);
const port = 3000;
const fs = require('fs');


function getStudents(id = null) {
    //v1
    // const path = require("path");
    // const fullPath = path.join(__dirname, "students.json");

    // if(id == null)
    //     return JSON.stringify(require(fullPath));
    // else {
    //     let students = JSON.stringify(require(fullPath).find(x => x.id == id));
    //     if(students)
    //     return JSON.parse(students);
    // }

    //v2
    try {
        const jsonString = fs.readFileSync('./students.json');
        const students = JSON.parse(jsonString);
        if(id == null)
        return JSON.stringify(students);
        else
        return JSON.parse(JSON.stringify(students.find(x => x.id == id)));
      } 
    catch(err) {
        console.log(err);
        return;
      }
}

function getAllStudentsExceptOne(id) {
    try {
        const jsonString = fs.readFileSync('./students.json');
        const students = JSON.parse(jsonString);
        return JSON.stringify(students.filter(x => x.id != id));
      } 
    catch(err) {
        console.log(err);
        return;
      }
}

function deleteStudent(id) {
    let jsonString = getAllStudentsExceptOne(id);

    fs.writeFile('./students.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

const requestHandler = (request, response) => {
    switch(request.method) {
        case 'GET':
            getHandler(request, response)
            break;
        case 'POST':
            postHandler(request, response)
            break;
        case 'PUT':
            putHandler(request, response)
            break;
        case 'DELETE':
            deleteHandler(request, response)
            break;

    }
}

function getHandler(request, response) {
    if(request.url === "/students") {
        response.setHeader('Content-Type','application/json');
        let students = getStudents(); 
        response.end(students);
    }
    else if(request.url.split('/')[1] === 'students' && request.url.split('/')[2]) {
        let student = getStudents(request.url.split('/')[2]);
        if(student) {
            response.setHeader('Content-Type','application/json');
            response.end(JSON.stringify(student));
        }
        else {
            response.statusCode = 404;
            response.end('Student not found! :\'(');
        }
    }
        else {
            response.statusCode = 404;
            response.end('Not found! :\'(')
        }
}

function postHandler(request, response) {
// //3
//     if (request.url === "/students") {
//     var body = "";
//     request.on("data", function (chunk) {
//     body += chunk;
//     });

// req.on("end", function(){
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end(body);
// });


// //2
//     if (request.url === "/students") {
//         var requestBody = '';
//         request.on('data', function(data) {
//           requestBody += data;
//           if(requestBody.length > 1e7) {
//             response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
//             response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
//           }
//         });
//         request.on('end', function() {
//           var formData = qs.parse(requestBody);
//           response.writeHead(200, {'Content-Type': 'text/html'});
//           response.write('<!doctype html><html><head><title>response</title></head><body>');
//           response.write('Thanks for the data!<br />User Name: '+formData.UserName);
//           response.write('<br />Repository Name: '+formData.Repository);
//           response.write('<br />Branch: '+formData.Branch);
//           response.end('</body></html>');
//         });


// //1
//     if(request.url === "/students") {
//         response.setHeader('Content-Type','application/json');
//         //response.end(JSON.stringify(students));
//         response.end(getStudents());
//     }
//     else if(request.url.split('/')[1] === 'students' && request.url.split('/')[2]) {
//         const student = getStudents(request.url.split('/')[2]);
//         if(student) {
//             response.setHeader('Content-Type','application/json');
//             response.end(JSON.stringify(student));
//         }
//         else {
//             response.statusCode = 404;
//             response.end('Student not found! :\'(');
//         }
//     }
//         else {
//             response.statusCode = 404;
//             response.end('Not found! :\'(')
//         }
}

function deleteHandler(request, response) {

    if(request.url.split('/')[1] === 'students' && request.url.split('/')[2]) {
        let student = getStudents(request.url.split('/')[2]);
        if(student) {
            deleteStudent(request.url.split('/')[2]);
            response.statusCode = 200;
            response.end("Student deleted succesfully!");
        }
        else {
            response.statusCode = 404;
            response.end('Student not found! :\'(');
        }
    }
    else {
            response.statusCode = 404;
            response.end('Not found! :\'(')
    }
}

const server = http.createServer(requestHandler);
server.listen(port, (err) => {
    if (err) {
      return console.log('Something bad has happened! :\'(', err)
    }
  
    console.log(`Server is listening on ${port} :D`)
  })

