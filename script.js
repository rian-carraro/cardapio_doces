// Configuração de horário de funcionamento por dia da semana
// 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
const businessHours = {
    0: { open: null, close: null },   // Domingo: fechado
    1: { open: 10, close: 22 },       // Segunda: 10h às 22h
    2: { open: 10, close: 22 },       // Terça: 10h às 22h
    3: { open: 10, close: 22 },       // Quarta: 10h às 22h
    4: { open: 10, close: 22 },       // Quinta: 10h às 22h
    5: { open: 10, close: 22 },       // Sexta: 10h às 22h
    6: { open: 11, close: 23 }        // Sábado: 11h às 23h
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
    if (!statusBar || !statusText) {
        return; // não há barra de status nesta página
    }
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
    return cepNumero >= 17200001 && cepNumero <= 17229999;
}

// Função para validar nome (apenas letras)
function validarNome(nome) {
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    return regex.test(nome.trim()) && nome.trim().length > 0;
}

// Função para validar WhatsApp (apenas números)
function validarWhatsApp(whatsapp) {
    const regex = /^[0-9]+$/;
    const numeroLimpo = whatsapp.replace(/\D/g, '');
    return regex.test(numeroLimpo) && numeroLimpo.length >= 10 && numeroLimpo.length <= 11;
}

// Função para validar endereço (letras e números)
function validarEndereco(endereco) {
    const regex = /^[A-Za-zÀ-ÿ0-9\s,.-]+$/;
    return regex.test(endereco.trim()) && endereco.trim().length > 0;
}

// Função para validar valor numérico (troco)
function validarValorNumerico(valor) {
    const regex = /^[0-9.,]+$/;
    const valorLimpo = valor.replace(/[^\d.,]/g, '');
    return regex.test(valorLimpo) && !isNaN(parseFloat(valorLimpo.replace(',', '.')));
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

// Função para atualizar o carrinho
function updateCart() {
    updateCartDisplay();
    updateCartCount();
}

// Função para atualizar contador do carrinho
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Função para atualizar quantidade de item no carrinho
function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    if (cart[index]) {
        cart[index].quantity = newQuantity;
        saveCart();
        updateCart();
    }
}

// Função para remover item do carrinho
function removeFromCart(index) {
    if (cart[index]) {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        updateCart();
        showAlert(`${itemName} removido do carrinho!`, 'danger');
    }
}

// Função para atualizar a exibição do carrinho
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartItems.innerHTML += `
<<<<<<< HEAD
            <div class="cart-item mb-3 p-3 border rounded">
                <div class="row align-items-center">
                    <div class="col-12 mb-2">
                        <h6 class="mb-0 font-weight-bold">${item.name}</h6>
                    </div>
                    <div class="col-6">
                        <small class="text-muted">R$ ${item.price.toFixed(2)} cada</small>
                    </div>
                    <div class="col-6 text-right">
                        <strong class="text-primary">R$ ${itemTotal.toFixed(2)}</strong>
                    </div>
                    <div class="col-12 mt-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="quantity-controls d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                                <span class="mx-3 font-weight-bold">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                            </div>
                            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">
                                <i class="fas fa-trash"></i> Remover
                            </button>
                        </div>
                    </div>
=======
            <div class="cart-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                <div class="item-info">
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">R$ ${item.price.toFixed(2)} cada</small>
                </div>
                <div class="item-controls d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    <button class="btn btn-sm btn-danger ml-2" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="item-total">
                    <strong>R$ ${itemTotal.toFixed(2)}</strong>
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
                </div>
            </div>
        `;
    });
    
    // Atualiza total e contador (agora inclui taxa de entrega)
    const total = subtotal + taxaEntrega;
    if (cartTotal) cartTotal.textContent = formatMoney(total);
    
    // Atualizar contador do carrinho via função
    updateCartCount();
    
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

// Função para verificar disponibilidade do produto
function isProductAvailable(productName) {
    const availability = JSON.parse(localStorage.getItem('lrGourmetProductAvailability')) || {};
    return availability[productName] !== false; // Por padrão, produtos são disponíveis
}

// Função para adicionar produto ao carrinho
function addToCart(name, price) {
    // Verificar se o produto está disponível
    if (!isProductAvailable(name)) {
        alert(`❌ Desculpe, o produto "${name}" não está disponível no momento.`);
        return;
    }
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    updateCart();
    saveCart();
    showAlert(`${name} adicionado ao carrinho!`);
}

