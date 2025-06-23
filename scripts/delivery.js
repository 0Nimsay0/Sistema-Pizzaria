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
    const pedidosDeliveryListaContainer = document.getElementById('pedidos-delivery-lista'); // Contêiner dos pedidos
    const filtroPedidosInput = document.getElementById('filtro-pedidos'); // Novo input de filtro

    // Simulação de um "banco de dados" de clientes
    const clientesCadastrados = [
        { id: 1, nome: 'João Silva', telefone: '9999-1111', endereco: 'Rua A, 123' },
        { id: 2, nome: 'Maria Souza', telefone: '9888-2222', endereco: 'Av. B, 456' },
        { id: 3, nome: 'Pedro Alvares', telefone: '9777-3333', endereco: 'Travessa C, 789' },
    ];

    // Array para armazenar os pedidos pendentes
    let pedidosPendentes = [
        { id: '001', cliente: { nome: 'João Silva', endereco: 'Rua A, 123' }, total: '45.00', status: 'Em Preparação' },
        { id: '002', cliente: { nome: 'Maria Souza', endereco: 'Av. B, 456' }, total: '60.50', status: 'Aguardando' },
        { id: '003', cliente: { nome: 'Pedro Alvares', endereco: 'Travessa C, 789' }, total: '25.00', status: 'Aguardando' }
    ];
    let pedidoDeliveryAtual = {
        cliente: null, 
        itens: []
    };

    // --- Funções de Geração e Atualização de Pedidos ---

    function gerarIdPedido() {
        return Math.floor(Math.random() * 900) + 100; // Gera um número entre 100 e 999
    }

    function renderizarPedidos(pedidosParaRenderizar) {
        pedidosDeliveryListaContainer.innerHTML = '<h3>Pedidos Pendentes:</h3>'; // Limpa e adiciona o título
        if (pedidosParaRenderizar.length === 0) {
            pedidosDeliveryListaContainer.innerHTML += '<p style="text-align: center; color: #777;">Nenhum pedido encontrado.</p>';
            return;
        }

        pedidosParaRenderizar.forEach(pedido => {
            const pedidoCard = document.createElement('div');
            pedidoCard.classList.add('pedido-card');
            // Adicionar uma classe de status para cores diferentes (opcional no CSS)
            if (pedido.status === 'Em Preparação') {
                pedidoCard.classList.add('status-preparacao');
            } else if (pedido.status === 'Aguardando') {
                pedidoCard.classList.add('status-aguardando');
            }

            pedidoCard.innerHTML = `
                <h4>Pedido #${pedido.id}</h4>
                <p><strong>Cliente:</strong> ${pedido.cliente.nome}</p>
                <p><strong>Endereço:</strong> ${pedido.cliente.endereco}</p>
                <p><strong>Total:</strong> R$ ${pedido.total}</p>
                <p><strong>Status:</strong> ${pedido.status}</p>
                <button class="btn btn-small btn-status-pronto" data-id="${pedido.id}">Marcar como Pronto</button>
                <button class="btn btn-small btn-secondary btn-ver-detalhes" data-id="${pedido.id}">Ver Detalhes</button>
            `;
            pedidosDeliveryListaContainer.appendChild(pedidoCard);
        });
    }

    // --- Lógica de Filtro de Pedidos ---

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

    // --- Lógica do Modal de Pedidos de Delivery ---

    btnNovoPedido.addEventListener('click', () => {
        pedidoDeliveryAtual = { cliente: null, itens: [] }; // Reseta o pedido
        formDelivery.reset();
        clienteInfoDiv.style.display = 'none'; // Esconde info do cliente
        listaItensDelivery.innerHTML = '<li style="text-align: center; color: #777;">Nenhum item adicionado.</li>';
        totalDeliveryValor.textContent = '0.00';
        modalDelivery.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        modalDelivery.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modalDelivery) {
            modalDelivery.style.display = 'none';
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
            clienteNomeInput.value = ''; // Limpa para novo cadastro
            clienteTelefoneInput.value = '';
            clienteEnderecoInput.value = '';
            clienteInfoDiv.style.display = 'block'; // Mostra para preencher
            pedidoDeliveryAtual.cliente = null; // Garante que não use dados antigos
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

        // Garante que o cliente tem dados preenchidos, mesmo que não seja encontrado na busca
        if (!pedidoDeliveryAtual.cliente) {
            if (clienteNomeInput.value.trim() && clienteTelefoneInput.value.trim() && clienteEnderecoInput.value.trim()) {
                pedidoDeliveryAtual.cliente = {
                    nome: clienteNomeInput.value.trim(),
                    telefone: clienteTelefoneInput.value.trim(),
                    endereco: clienteEnderecoInput.value.trim()
                };
                // Adiciona ao array de clientes cadastrados se for um novo cliente
                const clienteExistente = clientesCadastrados.find(c => c.telefone === pedidoDeliveryAtual.cliente.telefone);
                if (!clienteExistente) {
                    clientesCadastrados.push({
                        id: clientesCadastrados.length + 1, // Simples ID
                        ...pedidoDeliveryAtual.cliente
                    });
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
            id: gerarIdPedido().toString(), // Gera um ID único
            cliente: {
                nome: pedidoDeliveryAtual.cliente.nome,
                endereco: pedidoDeliveryAtual.cliente.endereco
            },
            total: totalDeliveryValor.textContent,
            status: 'Aguardando' // Status inicial
        };

        pedidosPendentes.push(novoPedido); // Adiciona o novo pedido à lista
        renderizarPedidos(pedidosPendentes); // Re-renderiza a lista completa

        alert('Pedido de Delivery Registrado com Sucesso!');
        modalDelivery.style.display = 'none'; // Fecha o modal
    });

    // --- Lógica de Ação nos Pedidos Pendentes (Marcar como Pronto) ---
    pedidosDeliveryListaContainer.addEventListener('click', (event) => {
        const btnPronto = event.target.closest('.btn-status-pronto');
        if (btnPronto) {
            const pedidoId = btnPronto.dataset.id;
            const pedidoIndex = pedidosPendentes.findIndex(p => p.id === pedidoId);
            if (pedidoIndex > -1) {
                pedidosPendentes[pedidoIndex].status = 'Pronto para Entrega';
                alert(`Pedido #${pedidoId} marcado como "Pronto para Entrega"!`);
                renderizarPedidos(pedidosPendentes); // Atualiza a lista
            }
        }

        const btnVerDetalhes = event.target.closest('.btn-ver-detalhes');
        if(btnVerDetalhes){
            const pedidoId = btnVerDetalhes.dataset.id;
            const pedido = pedidosPendentes.find(p => p.id === pedidoId);
            if(pedido){
                // Aqui você pode criar um modal para exibir os detalhes completos do pedido
                alert(`Detalhes do Pedido #${pedido.id}:\nCliente: ${pedido.cliente.nome}\nEndereço: ${pedido.cliente.endereco}\nTotal: R$ ${pedido.total}\nStatus: ${pedido.status}\nItens: (funcionalidade a ser expandida para mostrar itens específicos)`);
            }
        }
    });

    // Renderiza os pedidos iniciais ao carregar a página
    renderizarPedidos(pedidosPendentes);
});