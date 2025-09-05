// Configuração de horário de funcionamento por dia da semana
// 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
const businessHours = {
    0: { open: null, close: null },     // Domingo: fechado
    1: { open: 20, close: 22 },        // Segunda: 20h às 22h
    2: { open: 20, close: 22 },        // Terça: 20h às 22h
    3: { open: 20, close: 22 },        // Quarta: 20h às 22h
    4: { open: 13, close: 22 },        // Quinta: 20h às 22h
    5: { open: 9, close: 22 },        // Sexta: 20h às 22h
    6: { open: 10, close: 19 }         // Sábado: 10h às 19h
};

// Carrinho de Compras
let cart = JSON.parse(localStorage.getItem('lancheriaCart')) || [];
let isOpen = false;
let taxaEntrega = 0;
let bairroEntrega = "";

// Verificar horário de funcionamento
function checkBusinessHours() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Obter horários do dia atual
    const todayHours = businessHours[currentDay];
    
    // Se não há horário definido ou está fechado o dia todo
    if (!todayHours || todayHours.open === null) {
        return false;
    }
    
    // Converter hora atual para decimal (ex: 14:30 → 14.5)
    const currentTime = currentHour + (currentMinute / 60);
    
    // Verificar se está dentro do horário de funcionamento
    return currentTime >= todayHours.open && currentTime < todayHours.close;
}

// Atualizar status de abertura
function updateStatus() {
    isOpen = checkBusinessHours();
    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');
    
    if (isOpen) {
        statusBar.className = 'status-bar status-open';
        statusText.innerHTML = '<img src="https://img.icons8.com/ios-filled/20/40C057/checked--v1.png" alt="Aberto" style="margin-right: 8px; vertical-align: middle;"> Estamos abertos!';
    } else {
        statusBar.className = 'status-bar status-closed';
        statusText.innerHTML = '<img src="https://img.icons8.com/ios-filled/20/FF0000/cancel.png" alt="Fechado" style="margin-right: 8px; vertical-align: middle;"> Estamos fechados';
    }
    
    statusBar.classList.remove('d-none');
}

// Função para mostrar horários de funcionamento
function getBusinessHoursMessage() {
    const now = new Date();
    const currentDay = now.getDay();
    const todayHours = businessHours[currentDay];
    
    if (!todayHours || todayHours.open === null) {
        return "Fechado hoje";
    }
    
    return `Aberto hoje das ${todayHours.open}h às ${todayHours.close}h`;
}

// Função para formatar valores monetários
function formatMoney(value) {
    return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
}

// Função para salvar o carrinho no localStorage
function saveCart() {
    localStorage.setItem('lancheriaCart', JSON.stringify(cart));
}

// Função para formatar CEP
function formatarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return cep;
}

// Função para validar CEP
function validarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    return cep.length === 8;
}

// Função para converter CEP para número
function cepParaNumero(cep) {
    return parseInt(cep.replace(/\D/g, ''), 10);
}

// Função para validar se o CEP é de Jaú
function validarCEPJau(cep) {
    const cepNumero = cepParaNumero(cep);
    return cepNumero >= 17200000 && cepNumero <= 17214999;
}

// Função para mostrar mensagens de erro do CEP
function mostrarErroCEP(mensagem) {
    const cepInput = document.getElementById('cep');
    const errorDiv = document.getElementById('cepError') || document.createElement('div');
    
    errorDiv.id = 'cepError';
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = mensagem;
    
    if (!document.getElementById('cepError')) {
        cepInput.parentNode.appendChild(errorDiv);
    }
    
    cepInput.classList.add('is-invalid');
    document.getElementById('taxaEntregaField').style.display = 'none';
    taxaEntrega = 0;
    atualizarTotalComTaxa();
}

// Função para atualizar o total com a taxa de entrega
function atualizarTotalComTaxa() {
    const cartTotal = document.getElementById('cartTotal');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + taxaEntrega;
    
    if (cartTotal) {
        cartTotal.textContent = formatMoney(total);
    }
}

