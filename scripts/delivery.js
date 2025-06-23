document.addEventListener('DOMContentLoaded', () => {
    const btnNovoPedido = document.getElementById('btn-novo-pedido');
    const modalDelivery = document.getElementById('modal-delivery');
    const closeButton = modalDelivery.querySelector('.close-button');
    const formDelivery = document.getElementById('form-delivery');
    const clienteBuscaInput = document.getElementById('cliente-busca');
    const btnBuscarCliente = document.getElementById('btn-buscar-cliente');
    const clienteInfoDiv = document.getElementById('cliente-info');
    const clienteNomeInput = document.getElementById('cliente-nome');
    const clienteTelefoneInput = document.getElementById('cliente-telefone');
    const clienteEnderecoInput = document.getElementById('cliente-endereco');
    const deliveryItemNome = document.getElementById('delivery-item-nome');
    const deliveryItemQuantidade = document.getElementById('delivery-item-quantidade');
    const deliveryItemPreco = document.getElementById('delivery-item-preco');
    const btnAdicionarItemDelivery = document.getElementById('btn-adicionar-item-delivery');
    const listaItensDelivery = document.getElementById('lista-itens-delivery');
    const totalDeliveryValor = document.getElementById('total-delivery-valor');
    const pedidosDeliveryListaContainer = document.getElementById('pedidos-delivery-lista');
    const filtroPedidosInput = document.getElementById('filtro-pedidos');

    const modalDetalhesPedido = document.getElementById('modal-detalhes-pedido');
    const closeButtonDetalhes = modalDetalhesPedido.querySelector('.close-button-detalhes');
    const detalhesPedidoId = document.getElementById('detalhes-pedido-id');
    const detalhesClienteInfo = document.getElementById('detalhes-cliente-info');
    const detalhesListaItens = document.getElementById('detalhes-lista-itens');
    const detalhesTotalValor = document.getElementById('detalhes-total-valor');

    const modalBuscaProduto = document.getElementById('modal-busca-produto');
    const closeButtonBusca = modalBuscaProduto.querySelector('.close-button-busca');
    const buscaProdutoInput = document.getElementById('busca-produto-input');
    const listaProdutosBusca = document.getElementById('lista-produtos-busca');
    const categoryButtonsModal = modalBuscaProduto.querySelectorAll('.category-btn-modal');

    // simulação do banco de dados ate back
    const cardapio = [
        { nome: 'Pizza Margherita', preco: '55.00', categoria: 'pizzas', descricao: 'Molho de tomate fresco, mussarela, manjericão e azeite.' },
        { nome: 'Pizza Calabresa', preco: '58.00', categoria: 'pizzas', descricao: 'Molho, mussarela, calabresa fatiada e cebola.' },
        { nome: 'Pizza Frango com Catupiry', preco: '62.00', categoria: 'pizzas', descricao: 'Frango desfiado, catupiry original e orégano.' },
        { nome: 'Coca-Cola 1L', preco: '10.00', categoria: 'bebidas', descricao: 'Refrigerante Coca-Cola original de 1 litro.' },
        { nome: 'Água Mineral (500ml)', preco: '5.00', categoria: 'bebidas', descricao: 'Água mineral sem gás.' },
        { nome: 'Bolo de Chocolate', preco: '18.00', categoria: 'sobremesas', descricao: 'Fatia generosa de bolo de chocolate com cobertura.' }
    ];

    const clientesCadastrados = [
        { id: 1, nome: 'João Silva', telefone: '9999-1111', endereco: 'Rua A, 123' },
        { id: 2, nome: 'Maria Souza', telefone: '9888-2222', endereco: 'Av. B, 456' },
        { id: 3, nome: 'Pedro Alvares', telefone: '9777-3333', endereco: 'Travessa C, 789' },
    ];

    let pedidosPendentes = [
        { id: '001', cliente: { nome: 'João Silva', endereco: 'Rua A, 123', telefone: '9999-1111' }, total: '58.00', status: 'Em Preparo', itens: [{ nome: 'Pizza Calabresa', quantidade: 1, preco: 58.00 }] },
        { id: '002', cliente: { nome: 'Maria Souza', endereco: 'Av. B, 456', telefone: '9888-2222' }, total: '72.00', status: 'Pronto', itens: [{ nome: 'Pizza Frango com Catupiry', quantidade: 1, preco: 62.00 }, { nome: 'Coca-Cola 1L', quantidade: 1, preco: 10.00 }] },
        { id: '003', cliente: { nome: 'Pedro Alvares', endereco: 'Travessa C, 789', telefone: '9777-3333' }, total: '23.00', status: 'Entregue', itens: [{ nome: 'Bolo de Chocolate', quantidade: 1, preco: 18.00 }, { nome: 'Água Mineral (500ml)', quantidade: 1, preco: 5.00 }] }
    ];
    let pedidoDeliveryAtual = {
        cliente: null,
        itens: []
    };

    function gerarIdPedido() {
        return Math.floor(Math.random() * 900) + 100;
    }

    // ATUALIZADO: Renderiza o card com a nova estrutura compacta
    function renderizarPedidos(pedidosParaRenderizar) {
        pedidosDeliveryListaContainer.innerHTML = ''; // Limpa o container
        if (pedidosParaRenderizar.length === 0) {
            // Adiciona mensagem se não houver pedidos
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Nenhum pedido encontrado.';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = '#777';
            emptyMessage.style.gridColumn = '1 / -1'; // Ocupa toda a largura do grid
            pedidosDeliveryListaContainer.appendChild(emptyMessage);
            return;
        }

        pedidosParaRenderizar.forEach(pedido => {
            const pedidoCard = document.createElement('div');
            pedidoCard.classList.add('pedido-card');
            
            if (pedido.status === 'Entregue') {
                pedidoCard.style.opacity = '0.7';
            }

            let statusClass = '';
            let botoesAcao = '';

            if (pedido.status === 'Em Preparo') {
                statusClass = 'status-em-preparo';
                botoesAcao = `<button class="btn btn-small btn-marcar-pronto" data-id="${pedido.id}">Marcar como Pronto</button>`;
            } else if (pedido.status === 'Pronto') {
                statusClass = 'status-pronto';
                botoesAcao = `<button class="btn btn-small btn-marcar-entregue" data-id="${pedido.id}">Marcar como Entregue</button>`;
            } else if (pedido.status === 'Entregue') {
                statusClass = 'status-entregue';
            }

            pedidoCard.innerHTML = `
                <div class="pedido-card-header">
                    <h4>Pedido #${pedido.id}</h4>
                    <span class="pedido-status-badge ${statusClass}">${pedido.status}</span>
                </div>
                <div class="pedido-card-body">
                    <p><strong>Cliente:</strong> ${pedido.cliente.nome}</p>
                    <p><strong>Total:</strong> R$ ${pedido.total}</p>
                </div>
                <div class="pedido-card-footer">
                    ${botoesAcao}
                    <button class="btn btn-small btn-secondary btn-ver-detalhes" data-id="${pedido.id}">Ver Detalhes</button>
                </div>
            `;
            pedidosDeliveryListaContainer.appendChild(pedidoCard);
        });
    }

    filtroPedidosInput.addEventListener('input', () => {
        const termoBusca = filtroPedidosInput.value.toLowerCase().trim();
        const pedidosFiltrados = pedidosPendentes.filter(pedido =>
            pedido.cliente.nome.toLowerCase().includes(termoBusca) ||
            pedido.id.toLowerCase().includes(termoBusca) ||
            pedido.status.toLowerCase().includes(termoBusca) ||
            pedido.cliente.endereco.toLowerCase().includes(termoBusca)
        );
        renderizarPedidos(pedidosFiltrados);
    });

    btnNovoPedido.addEventListener('click', () => {
        pedidoDeliveryAtual = { cliente: null, itens: [] };
        formDelivery.reset();
        clienteInfoDiv.style.display = 'none';
        listaItensDelivery.innerHTML = '<li style="text-align: center; color: #777;">Nenhum item adicionado.</li>';
        totalDeliveryValor.textContent = '0.00';
        modalDelivery.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        modalDelivery.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    btnBuscarCliente.addEventListener('click', () => {
        const termoBusca = clienteBuscaInput.value.toLowerCase();
        const clienteEncontrado = clientesCadastrados.find(cliente =>
            cliente.nome.toLowerCase().includes(termoBusca) || cliente.telefone.includes(termoBusca)
        );

        if (clienteEncontrado) {
            clienteNomeInput.value = clienteEncontrado.nome;
            clienteTelefoneInput.value = clienteEncontrado.telefone;
            clienteEnderecoInput.value = clienteEncontrado.endereco;
            clienteInfoDiv.style.display = 'block';
            pedidoDeliveryAtual.cliente = clienteEncontrado;
            alert('Cliente encontrado!');
        } else {
            alert('Cliente não encontrado. Por favor, cadastre os dados abaixo.');
            clienteNomeInput.value = '';
            clienteTelefoneInput.value = '';
            clienteEnderecoInput.value = '';
            clienteInfoDiv.style.display = 'block';
            pedidoDeliveryAtual.cliente = null;
        }
    });

    btnAdicionarItemDelivery.addEventListener('click', () => {
        const nome = deliveryItemNome.value.trim();
        const quantidade = parseInt(deliveryItemQuantidade.value);
        const preco = parseFloat(deliveryItemPreco.value);

        if (nome && quantidade > 0 && preco >= 0) {
            pedidoDeliveryAtual.itens.push({ nome, quantidade, preco });
            atualizarListaItensDelivery();
            deliveryItemNome.value = '';
            deliveryItemQuantidade.value = '1';
            deliveryItemPreco.value = '';
            deliveryItemNome.placeholder = 'Clique para buscar um item';
        } else {
            alert('Por favor, preencha os detalhes do item corretamente.');
        }
    });

    function atualizarListaItensDelivery() {
        listaItensDelivery.innerHTML = '';
        let total = 0;

        if (pedidoDeliveryAtual.itens.length > 0) {
            pedidoDeliveryAtual.itens.forEach((item, index) => {
                const li = document.createElement('li');
                const subtotal = item.quantidade * item.preco;
                li.innerHTML = `
                    <span>${item.quantidade}x ${item.nome}</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                    <button class="btn btn-small btn-secondary btn-remover-item-delivery" data-index="${index}">Remover</button>
                `;
                listaItensDelivery.appendChild(li);
                total += subtotal;
            });
        } else {
            listaItensDelivery.innerHTML = '<li style="text-align: center; color: #777;">Nenhum item adicionado.</li>';
        }
        totalDeliveryValor.textContent = total.toFixed(2);
    }

    listaItensDelivery.addEventListener('click', (event) => {
        const btnRemover = event.target.closest('.btn-remover-item-delivery');
        if (btnRemover) {
            const itemIndex = parseInt(btnRemover.dataset.index);
            pedidoDeliveryAtual.itens.splice(itemIndex, 1);
            atualizarListaItensDelivery();
        }
    });

    formDelivery.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!pedidoDeliveryAtual.cliente) {
            if (clienteNomeInput.value.trim() && clienteTelefoneInput.value.trim() && clienteEnderecoInput.value.trim()) {
                pedidoDeliveryAtual.cliente = {
                    nome: clienteNomeInput.value.trim(),
                    telefone: clienteTelefoneInput.value.trim(),
                    endereco: clienteEnderecoInput.value.trim()
                };
                const clienteExistente = clientesCadastrados.find(c => c.telefone === pedidoDeliveryAtual.cliente.telefone);
                if (!clienteExistente) {
                    clientesCadastrados.push({ id: clientesCadastrados.length + 1, ...pedidoDeliveryAtual.cliente });
                }
            } else {
                alert('Por favor, preencha as informações do cliente para registrar o pedido.');
                return;
            }
        }

        if (pedidoDeliveryAtual.itens.length === 0) {
            alert('Adicione pelo menos um item ao pedido de delivery.');
            return;
        }

        const novoPedido = {
            id: gerarIdPedido().toString(),
            cliente: pedidoDeliveryAtual.cliente,
            total: totalDeliveryValor.textContent,
            status: 'Em Preparo',
            itens: JSON.parse(JSON.stringify(pedidoDeliveryAtual.itens))
        };

        pedidosPendentes.unshift(novoPedido);
        renderizarPedidos(pedidosPendentes);
        alert('Pedido de Delivery Registrado com Sucesso!');
        modalDelivery.style.display = 'none';
    });

    pedidosDeliveryListaContainer.addEventListener('click', (event) => {
        const button = event.target;
        const pedidoId = button.dataset.id;
        if (!pedidoId) return;

        const pedidoIndex = pedidosPendentes.findIndex(p => p.id === pedidoId);
        if (pedidoIndex === -1) return;

        if (button.classList.contains('btn-marcar-pronto')) {
            pedidosPendentes[pedidoIndex].status = 'Pronto';
        } else if (button.classList.contains('btn-marcar-entregue')) {
            pedidosPendentes[pedidoIndex].status = 'Entregue';
        } else if (button.classList.contains('btn-ver-detalhes')) {
            abrirModalDetalhes(pedidosPendentes[pedidoIndex]);
            return; // Não re-renderizar a lista inteira ao só ver detalhes
        } else {
            return; // Sair se não for um botão de ação conhecido
        }
        
        renderizarPedidos(pedidosPendentes);
    });

    function abrirModalDetalhes(pedido) {
        detalhesPedidoId.textContent = `#${pedido.id}`;
        detalhesClienteInfo.innerHTML = `
            <p><strong>Cliente:</strong> ${pedido.cliente.nome}</p>
            <p><strong>Telefone:</strong> ${pedido.cliente.telefone}</p>
            <p><strong>Endereço:</strong> ${pedido.cliente.endereco}</p>
        `;
        detalhesListaItens.innerHTML = '';
        if (pedido.itens && pedido.itens.length > 0) {
            pedido.itens.forEach(item => {
                const li = document.createElement('li');
                const subtotal = item.quantidade * item.preco;
                li.innerHTML = `
                    <span>${item.quantidade}x ${item.nome}</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                `;
                detalhesListaItens.appendChild(li);
            });
        } else {
            detalhesListaItens.innerHTML = '<li>Nenhum item neste pedido.</li>';
        }
        detalhesTotalValor.textContent = pedido.total;
        modalDetalhesPedido.style.display = 'flex';
    }

    closeButtonDetalhes.addEventListener('click', () => {
        modalDetalhesPedido.style.display = 'none';
    });

    function renderizarProdutosBusca(filtro = '', categoria = 'all') {
        listaProdutosBusca.innerHTML = '';
        const produtosFiltrados = cardapio.filter(produto =>
            produto.nome.toLowerCase().includes(filtro.toLowerCase()) &&
            (categoria === 'all' || produto.categoria === categoria)
        );

        if (produtosFiltrados.length === 0) {
            listaProdutosBusca.innerHTML = '<p style="text-align: center; color: #777;">Nenhum produto encontrado.</p>';
            return;
        }

        produtosFiltrados.forEach(produto => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('menu-item');
            itemDiv.innerHTML = `
                <div class="item-info">
                    <h3>${produto.nome}</h3>
                    <div class="item-price">R$ ${parseFloat(produto.preco).toFixed(2)}</div>
                </div>
            `;
            itemDiv.addEventListener('click', () => {
                deliveryItemNome.value = produto.nome;
                deliveryItemPreco.value = parseFloat(produto.preco).toFixed(2);
                modalBuscaProduto.style.display = 'none';
            });
            listaProdutosBusca.appendChild(itemDiv);
        });
    }

    deliveryItemNome.addEventListener('click', () => {
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

    renderizarPedidos(pedidosPendentes);
});