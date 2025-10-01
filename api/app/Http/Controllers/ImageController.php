<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    /**
     * Upload single image
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'folder' => 'nullable|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
                'status_code' => 422
            ], 422);
        }

        try {
            $image = $request->file('image');
            $folder = $request->input('folder', 'images');
            
            // Generate unique filename
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            
            // Store image in public disk
            $path = $image->storeAs($folder, $filename, 'public');
            
            // Generate URL
            $url = Storage::disk('public')->url($path);
            
            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'filename' => $filename,
                    'original_name' => $image->getClientOriginalName(),
                    'path' => $path,
                    'url' => $url,
                    'full_url' => url($url),
                    'size' => $image->getSize(),
                    'mime_type' => $image->getMimeType()
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed',
                'error' => $e->getMessage(),
                'status_code' => 500
            ], 500);
        }
    }

    /**
     * Upload multiple images
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadMultiple(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'folder' => 'nullable|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
                'status_code' => 422
            ], 422);
        }

        try {
            $uploadedImages = [];
            $folder = $request->input('folder', 'images');

            foreach ($request->file('images') as $image) {
                // Generate unique filename
                $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                
                // Store image in public disk
                $path = $image->storeAs($folder, $filename, 'public');
                
                // Generate URL
                $url = Storage::disk('public')->url($path);
                
                $uploadedImages[] = [
                    'filename' => $filename,
                    'original_name' => $image->getClientOriginalName(),
                    'path' => $path,
                    'url' => $url,
                    'full_url' => url($url),
                    'size' => $image->getSize(),
                    'mime_type' => $image->getMimeType()
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Images uploaded successfully',
                'data' => $uploadedImages,
                'count' => count($uploadedImages)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed',
                'error' => $e->getMessage(),
                'status_code' => 500
            ], 500);
        }
    }

    /**
     * Delete image
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
                'status_code' => 422
            ], 422);
        }

        try {
            $path = $request->input('path');
            
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Image not found',
                    'status_code' => 404
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed',
                'error' => $e->getMessage(),
                'status_code' => 500
            ], 500);
        }
    }

    /**
     * List images in a folder
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function list(Request $request)
    {
        try {
            $folder = $request->input('folder', 'images');
            $files = Storage::disk('public')->files($folder);
            
            $images = [];
            foreach ($files as $file) {
                $url = Storage::disk('public')->url($file);
                $images[] = [
                    'path' => $file,
                    'filename' => basename($file),
                    'url' => $url,
                    'full_url' => url($url),
                    'size' => Storage::disk('public')->size($file),
                    'last_modified' => Storage::disk('public')->lastModified($file)
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Images retrieved successfully',
                'data' => $images,
                'count' => count($images),
                'folder' => $folder
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve images',
                'error' => $e->getMessage(),
                'status_code' => 500
            ], 500);
        }
    }
}
