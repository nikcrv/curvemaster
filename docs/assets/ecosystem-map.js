// Curve Ecosystem Interactive Map - Advanced Version
(function() {
  'use strict';
  
  let isInitialized = false;
  let initAttempts = 0;
  const maxAttempts = 20;
  
  // Wait for DOM and D3 to be ready
  function waitForDependencies() {
    if (typeof d3 === 'undefined') {
      initAttempts++;
      if (initAttempts < maxAttempts) {
        setTimeout(waitForDependencies, 200);
      } else {
        console.error('D3.js не загружен после ' + maxAttempts + ' попыток');
        showError('Ошибка загрузки библиотеки визуализации');
      }
      return;
    }
    
    // Reset attempts when D3 is found
    initAttempts = 0;
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAndInit);
    } else {
      checkAndInit();
    }
  }
  
  function checkAndInit() {
    const container = document.getElementById('ecosystem-map');
    if (container && !isInitialized) {
      initEcosystemMap();
    } else if (container && isInitialized) {
      // Re-initialize if container exists but was cleared
      if (container.children.length <= 1) {
        isInitialized = false;
        initEcosystemMap();
      }
    }
  }
  
  function showError(message) {
    const container = document.getElementById('ecosystem-map');
    if (container) {
      container.innerHTML = `<p style="text-align: center; color: var(--md-error-fg-color);">${message}</p>`;
    }
  }
  
  function initEcosystemMap() {
    try {
      // Check if we're on the homepage
      const container = document.getElementById('ecosystem-map');
      if (!container) return;
      
      // Prevent double initialization
      if (isInitialized) return;
      isInitialized = true;
      
      // Clear container
      container.innerHTML = '';
    
      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'ecosystem-tooltip';
      document.body.appendChild(tooltip);
      
      // Set dimensions
      const width = container.offsetWidth || 800;
      const height = 600;
      
      // Check container size
      if (width < 100) {
        console.warn('Контейнер слишком маленький, используем стандартную ширину');
      }
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%');
    
    // Define gradients and filters
    const defs = svg.append('defs');
    
    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
    
    // Link gradients
    const gradients = [
      { id: 'gradient-yield', colors: ['#FF6B35', '#FFC107'] },
      { id: 'gradient-stable', colors: ['#22be5b', '#00BCD4'] },
      { id: 'gradient-lending', colors: ['#9482eb', '#E91E63'] },
      { id: 'gradient-main', colors: ['#5170cc', '#22be5b'] }
    ];
    
    gradients.forEach(grad => {
      const gradient = defs.append('linearGradient')
        .attr('id', grad.id)
        .attr('gradientUnits', 'userSpaceOnUse');
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', grad.colors[0])
        .attr('stop-opacity', 0.8);
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', grad.colors[1])
        .attr('stop-opacity', 0.8);
    });
    
    // Arrow markers
    const linkTypes = ['strong', 'yield', 'stable', 'data'];
    linkTypes.forEach(type => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('fill', '#fff')
        .attr('fill-opacity', 0.8)
        .attr('d', 'M0,-5L10,0L0,5');
    });
    
    // Get ecosystem data from projects data
    const ecosystemData = window.ProjectsData.generateData();
    const nodes = ecosystemData.nodes;
    const links = ecosystemData.links;
    
    console.log('Ecosystem data loaded:', { nodes: nodes.length, links: links.length });
    
    if (nodes.length === 0) {
      console.error('No nodes loaded!');
      container.innerHTML = '<p style="text-align: center; color: var(--md-error-fg-color);">Ошибка: не удалось загрузить данные проектов</p>';
      return;
    }
    
    // Set initial positions for nodes
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) / 4;
      node.x = width/2 + Math.cos(angle) * radius;
      node.y = height/2 + Math.sin(angle) * radius;
    });
    
    // Create container group
    const g = svg.append('g');
    
    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(150).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('collision', d3.forceCollide().radius(d => d.size + 20));
    
    // Draw links
    const linkGroup = g.append('g').attr('class', 'links');
    
    const linkElements = linkGroup.selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('class', d => `link link-${d.type}`)
      .attr('stroke', d => d.color || 'rgba(255,255,255,0.3)')
      .attr('stroke-width', d => d.type === 'strong' ? 3 : 2)
      .attr('fill', 'none')
      .attr('marker-end', d => `url(#arrow-${d.type})`)
      .style('stroke-dasharray', d => d.type === 'data' ? '5,5' : null);
    
    // Link labels
    const linkLabels = linkGroup.selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .style('fill', 'rgba(255,255,255,0.7)')
      .style('font-size', '10px')
      .text(d => d.label);
    
    // Draw nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    
    const nodeElements = nodeGroup.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .call(drag(simulation));
    
    // Node circles
    nodeElements.append('circle')
      .attr('r', d => d.size)
      .attr('fill', d => d.color)
      .attr('stroke', 'rgba(255,255,255,0.8)')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow)')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', handleNodeClick);
    
    // Node icons
    nodeElements.append('text')
      .attr('class', 'node-icon')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .style('font-size', d => d.size * 0.5 + 'px')
      .style('pointer-events', 'none')
      .text(d => d.icon);
    
    // Node labels
    nodeElements.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.size + 15)
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('text-shadow', '0 0 5px rgba(0,0,0,0.8)')
      .text(d => d.label);
    
    // Hover functions
    function handleMouseOver(event, d) {
      // Highlight node
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', d.size * 1.2);
      
      // Dim other nodes
      nodeElements.style('opacity', node => 
        node === d || links.some(l => 
          (l.source.id === d.id && l.target.id === node.id) ||
          (l.target.id === d.id && l.source.id === node.id)
        ) ? 1 : 0.3
      );
      
      // Highlight connected links
      linkElements.style('opacity', link => 
        link.source.id === d.id || link.target.id === d.id ? 1 : 0.1
      );
      
      // Show tooltip
      tooltip.innerHTML = `
        <h4>${d.icon} ${d.label}</h4>
        <p>${d.description}</p>
        <p><strong>TVL:</strong> ${window.ProjectsData.formatTVL(d.tvl)}</p>
        <p><strong>Market Cap:</strong> ${window.ProjectsData.formatTVL(d.market_cap)}</p>
        <p><strong>Риск:</strong> ${d.risk_level}</p>
        <p><strong>Тип:</strong> ${d.type}</p>
      `;
      tooltip.style.opacity = 1;
      
      // Calculate position relative to viewport
      const rect = this.getBoundingClientRect();
      const tooltipWidth = 250; // approximate width
      const tooltipHeight = 100; // approximate height
      
      let left = event.pageX + 10;
      let top = event.pageY - 30;
      
      // Adjust if tooltip would go off screen
      if (left + tooltipWidth > window.innerWidth) {
        left = event.pageX - tooltipWidth - 10;
      }
      if (top + tooltipHeight > window.innerHeight) {
        top = event.pageY - tooltipHeight - 10;
      }
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    }
    
    function handleMouseOut(event, d) {
      // Reset node size
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', d.size);
      
      // Reset opacity
      nodeElements.style('opacity', 1);
      linkElements.style('opacity', 0.8);
      
      // Hide tooltip
      tooltip.style.opacity = 0;
    }
    
    function handleNodeClick(event, d) {
      const urls = {
        'curve': 'https://curve.fi',
        'convex': 'https://www.convexfinance.com',
        'stakedao': 'https://stakedao.org',
        'yearn': 'https://yearn.fi',
        'crvusd': 'https://crvusd.curve.fi',
        'llamalend': 'https://llamalend.curve.fi',
        'frax': 'https://frax.finance',
        'abracadabra': 'https://abracadabra.money',
        'prisma': 'https://prismafinance.com'
      };
      
      if (urls[d.id]) {
        window.open(urls[d.id], '_blank');
      }
    }
    
    
    // Update positions on simulation tick
    function linkPath(d) {
      return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
    }
    
    simulation.on('tick', () => {
      linkElements.attr('d', linkPath);
      
      linkLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);
      
      nodeElements.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });
    
    // Drag functionality
    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
    
    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    // Make functions globally accessible
    window.resetZoom = function() {
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    };
    
    window.toggleAnimation = function() {
      if (simulation.alpha() < 0.01) {
        simulation.alpha(1).restart();
      } else {
        simulation.stop();
      }
    };
    
    window.toggleLabels = function() {
      const labels = document.querySelectorAll('.link-label');
      labels.forEach(label => {
        label.style.display = label.style.display === 'none' ? 'block' : 'none';
      });
    };
    
    window.toggleFullscreen = function() {
      const mapContainer = document.getElementById('ecosystem-map');
      
      if (!document.fullscreenElement) {
        // Enter fullscreen
        mapContainer.requestFullscreen().then(() => {
          // Apply fullscreen styles
          mapContainer.style.position = 'fixed';
          mapContainer.style.top = '0';
          mapContainer.style.left = '0';
          mapContainer.style.width = '100vw';
          mapContainer.style.height = '100vh';
          mapContainer.style.zIndex = '9999';
          mapContainer.style.background = 'var(--md-default-bg-color)';
          
          // Update button text
          const btn = document.querySelector('button[onclick="toggleFullscreen()"]');
          if (btn) btn.innerHTML = '⬜ Выйти';
          
          // Resize SVG
          const rect = mapContainer.getBoundingClientRect();
          svg.attr('viewBox', `0 0 ${rect.width} ${rect.height}`);
          
          // Center the simulation
          simulation.force('x', d3.forceX(rect.width / 2).strength(0.05));
          simulation.force('y', d3.forceY(rect.height / 2).strength(0.05));
          simulation.alpha(0.3).restart();
        });
      } else {
        // Exit fullscreen
        document.exitFullscreen().then(() => {
          // Restore original styles
          mapContainer.style.position = '';
          mapContainer.style.top = '';
          mapContainer.style.left = '';
          mapContainer.style.width = '100%';
          mapContainer.style.height = '';
          mapContainer.style.zIndex = '';
          mapContainer.style.background = '';
          
          // Update button text
          const btn = document.querySelector('button[onclick="toggleFullscreen()"]');
          if (btn) btn.innerHTML = '🔳 Полный экран';
          
          // Restore original SVG viewBox
          svg.attr('viewBox', `0 0 ${width} ${height}`);
          
          // Reset simulation forces
          simulation.force('x', d3.forceX(width / 2).strength(0.05));
          simulation.force('y', d3.forceY(height / 2).strength(0.05));
          simulation.alpha(0.3).restart();
        });
      }
    };
    
    // Initial animation with error handling
    try {
      nodeElements
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 50)
        .style('opacity', 1);
      
      linkElements
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .delay(500)
        .style('opacity', 0.8);
    } catch (animError) {
      console.warn('Ошибка анимации:', animError);
      // Show elements without animation
      nodeElements.style('opacity', 1);
      linkElements.style('opacity', 0.8);
    }
    
    // Create controls and legend after map is loaded
    setTimeout(() => {
      const controlsWrapper = document.querySelector('.ecosystem-controls-row');
      if (controlsWrapper && controlsWrapper.children.length === 0) {
        // Create controls
        const controls = document.createElement('div');
        controls.className = 'ecosystem-controls';
        controls.innerHTML = `
          <h3>🎮 Управление</h3>
          <button onclick="toggleFullscreen()">🔳 Полный экран</button>
          <button onclick="resetZoom()">🔄 Сброс</button>
          <button onclick="toggleAnimation()">✨ Анимация</button>
          <button onclick="toggleLabels()">🏷️ Метки</button>
        `;
        controlsWrapper.appendChild(controls);
        
        // Create legend
        const legend = document.createElement('div');
        legend.className = 'ecosystem-legend';
        legend.innerHTML = `
          <h3>📊 Типы протоколов</h3>
          <div class="legend-items">
            <div class="legend-item"><span class="legend-dot" style="background: #5170cc;"></span>Основной</div>
            <div class="legend-item"><span class="legend-dot" style="background: #FF6B35;"></span>Yield</div>
            <div class="legend-item"><span class="legend-dot" style="background: #22be5b;"></span>Стейблкоин</div>
            <div class="legend-item"><span class="legend-dot" style="background: #9482eb;"></span>Кредитование</div>
          </div>
        `;
        controlsWrapper.appendChild(legend);
      }
    }, 100);
    
    } catch (error) {
      console.error('Ошибка инициализации карты:', error);
      showError('Ошибка загрузки карты: ' + error.message);
      isInitialized = false; // Allow retry on error
    }
  }
  
  // Start initialization
  waitForDependencies();
  
  // Also try to initialize on page navigation (for SPA-like behavior)
  if (typeof window !== 'undefined') {
    // Listen for potential navigation events
    window.addEventListener('popstate', () => {
      setTimeout(checkAndInit, 100);
    });
    
    // MutationObserver to watch for DOM changes
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const container = document.getElementById('ecosystem-map');
            if (container && container.textContent.includes('Загрузка интерактивной карты')) {
              setTimeout(checkAndInit, 500);
            }
          }
        });
      });
      
      // Start observing when DOM is ready
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        });
      }
    }
  }
})();