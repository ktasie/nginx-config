import fs from 'fs';

export default function deleteBlockAndCert(domain){
    const nginxConfig = `/etc/nginx/conf.d/${domain}.conf`;
    const letsencryptArchive = `/etc/letsencrypt/archive/${domain}`; // Folder;
    const letsencryptLive = `/etc/letsencrypt/live/${domain}`; // Folder
    const letsencryptRenewal = `/etc/letsencrypt/renewal/${domain}.conf`


    fs.unlink(nginxConfig, (err)=>{
        if(err){
            console.log(`Error deleting nginx config(${domain}.conf) `, err)
        } else {
            console.log('Nginx configuration file deleted successfully!')
        }
    });

    fs.unlink(letsencryptRenewal, (err)=>{
        if(err){
            console.log(`Error deleting Letsencypt renewal config(${domain}.conf) `, err)
        } else {
            console.log('Lets encrypt renewal configuration file deleted successfully!')
        }
    });

    console.log('Deletion completed.')


}