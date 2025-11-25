<?php

namespace App\Service;

use App\Entity\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService
{
    public function __construct(
        private readonly string $secret,
        private readonly int $ttl
    ) {
    }

    public function generateToken(User $user): string
    {
        $now = time();

        $payload = [
            'sub' => $user->getId(),
            'email' => $user->getEmail(),
            'fullName' => $user->getFullName(),
            'roles' => $user->getRoles(),
            'iat' => $now,
            'exp' => $now + $this->ttl,
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    /**
     * @return array<string, mixed>
     */
    public function decodeToken(string $token): array
    {
        $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));

        return (array) $decoded;
    }
}

