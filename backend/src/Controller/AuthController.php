<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Teacher;
use App\Repository\UserRepository;
use App\Service\JwtService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/auth', name: 'api_auth_')]
class AuthController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ValidatorInterface $validator,
        private readonly JwtService $jwtService,
    ) {
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (!is_array($payload)) {
            return $this->json(['message' => 'Invalid JSON payload'], Response::HTTP_BAD_REQUEST);
        }

        $constraints = new Assert\Collection(
            fields: [
                'fullName' => new Assert\NotBlank(message: 'Le nom complet est requis.'),
                'email' => [
                    new Assert\NotBlank(message: 'L\'email est requis.'),
                    new Assert\Email(message: 'Email invalide.'),
                ],
                'password' => [
                    new Assert\NotBlank(message: 'Le mot de passe est requis.'),
                    new Assert\Length(min: 8, minMessage: 'Le mot de passe doit contenir au moins 8 caractères.'),
                ],
                'phone' => new Assert\Optional([
                    new Assert\Length(min: 6, max: 20),
                ]),
            ],
            allowExtraFields: true
        );

        $violations = $this->validator->validate($payload, $constraints);

        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }

            return $this->json(['message' => 'Validation failed', 'errors' => $errors], Response::HTTP_BAD_REQUEST);
        }

        $email = strtolower($payload['email']);
        if ($this->userRepository->findOneBy(['email' => $email])) {
            return $this->json(['message' => 'Un compte utilise déjà cet email.'], Response::HTTP_CONFLICT);
        }

        try {
            $user = new User();
            $user->setEmail($email);
            $user->setFullName($payload['fullName']);
            $user->setPhone($payload['phone'] ?? null);
            $user->setRoles([]); // Initialiser les rôles à un tableau vide
            $hashedPassword = $this->passwordHasher->hashPassword($user, $payload['password']);
            $user->setPassword($hashedPassword);

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $token = $this->jwtService->generateToken($user);

            return $this->json([
                'message' => 'Compte créé avec succès',
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'fullName' => $user->getFullName(),
                    'roles' => $user->getRoles(),
                ],
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            // Logger l'erreur pour le débogage
            error_log('Registration error: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            
            // Retourner un message d'erreur
            $errorData = [
                'message' => 'Erreur lors de la création du compte',
                'error' => $e->getMessage()
            ];
            
            
            if (($_ENV['APP_ENV'] ?? 'prod') === 'dev') {
                $errorData['trace'] = $e->getTraceAsString();
                $errorData['file'] = $e->getFile();
                $errorData['line'] = $e->getLine();
            }
            
            return $this->json($errorData, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (!is_array($payload)) {
            return $this->json(['message' => 'Invalid JSON payload'], Response::HTTP_BAD_REQUEST);
        }

        $constraints = new Assert\Collection(
            fields: [
                'email' => [
                    new Assert\NotBlank(message: 'L\'email est requis.'),
                    new Assert\Email(message: 'Email invalide.'),
                ],
                'password' => new Assert\NotBlank(message: 'Le mot de passe est requis.'),
            ],
            allowExtraFields: true
        );

        $violations = $this->validator->validate($payload, $constraints);

        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }

            return $this->json(['message' => 'Validation failed', 'errors' => $errors], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->userRepository->findOneBy(['email' => strtolower($payload['email'])]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $payload['password'])) {
            return $this->json(['message' => 'Identifiants invalides.'], Response::HTTP_UNAUTHORIZED);
        }

        $token = $this->jwtService->generateToken($user);

        return $this->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'fullName' => $user->getFullName(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }

    #[Route('/register-teacher', name: 'register_teacher', methods: ['POST'])]
    public function registerTeacher(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (!is_array($payload)) {
            return $this->json(['message' => 'Invalid JSON payload'], Response::HTTP_BAD_REQUEST);
        }

        $constraints = new Assert\Collection(
            fields: [
                'fullName' => new Assert\NotBlank(message: 'Le nom complet est requis.'),
                'email' => [
                    new Assert\NotBlank(message: 'L\'email est requis.'),
                    new Assert\Email(message: 'Email invalide.'),
                ],
                'password' => [
                    new Assert\NotBlank(message: 'Le mot de passe est requis.'),
                    new Assert\Length(min: 8, minMessage: 'Le mot de passe doit contenir au moins 8 caractères.'),
                ],
                'phone' => new Assert\Optional([
                    new Assert\Length(min: 6, max: 20),
                ]),
                // Champs du profil professeur
                'nom' => new Assert\NotBlank(message: 'Le nom est requis.'),
                'matiere' => new Assert\NotBlank(message: 'La matière est requise.'),
                'niveauEnseigne' => new Assert\NotBlank(message: 'Le niveau enseigné est requis.'),
                'prixParHeure' => [
                    new Assert\NotBlank(message: 'Le prix par heure est requis.'),
                    new Assert\Type(type: 'numeric', message: 'Le prix doit être un nombre.'),
                ],
                'ville' => new Assert\NotBlank(message: 'La ville est requise.'),
                'coursEnLigne' => new Assert\Optional(new Assert\Type(type: 'bool')),
                'coursADomicile' => new Assert\Optional(new Assert\Type(type: 'bool')),
                'anneesExperience' => new Assert\Optional(new Assert\Type(type: 'int')),
                'disponibilite' => new Assert\Optional(),
                'descriptionCourte' => new Assert\NotBlank(message: 'La description courte est requise.'),
                'descriptionComplete' => new Assert\Optional(),
                'diplomes' => new Assert\Optional(new Assert\Type(type: 'array')),
                'photo' => new Assert\Optional(),
            ],
            allowExtraFields: true
        );

        $violations = $this->validator->validate($payload, $constraints);

        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }

            return $this->json(['message' => 'Validation failed', 'errors' => $errors], Response::HTTP_BAD_REQUEST);
        }

        $email = strtolower($payload['email']);
        if ($this->userRepository->findOneBy(['email' => $email])) {
            return $this->json(['message' => 'Un compte utilise déjà cet email.'], Response::HTTP_CONFLICT);
        }

        try {
            // Créer l'utilisateur
            $user = new User();
            $user->setEmail($email);
            $user->setFullName($payload['fullName']);
            $user->setPhone($payload['phone'] ?? null);
            $user->setRoles(['ROLE_TEACHER', 'ROLE_USER']);
            $hashedPassword = $this->passwordHasher->hashPassword($user, $payload['password']);
            $user->setPassword($hashedPassword);

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // Créer le profil professeur
            $teacher = new Teacher();
            $teacher->setUser($user);
            $teacher->setNom($payload['nom']);
            $teacher->setMatiere($payload['matiere']);
            $teacher->setNiveauEnseigne($payload['niveauEnseigne']);
            $teacher->setPrixParHeure((string) $payload['prixParHeure']);
            $teacher->setVille($payload['ville']);
            $teacher->setCoursEnLigne($payload['coursEnLigne'] ?? false);
            // Note: coursADomicile n'est pas encore dans l'entité, on l'ignore pour l'instant
            $teacher->setAnneesExperience($payload['anneesExperience'] ?? 0);
            $teacher->setDescriptionCourte($payload['descriptionCourte']);
            $teacher->setDescriptionComplete($payload['descriptionComplete'] ?? null);
            $teacher->setDiplomes($payload['diplomes'] ?? []);
            $teacher->setPhoto($payload['photo'] ?? null);
            $teacher->setStatut('pending');

            $this->entityManager->persist($teacher);
            $this->entityManager->flush();

            $token = $this->jwtService->generateToken($user);

            return $this->json([
                'message' => 'Compte professeur créé avec succès. En attente de validation.',
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'fullName' => $user->getFullName(),
                    'roles' => $user->getRoles(),
                ],
                'teacher' => [
                    'id' => $teacher->getId(),
                    'statut' => $teacher->getStatut(),
                ],
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            error_log('Teacher registration error: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            
            $errorData = [
                'message' => 'Erreur lors de la création du compte professeur',
                'error' => $e->getMessage()
            ];
            
            if (($_ENV['APP_ENV'] ?? 'prod') === 'dev') {
                $errorData['trace'] = $e->getTraceAsString();
                $errorData['file'] = $e->getFile();
                $errorData['line'] = $e->getLine();
            }
            
            return $this->json($errorData, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

