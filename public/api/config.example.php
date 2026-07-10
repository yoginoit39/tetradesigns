<?php
// Copy this file to config.php and fill in real values.
// config.php is gitignored — never commit real SMTP credentials.

return [
    'smtp_host' => 'mail.yourdomain.com',   // cPanel: usually mail.yourdomain.com or localhost
    'smtp_port' => 465,                     // 465 = SSL, 587 = TLS
    'smtp_secure' => 'ssl',                 // 'ssl' or 'tls'
    'smtp_username' => 'noreply@yourdomain.com', // real mailbox created in cPanel Email Accounts
    'smtp_password' => 'REPLACE_WITH_MAILBOX_PASSWORD',
    'from_email' => 'noreply@yourdomain.com',
    'from_name' => 'Website Contact Form',
    'to_email' => 'info@yourdomain.com',    // where enquiries land
];
