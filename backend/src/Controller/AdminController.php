<?php

namespace App\Controller;

use App\Entity\Teacher;
use App\Entity\User;
use App\Repository\TeacherRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin', name: 'api_admin_')]
final class AdminController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TeacherRepository $teacherRepository,
        private readonly UserRepository $userRepository,
    ) {
    }

    #[Route('/dashboard', name: 'dashboard', methods: ['GET'])]
    public function dashboard(): JsonResponse
    {
        // Vérifier que l'utilisateur est admin
        if (!in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            return $this->json(['message' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        $stats = [
            'totalUsers' => $this->userRepository->count([]),
            'totalTeachers' => $this->teacherRepository->count([]),
            'pendingTeachers' => $this->teacherRepository->count(['statut' => 'pending']),
            'approvedTeachers' => $this->teacherRepository->count(['statut' => 'approved']),
            'rejectedTeachers' => $this->teacherRepository->count(['statut' => 'rejected']),
        ];

        return $this->json($stats);
    }

    #[Route('/teachers', name: 'teachers_list', methods: ['GET'])]
    public function listTeachers(Request $request): JsonResponse
    {
        if (!in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            return $this->json(['message' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        $statut = $request->query->get('statut');
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(50, max(1, (int) $request->query->get('limit', 20)));

        $criteria = [];
        if ($statut) {
            $criteria['statut'] = $statut;
        }

        $teachers = $this->teacherRepository->findBy(
            $criteria,
            ['createdAt' => 'DESC'],
            $limit,
            ($page - 1) * $limit
        );

        $data = array_map(function (Teacher $teacher) {
            return [
                'id' => $teacher->getId(),
                'nom' => $teacher->getNom(),
                'matiere' => $teacher->getMatiere(),
                'ville' => $teacher->getVille(),
                'statut' => $teacher->getStatut(),
                'user' => [
                    'id' => $teacher->getUser()->getId(),
                    'email' => $teacher->getUser()->getEmail(),
                    'fullName' => $teacher->getUser()->getFullName(),
                ],
                'createdAt' => $teacher->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }, $teachers);

        return $this->json([
            'data' => $data,
            'total' => $this->teacherRepository->count($criteria),
            'page' => $page,
            'limit' => $limit,
        ]);
    }

    #[Route('/teachers/{id}/approve', name: 'teacher_approve', methods: ['PUT'])]
    public function approveTeacher(int $id): JsonResponse
    {
        if (!in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            return $this->json(['message' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        $teacher = $this->teacherRepository->find($id);
        if (!$teacher) {
            return $this->json(['message' => 'Professeur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $teacher->setStatut('approved');
        $teacher->setUpdatedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $this->json(['message' => 'Professeur approuvé avec succès']);
    }

    #[Route('/teachers/{id}/reject', name: 'teacher_reject', methods: ['PUT'])]
    public function rejectTeacher(int $id): JsonResponse
    {
        if (!in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            return $this->json(['message' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        $teacher = $this->teacherRepository->find($id);
        if (!$teacher) {
            return $this->json(['message' => 'Professeur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $teacher->setStatut('rejected');
        $teacher->setUpdatedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $this->json(['message' => 'Professeur rejeté']);
    }

    #[Route('/teachers/{id}', name: 'teacher_delete', methods: ['DELETE'])]
    public function deleteTeacher(int $id): JsonResponse
    {
        if (!in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            return $this->json(['message' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        $teacher = $this->teacherRepository->find($id);
        if (!$teacher) {
            return $this->json(['message' => 'Professeur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($teacher);
        $this->entityManager->flush();

        return $this->json(['message' => 'Professeur supprimé avec succès']);
    }

    #[Route('/users', name: 'users_list', methods: ['GET'])]
    public function listUsers(Request $request): JsonResponse
    {
        if (!in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            return $this->json(['message' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(50, max(1, (int) $request->query->get('limit', 20)));

        $users = $this->userRepository->findBy(
            [],
            ['createdAt' => 'DESC'],
            $limit,
            ($page - 1) * $limit
        );

        $data = array_map(function (User $user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'fullName' => $user->getFullName(),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }, $users);

        return $this->json([
            'data' => $data,
            'total' => $this->userRepository->count([]),
            'page' => $page,
            'limit' => $limit,
        ]);
    }
}
