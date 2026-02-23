<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'tags',
        'file_path',
        'preview_path',
        'duration_ms',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'duration_ms' => 'integer',
        ];
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'asset_user', 'asset_id', 'user_id')
            ->withPivot('added_at');
    }

    public function isSprite(): bool
    {
        return $this->type === 'sprite';
    }

    public function isSound(): bool
    {
        return $this->type === 'sound';
    }
}