// Aplica o estado visual/funcional de disponibilidade aos itens do cardápio
function applyProductAvailabilityState() {
    const availability = JSON.parse(localStorage.getItem('lrGourmetProductAvailability')) || {};
    document.querySelectorAll('.list-group-item').forEach(itemEl => {
        const btn = itemEl.querySelector('.add-to-cart');
        if (!btn) return;
        const productName = btn.getAttribute('data-name');
        const isAvailable = availability[productName] !== false;
        if (!isAvailable) {
            itemEl.classList.add('product-unavailable');
            btn.classList.add('disabled');
            btn.setAttribute('disabled', 'disabled');
            btn.classList.add('d-none');

            // Adiciona selo "Indisponível" se ainda não existir
            if (!itemEl.querySelector('.unavailable-badge')) {
                const badge = document.createElement('span');
                badge.className = 'badge badge-secondary unavailable-badge';
                badge.textContent = 'Indisponível';
                // insere próximo ao fim do item, antes de possíveis controles
                const info = itemEl.querySelector('.product-info') || itemEl;
                info.appendChild(badge);
            }
        } else {
            itemEl.classList.remove('product-unavailable');
            btn.classList.remove('disabled');
            btn.removeAttribute('disabled');
            btn.classList.remove('d-none');

            // Remove selo se existir
            const badge = itemEl.querySelector('.unavailable-badge');
            if (badge) badge.remove();
        }
    });
}

// Atualiza imediatamente quando disponibilidade muda (evento custom do dashboard)
window.addEventListener('productAvailabilityChanged', function() {
    applyProductAvailabilityState();
});

