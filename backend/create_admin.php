<?php

require __DIR__.'/vendor/autoload.php';

use App\Kernel;
use App\Entity\User;

$_SERVER['APP_ENV'] = $_ENV['APP_ENV'] ?? 'dev';
$_SERVER['APP_DEBUG'] = (bool) ($_ENV['APP_DEBUG'] ?? true);

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();

$container = $kernel->getContainer();
$em = $container->get('doctrine')->getManager();
$hasher = $container->get('security.password_hasher');

// Vérifier si l'admin existe déjà
$existingAdmin = $em->getRepository(User::class)->findOneBy(['email' => 'admin@educonnect.fr']);

if ($existingAdmin) {
    echo "⚠️  Un admin existe déjà avec cet email.\n";
    echo "Voulez-vous le mettre à jour ? (y/n): ";
    $handle = fopen("php://stdin", "r");
    $line = fgets($handle);
    if (trim($line) !== 'y') {
        echo "❌ Annulé.\n";
        exit;
    }
    $admin = $existingAdmin;
} else {
    $admin = new User();
}

$admin->setEmail('admin@educonnect.fr');
$admin->setFullName('Administrateur');
$admin->setRoles(['ROLE_ADMIN', 'ROLE_USER']);
$admin->setPassword($hasher->hashPassword($admin, 'admin123'));

$em->persist($admin);
$em->flush();

echo "✅ Admin créé avec succès!\n";
echo "📧 Email: admin@educonnect.fr\n";
echo "🔑 Password: admin123\n";
echo "\n🚀 Vous pouvez maintenant vous connecter sur http://localhost:4200/connexion\n";
