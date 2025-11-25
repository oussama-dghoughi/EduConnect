<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Créer un utilisateur administrateur',
)]
class CreateAdminCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email = 'admin@educonnect.fr';
        $password = 'admin123';
        $fullName = 'Administrateur';

        // Vérifier si l'admin existe déjà
        $existingAdmin = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if ($existingAdmin) {
            $io->warning("Un admin existe déjà avec l'email: $email");
            if (!$io->confirm('Voulez-vous le mettre à jour ?', false)) {
                return Command::FAILURE;
            }
            $admin = $existingAdmin;
        } else {
            $admin = new User();
        }

        $admin->setEmail($email);
        $admin->setFullName($fullName);
        $admin->setRoles(['ROLE_ADMIN', 'ROLE_USER']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, $password));

        $this->entityManager->persist($admin);
        $this->entityManager->flush();

        $io->success('Admin créé avec succès!');
        $io->table(
            ['Champ', 'Valeur'],
            [
                ['Email', $email],
                ['Password', $password],
                ['Nom', $fullName],
                ['Rôles', 'ROLE_ADMIN, ROLE_USER'],
            ]
        );

        return Command::SUCCESS;
    }
}
