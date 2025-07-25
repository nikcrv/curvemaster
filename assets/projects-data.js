// Project Data - Edit this file to update both map and menu
// Only this file needs to be edited for projects and connections
// 
// ⚠️ ВНИМАНИЕ: Это тестовые данные для демонстрации
// Полная база проектов экосистемы Curve находится в разработке

window.ProjectsData = {
  // Connection types and their colors
  connectionTypes: {
    "pool_optimization": { label: "Оптимизация пулов", color: "#FF6B35" },
    "liquidity_partnership": { label: "Партнерство по ликвидности", color: "#22be5b" },
    "governance": { label: "Управление", color: "#9482eb" },
    "integration": { label: "Интеграция", color: "#E91E63" },
    "fork": { label: "Форк", color: "#FFC107" },
    "native_stablecoin": { label: "Нативный стейблкоин", color: "#4CAF50" },
    "yield_integration": { label: "Интеграция доходности", color: "#FF9800" },
    "lending_integration": { label: "Интеграция кредитования", color: "#673AB7" },
    "collateral_integration": { label: "Интеграция коллатерала", color: "#009688" },
    "frxeth_partnership": { label: "Партнерство frxETH", color: "#795548" }
  },

  // Project type colors  
  projectTypeColors: {
    "core": "#5170cc",
    "yield": "#FF6B35",
    "stablecoin": "#22be5b", 
    "lending": "#9482eb",
    "bridge": "#E91E63",
    "governance": "#2196F3"
  },

  // Projects data - EDIT THIS TO ADD/MODIFY PROJECTS
  projects: {
    curve: {
      title: "Curve Finance",
      project_type: "core",
      tvl: 2500000000,
      market_cap: 500000000,
      website: "https://curve.fi/",
      description: "Основной протокол для обмена стейблкоинов с низким проскальзыванием",
      icon: "🌊",
      connections: [
        { target: "convex", type: "pool_optimization", strength: 0.9 },
        { target: "frax", type: "liquidity_partnership", strength: 0.7 },
        { target: "yearn", type: "yield_integration", strength: 0.6 },
      ]
    },

    convex: {
      title: "Convex Finance", 
      project_type: "yield",
      tvl: 800000000,
      market_cap: 150000000,
      website: "https://www.convexfinance.com/",
      description: "Платформа для оптимизации доходности Curve LP токенов",
      icon: "🔺",
      connections: [
        { target: "curve", type: "veCRV", strength: 0.9 },
        { target: "frax", type: "FXS", strength: 0.5 }
      ]
    },

    frax: {
      title: "Frax Finance",
      project_type: "stablecoin",
      tvl: 300000000,
      market_cap: 100000000, 
      website: "https://frax.finance/",
      description: "Алгоритмический стейблкоин с партнерством Curve",
      icon: "❄️",
      connections: [
        { target: "curve", type: "liquidity_partnership", strength: 0.7 },
        { target: "convex", type: "frxeth_partnership", strength: 0.5 }
      ]
    },

    yearn: {
      title: "Yearn Finance",
      project_type: "yield",
      tvl: 400000000,
      market_cap: 80000000,
      website: "https://yearn.fi/",
      description: "Автоматизированные стратегии доходности на базе Curve",
      icon: "🏦", 
      connections: [
        { target: "curve", type: "veCRV", strength: 0.6 }
      ]
    }
  },

  // Generate ecosystem data for visualization
  generateData() {
    const nodes = [];
    const links = [];
    const processedConnections = new Set();

    // Create nodes
    Object.entries(this.projects).forEach(([id, project]) => {
      const size = Math.min(50, Math.max(20, Math.log10((project.tvl || 1000000) / 1000000) * 10 + 20));
      
      nodes.push({
        id: id,
        label: project.title,
        x: 0,
        y: 0,
        color: this.projectTypeColors[project.project_type] || '#666666',
        size: size,
        type: project.project_type,
        icon: project.icon,
        description: project.description,
        website: project.website,
        tvl: project.tvl,
        market_cap: project.market_cap,
        risk_level: project.risk_level
      });
    });

    // Create links
    Object.entries(this.projects).forEach(([sourceId, project]) => {
      if (project.connections) {
        project.connections.forEach(connection => {
          const linkId = [sourceId, connection.target].sort().join('-');
          
          if (!processedConnections.has(linkId)) {
            processedConnections.add(linkId);
            
            const connectionConfig = this.connectionTypes[connection.type] || {
              label: connection.type,
              color: "#666666"
            };
            
            links.push({
              source: sourceId,
              target: connection.target,
              type: connection.type,
              label: connectionConfig.label,
              color: connectionConfig.color,
              strength: connection.strength || 0.7
            });
          }
        });
      }
    });

    return { nodes, links };
  },

  // Format TVL for display
  formatTVL(tvl) {
    if (tvl >= 1000000000) {
      return `$${(tvl / 1000000000).toFixed(1)}B`;
    } else if (tvl >= 1000000) {
      return `$${(tvl / 1000000).toFixed(0)}M`;
    } else if (tvl > 0) {
      return `$${tvl.toLocaleString()}`;
    }
    return 'N/A';
  }
};