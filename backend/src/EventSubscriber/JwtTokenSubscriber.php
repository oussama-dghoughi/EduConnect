<?php

namespace App\EventSubscriber;

use App\Service\JwtService;
use App\Repository\UserRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class JwtTokenSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly JwtService $jwtService,
        private readonly UserRepository $userRepository,
        private readonly TokenStorageInterface $tokenStorage
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 8],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        
        // Ignorer les routes d'authentification
        if (str_starts_with($request->getPathInfo(), '/api/auth')) {
            return;
        }

        // Vérifier si la route nécessite une authentification
        if (!str_starts_with($request->getPathInfo(), '/api/')) {
            return;
        }

        $authHeader = $request->headers->get('Authorization');
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return;
        }

        $token = substr($authHeader, 7);

        try {
            $decoded = $this->jwtService->decodeToken($token);
            $user = $this->userRepository->find($decoded['sub']);

            if ($user) {
                $token = new UsernamePasswordToken(
                    $user,
                    'main',
                    $user->getRoles()
                );
                $this->tokenStorage->setToken($token);
            }
        } catch (\Exception $e) {
            // Token invalide, on ne fait rien
        }
    }
}

