window.addEventListener('load', () => {
    tsParticles.load("particles-js", {
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "repulse" },
                resize: true,
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
            },
        },
        particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.2, width: 1 },
            collisions: { enable: false },
            move: { direction: "none", enable: true, outModes: "out", random: false, speed: 1, straight: false },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
        },
        detectRetina: true,
    });
});

async function fetchAllPluginStats() {
    const plugins = {
        rtpzone: { slug: 'rtpzone', bstatsId: '27505' },
        turulpowerx: { slug: 'turulpowerx', bstatsId: '27633' },
        turulduel: { slug: 'turulduel', bstatsId: '27474' }
    };

    for (const [id, config] of Object.entries(plugins)) {
        try {
            const modrinthResponse = await fetch(`https://api.modrinth.com/v2/project/${config.slug}`);
            if (!modrinthResponse.ok) throw new Error('Modrinth API error');
            const data = await modrinthResponse.json();
            document.getElementById(`${id}-downloads`).innerHTML = `<i class="fas fa-download"></i> ${data.downloads.toLocaleString()} Downloads`;
        } catch (error) {
            console.error(`Modrinth fetch error for ${id}:`, error);
            document.getElementById(`${id}-downloads`).innerHTML = `<i class="fas fa-download"></i> N/A`;
        }

        try {
            const serversResponse = await fetch(`https://bstats.org/api/v1/plugins/${config.bstatsId}/charts/servers/data`);
            const serversData = await serversResponse.json();
            const serverCount = serversData.pop()[1];
            document.getElementById(`${id}-servers`).innerHTML = `<i class="fas fa-server"></i> ${serverCount.toLocaleString()}+ Servers`;
            
            const playersResponse = await fetch(`https://bstats.org/api/v1/plugins/${config.bstatsId}/charts/players/data`);
            const playersData = await playersResponse.json();
            const playerCount = playersData.pop()[1];
            document.getElementById(`${id}-players`).innerHTML = `<i class="fas fa-users"></i> ${playerCount.toLocaleString()}+ Players`;

        } catch (error)
        {
            console.error(`bStats fetch error for ${id}:`, error);
            document.getElementById(`${id}-servers`).innerHTML = `<i class="fas fa-server"></i> N/A`;
            document.getElementById(`${id}-players`).innerHTML = `<i class="fas fa-users"></i> N/A`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(30, 30, 46, 0.95)';
        } else {
            header.style.backgroundColor = 'rgba(30, 30, 46, 0.8)';
        }
    });

    fetchAllPluginStats();

    console.log("Remag Studio website loaded with inline bStats.");
});