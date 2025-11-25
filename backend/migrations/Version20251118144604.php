<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251118144604 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE "teacher" (id SERIAL NOT NULL, user_id INT NOT NULL, nom VARCHAR(100) NOT NULL, matiere VARCHAR(100) NOT NULL, niveau_enseigne VARCHAR(200) NOT NULL, prix_par_heure NUMERIC(10, 2) NOT NULL, ville VARCHAR(100) NOT NULL, cours_en_ligne BOOLEAN NOT NULL, annees_experience INT NOT NULL, description_courte TEXT NOT NULL, description_complete TEXT DEFAULT NULL, diplomes JSON DEFAULT NULL, photo VARCHAR(255) DEFAULT NULL, statut VARCHAR(50) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B0F6A6D5A76ED395 ON "teacher" (user_id)');
        $this->addSql('COMMENT ON COLUMN "teacher".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN "teacher".updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE "teacher" ADD CONSTRAINT FK_B0F6A6D5A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "teacher" DROP CONSTRAINT FK_B0F6A6D5A76ED395');
        $this->addSql('DROP TABLE "teacher"');
    }
}
