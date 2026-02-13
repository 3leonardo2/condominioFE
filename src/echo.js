import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
Pusher.logToConsole = true;

window.Echo = new Echo({
    broadcaster: 'reverb', // O 'pusher' si 'reverb' falla, ya que usan el mismo protocolo
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    disableStats: true, // Importante para Reverb
    enabledTransports: ['ws', 'wss'],
});
console.log('Echo initialized:', window.Echo);

export default window.Echo;