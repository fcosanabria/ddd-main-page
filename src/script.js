import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Unix Boot Sequence Simulation
console.clear();
console.log("%c STARTING KERNEL...", "color: #00ff00; font-weight: bold; background: #000; padding: 2px;");
setTimeout(() => console.log("%c [ OK ] Mounted root file system.", "color: #bd00ff; background: #000;"), 500);
setTimeout(() => console.log("%c [ OK ] Started Session 666 of user root.", "color: #bd00ff; background: #000;"), 1200);
setTimeout(() => console.log("%c [WARN] CPU temperature above critical threshold: 999°C", "color: #ff00ff; background: #000; font-weight: bold;"), 2000);
setTimeout(() => console.log("%c [FAIL] Failed to start service: Reality.service", "color: #ff0000; background: #000; font-weight: bold;"), 2800);
setTimeout(() => console.log("%c [INFO] Entering void mode...", "color: #cccccc; background: #000;"), 3500);

// Setup
const container = document.getElementById('glitch-container');
const scene = new THREE.Scene();
// Fog to hide the void - Deep Void Purple
scene.fog = new THREE.FogExp2(0x050005, 0.08);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // Disable antialias for rougher look
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x050005, 0); // Transparent to let CSS background show through
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x200020); // Dark purple ambient
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xff00ff, 0.8); // Magenta Directional
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x8a2be2, 5, 50); // BlueViolet Point
pointLight.position.set(-2, 1, 2);
scene.add(pointLight);

// Cursed Object: Distorted Knot
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32); // Higher detail for jagged wireframe
// Use a shader material for more "creative coding" control over the surface
const material = new THREE.MeshStandardMaterial({
    color: 0x110011,
    emissive: 0xff0066, // Hot Pink Glow
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.9,
    wireframe: true
});

const cursedObj = new THREE.Mesh(geometry, material);
scene.add(cursedObj);

// Background particles/stars similar to "pixel sort" aesthetics
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3500; // More chaos
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 35; // Spread out wider
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xd800ff, // Bright Neon Purple
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 4;

// POST-PROCESSING
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom Pass for glow
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 1.0;
bloomPass.radius = 0.5;
composer.addPass(bloomPass);

// Glitch Pass
const glitchPass = new GlitchPass();
glitchPass.goWild = false; // Set to true for constant chaotic glitch
composer.addPass(glitchPass);

