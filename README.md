# TWEB - KWizz

Access the app @ [kwizz.ltouroumov.ch](http://kwizz.ltouroumov.ch/)

## Authors
Laureline David & Yves Athanasiadès

## Introduction
This projet allow someone (eg. a teacher) to create online surveys. Those surveys are seperated into rooms. Each room contains only one survey with one or more questions. This application allows the creator to live view datas inside the room (questions answered, correct answers, etc.). When a room is closed the results are pushed towards the users (eg. students).

## Next Steps
Firstly, we would implement other types of questions. Currently only multiple choice questions can be used. In the future the application should allow to create open questions.

## Technologies / frameworks
  * Angular2
  * Bootstrap
  * Silex
  * Twig
  * PHP
  * .Net Core MVC
  * .NET Core Entity framework
  * Vanilla WebSockets
  * Webpack
  * Docker
  * Node
  * ChartJS

## Navigation
![image](nav_chart.png)

## Run Instructions
Be sure to have a functional docker(v1.12.x) installation

Then execute the commands below in a chosen directory

```
git clone https://github.com/ltouroumov/tweb-kwizz.git

docker-compose up
```

You should be able to access the landing page at `http://localhost:8080` (or `http://<your-docker-host-ip>:8080`)

## Deployment Instructions

Use your [favourite](http://k8s.io) [container](http://dcos.io) [orchestrator](http://rancher.com)
