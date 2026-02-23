<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BagController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = $request->user()
            ->bagAssets()
            ->withPivot('added_at')
            ->orderBy('asset_user.added_at', 'desc')
            ->get();

        return response()->json(['data' => $items]);
    }

    public function add(Request $request, int $assetId): JsonResponse
    {
        $asset = Asset::find($assetId);

        if (! $asset) {
            return response()->json(['message' => 'Asset not found'], 404);
        }

        $user = $request->user();
        if ($user->bagAssets()->where('asset_id', $assetId)->exists()) {
            return response()->json(['message' => 'Already in bag', 'data' => $asset], 200);
        }

        $user->bagAssets()->attach($assetId, ['added_at' => now()]);

        return response()->json(['message' => 'Added to bag', 'data' => $asset], 201);
    }

    public function remove(Request $request, int $assetId): JsonResponse
    {
        $request->user()->bagAssets()->detach($assetId);

        return response()->json(['message' => 'Removed from bag']);
    }
}
