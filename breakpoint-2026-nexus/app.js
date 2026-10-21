/**
 * Solana Breakpoint 2026 — German Builders' Nexus Engine
 * Built for Superteam Germany Travel Boost Bounty
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Breakpoint 2026 Countdown Engine ---
  // Target: Breakpoint 2026 (December 10, 2026)
  const targetDate = new Date('2026-12-10T09:00:00Z').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMinutes').textContent = '00';
      document.getElementById('cdSeconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // --- 2. Interactive Breakpoint Tracks Data ---
  const TRACKS = {
    firedancer: {
      title: 'Firedancer & Extreme Throughput',
      subtitle: 'The 1,000,000 TPS Validator Revolution',
      description: 'Firedancer, developed in pure C++ by Jump Crypto, rewrites validator hardware efficiency from the silicon up. Explore live testnet benchmarks, memory-mapped message queues, and why German engineers are obsessing over zero-copy validator pipelines.',
      features: [
        'Pure C/C++ architecture bypassing OS kernel bottlenecks',
        'SIMD vectorized Ed25519 signature batch verification',
        'Hardware-level throughput benchmark exceeding 1M TPS in lab tests',
        'Client diversity ensuring unstoppable network decentralization'
      ],
      metricLabel: 'Theoretical Peak',
      metricValue: '1,000,000+ TPS',
      metricColor: '#14F195'
    },
    ai: {
      title: 'Autonomous AI Agent Economy',
      subtitle: 'Where Large Language Models Trade at 400ms Finality',
      description: 'Autonomous AI agents need an instant, sub-cent financial rail. On Solana, AI models purchase API calls, pay for decentralized compute, and execute automated arbitrage loops without human intervention.',
      features: [
        'Sub-cent transaction fees enabling machine-to-machine micro-payments',
        'Verifiable agentic wallets executing prompt-driven DeFi workflows',
        'Decentralized model inference markets settled in real-time',
        'Integration with Solana Blinks and Actions for one-click viral execution'
      ],
      metricLabel: 'Average Tx Cost',
      metricValue: '< $0.0005',
      metricColor: '#9945FF'
    },
    depin: {
      title: 'DePIN & Real-World Infrastructure',
      subtitle: 'Turning Physical Hardware into Liquid On-Chain Networks',
      description: 'Decentralized Physical Infrastructure Networks (DePIN) thrive on Solana because high write throughput and state compression enable tracking millions of physical sensors, 5G antennas, and dashcams worldwide.',
      features: [
        'Helium decentralized 5G & IoT coverage across European capitals',
        'Hivemapper crowd-sourced real-time global road mapping',
        'Render distributed high-end GPU rendering network',
        'State compression allowing millions of physical node updates for dollars'
      ],
      metricLabel: 'Active DePIN Nodes',
      metricValue: '2.4M+ Devices',
      metricColor: '#00C2FF'
    },
    usdg: {
      title: 'Institutional USDG & Enterprise FinTech',
      subtitle: 'Regulated Global Dollar Settlement on Solana',
      description: 'With Paxos, Robinhood, Kraken, and Galaxy launching USDG—the compliant Global Dollar—Solana has become the preferred highway for institutional liquidity and international treasury settlement.',
      features: [
        'Fully compliant 1:1 USD-backed institutional stablecoin standard',
        'Sub-second cross-border settlement for multinational corporations',
        'Token Extensions enabling automated compliance, transfer hooks & confidential transfers',
        'Seamless integration with European banking gateways and BaFin standards'
      ],
      metricLabel: 'Settlement Latency',
      metricValue: '~390ms Finality',
      metricColor: '#FFD700'
    }
  };

  const trackContentEl = document.getElementById('trackContent');
  const trackTabBtns = document.querySelectorAll('.track-tab-btn');

  function renderTrack(trackKey) {
    const t = TRACKS[trackKey];
    if (!t) return;

    trackContentEl.innerHTML = `
      <div class="track-detail">
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--solana-purple); font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem;">
          ${t.subtitle}
        </div>
        <h3>${t.title}</h3>
        <p>${t.description}</p>
        <ul class="track-features">
          ${t.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <a href="https://luma.com/breakpoint2026?tk=HYnlfc" target="_blank" rel="noopener noreferrer" class="nav-cta-btn" style="padding: 0.6rem 1.25rem; font-size: 0.85rem;">
          <span>Attend this track at Breakpoint 2026</span>
          <span>→</span>
        </a>
      </div>
      <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 2rem; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
          ${t.metricLabel}
        </div>
        <div style="font-size: 2.4rem; font-weight: 900; font-family: var(--font-mono); color: ${t.metricColor}; text-shadow: 0 0 25px ${t.metricColor}44; margin-bottom: 1rem;">
          ${t.metricValue}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-dim); line-height: 1.5;">
          Featured at Breakpoint Mainstage &amp; Superteam Germany Workshops
        </div>
      </div>
    `;
  }

  trackTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      trackTabBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const track = e.target.dataset.track;
      renderTrack(track);
    });
  });

  // Initial Track Render
  renderTrack('firedancer');

  // --- 3. Community Poll Voting Engine ---
  const pollVotes = {
    firedancer: 1482,
    superteam: 1210,
    'ai-agents': 974,
    founders: 856
  };

  const pollOptions = document.querySelectorAll('.poll-option');
  pollOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const key = opt.dataset.option;
      if (pollVotes[key] !== undefined) {
        pollVotes[key] += 1;
        const voteEl = document.getElementById(`votes-${key}`);
        if (voteEl) {
          voteEl.textContent = `${pollVotes[key].toLocaleString()} Votes`;
          voteEl.style.color = '#FFD700';
        }
        opt.style.borderColor = 'var(--solana-mint)';
        opt.style.background = 'rgba(20, 241, 149, 0.15)';
        
        // Show temporary notification
        alertVote(`Danke! Your vote for ${key.toUpperCase()} is recorded. See you at Breakpoint 2026!`);
      }
    });
  });

  function alertVote(msg) {
    let toast = document.getElementById('voteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'voteToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #10B981;
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        font-weight: 700;
        font-size: 0.85rem;
        z-index: 1000;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3500);
  }

  console.log('⚡ Breakpoint 2026 German Builders Nexus initialized.');
});