// RGB Shift Shader (Custom "Chromatic Aberration" on steroids)
const rgbShiftShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'amount': { value: 0.005 },
        'angle': { value: 0.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float amount;
        uniform float angle;
        varying vec2 vUv;

        void main() {
            vec2 offset = amount * vec2( cos(angle), sin(angle));
            vec4 cr = texture2D(tDiffuse, vUv + offset);
            vec4 cga = texture2D(tDiffuse, vUv);
            vec4 cb = texture2D(tDiffuse, vUv - offset);
            gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
        }
    `
};
const rgbShiftPass = new ShaderPass(rgbShiftShader);
composer.addPass(rgbShiftPass);

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Rotate main object - Erratic speed
    cursedObj.rotation.x += 0.005 + (Math.random() * 0.02);
    cursedObj.rotation.y += 0.01 + (Math.random() * 0.01);

    // Jitter position slightly for "nervous" feel
    cursedObj.position.x = (Math.random() - 0.5) * 0.02;
    cursedObj.position.y = (Math.random() - 0.5) * 0.02;

    // Animate lights
    pointLight.position.x = Math.sin(time) * 4;
    pointLight.position.y = Math.cos(time * 2.5) * 4;
    pointLight.intensity = 4 + Math.sin(time * 20) * 2; // Flickering light (strobe effect)

    // Animate Particles (Chaotic drift)
    particlesMesh.rotation.y = -time * 0.1;
    particlesMesh.rotation.x = Math.sin(time * 0.5) * 0.1;


    // Aggressive Glitch Logic
    if (Math.random() > 0.96) { // More frequent glitches
        glitchPass.curF = Math.random(); 
        cursedObj.scale.setScalar(0.8 + Math.random() * 0.5); // Random scale jump
    } else {
        cursedObj.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1); // Return to normal
    }

    // Interactive Response to Mouse (Subtle chase)
    targetRotation.x = (mouse.y * 0.001);
    targetRotation.y = (mouse.x * 0.001);
    
    // Smoothly interpolate rotation toward mouse
    cursedObj.rotation.x += 0.05 * (targetRotation.x - cursedObj.rotation.x);
    cursedObj.rotation.y += 0.05 * (targetRotation.y - cursedObj.rotation.y);

    // Pulse RGB shift - More intense
    rgbShiftPass.uniforms['amount'].value = 0.003 + Math.sin(time * 3) * 0.004 + (Math.random() > 0.9 ? 0.02 : 0.0) + (Math.abs(mouse.x)/windowHalfX * 0.01);
    rgbShiftPass.uniforms['angle'].value = time * 2; // Faster shift rotation

    composer.render();
}

// Window resize handling
window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Interactive Mouse Movement
const mouse = new THREE.Vector2();
const targetRotation = new THREE.Vector2();
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX - windowHalfX);
    mouse.y = (event.clientY - windowHalfY);
});

document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX - windowHalfX);
        mouse.y = (event.touches[0].clientY - windowHalfY);
    }
}, { passive: true });

animate();


// --- Terminal Logic ---
const terminalBody = document.getElementById('terminal-body');
const cmdInput = document.getElementById('cmd-input');
const cmdDisplay = document.getElementById('cmd-display');
const terminalOutput = document.getElementById('terminal-output');

// File System Simulation
const fileSystem = {
    "home": {
        "fcosanabria": {
            "projects": {
               "glitch_renderer": "type: active\nstatus: unstable",
               "void_kernel": "kernel panic imminent"
            },
            "thoughts.txt": "The pixels are bleeding.",
            "secrets": {
               "dont_open": "You warned you.",
               "payload.sh": "#!/bin/bash\nrm -rf /universe"
            },
            "todo.md": "- Disrupt reality\n- Feed the void\n- Sleep (optional)"
        }
    },
    "var": {
        "log": {
             "auth.log": "Invalid password for user 'god'.\nSession terminated by signal 666."
        }
    },
    "etc": {
        "shadow": "root:$6$VOID$SALT:19000:0:99999:7:::\nghost:!:19000:0:99999:7:::",
        "hosts": "127.0.0.1 localhost\n::1 ip6-localhost\n666.666.666.666 hell"
    },
    "mnt": {
        "soul": "Device not found."
    },
    "dev": {
        "null": "",
        "random": "4" // xkcd reference
    }
};

let currentPath = ['home', 'fcosanabria'];

function getDir(path) {
    let current = fileSystem;
    for (const part of path) {
        if (current[part] && typeof current[part] === 'object' && !('substring' in current[part])) {
            current = current[part];
        } else {
            return null;
        }
    }
    return current;
}

function resolvePath(args) {
    if (!args || args === '~') return ['home', 'fcosanabria'];
    if (args === '/') return [];
    
    let parts = args.split('/').filter(p => p && p !== '.');
    let newPath = args.startsWith('/') ? [] : [...currentPath];
    
    for (const part of parts) {
        if (part === '..') {
            if (newPath.length > 0) newPath.pop();
        } else {
            newPath.push(part);
        }
    }
    return newPath;
}

const promptEl = document.querySelector('.input-line .prompt');
function updatePrompt() {
    const pathStr = currentPath.length === 0 ? '/' : (currentPath.join('/') === 'home/fcosanabria' ? '~' : '/' + currentPath.join('/'));
    if (promptEl) promptEl.textContent = `root@ddd:${pathStr}#`;
}

const commands = {
    help: "AVAILABLE COMMANDS:<br> - <span style='color:#bd00ff'>about</span>: System information<br> - <span style='color:#bd00ff'>whoami</span>: Identify current user<br> - <span style='color:#bd00ff'>socials</span>: Network connections<br> - <span style='color:#bd00ff'>projects</span>: List active operations<br> - <span style='color:#bd00ff'>clear</span>: Clear terminal output",
    whoami: "uid=0(root) gid=0(root) groups=0(root) // SRE_ENGINEER // CLOUD_ENGINEER",
    socials: ">> GitHub: <a href='https://github.com/fcosanabria' target='_blank' style='color:#fff'>@fcosanabria</a><br>>> LinkedIn: <a href='#' style='color:#fff'>/in/fcosanabria</a>",
    about: "Digital Death Disrupt v6.6.6<br>Specialized in cloud engineering and architecture, digital disruption and chaos.<br>Running on custom Linux kernel 6.6.16-void.",
    projects: "SCANNING OPERATIONS...<br>>> [ACTIVE] Project: Glitch_Renderer<br>>> [STABLE] Project: Void_Kernel<br>>> [ERROR] Project: Human_Emotion_Module (Failed to load)",
};

