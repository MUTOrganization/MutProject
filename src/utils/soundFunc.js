export const playNotificationSound = () => {
    const audio = new Audio('/audio/discord-notification.mp3'); // path ไปยังไฟล์เสียง
    audio.play();
  };