// Sincroniza entre abas: quando localStorage muda
window.addEventListener('storage', function(e) {
    if (e.key === 'lrGourmetProductAvailability') {
        applyProductAvailabilityState();
    }
});

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
    // Event listeners para botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            addToCart(name, price);
        });
    });
    // Atualizar status de abertura
    updateStatus();

    // Inicializar carrossel (Bootstrap)
    if (typeof $ === 'function' && $('#mainCarousel').length) {
        $('#mainCarousel').carousel({
            interval: 4000,
            pause: 'hover',
            ride: false
        });
    }
    
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

    // Aplicar estado de disponibilidade aos produtos (home/cardápio)
    applyProductAvailabilityState();
    
    // Event listener para campo de troco
    const trocoInput = document.querySelector('input[placeholder="Valor para troco"]');
    if (trocoInput) {
        trocoInput.addEventListener('input', function() {
            let value = this.value.replace(/[^\d.,]/g, '');
            value = value.replace(',', '.');
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            this.value = value;
            
            clearTimeout(this.formatTimeout);
            this.formatTimeout = setTimeout(() => {
                if (this.value && !this.value.startsWith('R$')) {
                    const numericValue = parseFloat(this.value);
                    if (!isNaN(numericValue)) {
                        this.value = `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
                    }
                }
            }, 1000);
        });
        
        trocoInput.addEventListener('focus', function() {
            if (this.value.startsWith('R$')) {
                this.value = this.value.replace('R$ ', '').replace(',', '.');
<<<<<<< HEAD
            }
        });
        
        trocoInput.addEventListener('blur', function() {
            validarValorTroco();
        });
    }
    
    // Função para validar valor do troco
    function validarValorTroco() {
        const trocoInput = document.getElementById('changeField');
        if (!trocoInput || !trocoInput.style.display || trocoInput.style.display === 'none') {
            return true;
        }
        
        const trocoValue = document.querySelector('input[placeholder="Valor para troco"]');
        if (!trocoValue || !trocoValue.value) {
            return true;
        }
        
        // Remove R$ e converte para número
        const valorTroco = parseFloat(trocoValue.value.replace('R$ ', '').replace(',', '.'));
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + taxaEntrega;
        
        if (isNaN(valorTroco)) {
            mostrarErroTroco('Por favor, digite um valor válido');
            return false;
        }
        
        if (valorTroco < total) {
            mostrarErroTroco(`O valor para troco (R$ ${valorTroco.toFixed(2).replace('.', ',')}) deve ser maior que o total do pedido (R$ ${total.toFixed(2).replace('.', ',')})`);
            return false;
        }
        
        // Remove erro se válido
        trocoValue.classList.remove('is-invalid');
        const errorDiv = document.getElementById('trocoError');
        if (errorDiv) errorDiv.remove();
        
        return true;
    }
    
    // Função para mostrar erro no campo troco
    function mostrarErroTroco(mensagem) {
        const trocoValue = document.querySelector('input[placeholder="Valor para troco"]');
        if (trocoValue) {
            trocoValue.classList.add('is-invalid');
            
            // Remove erro anterior
            const errorDiv = document.getElementById('trocoError');
            if (errorDiv) errorDiv.remove();
            
            // Adiciona novo erro
            const errorElement = document.createElement('div');
            errorElement.id = 'trocoError';
            errorElement.className = 'invalid-feedback';
            errorElement.textContent = mensagem;
            trocoValue.parentNode.appendChild(errorElement);
        }
    }
    
    // Mostrar campos adicionais quando começar a digitar endereço
    const enderecoInput = document.getElementById('enderecoInput');
    if (enderecoInput) {
        enderecoInput.addEventListener('input', function() {
            const hasText = this.value.trim().length > 0;
            const bairroField = document.getElementById('bairroField');
            const numeroField = document.getElementById('numeroField');
            if (bairroField) bairroField.style.display = hasText ? 'block' : 'none';
            if (numeroField) numeroField.style.display = hasText ? 'block' : 'none';
            const bairroInput = document.getElementById('bairroInput');
            const numeroInput = document.getElementById('numeroInput');
            if (bairroInput) bairroInput.required = hasText;
            if (numeroInput) numeroInput.required = hasText;
        });
    }

    // Mostrar/ocultar campo de troco baseado na forma de pagamento
    const paymentSelect = document.getElementById('paymentSelect');
    if (paymentSelect) {
        paymentSelect.addEventListener('change', function() {
            const changeField = document.getElementById('changeField');
            if (changeField) {
                if (this.value === 'Dinheiro') {
                    changeField.style.display = 'block';
                } else {
                    changeField.style.display = 'none';
                }
            }
        });
    }

=======
            }
        });
        
        trocoInput.addEventListener('blur', function() {
            validarValorTroco();
        });
    }
    
    // Função para validar valor do troco
    function validarValorTroco() {
        const trocoInput = document.getElementById('changeField');
        if (!trocoInput || !trocoInput.style.display || trocoInput.style.display === 'none') {
            return true;
        }
        
        const trocoValue = document.querySelector('input[placeholder="Valor para troco"]');
        if (!trocoValue || !trocoValue.value) {
            return true;
        }
        
        // Remove R$ e converte para número
        const valorTroco = parseFloat(trocoValue.value.replace('R$ ', '').replace(',', '.'));
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + taxaEntrega;
        
        if (isNaN(valorTroco)) {
            mostrarErroTroco('Por favor, digite um valor válido');
            return false;
        }
        
        if (valorTroco < total) {
            mostrarErroTroco(`O valor para troco (R$ ${valorTroco.toFixed(2).replace('.', ',')}) deve ser maior que o total do pedido (R$ ${total.toFixed(2).replace('.', ',')})`);
            return false;
        }
        
        // Remove erro se válido
        trocoValue.classList.remove('is-invalid');
        const errorDiv = document.getElementById('trocoError');
        if (errorDiv) errorDiv.remove();
        
        return true;
    }
    
    // Função para mostrar erro no campo troco
    function mostrarErroTroco(mensagem) {
        const trocoValue = document.querySelector('input[placeholder="Valor para troco"]');
        if (trocoValue) {
            trocoValue.classList.add('is-invalid');
            
            // Remove erro anterior
            const errorDiv = document.getElementById('trocoError');
            if (errorDiv) errorDiv.remove();
            
            // Adiciona novo erro
            const errorElement = document.createElement('div');
            errorElement.id = 'trocoError';
            errorElement.className = 'invalid-feedback';
            errorElement.textContent = mensagem;
            trocoValue.parentNode.appendChild(errorElement);
        }
    }
    
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
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
                    // Calcular taxa e bairro usando a função do entregas.js
                    const resultado = calcularTaxaEntrega(this.value);
                    taxaEntrega = resultado.taxa;
                    bairroEntrega = resultado.mensagem || "Jaú/SP";
                    
                    // Mostrar a taxa de entrega
                    document.getElementById('taxaEntregaValor').textContent = formatMoney(taxaEntrega);
                    document.getElementById('taxaEntregaBairro').textContent = `- ${bairroEntrega}`;
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
            
            // Validação completa de todos os campos obrigatórios
            let isValid = true;
            let camposVazios = [];
            
            // Validar Nome
            const nomeInput = document.getElementById('nomeInput');
            if (!nomeInput.value.trim()) {
                nomeInput.classList.add('is-invalid');
                camposVazios.push('Nome');
                isValid = false;
            } else {
                nomeInput.classList.remove('is-invalid');
            }
            
            // Validar Ponto de Referência
            const referenciaInput = document.getElementById('referenciaInput');
            if (!referenciaInput.value.trim()) {
                referenciaInput.classList.add('is-invalid');
                camposVazios.push('Ponto de Referência');
                isValid = false;
            } else {
                referenciaInput.classList.remove('is-invalid');
            }
            
            // Validar Endereço
            const enderecoInput = document.getElementById('enderecoInput');
            if (!enderecoInput.value.trim()) {
                enderecoInput.classList.add('is-invalid');
                camposVazios.push('Endereço');
                isValid = false;
            } else {
                enderecoInput.classList.remove('is-invalid');
<<<<<<< HEAD
                
                // Se endereço foi preenchido, validar campos obrigatórios adicionais
                const bairroInput = document.getElementById('bairroInput');
                const numeroInput = document.getElementById('numeroInput');
                
                if (bairroInput && bairroInput.style.display !== 'none') {
                    if (!bairroInput.value.trim()) {
                        bairroInput.classList.add('is-invalid');
                        camposVazios.push('Bairro');
                        isValid = false;
                    } else {
                        bairroInput.classList.remove('is-invalid');
                    }
                }
                
                if (numeroInput && numeroInput.style.display !== 'none') {
                    if (!numeroInput.value.trim()) {
                        numeroInput.classList.add('is-invalid');
                        camposVazios.push('Número da casa');
                        isValid = false;
                    } else {
                        numeroInput.classList.remove('is-invalid');
                    }
                }
=======
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
            }
            
            // Validar CEP
            const cepInput = document.getElementById('cep');
            if (!cepInput.value.trim()) {
                cepInput.classList.add('is-invalid');
                camposVazios.push('CEP');
                isValid = false;
            } else if (!validarCEP(cepInput.value)) {
                mostrarErroCEP('Por favor, digite um CEP válido!');
                cepInput.focus();
                return;
            } else if (!validarCEPJau(cepInput.value)) {
                mostrarErroCEP('Atendemos apenas na cidade de Jaú/SP');
                cepInput.focus();
                return;
            } else {
                cepInput.classList.remove('is-invalid');
            }
            
            // Validar Forma de Pagamento
            const paymentSelect = document.getElementById('paymentSelect');
            if (!paymentSelect.value) {
                paymentSelect.classList.add('is-invalid');
                camposVazios.push('Forma de Pagamento');
                isValid = false;
            } else {
                paymentSelect.classList.remove('is-invalid');
            }
            
            // Validar valor do troco se pagamento for dinheiro
            if (paymentSelect.value === 'Dinheiro') {
                if (!validarValorTroco()) {
                    isValid = false;
                }
            }
            
            // Se há campos inválidos, mostrar erro e parar
            if (!isValid) {
                if (camposVazios.length > 0) {
                    showAlert(`Por favor, preencha os seguintes campos: ${camposVazios.join(', ')}`, 'danger');
                }
                return;
            }
            
            // Se chegou até aqui, todos os campos são válidos
            showConfirmationModal();
        });
    }
    
    // Configurar validação de campos
    setupFieldValidation();
});

// Função para salvar pedido no histórico
function saveOrderToHistory(orderData) {
    const orderHistory = JSON.parse(localStorage.getItem('lrGourmetOrders')) || [];
    const orderId = 'LR' + Date.now().toString().slice(-6);
    
    const order = {
            id: orderId,
            customer: orderData.customer,
            items: orderData.items,
            subtotal: orderData.subtotal,
            deliveryFee: orderData.deliveryFee,
            total: orderData.total,
            payment: orderData.payment,
            address: orderData.address,
            reference: orderData.reference,
            cep: orderData.cep,
            bairro: orderData.bairro,
            observations: orderData.observations,
            date: new Date(),
            status: 'Pendente'
        };
        
        orderHistory.push(order);
        localStorage.setItem('lrGourmetOrders', JSON.stringify(orderHistory));
        
        // Salvar dados do cliente
        saveCustomerData(orderData);
        
        return orderId;
    }
    
    // Função para salvar dados do cliente
    function saveCustomerData(orderData) {
        let customers = JSON.parse(localStorage.getItem('lrGourmetCustomers')) || [];
        
        const existingCustomer = customers.find(c => c.name === orderData.customer);
        
        if (existingCustomer) {
            existingCustomer.totalOrders += 1;
            existingCustomer.totalSpent += orderData.total;
            existingCustomer.lastOrder = new Date();
            existingCustomer.bairro = orderData.bairro;
        } else {
            customers.push({
                name: orderData.customer,
                address: orderData.address,
                reference: orderData.reference,
                cep: orderData.cep,
                bairro: orderData.bairro,
                totalOrders: 1,
                totalSpent: orderData.total,
                firstOrder: new Date(),
                lastOrder: new Date()
            });
        }
        
        localStorage.setItem('lrGourmetCustomers', JSON.stringify(customers));
    }

    // Função para enviar mensagem pelo WhatsApp
    function sendWhatsAppMessage() {
        const form = document.getElementById('orderForm');
        const customerName = document.getElementById('nomeInput').value;
        const customerAddress = document.getElementById('enderecoInput').value;
<<<<<<< HEAD
        const customerBairro = document.getElementById('bairroInput') ? document.getElementById('bairroInput').value : '';
        const customerNumero = document.getElementById('numeroInput') ? document.getElementById('numeroInput').value : '';
=======
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
        const customerReference = document.getElementById('referenciaInput').value;
        const customerCep = document.getElementById('cep').value;
        const paymentMethod = document.getElementById('paymentSelect').value;
        const observations = document.getElementById('observacoesInput').value;
        
        let message = `*NOVO PEDIDO - ${customerName}*\n\n`;
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
        message += `Nome: ${customerName}\n`;
        message += `Ponto de Referência: ${customerReference}\n`;
        message += `Endereço: ${customerAddress}\n`;
<<<<<<< HEAD
        if (customerBairro) message += `Bairro: ${customerBairro}\n`;
        if (customerNumero) message += `Número: ${customerNumero}\n`;
        message += `CEP: ${customerCep}\n`;
        message += `Bairro (Taxa): ${bairroEntrega}\n`;
=======
        message += `CEP: ${customerCep}\n`;
        message += `Bairro: ${bairroEntrega}\n`;
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
        message += `Pagamento: ${paymentMethod}\n`;
        
        // Adicionar observações se preenchidas
        if (observations.trim()) {
            message += `Observações: ${observations}\n`;
        }
        
        const trocoInput = document.querySelector('#changeField input');
        if (paymentMethod === 'Dinheiro' && trocoInput && trocoInput.value) {
            const valorTroco = parseFloat(trocoInput.value.replace('R$ ', '').replace(',', '.'));
            const trocoDevolver = valorTroco - total;
            
            message += `\n*💰 INFORMAÇÕES DE PAGAMENTO:*\n`;
            message += `Valor do pedido: ${formatMoney(total)}\n`;
            message += `Cliente pagará: ${formatMoney(valorTroco)}\n`;
            message += `Troco a devolver: ${formatMoney(trocoDevolver)}\n`;
        }
        
        message += `\n*Horário:* ${new Date().toLocaleString()}`;
        
        // Salvar pedido no histórico ANTES de enviar
        const orderData = {
            customer: customerName,
            items: [...cart],
            subtotal: subtotal,
            deliveryFee: taxaEntrega,
            total: total,
            payment: paymentMethod,
            address: customerAddress,
<<<<<<< HEAD
            bairro: customerBairro,
            numero: customerNumero,
            reference: customerReference,
            cep: customerCep,
            bairroTaxa: bairroEntrega,
=======
            reference: customerReference,
            cep: customerCep,
            bairro: bairroEntrega,
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
            observations: observations
        };
        
        const orderId = saveOrderToHistory(orderData);
        
        const whatsappUrl = `https://wa.me/5514998947758?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Limpar carrinho após envio
        cart = [];
        saveCart();
        updateCart();
        $('#confirmationModal').modal('hide');
        $('#cartModal').modal('hide');
        showAlert(`Pedido ${orderId} enviado com sucesso!`, 'success');
    }
    
    // Função para mostrar modal de confirmação
    function showConfirmationModal() {
        // Preencher dados do pedido
        const confirmOrderItems = document.getElementById('confirmOrderItems');
        let itemsHtml = '';
        
        cart.forEach(item => {
            itemsHtml += `
                <div class="d-flex justify-content-between mb-1">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>${formatMoney(item.price * item.quantity)}</span>
                </div>
            `;
        });
        confirmOrderItems.innerHTML = itemsHtml;
        
        // Calcular totais
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + taxaEntrega;
        document.getElementById('confirmTotal').textContent = formatMoney(total);
        
        // Preencher dados do cliente
        const confirmCustomerData = document.getElementById('confirmCustomerData');
        const paymentMethod = document.getElementById('paymentSelect').value;
        const trocoInput = document.querySelector('#changeField input');
        
        let customerHtml = `
            <p><strong>Nome:</strong> ${document.getElementById('nomeInput').value}</p>
            <p><strong>Endereço:</strong> ${document.getElementById('enderecoInput').value}</p>
<<<<<<< HEAD
        `;
        
        const bairroInput = document.getElementById('bairroInput');
        const numeroInput = document.getElementById('numeroInput');
        if (bairroInput && bairroInput.value) {
            customerHtml += `<p><strong>Bairro:</strong> ${bairroInput.value}</p>`;
        }
        if (numeroInput && numeroInput.value) {
            customerHtml += `<p><strong>Número:</strong> ${numeroInput.value}</p>`;
        }
        
        customerHtml += `
            <p><strong>Referência:</strong> ${document.getElementById('referenciaInput').value}</p>
            <p><strong>CEP:</strong> ${document.getElementById('cep').value}</p>
            <p><strong>Bairro (Taxa):</strong> ${bairroEntrega}</p>
=======
            <p><strong>Referência:</strong> ${document.getElementById('referenciaInput').value}</p>
            <p><strong>CEP:</strong> ${document.getElementById('cep').value}</p>
            <p><strong>Bairro:</strong> ${bairroEntrega}</p>
>>>>>>> 6edad049bbe60ad5af6ee02ee3b69a69d9f2f096
            <p><strong>Pagamento:</strong> ${paymentMethod}</p>
        `;
        
        if (paymentMethod === 'Dinheiro' && trocoInput && trocoInput.value) {
            const valorTroco = parseFloat(trocoInput.value.replace('R$ ', '').replace(',', '.'));
            const trocoDevolver = valorTroco - total;
            customerHtml += `<p><strong>Troco para:</strong> ${formatMoney(valorTroco)}</p>`;
            customerHtml += `<p><strong>Troco a devolver:</strong> ${formatMoney(trocoDevolver)}</p>`;
        }
        
        const observacoesConfirm = document.getElementById('observacoesInput').value;
        if (observacoesConfirm.trim()) {
            customerHtml += `<p><strong>Observações:</strong> ${observacoesConfirm}</p>`;
        }
        
        confirmCustomerData.innerHTML = customerHtml;
        
        // Mostrar modal de confirmação
        $('#confirmationModal').modal('show');
        
        // Configurar event listeners após mostrar o modal
        setTimeout(() => {
            setupConfirmationModalListeners();
        }, 100);
    }
    
    // Função para configurar event listeners do modal de confirmação
    function setupConfirmationModalListeners() {
        // Remove listeners anteriores para evitar duplicação
        const editDataBtn = document.getElementById('editDataBtn');
        const confirmSendBtn = document.getElementById('confirmSendBtn');
        
        if (editDataBtn) {
            // Remove listener anterior se existir
            editDataBtn.removeEventListener('click', editDataHandler);
            editDataBtn.addEventListener('click', editDataHandler);
        }
        
        if (confirmSendBtn) {
            // Remove listener anterior se existir
            confirmSendBtn.removeEventListener('click', confirmSendHandler);
            confirmSendBtn.addEventListener('click', confirmSendHandler);
        }
    }
    
    // Handlers separados para facilitar remoção
    function editDataHandler() {
        $('#confirmationModal').modal('hide');
    }
    
    function confirmSendHandler() {
        sendWhatsAppMessage();
    }
    
    // Configurar validação de campos
    setupFieldValidation();


// Função para configurar validação de campos
function setupFieldValidation() {
    // Validação do campo Nome
    const nomeInput = document.getElementById('nomeInput');
    if (nomeInput) {
        nomeInput.addEventListener('input', function() {
            const valorOriginal = this.value;
            // Remove caracteres não permitidos (apenas letras e espaços)
            let valor = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
            
            // Se houve remoção de caracteres, mostra alerta
            if (valorOriginal !== valor) {
                showAlert('Este campo aceita apenas letras!', 'warning');
            }
            
            this.value = valor;
        });
    }
    
    // Validação do campo Ponto de Referência
    const referenciaInput = document.getElementById('referenciaInput');
    if (referenciaInput) {
        referenciaInput.addEventListener('input', function() {
            const valorOriginal = this.value;
            // Remove caracteres especiais não permitidos (permite letras, números e pontuação básica)
            let valor = this.value.replace(/[^A-Za-zÀ-ÿ0-9\s,.-]/g, '');
            
            // Se houve remoção de caracteres, mostra alerta
            if (valorOriginal !== valor) {
                showAlert('Este campo aceita apenas letras, números e pontuação básica!', 'warning');
            }
            
            this.value = valor;
        });
    }
    
    // Validação do campo Endereço
    const enderecoInput = document.getElementById('enderecoInput');
    if (enderecoInput) {
        enderecoInput.addEventListener('input', function() {
            const valorOriginal = this.value;
            // Remove caracteres especiais não permitidos
            let valor = this.value.replace(/[^A-Za-zÀ-ÿ0-9\s,.-]/g, '');
            
            // Se houve remoção de caracteres, mostra alerta
            if (valorOriginal !== valor) {
                showAlert('Este campo aceita apenas letras, números e pontuação básica!', 'warning');
            }
            
            this.value = valor;
        });
    }
    
    // Validação do campo CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            const valorOriginal = this.value;
            // Remove caracteres não numéricos
            let valor = this.value.replace(/\D/g, '');
            
            // Se houve remoção de caracteres, mostra alerta
            if (valorOriginal !== valor && valorOriginal !== formatarCEP(valor)) {
                showAlert('Este campo aceita apenas números!', 'warning');
            }
            
            this.value = formatarCEP(valor);
        });
    }
    
    // Validação do campo Troco
    const trocoInput = document.getElementById('trocoInput');
    if (trocoInput) {
        trocoInput.addEventListener('input', function() {
            const valorOriginal = this.value;
            // Remove caracteres não numéricos exceto vírgula e ponto
            let valor = this.value.replace(/[^0-9.,]/g, '');
            
            // Se houve remoção de caracteres, mostra alerta
            if (valorOriginal !== valor) {
                showAlert('Este campo aceita apenas números!', 'warning');
            }
            
            this.value = valor;
        });
    }
    
    // Auto-resize para o campo de observações
    const observacoesInput = document.getElementById('observacoesInput');
    if (observacoesInput) {
        observacoesInput.addEventListener('input', function() {
            // Reset height to auto to get the correct scrollHeight
            this.style.height = 'auto';
            // Set height based on scroll height
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

// Função para mostrar erro em input específico
function mostrarErroInput(input, mensagem) {
    input.classList.add('is-invalid');
    
    // Remove erro anterior
    const errorId = input.id + 'Error';
    const errorDiv = document.getElementById(errorId);
    if (errorDiv) errorDiv.remove();
    
    // Adiciona novo erro
    const errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.className = 'invalid-feedback';
    errorElement.textContent = mensagem;
    input.parentNode.appendChild(errorElement);
}

// Função para remover erro de input específico
function removerErroInput(input) {
    input.classList.remove('is-invalid');
    const errorId = input.id + 'Error';
    const errorDiv = document.getElementById(errorId);
    if (errorDiv) errorDiv.remove();
}

// Verifica se há itens no carrinho ao carregar a página
window.addEventListener('load', function() {
    if (cart.length > 0) {
        updateCart();
    }
});
