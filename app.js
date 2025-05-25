const http = require('http');

http.createServer((req,res) => {
    res.write("kulturbullar 2025, see you soon!")
    res.end();
}
    

).listen(3000);

console.log('Server started on port 3000')
