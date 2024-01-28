import fs from 'fs';
import { execSync } from 'child_process';

export default function singleDomainBlockConfig(choices) {
    // Replace these values with your actual domain and paths
    const {domain, ssl} = choices;
    const nginxConfigPath = `/etc/nginx/conf.d/${domain}.conf`;
    //const nginxConfigPath = `./${domain}.conf`;
    let nginxConfig;

    if(ssl === 'N'){
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
    } else if(ssl === 'Y'){
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
            server_name ${domain} www.${domain};

            ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
            ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;

            ssl_protocols TLSv1.2 TLSv1.3;
            ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384;
            ssl_conf_command Ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;
            ssl_prefer_server_ciphers off;

            location / {
                add_header 'Content-Security-Policy' 'upgrade-insecure-requests';
                proxy_set_header X-Real-IP  $remote_addr;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_pass http://${domain};           
            }

            # Add additional SSL and server configurations as needed           
        }
        `;

        // Run Certbot to obtain SSL certificate
        try {
            execSync(`sudo certbot certonly --nginx -d ${domain} -d www.${domain} --non-interactive --agree-tos -m gxcpoperations@galaxybackbone.com.ng --test-cert`);
            console.log(`SSL certificate obtained successfully for ${domain}!`);

            
        } catch (err) {
            console.error(`Error obtaining SSL certificate for ${domain}:`, err.stdout.toString());
            return;
        }
    }

    // Write the Nginx configuration to a file
    fs.writeFileSync(nginxConfigPath, nginxConfig);
    
    // Restart Nginx to apply changes
    try {
        execSync('sudo systemctl restart nginx');
        console.log('Nginx restarted successfully!');
        console.log(`SSL-based Nginx configuration for ${domain} created successfully!`);
    } catch (err) {
        console.error('Error restarting Nginx:', err.stdout.toString());
    }
    
    

}
