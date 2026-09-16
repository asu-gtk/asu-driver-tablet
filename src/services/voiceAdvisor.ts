// Голосовой ассистент водителя карьерного самосвала
class VoiceAdvisorService {
  private enabled: boolean = true;

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public speak(text: string, priority: 'normal' | 'urgent' = 'normal') {
    if (!this.enabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Останавливаем предыдущую речь при срочном сообщении
    if (priority === 'urgent') {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Пытаемся выбрать русский голос
    const voices = window.speechSynthesis.getVoices();
    const ruVoice = voices.find((v) => v.lang.startsWith('ru'));
    if (ruVoice) {
      utterance.voice = ruVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const voiceAdvisor = new VoiceAdvisorService();
