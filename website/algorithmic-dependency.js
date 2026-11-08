/**
 * The Economic Impact of Algorithmic Dependency on India's Domestic Market
 * Editorial Research Publication — Interactive Controller & Financial Visualizations
 * Author: Viraj Ravani
 * File: ad.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Minimal Reading Progress Bar
  initReadingProgressBar();

  // 2. Editorial Back to Top Control
  initBackToTop();

  // 3. Citation Jump & Highlight Interaction
  initCitationJumper();

  // 4. Academic References Search Filter
  initReferencesSearch();

  // 5. Strategic Vulnerability Matrix Interactions & Insights
  initHeatmapInteractions();

  // 6. Chart.js Financial Research Visualizations
  initAllCharts();
});

/* ==========================================================================
   Reading Progress Bar
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.getElementById('readingProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

/* ==========================================================================
   Back To Top Control
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Citation Jump & Animation Flash
   ========================================================================== */
function initCitationJumper() {
  const citationLinks = document.querySelectorAll('a[href^="#ref-"]');

  citationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Trigger flash highlight
        targetElement.classList.remove('highlighted');
        void targetElement.offsetWidth; // Force reflow
        targetElement.classList.add('highlighted');

        setTimeout(() => {
          targetElement.classList.remove('highlighted');
        }, 2600);
      }
    });
  });
}

/* ==========================================================================
   References Search / Filter
   ========================================================================== */
function initReferencesSearch() {
  const searchInput = document.getElementById('referenceSearchInput');
  const refItems = document.querySelectorAll('.ref-entry');
  if (!searchInput || refItems.length === 0) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    refItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const keywords = item.getAttribute('data-keywords') || '';
      const match = text.includes(query) || keywords.toLowerCase().includes(query);

      item.style.display = match ? 'flex' : 'none';
    });
  });
}

/* ==========================================================================
   Strategic Vulnerability Matrix Insights
   ========================================================================== */
