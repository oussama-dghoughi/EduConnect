<?php

namespace App\Entity;

use App\Repository\TeacherRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TeacherRepository::class)]
#[ORM\Table(name: '"teacher"')]
class Teacher
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\Column(length: 100)]
    private ?string $nom = null;

    #[ORM\Column(length: 100)]
    private ?string $matiere = null;

    #[ORM\Column(length: 200)]
    private ?string $niveauEnseigne = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $prixParHeure = null;

    #[ORM\Column(length: 100)]
    private ?string $ville = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private ?bool $coursEnLigne = false;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $anneesExperience = 0;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $descriptionCourte = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descriptionComplete = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $diplomes = [];

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $photo = null;

    #[ORM\Column(length: 50)]
    private ?string $statut = 'pending'; // pending, approved, rejected

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->statut = 'pending';
        $this->coursEnLigne = false;
        $this->anneesExperience = 0;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getMatiere(): ?string
    {
        return $this->matiere;
    }

    public function setMatiere(string $matiere): static
    {
        $this->matiere = $matiere;

        return $this;
    }

    public function getNiveauEnseigne(): ?string
    {
        return $this->niveauEnseigne;
    }

    public function setNiveauEnseigne(string $niveauEnseigne): static
    {
        $this->niveauEnseigne = $niveauEnseigne;

        return $this;
    }

    public function getPrixParHeure(): ?string
    {
        return $this->prixParHeure;
    }

    public function setPrixParHeure(string $prixParHeure): static
    {
        $this->prixParHeure = $prixParHeure;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(string $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

    public function isCoursEnLigne(): ?bool
    {
        return $this->coursEnLigne;
    }

    public function setCoursEnLigne(bool $coursEnLigne): static
    {
        $this->coursEnLigne = $coursEnLigne;

        return $this;
    }

    public function getAnneesExperience(): ?int
    {
        return $this->anneesExperience;
    }

    public function setAnneesExperience(int $anneesExperience): static
    {
        $this->anneesExperience = $anneesExperience;

        return $this;
    }

    public function getDescriptionCourte(): ?string
    {
        return $this->descriptionCourte;
    }

    public function setDescriptionCourte(string $descriptionCourte): static
    {
        $this->descriptionCourte = $descriptionCourte;

        return $this;
    }

    public function getDescriptionComplete(): ?string
    {
        return $this->descriptionComplete;
    }

    public function setDescriptionComplete(?string $descriptionComplete): static
    {
        $this->descriptionComplete = $descriptionComplete;

        return $this;
    }

    public function getDiplomes(): ?array
    {
        return $this->diplomes;
    }

    public function setDiplomes(?array $diplomes): static
    {
        $this->diplomes = $diplomes;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