// Função para atualizar o carrinho na interface
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    
    // Limpa os itens
    if (cartItems) cartItems.innerHTML = '';
    
    // Adiciona cada item
    let subtotal = 0;
    
    if (cart.length === 0) {
        // Mostrar mensagem quando o carrinho estiver vazio
        cartItems.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <p class="text-muted">Seu carrinho está vazio</p>
            </div>
        `;
    } else {
        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-name">
                    ${item.name} 
                    <span class="badge badge-secondary">${item.quantity}x</span>
                </div>
                <div class="cart-item-price">
                    ${formatMoney(item.price * item.quantity)}
                </div>
                <div class="cart-item-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });
    }
    
    // Atualiza total e contador (agora inclui taxa de entrega)
    const total = subtotal + taxaEntrega;
    if (cartTotal) cartTotal.textContent = formatMoney(total);
    if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Adiciona eventos de remoção
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            saveCart();
            updateCart();
            showAlert('Item removido do carrinho!', 'danger');
        });
    });
    
    // Ajustar a altura máxima baseada no número de itens
    if (cart.length > 3) {
        cartItems.style.maxHeight = '300px';
    } else {
        cartItems.style.maxHeight = 'none';
    }
}
// Função para adicionar itens ao carrinho
function addToCart(name, price) {
    // Verificar se está aberto antes de adicionar ao carrinho
    if (!isOpen) {
        $('#closedModal').modal('show');
        return;
    }
    
    const item = {
        name: name,
        price: parseFloat(price),
        quantity: 1
    };
    
    const existingItem = cart.find(i => i.name === item.name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }
    
    saveCart();
    updateCart();
    showAlert(`${item.name} adicionado ao carrinho!`);
}

// Mostrar alerta
function showAlert(message, type = 'success') {
    // Remove alertas existentes
    document.querySelectorAll('.fixed-alert').forEach(el => el.remove());
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fixed-alert`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
        ${message}
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Configuração inicial quando o DOM é carregado
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar status de abertura
    updateStatus();
    
    // Adicionar informação de horário atual
    const statusInfo = document.createElement('div');
    statusInfo.className = 'status-info small mt-1';
    statusInfo.style.color = '#ffffff';
    statusInfo.style.fontWeight = '500';
    statusInfo.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
    statusInfo.textContent = getBusinessHoursMessage();
    document.getElementById('statusText').parentNode.appendChild(statusInfo);
    
    // Atualiza o carrinho ao carregar a página
    updateCart();
    
    // Adiciona eventos para os botões "Adicionar" - método melhorado
    function setupAddToCartButtons() {
        // Para cards na página inicial
        document.querySelectorAll('.card .add-to-cart').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Impedir que o evento se propague para o card
                const card = this.closest('.card');
                const name = card.querySelector('.card-title').textContent;
                const price = card.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.');
                addToCart(name, price);
            });
        });
        
        // Para itens na página de cardápio
        document.querySelectorAll('.list-group .add-to-cart').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Impedir que o evento se propague para o item da lista
                const name = this.getAttribute('data-name');
                const price = this.getAttribute('data-price');
                addToCart(name, price);
            });
        });
    }
    
    // Configurar os botões inicialmente
    setupAddToCartButtons();
    
    // Forma de pagamento e troco
    const paymentSelect = document.querySelector('#orderForm select');
    const trocoInput = document.querySelector('#changeField input');
    
    if (paymentSelect) {
        paymentSelect.addEventListener('change', function() {
            const changeField = document.getElementById('changeField');
            if (changeField) {
                changeField.style.display = this.value === 'Dinheiro' ? 'block' : 'none';
                if (trocoInput) {
                    trocoInput.required = this.value === 'Dinheiro';
                }
            }
        });
        
        // Configura estado inicial
        paymentSelect.dispatchEvent(new Event('change'));
    }
    
    // Validação do campo de troco
    if (trocoInput) {
        trocoInput.addEventListener('input', function() {
            // Formata o valor enquanto digita
            this.value = this.value.replace(/[^0-9.]/g, '');
        });
    }
    
    // Adicionar evento para o campo CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            // Formatar CEP enquanto digita
            this.value = formatarCEP(this.value);
            
            // Remove mensagens de erro anteriores
            this.classList.remove('is-invalid');
            const errorDiv = document.getElementById('cepError');
            if (errorDiv) errorDiv.remove();
            
            // Validar e calcular taxa quando o CEP estiver completo
            if (validarCEP(this.value)) {
                if (validarCEPJau(this.value)) {
                    // Simular cálculo de taxa (substitua pela sua função real)
                    taxaEntrega = 8.00;
                    bairroEntrega = "JARDIM SAO JORGE";
                    
                    // Mostrar a taxa de entrega
                    document.getElementById('taxaEntregaValor').textContent = formatMoney(taxaEntrega);
                    document.getElementById('taxaEntregaBairro').textContent = bairroEntrega;
                    document.getElementById('taxaEntregaField').style.display = 'block';
                    
                    // Atualizar o total
                    atualizarTotalComTaxa();
                } else {
                    mostrarErroCEP('Atendemos apenas na cidade de Jaú/SP');
                }
            } else {
                // Esconder a taxa se o CEP não for válido
                document.getElementById('taxaEntregaField').style.display = 'none';
                taxaEntrega = 0;
                atualizarTotalComTaxa();
            }
        });
        
        cepInput.addEventListener('blur', function() {
            if (!validarCEP(this.value)) {
                mostrarErroCEP('CEP inválido');
            } else if (!validarCEPJau(this.value)) {
                mostrarErroCEP('Atendemos apenas na cidade de Jaú/SP');
            }
        });
    }
    
    // Enviar pedido via WhatsApp
    const sendOrderBtn = document.getElementById('sendOrderBtn');
    if (sendOrderBtn) {
        sendOrderBtn.addEventListener('click', function() {
            // Verificar se está aberto antes de enviar pedido
            if (!isOpen) {
                $('#closedModal').modal('show');
                return;
            }
            
            const form = document.getElementById('orderForm');
            if (!form) return;
            
            // Validação do CEP
            const cepInput = document.getElementById('cep');
            if (!validarCEP(cepInput.value)) {
                mostrarErroCEP('Por favor, digite um CEP válido!');
                cepInput.focus();
                return;
            }
            
            if (!validarCEPJau(cepInput.value)) {
                mostrarErroCEP('Atendemos apenas na cidade de Jaú/SP');
                cepInput.focus();
                return;
            }
            
            // Validação básica dos campos
            const inputs = form.querySelectorAll('input, select');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.required && !input.value) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                showAlert('Preencha todos os campos obrigatórios corretamente!', 'danger');
                return;
            }
            
            if (cart.length === 0) {
                showAlert('Adicione itens ao carrinho primeiro!', 'danger');
                return;
            }
            
            // Monta mensagem para WhatsApp
            sendWhatsAppMessage();
        });
    }
    
    // Função para enviar mensagem pelo WhatsApp
    function sendWhatsAppMessage() {
        const form = document.getElementById('orderForm');
        let message = `*NOVO PEDIDO - ${form.querySelector('input[type="text"]').value}*\n\n`;
        message += `*Itens:*\n`;
        
        cart.forEach(item => {
            message += `- ${item.quantity}x ${item.name} (${formatMoney(item.price * item.quantity)})\n`;
        });
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + taxaEntrega;
        
        message += `\n*Subtotal: ${formatMoney(subtotal)}*\n`;
        message += `*Taxa de entrega: ${formatMoney(taxaEntrega)} (${bairroEntrega})*\n`;
        message += `*Total: ${formatMoney(total)}*\n\n`;
        message += `*Dados do Cliente:*\n`;
        message += `Nome: ${form.querySelector('input[type="text"]').value}\n`;
        message += `WhatsApp: ${form.querySelector('input[type="tel"]').value}\n`;
        message += `Endereço: ${form.querySelector('input[placeholder="Endereço Completo"]').value}\n`;
        message += `CEP: ${document.getElementById('cep').value}\n`;
        message += `Bairro: ${bairroEntrega}\n`;
        message += `Pagamento: ${form.querySelector('select').value}\n`;
        
        if (form.querySelector('select').value === 'Dinheiro' && trocoInput && trocoInput.value) {
            message += `Troco para: ${formatMoney(trocoInput.value)}\n`;
        }
        
        message += `\n*Horário:* ${new Date().toLocaleString()}`;
        
        // Codifica a mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = '14998947758';
        
        // Abre o WhatsApp
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        
        // Limpa o carrinho após enviar
        cart = [];
        taxaEntrega = 0;
        bairroEntrega = "";
        saveCart();
        updateCart();
        form.reset();
        document.getElementById('taxaEntregaField').style.display = 'none';
        $('#cartModal').modal('hide');
        showAlert('Pedido enviado com sucesso! Entraremos em contato para confirmação.');
    }
    
    // Configurar modal para produtos em dispositivos móveis
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.card, .list-group-item').forEach(item => {
            item.style.cursor = 'pointer';
            
            item.addEventListener('click', function(e) {
                // Não abrir modal se clicar no botão de adicionar
                if (e.target.classList.contains('add-to-cart') || 
                    e.target.closest('.add-to-cart')) {
                    return;
                }
                
                const card = this.closest('.card') || this;
                const title = card.querySelector('.card-title') || card.querySelector('h5');
                const description = card.querySelector('.card-text') || card.querySelector('p');
                const price = card.querySelector('.price');
                const image = card.querySelector('.card-img-top') || card.querySelector('img');
                
                if (title && description && price) {
                    document.getElementById('productModalTitle').textContent = title.textContent;
                    document.getElementById('productModalDescription').textContent = description.textContent;
                    document.getElementById('productModalPrice').textContent = price.textContent;
                    
                    if (image) {
                        document.getElementById('productModalImage').src = image.src;
                        document.getElementById('productModalImage').alt = image.alt;
                    }
                    
                    // Configurar botão de adicionar
                    document.getElementById('productModalAddBtn').onclick = function() {
                        const priceValue = price.textContent.replace('R$ ', '').replace(',', '.');
                        addToCart(title.textContent, priceValue);
                        $('#productModal').modal('hide');
                    };
                    
                    $('#productModal').modal('show');
                }
            });
        });
    }
});

// Verifica se há itens no carrinho ao carregar a página
window.addEventListener('load', function() {
    if (cart.length > 0) {
        updateCart();
    }
});