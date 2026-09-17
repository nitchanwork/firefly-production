type InstagramWindow = Window & { instgrm?: { Embeds: { process: () => void } } };
let scriptPromise: Promise<void> | undefined;
let processingTimer: ReturnType<typeof setTimeout> | undefined;

function loadInstagram(): Promise<void> {
  if ((window as InstagramWindow).instgrm) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.instagram.com/embed.js"]');
    const script = existing ?? document.createElement('script');
    const timeout = setTimeout(() => reject(new Error('Embed script unavailable')), 20_000);
    script.addEventListener('load', () => { clearTimeout(timeout); resolve(); }, { once: true });
    script.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('Embed script unavailable')); }, { once: true });
    if (!existing) {
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.head.append(script);
    }
  });
  return scriptPromise;
}

function processEmbeds() {
  clearTimeout(processingTimer);
  processingTimer = setTimeout(() => (window as InstagramWindow).instgrm?.Embeds.process(), 50);
}

export class FireflyInstagram extends HTMLElement {
  private mounted = false;
  private visibility?: IntersectionObserver;
  private size?: ResizeObserver;
  private mutations?: MutationObserver;
  private timeout?: ReturnType<typeof setTimeout>;
  private frame?: HTMLIFrameElement;
  private completed = false;
  private completionCallbacks: Array<() => void> = [];

  get settled() { return this.completed; }
  get loading() { return this.mounted && !this.completed; }

  preload(): Promise<void> {
    if (this.completed) return Promise.resolve();
    const completion = new Promise<void>(resolve => this.completionCallbacks.push(resolve));
    void this.mount();
    return completion;
  }

  private complete() {
    if (this.completed) return;
    this.completed = true;
    this.completionCallbacks.splice(0).forEach(resolve => resolve());
    this.dispatchEvent(new Event('portfolio:embed-settled', { bubbles: true }));
  }

  connectedCallback() {
    this.visibility = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !this.closest('[hidden], [data-preloading]')) void this.mount();
    }, { rootMargin: '250px 0px' });
    this.visibility.observe(this);
    this.size = new ResizeObserver(() => this.fit());
    this.size.observe(this);
    document.addEventListener('portfolio:filter', this.filterChanged);
    if (this.dataset.valid !== 'true') this.fail();
  }

  disconnectedCallback() {
    this.visibility?.disconnect();
    this.size?.disconnect();
    this.mutations?.disconnect();
    clearTimeout(this.timeout);
    document.removeEventListener('portfolio:filter', this.filterChanged);
    this.complete();
  }

  private filterChanged = () => {
    if (this.closest('[hidden]')) {
      // Removing a hidden iframe also stops its audio; no cross-origin access.
      this.reset();
    }
    // Re-observing lets newly visible brands/types mount at their new position.
    this.visibility?.unobserve(this);
    this.visibility?.observe(this);
  };

  private reset() {
    clearTimeout(this.timeout);
    this.mutations?.disconnect();
    if (this.frame) this.size?.unobserve(this.frame);
    this.frame = undefined;
    this.querySelector('[data-embed-canvas]')?.replaceChildren();
    this.mounted = false;
    this.completionCallbacks.splice(0).forEach(resolve => resolve());
    this.completed = false;
    delete this.dataset.ready;
    this.style.removeProperty('--embed-height');
    this.querySelector<HTMLElement>('[data-embed-loading]')!.hidden = false;
    this.querySelector<HTMLElement>('[data-embed-fallback]')!.hidden = true;
  }

  private async mount() {
    if (this.mounted || this.dataset.valid !== 'true') return;
    this.mounted = true;
    const canvas = this.querySelector<HTMLElement>('[data-embed-canvas]')!;
    const template = this.querySelector<HTMLTemplateElement>('[data-embed-template]')!;
    canvas.append(template.content.cloneNode(true));
    this.mutations = new MutationObserver(() => {
      const frame = canvas.querySelector('iframe');
      if (frame && frame !== this.frame) {
        this.frame = frame;
        frame.title = this.getAttribute('aria-label') || 'Instagram portfolio post';
        this.size?.observe(frame);
      }
      this.fit();
    });
    this.mutations.observe(canvas, { childList: true, subtree: true, attributes: true, attributeFilter: ['height', 'style'] });
    this.fit();
    this.timeout = setTimeout(() => { if (!this.dataset.ready) this.fail(); }, 25_000);
    try {
      await loadInstagram();
      if (this.mounted && !this.closest('[hidden]')) processEmbeds();
    } catch { if (this.mounted) this.fail(); }
  }

  private fit() {
    const width = this.clientWidth;
    if (!width) return;
    const minimum = parseFloat(getComputedStyle(this).getPropertyValue('--embed-native-width')) || 326;
    const scale = Math.min(1, width / minimum);
    this.style.setProperty('--embed-canvas-width', `${Math.max(width, minimum)}px`);
    this.style.setProperty('--embed-scale', String(scale));
    // Use Instagram's actual outer height, preserving its complete interactive UI.
    const height = this.frame?.offsetHeight ?? 0;
    if (height > 100) {
      this.style.setProperty('--embed-height', `${Math.ceil(height * scale)}px`);
      this.dataset.ready = 'true';
      this.querySelector<HTMLElement>('[data-embed-loading]')!.hidden = true;
      this.querySelector<HTMLElement>('[data-embed-fallback]')!.hidden = true;
      clearTimeout(this.timeout);
      this.complete();
    }
  }

  private fail() {
    this.querySelector<HTMLElement>('[data-embed-loading]')!.hidden = true;
    this.querySelector<HTMLElement>('[data-embed-fallback]')!.hidden = false;
    this.complete();
  }
}

if (!customElements.get('firefly-instagram')) customElements.define('firefly-instagram', FireflyInstagram);
