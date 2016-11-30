# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.box = "boxcutter/ubuntu1604"

    config.hostmanager.enabled = true
    config.hostmanager.manage_host = true
    config.hostmanager.manage_guest = true
    config.hostmanager.ignore_private_ip = false

    config.vm.synced_folder ".", "/vagrant"

    config.vm.network "private_network", ip: "192.168.1.10"
    config.vm.hostname = 'dev.local'
    config.hostmanager.aliases = ['kwizz.local', 'api.kwizz.local']

    config.vm.provision :file, source: "./config", destination: "/tmp/config"
    config.vm.provision :shell, inline: <<-SHELL
        apt-get update
        apt-get install -y nginx php-fpm

        cp /tmp/config/*.conf /etc/nginx/sites-enabled/

        service nginx restart
    SHELL
end
