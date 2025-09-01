export const formatDate = (dateString) => {
  if (!dateString) return 'Tarih Yok';
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
};


export const parseDurationToSeconds = (durationString) => {
  if (!durationString) return 0;
  
  // DÜZELTME: Regex'i ondalıklı saniyeleri de yakalayacak şekilde güncelledik.
  const matches = durationString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
  
  if (!matches) return 0;

  const hours = parseFloat(matches[1] || '0');
  const minutes = parseFloat(matches[2] || '0');
  // parseFloat kullanarak ondalıklı değeri doğru şekilde okuyoruz.
  const seconds = parseFloat(matches[3] || '0'); 
  
  // Sayaçta tam saniyeleri göstermek için Math.floor ile aşağı yuvarlayabiliriz.
  return Math.floor((hours * 3600) + (minutes * 60) + seconds);
};

// 85 gibi bir toplam saniyeyi "01:25" gibi bir string'e çevirir.
export const formatSecondsToTime = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const fH = String(hours).padStart(2, '0');
  const fM = String(minutes).padStart(2, '0');
  const fS = String(seconds).padStart(2, '0');

  if (hours > 0) return `${fH}:${fM}:${fS}`;
  return `${fM}:${fS}`;
};