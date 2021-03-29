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
            console.log('Error writing file', err);
            return false;
            
        } else {
            console.log('Successfully wrote file');
        }
    })
    return true;
}

function addStudent(student) { 
    let students = JSON.parse(fs.readFileSync('./students.json'));
    students.push(student);
    let jsonString = JSON.stringify(students);

    fs.writeFile('./students.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err);
            return false;
        } else {
            console.log('Successfully wrote file');
        }
    })
    return true;
}

function updateStudent(student) {
    let found = false;
    let students = JSON.parse(fs.readFileSync('./students.json'));
    for (let i = 0; i < students.length; i++) {
        if(students[i].id == student.id) {
            students[i] = student; 
            found = true;
        }
    }
    if(found){
        let jsonString = JSON.stringify(students);
        fs.writeFile('./students.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err);
                return false;
            } else {
                console.log('Successfully wrote file');
            }
        })
        return true;
    }
    else
        return false;
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
            response.statusCode = 405;
            response.end('Method Not Supported!');
        }
}

function deleteHandler(request, response) {
    if(request.url.split('/')[1] === 'students' && request.url.split('/')[2]) {
        let student = getStudents(request.url.split('/')[2]);
        if(student) {
            if(deleteStudent(request.url.split('/')[2])){
                response.statusCode = 200;
                response.end("Student deleted succesfully!");
            }
            else
            response.end("Student could not be deleted!");
        }
        else {
            response.statusCode = 404;
            response.end('Student not found! :\'(');
        }
    }
    else {
        response.statusCode = 405; 
        response.end('Method Not Supported!');
    }
}

function postHandler(request, response) {
    if(request.url.split('/')[1] === 'students' && !request.url.split('/')[2]) {
        if (request.url === "/students") {
        var qs = require('querystring');

        var body = "";
        request.on("data", function (chunk) {
            body += chunk;
            if(body.length > 1e7) {
                response.statusCode = 413;
                response.end('Request Entity Too Large!');
            }
            });
            request.on("end", function() {
            var formData = qs.parse(body);
            var tempJsonObj = {"id": Number(formData.id), "name": formData.name, "points": Number(formData.points)};
            if(addStudent(tempJsonObj)){
                response.statusCode = 201;            
                response.end("Student added succesfully!");
            }
            else
                response.end("Student could not be added!");
            });
        }
        else {
            response.statusCode = 404;
            response.end('Not found! :\'(')
        }
    }
    else {
        response.statusCode = 405; 
        response.end('Method Not Supported!');
    }
}

function putHandler(request, response) {
    if(request.url.split('/')[1] === 'students' && !request.url.split('/')[2]) {
        if (request.url === "/students") {
        var qs = require('querystring');

        var body = "";
        request.on("data", function (chunk) {
            body += chunk;
            if(body.length > 1e7) {
                response.statusCode = 413;
                response.end('Request Entity Too Large!');
            }
            });
            request.on("end", function() {
            var formData = qs.parse(body);
            var tempJsonObj = {"id":  Number(formData.id), "name": formData.name, "points": Number(formData.points)};
            if(updateStudent(tempJsonObj)){
                response.statusCode = 200;            
                response.end("Student updated succesfully!");
            }
            else
                response.end("Student could not be updated!");
            });
        }
        else {
            response.statusCode = 404;
            response.end('Not found! :\'(')
        }
    }
    else {
        response.statusCode = 405; 
        response.end('Method Not Supported!');
    }
}

const server = http.createServer(requestHandler);
server.listen(port, (err) => {
    if (err) {
      return console.log('Something bad has happened! :\'(', err)
    }
  
    console.log(`Server is listening on ${port} :D`)
  })

