Project Year-End EPITECH Tek3 : AREA by
Baptiste NOUAILHAC
Alexis DESRUMAUX
Siyam MOHAMED DHOIFFIR
Romain ESTRADA

The AREA project is a business application thats connects services to automate tasks between them.
This application is inspired by the system of the application IFTTT.
There are an application web and mobile.
### Tech

AREA uses a number of open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Javascript] - for script
* [ReactJS] - for aplication web
* [ReactNative] - for application mobile
* [Expo] - for start application mobile
* [CSS] - for esthetism

### Installation

AREA requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies and start.

```sh
$ npm install -d
```

### Docker

The project use Docker and docker-compose, the Docker will expose port 8080, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image.

```sh
docker-compose up
```
This will create the image and pull in the necessary dependencies.

Once done, run the Docker image and map the port to whatever you wish on your host. In this example, we simply map port 8000 of the host to port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -p 49160:8080-d
```


### Services

AREA is currently extended with the following services.

| Service | API |
| ------ | ------ |
| Discord | [https://discord.com/api/v8/users/@me] |
| Google Drive | [https://www.googleapis.com/drive/v3/] |
| Facebook | [https://graph.facebook.com/v9.0/] |
| Gmail | [https://gmail.googleapis.com/gmail/v1/users/me/] |
| Twitch | [https://api.twitch.tv/helix/] |
| Yammer | [https://www.yammer.com/api/v1] |

### Utilisation

To use the AREA you will need to create an account and log in with it via the login page.
Then simply select on the page, the services you want to use.