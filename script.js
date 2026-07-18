const terminalBody = document.getElementById('terminal-body');
const terminalInput = document.getElementById('terminal-input');
const terminalInputLine = document.getElementById('terminal-input-line');
const connectBtn = document.getElementById('connect-btn');
const statusTag = document.getElementById('status-tag');

// ---- Particle Neural Network Background ----
(function initParticleNetwork() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const PARTICLE_COUNT = isMobile ? 45 : 100;
    const MAX_DIST = isMobile ? 120 : 160;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
    }

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(249, 115, 22, 0.9)';
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(249, 115, 22, ${0.35 * (1 - dist / MAX_DIST)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST * 1.3) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(249, 115, 22, ${0.25 * (1 - dist / (MAX_DIST * 1.3))})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }
    draw();
})();

// ---- Scroll Reveal via IntersectionObserver ----
(function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    targets.forEach(t => observer.observe(t));
})();

// ---- Typewriter effect on hero headline ----
(function initTypewriter() {
    const el = document.getElementById('typed-line');
    if (!el) return;
    const fullText = el.innerText;
    el.innerText = '';
    let i = 0;
    function type() {
        if (i <= fullText.length) {
            el.innerText = fullText.slice(0, i);
            i++;
            setTimeout(type, 60);
        }
    }
    type();
})();

// Copy contract address to clipboard
function copyCA() {
    const caValue = document.getElementById('ca-value');
    const caBtn = document.getElementById('ca-copy-btn');
    if (!caValue || !caBtn) return;

    navigator.clipboard.writeText(caValue.innerText).then(() => {
        const original = caBtn.innerText;
        caBtn.innerText = 'COPIED';
        caBtn.classList.add('copied');
        setTimeout(() => {
            caBtn.innerText = original;
            caBtn.classList.remove('copied');
        }, 1500);
    }).catch(() => {
        caBtn.innerText = 'FAILED';
    });
}

// FAQ accordion toggle (single-open behavior)
function toggleFaq(item) {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
    if (!isOpen) {
        item.classList.add('open');
    }
}

