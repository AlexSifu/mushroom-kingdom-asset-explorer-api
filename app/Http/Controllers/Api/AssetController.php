<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Asset::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($qry) use ($q) {
                $qry->where('name', 'like', "%{$q}%")
                    ->orWhere('tags', 'like', "%{$q}%");
            });
        }

        if ($request->filled('tag')) {
            $query->where('tags', 'like', "%{$request->tag}%");
        }

        $assets = $query->orderBy('created_at', 'desc')->get();

        return response()->json(['data' => $assets]);
    }

    public function show(int $id): JsonResponse
    {
        $asset = Asset::find($id);

        if (! $asset) {
            return response()->json(['message' => 'Asset not found'], 404);
        }

        return response()->json(['data' => $asset]);
    }
}
