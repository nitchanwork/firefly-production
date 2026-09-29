import { FireflyInstagram, backgroundEmbedSlots } from './instagramEmbeds';

interface StagedBatch {
  template: HTMLTemplateElement;
  posts: HTMLElement[];
  embeds: FireflyInstagram[];
  started: Set<FireflyInstagram>;
}

/** Only the next unrevealed batch per visible brand/type can enter this queue. */
export function createPortfolioPreloader(page: HTMLElement) {
  const staged = new Map<HTMLElement, StagedBatch>();
  const active = new Set<FireflyInstagram>();
  const columns = [...page.querySelectorAll<HTMLElement>('[data-portfolio-type]')];
  let scheduled = false;
  let cancelScheduled = () => {};

  const visible = (element: HTMLElement) => !element.closest('[hidden]');
  const inViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight;
  };
  const nearButton = (column: HTMLElement) => {
    const button = column.querySelector<HTMLElement>('[data-load-more]');
    if (!button || button.hidden) return false;
    const rect = button.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight * 2.5;
  };
  const displayed = (column: HTMLElement) => [...column.querySelectorAll<FireflyInstagram>('.post-list > .portfolio-post:not([data-preloading]) firefly-instagram')];

  function sizePosts(column: HTMLElement, batch: StagedBatch) {
    const first = column.querySelector<HTMLElement>('.post-list > .portfolio-post:not([data-preloading])');
    if (first) batch.posts.forEach(post => post.style.setProperty('--preload-width', `${first.getBoundingClientRect().width}px`));
  }

  function stage(column: HTMLElement): StagedBatch | undefined {
    if (staged.has(column)) return staged.get(column);
    const template = column.querySelector<HTMLTemplateElement>('template[data-post-batch]');
    if (!template) return;
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const posts = [...fragment.children] as HTMLElement[];
    posts.forEach(post => {
      post.dataset.preloading = '';
      post.inert = true;
      post.setAttribute('aria-hidden', 'true');
    });
    const batch = { template, posts, embeds: [...fragment.querySelectorAll<FireflyInstagram>('firefly-instagram')], started: new Set<FireflyInstagram>() };
    sizePosts(column, batch);
    // Keep nodes in this parent through reveal: reparenting reloads iframe documents.
    column.querySelector('.post-list')!.append(fragment);
    staged.set(column, batch);
    return batch;
  }

  function pump() {
    if (document.hidden) return;
    // Foreground media always wins, including newly revealed posts.
    const foreground = columns.filter(visible).flatMap(displayed).filter(embed => inViewport(embed) || embed.loading);
    if (foreground.some(embed => !embed.settled)) return;
    const candidates = columns.filter(column => visible(column) && column.querySelector('template[data-post-batch]') &&
      nearButton(column) && displayed(column).some(embed => embed.settled));
    candidates.sort((a, b) => a.querySelector('[data-load-more]')!.getBoundingClientRect().top -
      b.querySelector('[data-load-more]')!.getBoundingClientRect().top);
    const limit = Math.min(4, active.size + backgroundEmbedSlots());
    // Prepare only the nearest next batch, sharing the embed loader's background cap.
    for (const column of candidates.slice(0, 1)) {
      if (active.size >= limit) break;
      const batch = stage(column);
      if (!batch) continue;
      for (const embed of batch.embeds) {
        if (active.size >= limit) break;
        if (batch.started.has(embed)) continue;
        batch.started.add(embed);
        active.add(embed);
        void embed.preload().finally(() => {
          active.delete(embed);
          if (staged.get(column) === batch) schedule();
        });
      }
    }
  }

  function schedule() {
    // Eager pages mount rendered batches only; reveal() still starts each clicked batch.
    if (page.hasAttribute('data-instagram-eager')) return;
    if (scheduled) return;
    scheduled = true;
    const run = () => { scheduled = false; pump(); };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 1000 });
      cancelScheduled = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(run, 200);
      cancelScheduled = () => clearTimeout(id);
    }
  }

  function cancel() {
    cancelScheduled();
    scheduled = false;
    const batches = [...staged.values()];
    staged.clear();
    active.clear();
    batches.forEach(batch => batch.posts.forEach(post => post.remove()));
  }

  document.addEventListener('portfolio:filter', () => { cancel(); schedule(); });
  page.addEventListener('portfolio:embed-settled', schedule);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { staged.forEach((batch, column) => sizePosts(column, batch)); schedule(); }, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('pagehide', cancel);
  schedule();

  return {
    reveal(column: HTMLElement): number {
      const batch = stage(column);
      if (!batch) return displayed(column).length;
      staged.delete(column);
      batch.template.remove();
      batch.posts.forEach(post => {
        delete post.dataset.preloading;
        post.inert = false;
        post.removeAttribute('aria-hidden');
        post.style.removeProperty('--preload-width');
      });
      // Start any not-yet-prepared posts as normal foreground work on an early click.
      batch.embeds.forEach(embed => { active.delete(embed); void embed.preload(); });
      schedule();
      return displayed(column).length;
    },
  };
}
