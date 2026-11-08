/**
 * INDIA DIGITAL ECONOMY SIMULATOR
 * Vanilla JavaScript Economic Engine & Native SVG Visualizations
 * Author: Viraj Ravani (viraj.ravani@somaiya.edu)
 * Accompanying: The Economic Impact of Algorithmic Dependency on India's Domestic Market
 * File: digital-economy-simulator.js
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Model Baseline State & Scenario Presets
  // ---------------------------------------------------------------------------
  const DEFAULT_ASSUMPTIONS = {
    adSpend: 60000,           // ₹ crore
    foreignCapture: 72,       // %
    domesticRetention: 18,    // %
    appStoreCommission: 20,   // %
    appStoreGMV: 25000,       // ₹ crore
    smeAdSpend: 24000         // ₹ crore
  };

  const SCENARIO_PRESETS = {
    high: {
      name: 'Scenario A — High Foreign Dependency',
      adSpend: 60000,
      foreignCapture: 80,
      domesticRetention: 10,
      appStoreCommission: 25,
      appStoreGMV: 25000,
      smeAdSpend: 24000,
      description: 'Foreign platforms capture 80% of digital advertising with 25% app store take-rates.'
    },
    hybrid: {
      name: 'Scenario B — Hybrid Digital Ecosystem',
      adSpend: 60000,
      foreignCapture: 50,
      domesticRetention: 35,
      appStoreCommission: 15,
      appStoreGMV: 25000,
      smeAdSpend: 24000,
      description: 'More balanced domestic retention (35%) through open protocols and localized media networks.'
    },
    domestic: {
      name: 'Scenario C — Stronger Domestic Ecosystem',
      adSpend: 60000,
      foreignCapture: 30,
      domesticRetention: 60,
      appStoreCommission: 10,
      appStoreGMV: 25000,
      smeAdSpend: 24000,
      description: 'High domestic retention (60%) driven by sovereign DPI rails and decentralized search protocols.'
    }
  };

  const DEFAULT_SME = {
    monthlyAdSpend: 50000,     // ₹
    foreignShare: 85,          // %
    monthlyRevenue: 500000,    // ₹
    monthlyFees: 15000,        // ₹
    hypotheticalShare: 40      // %
  };

  let currentState = { ...DEFAULT_ASSUMPTIONS };
  let currentSMEState = { ...DEFAULT_SME };
  let currentActiveScenario = 'custom';
  let activeSensitivityTab = 'foreignCapture';

  // ---------------------------------------------------------------------------
  // 2. Numerical Formatting Helpers (Indian System)
  // ---------------------------------------------------------------------------
  function formatCrores(amount) {
    if (isNaN(amount) || amount === null) return '₹0 Cr';
    const rounded = Math.round(amount);
    return '₹' + rounded.toLocaleString('en-IN') + ' Cr';
  }

  function formatINR(amount) {
    if (isNaN(amount) || amount === null) return '₹0';
    const rounded = Math.round(amount);
    return '₹' + rounded.toLocaleString('en-IN');
  }

  function formatPercent(val) {
    if (isNaN(val) || val === null) return '0%';
    return (Math.round(val * 10) / 10) + '%';
  }

  // ---------------------------------------------------------------------------
  // 3. Core Economic Calculations (Pure Functions)
  // ---------------------------------------------------------------------------
  function calculateModel(inputs) {
    const totalAdSpend = Math.max(0, Number(inputs.adSpend) || 0);
    const foreignCapturePct = Math.max(0, Math.min(100, Number(inputs.foreignCapture) || 0));
    const domesticRetentionPct = Math.max(0, Math.min(100, Number(inputs.domesticRetention) || 0));
    const appStoreCommissionPct = Math.max(0, Math.min(100, Number(inputs.appStoreCommission) || 0));
    const appStoreGMV = Math.max(0, Number(inputs.appStoreGMV) || 0);
    const smeAdSpend = Math.max(0, Number(inputs.smeAdSpend) || 0);

    // Formula A: Foreign Advertising Revenue Capture
    const foreignRevenue = totalAdSpend * (foreignCapturePct / 100);

    // Formula B: Domestic Advertising Revenue Retention
    const domesticRetention = totalAdSpend * (domesticRetentionPct / 100);

    // Formula C: Unallocated Advertising Expenditure
    const unallocatedAmount = Math.max(0, totalAdSpend - foreignRevenue - domesticRetention);
    const unallocatedPct = Math.max(0, 100 - foreignCapturePct - domesticRetentionPct);

    // Formula D: App Store Commission Outflow
    const appStoreOutflow = appStoreGMV * (appStoreCommissionPct / 100);
    const appStoreRemaining = Math.max(0, appStoreGMV - appStoreOutflow);

    // Formula E: Combined Modelled Platform-Related Outflow
    const combinedOutflow = foreignRevenue + appStoreOutflow;

    // Derived SME Macro Outflow
    const smeForeignLeakage = smeAdSpend * (foreignCapturePct / 100);

    const isExceeding100 = (foreignCapturePct + domesticRetentionPct) > 100;

    return {
      totalAdSpend,
      foreignCapturePct,
      domesticRetentionPct,
      unallocatedPct,
      foreignRevenue,
      domesticRetention,
      unallocatedAmount,
      appStoreCommissionPct,
      appStoreGMV,
      appStoreOutflow,
      appStoreRemaining,
      combinedOutflow,
      smeAdSpend,
      smeForeignLeakage,
      isExceeding100
    };
  }

  function calculateSMEMetrics(smeInputs) {
    const monthlyAdSpend = Math.max(0, Number(smeInputs.monthlyAdSpend) || 0);
    const foreignShare = Math.max(0, Math.min(100, Number(smeInputs.foreignShare) || 0));
    const monthlyRevenue = Math.max(0, Number(smeInputs.monthlyRevenue) || 0);
    const monthlyFees = Math.max(0, Number(smeInputs.monthlyFees) || 0);
    const hypoShare = Math.max(0, Math.min(100, Number(smeInputs.hypotheticalShare) || 0));

    const annualAdSpend = monthlyAdSpend * 12;
    const annualForeignAdSpend = annualAdSpend * (foreignShare / 100);
    const adSpendRevenueRatio = monthlyRevenue > 0 ? (monthlyAdSpend / monthlyRevenue) * 100 : 0;
    const annualPlatformFees = monthlyFees * 12;

    const hypoAnnualForeignAdSpend = annualAdSpend * (hypoShare / 100);
    const annualRetainedSavings = Math.max(0, annualForeignAdSpend - hypoAnnualForeignAdSpend);

    return {
      annualAdSpend,
      annualForeignAdSpend,
      adSpendRevenueRatio,
      annualPlatformFees,
      hypoAnnualForeignAdSpend,
      annualRetainedSavings,
      foreignShare,
      hypoShare
    };
  }

  // ---------------------------------------------------------------------------
  // 4. DOM Elements Mapping
  // ---------------------------------------------------------------------------
  const DOM = {
    // Inputs (Sliders & Numbers)
    adSpendSlider: document.getElementById('adSpendSlider'),
    adSpendInput: document.getElementById('adSpendInput'),

    foreignCaptureSlider: document.getElementById('foreignCaptureSlider'),
    foreignCaptureInput: document.getElementById('foreignCaptureInput'),

    domesticRetentionSlider: document.getElementById('domesticRetentionSlider'),
    domesticRetentionInput: document.getElementById('domesticRetentionInput'),

    appStoreCommissionSlider: document.getElementById('appStoreCommissionSlider'),
    appStoreCommissionInput: document.getElementById('appStoreCommissionInput'),

    appStoreGMVSlider: document.getElementById('appStoreGMVSlider'),
    appStoreGMVInput: document.getElementById('appStoreGMVInput'),

    smeAdSpendSlider: document.getElementById('smeAdSpendSlider'),
    smeAdSpendInput: document.getElementById('smeAdSpendInput'),

    // Validation Banner
    validationBanner: document.getElementById('validationBanner'),

    // Action Buttons
    btnRestoreDefaults: document.getElementById('btnRestoreDefaults'),
    btnExportCSV: document.getElementById('btnExportCSV'),

    // Live Metrics Displays
    dispForeignRevenue: document.getElementById('dispForeignRevenue'),
    dispForeignPct: document.getElementById('dispForeignPct'),

    dispDomesticRetention: document.getElementById('dispDomesticRetention'),
    dispDomesticPct: document.getElementById('dispDomesticPct'),

    dispUnallocatedAmount: document.getElementById('dispUnallocatedAmount'),
    dispUnallocatedPct: document.getElementById('dispUnallocatedPct'),

    dispAppStoreOutflow: document.getElementById('dispAppStoreOutflow'),
    dispAppStoreCommissionPct: document.getElementById('dispAppStoreCommissionPct'),

    dispSMEOutflow: document.getElementById('dispSMEOutflow'),
    dispSMEAdSpend: document.getElementById('dispSMEAdSpend'),

    dispCombinedOutflow: document.getElementById('dispCombinedOutflow'),

    // Visual Bar Elements
    barSegForeign: document.getElementById('barSegForeign'),
    barSegDomestic: document.getElementById('barSegDomestic'),
    barSegUnallocated: document.getElementById('barSegUnallocated'),

    breakdownForeignVal: document.getElementById('breakdownForeignVal'),
    breakdownForeignPct: document.getElementById('breakdownForeignPct'),
    breakdownDomesticVal: document.getElementById('breakdownDomesticVal'),
    breakdownDomesticPct: document.getElementById('breakdownDomesticPct'),
    breakdownUnallocatedVal: document.getElementById('breakdownUnallocatedVal'),
    breakdownUnallocatedPct: document.getElementById('breakdownUnallocatedPct'),

    // Flow SVG container
    flowSvg: document.getElementById('economicFlowSvg'),

    // App Store Bar
    appStoreGmvTotalVal: document.getElementById('appStoreGmvTotalVal'),
    appStoreCommissionVal: document.getElementById('appStoreCommissionVal'),
    appStoreRemainingVal: document.getElementById('appStoreRemainingVal'),
    appStoreCommissionBarSeg: document.getElementById('appStoreCommissionBarSeg'),
    appStoreRemainingBarSeg: document.getElementById('appStoreRemainingBarSeg'),

    // Scenario Presets
    scenarioBtns: document.querySelectorAll('.btn-scenario'),
    scenarioTableBody: document.getElementById('scenarioTableBody'),
    scenarioComparisonChart: document.getElementById('scenarioComparisonChart'),

    // SME Explorer Inputs & Outputs
    smeMonthlySpendInput: document.getElementById('smeMonthlySpendInput'),
    smeForeignShareSlider: document.getElementById('smeForeignShareSlider'),
    smeForeignShareInput: document.getElementById('smeForeignShareInput'),
    smeMonthlyRevenueInput: document.getElementById('smeMonthlyRevenueInput'),
    smeMonthlyFeesInput: document.getElementById('smeMonthlyFeesInput'),
    smeHypoShareSlider: document.getElementById('smeHypoShareSlider'),
    smeHypoShareInput: document.getElementById('smeHypoShareInput'),

    smeDispAnnualSpend: document.getElementById('smeDispAnnualSpend'),
    smeDispAnnualForeign: document.getElementById('smeDispAnnualForeign'),
    smeDispSpendRatio: document.getElementById('smeDispSpendRatio'),
    smeDispAnnualFees: document.getElementById('smeDispAnnualFees'),
    smeDispRetainedSavings: document.getElementById('smeDispRetainedSavings'),
    smeDispSavingsNarrative: document.getElementById('smeDispSavingsNarrative'),

    // Sensitivity Elements
    sensTabBtns: document.querySelectorAll('.btn-sens-tab'),
    sensitivityChart: document.getElementById('sensitivityChart'),
    sensitivityTableBody: document.getElementById('sensitivityTableBody'),

    // Topbar & Navigation Elements
    topbarActiveScenarioName: document.getElementById('topbarActiveScenarioName'),
    topbarAdSpend: document.getElementById('topbarAdSpend'),
    topbarForeignPct: document.getElementById('topbarForeignPct'),
    topbarDomesticPct: document.getElementById('topbarDomesticPct'),
    topbarCombinedOutflow: document.getElementById('topbarCombinedOutflow'),
    mobileSidebarToggle: document.getElementById('mobileSidebarToggle'),
    sidebarScrollArea: document.getElementById('sidebarScrollArea'),
    dashboardMain: document.getElementById('dashboardMain'),
    sidebarNavLinks: document.querySelectorAll('.sidebar-nav-link'),
    jumpPills: document.querySelectorAll('.jump-pill')
  };

  // ---------------------------------------------------------------------------
  // 5. Input Synchronization & Event Wiring
  // ---------------------------------------------------------------------------
  function bindPair(slider, input, key) {
    if (!slider || !input) return;

    slider.addEventListener('input', function () {
      let val = Number(slider.value);
      input.value = val;
      currentState[key] = val;
      currentActiveScenario = 'custom';
      updateScenarioButtonStyles();
      updateAll();
    });

    input.addEventListener('input', function () {
      let val = Number(input.value);
      if (isNaN(val)) val = 0;
      slider.value = val;
      currentState[key] = val;
      currentActiveScenario = 'custom';
      updateScenarioButtonStyles();
      updateAll();
    });
  }

  function bindSMEPair(slider, input, key) {
    if (!slider || !input) return;

    slider.addEventListener('input', function () {
      let val = Number(slider.value);
      input.value = val;
      currentSMEState[key] = val;
      updateSME();
    });

    input.addEventListener('input', function () {
      let val = Number(input.value);
      if (isNaN(val)) val = 0;
      slider.value = val;
      currentSMEState[key] = val;
      updateSME();
    });
  }

  function setupEventListeners() {
    bindPair(DOM.adSpendSlider, DOM.adSpendInput, 'adSpend');
    bindPair(DOM.foreignCaptureSlider, DOM.foreignCaptureInput, 'foreignCapture');
    bindPair(DOM.domesticRetentionSlider, DOM.domesticRetentionInput, 'domesticRetention');
    bindPair(DOM.appStoreCommissionSlider, DOM.appStoreCommissionInput, 'appStoreCommission');
    bindPair(DOM.appStoreGMVSlider, DOM.appStoreGMVInput, 'appStoreGMV');
    bindPair(DOM.smeAdSpendSlider, DOM.smeAdSpendInput, 'smeAdSpend');

    // SME Direct Inputs
    if (DOM.smeMonthlySpendInput) {
      DOM.smeMonthlySpendInput.addEventListener('input', function () {
        currentSMEState.monthlyAdSpend = Number(this.value) || 0;
        updateSME();
      });
    }

    if (DOM.smeMonthlyRevenueInput) {
      DOM.smeMonthlyRevenueInput.addEventListener('input', function () {
        currentSMEState.monthlyRevenue = Number(this.value) || 0;
        updateSME();
      });
    }

    if (DOM.smeMonthlyFeesInput) {
      DOM.smeMonthlyFeesInput.addEventListener('input', function () {
        currentSMEState.monthlyFees = Number(this.value) || 0;
        updateSME();
      });
    }

    bindSMEPair(DOM.smeForeignShareSlider, DOM.smeForeignShareInput, 'foreignShare');
    bindSMEPair(DOM.smeHypoShareSlider, DOM.smeHypoShareInput, 'hypotheticalShare');

    // Restore Defaults Button
    if (DOM.btnRestoreDefaults) {
      DOM.btnRestoreDefaults.addEventListener('click', function () {
        currentState = { ...DEFAULT_ASSUMPTIONS };
        currentActiveScenario = 'custom';
        syncInputsFromState();
        updateScenarioButtonStyles();
        updateAll();
      });
    }

    // Export CSV Button
    if (DOM.btnExportCSV) {
      DOM.btnExportCSV.addEventListener('click', exportSimulationCSV);
    }

    // Scenario Preset Selection
    DOM.scenarioBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const scenarioKey = this.dataset.scenario;
        if (scenarioKey === 'custom') {
          currentState = { ...DEFAULT_ASSUMPTIONS };
          currentActiveScenario = 'custom';
          syncInputsFromState();
          updateScenarioButtonStyles();
          updateAll();
        } else if (SCENARIO_PRESETS[scenarioKey]) {
          const preset = SCENARIO_PRESETS[scenarioKey];
          currentState = {
            adSpend: preset.adSpend,
            foreignCapture: preset.foreignCapture,
            domesticRetention: preset.domesticRetention,
            appStoreCommission: preset.appStoreCommission,
            appStoreGMV: preset.appStoreGMV,
            smeAdSpend: preset.smeAdSpend
          };
          currentActiveScenario = scenarioKey;
          syncInputsFromState();
          updateScenarioButtonStyles();
          updateAll();
        }
      });
    });

    // Sensitivity Tabs
    DOM.sensTabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        DOM.sensTabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeSensitivityTab = this.dataset.variable;
        renderSensitivitySection();
      });
    });

    // Mobile Sidebar Drawer Toggle & Close
    if (DOM.mobileSidebarToggle && DOM.sidebarScrollArea) {
      DOM.mobileSidebarToggle.addEventListener('click', function () {
        const isOpen = DOM.sidebarScrollArea.classList.toggle('mobile-open');
        DOM.mobileSidebarToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const chevron = DOM.mobileSidebarToggle.querySelector('.toggle-chevron');
        if (chevron) chevron.innerHTML = isOpen ? '&uarr;' : '&darr;';
      });
    }

    const mobileCloseBtn = document.getElementById('mobileSidebarClose');
    if (mobileCloseBtn && DOM.sidebarScrollArea) {
      mobileCloseBtn.addEventListener('click', function () {
        DOM.sidebarScrollArea.classList.remove('mobile-open');
        if (DOM.mobileSidebarToggle) {
          DOM.mobileSidebarToggle.setAttribute('aria-expanded', 'false');
          const chevron = DOM.mobileSidebarToggle.querySelector('.toggle-chevron');
          if (chevron) chevron.innerHTML = '&darr;';
        }
      });
    }

    // Smooth Scrolling for Sidebar Nav & Jump Pills
    const allNavAnchors = document.querySelectorAll('.sidebar-nav-link, .jump-pill');
    allNavAnchors.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // On mobile, close drawer after selection
            if (DOM.sidebarScrollArea && DOM.sidebarScrollArea.classList.contains('mobile-open')) {
              DOM.sidebarScrollArea.classList.remove('mobile-open');
              if (DOM.mobileSidebarToggle) {
                DOM.mobileSidebarToggle.setAttribute('aria-expanded', 'false');
                const chevron = DOM.mobileSidebarToggle.querySelector('.toggle-chevron');
                if (chevron) chevron.innerHTML = '&darr;';
              }
            }
          }
        }
      });
    });

    // Active Section Observer for Left Sidebar Navigation Highlight
    if (window.IntersectionObserver && DOM.dashboardMain) {
      const panels = document.querySelectorAll('.dashboard-panel');
      const navLinks = document.querySelectorAll('.sidebar-nav-link');
      if (panels.length && navLinks.length) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const currentId = entry.target.getAttribute('id');
              navLinks.forEach(link => {
                if (link.getAttribute('href') === '#' + currentId) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
            }
          });
        }, {
          root: DOM.dashboardMain,
          rootMargin: '0px 0px -60% 0px',
          threshold: 0
        });

        panels.forEach(p => observer.observe(p));
      }
    }
  }

  function syncInputsFromState() {
    if (DOM.adSpendSlider) DOM.adSpendSlider.value = currentState.adSpend;
    if (DOM.adSpendInput) DOM.adSpendInput.value = currentState.adSpend;

    if (DOM.foreignCaptureSlider) DOM.foreignCaptureSlider.value = currentState.foreignCapture;
    if (DOM.foreignCaptureInput) DOM.foreignCaptureInput.value = currentState.foreignCapture;

    if (DOM.domesticRetentionSlider) DOM.domesticRetentionSlider.value = currentState.domesticRetention;
    if (DOM.domesticRetentionInput) DOM.domesticRetentionInput.value = currentState.domesticRetention;

    if (DOM.appStoreCommissionSlider) DOM.appStoreCommissionSlider.value = currentState.appStoreCommission;
    if (DOM.appStoreCommissionInput) DOM.appStoreCommissionInput.value = currentState.appStoreCommission;

    if (DOM.appStoreGMVSlider) DOM.appStoreGMVSlider.value = currentState.appStoreGMV;
    if (DOM.appStoreGMVInput) DOM.appStoreGMVInput.value = currentState.appStoreGMV;

    if (DOM.smeAdSpendSlider) DOM.smeAdSpendSlider.value = currentState.smeAdSpend;
    if (DOM.smeAdSpendInput) DOM.smeAdSpendInput.value = currentState.smeAdSpend;
  }

  function updateScenarioButtonStyles() {
    DOM.scenarioBtns.forEach(btn => {
      if (btn.dataset.scenario === currentActiveScenario) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Live Interface Rendering
  // ---------------------------------------------------------------------------
  function updateAll() {
    const res = calculateModel(currentState);

    // Validation warning if foreign + domestic > 100%
    if (DOM.validationBanner) {
      if (res.isExceeding100) {
        DOM.validationBanner.classList.add('active');
        DOM.validationBanner.innerHTML = `<strong>Validation Warning:</strong> Combined platform capture (${res.foreignCapturePct}%) and domestic retention (${res.domesticRetentionPct}%) total ${res.foreignCapturePct + res.domesticRetentionPct}%, exceeding 100% of total advertising expenditure. Unallocated share is clamped to 0%. Please adjust percentages to maintain balanced market accounting.`;
      } else {
        DOM.validationBanner.classList.remove('active');
      }
    }

    // 1. Live Numeric Metric Ledger
    if (DOM.dispForeignRevenue) DOM.dispForeignRevenue.textContent = formatCrores(res.foreignRevenue);
    if (DOM.dispForeignPct) DOM.dispForeignPct.textContent = formatPercent(res.foreignCapturePct);

    if (DOM.dispDomesticRetention) DOM.dispDomesticRetention.textContent = formatCrores(res.domesticRetention);
    if (DOM.dispDomesticPct) DOM.dispDomesticPct.textContent = formatPercent(res.domesticRetentionPct);

    if (DOM.dispUnallocatedAmount) DOM.dispUnallocatedAmount.textContent = formatCrores(res.unallocatedAmount);
    if (DOM.dispUnallocatedPct) DOM.dispUnallocatedPct.textContent = formatPercent(res.unallocatedPct);

    if (DOM.dispAppStoreOutflow) DOM.dispAppStoreOutflow.textContent = formatCrores(res.appStoreOutflow);
    if (DOM.dispAppStoreCommissionPct) DOM.dispAppStoreCommissionPct.textContent = formatPercent(res.appStoreCommissionPct);

    if (DOM.dispSMEOutflow) DOM.dispSMEOutflow.textContent = formatCrores(res.smeForeignLeakage);
    if (DOM.dispSMEAdSpend) DOM.dispSMEAdSpend.textContent = formatCrores(res.smeAdSpend);

    if (DOM.dispCombinedOutflow) DOM.dispCombinedOutflow.textContent = formatCrores(res.combinedOutflow);

    // Topbar Dashboard Indicators
    if (DOM.topbarActiveScenarioName) {
      if (currentActiveScenario === 'high') {
        DOM.topbarActiveScenarioName.textContent = 'Scenario A — High Foreign Dependency';
      } else if (currentActiveScenario === 'hybrid') {
        DOM.topbarActiveScenarioName.textContent = 'Scenario B — Hybrid Digital Ecosystem';
      } else if (currentActiveScenario === 'domestic') {
        DOM.topbarActiveScenarioName.textContent = 'Scenario C — Stronger Domestic Ecosystem';
      } else {
        DOM.topbarActiveScenarioName.textContent = 'Baseline Illustrative Model';
      }
    }
    if (DOM.topbarAdSpend) DOM.topbarAdSpend.textContent = formatCrores(res.totalAdSpend);
    if (DOM.topbarForeignPct) DOM.topbarForeignPct.textContent = formatPercent(res.foreignCapturePct);
    if (DOM.topbarDomesticPct) DOM.topbarDomesticPct.textContent = formatPercent(res.domesticRetentionPct);
    if (DOM.topbarCombinedOutflow) DOM.topbarCombinedOutflow.textContent = formatCrores(res.combinedOutflow);

    // 2. Proportional Bar
    const totalNormalized = res.isExceeding100
      ? (res.foreignCapturePct + res.domesticRetentionPct)
      : 100;

    const foreignBarWidth = (res.foreignCapturePct / totalNormalized) * 100;
    const domesticBarWidth = (res.domesticRetentionPct / totalNormalized) * 100;
    const unallocatedBarWidth = Math.max(0, 100 - foreignBarWidth - domesticBarWidth);

    if (DOM.barSegForeign) DOM.barSegForeign.style.width = foreignBarWidth + '%';
    if (DOM.barSegDomestic) DOM.barSegDomestic.style.width = domesticBarWidth + '%';
    if (DOM.barSegUnallocated) DOM.barSegUnallocated.style.width = unallocatedBarWidth + '%';

    if (DOM.breakdownForeignVal) DOM.breakdownForeignVal.textContent = formatCrores(res.foreignRevenue);
    if (DOM.breakdownForeignPct) DOM.breakdownForeignPct.textContent = formatPercent(res.foreignCapturePct);

    if (DOM.breakdownDomesticVal) DOM.breakdownDomesticVal.textContent = formatCrores(res.domesticRetention);
    if (DOM.breakdownDomesticPct) DOM.breakdownDomesticPct.textContent = formatPercent(res.domesticRetentionPct);

    if (DOM.breakdownUnallocatedVal) DOM.breakdownUnallocatedVal.textContent = formatCrores(res.unallocatedAmount);
    if (DOM.breakdownUnallocatedPct) DOM.breakdownUnallocatedPct.textContent = formatPercent(res.unallocatedPct);

    // 3. Render Native SVG Economic Flow
    renderSankeyFlow(res);

    // 4. App Store Breakdown Bar
    const appStorePct = res.appStoreGMV > 0 ? (res.appStoreOutflow / res.appStoreGMV) * 100 : 0;
    const appStoreRemainingPct = 100 - appStorePct;

    if (DOM.appStoreGmvTotalVal) DOM.appStoreGmvTotalVal.textContent = formatCrores(res.appStoreGMV);
    if (DOM.appStoreCommissionVal) DOM.appStoreCommissionVal.textContent = formatCrores(res.appStoreOutflow) + ' (' + formatPercent(appStorePct) + ')';
    if (DOM.appStoreRemainingVal) DOM.appStoreRemainingVal.textContent = formatCrores(res.appStoreRemaining) + ' (' + formatPercent(appStoreRemainingPct) + ')';

    if (DOM.appStoreCommissionBarSeg) DOM.appStoreCommissionBarSeg.style.width = appStorePct + '%';
    if (DOM.appStoreRemainingBarSeg) DOM.appStoreRemainingBarSeg.style.width = appStoreRemainingPct + '%';

    // 5. Update Scenario Comparison Table & Chart
    renderScenarioComparison(res);

    // 6. Update Sensitivity Analysis
    renderSensitivitySection();

    // 7. Update SME Section
    updateSME();
  }

  // ---------------------------------------------------------------------------
  // 7. Native SVG Economic Flow Diagram (Sankey-Style Flow)
  // ---------------------------------------------------------------------------
  function renderSankeyFlow(res) {
    if (!DOM.flowSvg) return;

    const width = 960;
    const height = 340;

    // Node Dimensions
    const leftX = 40;
    const leftWidth = 230;
    const leftY = 30;
    const leftHeight = 280;

    const rightX = 690;
    const rightWidth = 230;

    // Right Nodes Vertical Allocations
    const gap = 18;
    const totalAvailHeight = leftHeight - (gap * 2);

    const fPct = res.foreignCapturePct / 100;
    const dPct = res.domesticRetentionPct / 100;
    const uPct = Math.max(0, 1 - fPct - dPct);

    const fHeight = Math.max(44, totalAvailHeight * fPct);
    const dHeight = Math.max(44, totalAvailHeight * dPct);
    const uHeight = Math.max(34, totalAvailHeight * uPct);

    const r1Y = leftY;
    const r2Y = r1Y + fHeight + gap;
    const r3Y = r2Y + dHeight + gap;

    // Bezier Curves Source Coordinates
    const s1Y = leftY + (fHeight / 2);
    const s2Y = leftY + fHeight + (dHeight / 2);
    const s3Y = leftY + fHeight + dHeight + (uHeight / 2);

    const c1Y = r1Y + (fHeight / 2);
    const c2Y = r2Y + (dHeight / 2);
    const c3Y = r3Y + (uHeight / 2);

    const cp1X = leftX + leftWidth + 200;
    const cp2X = rightX - 200;

    // Flow Paths
    const pathForeign = `M ${leftX + leftWidth} ${s1Y} C ${cp1X} ${s1Y}, ${cp2X} ${c1Y}, ${rightX} ${c1Y}`;
    const pathDomestic = `M ${leftX + leftWidth} ${s2Y} C ${cp1X} ${s2Y}, ${cp2X} ${c2Y}, ${rightX} ${c2Y}`;
    const pathUnallocated = `M ${leftX + leftWidth} ${s3Y} C ${cp1X} ${s3Y}, ${cp2X} ${c3Y}, ${rightX} ${c3Y}`;

    const svgContent = `
      <svg viewBox="0 0 ${width} ${height}" class="flow-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Economic flow of advertising expenditure from Indian businesses to foreign platforms, domestic platforms, and unallocated rails.">
        <defs>
          <linearGradient id="flowForeignGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1C1B18" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#A64E35" stop-opacity="0.8"/>
          </linearGradient>
          <linearGradient id="flowDomesticGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1C1B18" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#5B6F50" stop-opacity="0.8"/>
          </linearGradient>
          <linearGradient id="flowUnallocatedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1C1B18" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#B8B0A2" stop-opacity="0.6"/>
          </linearGradient>
        </defs>

        <!-- Dynamic Flow Ribbons -->
        <path d="${pathForeign}" fill="none" stroke="url(#flowForeignGrad)" stroke-width="${Math.max(6, fHeight * 0.9)}" stroke-linecap="round" />
        <path d="${pathDomestic}" fill="none" stroke="url(#flowDomesticGrad)" stroke-width="${Math.max(6, dHeight * 0.9)}" stroke-linecap="round" />
        <path d="${pathUnallocated}" fill="none" stroke="url(#flowUnallocatedGrad)" stroke-width="${Math.max(3, uHeight * 0.85)}" stroke-linecap="round" />

        <!-- Source Node: Indian Business Ad Spend -->
        <rect x="${leftX}" y="${leftY}" width="${leftWidth}" height="${leftHeight}" fill="#FFFFFF" stroke="#1C1B18" stroke-width="2.5" />
        <text x="${leftX + 20}" y="${leftY + 36}" font-family="'IBM Plex Mono', monospace" font-size="11" font-weight="700" fill="#6B6760" letter-spacing="1.2">ORIGIN RAIL</text>
        <text x="${leftX + 20}" y="${leftY + 68}" font-family="'DM Sans', sans-serif" font-size="17" font-weight="800" fill="#1C1B18">Indian Commercial</text>
        <text x="${leftX + 20}" y="${leftY + 92}" font-family="'DM Sans', sans-serif" font-size="17" font-weight="800" fill="#1C1B18">Ad Expenditure</text>
        <text x="${leftX + 20}" y="${leftY + 155}" font-family="'IBM Plex Mono', monospace" font-size="28" font-weight="800" fill="#1C1B18">${formatCrores(res.totalAdSpend)}</text>
        <text x="${leftX + 20}" y="${leftY + 185}" font-family="'IBM Plex Mono', monospace" font-size="13" font-weight="600" fill="#6B6760">100% Gross Outlay</text>
        <text x="${leftX + 20}" y="${leftY + 235}" font-family="'DM Sans', sans-serif" font-size="13" fill="#949087">Domestic Advertisers</text>

        <!-- Destination Node 1: Foreign Ad Networks -->
        <rect x="${rightX}" y="${r1Y}" width="${rightWidth}" height="${fHeight}" fill="#FFFFFF" stroke="#A64E35" stroke-width="2.5" />
        <text x="${rightX + 18}" y="${r1Y + 26}" font-family="'DM Sans', sans-serif" font-size="15" font-weight="800" fill="#A64E35">Foreign Ad Networks</text>
        <text x="${rightX + 18}" y="${r1Y + 54}" font-family="'IBM Plex Mono', monospace" font-size="20" font-weight="800" fill="#A64E35">${formatCrores(res.foreignRevenue)}</text>
        <text x="${rightX + 18}" y="${r1Y + 74}" font-family="'IBM Plex Mono', monospace" font-size="13" font-weight="600" fill="#6B6760">${formatPercent(res.foreignCapturePct)} Platform Take</text>

        <!-- Destination Node 2: Domestic Platforms -->
        <rect x="${rightX}" y="${r2Y}" width="${rightWidth}" height="${dHeight}" fill="#FFFFFF" stroke="#5B6F50" stroke-width="2.5" />
        <text x="${rightX + 18}" y="${r2Y + 26}" font-family="'DM Sans', sans-serif" font-size="15" font-weight="800" fill="#5B6F50">Domestic Platforms</text>
        <text x="${rightX + 18}" y="${r2Y + 54}" font-family="'IBM Plex Mono', monospace" font-size="20" font-weight="800" fill="#5B6F50">${formatCrores(res.domesticRetention)}</text>
        <text x="${rightX + 18}" y="${r2Y + 74}" font-family="'IBM Plex Mono', monospace" font-size="13" font-weight="600" fill="#6B6760">${formatPercent(res.domesticRetentionPct)} Retained Locally</text>

        <!-- Destination Node 3: Unallocated -->
        <rect x="${rightX}" y="${r3Y}" width="${rightWidth}" height="${uHeight}" fill="#FFFFFF" stroke="#B8B0A2" stroke-width="2" />
        <text x="${rightX + 18}" y="${r3Y + 22}" font-family="'DM Sans', sans-serif" font-size="13" font-weight="700" fill="#6B6760">Unallocated / Intermediary</text>
        <text x="${rightX + 18}" y="${r3Y + 44}" font-family="'IBM Plex Mono', monospace" font-size="15" font-weight="800" fill="#6B6760">${formatCrores(res.unallocatedAmount)} (${formatPercent(res.unallocatedPct)})</text>
      </svg>
    `;

    DOM.flowSvg.innerHTML = svgContent;
  }

  // ---------------------------------------------------------------------------
  // 8. Scenario Comparison Table & SVG Grouped Bar Chart
  // ---------------------------------------------------------------------------
  function renderScenarioComparison(currentRes) {
    if (!DOM.scenarioTableBody || !DOM.scenarioComparisonChart) return;

    const scenarios = [
      { key: 'high', data: calculateModel(SCENARIO_PRESETS.high), label: 'Scenario A: High Foreign Dependency' },
      { key: 'hybrid', data: calculateModel(SCENARIO_PRESETS.hybrid), label: 'Scenario B: Hybrid Digital Ecosystem' },
      { key: 'domestic', data: calculateModel(SCENARIO_PRESETS.domestic), label: 'Scenario C: Stronger Domestic Ecosystem' }
    ];

    // Render Table Rows
    let tableHtml = '';
    scenarios.forEach(sc => {
      const isCurrentActive = sc.key === currentActiveScenario;
      tableHtml += `
        <tr class="${isCurrentActive ? 'active-scenario-row' : ''}">
          <td class="table-scenario-name">
            <strong>${sc.label}</strong>
            ${isCurrentActive ? '<span class="text-terracotta mono" style="font-size: 0.75rem; font-weight: 700; display: block; margin-top: 2px;">&bull; CURRENTLY ACTIVE IN MODEL</span>' : ''}
          </td>
          <td>${formatPercent(sc.data.foreignCapturePct)} (${formatCrores(sc.data.foreignRevenue)})</td>
          <td>${formatPercent(sc.data.domesticRetentionPct)} (${formatCrores(sc.data.domesticRetention)})</td>
          <td>${formatPercent(sc.data.appStoreCommissionPct)} (${formatCrores(sc.data.appStoreOutflow)})</td>
          <td><strong>${formatCrores(sc.data.combinedOutflow)}</strong></td>
        </tr>
      `;
    });
    DOM.scenarioTableBody.innerHTML = tableHtml;

    // Render Native SVG Grouped Bar Chart
    const width = 960;
    const height = 360;
    const margin = { top: 50, right: 40, bottom: 65, left: 100 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const maxVal = 70000;
    const groupW = chartW / scenarios.length;
    const barW = 54;

    let barsSvg = '';
    scenarios.forEach((sc, idx) => {
      const groupCenterX = margin.left + (idx * groupW) + (groupW / 2);
      const groupX = groupCenterX - barW - 6;

      const fH = (sc.data.foreignRevenue / maxVal) * chartH;
      const fY = margin.top + chartH - fH;

      const dH = (sc.data.domesticRetention / maxVal) * chartH;
      const dY = margin.top + chartH - dH;

      barsSvg += `
        <!-- Scenario Group: ${sc.key} -->
        <rect x="${groupX}" y="${fY}" width="${barW}" height="${fH}" fill="#A64E35" rx="0" />
        <text x="${groupX + (barW / 2)}" y="${fY - 10}" font-family="'IBM Plex Mono', monospace" font-size="13" font-weight="700" fill="#A64E35" text-anchor="middle">${formatCrores(sc.data.foreignRevenue)}</text>

        <rect x="${groupX + barW + 12}" y="${dY}" width="${barW}" height="${dH}" fill="#5B6F50" rx="0" />
        <text x="${groupX + barW + 12 + (barW / 2)}" y="${dY - 10}" font-family="'IBM Plex Mono', monospace" font-size="13" font-weight="700" fill="#5B6F50" text-anchor="middle">${formatCrores(sc.data.domesticRetention)}</text>

        <text x="${groupCenterX}" y="${margin.top + chartH + 32}" font-family="'DM Sans', sans-serif" font-size="15" font-weight="800" fill="#1C1B18" text-anchor="middle">Scenario ${String.fromCharCode(65 + idx)}</text>
        <text x="${groupCenterX}" y="${margin.top + chartH + 50}" font-family="'IBM Plex Mono', monospace" font-size="12" fill="#6B6760" text-anchor="middle">Outflow: ${formatCrores(sc.data.combinedOutflow)}</text>
      `;
    });

    const chartContent = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; display: block;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grouped bar chart comparing Foreign Revenue Capture versus Domestic Platform Retention across Scenarios A, B, and C.">
        <!-- Chart Legend Top Right -->
        <g transform="translate(${width - 440}, 16)">
          <rect x="0" y="0" width="16" height="16" fill="#A64E35" />
          <text x="24" y="13" font-family="'DM Sans', sans-serif" font-size="13" font-weight="700" fill="#1C1B18">Foreign Ad Revenue Capture</text>
          <rect x="220" y="0" width="16" height="16" fill="#5B6F50" />
          <text x="244" y="13" font-family="'DM Sans', sans-serif" font-size="13" font-weight="700" fill="#1C1B18">Domestic Retention</text>
        </g>

        <!-- Grid lines & Y-Axis values -->
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left + chartW}" y2="${margin.top}" stroke="#DCD8CD" stroke-width="1" stroke-dasharray="4,4" />
        <text x="${margin.left - 15}" y="${margin.top + 5}" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="600" fill="#949087" text-anchor="end">₹70,000 Cr</text>

        <line x1="${margin.left}" y1="${margin.top + (chartH / 2)}" x2="${margin.left + chartW}" y2="${margin.top + (chartH / 2)}" stroke="#DCD8CD" stroke-width="1" stroke-dasharray="4,4" />
        <text x="${margin.left - 15}" y="${margin.top + (chartH / 2) + 5}" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="600" fill="#949087" text-anchor="end">₹35,000 Cr</text>

        <!-- Base Axis Line -->
        <line x1="${margin.left}" y1="${margin.top + chartH}" x2="${margin.left + chartW}" y2="${margin.top + chartH}" stroke="#1C1B18" stroke-width="2" />
        <text x="${margin.left - 15}" y="${margin.top + chartH + 5}" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="600" fill="#949087" text-anchor="end">₹0</text>

        ${barsSvg}
      </svg>
    `;

    DOM.scenarioComparisonChart.innerHTML = chartContent;
  }

  // ---------------------------------------------------------------------------
  // 9. SME Impact Explorer Logic
  // ---------------------------------------------------------------------------
  function updateSME() {
    const sme = calculateSMEMetrics(currentSMEState);

    if (DOM.smeDispAnnualSpend) DOM.smeDispAnnualSpend.textContent = formatINR(sme.annualAdSpend);
    if (DOM.smeDispAnnualForeign) DOM.smeDispAnnualForeign.textContent = formatINR(sme.annualForeignAdSpend) + ' (' + formatPercent(sme.foreignShare) + ')';
    if (DOM.smeDispSpendRatio) DOM.smeDispSpendRatio.textContent = formatPercent(sme.adSpendRevenueRatio) + ' of Monthly Revenue';
    if (DOM.smeDispAnnualFees) DOM.smeDispAnnualFees.textContent = formatINR(sme.annualPlatformFees);

    if (DOM.smeDispRetainedSavings) DOM.smeDispRetainedSavings.textContent = formatINR(sme.annualRetainedSavings);
    if (DOM.smeDispSavingsNarrative) {
      DOM.smeDispSavingsNarrative.textContent = `By shifting foreign platform ad dependency from ${sme.foreignShare}% down to ${sme.hypoShare}%, an estimated ${formatINR(sme.annualRetainedSavings)} annually is redirected into domestic commerce and local channels.`;
    }
  }

  // ---------------------------------------------------------------------------
  // 10. Sensitivity Analysis Rendering
  // ---------------------------------------------------------------------------
  function renderSensitivitySection() {
    if (!DOM.sensitivityChart || !DOM.sensitivityTableBody) return;

    const baseAdSpend = currentState.adSpend;
    const baseAppStoreGMV = currentState.appStoreGMV;
    const baseAppCommission = currentState.appStoreCommission;

    let steps = [];
    let xLabel = '';

    if (activeSensitivityTab === 'foreignCapture') {
      xLabel = 'Foreign Platform Capture Percentage';
      [30, 40, 50, 60, 70, 80, 90].forEach(pct => {
        const tempModel = calculateModel({
          ...currentState,
          foreignCapture: pct,
          domesticRetention: Math.min(currentState.domesticRetention, 100 - pct)
        });
        steps.push({
          label: `${pct}%`,
          foreignRev: tempModel.foreignRevenue,
          combined: tempModel.combinedOutflow,
          domesticRet: tempModel.domesticRetention
        });
      });
    } else if (activeSensitivityTab === 'adSpend') {
      xLabel = 'Annual Ad Expenditure Scale (₹ Cr)';
      [30000, 45000, 60000, 75000, 90000, 105000, 120000].forEach(spend => {
        const tempModel = calculateModel({
          ...currentState,
          adSpend: spend
        });
        steps.push({
          label: `₹${spend.toLocaleString('en-IN')}`,
          foreignRev: tempModel.foreignRevenue,
          combined: tempModel.combinedOutflow,
          domesticRet: tempModel.domesticRetention
        });
      });
    } else if (activeSensitivityTab === 'commission') {
      xLabel = 'App Store Commission Rate';
      [5, 10, 15, 20, 25, 30].forEach(comm => {
        const tempModel = calculateModel({
          ...currentState,
          appStoreCommission: comm
        });
        steps.push({
          label: `${comm}%`,
          foreignRev: tempModel.foreignRevenue,
          combined: tempModel.combinedOutflow,
          domesticRet: tempModel.domesticRetention
        });
      });
    }

    // Render Table Rows
    let tableHtml = '';
    steps.forEach(st => {
      tableHtml += `
        <tr>
          <td><strong>${st.label}</strong></td>
          <td class="text-terracotta mono">${formatCrores(st.foreignRev)}</td>
          <td class="text-olive mono">${formatCrores(st.domesticRet)}</td>
          <td class="mono"><strong>${formatCrores(st.combined)}</strong></td>
        </tr>
      `;
    });
    DOM.sensitivityTableBody.innerHTML = tableHtml;

    // Render Native SVG Sensitivity Line Chart
    const width = 960;
    const height = 360;
    const margin = { top: 50, right: 60, bottom: 65, left: 110 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const maxVal = Math.max(...steps.map(s => s.combined)) * 1.15 || 80000;

    let points = [];
    const stepX = chartW / (steps.length - 1);

    steps.forEach((st, i) => {
      const x = margin.left + (i * stepX);
      const y = margin.top + chartH - ((st.combined / maxVal) * chartH);
      points.push({ x, y, label: st.label, val: st.combined });
    });

    const pathData = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
    const areaData = `${pathData} L ${points[points.length - 1].x} ${margin.top + chartH} L ${points[0].x} ${margin.top + chartH} Z`;

    let dotsAndLabels = '';
    points.forEach((p, idx) => {
      const isEven = idx % 2 === 0;
      const yOffset = isEven ? -16 : -32;

      dotsAndLabels += `
        <circle cx="${p.x}" cy="${p.y}" r="6.5" fill="#A64E35" stroke="#FFFFFF" stroke-width="2.5"/>
        <circle cx="${p.x}" cy="${p.y}" r="2" fill="#FFFFFF"/>
        
        <rect x="${p.x - 42}" y="${p.y + yOffset - 14}" width="84" height="20" fill="#FFFFFF" stroke="#DCD8CD" stroke-width="1" rx="2" />
        <text x="${p.x}" y="${p.y + yOffset}" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="700" fill="#A64E35" text-anchor="middle">${formatCrores(p.val)}</text>
        
        <text x="${p.x}" y="${margin.top + chartH + 28}" font-family="'IBM Plex Mono', monospace" font-size="13" font-weight="600" fill="#1C1B18" text-anchor="middle">${p.label}</text>
      `;
    });

    const chartContent = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; display: block;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sensitivity curve showing combined modelled platform outflow across test parameter steps.">
        <defs>
          <linearGradient id="sensAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#A64E35" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#A64E35" stop-opacity="0.02"/>
          </linearGradient>
        </defs>

        <!-- Shaded Area Under Curve -->
        <path d="${areaData}" fill="url(#sensAreaGrad)" />

        <!-- Y-Axis Grid Lines & Values -->
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left + chartW}" y2="${margin.top}" stroke="#DCD8CD" stroke-width="1" stroke-dasharray="4,4" />
        <text x="${margin.left - 15}" y="${margin.top + 5}" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="600" fill="#949087" text-anchor="end">${formatCrores(maxVal)}</text>

        <line x1="${margin.left}" y1="${margin.top + (chartH / 2)}" x2="${margin.left + chartW}" y2="${margin.top + (chartH / 2)}" stroke="#DCD8CD" stroke-width="1" stroke-dasharray="4,4" />
        <text x="${margin.left - 15}" y="${margin.top + (chartH / 2) + 5}" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="600" fill="#949087" text-anchor="end">${formatCrores(maxVal / 2)}</text>

        <!-- Base Axis Line -->
        <line x1="${margin.left}" y1="${margin.top + chartH}" x2="${margin.left + chartW}" y2="${margin.top + chartH}" stroke="#1C1B18" stroke-width="2" />
        <text x="${margin.left - 15}" y="${margin.top + chartH + 5}" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="600" fill="#949087" text-anchor="end">₹0</text>

        <!-- Sensitivity Path Curve -->
        <path d="${pathData}" fill="none" stroke="#A64E35" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />

        ${dotsAndLabels}
      </svg>
    `;

    DOM.sensitivityChart.innerHTML = chartContent;
  }

  // ---------------------------------------------------------------------------
  // 11. Client-Side CSV Export Functionality
  // ---------------------------------------------------------------------------
  function exportSimulationCSV() {
    const res = calculateModel(currentState);
    const sme = calculateSMEMetrics(currentSMEState);

    const now = new Date().toISOString();

    const rows = [
      ['INDIA DIGITAL ECONOMY SIMULATOR — MODELLED OUTPUT EXPORT'],
      ['Author', 'Viraj Ravani (viraj.ravani@somaiya.edu)'],
      ['Canonical Publication', 'https://virajravani.in/algorithmic-dependency'],
      ['Export Timestamp (UTC)', now],
      ['Active Scenario Setting', currentActiveScenario.toUpperCase()],
      [],
      ['SECTION 1: USER INPUT ASSUMPTIONS', 'VALUE', 'UNIT', 'NOTES'],
      ['Annual Digital Advertising Expenditure', res.totalAdSpend, 'INR Crore', 'Total modelled digital ad expenditure in India'],
      ['Foreign Platform Revenue Capture Rate', res.foreignCapturePct, 'Percentage (%)', 'Share captured by foreign ad networks (Alphabet, Meta, etc.)'],
      ['Domestic Platform Revenue Retention Rate', res.domesticRetentionPct, 'Percentage (%)', 'Share retained by domestic platforms and Indian media'],
      ['Unallocated Advertising Share', res.unallocatedPct, 'Percentage (%)', 'Intermediary tech stack, unallocated publisher revenues'],
      ['App Store Commission Take-Rate', res.appStoreCommissionPct, 'Percentage (%)', 'Foreign mobile OS app store gatekeeper commission rate'],
      ['Annual App Store Transaction Value', res.appStoreGMV, 'INR Crore', 'Total digital app store gross transaction volume in India'],
      ['SME Annual Digital Ad Outlay', res.smeAdSpend, 'INR Crore', 'Modelled share of ad expenditure originating from Indian SMEs'],
      [],
      ['SECTION 2: LIVE MODELLED ECONOMIC FLOWS', 'VALUE', 'UNIT', 'METHODOLOGICAL FORMULA'],
      ['Foreign Advertising Revenue Capture', res.foreignRevenue, 'INR Crore', 'Total Ad Spend * Foreign Capture % / 100'],
      ['Domestic Advertising Revenue Retention', res.domesticRetention, 'INR Crore', 'Total Ad Spend * Domestic Retention % / 100'],
      ['Unallocated Advertising Expenditure', res.unallocatedAmount, 'INR Crore', 'Total Ad Spend - Foreign Revenue - Domestic Retention'],
      ['App Store Commission Outflow', res.appStoreOutflow, 'INR Crore', 'App Store GMV * Commission % / 100'],
      ['Remaining Developer App Store Proceeds', res.appStoreRemaining, 'INR Crore', 'App Store GMV - App Store Commission'],
      ['Combined Modelled Platform-Related Outflow', res.combinedOutflow, 'INR Crore', 'Foreign Ad Revenue + App Store Commission (Gross Modelled Flow)'],
      ['SME Digital Ad Outflow to Foreign Networks', res.smeForeignLeakage, 'INR Crore', 'SME Ad Spend * Foreign Capture % / 100'],
      [],
      ['SECTION 3: SME MICROECONOMIC EXPLORER', 'VALUE', 'UNIT', 'NOTES'],
      ['SME Monthly Digital Ad Expenditure', currentSMEState.monthlyAdSpend, 'INR', 'User-defined monthly small business ad spend'],
      ['SME Annualized Digital Ad Expenditure', sme.annualAdSpend, 'INR', 'Monthly Ad Spend * 12'],
      ['Foreign Platform Share of SME Ad Spend', sme.foreignShare, 'Percentage (%)', 'Active allocation to foreign walled gardens'],
      ['Annual Ad Spend Directed to Foreign Networks', sme.annualForeignAdSpend, 'INR', 'Annual Ad Spend * Foreign Share % / 100'],
      ['Monthly Business Revenue', currentSMEState.monthlyRevenue, 'INR', 'User-defined gross monthly revenue'],
      ['Ad Spend to Revenue Ratio', sme.adSpendRevenueRatio.toFixed(2), 'Percentage (%)', 'Monthly Ad Spend / Monthly Revenue * 100'],
      ['Annual Platform-Related Commissions / Fees', sme.annualPlatformFees, 'INR', 'Monthly Platform Fees * 12'],
      ['Hypothetical Domestic Alternative Foreign Share', sme.hypoShare, 'Percentage (%)', 'Target lower dependency scenario'],
      ['Estimated Annual Retained Capital Savings', sme.annualRetainedSavings, 'INR', 'Annual capital redirected into domestic economy'],
      [],
      ['METHODOLOGICAL DISCLAIMER & STATUTORY SCOPE'],
      ['1. This simulation is an assumption-driven analytical model designed for educational and policy research purposes.'],
      ['2. Figures represent user-defined mathematical outputs and should not be construed as audited national income statistics.'],
      ['3. Modelled platform-related outflow represents a gross economic flow and is not equated 1:1 with net national income loss.'],
      ['4. Ad expenditure and app store transaction values represent distinct economic streams and are modeled without double-counting.']
    ];

    const csvContent = rows
      .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `India_Digital_Economy_Simulation_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------------------------
  // 12. Initialization
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    if (window.location.protocol === 'file:') {
      document.querySelectorAll('[data-local-href]').forEach(el => {
        const localHref = el.getAttribute('data-local-href');
        if (localHref) el.setAttribute('href', localHref);
      });
    }
    setupEventListeners();
    syncInputsFromState();
    updateScenarioButtonStyles();
    updateAll();
  });

})();
