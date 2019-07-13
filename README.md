# fazan-api
API for a pheaseant game

How to install:
1) Clone fazan-api repo
2) Run 
```
docker-compose up
```
3) Log into fazan-api container
4) Run following command to populate database with words:
```
npm run first-setup
```
5) Check if database was populated with: ```GET http://localhost:9000/v1/word```
6) Check if a word exists: ```GET http://localhost:9000/v1/word/check/:WORD```