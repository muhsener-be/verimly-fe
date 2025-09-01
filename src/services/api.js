import axios from "axios";

const apiClient = axios.create({

    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true
});

export const createUser = (userData) => {
    console.log("Base URL: ", process.env.REACT_APP_API_BASE_URL)
    return apiClient.post("/api/v1/users", userData);
}

export const loginUser = (credentials) => {
    // 1. Backend form-data beklediği için bir FormData nesnesi oluşturuyoruz.
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);


    // 2. İsteği, doğru Content-Type başlığı ile gönderiyoruz.
    // Tarayıcılar FormData gönderirken bu başlığı otomatik olarak
    // 'multipart/form-data' olarak ayarlar, bu yüzden genellikle
    // manuel eklememize gerek kalmaz, axios bunu halleder.
    return apiClient.post('/api/v1/auth/login', formData);
};


export const getMe = () => {
    return apiClient.get('/api/v1/me/profile');
}

// YENİ FONKSİYON
export const logoutUser = () => {
  // Backend'de /logout endpoint'i varsa ona istek atıyoruz.
  // Bu, sunucudaki session'ı ve cookie'yi geçersiz kılar.
  return apiClient.post('/api/v1/auth/logout'); 
};


// Tüm klasörleri listeler
export const listFolders = () => {
  return apiClient.get('/api/v1/folders');
};

// Yeni bir klasör oluşturur
export const createFolder = (folderData) => {
  // folderData objesi: { name, description, label_color_hex }
  return apiClient.post('/api/v1/folders', folderData);
};


export const listTasksByFolder = (folderId) => {
  // Tarayıcının yerel saat dilimini alıyoruz (örn: "Europe/Istanbul")
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return apiClient.get(`/api/v1/tasks`, {
    params: {
      folderId: folderId,
    },
    headers: {
      // API'nin beklediği saat dilimi başlığını ekliyoruz
      'X-TimeZone': timeZone,
    },
  });
};



// Yeni bir görev oluşturur
export const createTask = (taskData) => {
  // taskData objesi: { name, description, folder_id, priority, due_date }
  return apiClient.post('/api/v1/tasks', taskData);
};




// ID'si verilen bir görevin tüm detaylarını ve seanslarını getirir
export const getTaskDetails = (taskId) => {
  return apiClient.get(`/api/v1/tasks/${taskId}`);
};



// ... diğer fonksiyonların altına ...

// --- SESSION API ---

// Belirli bir görev için yeni bir seans başlatır
export const apiStartSession = (sessionData) => {
  // sessionData objesi: { name, task_id }
  return apiClient.post('/api/v1/sessions', sessionData);
};


export const apiChangeSessionStatus = (sessionId, action) => {
  return apiClient.post(`/api/v1/sessions/${sessionId}/status`, { action });
};