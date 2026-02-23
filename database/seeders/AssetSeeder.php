<?php

namespace Database\Seeders;

use App\Models\Asset;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    public function run(): void
    {
        $sprites = [
            ['name' => 'Mario Idle', 'tags' => ['mario', 'character', 'idle'], 'file_path' => '/assets/sprites/s1.png', 'preview_path' => '/assets/sprites/s1.png'],
            ['name' => 'Coin Spin', 'tags' => ['coin', 'item', 'collectible'], 'file_path' => '/assets/sprites/s2.png', 'preview_path' => '/assets/sprites/s2.png'],
            ['name' => 'Brick Block', 'tags' => ['block', 'brick', 'platform'], 'file_path' => '/assets/sprites/s3.png', 'preview_path' => '/assets/sprites/s3.png'],
            ['name' => 'Goomba Walk', 'tags' => ['enemy', 'goomba'], 'file_path' => '/assets/sprites/s4.png', 'preview_path' => '/assets/sprites/s4.png'],
            ['name' => 'Cloud Decoration', 'tags' => ['decoration', 'cloud', 'sky'], 'file_path' => '/assets/sprites/s5.png', 'preview_path' => '/assets/sprites/s5.png'],
            ['name' => 'Power-Up Mushroom', 'tags' => ['power-up', 'mushroom', 'item'], 'file_path' => '/assets/sprites/s6.png', 'preview_path' => '/assets/sprites/s6.png'],
        ];

        foreach ($sprites as $i => $s) {
            Asset::updateOrCreate(
                ['name' => $s['name'], 'type' => 'sprite'],
                [
                    'tags' => $s['tags'],
                    'file_path' => $s['file_path'],
                    'preview_path' => $s['preview_path'] ?? null,
                ]
            );
        }

        $sounds = [
            ['name' => 'Coin Pickup', 'tags' => ['coin', 'sfx', 'collect'], 'file_path' => '/assets/sounds/a1.wav', 'duration_ms' => 400],
            ['name' => 'Jump', 'tags' => ['jump', 'sfx', 'mario'], 'file_path' => '/assets/sounds/a2.wav', 'duration_ms' => 350],
            ['name' => 'Power-Up', 'tags' => ['power-up', 'sfx'], 'file_path' => '/assets/sounds/a3.wav', 'duration_ms' => 800],
            ['name' => 'Stomp', 'tags' => ['stomp', 'enemy', 'sfx'], 'file_path' => '/assets/sounds/a4.wav', 'duration_ms' => 300],
            ['name' => 'Break Block', 'tags' => ['block', 'break', 'sfx'], 'file_path' => '/assets/sounds/a5.wav', 'duration_ms' => 500],
            ['name' => 'Level Complete', 'tags' => ['fanfare', 'complete'], 'file_path' => '/assets/sounds/a6.wav', 'duration_ms' => 3000],
        ];

        foreach ($sounds as $s) {
            Asset::updateOrCreate(
                ['name' => $s['name'], 'type' => 'sound'],
                [
                    'tags' => $s['tags'],
                    'file_path' => $s['file_path'],
                    'duration_ms' => $s['duration_ms'] ?? null,
                ]
            );
        }
    }
}
