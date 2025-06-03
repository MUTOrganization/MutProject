/**
 * @param {'message' | 'invite'} type 
 */
export const playNotificationSound = (type = 'message') => {
  let path = '';
  if(type === 'message') path = '/audio/discord-notification.mp3';
  else if(type === 'invite') path = '/audio/steam-notification.mp3';
  const audio = new Audio(path); // path ไปยังไฟล์เสียง
  audio.volume = 0.5;
  audio.play();
};