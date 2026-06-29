from livereload import Server

# Initialize the server
server = Server()

# Watch specific files and trigger a reload when they change
server.watch("./public/index.html")
server.watch("./public/style.css")
server.watch("./public/game.js")

# Start serving on port 8000
server.serve(port=8000, host="127.0.0.1")
