# real time chat app

## instructions

* install dependencies in server folder
* in the server folder copy contents of .env.example to a new file named .env
* serve contents of client1 as a static http server you can use npm package `serve` or python http server package
* get an instance of redis and get uri either online or using docker on installing on your machine put it in .env file
* create 2 node processes at from server/src/server.js running at two different ports
* create two browser windows and connect to static server serving client1 folder
* in one client connect to first node servers websocket uri
* in other client connect to second node servers websocket uri
* send messages which will be relayed between different servers throught redis pub sub 
* refer https://www.youtube.com/watch?v=gzIcGhJC8hA for architecture