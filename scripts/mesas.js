document.addEventListener('DOMContentLoaded', () => {
    const mesaGridContainer = document.getElementById('mesa-grid-container');
    const modalPedido = document.getElementById('modal-pedido');
    const closeButton = modalPedido.querySelector('.close-button');
    const mesaNumeroSpan = document.getElementById('mesa-numero');
    const formPedido = document.getElementById('form-pedido');
    const listaItensPedido = document.getElementById('lista-itens-pedido');
    const totalPedidoValor = document.getElementById('total-pedido-valor');
    const btnFinalizarPedido = modalPedido.querySelector('.btn-finalizar');

    let pedidosMesas = {};
    let mesaAtualId = null;

    const totalMesas = 98;
    for (let i = 1; i <= totalMesas; i++) {
        const mesaCard = document.createElement('div');
        mesaCard.classList.add('mesa-card');
        mesaCard.classList.add('disponivel');
        mesaCard.dataset.mesa = i;

        mesaCard.innerHTML = `
            <h3>Mesa ${i}</h3>
            <p><span class="status-text">Disponível</span></p>
            <button class="btn btn-small btn-abrir-pedido">Abrir Pedido</button>
        `;
        mesaGridContainer.appendChild(mesaCard);

        pedidosMesas[i] = {
            itens: [],
            status: 'disponivel'
        };
    }

    mesaGridContainer.addEventListener('click', (event) => {
        const btn = event.target.closest('.btn-abrir-pedido');
        if (btn) {
            const mesaCard = btn.closest('.mesa-card');
            mesaAtualId = parseInt(mesaCard.dataset.mesa);

            mesaNumeroSpan.textContent = mesaAtualId;
            
            atualizarListaItensNoModal();
            
            modalPedido.style.display = 'flex';
        }
    });

    closeButton.addEventListener('click', () => {
        modalPedido.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modalPedido) {
            modalPedido.style.display = 'none';
        }
    });

    formPedido.addEventListener('submit', (event) => {
        event.preventDefault();
        const nome = document.getElementById('item-nome').value.trim();
        const quantidade = parseInt(document.getElementById('item-quantidade').value);
        const preco = parseFloat(document.getElementById('item-preco').value);

        if (nome && quantidade > 0 && preco >= 0) {
            const item = { nome, quantidade, preco };
            pedidosMesas[mesaAtualId].itens.push(item);
            
            atualizarListaItensNoModal();
            formPedido.reset();

            if (pedidosMesas[mesaAtualId].status === 'disponivel') {
                pedidosMesas[mesaAtualId].status = 'ocupada';
                atualizarStatusMesaVisual(mesaAtualId, 'ocupada');
            }
        } else {
            alert('Por favor, preencha todos os campos do item corretamente.');
        }
    });

    function atualizarListaItensNoModal() {
        listaItensPedido.innerHTML = '';
        let total = 0;
        
        const pedido = pedidosMesas[mesaAtualId];
        
        if (pedido && pedido.itens.length > 0) {
            pedido.itens.forEach((item, index) => {
                const li = document.createElement('li');
                const subtotal = item.quantidade * item.preco;
                li.innerHTML = `
                    <span>${item.quantidade}x ${item.nome}</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                    <button class="btn btn-small btn-secondary btn-remover-item" data-index="${index}">Remover</button>
                `;
                listaItensPedido.appendChild(li);
                total += subtotal;
            });
        } else {
            listaItensPedido.innerHTML = '<li style="text-align: center; color: #888;">Nenhum item adicionado.</li>';
        }
        totalPedidoValor.textContent = total.toFixed(2);
    }

    listaItensPedido.addEventListener('click', (event) => {
        const btnRemover = event.target.closest('.btn-remover-item');
        if (btnRemover) {
            const itemIndex = parseInt(btnRemover.dataset.index);
            pedidosMesas[mesaAtualId].itens.splice(itemIndex, 1);
            atualizarListaItensNoModal();

            if (pedidosMesas[mesaAtualId].itens.length === 0) {
                pedidosMesas[mesaAtualId].status = 'disponivel';
                atualizarStatusMesaVisual(mesaAtualId, 'disponivel');
            }
        }
    });

    btnFinalizarPedido.addEventListener('click', () => {
        if (pedidosMesas[mesaAtualId].itens.length > 0) {
            const confirmacao = confirm(`Confirmar finalização do pedido da Mesa ${mesaAtualId} no valor de R$ ${totalPedidoValor.textContent}? Esta ação irá liberar a mesa.`);
            
            if (confirmacao) {
                console.log(`Pedido da Mesa ${mesaAtualId} finalizado e pago.`);
                console.log('Itens do pedido:', pedidosMesas[mesaAtualId].itens);
                console.log('Total:', totalPedidoValor.textContent);

                pedidosMesas[mesaAtualId] = { itens: [], status: 'disponivel' };
                atualizarStatusMesaVisual(mesaAtualId, 'disponivel');
                
                modalPedido.style.display = 'none';
            }
        } else {
            alert('Não há itens no pedido para finalizar.');
        }
    });

    function atualizarStatusMesaVisual(mesaId, status) {
        const mesaCard = document.querySelector(`.mesa-card[data-mesa="${mesaId}"]`);
        if (mesaCard) {
            const statusTextSpan = mesaCard.querySelector('.status-text');
            const btnAbrirPedido = mesaCard.querySelector('.btn-abrir-pedido');

            mesaCard.classList.remove('disponivel', 'ocupada');
            mesaCard.classList.add(status);

            if (status === 'disponivel') {
                statusTextSpan.textContent = 'Disponível';
                btnAbrirPedido.textContent = 'Abrir Pedido';
            } else if (status === 'ocupada') {
                statusTextSpan.textContent = 'Ocupada';
                btnAbrirPedido.textContent = 'Ver Pedido';
            }
        }
    }
});