// Scroll-to-top button visibility
const scrollTopBtn = document.getElementById('scroll-top-btn');
window.addEventListener('scroll', () => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Network HUD Randomizers for realistic industrial feel
setInterval(() => {
    // Latency variation
    const latencyVal = document.getElementById('hud-latency');
    if (latencyVal) {
        const current = parseFloat(latencyVal.innerText);
        const diff = (Math.random() - 0.5) * 2;
        latencyVal.innerText = Math.max(8.0, Math.min(20.0, current + diff)).toFixed(1) + 'ms';
    }

    // Node count fluctuation
    const nodeVal = document.getElementById('hud-nodes');
    if (nodeVal) {
        const active = Math.floor(140 + Math.random() * 8);
        nodeVal.innerText = `${active} / 150`;
    }
}, 3000);

// Connect operator wallet simulation
if (connectBtn) {
    connectBtn.addEventListener('click', () => {
        if (connectBtn.innerText === 'CONNECT_OPERATOR') {
            connectBtn.innerText = '0xWans...Node';
            statusTag.innerText = 'NODE_01_AUTHORIZED';
            statusTag.parentElement.style.borderColor = '#f97316';
            writeLine('>>> Dynamic operator handshake initiated.');
            writeLine('>>> Signature validated. Node status: AUTHORIZED.');
        } else {
            connectBtn.innerText = 'CONNECT_OPERATOR';
            statusTag.innerText = 'NODE_01_ONLINE';
            statusTag.parentElement.style.borderColor = '#1a1a1e';
            writeLine('>>> Operator session terminated.');
        }
    });
}

// ---- Command Registry ----
// Each command: { desc, run(args) }. run() returns array of {text, type} lines or void.
const COMMANDS = {
    help: {
        desc: 'List all available commands',
        run: () => {
            const out = [{ text: 'IRONHOOD CORE :: COMMAND REFERENCE', type: 'success' }];
            Object.keys(COMMANDS).sort().forEach(name => {
                out.push({ text: `  ${name.padEnd(12)} ${COMMANDS[name].desc}` });
            });
            out.push({ text: "Tip: use ↑/↓ for history, Tab to autocomplete." });
            return out;
        }
    },
    status: {
        desc: 'Show hardware state parameters',
        run: () => [
            { text: 'SYSTEM STATE READOUT:', type: 'success' },
            { text: `- Core Temperature: ${(40 + Math.random() * 5).toFixed(1)}°C (Nominal)` },
            { text: '- Failsafe State: UNARMED (Ready)' },
            { text: `- Uptime: ${Math.floor(100 + Math.random() * 800)}h ${Math.floor(Math.random()*60)}m` },
            { text: '- Buffer Status: CLEAR' }
        ]
    },
    nodes: {
        desc: 'Query active edge nodes on the network',
        run: () => [
            { text: 'SCANNING EDGE MESH...', type: 'warning' },
            { text: 'Node_01_US_East   0x3746...99C   ACTIVE   8ms', type: 'success' },
            { text: 'Node_02_EU_West   0x8Ff9...96b   ACTIVE   14ms', type: 'success' },
            { text: 'Node_03_AS_South  0x2FA7...3F3   STANDBY  --', type: 'warning' },
            { text: 'Node_04_SA_East   0x43E7...7aF   ACTIVE   22ms', type: 'success' },
            { text: '4 nodes found (3 active, 1 standby)' }
        ]
    },
    price: {
        desc: 'Fetch current $IRONHOOD market data',
        run: () => {
            const price = (0.0008 + Math.random() * 0.0004).toFixed(6);
            const chg = (Math.random() * 60 - 20).toFixed(2);
            const chgType = parseFloat(chg) >= 0 ? 'success' : 'error';
            return [
                { text: 'QUERYING ROBINHOOD VIRTUALS ORACLE...', type: 'warning' },
                { text: `$IRONHOOD  ::  $${price}` },
                { text: `24h Change ::  ${chg >= 0 ? '+' : ''}${chg}%`, type: chgType },
                { text: `Market Cap ::  $${(Math.random() * 3 + 1).toFixed(2)}M` },
                { text: 'Note: simulated feed. Live data at launch.' }
            ];
        }
    },
    buy: {
        desc: 'Open acquisition portal for $IRONHOOD',
        run: () => {
            setTimeout(() => window.open('https://app.virtuals.io', '_blank'), 600);
            return [
                { text: 'INITIATING ACQUISITION SEQUENCE...', type: 'warning' },
                { text: 'Redirecting to Robinhood Virtuals bonding curve...', type: 'success' }
            ];
        }
    },
    stake: {
        desc: 'Simulate node operator staking',
        run: (args) => {
            const amt = args[0] ? parseFloat(args[0]) : null;
            if (!amt || isNaN(amt)) {
                return [{ text: 'Usage: stake <amount>   e.g. stake 50000', type: 'warning' }];
            }
            return [
                { text: `Staking ${amt.toLocaleString()} $IRONHOOD...`, type: 'warning' },
                { text: '[OK] Stake locked. Node slot reserved.', type: 'success' },
                { text: `Estimated APY: ${(18 + Math.random() * 22).toFixed(1)}%`, type: 'success' },
                { text: 'Your node enters the handshake queue.' }
            ];
        }
    },
    ca: {
        desc: 'Print the contract address',
        run: () => [
            { text: 'CONTRACT ADDRESS ($IRONHOOD):' },
            { text: '0x0000000000000000000000000000000000000000', type: 'success' },
            { text: 'Placeholder — live address published at launch.' }
        ]
    },
    roadmap: {
        desc: 'Show deployment sequence',
        run: () => [
            { text: 'DEPLOYMENT SEQUENCE:', type: 'success' },
            { text: '[x] PHASE_01  Genesis Forge      COMPLETE', type: 'success' },
            { text: '[/] PHASE_02  Node Expansion     IN_PROGRESS', type: 'warning' },
            { text: '[ ] PHASE_03  Physical Bridge    QUEUED' },
            { text: '[ ] PHASE_04  Autonomous Fleet   QUEUED' }
        ]
    },
    tokenomics: {
        desc: 'Display token distribution',
        run: () => [
            { text: 'TOKEN DISTRIBUTION (1,000,000,000 $IRONHOOD):' },
            { text: '  60%  Bonding Curve   (Fair Launch)', type: 'success' },
            { text: '  20%  Node Rewards    (Active Operators)', type: 'success' },
            { text: '  20%  Treasury        (R&D and Forge)', type: 'success' }
        ]
    },
    socials: {
        desc: 'List official channels',
        run: () => [
            { text: 'OFFICIAL CHANNELS:' },
            { text: '  X/Twitter :: x.com' },
            { text: '  Telegram  :: t.me' },
            { text: '  Virtuals  :: app.virtuals.io' },
            { text: '  GitHub    :: github.com/Ridwan2809/ironcore-site' }
        ]
    },
    whoami: {
        desc: 'Identify current operator session',
        run: () => {
            const authed = connectBtn && connectBtn.innerText !== 'CONNECT_OPERATOR';
            return authed
                ? [{ text: 'operator: 0xWans...Node (AUTHORIZED)', type: 'success' }]
                : [{ text: 'guest (unauthenticated) — click CONNECT_OPERATOR to sign in', type: 'warning' }];
        }
    },
    ping: {
        desc: 'Ping the core node',
        run: () => [
            { text: 'PING node_01 ...', type: 'warning' },
            { text: `64 bytes: icmp_seq=1 time=${(6 + Math.random() * 4).toFixed(1)}ms`, type: 'success' },
            { text: `64 bytes: icmp_seq=2 time=${(6 + Math.random() * 4).toFixed(1)}ms`, type: 'success' },
            { text: 'PONG. Core is alive.', type: 'success' }
        ]
    },
    gm: {
        desc: 'Greet the network',
        run: () => [{ text: 'gm operator. The forge never sleeps.', type: 'success' }]
    },
    banner: {
        desc: 'Print the IRONHOOD banner',
        run: () => [
            { text: ' ___ ____   ___  _   _ _   _  ___   ___  ____  ', type: 'success' },
            { text: '|_ _|  _ \\ / _ \\| \\ | | | | |/ _ \\ / _ \\|  _ \\ ', type: 'success' },
            { text: ' | || |_) | | | |  \\| | |_| | | | | | | | | | |', type: 'success' },
            { text: ' | ||  _ <| |_| | |\\  |  _  | |_| | |_| | |_| |', type: 'success' },
            { text: '|___|_| \\_\\\\___/|_| \\_|_| |_|\\___/ \\___/|____/ ', type: 'success' },
            { text: 'ON-CHAIN INDUSTRIAL AI ROBOTICS' }
        ]
    },
    echo: {
        desc: 'Echo back your input',
        run: (args) => [{ text: args.join(' ') || '' }]
    },
    date: {
        desc: 'Show current system time',
        run: () => [{ text: new Date().toString() }]
    },
    clear: {
        desc: 'Clear the terminal screen',
        run: () => 'CLEAR'
    }
};

// Quick action buttons (header)
function runCommand(cmd) {
    processCLI(cmd);
    if (terminalInput) terminalInput.focus();
}

// ---- Command history state ----
let cmdHistory = [];
let historyIndex = -1;

// Terminal CLI Input handler
if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCmd = terminalInput.value.trim();
            terminalInput.value = '';
            if (rawCmd) {
                cmdHistory.push(rawCmd);
                historyIndex = cmdHistory.length;
                processCLI(rawCmd);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length && historyIndex > 0) {
                historyIndex--;
                terminalInput.value = cmdHistory[historyIndex];
                moveCursorEnd();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < cmdHistory.length - 1) {
                historyIndex++;
                terminalInput.value = cmdHistory[historyIndex];
            } else {
                historyIndex = cmdHistory.length;
                terminalInput.value = '';
            }
            moveCursorEnd();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const partial = terminalInput.value.trim().toLowerCase();
            if (partial) {
                const match = Object.keys(COMMANDS).find(c => c.startsWith(partial));
                if (match) terminalInput.value = match;
            }
        }
    });
    // Keep focus when clicking anywhere in the terminal body
    if (terminalBody) {
        terminalBody.addEventListener('click', () => terminalInput.focus());
    }
}

function moveCursorEnd() {
    setTimeout(() => {
        terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
    }, 0);
}

function processCLI(cmdStr) {
    writeCommand(cmdStr);
    const parts = cmdStr.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const entry = COMMANDS[cmd];
    if (!entry) {
        writeLine(`bash: command not found: ${cmd}`, 'error');
        writeLine("Type 'help' to list available commands.", 'warning');
        return;
    }

    const result = entry.run(args);
    if (result === 'CLEAR') {
        const lines = terminalBody.querySelectorAll('.term-line');
        lines.forEach(line => {
            if (line !== terminalInputLine) line.remove();
        });
        return;
    }
    if (Array.isArray(result)) {
        result.forEach(line => writeLine(line.text, line.type || ''));
    }
}

function writeCommand(text) {
    const p = document.createElement('p');
    p.className = 'term-line';
    p.innerHTML = `<span class="prompt">ironhood@node_01:~$</span> ${text}`;
    terminalBody.insertBefore(p, terminalInputLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function writeLine(text, type = '') {
    const p = document.createElement('p');
    p.className = 'term-line ' + type;
    p.innerText = text;
    terminalBody.insertBefore(p, terminalInputLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}
