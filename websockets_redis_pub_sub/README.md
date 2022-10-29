# real time chat app

## instructions

* install dependencies in server and client folder
* in the server folder copy contents of .env.example to a new file named .env
* get an instance of redis and get uri either online or using docker on installing on your machine put it in .env file
* start static server in client folder by running npm start
* create 2 node processes at from server/index running at two different ports
* create two browser windows and connect to static server
* in one client connect to first node server's websocket uri
* in other client connect to second node server's websocket uri
* send messages which will be relayed between different servers throught redis pub sub 
* refer https://www.youtube.com/watch?v=gzIcGhJC8hA for architecture