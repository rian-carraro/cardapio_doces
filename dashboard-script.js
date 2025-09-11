// Dashboard JavaScript - LR Gourmet
class DashboardManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentSection = 'overview';
        this.charts = {};
        this.realData = this.loadRealData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoginModal();
    }

    setupEventListeners() {
        // Login
        $('#loginBtn').on('click', () => this.handleLogin());
        $('#logoutBtn').on('click', () => this.handleLogout());
        
        // Navigation
        $('.nav-link').on('click', (e) => this.handleNavigation(e));
        
        // Mobile menu
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 3edbbce453ac1f435f1751291f1f4ea9d7e0ef96
        $('#menuToggle').on('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });
<<<<<<< HEAD
=======
=======
        $('#mobileMenuToggle').on('click', () => this.toggleSidebar());
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
>>>>>>> 3edbbce453ac1f435f1751291f1f4ea9d7e0ef96
        $('#mobileOverlay').on('click', () => this.closeSidebar());
        $(document).on('keydown', (e) => {
            if (e.key === 'Escape') this.closeSidebar();
        });
        
        // Data refresh
        $('#refreshData').on('click', () => this.refreshData());
        
        // Clear all data
        $('#clearAllData').on('click', () => this.clearAllData());
        
        // Product management
        $('#enableAllProducts').on('click', () => this.enableAllProducts());
        $('#disableAllProducts').on('click', () => this.disableAllProducts());
        
        // Date filter
        $('#dateFilter').on('change', () => this.updateDashboard());
        
        // Chart controls
        $('.chart-controls .btn').on('click', (e) => this.handleChartControl(e));
        
        // Reports
        $('#generateReport').on('click', () => this.generateReport());
        $('#exportReport').on('click', () => this.exportReport());

        // Exports PDF
        $('#exportOrders').on('click', () => this.exportTableToPDF('#recentOrdersTable', 'Pedidos_Recentes'));
        $('#exportProducts').on('click', () => this.exportTableToPDF('#productsRankingTable', 'Ranking_Produtos'));
        $('#exportAddresses').on('click', () => this.exportTableToPDF('#addressesTable', 'Enderecos_Clientes'));
<<<<<<< HEAD
        
        // Add Products functionality
        $('#addProductForm').on('submit', (e) => this.handleAddProduct(e));
        $('#clearForm').on('click', () => this.clearAddProductForm());
        $('#clearAllProducts').on('click', () => this.clearAllAddedProducts());
        $('#exportProductsList').on('click', () => this.exportAddedProducts());
=======
>>>>>>> 3edbbce453ac1f435f1751291f1f4ea9d7e0ef96
    }

    handleChartControl(e) {
        e.preventDefault();
        const $btn = $(e.currentTarget);
        const selected = $btn.data('chart'); // 'revenue' | 'orders'
        $btn.closest('.chart-controls').find('.btn').removeClass('active');
        $btn.addClass('active');

        if (this.charts.revenue) {
            const data = selected === 'orders' ? this.generateOrdersChartData() : this.generateRevenueChartData();
            this.charts.revenue.data = data;
            this.charts.revenue.options.scales.y.ticks.callback = (value) => (
                selected === 'orders' ? value : this.formatCurrency(value)
            );
            this.charts.revenue.update();
        }
    }

    exportTableToPDF(tableSelector, title) {
        const table = document.querySelector(tableSelector);
        if (!table) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const now = new Date().toLocaleString('pt-BR');
        doc.setFontSize(14);
        doc.text(`${title} - ${now}`, 40, 40);
        doc.autoTable({ html: table, startY: 60, styles: { fontSize: 9 } });
        doc.save(`${title}.pdf`);
    }

    showLoginModal() {
        $('#loginModal').modal('show');
    }

    handleLogin() {
        const username = $('#username').val();
        const password = $('#password').val();
        
        // Simple authentication (in production, use proper authentication)
        if (username === 'admin' && password === 'lrgourmet2025') {
            this.isAuthenticated = true;
            $('#loginModal').modal('hide');
            this.initializeDashboard();
        } else {
            $('#loginError').removeClass('d-none');
        }
    }

    handleLogout() {
        this.isAuthenticated = false;
        location.reload();
    }

    initializeDashboard() {
        // Aguardar um pouco para garantir que o DOM está pronto
        setTimeout(() => {
            this.updateDashboard();
            this.initializeCharts();
        }, 100);
    }

    loadRealData() {
        // Carregar dados reais do localStorage
        const orders = JSON.parse(localStorage.getItem('lrGourmetOrders')) || [];
        const customers = JSON.parse(localStorage.getItem('lrGourmetCustomers')) || [];
        
        // Converter strings de data de volta para objetos Date
        orders.forEach(order => {
            order.date = new Date(order.date);
        });
        
        customers.forEach(customer => {
            if (customer.firstOrder) customer.firstOrder = new Date(customer.firstOrder);
            if (customer.lastOrder) customer.lastOrder = new Date(customer.lastOrder);
        });
        
        // Se não há dados reais, usar alguns dados de exemplo
        if (orders.length === 0) {
            return this.generateSampleData();
        }
        
        return { orders, customers };
    }
    
    generateSampleData() {
        const products = [
            'Bom Bom de Morango', 'Bom Bom de Uva', 'Tortinha de Limão', 
            'Pavê de Prestígio', 'Trufa de Nutella', 'Refrigerante Coca-Lata',
            'Água Mineral', 'Brigadeiro', 'Trufa Tradicional'
        ];
        
        const bairros = [
            'Centro', 'Vila Industrial', 'Jardim América', 'Vila Nova', 
            'Jardim Parati', 'Vila São José', 'Jardim Orlando'
        ];
        
        const customers = [
            'Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira',
            'Carla Souza', 'Roberto Lima', 'Fernanda Alves'
        ];

        // Generate sample orders data
        const orders = [];
        for (let i = 0; i < 50; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            const items = [];
            const numItems = Math.floor(Math.random() * 3) + 1;
            let subtotal = 0;
            
            for (let j = 0; j < numItems; j++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                const price = Math.random() * 10 + 5;
                items.push({ product, quantity, price });
                subtotal += quantity * price;
            }
            
            orders.push({
                id: `#${Date.now() + i}`,
                customer: customers[Math.floor(Math.random() * customers.length)],
                items,
                subtotal: subtotal,
                deliveryFee: 10,
                total: subtotal + 10,
                payment: ['PIX', 'Cartão', 'Dinheiro'][Math.floor(Math.random() * 3)],
                status: ['Pendente', 'Entregue', 'Cancelado'][Math.floor(Math.random() * 3)],
                date,
                bairro: bairros[Math.floor(Math.random() * bairros.length)]
            });
        }

        return { orders, customers: [] };
    }

    // Product management methods
    loadProductsList() {
        // Lista de todos os produtos do cardápio
        return [
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 3edbbce453ac1f435f1751291f1f4ea9d7e0ef96
            // Doces no Pote (nomes iguais ao cardápio)
            { name: 'Bom Bom de Morango', category: 'Doces no Pote', price: 12.00 },
            { name: 'Bom Bom de Uva', category: 'Doces no Pote', price: 12.00 },
            { name: 'Tortinha de Limão', category: 'Doces no Pote', price: 12.00 },
            { name: 'Pavê de Prestigio', category: 'Doces no Pote', price: 12.50 },

            // Trufas ao Leite (nomes iguais ao cardápio)
            { name: 'Trufa de Nutella', category: 'Trufas ao Leite', price: 6.50 },
            { name: 'Trufa de Ninho', category: 'Trufas ao Leite', price: 6.00 },
            { name: 'Trufa de Ninho com Nutella', category: 'Trufas ao Leite', price: 6.00 },
            { name: 'Trufa de Oreo', category: 'Trufas ao Leite', price: 6.00 },
            { name: 'Trufa de Brigadeiro', category: 'Trufas ao Leite', price: 6.00 },
            { name: 'Trufa de Limão', category: 'Trufas ao Leite', price: 6.00 },
            { name: 'Trufa de Pistache', category: 'Trufas ao Leite', price: 6.50 },

            // Trufas Brancas (nomes iguais ao cardápio)
            { name: 'Trufa de Ninho com Nutella', category: 'Trufas Brancas', price: 6.50 },
            { name: 'Trufa de Nutella', category: 'Trufas Brancas', price: 6.50 },
            { name: 'Trufa de Ninho', category: 'Trufas Brancas', price: 6.00 },
            { name: 'Trufa de Oreo', category: 'Trufas Brancas', price: 6.00 },
<<<<<<< HEAD
=======
=======
            { name: 'Bom Bom de Morango', category: 'Doces', price: 12.00 },
            { name: 'Bom Bom de Uva', category: 'Doces', price: 12.00 },
            { name: 'Tortinha de Limão', category: 'Doces', price: 12.00 },
            { name: 'Trufa de Nutella', category: 'Trufas', price: 6.50 },
            { name: 'Trufa de Brigadeiro', category: 'Trufas', price: 6.00 },
            { name: 'Trufa de Ninho', category: 'Trufas', price: 6.00 },
            { name: 'Trufa de Ninho com Nutella', category: 'Trufas', price: 6.00 },
            { name: 'Trufa de Oreo', category: 'Trufas', price: 6.00 },
            { name: 'Trufa de Pistache', category: 'Trufas', price: 6.50 },
            { name: 'Trufa de Pistache com Ninho', category: 'Trufas', price: 6.50 },
            { name: 'Trufa de Limão', category: 'Trufas', price: 6.00 },
            { name: 'Trufa de Nutella ao Leite', category: 'Trufas ao Leite', price: 6.50 },
            { name: 'Trufa de Ninho com Nutella ao Leite', category: 'Trufas ao Leite', price: 6.50 },
            { name: 'Trufa de Brigadeiro ao Leite', category: 'Trufas ao Leite', price: 6.00 },
            { name: 'Trufa de Ninho ao Leite', category: 'Trufas ao Leite', price: 6.00 },
            { name: 'Trufa de Oreo ao Leite', category: 'Trufas ao Leite', price: 6.00 },
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
>>>>>>> 3edbbce453ac1f435f1751291f1f4ea9d7e0ef96
            { name: 'Trufa de Ninho (Casquinha de Pistache)', category: 'Casquinha de Pistache', price: 7.00 },
            { name: 'Trufa de Pistache (Casquinha de Pistache)', category: 'Casquinha de Pistache', price: 7.00 },
            { name: 'Refrigerante cola 350ml', category: 'Bebidas', price: 6.00 },
            { name: 'Refrigerante cola zero 350ml', category: 'Bebidas', price: 6.00 },
<<<<<<< HEAD
            { name: 'Água Mineral com gás 500ml', category: 'Bebidas', price: 4.00 },
            { name: 'Água Mineral sem gás 500ml', category: 'Bebidas', price: 4.00 }
=======
<<<<<<< HEAD
            { name: 'Água Mineral com gás 500ml', category: 'Bebidas', price: 4.00 },
            { name: 'Água Mineral sem gás 500ml', category: 'Bebidas', price: 4.00 }
=======
            { name: 'Água Mineral 500ml', category: 'Bebidas', price: 4.00 },
            { name: 'Água mineral com gás.', category: 'Bebidas', price: 4.00 },
            { name: 'Suco Maracuja 200ml', category: 'Bebidas', price: 10.00 },
            { name: 'Suco Laranja 200ml', category: 'Bebidas', price: 10.00 }
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
>>>>>>> 3edbbce453ac1f435f1751291f1f4ea9d7e0ef96
        ];
    }

    getProductAvailability() {
        return JSON.parse(localStorage.getItem('lrGourmetProductAvailability')) || {};
    }

    setProductAvailability(productName, isAvailable) {
        const availability = this.getProductAvailability();
        availability[productName] = isAvailable;
        localStorage.setItem('lrGourmetProductAvailability', JSON.stringify(availability));
        this.updateProductDisplay();
    }

    isProductAvailable(productName) {
        const availability = this.getProductAvailability();
        return availability[productName] !== false; // Por padrão, produtos são disponíveis
    }

    renderProductManagement() {
        const products = this.loadProductsList();
        const grid = $('#productManagementGrid');
        grid.empty();

        const categories = {};
        products.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = [];
            }
            categories[product.category].push(product);
        });

        Object.keys(categories).forEach(category => {
            const categoryHtml = `
                <div class="col-12 mb-3">
                    <h6 class="text-muted mb-2">${category}</h6>
                    <div class="row">
                        ${categories[category].map(product => `
                            <div class="col-lg-4 col-md-6 mb-2">
                                <div class="product-toggle-card ${this.isProductAvailable(product.name) ? 'available' : 'unavailable'}">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="product-info">
                                            <strong>${product.name}</strong>
                                            <br><small class="text-muted">R$ ${product.price.toFixed(2)}</small>
                                        </div>
                                        <div class="custom-switch">
                                            <input type="checkbox" 
                                                   class="product-toggle" 
                                                   id="toggle-${product.name.replace(/\s+/g, '-')}"
                                                   data-product="${product.name}"
                                                   ${this.isProductAvailable(product.name) ? 'checked' : ''}>
                                            <label for="toggle-${product.name.replace(/\s+/g, '-')}" class="switch-label">
                                                <span class="switch-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            grid.append(categoryHtml);
        });

        // Adicionar event listeners para os toggles
        $('.product-toggle').on('change', (e) => {
            const productName = $(e.target).data('product');
            const isAvailable = $(e.target).is(':checked');
            this.setProductAvailability(productName, isAvailable);
        });
    }

    enableAllProducts() {
        const products = this.loadProductsList();
        products.forEach(product => {
            this.setProductAvailability(product.name, true);
        });
        this.renderProductManagement();
        this.updateProductsTable();
    }

    disableAllProducts() {
        if (confirm('⚠️ Tem certeza que deseja desativar TODOS os produtos?\n\nIsso tornará todos os produtos indisponíveis para os clientes.')) {
            const products = this.loadProductsList();
            products.forEach(product => {
                this.setProductAvailability(product.name, false);
            });
            this.renderProductManagement();
            this.updateProductsTable();
        }
    }

    updateProductDisplay() {
        // Esta função será chamada para atualizar a exibição no site principal
        // Por enquanto, apenas salva no localStorage para ser lida pelo script.js
        const event = new CustomEvent('productAvailabilityChanged', {
            detail: { availability: this.getProductAvailability() }
        });
        window.dispatchEvent(event);
    }

    updateDashboard() {
        const period = $('#dateFilter').val();
        const filteredData = this.filterDataByPeriod(period);
        
        this.updateKPIs(filteredData);
        this.updateTables(filteredData);
        this.updateCharts(filteredData);
        
        // Renderizar gerenciamento de produtos se estiver na seção de produtos
        if ($('#products-section').hasClass('active')) {
            this.renderProductManagement();
            this.updateProductsTable(filteredData);
        }
    }

    filterDataByPeriod(period) {
        const now = new Date();
        let startDate = new Date();
        
        switch(period) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        
        return this.realData.orders.filter(order => order.date >= startDate);
    }

    updateKPIs(data) {
        const totalRevenue = data.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = data.length;
        const totalProducts = data.reduce((sum, order) => 
            sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        $('#totalRevenue').text(this.formatCurrency(totalRevenue));
        $('#totalOrders').text(totalOrders);
        $('#totalProducts').text(totalProducts);
        $('#avgOrderValue').text(this.formatCurrency(avgOrderValue));
        
        // Calcular crescimento comparando com período anterior
        const growth = this.calculateGrowth(data);
        $('#revenueGrowth').text(growth.revenue);
        $('#ordersGrowth').text(growth.orders);
        $('#productsGrowth').text(growth.products);
        $('#avgOrderGrowth').text(growth.avgOrder);
        
        // Atualizar KPIs da seção de clientes
        const uniqueCustomers = new Set(data.map(order => order.customer)).size;
        const newCustomers = this.calculateNewCustomers(data);
        const returningCustomers = uniqueCustomers - newCustomers;
        
        $('#totalCustomers').text(uniqueCustomers);
        $('#newCustomers').text(newCustomers);
        $('#returningCustomers').text(returningCustomers);
    }
    
    calculateGrowth(currentData) {
        // Simular cálculo de crescimento baseado nos dados reais
        const hasData = currentData.length > 0;
        return {
            revenue: hasData ? '+' + (Math.random() * 20 + 5).toFixed(1) + '%' : '0%',
            orders: hasData ? '+' + (Math.random() * 15 + 3).toFixed(1) + '%' : '0%',
            products: hasData ? '+' + (Math.random() * 25 + 8).toFixed(1) + '%' : '0%',
            avgOrder: hasData ? '+' + (Math.random() * 10 + 2).toFixed(1) + '%' : '0%'
        };
    }
    
    calculateNewCustomers(data) {
        const savedCustomers = this.realData.customers || [];
        const currentCustomers = new Set(data.map(order => order.customer));
        
        let newCount = 0;
        currentCustomers.forEach(customerName => {
            const existing = savedCustomers.find(c => c.name === customerName);
            if (!existing || this.isNewCustomer(existing)) {
                newCount++;
            }
        });
        
        return newCount;
    }
    
    isNewCustomer(customer) {
        if (!customer.firstOrder) return true;
        const firstOrder = new Date(customer.firstOrder);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return firstOrder >= thirtyDaysAgo;
    }

    updateCharts(filteredData) {
        // Atualizar gráficos com dados reais
        if (this.charts.revenue) {
            const selected = $('.chart-controls .btn.active').data('chart') || 'revenue';
            this.charts.revenue.data = selected === 'orders' ? this.generateOrdersChartData() : this.generateRevenueChartData();
            this.charts.revenue.options.scales.y.ticks.callback = (value) => (
                selected === 'orders' ? value : this.formatCurrency(value)
            );
            this.charts.revenue.update();
        }
        
        if (this.charts.payment) {
            this.charts.payment.data = this.generatePaymentChartData();
            this.charts.payment.update();
        }
        
        if (this.charts.topProducts) {
            this.charts.topProducts.data = this.generateTopProductsData();
            this.charts.topProducts.update();
        }
        
        if (this.charts.lowProducts) {
            this.charts.lowProducts.data = this.generateLowProductsData();
            this.charts.lowProducts.update();
        }
        
        if (this.charts.customerSpending) {
            this.charts.customerSpending.data = this.generateCustomerSpendingData();
            this.charts.customerSpending.update();
        }
        
        if (this.charts.spendingDistribution) {
            this.charts.spendingDistribution.data = this.generateSpendingDistributionData();
            this.charts.spendingDistribution.update();
        }
        
        if (this.charts.location) {
            this.charts.location.data = this.generateLocationData();
            this.charts.location.update();
        }
        
        if (this.charts.regionDistribution) {
            this.charts.regionDistribution.data = this.generateRegionDistributionData();
            this.charts.regionDistribution.update();
        }
    }

    initializeCharts() {
        this.createRevenueChart();
        this.createPaymentChart();
        this.createTopProductsChart();
        this.createLowProductsChart();
        this.createCustomerSpendingChart();
        this.createSpendingDistributionChart();
        this.createLocationChart();
        this.createRegionDistributionChart();
    }

    createRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) {
            console.error('Canvas revenueChart não encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const data = this.generateRevenueChartData();
        
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    createPaymentChart() {
        const canvas = document.getElementById('paymentChart');
        if (!canvas) {
            console.error('Canvas paymentChart não encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const data = this.generatePaymentChartData();
        
        this.charts.payment = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    createTopProductsChart() {
        const canvas = document.getElementById('topProductsChart');
        if (!canvas) {
            console.error('Canvas topProductsChart não encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const data = this.generateTopProductsData();
        
        this.charts.topProducts = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    createLowProductsChart() {
        const canvas = document.getElementById('lowProductsChart');
        if (!canvas) {
            console.error('Canvas lowProductsChart não encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const data = this.generateLowProductsData();
        
        this.charts.lowProducts = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    createCustomerSpendingChart() {
        const canvas = document.getElementById('customerSpendingChart');
        if (!canvas) {
            console.error('Canvas customerSpendingChart não encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const data = this.generateCustomerSpendingData();
        
        this.charts.customerSpending = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    createSpendingDistributionChart() {
        const canvas = document.getElementById('spendingDistributionChart');
        if (!canvas) {
            console.error('Canvas spendingDistributionChart não encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const data = this.generateSpendingDistributionData();
        
        this.charts.spendingDistribution = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    createLocationChart() {
        const canvas = document.getElementById('locationChart');
        if (!canvas) {
            console.error('Canvas locationChart não encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const data = this.generateLocationData();
        
        this.charts.location = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    createRegionDistributionChart() {
        const canvas = document.getElementById('regionDistributionChart');
        if (!canvas) {
            console.error('Canvas regionDistributionChart não encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const data = this.generateRegionDistributionData();
        
        this.charts.regionDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Data generation methods
    generateRevenueChartData() {
        const period = $('#dateFilter').val();
        const filteredData = this.filterDataByPeriod(period);
        
        // Agrupar dados por data
        const dailyRevenue = {};
        filteredData.forEach(order => {
            const dateKey = order.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            if (!dailyRevenue[dateKey]) {
                dailyRevenue[dateKey] = 0;
            }
            dailyRevenue[dateKey] += order.total;
        });
        
        const labels = Object.keys(dailyRevenue).sort();
        const data = labels.map(label => dailyRevenue[label]);
        
        return {
            labels,
            datasets: [{
                label: 'Receita',
                data,
                borderColor: '#2e8291',
                backgroundColor: 'rgba(46, 130, 145, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
    }

    generatePaymentChartData() {
        const filteredData = this.filterDataByPeriod($('#dateFilter').val());
        const paymentStats = {};
        
        filteredData.forEach(order => {
            if (!paymentStats[order.payment]) {
                paymentStats[order.payment] = 0;
            }
            paymentStats[order.payment]++;
        });
        
        const labels = Object.keys(paymentStats);
        const data = Object.values(paymentStats);
        const colors = ['#28a745', '#17a2b8', '#ffc107', '#dc3545'];
        
        return {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.slice(0, labels.length)
            }]
        };
    }

    generateOrdersChartData() {
        const period = $('#dateFilter').val();
        const filteredData = this.filterDataByPeriod(period);
        const dailyOrders = {};
        filteredData.forEach(order => {
            const dateKey = order.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            dailyOrders[dateKey] = (dailyOrders[dateKey] || 0) + 1;
        });
        const labels = Object.keys(dailyOrders).sort();
        const data = labels.map(label => dailyOrders[label]);
        return {
            labels,
            datasets: [{
                label: 'Pedidos',
                data,
                borderColor: '#2e8291',
                backgroundColor: 'rgba(46, 130, 145, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
    }

    generateTopProductsData() {
        const filteredData = this.filterDataByPeriod($('#dateFilter').val());
        const productStats = {};
        
        filteredData.forEach(order => {
            order.items.forEach(item => {
                const productName = item.product || item.name;
                if (!productStats[productName]) {
                    productStats[productName] = 0;
                }
                productStats[productName] += item.quantity;
            });
        });
        
        const sorted = Object.entries(productStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        const labels = sorted.map(([product]) => product);
        const data = sorted.map(([,quantity]) => quantity);
        
        return {
            labels,
            datasets: [{
                data,
                backgroundColor: '#28a745'
            }]
        };
    }

    generateLowProductsData() {
        const filteredData = this.filterDataByPeriod($('#dateFilter').val());
        const productStats = {};
        
        filteredData.forEach(order => {
            order.items.forEach(item => {
                const productName = item.product || item.name;
                if (!productStats[productName]) {
                    productStats[productName] = 0;
                }
                productStats[productName] += item.quantity;
            });
        });
        
        const sorted = Object.entries(productStats)
            .sort(([,a], [,b]) => a - b)
            .slice(0, 5);
        
        const labels = sorted.map(([product]) => product);
        const data = sorted.map(([,quantity]) => quantity);
        
        return {
            labels,
            datasets: [{
                data,
                backgroundColor: '#dc3545'
            }]
        };
    }

    generateCustomerSpendingData() {
        const filteredData = this.filterDataByPeriod($('#dateFilter').val());
        const monthlySpending = {};
        
        filteredData.forEach(order => {
            const monthKey = order.date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            if (!monthlySpending[monthKey]) {
                monthlySpending[monthKey] = 0;
            }
            monthlySpending[monthKey] += order.total;
        });
        
        const labels = Object.keys(monthlySpending).sort();
        const data = labels.map(label => monthlySpending[label]);
        
        return {
            labels,
            datasets: [{
                label: 'Gastos dos Clientes',
                data,
                borderColor: '#17a2b8',
                backgroundColor: 'rgba(23, 162, 184, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
    }

    generateSpendingDistributionData() {
        const filteredData = this.filterDataByPeriod($('#dateFilter').val());
        const ranges = {
            'R$ 0-50': 0,
            'R$ 51-100': 0,
            'R$ 101-200': 0,
            'R$ 201+': 0
        };
        
        filteredData.forEach(order => {
            if (order.total <= 50) {
                ranges['R$ 0-50']++;
            } else if (order.total <= 100) {
                ranges['R$ 51-100']++;
            } else if (order.total <= 200) {
                ranges['R$ 101-200']++;
            } else {
                ranges['R$ 201+']++;
            }
        });
        
        return {
            labels: Object.keys(ranges),
            datasets: [{
                data: Object.values(ranges),
                backgroundColor: ['#ffc107', '#28a745', '#17a2b8', '#dc3545']
            }]
        };
    }

    generateLocationData() {
        const filteredData = this.filterDataByPeriod($('#dateFilter').val());
        const locationStats = {};
        
        filteredData.forEach(order => {
            if (!locationStats[order.bairro]) {
                locationStats[order.bairro] = 0;
            }
            locationStats[order.bairro]++;
        });
        
        const sorted = Object.entries(locationStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);
        
        const labels = sorted.map(([bairro]) => bairro);
        const data = sorted.map(([,count]) => count);
        
        return {
            labels,
            datasets: [{
                data,
                backgroundColor: '#2e8291'
            }]
        };
    }

    generateRegionDistributionData() {
        return {
            labels: ['Centro', 'Norte', 'Sul', 'Leste', 'Oeste'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: ['#2e8291', '#28a745', '#17a2b8', '#ffc107', '#dc3545']
            }]
        };
    }

    updateTables(data) {
        this.updateRecentOrdersTable(data);
        this.updateProductsTable(data);
        this.updateTopCustomersTable(data);
        this.updateLocationTable();
    }

    updateRecentOrdersTable(data) {
        const tbody = $('#recentOrdersTable tbody');
        tbody.empty();
        
        const recent = data.slice(-10).reverse();
        recent.forEach(order => {
            const statusClass = order.status === 'Entregue' ? 'status-completed' : 
                               order.status === 'Cancelado' ? 'status-cancelled' : 'status-pending';
            
            tbody.append(`
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer}</td>
                    <td>${order.items.length} itens</td>
                    <td>${this.formatCurrency(order.total)}</td>
                    <td>${order.payment}</td>
                    <td><span class="badge ${statusClass}">${order.status}</span></td>
                    <td>${order.date.toLocaleDateString('pt-BR')}</td>
                </tr>
            `);
        });
    }

    updateProductsTable(data) {
        // Permitir chamada sem parâmetro (atual) usando período selecionado
        if (!data) {
            data = this.filterDataByPeriod($('#dateFilter').val());
        }
        const productStats = {};
        
        data.forEach(order => {
            order.items.forEach(item => {
                const productName = item.product || item.name;
                if (!productStats[productName]) {
                    productStats[productName] = { quantity: 0, revenue: 0 };
                }
                productStats[productName].quantity += item.quantity;
                productStats[productName].revenue += item.quantity * item.price;
            });
        });
        
        const availability = JSON.parse(localStorage.getItem('lrGourmetProductAvailability')) || {};
        const sorted = Object.entries(productStats).sort(([,a], [,b]) => b.quantity - a.quantity);
        const tbody = $('#productsTableBody');
        tbody.empty();
        
        if (sorted.length === 0) {
            tbody.append('<tr><td colspan="6" class="text-center text-muted">Nenhum produto vendido no período selecionado</td></tr>');
            return;
        }
        
        sorted.forEach(([product, stats], index) => {
            const isAvailable = availability[product] !== false;
            const statusBadge = isAvailable ? '<span class="badge badge-success">Ativo</span>' : '<span class="badge badge-secondary">Inativo</span>';
            const growth = '+' + (Math.random() * 20).toFixed(1) + '%';
            tbody.append(
                '<tr>' +
                `<td>${index + 1}º</td>` +
                `<td>${product}</td>` +
                `<td>${statusBadge}</td>` +
                `<td>${stats.quantity}</td>` +
                `<td>${this.formatCurrency(stats.revenue)}</td>` +
                `<td>${growth}</td>` +
                '</tr>'
            );
        });
    }

    updateTopCustomersTable(data) {
        // Usar dados dos clientes salvos se disponível
        const savedCustomers = this.realData.customers || [];
        const customerStats = {};
        
        // Primeiro, carregar dados salvos dos clientes
        savedCustomers.forEach(customer => {
            customerStats[customer.name] = {
                total: customer.totalSpent || 0,
                orders: customer.totalOrders || 0,
                lastOrder: customer.lastOrder || new Date(),
                bairro: customer.bairro || 'N/A'
            };
        });
        
        // Depois, processar pedidos do período filtrado
        data.forEach(order => {
            if (!customerStats[order.customer]) {
                customerStats[order.customer] = {
                    total: 0,
                    orders: 0,
                    lastOrder: order.date,
                    bairro: order.bairro
                };
            }
            // Para o período filtrado, somar apenas os pedidos desse período
            customerStats[order.customer].total += order.total;
            customerStats[order.customer].orders += 1;
            if (order.date > customerStats[order.customer].lastOrder) {
                customerStats[order.customer].lastOrder = order.date;
            }
        });
        
        const sorted = Object.entries(customerStats)
            .filter(([,stats]) => stats.total > 0)
            .sort(([,a], [,b]) => b.total - a.total);
        
        const tbody = $('#topCustomersTable tbody');
        tbody.empty();
        
        if (sorted.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="7" class="text-center text-muted">Nenhum cliente encontrado no período selecionado</td>
                </tr>
            `);
            return;
        }
        
        sorted.slice(0, 10).forEach(([customer, stats], index) => {
            const avgTicket = stats.total / stats.orders;
            
            tbody.append(`
                <tr>
                    <td>${index + 1}º</td>
                    <td>${customer}</td>
                    <td>${this.formatCurrency(stats.total)}</td>
                    <td>${stats.orders}</td>
                    <td>${this.formatCurrency(avgTicket)}</td>
                    <td>${stats.lastOrder.toLocaleDateString('pt-BR')}</td>
                    <td>${stats.bairro}</td>
                </tr>
            `);
        });
    }

    updateLocationTable() {
        const filteredData = this.filterDataByPeriod($('#dateFilter').val());
        const locationStats = {};
        
        filteredData.forEach(order => {
            if (!locationStats[order.bairro]) {
                locationStats[order.bairro] = {
                    orders: 0,
                    revenue: 0
                };
            }
            locationStats[order.bairro].orders++;
            locationStats[order.bairro].revenue += order.total;
        });
        
        const totalOrders = filteredData.length;
        const tbody = $('#locationsTable tbody');
        tbody.empty();
        
        Object.entries(locationStats)
            .sort(([,a], [,b]) => b.orders - a.orders)
            .forEach(([bairro, stats]) => {
                const avgTicket = stats.revenue / stats.orders;
                const percentage = ((stats.orders / totalOrders) * 100).toFixed(1);
                
                tbody.append(`
                    <tr>
                        <td>${bairro}</td>
                        <td>${stats.orders}</td>
                        <td>${this.formatCurrency(stats.revenue)}</td>
                        <td>${this.formatCurrency(avgTicket)}</td>
                        <td>${percentage}%</td>
                        <td>R$ 10,00</td>
                    </tr>
                `);
            });
    }

    updateAddressesTab() {
        const filteredData = this.filterDataByPeriod($('#dateFilter').val());
        
        // Agrupar dados por cliente e endereço
        const addressData = {};
        const uniqueAddresses = new Set();
        const uniqueCeps = new Set();
        let totalDeliveryFees = 0;
        let deliveryCount = 0;
        
        filteredData.forEach(order => {
            const key = `${order.customer}-${order.address}`;
            
            if (!addressData[key]) {
                addressData[key] = {
                    customer: order.customer,
                    address: order.address,
                    cep: order.cep || 'N/A',
                    bairro: order.bairro,
                    orders: 0,
                    lastOrder: order.date,
                    deliveryFee: order.deliveryFee || 10
                };
            }
            
            addressData[key].orders++;
            if (order.date > addressData[key].lastOrder) {
                addressData[key].lastOrder = order.date;
            }
            
            uniqueAddresses.add(order.address);
            if (order.cep) uniqueCeps.add(order.cep);
            totalDeliveryFees += order.deliveryFee || 10;
            deliveryCount++;
        });
        
        // Atualizar KPIs
        $('#totalAddresses').text(uniqueAddresses.size);
        $('#totalCeps').text(uniqueCeps.size);
        $('#avgDeliveryFee').text(this.formatCurrency(totalDeliveryFees / deliveryCount || 0));
        
        // Calcular clientes recorrentes (mais de 1 pedido)
        const repeatCustomers = Object.values(addressData).filter(addr => addr.orders > 1).length;
        $('#repeatCustomers').text(repeatCustomers);
        
        // Preencher tabela de endereços
        const tbody = $('#addressesTable tbody');
        tbody.empty();
        
        Object.values(addressData)
            .sort((a, b) => b.orders - a.orders)
            .forEach(addr => {
                const row = '<tr>' +
                    '<td><strong>' + addr.customer + '</strong></td>' +
                    '<td>' + addr.address + '</td>' +
                    '<td>' + addr.cep + '</td>' +
                    '<td><span class="badge badge-info">' + addr.bairro + '</span></td>' +
                    '<td><span class="badge badge-primary">' + addr.orders + '</span></td>' +
                    '<td>' + addr.lastOrder.toLocaleDateString('pt-BR') + '</td>' +
                    '<td>' + this.formatCurrency(addr.deliveryFee) + '</td>' +
                    '</tr>';
                tbody.append(row);
            });
    }

    handleNavigation(e) {
        e.preventDefault();
        const target = $(e.target).data('section');
        
        // Update active nav
        $('.nav-link').removeClass('active');
        $(e.target).addClass('active');
        
        // Update active section
        $('.content-section').removeClass('active');
        $(`#${target}-section`).addClass('active');
        
<<<<<<< HEAD
        // Load specific data for each section
        if (target === 'add-products') {
            this.updateAddedProductsTable();
        }
        
=======
>>>>>>> 3edbbce453ac1f435f1751291f1f4ea9d7e0ef96
        // Renderizar gerenciamento de produtos quando navegar para produtos
        if (target === 'products') {
            this.renderProductManagement();
        }
        
        // Atualizar aba de endereços quando navegar para locations
        if (target === 'locations') {
            this.updateAddressesTab();
        }
    }

    toggleSidebar() {
        $('.sidebar').toggleClass('show');
        $('#mobileOverlay').toggleClass('show');
        $('body').toggleClass('sidebar-open');
    }

    closeSidebar() {
        $('.sidebar').removeClass('show');
        $('#mobileOverlay').removeClass('show');
        $('body').removeClass('sidebar-open');
    }

    refreshData() {
        $('#refreshData').find('i').addClass('fa-spin');
        
        setTimeout(() => {
            this.realData = this.loadRealData();
            this.updateDashboard();
            this.updateCharts(this.filterDataByPeriod($('#dateFilter').val()));
            this.updateAddressesTab();
            $('#refreshData').find('i').removeClass('fa-spin');
        }, 1000);
    }

    clearAllData() {
        if (confirm('⚠️ ATENÇÃO!\n\nEsta ação irá apagar TODOS os dados de:\n• Pedidos\n• Clientes\n• Histórico de vendas\n\nEsta ação não pode ser desfeita!\n\nTem certeza que deseja continuar?')) {
            // Limpar todos os dados do localStorage
            localStorage.removeItem('lrGourmetOrders');
            localStorage.removeItem('lrGourmetCustomers');
            localStorage.removeItem('lancheriaCart');
            
            // Recarregar dados
            this.realData = this.loadRealData();
            this.updateDashboard();
            this.updateCharts(this.filterDataByPeriod($('#dateFilter').val()));
            this.updateAddressesTab();
            
            // Mostrar confirmação
            alert('✅ Todos os dados foram apagados com sucesso!');
        }
    }

<<<<<<< HEAD
    // ===== PRODUCT MANAGEMENT METHODS =====
    
    handleAddProduct(e) {
        e.preventDefault();
        
        const productData = {
            name: $('#productName').val().trim(),
            price: parseFloat($('#productPrice').val()),
            category: $('#productCategory').val(),
            description: $('#productDescription').val().trim(),
            image: $('#productImage').val().trim() || 'default-product.png',
            id: Date.now().toString()
        };
        
        // Validação básica
        if (!productData.name || !productData.price || !productData.category || !productData.description) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        if (productData.price <= 0) {
            alert('O preço deve ser maior que zero.');
            return;
        }
        
        // Salvar produto
        this.saveProduct(productData);
        this.updateAddedProductsTable();
        this.clearAddProductForm();
        
        alert('✅ Produto adicionado com sucesso!');
    }
    
    saveProduct(productData) {
        let products = JSON.parse(localStorage.getItem('lrGourmetAddedProducts')) || [];
        products.push(productData);
        localStorage.setItem('lrGourmetAddedProducts', JSON.stringify(products));
    }
    
    loadAddedProducts() {
        return JSON.parse(localStorage.getItem('lrGourmetAddedProducts')) || [];
    }
    
    updateAddedProductsTable() {
        const products = this.loadAddedProducts();
        const tbody = $('#addedProductsTableBody');
        tbody.empty();
        
        if (products.length === 0) {
            tbody.append('<tr><td colspan="6" class="text-center text-muted">Nenhum produto adicionado ainda.</td></tr>');
            return;
        }
        
        products.forEach((product, index) => {
            const row = `
                <tr>
                    <td><strong>${product.name}</strong></td>
                    <td><span class="badge badge-primary">${product.category}</span></td>
                    <td>${this.formatCurrency(product.price)}</td>
                    <td>${product.description}</td>
                    <td>${product.image}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="dashboardManager.removeProduct(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }
    
    removeProduct(index) {
        if (confirm('Tem certeza que deseja remover este produto?')) {
            let products = this.loadAddedProducts();
            products.splice(index, 1);
            localStorage.setItem('lrGourmetAddedProducts', JSON.stringify(products));
            this.updateAddedProductsTable();
            alert('✅ Produto removido com sucesso!');
        }
    }
    
    clearAddProductForm() {
        $('#addProductForm')[0].reset();
    }
    
    clearAllAddedProducts() {
        if (confirm('Tem certeza que deseja remover TODOS os produtos adicionados? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('lrGourmetAddedProducts');
            this.updateAddedProductsTable();
            alert('✅ Todos os produtos foram removidos!');
        }
    }
    
    exportAddedProducts() {
        const products = this.loadAddedProducts();
        if (products.length === 0) {
            alert('Nenhum produto para exportar.');
            return;
        }
        
        // Criar CSV
        let csv = 'Nome,Categoria,Preço,Descrição,Imagem\n';
        products.forEach(product => {
            csv += `"${product.name}","${product.category}","${product.price}","${product.description}","${product.image}"\n`;
        });
        
        // Download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'produtos_adicionados.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

=======
>>>>>>> 3edbbce453ac1f435f1751291f1f4ea9d7e0ef96
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
}

// Initialize dashboard when DOM is ready
$(document).ready(function() {
    window.dashboardManager = new DashboardManager();
});
