document.addEventListener('DOMContentLoaded', () => {
    // ATUALIZADO: Seleciona os novos grids separados
    const mesasDisponiveisGrid = document.getElementById('mesas-disponiveis-grid');
    const mesasOcupadasGrid = document.getElementById('mesas-ocupadas-grid');

    const modalPedido = document.getElementById('modal-pedido');
    const closeButton = modalPedido.querySelector('.close-button');
    const mesaNumeroSpan = document.getElementById('mesa-numero');
    const formPedido = document.getElementById('form-pedido');
    const listaItensPedido = document.getElementById('lista-itens-pedido');
    const totalPedidoValor = document.getElementById('total-pedido-valor');
    const btnFinalizarPedido = modalPedido.querySelector('.btn-finalizar');
    const itemNomeInput = document.getElementById('item-nome');
    const itemPrecoInput = document.getElementById('item-preco');

    const modalBuscaProduto = document.getElementById('modal-busca-produto');
    const closeButtonBusca = modalBuscaProduto.querySelector('.close-button-busca');
    const buscaProdutoInput = document.getElementById('busca-produto-input');
    const listaProdutosBusca = document.getElementById('lista-produtos-busca');
    const categoryButtonsModal = modalBuscaProduto.querySelectorAll('.category-btn-modal');

    //cardapio improvisado ate vincular
    const cardapio = [
        { nome: 'Pizza Margherita', preco: '55.00', categoria: 'pizzas', descricao: 'Molho de tomate fresco, mussarela, manjericão e azeite.' },
        { nome: 'Pizza Calabresa', preco: '58.00', categoria: 'pizzas', descricao: 'Molho, mussarela, calabresa fatiada e cebola.' },
        { nome: 'Pizza Frango com Catupiry', preco: '62.00', categoria: 'pizzas', descricao: 'Frango desfiado, catupiry original e orégano.' },
        { nome: 'Coca-Cola 1L', preco: '10.00', categoria: 'bebidas', descricao: 'Refrigerante Coca-Cola original de 1 litro.' },
        { nome: 'Água Mineral (500ml)', preco: '5.00', categoria: 'bebidas', descricao: 'Água mineral sem gás.' },
        { nome: 'Bolo de Chocolate', preco: '18.00', categoria: 'sobremesas', descricao: 'Fatia generosa de bolo de chocolate com cobertura.' }
    ];

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
            <p class="mesa-valor-total"></p>
            <button class="btn btn-small btn-abrir-pedido">Abrir Pedido</button>
        `;
        // ATUALIZADO: Todas as mesas começam na seção de disponíveis
        mesasDisponiveisGrid.appendChild(mesaCard);

        pedidosMesas[i] = {
            itens: [],
            status: 'disponivel'
        };
    }

    // O event listener agora funciona para ambos os grids
    document.querySelector('.content').addEventListener('click', (event) => {
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
            pedidosMesas[mesaAtualId].status = 'ocupada';
            
            atualizarListaItensNoModal();
            formPedido.reset();
            itemNomeInput.placeholder = 'Clique para buscar um item';

            atualizarStatusMesaVisual(mesaAtualId, 'ocupada');
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
            } else {
                atualizarStatusMesaVisual(mesaAtualId, 'ocupada');
            }
        }
    });

    btnFinalizarPedido.addEventListener('click', () => {
        if (pedidosMesas[mesaAtualId] && pedidosMesas[mesaAtualId].itens.length > 0) {
            const confirmacao = confirm(`Confirmar finalização do pedido da Mesa ${mesaAtualId} no valor de R$ ${totalPedidoValor.textContent}? Esta ação irá liberar a mesa.`);

            if (confirmacao) {
                pedidosMesas[mesaAtualId] = { itens: [], status: 'disponivel' };
                atualizarStatusMesaVisual(mesaAtualId, 'disponivel');
                modalPedido.style.display = 'none';
            }
        } else {
            alert('Não há itens no pedido para finalizar.');
        }
    });

    function calcularTotalMesa(mesaId) {
        if (!pedidosMesas[mesaId] || pedidosMesas[mesaId].itens.length === 0) {
            return 0;
        }
        return pedidosMesas[mesaId].itens.reduce((total, item) => total + (item.quantidade * item.preco), 0);
    }
    
    // ATUALIZADO: Agora também move o card entre os grids
    function atualizarStatusMesaVisual(mesaId, status) {
        const mesaCard = document.querySelector(`.mesa-card[data-mesa="${mesaId}"]`);
        if (mesaCard) {
            const statusTextSpan = mesaCard.querySelector('.status-text');
            const btnAbrirPedido = mesaCard.querySelector('.btn-abrir-pedido');
            const valorTotalP = mesaCard.querySelector('.mesa-valor-total');

            mesaCard.classList.remove('disponivel', 'ocupada');
            mesaCard.classList.add(status);

            if (status === 'disponivel') {
                statusTextSpan.textContent = 'Disponível';
                btnAbrirPedido.textContent = 'Abrir Pedido';
                valorTotalP.textContent = '';
                mesasDisponiveisGrid.appendChild(mesaCard); // Move para o grid de disponíveis
            } else if (status === 'ocupada') {
                statusTextSpan.textContent = 'Ocupada';
                btnAbrirPedido.textContent = 'Ver Pedido';
                const total = calcularTotalMesa(mesaId);
                valorTotalP.textContent = `R$ ${total.toFixed(2)}`;
                mesasOcupadasGrid.appendChild(mesaCard); // Move para o grid de ocupadas
            }
        }
    }

    // --- Lógica do Modal de Busca de Produto (inalterada) ---
    function renderizarProdutosBusca(filtro = '', categoria = 'all') {
        listaProdutosBusca.innerHTML = '';
        const produtosFiltrados = cardapio.filter(produto => {
            const correspondeFiltro = produto.nome.toLowerCase().includes(filtro.toLowerCase());
            const correspondeCategoria = (categoria === 'all' || produto.categoria === categoria);
            return correspondeFiltro && correspondeCategoria;
        });

        if (produtosFiltrados.length === 0) {
            listaProdutosBusca.innerHTML = '<p style="text-align: center; color: #777;">Nenhum produto encontrado.</p>';
            return;
        }

        produtosFiltrados.forEach(produto => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('menu-item');
            itemDiv.dataset.category = produto.categoria;
            itemDiv.dataset.nome = produto.nome;
            itemDiv.dataset.preco = produto.preco;
            itemDiv.innerHTML = `
                <div class="item-info">
                    <h3>${produto.nome}</h3>
                    <p class="item-description">${produto.descricao}</p>
                    <div class="item-price">R$ ${parseFloat(produto.preco).toFixed(2)}</div>
                </div>
            `;
            listaProdutosBusca.appendChild(itemDiv);
        });
    }

    itemNomeInput.addEventListener('click', () => {
        renderizarProdutosBusca();
        modalBuscaProduto.style.display = 'flex';
    });

    closeButtonBusca.addEventListener('click', () => {
        modalBuscaProduto.style.display = 'none';
    });

    buscaProdutoInput.addEventListener('input', () => {
        const categoriaAtiva = modalBuscaProduto.querySelector('.category-btn-modal.active').dataset.category;
        renderizarProdutosBusca(buscaProdutoInput.value, categoriaAtiva);
    });

    categoryButtonsModal.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtonsModal.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const selectedCategory = button.dataset.category;
            renderizarProdutosBusca(buscaProdutoInput.value, selectedCategory);
        });
    });

    listaProdutosBusca.addEventListener('click', (event) => {
        const itemSelecionado = event.target.closest('.menu-item');
        if (itemSelecionado) {
            const nome = itemSelecionado.dataset.nome;
            const preco = itemSelecionado.dataset.preco;

            itemNomeInput.value = nome;
            itemPrecoInput.value = parseFloat(preco).toFixed(2);

            modalBuscaProduto.style.display = 'none';
        }
    });
});