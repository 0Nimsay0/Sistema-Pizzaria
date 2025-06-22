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

    const clientesCadastrados = [
        { id: 1, nome: 'João Silva', telefone: '9999-1111', endereco: 'Rua A, 123' },
        { id: 2, nome: 'Maria Souza', telefone: '9888-2222', endereco: 'Av. B, 456' },
    ];

    let pedidoDeliveryAtual = {
        cliente: null,
        itens: []
    };

    btnNovoPedido.addEventListener('click', () => {
        pedidoDeliveryAtual = { cliente: null, itens: [] };
        formDelivery.reset();
        clienteInfoDiv.style.display = 'none';
        listaItensDelivery.innerHTML = '<li style="text-align: center; color: #888;">Nenhum item adicionado.</li>';
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
            alert('Cliente não encontrado. Por favor, cadastre os dados.');
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
            listaItensDelivery.innerHTML = '<li style="text-align: center; color: #888;">Nenhum item adicionado.</li>';
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
                clientesCadastrados.push(pedidoDeliveryAtual.cliente);
            } else {
                alert('Por favor, preencha as informações do cliente para registrar o pedido.');
                return;
            }
        }

        if (pedidoDeliveryAtual.itens.length === 0) {
            alert('Adicione pelo menos um item ao pedido de delivery.');
            return;
        }

        console.log('Pedido de Delivery Registrado:', pedidoDeliveryAtual);
        alert('Pedido de Delivery Registrado com Sucesso!');

        const pedidosDeliveryLista = document.querySelector('.pedidos-delivery-lista');
        const novoPedidoCard = document.createElement('div');
        novoPedidoCard.classList.add('pedido-card');
        novoPedidoCard.innerHTML = `
            <h4>Pedido #${Math.floor(Math.random() * 1000) + 100}</h4>
            <p><strong>Cliente:</strong> ${pedidoDeliveryAtual.cliente.nome}</p>
            <p><strong>Endereço:</strong> ${pedidoDeliveryAtual.cliente.endereco}</p>
            <p><strong>Total:</strong> R$ ${totalDeliveryValor.textContent}</p>
            <p><strong>Status:</strong> Novo Pedido</p>
            <button class="btn btn-small">Marcar como Pronto</button>
            <button class="btn btn-small btn-secondary">Ver Detalhes</button>
        `;
        pedidosDeliveryLista.appendChild(novoPedidoCard);

        modalDelivery.style.display = 'none';
    });
});