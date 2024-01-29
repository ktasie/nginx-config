import fs from 'fs';
import { execSync } from 'child_process';

export default function singleDomainBlockConfig(choices) {
  // Replace these values with your actual domain and paths
  const { domain, ssl } = choices;
  const email = 'gxcpoperations@galaxybackbone.com.ng';
  const nginxConfigPath = `/etc/nginx/conf.d/${domain}.conf`;
  //const nginxConfigPath = `./${domain}.conf`;
  let nginxConfig;

  if (ssl === 'N') {
    nginxConfig = `
            server {
                listen 80;
                listen [::]:80;
                server_name ${domain} www.${domain};

                location / {
                    proxy_set_header X-Real-IP  $remote_addr;
                    proxy_set_header X-Forwarded-For $remote_addr;
                    proxy_pass http://${domain};           
                }
                
            }
        `;
  } else if (ssl === 'Y') {
    // Generate your Nginx configuration
    nginxConfig = `
        server {
            listen 80;
            listen [::]:80;
            server_name ${domain} www.${domain};
            return 301 https://${domain};
        }

        server {
            listen 443 ssl; 
            listen [::]:443 ssl;
            server_name ${domain} www.${domain};

            ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
            ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;

            include /etc/letsencrypt/options-ssl-nginx.conf; 
            ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; 


            location / {
                add_header 'Content-Security-Policy' 'upgrade-insecure-requests';
                proxy_set_header X-Real-IP  $remote_addr;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_pass http://${domain};           
            }
          
        }
        `;

    // Run Certbot to obtain SSL certificate
    try {
      execSync(
        `sudo certbot certonly --nginx -d ${domain} -d www.${domain} --non-interactive --agree-tos -m ${email} --test-cert`,
      );
      console.log(`SSL certificate obtained successfully for ${domain}!`);
    } catch (err) {
      console.error(
        `Error obtaining SSL certificate for ${domain}:`,
        err.stdout.toString(),
      );
      return;
    }
  }

  // Write the Nginx configuration to a file
  fs.writeFileSync(nginxConfigPath, nginxConfig);

  // Restart Nginx to apply changes
  try {
    execSync('sudo systemctl restart nginx');
    console.log('Nginx restarted successfully!');
    console.log(`Nginx configuration for ${domain} created successfully!`);
  } catch (err) {
    console.error('Error restarting Nginx:', err.stdout.toString());
  }
}
