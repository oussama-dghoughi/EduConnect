<?php

namespace App\Controller;

use App\Entity\Teacher;
use App\Repository\TeacherRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/professor', name: 'api_professor_')]
final class ProfessorController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TeacherRepository $teacherRepository,
        private readonly ValidatorInterface $validator,
    ) {
    }

    #[Route('/profile', name: 'profile_get', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $teacher = $this->teacherRepository->findOneBy(['user' => $user]);
        
        if (!$teacher) {
            return $this->json(['message' => 'Profil professeur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeTeacher($teacher));
    }

    #[Route('/profile', name: 'profile_create', methods: ['POST'])]
    public function createProfile(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        // Vérifier si un profil existe déjà
        $existingTeacher = $this->teacherRepository->findOneBy(['user' => $user]);
        if ($existingTeacher) {
            return $this->json(['message' => 'Un profil existe déjà. Utilisez PUT pour modifier.'], Response::HTTP_CONFLICT);
        }

        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return $this->json(['message' => 'Invalid JSON payload'], Response::HTTP_BAD_REQUEST);
        }

        $constraints = new Assert\Collection([
            'nom' => new Assert\NotBlank(),
            'matiere' => new Assert\NotBlank(),
            'niveauEnseigne' => new Assert\NotBlank(),
            'prixParHeure' => [new Assert\NotBlank(), new Assert\Type('numeric')],
            'ville' => new Assert\NotBlank(),
            'coursEnLigne' => new Assert\Optional(new Assert\Type('bool')),
            'anneesExperience' => new Assert\Optional(new Assert\Type('int')),
            'descriptionCourte' => new Assert\NotBlank(),
            'descriptionComplete' => new Assert\Optional(),
            'diplomes' => new Assert\Optional(new Assert\Type('array')),
            'photo' => new Assert\Optional(),
        ]);

        $violations = $this->validator->validate($payload, $constraints);
        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errors], Response::HTTP_BAD_REQUEST);
        }

        $teacher = new Teacher();
        $teacher->setUser($user);
        $teacher->setNom($payload['nom']);
        $teacher->setMatiere($payload['matiere']);
        $teacher->setNiveauEnseigne($payload['niveauEnseigne']);
        $teacher->setPrixParHeure((string) $payload['prixParHeure']);
        $teacher->setVille($payload['ville']);
        $teacher->setCoursEnLigne($payload['coursEnLigne'] ?? false);
        $teacher->setAnneesExperience($payload['anneesExperience'] ?? 0);
        $teacher->setDescriptionCourte($payload['descriptionCourte']);
        $teacher->setDescriptionComplete($payload['descriptionComplete'] ?? null);
        $teacher->setDiplomes($payload['diplomes'] ?? []);
        $teacher->setPhoto($payload['photo'] ?? null);
        $teacher->setStatut('pending');

        $this->entityManager->persist($teacher);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Profil créé avec succès',
            'data' => $this->serializeTeacher($teacher)
        ], Response::HTTP_CREATED);
    }

    #[Route('/profile', name: 'profile_update', methods: ['PUT'])]
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $teacher = $this->teacherRepository->findOneBy(['user' => $user]);
        if (!$teacher) {
            return $this->json(['message' => 'Profil professeur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return $this->json(['message' => 'Invalid JSON payload'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($payload['nom'])) {
            $teacher->setNom($payload['nom']);
        }
        if (isset($payload['matiere'])) {
            $teacher->setMatiere($payload['matiere']);
        }
        if (isset($payload['niveauEnseigne'])) {
            $teacher->setNiveauEnseigne($payload['niveauEnseigne']);
        }
        if (isset($payload['prixParHeure'])) {
            $teacher->setPrixParHeure((string) $payload['prixParHeure']);
        }
        if (isset($payload['ville'])) {
            $teacher->setVille($payload['ville']);
        }
        if (isset($payload['coursEnLigne'])) {
            $teacher->setCoursEnLigne($payload['coursEnLigne']);
        }
        if (isset($payload['anneesExperience'])) {
            $teacher->setAnneesExperience($payload['anneesExperience']);
        }
        if (isset($payload['descriptionCourte'])) {
            $teacher->setDescriptionCourte($payload['descriptionCourte']);
        }
        if (isset($payload['descriptionComplete'])) {
            $teacher->setDescriptionComplete($payload['descriptionComplete']);
        }
        if (isset($payload['diplomes'])) {
            $teacher->setDiplomes($payload['diplomes']);
        }
        if (isset($payload['photo'])) {
            $teacher->setPhoto($payload['photo']);
        }

        $teacher->setUpdatedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Profil mis à jour avec succès',
            'data' => $this->serializeTeacher($teacher)
        ]);
    }

    private function serializeTeacher(Teacher $teacher): array
    {
        return [
            'id' => $teacher->getId(),
            'nom' => $teacher->getNom(),
            'matiere' => $teacher->getMatiere(),
            'niveauEnseigne' => $teacher->getNiveauEnseigne(),
            'prixParHeure' => (float) $teacher->getPrixParHeure(),
            'ville' => $teacher->getVille(),
            'coursEnLigne' => $teacher->isCoursEnLigne(),
            'anneesExperience' => $teacher->getAnneesExperience(),
            'descriptionCourte' => $teacher->getDescriptionCourte(),
            'descriptionComplete' => $teacher->getDescriptionComplete(),
            'diplomes' => $teacher->getDiplomes() ?? [],
            'photo' => $teacher->getPhoto(),
            'statut' => $teacher->getStatut(),
            'createdAt' => $teacher->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $teacher->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}