const matrixInsights = {
  "Local Retail-Ad & Search Costs": {
    badge: "High Dependency",
    title: "Local Retail & Small Shops — Ad & Search Costs",
    text: "Hyper-local mom-and-pop shops and small retailers are forced into keyword bidding wars against each other and national aggregators just to appear on search queries within their own neighborhoods."
  },
  "Local Retail-App Store Fees": {
    badge: "High Dependency",
    title: "Local Retail & Small Shops — App Store Fees",
    text: "Neighborhood merchants attempting to offer native loyalty apps or specialized localized delivery order APKs are hit with platform commissions, severely curtailing digital self-reliance."
  },
  "Local Retail-Tech & Map APIs": {
    badge: "Low Impact",
    title: "Local Retail & Small Shops — Tech & Map APIs",
    text: "Traditional neighborhood storefronts rely predominantly on physical foot-traffic and direct local customer awareness rather than commercial enterprise-grade map routing APIs."
  },
  "Local Retail-Data Ownership": {
    badge: "Moderate Friction",
    title: "Local Retail & Small Shops — Data Ownership",
    text: "Customer search intent and repeat purchasing patterns are intercepted by foreign aggregator portals, preventing shop owners from building direct customer databases."
  },
  "Local Retail-Payment Independence": {
    badge: "Moderate Friction",
    title: "Local Retail & Small Shops — Payment Independence",
    text: "While UPI QR codes provide free settlement, credit card swipes and closed-loop platform wallets still extract friction fees on higher-ticket counter transactions."
  },

  "Startups-Ad & Search Costs": {
    badge: "High Dependency",
    title: "Early-Stage Tech Startups — Ad & Search Costs",
    text: "Early-stage consumer startups routinely burn between 40% to 60% of their early venture capital rounds on Meta and Google ad managers just to acquire preliminary user cohorts."
  },
  "Startups-App Store Fees": {
    badge: "High Dependency",
    title: "Early-Stage Tech Startups — App Store Fees",
    text: "The mandatory 15% to 30% Google Play and Apple App Store in-app purchase tax strips software startups of essential venture margins before they even achieve unit-economic breakeven."
  },
  "Startups-Tech & Map APIs": {
    badge: "Low Impact",
    title: "Early-Stage Tech Startups — Tech & Map APIs",
    text: "B2B SaaS and productivity startups rarely require extensive hyper-local mapping or route-optimization infrastructure during early MVP development."
  },
  "Startups-Data Ownership": {
    badge: "High Dependency",
    title: "Early-Stage Tech Startups — Data Ownership",
    text: "Consumer attribution analytics and tracking signals are siloed within offshore walled gardens, giving gatekeepers unfair competitive intelligence over emergent native consumer trends."
  },
  "Startups-Payment Independence": {
    badge: "Sovereign Relief",
    title: "Early-Stage Tech Startups — Payment Independence",
    text: "Unified Payments Interface (UPI) and domestic payment gateways eliminate foreign card scheme tolls, giving Indian startups free, instant, and sovereign money settlement."
  },

  "Creators-Ad & Search Costs": {
    badge: "Moderate Friction",
    title: "App Developers & Creators — Ad & Search Costs",
    text: "Organic algorithmic feeds provide intermittent bursts of distribution, but consistent creator reach requires compounding paid boost investments."
  },
  "Creators-App Store Fees": {
    badge: "High Dependency",
    title: "App Developers & Creators — App Store Fees",
    text: "Content creators and mobile utility developers pay a punitive 30% tax on subscriptions and digital consumables, which drastically suppresses digital creator earnings."
  },
  "Creators-Tech & Map APIs": {
    badge: "Moderate Friction",
    title: "App Developers & Creators — Tech & Map APIs",
    text: "Cross-platform cloud synchronization and notification utilities levy recurring foreign server bills as creator applications scale."
  },
  "Creators-Data Ownership": {
    badge: "High Dependency",
    title: "App Developers & Creators — Data Ownership",
    text: "Audience follower graphs are held hostage by foreign social platforms; creators cannot export their follower list or communicate directly outside the algorithm."
  },
  "Creators-Payment Independence": {
    badge: "High Dependency",
    title: "App Developers & Creators — Payment Independence",
    text: "Monetized digital goods in mobile applications are strictly prohibited from using UPI directly, legally bound to the gatekeepers' proprietary billing rails."
  },

  "Quick-Commerce-Ad & Search Costs": {
    badge: "Moderate Friction",
    title: "Quick-Commerce & Delivery — Ad & Search Costs",
    text: "High consumer app adoption enables partial direct re-orders, yet user re-engagement and local market acquisition still require heavy ad campaigns on Meta and Google."
  },
  "Quick-Commerce-App Store Fees": {
    badge: "Moderate Friction",
    title: "Quick-Commerce & Delivery — App Store Fees",
    text: "Physical goods fulfillment enjoys platform exemptions from standard 30% digital goods fees, but platform listing guidelines and search placements remain vulnerable."
  },
  "Quick-Commerce-Tech & Map APIs": {
    badge: "High Dependency",
    title: "Quick-Commerce & Delivery — Tech & Map APIs",
    text: "Rider dispatch, turn-by-turn routing, and geocoding rely on Google Maps Platform APIs, generating multi-million dollar annual foreign utility licensing overheads."
  },
  "Quick-Commerce-Data Ownership": {
    badge: "High Dependency",
    title: "Quick-Commerce & Delivery — Data Ownership",
    text: "OS-level location permissions and mobile telemetry tracking rules dictated by Android and iOS control the telemetry precision available to local logistics dispatchers."
  },
  "Quick-Commerce-Payment Independence": {
    badge: "Sovereign Relief",
    title: "Quick-Commerce & Delivery — Payment Independence",
    text: "Over 80% of quick-commerce checkout volume settles smoothly across native UPI rails, drastically curbing transaction processing leakages to foreign networks."
  },

  "FinTech-Ad & Search Costs": {
    badge: "Moderate Friction",
    title: "Domestic FinTech Services — Ad & Search Costs",
    text: "Financial service customer acquisition cost (CAC) continues to inflate due to aggressive keyword bidding on loan, insurance, and investment terms."
  },
  "FinTech-App Store Fees": {
    badge: "Moderate Friction",
    title: "Domestic FinTech Services — App Store Fees",
    text: "Direct lending and banking apps maintain independent payment settlement, but face periodic threats of sudden app store policy reviews or unilateral delistings."
  },
  "FinTech-Tech & Map APIs": {
    badge: "Moderate Friction",
    title: "Domestic FinTech Services — Tech & Map APIs",
    text: "KYC agent tracking and merchant onboarding rely on external geolocation libraries, generating recurring operational utility expenditures."
  },
  "FinTech-Data Ownership": {
    badge: "High Dependency",
    title: "Domestic FinTech Services — Data Ownership",
    text: "OS-level SMS permissions and notification scraping restrictions imposed by platform gatekeepers periodically disrupt alternative credit scoring and fraud detection models."
  },
  "FinTech-Payment Independence": {
    badge: "Sovereign Relief",
    title: "Domestic FinTech Services — Payment Independence",
    text: "Built on NPCI's sovereign UPI, IMPS, and BBPS architecture, domestic FinTech enjoys complete transactional autonomy and negligible processing tolls."
  }
};

