from livereload import Server

# Initialize the server
server = Server()

# Watch specific files and trigger a reload when they change
server.watch("./index.html")
server.watch("./style.css")
server.watch("./game.js")

# Start serving on port 8000
server.serve(port=8000, host="127.0.0.1")
