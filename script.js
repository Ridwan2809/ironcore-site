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
    const PARTICLE_COUNT = 110;
    const MAX_DIST = 160;

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
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(249, 115, 22, 0.85)';
            ctx.shadowColor = 'rgba(249, 115, 22, 0.8)';
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
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

// Quick action buttons
function runCommand(cmd) {
    if (cmd === 'status') {
        writeCommand('check_system');
        writeLine('SYSTEM INITIALIZATION DETAILS:');
        writeLine('- Core Temperature: 42.4°C (Nominal)');
        writeLine('- Failsafe State: UNARMED (Ready)');
        writeLine('- Buffer Status: CLEAR');
    } else if (cmd === 'nodes') {
        writeCommand('list_edge_nodes');
        writeLine('LOCATING LOCAL INSTANCES...');
        writeLine('Node_01_US_East: 0x3746...99C - ACTIVE');
        writeLine('Node_02_EU_West: 0x8Ff9...96b - ACTIVE');
        writeLine('Node_03_AS_South: 0x2FA7...3F3 - STANDBY');
    } else if (cmd === 'help') {
        writeCommand('help');
        writeLine('AVAILABLE CORE COMMANDS:');
        writeLine('  status   - Outputs hardware state parameters');
        writeLine('  nodes    - Query active edge node network addresses');
        writeLine('  clear    - Flush terminal console memory');
    }
}

// Terminal CLI Input handler
if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCmd = terminalInput.value.trim();
            terminalInput.value = '';
            
            if (rawCmd) {
                processCLI(rawCmd);
            }
        }
    });
}

function processCLI(cmdStr) {
    writeCommand(cmdStr);
    const cmd = cmdStr.toLowerCase().split(' ')[0];
    
    switch (cmd) {
        case 'help':
            writeLine('AVAILABLE CORE COMMANDS: help, status, nodes, clear');
            break;
        case 'status':
            writeLine('SYSTEM INITIALIZATION DETAILS:');
            writeLine('- Core Temperature: 42.4°C (Nominal)');
            writeLine('- Failsafe State: UNARMED (Ready)');
            break;
        case 'nodes':
            writeLine('LOCATING LOCAL INSTANCES...');
            writeLine('Node_01_US_East: 0x3746...99C - ACTIVE');
            writeLine('Node_02_EU_West: 0x8Ff9...96b - ACTIVE');
            break;
        case 'clear':
            // Clear all lines except input line
            const lines = terminalBody.querySelectorAll('.term-line');
            lines.forEach(line => {
                if (line !== terminalInputLine) {
                    line.remove();
                }
            });
            break;
        default:
            writeLine(`bash: command not found: ${cmdStr}`, 'error');
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