function initHeatmapInteractions() {
  const filterTabs = document.querySelectorAll('.matrix-minimal-filters .matrix-tab-btn');
  const cells = document.querySelectorAll('.academic-heatmap-table .matrix-cell');
  const detailCard = document.getElementById('heatmapDetailCard');
  const detailBadge = document.getElementById('detailBadge');
  const detailTitle = document.getElementById('detailTitle');
  const detailExplanation = document.getElementById('detailExplanation');
  const closeDetailBtn = document.getElementById('closeDetailBtn');

  // Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      cells.forEach(cell => {
        const level = cell.getAttribute('data-level');
        if (filter === 'all' || level === filter) {
          cell.classList.remove('dimmed');
        } else {
          cell.classList.add('dimmed');
        }
      });
    });
  });

  // Cell Click / Keyboard Interaction
  cells.forEach(cell => {
    const handleSelect = () => {
      const category = cell.getAttribute('data-category');
      const dimension = cell.getAttribute('data-dimension');
      const key = `${category}-${dimension}`;
      const insight = matrixInsights[key];

      if (insight && detailCard && detailBadge && detailTitle && detailExplanation) {
        detailBadge.textContent = insight.badge;
        detailTitle.textContent = insight.title;
        detailExplanation.textContent = insight.text;
        detailCard.style.display = 'block';
        detailCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    cell.addEventListener('click', handleSelect);
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    });
  });

  if (closeDetailBtn && detailCard) {
    closeDetailBtn.addEventListener('click', () => {
      detailCard.style.display = 'none';
    });
  }
}

/* ==========================================================================
   Chart.js Financial Visualizations
   Styling: Financial Times / The Economist Minimal Palette
   ========================================================================== */
function initAllCharts() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js library is not available');
    return;
  }

  // Set Global Chart Defaults
  Chart.defaults.font.family = "'IBM Plex Mono', monospace";
  Chart.defaults.color = '#77736C';
  Chart.defaults.plugins.tooltip.backgroundColor = '#25251F';
  Chart.defaults.plugins.tooltip.titleColor = '#F7F6F1';
  Chart.defaults.plugins.tooltip.bodyColor = '#DEDAD0';
  Chart.defaults.plugins.tooltip.padding = 8;
  Chart.defaults.plugins.tooltip.cornerRadius = 0;
  Chart.defaults.plugins.tooltip.titleFont = { family: "'IBM Plex Mono', monospace", size: 11, weight: '700' };
  Chart.defaults.plugins.tooltip.bodyFont = { family: "'DM Sans', sans-serif", size: 12 };
  Chart.defaults.animation = false; // Restrained, no distracting animations

  // Chart 1: Figure 1.1 Market Ad Share Split (Doughnut)
  initChartAdShare();

  // Chart 2: Figure 2.1 Ecosystem Take-Rates (Bar)
  initChartTakeRates();

  // Chart 3: Figure 3.1 Market Extraction Walled Garden vs ONDC (Stacked Bar)
  initChartExtractionBar();

  // Chart 4: Figure 3.2 Extraction Distribution (Donut)
  initChartExtractionDist();
}

