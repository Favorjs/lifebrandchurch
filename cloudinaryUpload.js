const CLOUD = () => import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = () => import.meta.env.VITE_CLOUDINARY_PRESET;

export async function uploadFile(file, folder = "life-brand-church", onProgress) {
  if (!CLOUD() || !PRESET()) {
    throw new Error("Cloudinary not configured — check your .env file.");
  }

  const isVideo = file.type.startsWith("video/");
  const isAudio = file.type.startsWith("audio/");
  const resourceType = isVideo || isAudio ? "video" : "image";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", PRESET());
  formData.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD()}/${resourceType}/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status === 200) resolve(data);
      else reject(new Error(data.error?.message || "Upload failed"));
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

export function cloudinaryImg(url, { w = 800, q = "auto" } = {}) {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${w},q_${q},f_auto/`);
}
