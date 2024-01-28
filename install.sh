#!/bin/bash
sudo dnf install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
sudo dnf install epel-release -y
sudo dnf install certbot python3-certbot-nginx -y
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
sudo setsebool httpd_can_network_connect 1 -P
curl -sL https://rpm.nodesource.com/setup_20.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo dnf remove nodejs npm -y
sudo dnf install nodejs -y
echo "Install completed"