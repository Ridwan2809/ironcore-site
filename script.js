const terminalBody = document.getElementById('terminal-body');
const terminalInput = document.getElementById('terminal-input');
const terminalInputLine = document.getElementById('terminal-input-line');
const connectBtn = document.getElementById('connect-btn');
const statusTag = document.getElementById('status-tag');

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
