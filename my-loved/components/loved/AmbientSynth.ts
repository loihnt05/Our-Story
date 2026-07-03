// Web Audio API Synthesizer for ambient music
export class AmbientSynth {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private delayNode: DelayNode | null = null;
  private feedbackGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  public isPlaying = false;
  private sequenceId: any = null;

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Master Gain (Low volume to keep it soft)
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    
    // Low pass filter for warmth
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = "lowpass";
    this.filterNode.frequency.setValueAtTime(500, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1, this.ctx.currentTime);

    // Delay effect for spaceyness
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayNode.delayTime.setValueAtTime(1.0, this.ctx.currentTime);
    
    this.feedbackGain = this.ctx.createGain();
    this.feedbackGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    
    // Connections
    this.filterNode.connect(this.masterGain);
    this.filterNode.connect(this.delayNode);
    this.delayNode.connect(this.feedbackGain);
    this.feedbackGain.connect(this.delayNode);
    this.delayNode.connect(this.masterGain);
    
    this.masterGain.connect(this.ctx.destination);
  }

  private playChord(frequencies: number[], duration = 6.0) {
    if (!this.ctx || this.ctx.state === "suspended") return;
    const now = this.ctx.currentTime;
    
    frequencies.forEach(freq => {
      if (!this.ctx || !this.filterNode) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 12, now);
      
      // Beautiful fade-in / fade-out envelope
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.05, now + 2.0);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      
      osc.connect(oscGain);
      oscGain.connect(this.filterNode);
      
      osc.start(now);
      osc.stop(now + duration);
      
      this.oscillators.push(osc);
      this.gainNodes.push(oscGain);
    });
    
    setTimeout(() => {
      this.oscillators = this.oscillators.filter(o => {
        try { return o.frequency.value !== frequencies[0]; } catch { return false; }
      });
    }, duration * 1000);
  }

  public start() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isPlaying = true;
    
    // Romantic ambient progression:
    // Cmaj9 (C3, E3, G3, B3, D4)
    // Am9 (A2, C3, E3, G3, B3)
    // Fmaj9 (F2, A3, C4, E4, G4)
    // G6/9 (G2, B3, D4, E4, A4)
    const chords = [
      [130.81, 164.81, 196.00, 246.94, 293.66], 
      [110.00, 130.81, 164.81, 196.00, 246.94], 
      [87.31, 220.00, 261.63, 329.63, 392.00],  
      [98.00, 246.94, 293.66, 329.63, 440.00]   
    ];
    
    let index = 0;
    const playNext = () => {
      if (!this.isPlaying) return;
      this.playChord(chords[index], 7.5);
      index = (index + 1) % chords.length;
      this.sequenceId = setTimeout(playNext, 6000); // 6s interval creates warm overlap
    };
    
    playNext();
  }

  public stop() {
    this.isPlaying = false;
    if (this.sequenceId) {
      clearTimeout(this.sequenceId);
    }
    this.oscillators.forEach(o => {
      try { o.stop(); } catch {}
    });
    this.oscillators = [];
    this.gainNodes = [];
  }
}
