document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuButton = document.getElementById('menu-button');
    const mainNav = document.getElementById('main-nav');

    if (menuButton && mainNav) {
        menuButton.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            const icon = menuButton.querySelector('i');
            if (mainNav.classList.contains('nav-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('nav-open')) {
                    mainNav.classList.remove('nav-open');
                    menuButton.setAttribute('aria-expanded', 'false');
                    const icon = menuButton.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

         document.addEventListener('click', (event) => {
             if (mainNav.classList.contains('nav-open') &&
                 !mainNav.contains(event.target) &&
                 !menuButton.contains(event.target)) {
                     mainNav.classList.remove('nav-open');
                     menuButton.setAttribute('aria-expanded', 'false');
                     const icon = menuButton.querySelector('i');
                     icon.classList.remove('fa-times');
                     icon.classList.add('fa-bars');
             }
         });
    } // End of if (menuButton && mainNav)

    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } // End of if (yearSpan)


    // --- Interactive Neural Blueprint SVG ---
    const svgContainer = document.getElementById('hero-svg-container'); // Keep reference if needed elsewhere
    const svg = document.getElementById('neural-blueprint-svg');

    if (svg) { // Check if the SVG element itself exists
        const nodes = svg.querySelectorAll('.neural-node');
        const connections = svg.querySelectorAll('.neural-connection');
        const interactionRadius = 100;

        const calculateDistance = (p1, p2) => {
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        };

        const getMousePos = (event) => {
            // No change needed here, relies on the svg element directly
            const screenToSvg = svg.getScreenCTM().inverse();
            let point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            let svgPoint = point.matrixTransform(screenToSvg);
            return {
                x: svgPoint.x,
                y: svgPoint.y
            };
        };

        // ***** CHANGE HERE: Attach listener directly to the SVG element *****
        svg.addEventListener('mousemove', (event) => {
            const mousePos = getMousePos(event);

            // Update nodes
            nodes.forEach(node => {
                const nodePos = {
                    x: parseFloat(node.getAttribute('cx')),
                    y: parseFloat(node.getAttribute('cy'))
                };
                const distance = calculateDistance(mousePos, nodePos);

                if (distance < interactionRadius) {
                    const scaleFactor = 1 + (1 - distance / interactionRadius) * 0.7;
                    const opacityFactor = 0.7 + (1 - distance / interactionRadius) * 0.3;
                    // Apply transform using SVG transform attribute for potentially better compatibility
                    node.setAttribute('transform', `translate(${nodePos.x}, ${nodePos.y}) scale(${scaleFactor}) translate(${-nodePos.x}, ${-nodePos.y})`);
                    node.style.opacity = opacityFactor;
                } else {
                     // Reset transform attribute
                    node.setAttribute('transform', 'scale(1)');
                    node.style.opacity = 0.7;
                }
            });

            // Update connections
             connections.forEach(conn => {
                const p1 = { x: parseFloat(conn.getAttribute('x1')), y: parseFloat(conn.getAttribute('y1')) };
                const p2 = { x: parseFloat(conn.getAttribute('x2')), y: parseFloat(conn.getAttribute('y2')) };
                const midPoint = {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
                const distance = calculateDistance(mousePos, midPoint);

                if (distance < interactionRadius * 0.8) {
                    const opacityFactor = 0.6 + (1 - distance / (interactionRadius * 0.8)) * 0.4;
                    conn.style.strokeOpacity = opacityFactor;
                } else {
                    conn.style.strokeOpacity = 0.6;
                }
             });
        }); // End of mousemove listener

        // ***** CHANGE HERE: Attach listener directly to the SVG element *****
        svg.addEventListener('mouseleave', () => {
             nodes.forEach(node => {
                 // Reset transform attribute
                 node.setAttribute('transform', 'scale(1)');
                 node.style.opacity = 0.7;
             });
             connections.forEach(conn => {
                 conn.style.strokeOpacity = 0.6;
             });
        }); // End of mouseleave listener

    } // end if(svg)


    // --- Potential future JS (e.g., scroll animations) ---
    // ... (keep the commented-out scroll animation code here) ...


}); // End DOMContentLoaded