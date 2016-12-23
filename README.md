# TWEB - KWizz

Access the app @ [kwizz.synergy-net.ch](http://kwizz.synergy-net.ch/)

## Authors
Laureline David & Yves Athanasiadès

## Technologies / frameworks
  * Angular2
  * Bootstrap
  * Silex
  * Twig
  * PHP
  * .Net MVC
  * Vanilla WebSockets

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
