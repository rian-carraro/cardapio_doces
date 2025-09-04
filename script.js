// Configuração de horário de funcionamento
const openingTime = 7; // 10:00
const closingTime = 24; // 22:00
const closedDays = [0]; // Domingo (0 = domingo, 1 = segunda, etc.)

// Carrinho de Compras
let cart = JSON.parse(localStorage.getItem('lancheriaCart')) || [];
let isOpen = false;

// Verificar horário de funcionamento
function checkBusinessHours() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    
    // Verificar se é um dia de fechamento
    if (closedDays.includes(currentDay)) {
        return false;
    }
    
    // Verificar se está dentro do horário comercial
    if (currentHour >= openingTime && currentHour < closingTime) {
        return true;
    }
    
    return false;
}

// Atualizar status de abertura
function updateStatus() {
    isOpen = checkBusinessHours();
    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');
    
    if (isOpen) {
        statusBar.className = 'status-bar status-open';
        statusText.textContent = 'Estamos abertos!';
    } else {
        statusBar.className = 'status-bar status-closed';
        statusText.textContent = 'Estamos fechados';
    }
    
    statusBar.classList.remove('d-none');
}

// Função para formatar valores monetários
function formatMoney(value) {
    return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
}

// Função para salvar o carrinho no localStorage
function saveCart() {
    localStorage.setItem('lancheriaCart', JSON.stringify(cart));
}

// Função para atualizar o carrinho na interface
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    
    // Limpa os itens
    if (cartItems) cartItems.innerHTML = '';
    
    // Adiciona cada item
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        if (cartItems) {
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
        }
    });
    
    // Atualiza total e contador
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
    
    // Atualiza o carrinho ao carregar a página
    updateCart();
    
    // Adiciona eventos para os botões "Adicionar" - método melhorado
    function setupAddToCartButtons() {
        // Para cards na página inicial
        document.querySelectorAll('.card .add-to-cart').forEach(button => {
            // Remover event listeners antigos para evitar duplicação
            button.replaceWith(button.cloneNode(true));
        });
        
        // Adicionar novos event listeners
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
            // Remover event listeners antigos
            button.replaceWith(button.cloneNode(true));
        });
        
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
                    
                    // Validação imediata ao mudar o método de pagamento
                    if (this.value === 'Dinheiro' && trocoInput.value) {
                        validateTroco();
                    }
                }
            }
        });
        
        // Configura estado inicial
        if (paymentSelect.value) {
            paymentSelect.dispatchEvent(new Event('change'));
        }
    }
    
    // Validação do campo de troco
    if (trocoInput) {
        trocoInput.addEventListener('input', function() {
            // Formata o valor enquanto digita
            this.value = this.value.replace(/[^0-9.]/g, '');
        });
        
        trocoInput.addEventListener('blur', validateTroco);
    }
    
    // Função para validar o valor do troco
    function validateTroco() {
        if (paymentSelect && paymentSelect.value === 'Dinheiro' && trocoInput && trocoInput.value) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const trocoValue = parseFloat(trocoInput.value);
            
            if (isNaN(trocoValue) || trocoValue < total) {
                showAlert(`O valor para troco deve ser maior ou igual ao total (${formatMoney(total)})`, 'danger');
                trocoInput.focus();
                return false;
            }
        }
        return true;
    }
    
    // Enviar pedido via WhatsApp
    const sendOrderBtn = document.getElementById('sendOrderBtn');
    if (sendOrderBtn) {
        // Remover event listener antigo
        sendOrderBtn.replaceWith(sendOrderBtn.cloneNode(true));
        
        // Adicionar novo event listener
        document.getElementById('sendOrderBtn').addEventListener('click', function() {
            // Verificar se está aberto antes de enviar pedido
            if (!isOpen) {
                $('#closedModal').modal('show');
                return;
            }
            
            const form = document.getElementById('orderForm');
            if (!form) return;
            
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
            
            // Validação específica do troco
            if (paymentSelect && paymentSelect.value === 'Dinheiro' && !validateTroco()) {
                isValid = false;
            }
            
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
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\n*Total: ${formatMoney(total)}*\n\n`;
        message += `*Dados do Cliente:*\n`;
        message += `Nome: ${form.querySelector('input[type="text"]').value}\n`;
        message += `WhatsApp: ${form.querySelector('input[type="tel"]').value}\n`;
        message += `Endereço: ${form.querySelector('input[placeholder="Endereço Completo"]').value}\n`;
        message += `Pagamento: ${form.querySelector('select').value}\n`;
        
        if (form.querySelector('select').value === 'Dinheiro' && trocoInput && trocoInput.value) {
            message += `Troco para: ${formatMoney(trocoInput.value)}\n`;
        }
        
        message += `\n*Horário:* ${new Date().toLocaleString()}`;
        
        // Codifica a mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = '14998947758'; // Substitua pelo seu número
        
        // Abre o WhatsApp
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        
        // Limpa o carrinho após enviar
        cart = [];
        saveCart();
        updateCart();
        form.reset();
        $('#cartModal').modal('hide');
        showAlert('Pedido enviado com sucesso! Entraremos em contato para confirmação.');
    }
    
    // Configurar modal para produtos em dispositivos móveis
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.card, .list-group-item').forEach(item => {
            item.style.cursor = 'pointer';
            
            // Remover event listeners antigos
            item.replaceWith(item.cloneNode(true));
        });
        
        document.querySelectorAll('.card, .list-group-item').forEach(item => {
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
                    const addButton = document.getElementById('productModalAddBtn');
                    // Remover event listener antigo
                    addButton.replaceWith(addButton.cloneNode(true));
                    
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