// ============================================================
//  ☁️ CLOUDINARY CONFIGURATION — Free image hosting
// ============================================================
// 1. Sign up free at https://cloudinary.com
// 2. Get your Cloud Name from the Dashboard
// 3. Go to Settings → Upload → Add Upload Preset (set to "Unsigned")
// 4. Paste your values below

export const CLOUDINARY_CLOUD_NAME = "da77xtn23";         // ✅ your cloud name
export const CLOUDINARY_UPLOAD_PRESET = "AshuFX";         // ✅ your upload preset

/**
 * Upload an image file to Cloudinary (free, unsigned)
 * Returns the secure URL of the uploaded image
 */
export async function uploadToCloudinary(
  file: File,
  folder: string,
  publicId?: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", `ashufx/${folder}`);
  if (publicId) formData.append("public_id", publicId);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress?.(Math.round((e.loaded / e.total) * 90));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        onProgress?.(100);
        resolve(data.secure_url);
      } else {
        reject(new Error("Upload failed: " + xhr.responseText));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

/**
 * Delete an image from Cloudinary
 * NOTE: Deletion from client-side requires a signed request.
 * For simplicity, we just remove the Firestore record.
 * The old image on Cloudinary will be replaced/overwritten on next upload.
 */
export function getCloudinaryPublicId(url: string): string {
  // Extract public_id from Cloudinary URL
  // e.g. https://res.cloudinary.com/cloud/image/upload/v123/ashufx/gaming/thumb1.jpg
  // → ashufx/gaming/thumb1
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : "";
}