if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
        cmdDisplay.textContent = e.target.value;
    });

    cmdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCommand = cmdInput.value;
            const parts = rawCommand.trim().split(/\s+/);
            const command = parts[0].toLowerCase();
            const args = parts[1];
            
            // Generate Prompt String
            const pathStr = currentPath.length === 0 ? '/' : (currentPath.join('/') === 'home/fcosanabria' ? '~' : '/' + currentPath.join('/'));
            
            // Add command line to history
            const cmdLine = document.createElement('div');
            cmdLine.innerHTML = `<span class="prompt">root@ddd:${pathStr}#</span> ${rawCommand}`;
            terminalOutput.appendChild(cmdLine);
            
            if (command) {
                let outputHtml = '';
                
                // Security / Mockery Check for "Hacker" attempts
                const suspicious = [
                    'rm', 'chmod', 'chown', 'mv', 'cp', 'wget', 'curl', 'python', 'perl', 'php', 'node', 'deno', 'ruby', 'gcc', 'make',
                    'grep', 'awk', 'sed', 'dd', 'fdisk', 'mount', 'umount', 'passwd', 'su', 'kill', 'killall', 'pkill', 'top', 'htop',
                    'nmap', 'sqlmap', 'nikto', 'metasploit', 'aircrack-ng', 'wireshark', 'tcpdump', 'netcat', 'nc', 'telnet', 'ssh', 'ftp'
                ];
                const injectionPattern = /<script>|alert\(|eval\(|document\.|window\.|fetch\(|XMLHttpRequest|iframe|object|embed|drop\s+table|union\s+select|OR\s+1=1|;|\$\(|`|\||&/i;

                if (suspicious.includes(command) || (command === 'sudo') || injectionPattern.test(rawCommand)) {
                     const mocks = [
                        "Nice try, script kiddie.",
                        "Permission denied: Your soul does not have root access.",
                        "I see what you're doing.",
                        "Are you trying to hack a static site? Cute.",
                        "Forbidden: You are not authorized to exist here... anymore.",
                     ];
                     outputHtml = `<span style="color: #ff3333; text-shadow: 2px 0 #bd00ff; font-family: 'Courier New', monospace;">[SECURITY_PROTOCOL_ENGAGED]</span> ${mocks[Math.floor(Math.random() * mocks.length)]}</span>`;
                } else if (command === 'clear') {
                    terminalOutput.innerHTML = '';
                } else if (commands[command]) {
                     outputHtml = commands[command];
                } else if (command === 'ls') {
                    const dir = getDir(currentPath);
                    if (dir) {
                        outputHtml = Object.keys(dir).map(k => {
                            const isDir = typeof dir[k] === 'object' && !('substring' in dir[k]);
                            return `<span style="color: ${isDir ? '#bd00ff' : '#ccc'}">${k}${isDir ? '/' : ''}</span>`;
                        }).join('&nbsp;&nbsp;');
                    } else {
                        outputHtml = `ls: cannot access '${pathStr}': No such file or directory`;
                    }
                } else if (command === 'pwd') {
                    outputHtml = '/' + currentPath.join('/');
                } else if (command === 'cd') {
                     const targetPath = resolvePath(args);
                     const targetDir = getDir(targetPath);
                     if (targetDir) {
                         currentPath = targetPath;
                         updatePrompt();
                     } else {
                         outputHtml = `bash: cd: ${args}: No such file or directory`;
                     }
                } else if (command === 'cat') {
                     if (!args) {
                         outputHtml = 'Usage: cat [filename]';
                     } else {
                         const dir = getDir(currentPath);
                         if (dir && dir[args]) {
                             if (typeof dir[args] === 'string') {
                                 outputHtml = dir[args].replace(/\n/g, '<br>');
                             } else {
                                 outputHtml = `cat: ${args}: Is a directory`;
                             }
                         } else {
                             outputHtml = `cat: ${args}: No such file or directory`;
                         }
                     }
                } else if (command === 'echo') {
                    outputHtml = parts.slice(1).join(' ');
                } else {
                    const error = document.createElement('div');
                    error.className = 'output error';
                    error.style.color = '#ff0000';
                    error.textContent = `bash: ${command}: command not found`;
                    terminalOutput.appendChild(error);
                }

                if (outputHtml) {
                    const output = document.createElement('div');
                    output.className = 'output';
                    output.innerHTML = outputHtml;
                    output.style.marginBottom = '10px';
                    output.style.color = '#ccc';
                    terminalOutput.appendChild(output);
                }
            }
            
            cmdInput.value = '';
            cmdDisplay.textContent = '';
            // Auto scroll
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    // Keep focus
    terminalBody.addEventListener('click', () => {
        cmdInput.focus();
    });
    terminalBody.addEventListener('touchend', (e) => {
        e.preventDefault();
        cmdInput.focus();
    });
    // Initial focus
    cmdInput.focus();
}

// --- GUI TOGGLE LOGIC ---
const guiToggle = document.getElementById('gui-toggle');
const guiOverlay = document.getElementById('gui-overlay');
const guiClose = document.getElementById('gui-close');
const cmdInputRef = document.getElementById('cmd-input');

if (guiToggle && guiOverlay && guiClose) {
    guiToggle.addEventListener('click', () => {
        guiOverlay.classList.remove('hidden');
        if (cmdInputRef) cmdInputRef.blur();
    });

    guiClose.addEventListener('click', () => {
        guiOverlay.classList.add('hidden');
        if (cmdInputRef) cmdInputRef.focus();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !guiOverlay.classList.contains('hidden')) {
            guiOverlay.classList.add('hidden');
            if (cmdInputRef) cmdInputRef.focus();
        }
    });
}
