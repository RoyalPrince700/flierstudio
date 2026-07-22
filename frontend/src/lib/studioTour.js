const TOUR_SEEN_KEY = 'flier-studio-tour-seen'

export function hasSeenStudioTour() {
  try {
    return localStorage.getItem(TOUR_SEEN_KEY) === '1'
  } catch {
    return true
  }
}

export function markStudioTourSeen() {
  try {
    localStorage.setItem(TOUR_SEEN_KEY, '1')
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Tour steps. Each step may supply desktop/mobile copy + selectors.
 * Selectors are `[data-tour="…"]` attributes on studio chrome.
 *
 * Empty studio first: when the user has no open design, welcome on the
 * empty studio, then point at Templates — skip artboard/edit/export steps.
 */
export function getStudioTourSteps({
  isNarrow,
  isPhone,
  hasOpenDesign = false,
  templatesOpen = false,
}) {
  const mobile = isNarrow || isPhone

  if (!hasOpenDesign) {
    if (templatesOpen) {
      return [
        {
          id: 'welcome',
          title: 'Start with a template',
          body: mobile
            ? 'Browse layouts, then open one to edit and export. This quick tour covers the basics.'
            : 'Pick a template to open it in your studio. This quick tour shows where things live.',
          target: null,
          openPanel: false,
        },
        {
          id: 'templates',
          title: 'Browse templates',
          body: mobile
            ? 'Scroll the board and tap a layout to open it as your project.'
            : 'Click a collection, then a layout — it opens in the studio as a project.',
          target: '[data-tour="canvas"]',
          openPanel: false,
        },
        {
          id: 'templates-chip',
          title: 'Templates anytime',
          body: mobile
            ? 'Use Templates on the dock (or in the top bar) to come back here.'
            : 'Use Templates in the top bar or left rail to return to this browser anytime.',
          target: mobile ? '[data-tour="templates-rail"]' : '[data-tour="templates"]',
          openPanel: false,
        },
        {
          id: 'tools',
          title: mobile ? 'Tools on the dock' : 'Tools on the left',
          body: mobile
            ? 'After you open a design: Select to move, Text to edit type, Hand to pan. Export is on the dock too.'
            : 'After you open a design: V = Select, T = Text, H = Hand. Export is on the rail (or Ctrl+E).',
          target: '[data-tour="tools"]',
          openPanel: false,
        },
        {
          id: 'done',
          title: 'You’re ready',
          body: 'Open any template to start editing. You can replay this tour from Help anytime.',
          target: null,
          openPanel: false,
        },
      ]
    }

    return [
      {
        id: 'welcome',
        title: 'Welcome to your studio',
        body: mobile
          ? 'Your studio is empty for now. This quick tour shows how to pick a template and get started.'
          : 'Your studio is empty. Pick a template to begin — here’s a quick look around.',
        target: null,
        openPanel: false,
      },
      {
        id: 'templates-cta',
        title: 'Open Templates',
        body: mobile
          ? 'Tap Templates to browse layouts. Choose one and it opens here to edit.'
          : 'Click Templates to browse layouts. Pick a design to open it in the studio.',
        target: '[data-tour="templates-cta"]',
        openPanel: false,
      },
      {
        id: 'templates-chip',
        title: 'Templates anytime',
        body: mobile
          ? 'You can also open Templates from the dock or top bar whenever you need a new layout.'
          : 'Templates stays in the top bar and left rail — jump back anytime.',
        target: mobile ? '[data-tour="templates-rail"]' : '[data-tour="templates"]',
        openPanel: false,
      },
      {
        id: 'tools',
        title: mobile ? 'Tools on the dock' : 'Tools on the left',
        body: mobile
          ? 'After you open a design: Select to move, Text to edit type, Hand to pan. Export is on the dock too.'
          : 'After you open a design: V = Select, T = Text, H = Hand. Export is on the rail (or Ctrl+E).',
        target: '[data-tour="tools"]',
        openPanel: false,
      },
      {
        id: 'done',
        title: 'You’re ready',
        body: 'Hit Templates whenever you’re ready to start. You can replay this tour from Help anytime.',
        target: null,
        openPanel: false,
      },
    ]
  }

  return [
    {
      id: 'welcome',
      title: 'You’re in the studio',
      body: mobile
        ? 'Edit on the board, then export. This quick tour shows the essentials.'
        : 'Edit text and images on the board, then export. Here’s a quick look around.',
      target: null,
      openPanel: false,
    },
    {
      id: 'templates',
      title: 'Open another template',
      body: mobile
        ? 'Tap Templates to browse more layouts. Pick one to open it as a project.'
        : 'Open Templates to browse layouts. Click a design to start editing.',
      target: mobile ? '[data-tour="templates-rail"]' : '[data-tour="templates"]',
      openPanel: false,
    },
    {
      id: 'artboard',
      title: 'Select an artboard',
      body: mobile
        ? 'Tap a flier on the canvas to select it. That’s the piece you’ll edit and export.'
        : 'Click an artboard on the canvas to select it. Edits and export apply to the selection.',
      target: '[data-tour="canvas"]',
      openPanel: false,
    },
    {
      id: 'edit',
      title: 'Edit text & images',
      body: mobile
        ? 'Open Panel to change copy, photos, and layers. You can also tap text or image slots on the board.'
        : 'Use the right panel to change copy and photos — or click text and image slots on the board.',
      target: mobile ? '[data-tour="panel"]' : '[data-tour="inspector"]',
      openPanel: mobile,
    },
    {
      id: 'tools',
      title: mobile ? 'Tools on the dock' : 'Tools on the left',
      body: mobile
        ? 'Select to move, Text to edit type, Hand to pan. Pinch to zoom; two-finger drag also pans.'
        : 'V = Select, T = Text, H = Hand. Scroll to pan, Ctrl+scroll to zoom.',
      target: '[data-tour="tools"]',
      openPanel: false,
    },
    {
      id: 'export',
      title: 'Export when ready',
      body: mobile
        ? 'Tap Export (download) on the dock — or use Export in the Panel for format and HD size.'
        : 'Hit Export (or Ctrl+E) to download. The panel also has format and HD scale options.',
      target: '[data-tour="export"]',
      openPanel: false,
    },
  ]
}
