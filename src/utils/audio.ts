/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SoundType = 'mechanical' | 'soft' | 'typewriter' | 'beep';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.35;
  private type: SoundType = 'mechanical';

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public configure(enabled: boolean, volume: number, type: SoundType) {
    this.isMuted = !enabled;
    this.volume = Math.max(0, Math.min(1, volume));
    this.type = type;
  }

  /**
   * Primary keyclick sound triggered on physical keydown.
   * Real acoustic synthesis with microscopic frequency jitter for organic variation.
   */
  public playKeyClick() {
    if (this.isMuted || this.volume <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const jitter = (Math.random() - 0.5) * 60;

      if (this.type === 'mechanical') {
        // High-end Mechanical Blue Switch: Crisp snap + lower keycap body thud
        const osc = this.ctx.createOscillator();
        const bodyOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const bodyGain = this.ctx.createGain();

        // Snap component (crisp click)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(680 + jitter, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.02);

        gain.gain.setValueAtTime(this.volume * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        // Body clack component
        bodyOsc.type = 'sine';
        bodyOsc.frequency.setValueAtTime(220 + jitter * 0.3, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

        bodyGain.gain.setValueAtTime(this.volume * 0.3, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        bodyOsc.connect(bodyGain);
        gain.connect(this.ctx.destination);
        bodyGain.connect(this.ctx.destination);

        osc.start(now);
        bodyOsc.start(now);
        osc.stop(now + 0.03);
        bodyOsc.stop(now + 0.04);
      } else if (this.type === 'typewriter') {
        // Vintage Typewriter: Metallic strike + resonant spring tail
        const osc = this.ctx.createOscillator();
        const metallic = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450 + jitter, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.03);

        metallic.type = 'sawtooth';
        metallic.frequency.setValueAtTime(1200 + jitter, now);
        metallic.frequency.exponentialRampToValueAtTime(300, now + 0.015);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        metallic.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        metallic.start(now);
        osc.stop(now + 0.05);
        metallic.stop(now + 0.02);
      } else if (this.type === 'soft') {
        // Soft Modern Chiclet / Scissor switch
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260 + jitter * 0.2, now);
        osc.frequency.exponentialRampToValueAtTime(85, now + 0.03);

        gain.gain.setValueAtTime(this.volume * 0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
      } else {
        // High-Tech Digital Beep / Chirp
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880 + jitter * 0.5, now);
        gain.gain.setValueAtTime(this.volume * 0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Pleasant subtle confirmation when a target character is typed correctly.
   */
  public playSuccessClick() {
    this.playKeyClick();
  }

  /**
   * Subtle error thud when an incorrect key is pressed.
   * Low, organic wooden sound rather than harsh or piercing noise.
   */
  public playError() {
    if (this.isMuted || this.volume <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore
    }
  }

  public playErrorBuzz() {
    this.playError();
  }

  /**
   * Short, harmonious fanfare when a level, assessment, or test is completed.
   */
  public playSuccessFanfare() {
    if (this.isMuted || this.volume <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.38, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.35);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
