import Tts from 'react-native-tts';

export class TTSHelper {
  private static isInitialized = false;
  private static initPromise: Promise<void> | null = null;

  static async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    if (this.initPromise) {
      return this.initPromise.then(() => true).catch(() => false);
    }

    this.initPromise = this.doInitialize();
    return this.initPromise.then(() => true).catch(() => false);
  }

  private static async doInitialize(): Promise<void> {
    try {
      // Wait a bit for TTS to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await Tts.setDefaultLanguage('en-US');
      await Tts.setDefaultRate(0.5);
      await Tts.setDefaultPitch(1.0);
      
      this.isInitialized = true;
      console.log('TTS Helper: Initialized successfully');
    } catch (error) {
      console.warn('TTS Helper: Initialization failed:', error);
      throw error;
    }
  }

  static async speak(text: string): Promise<void> {
    try {
      const isReady = await this.initialize();
      if (!isReady) {
        console.warn('TTS Helper: TTS not available, cannot speak:', text);
        return;
      }
      
      await Tts.speak(text);
      console.log('TTS Helper: Speaking:', text);
    } catch (error) {
      console.warn('TTS Helper: Failed to speak:', error);
    }
  }

  static async stop(): Promise<void> {
    try {
      await Tts.stop();
    } catch (error) {
      console.warn('TTS Helper: Failed to stop:', error);
    }
  }
}