/**
 * Chart 1: Asymmetrical Distribution of Domestic Digital Ad Market Share
 * Global Platform Capture: 70%, Domestic Retention: 30%
 */
function initChartAdShare() {
  const ctx = document.getElementById('chartAdShare');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Global Platform Capture', 'Domestic Retention'],
      datasets: [{
        data: [70, 30],
        backgroundColor: ['#A64E35', '#68775C'],
        borderColor: '#F7F6F1',
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return ` ${label}: ${value}%`;
            }
          }
        }
      }
    }
  });
}

/**
 * Chart 2: Global Platform Take-Rates
 * Traditional Foreign App Stores: 30%, Advertising Networks: 18%, ONDC: 2%
 */
function initChartTakeRates() {
  const ctx = document.getElementById('chartTakeRates');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Foreign App Stores',
        'Foreign Ad Networks',
        'ONDC Open Protocol'
      ],
      datasets: [{
        data: [30, 18, 2],
        backgroundColor: ['#A64E35', '#77736C', '#68775C'],
        borderColor: '#F7F6F1',
        borderWidth: 0,
        borderRadius: 0,
        barPercentage: 0.55
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.parsed.x;
              if (context.dataIndex === 0) return ` Nominal Take-Rate: ${val}% (15%–30% range)`;
              if (context.dataIndex === 1) return ` Estimated Outflow: ${val}% of domestic spend`;
              if (context.dataIndex === 2) return ` Open Protocol Fee: ${val}% (1%–3% range)`;
              return ` ${val}%`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 35,
          grid: {
            color: '#DEDAD0',
            tickLength: 4
          },
          ticks: {
            callback: function(val) { return val + '%'; },
            font: { family: "'IBM Plex Mono', monospace", size: 10 }
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            color: '#25251F',
            font: { family: "'DM Sans', sans-serif", weight: '600', size: 12 }
          }
        }
      }
    }
  });
}

/**
 * Chart 3: Market Extraction: Walled Garden vs. ONDC Protocol
 * Walled Garden: $28 Platform Commission + $20 Interest = $48 Total
 * ONDC Protocol: $2 Network Routing Fee + $1 Direct Native Lender = $3 Total
 */
function initChartExtractionBar() {
  const ctx = document.getElementById('chartExtractionBar');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Walled Garden', 'ONDC Protocol'],
      datasets: [
        {
          label: 'Platform Commission / Routing Fee',
          data: [28, 2],
          backgroundColor: '#A64E35',
          borderRadius: 0
        },
        {
          label: 'Interest Rates / Direct Native Lender',
          data: [20, 1],
          backgroundColor: '#68775C',
          borderRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: $${context.parsed.y}`;
            },
            afterBody: function(items) {
              const total = items.reduce((sum, item) => sum + item.parsed.y, 0);
              return ` Total Extraction: $${total}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            color: '#25251F',
            font: { family: "'DM Sans', sans-serif", weight: '600', size: 12 }
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: 60,
          grid: {
            color: '#DEDAD0',
            tickLength: 4
          },
          ticks: {
            callback: function(val) { return '$' + val; },
            font: { family: "'IBM Plex Mono', monospace", size: 10 }
          },
          title: {
            display: true,
            text: '$ Particulars',
            font: { family: "'IBM Plex Mono', monospace", size: 10, weight: '600' }
          }
        }
      }
    }
  });
}

/**
 * Chart 4: Extraction Distribution (Walled Garden ~90% vs ONDC Protocol ~10%)
 */
function initChartExtractionDist() {
  const ctx = document.getElementById('chartExtractionDist');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Walled Garden', 'ONDC Protocol'],
      datasets: [{
        data: [90, 10],
        backgroundColor: ['#77736C', '#68775C'],
        borderColor: '#F7F6F1',
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '66%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return ` ${label}: ~${value}%`;
            }
          }
        }
      }
    }
  });
}

/**
 * Protocol-Aware Simulator Link Resolver:
 * Ensures links work when opened directly via local file:// protocol or deployed online.
 */
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('[data-local-href]').forEach(el => {
      const localHref = el.getAttribute('data-local-href');
      if (localHref) el.setAttribute('href', localHref);
    });
  }
});

