<?php

namespace App\Controller;

use App\Repository\TeacherRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/teachers', name: 'api_teachers_')]
final class TeacherController extends AbstractController
{
    public function __construct(
        private readonly TeacherRepository $teacherRepository,
    ) {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        // Récupérer uniquement les professeurs approuvés
        $criteria = ['statut' => 'approved'];
        
        $matiere = $request->query->get('matiere');
        $ville = $request->query->get('ville');
        $coursEnLigne = $request->query->get('coursEnLigne');
        
        if ($matiere) {
            $criteria['matiere'] = $matiere;
        }
        if ($ville) {
            $criteria['ville'] = $ville;
        }
        if ($coursEnLigne !== null) {
            $criteria['coursEnLigne'] = filter_var($coursEnLigne, FILTER_VALIDATE_BOOLEAN);
        }

        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(50, max(1, (int) $request->query->get('limit', 20)));

        $teachers = $this->teacherRepository->findBy(
            $criteria,
            ['createdAt' => 'DESC'],
            $limit,
            ($page - 1) * $limit
        );

        $data = array_map(function ($teacher) {
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
            ];
        }, $teachers);

        return $this->json([
            'data' => $data,
            'total' => $this->teacherRepository->count($criteria),
            'page' => $page,
            'limit' => $limit,
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $teacher = $this->teacherRepository->find($id);
        
        if (!$teacher) {
            return $this->json(['message' => 'Professeur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que le professeur est approuvé
        if ($teacher->getStatut() !== 'approved') {
            return $this->json(['message' => 'Professeur non disponible'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
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
        ]);
    }
}
