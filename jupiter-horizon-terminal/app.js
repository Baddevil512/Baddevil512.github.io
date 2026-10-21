/**
 * Jupiter Horizon Terminal — Interactive Application Logic
 * Superteam Earn Bounty Redesign Prototype
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Token Registry & Mock Market Data ---
  const TOKENS = {
    SOL: {
      symbol: 'SOL',
      name: 'Solana',
      price: 174.86,
      balance: 24.50,
      avatar: 'S',
      bg: 'linear-gradient(135deg, #9945FF, #14F195)',
      color: '#000',
      native: true
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      price: 1.00,
      balance: 1420.00,
      avatar: '$',
      bg: '#2775CA',
      color: '#FFFFFF',
      native: false
    },
    JUP: {
      symbol: 'JUP',
      name: 'Jupiter',
      price: 1.14,
      balance: 3500.00,
      avatar: '🪐',
      bg: '#14F195',
      color: '#080A10',
      native: false
    },
    RAY: {
      symbol: 'RAY',
      name: 'Raydium',
      price: 2.45,
      balance: 410.20,
      avatar: 'R',
      bg: '#00C2FF',
      color: '#080A10',
      native: false
    },
    BONK: {
      symbol: 'BONK',
      name: 'Bonk Inu',
      price: 0.000024,
      balance: 18450000.00,
      avatar: '🐶',
      bg: '#F59E0B',
      color: '#080A10',
      native: false
    }
  };

  // --- State ---
  let state = {
    inputToken: 'SOL',
    outputToken: 'USDC',
    inputAmount: 5.0,
    slippage: 0.5,
    priorityFee: 'turbo',
    mevShield: true,
    isWalletConnected: false,
    selectingFor: null // 'input' or 'output'
  };

  // --- DOM Elements ---
  const inputAmountEl = document.getElementById('inputAmount');
  const outputAmountEl = document.getElementById('outputAmount');
  const inputSymbolEl = document.getElementById('inputSymbol');
  const outputSymbolEl = document.getElementById('outputSymbol');
  const inputAvatarEl = document.getElementById('inputAvatar');
  const outputAvatarEl = document.getElementById('outputAvatar');
  const inputBalanceEl = document.getElementById('inputBalance');
  const outputBalanceEl = document.getElementById('outputBalance');
  const inputUsdValEl = document.getElementById('inputUsdVal');
  const outputUsdValEl = document.getElementById('outputUsdVal');
  const exchangeRateEl = document.getElementById('exchangeRate');
  const minReceivedValEl = document.getElementById('minReceivedVal');
  const priceImpactValEl = document.getElementById('priceImpactVal');
  const networkFeeValEl = document.getElementById('networkFeeVal');
  const flipTokensBtn = document.getElementById('flipTokensBtn');
  const btnHalf = document.getElementById('btnHalf');
  const btnMax = document.getElementById('btnMax');
  const swapBtn = document.getElementById('swapBtn');
  const mevToggleBtn = document.getElementById('mevToggleBtn');
  const mevStatusEl = document.getElementById('mevStatus');
  const mevIconEl = document.getElementById('mevIcon');
  const walletBtn = document.getElementById('walletBtn');
  const walletTextEl = document.getElementById('walletText');
  const toastEl = document.getElementById('toast');
  const toastMsgEl = document.getElementById('toastMsg');
  const shieldInfoBox = document.getElementById('shieldInfoBox');
  const routeLatencyEl = document.getElementById('routeLatency');

  // SVG Elements
  const svgInputSymbol = document.getElementById('svgInputSymbol');
  const svgOutputSymbol = document.getElementById('svgOutputSymbol');

  // AI Elements
  const aiIntentInput = document.getElementById('aiIntentInput');
  const aiSubmitBtn = document.getElementById('aiSubmitBtn');
  const chips = document.querySelectorAll('.ai-chips .chip');

  // Modals
  const caseStudyModal = document.getElementById('caseStudyModal');
  const openCaseStudyBtn = document.getElementById('openCaseStudyBtn');
  const closeCaseStudyBtn = document.getElementById('closeCaseStudyBtn');
  const closeCaseStudyInnerBtn = document.getElementById('closeCaseStudyInnerBtn');
  const tokenSelectModal = document.getElementById('tokenSelectModal');
  const closeTokenModalBtn = document.getElementById('closeTokenModalBtn');
  const tokenListContainer = document.getElementById('tokenListContainer');
  const tokenSearchInput = document.getElementById('tokenSearchInput');

  // --- Calculations & Updates ---
  function updateQuote() {
    const inToken = TOKENS[state.inputToken];
    const outToken = TOKENS[state.outputToken];
    const amount = parseFloat(inputAmountEl.value) || 0;

    state.inputAmount = amount;

    // Rate calculation
    const rate = inToken.price / outToken.price;
    const estOutput = amount * rate;
    const inUsd = amount * inToken.price;
    const outUsd = estOutput * outToken.price;

    // Output formatted
    if (outToken.symbol === 'BONK') {
      outputAmountEl.value = Math.floor(estOutput).toLocaleString();
    } else {
      outputAmountEl.value = estOutput > 0 ? estOutput.toFixed(estOutput < 1 ? 4 : 2) : '0.00';
    }

    // Balances
    inputBalanceEl.textContent = inToken.symbol === 'BONK' ? Math.floor(inToken.balance).toLocaleString() : inToken.balance.toFixed(2);
    outputBalanceEl.textContent = outToken.symbol === 'BONK' ? Math.floor(outToken.balance).toLocaleString() : outToken.balance.toFixed(2);

    // USD estimates
    inputUsdValEl.textContent = `≈ $${inUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    outputUsdValEl.textContent = `≈ $${outUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

    // Rate display
    if (outToken.symbol === 'BONK') {
      exchangeRateEl.textContent = `1 ${inToken.symbol} ≈ ${Math.round(rate).toLocaleString()} ${outToken.symbol}`;
    } else {
      exchangeRateEl.textContent = `1 ${inToken.symbol} ≈ ${rate.toFixed(rate < 1 ? 4 : 2)} ${outToken.symbol}`;
    }

    // Minimum received calculation based on slippage
    const slipFactor = typeof state.slippage === 'number' ? (100 - state.slippage) / 100 : 0.995;
    const minReceived = estOutput * slipFactor;
    if (outToken.symbol === 'BONK') {
      minReceivedValEl.textContent = `${Math.floor(minReceived).toLocaleString()} ${outToken.symbol}`;
    } else {
      minReceivedValEl.textContent = `${minReceived.toFixed(minReceived < 1 ? 4 : 2)} ${outToken.symbol}`;
    }

    // Price Impact simulation based on size
    const impact = amount > 100 ? (amount * 0.0003).toFixed(2) : '< 0.01%';
    priceImpactValEl.textContent = typeof impact === 'string' && impact.includes('%') ? impact : `${impact}%`;

    // Network fee calculation
    let feeSol = 0.00005;
    if (state.priorityFee === 'turbo') feeSol = 0.00055;
    if (state.priorityFee === 'ultra') feeSol = 0.0012;
    const feeUsd = (feeSol * TOKENS.SOL.price).toFixed(2);
    networkFeeValEl.textContent = `${feeSol} SOL (~$${feeUsd})`;

    // Update Token Badge Displays
    inputSymbolEl.textContent = inToken.symbol;
    outputSymbolEl.textContent = outToken.symbol;
    inputAvatarEl.textContent = inToken.avatar;
    inputAvatarEl.style.background = inToken.bg;
    inputAvatarEl.style.color = inToken.color;
    outputAvatarEl.textContent = outToken.avatar;
    outputAvatarEl.style.background = outToken.bg;
    outputAvatarEl.style.color = outToken.color;

    // SVG node text
    if (svgInputSymbol) svgInputSymbol.textContent = inToken.symbol;
    if (svgOutputSymbol) svgOutputSymbol.textContent = outToken.symbol;

    // Simulated latency variance
    const lat = Math.floor(28 + Math.random() * 18);
    if (routeLatencyEl) routeLatencyEl.textContent = `${lat}ms response`;
  }

  // --- Flip Tokens ---
  function flipTokens() {
    const temp = state.inputToken;
    state.inputToken = state.outputToken;
    state.outputToken = temp;
    
    // Animate flip button
    flipTokensBtn.style.transform = 'rotate(180deg) scale(1.15)';
    setTimeout(() => {
      flipTokensBtn.style.transform = '';
    }, 300);

    updateQuote();
    showToast(`Inverted pair: ${state.inputToken} ↔ ${state.outputToken}`);
  }

  // --- Toast System ---
  function showToast(message, duration = 3500) {
    toastMsgEl.textContent = message;
    toastEl.style.display = 'flex';
    setTimeout(() => {
      toastEl.style.display = 'none';
    }, duration);
  }

  // --- AI Intent Parsing Engine ---
  function parseAiIntent(rawText) {
    if (!rawText || !rawText.trim()) return;
    const text = rawText.toLowerCase().trim();

    // Look for numbers
    const numMatch = text.match(/(\d+(\.\d+)?)/);
    const amount = numMatch ? parseFloat(numMatch[0]) : null;

    // Detect Tokens
    const availableTokens = Object.keys(TOKENS);
    let matchedIn = null;
    let matchedOut = null;

    for (const sym of availableTokens) {
      const lowerSym = sym.toLowerCase();
      if (text.includes(lowerSym)) {
        if (!matchedIn) {
          matchedIn = sym;
        } else if (matchedIn !== sym && !matchedOut) {
          matchedOut = sym;
        }
      }
    }

    // Determine direction (e.g. "to", "into", "->")
    if (text.includes('to') || text.includes('into') || text.includes('->')) {
      const parts = text.split(/to|into|->/);
      if (parts.length >= 2) {
        for (const sym of availableTokens) {
          if (parts[0].toLowerCase().includes(sym.toLowerCase())) matchedIn = sym;
          if (parts[1].toLowerCase().includes(sym.toLowerCase())) matchedOut = sym;
        }
      }
    }

    if (matchedIn) state.inputToken = matchedIn;
    if (matchedOut && matchedOut !== matchedIn) state.outputToken = matchedOut;
    else if (state.inputToken === state.outputToken) {
      state.outputToken = state.inputToken === 'SOL' ? 'USDC' : 'SOL';
    }

    if (amount && amount > 0) {
      inputAmountEl.value = amount;
    }

    // Auto-detect MEV protection request
    if (text.includes('mev') || text.includes('sandwich') || text.includes('jito') || text.includes('protect')) {
      state.mevShield = true;
      updateMevUI();
    }

    // Dynamic slippage check
    if (text.includes('slippage') || text.includes('dynamic') || text.includes('tight')) {
      state.slippage = 'auto';
      updateSlippageUI();
    }

    updateQuote();
    showToast(`✦ AI Intent: ${inputAmountEl.value} ${state.inputToken} → ${state.outputToken} (Configured!)`);
    aiIntentInput.value = '';
  }

  function updateMevUI() {
    if (state.mevShield) {
      mevToggleBtn.classList.add('active');
      mevIconEl.textContent = '🛡️';
      mevStatusEl.textContent = 'Zero-MEV Shield: ON';
      shieldInfoBox.style.background = 'rgba(153, 69, 255, 0.08)';
      shieldInfoBox.style.borderColor = 'rgba(153, 69, 255, 0.25)';
      shieldInfoBox.innerHTML = `
        <div class="shield-badge-icon">🛡️</div>
        <div class="shield-text">
          <h4>Jito Private Mempool Bundle Active</h4>
          <p>Your swap bypasses public validator gossip. Sandwich bots and predatory searchers are neutralized before block submission.</p>
        </div>
      `;
    } else {
      mevToggleBtn.classList.remove('active');
      mevIconEl.textContent = '⚠️';
      mevStatusEl.textContent = 'MEV Shield: OFF';
      shieldInfoBox.style.background = 'rgba(239, 68, 68, 0.08)';
      shieldInfoBox.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      shieldInfoBox.innerHTML = `
        <div class="shield-badge-icon" style="color: var(--danger);">⚠️</div>
        <div class="shield-text">
          <h4 style="color: var(--danger);">Public Mempool Vulnerability Warning</h4>
          <p>Transaction broadcasted to public gossip. Sandwich bots can exploit slippage. Re-enable Zero-MEV Shield for guaranteed protection.</p>
        </div>
      `;
    }
  }

  function updateSlippageUI() {
    document.querySelectorAll('#slippagePills .pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.slip === String(state.slippage));
    });
  }

  // --- Token Selection Modal ---
  function openTokenModal(target) {
    state.selectingFor = target;
    tokenSearchInput.value = '';
    renderTokenList();
    tokenSelectModal.classList.add('open');
    tokenSearchInput.focus();
  }

  function closeTokenModal() {
    tokenSelectModal.classList.remove('open');
    state.selectingFor = null;
  }

  function renderTokenList(query = '') {
    tokenListContainer.innerHTML = '';
    const q = query.toLowerCase().trim();

    Object.values(TOKENS).forEach(token => {
      if (q && !token.symbol.toLowerCase().includes(q) && !token.name.toLowerCase().includes(q)) {
        return;
      }

      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.15s;
      `;
      item.addEventListener('mouseenter', () => item.style.background = 'rgba(153, 69, 255, 0.15)');
      item.addEventListener('mouseleave', () => item.style.background = 'rgba(255, 255, 255, 0.03)');

      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: ${token.bg}; display: flex; align-items: center; justify-content: center; font-weight: 700; color: ${token.color}; font-size: 0.85rem;">
            ${token.avatar}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${token.symbol}</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">${token.name}</div>
          </div>
        </div>
        <div style="text-align: right; font-family: var(--font-mono);">
          <div style="font-size: 0.85rem; font-weight: 600; color: #fff;">
            ${token.symbol === 'BONK' ? Math.floor(token.balance).toLocaleString() : token.balance.toFixed(2)}
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">$${token.price}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (state.selectingFor === 'input') {
          if (token.symbol === state.outputToken) {
            state.outputToken = state.inputToken;
          }
          state.inputToken = token.symbol;
        } else if (state.selectingFor === 'output') {
          if (token.symbol === state.inputToken) {
            state.inputToken = state.outputToken;
          }
          state.outputToken = token.symbol;
        }
        closeTokenModal();
        updateQuote();
        showToast(`Selected ${token.symbol} for ${state.selectingFor.toUpperCase()}`);
      });

      tokenListContainer.appendChild(item);
    });
  }

  // --- Simulated Swap Execution ---
  function executeSwap() {
    const amount = parseFloat(inputAmountEl.value);
    if (!amount || amount <= 0) {
      showToast('⚠️ Please enter a valid swap amount');
      return;
    }

    const inToken = TOKENS[state.inputToken];
    if (amount > inToken.balance) {
      showToast(`⚠️ Insufficient ${inToken.symbol} balance (${inToken.balance})`);
      return;
    }

    // Execution UI state
    swapBtn.disabled = true;
    swapBtn.style.background = 'rgba(153, 69, 255, 0.4)';
    const originalText = swapBtn.innerHTML;
    swapBtn.innerHTML = `
      <span class="pulse-dot" style="background:#fff; box-shadow: 0 0 10px #fff;"></span>
      <span>Simulating Jito MEV Bundle...</span>
    `;

    setTimeout(() => {
      swapBtn.innerHTML = `
        <span class="pulse-dot" style="background: var(--solana-mint);"></span>
        <span>Validating Slot #298,419,204...</span>
      `;
    }, 200);

    setTimeout(() => {
      // Calculate balances
      const outToken = TOKENS[state.outputToken];
      const rate = inToken.price / outToken.price;
      const received = amount * rate;

      inToken.balance -= amount;
      outToken.balance += received;

      // Reset button
      swapBtn.disabled = false;
      swapBtn.style.background = '';
      swapBtn.innerHTML = originalText;

      updateQuote();

      const txSig = (Math.random().toString(36).substring(2, 6) + '...' + Math.random().toString(36).substring(2, 6)).toUpperCase();
      showToast(`🎉 Swap Confirmed! Tx: ${txSig} | +${received.toFixed(received < 1 ? 4 : 2)} ${outToken.symbol} (0 MEV Loss)`, 4500);
    }, 600);
  }

  // --- Attach Event Listeners ---

  // Input changes
  inputAmountEl.addEventListener('input', updateQuote);

  // Quick Amount Buttons
  btnHalf.addEventListener('click', () => {
    const bal = TOKENS[state.inputToken].balance;
    inputAmountEl.value = (bal / 2).toFixed(4);
    updateQuote();
  });

  btnMax.addEventListener('click', () => {
    const bal = TOKENS[state.inputToken].balance;
    inputAmountEl.value = bal.toFixed(4);
    updateQuote();
  });

  // Flip Tokens
  flipTokensBtn.addEventListener('click', flipTokens);

  // Slippage Pills
  document.querySelectorAll('#slippagePills .pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#slippagePills .pill-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const val = e.target.dataset.slip;
      state.slippage = val === 'auto' ? 'auto' : parseFloat(val);
      updateQuote();
      showToast(`Slippage set to ${val === 'auto' ? 'Dynamic AI' : val + '%'}`);
    });
  });

  // Priority Fee Pills
  document.querySelectorAll('#priorityPills .pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#priorityPills .pill-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.priorityFee = e.target.dataset.fee;
      updateQuote();
      showToast(`Priority Fee: ${state.priorityFee.toUpperCase()}`);
    });
  });

  // MEV Shield Toggle
  mevToggleBtn.addEventListener('click', () => {
    state.mevShield = !state.mevShield;
    updateMevUI();
    showToast(state.mevShield ? '🛡️ Zero-MEV Shield Enabled (Jito Private Bundle)' : '⚠️ Zero-MEV Shield Disabled');
  });

  // Wallet Connect Toggle
  walletBtn.addEventListener('click', () => {
    state.isWalletConnected = !state.isWalletConnected;
    if (state.isWalletConnected) {
      walletTextEl.textContent = '7xKZ...9Wq1 ($5,704)';
      walletBtn.style.background = 'rgba(20, 241, 149, 0.2)';
      walletBtn.style.color = 'var(--solana-mint)';
      walletBtn.style.border = '1px solid var(--solana-mint)';
      showToast('🟢 Connected to Phantom (Solana Mainnet)');
    } else {
      walletTextEl.textContent = 'Connect Phantom';
      walletBtn.style.background = 'var(--solana-gradient)';
      walletBtn.style.color = '#080A10';
      walletBtn.style.border = 'none';
      showToast('Disconnected Wallet');
    }
  });

  // AI Intent Bar Input & Chips
  aiSubmitBtn.addEventListener('click', () => parseAiIntent(aiIntentInput.value));
  aiIntentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') parseAiIntent(aiIntentInput.value);
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const intent = chip.dataset.intent;
      aiIntentInput.value = intent;
      parseAiIntent(intent);
    });
  });

  // Token Select Modal Triggers
  document.getElementById('inputTokenBadge').addEventListener('click', () => openTokenModal('input'));
  document.getElementById('outputTokenBadge').addEventListener('click', () => openTokenModal('output'));
  closeTokenModalBtn.addEventListener('click', closeTokenModal);
  tokenSelectModal.addEventListener('click', (e) => {
    if (e.target === tokenSelectModal) closeTokenModal();
  });
  tokenSearchInput.addEventListener('input', (e) => renderTokenList(e.target.value));

  // Swap Action Button
  swapBtn.addEventListener('click', executeSwap);

  // Case Study Modal Triggers
  openCaseStudyBtn.addEventListener('click', () => caseStudyModal.classList.add('open'));
  closeCaseStudyBtn.addEventListener('click', () => caseStudyModal.classList.remove('open'));
  if (closeCaseStudyInnerBtn) {
    closeCaseStudyInnerBtn.addEventListener('click', () => caseStudyModal.classList.remove('open'));
  }
  caseStudyModal.addEventListener('click', (e) => {
    if (e.target === caseStudyModal) caseStudyModal.classList.remove('open');
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const tabName = e.target.dataset.tab;
      if (tabName !== 'swap') {
        showToast(`Switching to ${e.target.textContent} mode... (Horizon Engine ready)`);
      }
    });
  });

  // --- Initial Quote Calculation ---
  updateQuote();
  console.log('⚡ Jupiter Horizon Terminal initialized successfully.');
});
